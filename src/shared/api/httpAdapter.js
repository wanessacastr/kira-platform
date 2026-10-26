// Adaptador HTTP: cada função chama o kira-backend (e o ViaCEP) e devolve dados no formato das telas · API: kira-backend, ViaCEP
import { ApiError } from "./contract";
import { authStore, request } from "./http";
import {
  toAppointment,
  toBusinessHours,
  toBusinessHoursRequest,
  toClientRegistration,
  toLocalDate,
  toLocalDateTime,
  toProfessional,
  toProfessionalRegistration,
  toReview,
  toSlotTime,
} from "./mappers";
import { onlyDigits } from "../utils/format";

// O backend recebe o id do usuário logado na URL (ex.: /api/agendamentos/cliente/{id})
const currentUserId = () => {
  const id = authStore.get()?.id;
  if (!id) {
    throw new ApiError(
      "sem_id_usuario",
      "Sua sessão não tem o id do usuário. Entre de novo; se continuar, o login do backend precisa devolver o campo id.",
    );
  }
  return id;
};

const listServices = (studioId) => request(`/api/studios/${studioId}/servicos`, { auth: false });

export const httpAdapter = {
  auth: {
    // LoginResponse: { token, refreshToken, tipo, nome, email, id? }
    login: async ({ email, password }) => {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: { email: email.trim(), senha: password },
        auth: false,
      });
      authStore.set({ ...data, id: data.id ?? null });
      return authStore.get();
    },
    registerClient: (form) =>
      request("/api/auth/registro/cliente", { method: "POST", body: toClientRegistration(form), auth: false }),
    registerProfessional: (form) =>
      request("/api/auth/registro/empresa", { method: "POST", body: toProfessionalRegistration(form), auth: false }),
    // A resposta é a mesma exista ou não a conta: o backend não revela quais e-mails estão cadastrados
    requestPasswordReset: (email) =>
      request("/api/auth/recuperar-senha", { method: "POST", body: { email: email.trim() }, auth: false }),
    resetPassword: ({ token, password }) =>
      request("/api/auth/redefinir-senha", {
        method: "POST",
        body: { token: token.trim(), novaSenha: password },
        auth: false,
      }),
    logout: async () => {
      const refreshToken = authStore.get()?.refreshToken;
      authStore.set(null);
      if (refreshToken) {
        await request("/api/auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(() => {});
      }
    },
  },
  professionals: {
    // A listagem de estúdios não traz serviços nem preço: busca os serviços de cada um em paralelo
    list: async () => {
      const studios = await request("/api/studios", { auth: false });
      const services = await Promise.all(studios.map((s) => listServices(s.id).catch(() => [])));
      return studios.map((s, i) => toProfessional(s, services[i]));
    },
    get: async (id) => {
      const [studio, services, reviews] = await Promise.all([
        request(`/api/studios/${id}`, { auth: false }),
        listServices(id),
        request(`/api/studios/${id}/avaliacoes`, { auth: false }),
      ]);
      const pro = toProfessional(studio, services, reviews);
      const clientReviews = reviews.map(toReview).filter((r) => r.author === "CLIENTE");
      return { ...pro, reviewList: clientReviews };
    },
  },
  availability: {
    // Dia sem expediente volta como 400 (regra de negócio): para a tela é só um dia sem horários
    get: async ({ proId, serviceId, date }) => {
      try {
        const slots = await request(`/api/empresas/${proId}/disponibilidade/slots`, {
          query: { servicoId: serviceId, data: toLocalDate(date) },
          auth: false,
        });
        return slots.map(toSlotTime);
      } catch (e) {
        if (e instanceof ApiError && e.code === "REGRA_DE_NEGOCIO") return [];
        throw e;
      }
    },
  },
  appointments: {
    listMine: async () => {
      const list = await request(`/api/agendamentos/cliente/${currentUserId()}`);
      return list.map((a) => toAppointment(a)).sort((a, b) => b.start - a.start);
    },
    listForMyBusiness: async () => {
      const list = await request(`/api/agendamentos/empresa/${currentUserId()}`);
      return list.map((a) => toAppointment(a)).sort((a, b) => a.start - b.start);
    },
    create: async ({ proId, serviceId, start, payment = null, notes = null }) =>
      toAppointment(
        await request(`/api/agendamentos/cliente/${currentUserId()}`, {
          method: "POST",
          body: {
            empresaId: proId,
            servicoId: serviceId,
            dataHoraInicio: toLocalDateTime(start),
            formaPagamento: payment,
            observacoes: notes,
          },
        }),
      ),
    cancel: async (id) => toAppointment(await request(`/api/agendamentos/${id}/cancelar`, { method: "PATCH" })),
    // Ações do estúdio: o backend confere se o atendimento é do estúdio logado
    complete: async (id) => toAppointment(await request(`/api/agendamentos/${id}/concluir`, { method: "PATCH" })),
    cancelAsBusiness: async (id) =>
      toAppointment(await request(`/api/agendamentos/${id}/cancelar/empresa`, { method: "PATCH" })),
  },
  reviews: {
    // Só atendimento concluído e ainda não avaliado (o backend confere e devolve a mensagem)
    create: async ({ appointmentId, rating, text }) =>
      toReview(
        await request("/api/avaliacoes/cliente", {
          method: "POST",
          body: { agendamentoId: appointmentId, nota: rating, comentario: text.trim() || null },
        }),
      ),
    listMine: async () => {
      const list = await request(`/api/avaliacoes/cliente/${currentUserId()}`);
      return list.map(toReview).filter((r) => r.author === "CLIENTE");
    },
    listForMyBusiness: async () => {
      const list = await request(`/api/avaliacoes/empresa/${currentUserId()}`, { auth: false });
      return list.map(toReview).filter((r) => r.author === "CLIENTE");
    },
  },
  services: {
    listForMyBusiness: async () => {
      const id = currentUserId();
      const list = await request(`/api/empresas/${id}/servicos`);
      return list.map((s) => ({ id: s.id, name: s.nome, price: Number(s.preco), active: s.ativo !== false }));
    },
  },
  businessHours: {
    // Dia que não vem na lista está fechado
    getMine: async () => toBusinessHours(await request(`/api/empresas/${currentUserId()}/disponibilidade`)),
    // PUT troca a semana inteira de uma vez
    saveMine: async (week) =>
      toBusinessHours(
        await request(`/api/empresas/${currentUserId()}/disponibilidade`, {
          method: "PUT",
          body: toBusinessHoursRequest(week),
        }),
      ),
  },
  address: {
    // ViaCEP: serviço público de CEP, sem chave
    lookupCep: async (cep) => {
      let data;
      try {
        const res = await fetch(`https://viacep.com.br/ws/${onlyDigits(cep)}/json/`);
        data = await res.json();
      } catch (e) {
        throw new ApiError("cep_indisponivel", "Não foi possível consultar o CEP agora.", 0, e);
      }
      if (data.erro) throw new ApiError("cep_nao_encontrado", "CEP não encontrado.", 404);
      return { street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf };
    },
  },
};
