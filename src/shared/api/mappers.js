// Conversão entre o formato do kira-backend e o das telas (e de volta, no cadastro) · funções puras
import { onlyDigits } from "../utils/format";

const pad = (n) => String(n).padStart(2, "0");

// LocalDateTime do backend ("2026-10-15T14:30:00") é horário local, sem fuso
export const parseLocalDateTime = (value) => (value ? new Date(value) : null);
export const toLocalDateTime = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
export const toLocalDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatRelativeDay = (date, now = new Date()) => {
  const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((day(date) - day(now)) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
};

export const paymentLabels = {
  PIX: "Pix",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  DINHEIRO: "Dinheiro",
};

const establishmentLabels = { ESTABELECIMENTO: "Estúdio", AUTONOMA: "Profissional autônoma" };

const statusTab = {
  PENDENTE: "proximo",
  CONFIRMADO: "proximo",
  REAGENDADO: "proximo",
  CONCLUIDO: "concluido",
  CANCELADO: "cancelado",
};

export const toService = (s) => ({
  id: s.id,
  name: s.nome,
  description: s.descricao ?? "",
  durationMinutes: s.duracaoMinutos,
  price: Number(s.preco),
});

export const formatAddress = (e) => {
  if (!e) return "";
  const street = [e.logradouro, e.numero].filter(Boolean).join(", ");
  const city = [e.cidade, e.estado].filter(Boolean).join(" - ");
  return [street, e.bairro, city].filter(Boolean).join(", ");
};

/** @returns {import("./contract").Professional} */
export const toProfessional = (studio, services = [], reviews = null) => {
  const active = services.filter((s) => s.ativo !== false).map(toService);
  const prices = active.map((s) => s.price);
  return {
    id: studio.id,
    name: studio.nome,
    role: establishmentLabels[studio.tipoEstabelecimento] ?? "Profissional",
    description: studio.descricao ?? "",
    photo: studio.fotoUrl || null,
    phone: studio.telefone ?? "",
    address: formatAddress(studio.endereco),
    city: studio.endereco?.cidade ?? "",
    rating: studio.mediaAvaliacoes != null ? Math.round(studio.mediaAvaliacoes * 10) / 10 : null,
    reviews: reviews ? reviews.length : null,
    price: prices.length > 0 ? Math.min(...prices) : null,
    distance: null,
    services: active,
  };
};

/** @returns {import("./contract").Appointment} */
export const toAppointment = (a, now = new Date()) => {
  const start = parseLocalDateTime(a.dataHoraInicio);
  return {
    id: a.id,
    status: statusTab[a.status] ?? "proximo",
    rawStatus: a.status,
    proId: a.empresaId,
    proName: a.nomeEmpresa,
    staffName: a.nomeFuncionaria ?? null,
    clientId: a.clienteId,
    clientName: a.nomeCliente,
    serviceId: a.servicoId,
    service: a.nomeServico,
    durationMinutes: a.duracaoMinutos,
    start,
    end: parseLocalDateTime(a.dataHoraFim),
    date: formatRelativeDay(start, now),
    time: formatTime(start),
    payment: paymentLabels[a.formaPagamento] ?? "",
    notes: a.observacoes ?? "",
  };
};

/** @returns {import("./contract").Review} */
export const toReview = (r) => ({
  id: r.id,
  appointmentId: r.agendamentoId,
  proId: r.empresaId,
  proName: r.nomeEmpresa,
  clientName: r.nomeCliente,
  author: r.tipoAvaliador,
  rating: r.nota,
  text: r.comentario ?? "",
  createdAt: parseLocalDateTime(r.dataCriacao),
});

export const toSlotTime = (slot) => formatTime(parseLocalDateTime(slot.dataHoraInicio));

// ---------- Cadastro: formulário das telas → request do backend ----------

const genderToApi = {
  feminino: "FEMININO",
  masculino: "MASCULINO",
  nao_binario: "NAO_BINARIO",
  prefiro_nao_informar: "PREFIRO_NAO_INFORMAR",
};

const toAddressRequest = (f) => ({
  cep: onlyDigits(f.cep ?? ""),
  logradouro: f.street,
  numero: f.number,
  complemento: f.complement || null,
  bairro: f.neighborhood,
  cidade: f.city,
  estado: f.state,
});

export const toClientRegistration = (f) => ({
  nome: f.name.trim(),
  email: f.email.trim(),
  senha: f.password,
  telefone: onlyDigits(f.phone),
  cpf: onlyDigits(f.cpf),
  dataNascimento: f.birth,
  genero: genderToApi[f.gender],
  endereco: toAddressRequest(f),
  latitude: f.latitude ?? null,
  longitude: f.longitude ?? null,
});

export const toProfessionalRegistration = (f) => {
  const document = onlyDigits(f.document);
  const isCompany = f.documentType === "cnpj";
  return {
    nome: f.name.trim(),
    email: f.email.trim(),
    senha: f.password,
    telefone: onlyDigits(f.phone),
    cnpj: isCompany ? document : null,
    cpf: isCompany ? null : document,
    dataNascimento: f.birth || null,
    endereco: toAddressRequest(f),
    latitude: f.latitude ?? null,
    longitude: f.longitude ?? null,
    especialidades: f.specialties,
    servicos: f.services.map((s) => ({ nome: s.name, preco: s.price, duracao: s.duration })),
    tipoEstabelecimento: isCompany ? "ESTABELECIMENTO" : "AUTONOMA",
  };
};
