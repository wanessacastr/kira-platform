// Testes da conversão entre o formato do kira-backend e o das telas
import { describe, expect, it } from "vitest";
import {
  formatRelativeDay,
  toAppointment,
  toBusinessHours,
  toBusinessHoursRequest,
  toClientRegistration,
  toLocalDateTime,
  toProfessional,
  toProfessionalRegistration,
  toSlotTime,
} from "./mappers";

const studio = {
  id: "s1",
  nome: "Studio Bella",
  descricao: "Cortes e cor",
  endereco: { logradouro: "Av. T-4", numero: "100", bairro: "Setor Bueno", cidade: "Goiânia", estado: "GO" },
  telefone: "62999990000",
  fotoUrl: null,
  tipoEstabelecimento: "AUTONOMA",
  mediaAvaliacoes: 4.666,
};

describe("toProfessional", () => {
  it("usa o menor preço dos serviços ativos e arredonda a nota", () => {
    const pro = toProfessional(studio, [
      { id: "x", nome: "Corte", duracaoMinutos: 45, preco: 80, ativo: true },
      { id: "y", nome: "Escova", duracaoMinutos: 30, preco: "50.00", ativo: true },
      { id: "z", nome: "Antigo", duracaoMinutos: 30, preco: 10, ativo: false },
    ]);
    expect(pro.price).toBe(50);
    expect(pro.rating).toBe(4.7);
    expect(pro.role).toBe("Profissional autônoma");
    expect(pro.services.map((s) => s.name)).toEqual(["Corte", "Escova"]);
    expect(pro.address).toBe("Av. T-4, 100, Setor Bueno, Goiânia - GO");
  });
  it("sem serviços nem avaliações, preço e nota ficam nulos", () => {
    const pro = toProfessional({ ...studio, mediaAvaliacoes: null, endereco: null });
    expect(pro.price).toBeNull();
    expect(pro.rating).toBeNull();
    expect(pro.address).toBe("");
  });
});

describe("toAppointment", () => {
  const now = new Date(2026, 9, 15, 9, 0);
  const base = {
    id: "ag1",
    clienteId: "c1",
    nomeCliente: "Ana",
    empresaId: "s1",
    nomeEmpresa: "Studio Bella",
    servicoId: "x",
    nomeServico: "Corte",
    duracaoMinutos: 45,
    dataHoraInicio: "2026-10-16T14:30:00",
    dataHoraFim: "2026-10-16T15:15:00",
    status: "CONFIRMADO",
    formaPagamento: "PIX",
  };
  it("converte data, hora, status e pagamento", () => {
    const a = toAppointment(base, now);
    expect(a.date).toBe("Amanhã");
    expect(a.time).toBe("14:30");
    expect(a.status).toBe("proximo");
    expect(a.payment).toBe("Pix");
  });
  it("concluído e cancelado vão para as abas certas", () => {
    expect(toAppointment({ ...base, status: "CONCLUIDO" }, now).status).toBe("concluido");
    expect(toAppointment({ ...base, status: "CANCELADO" }, now).status).toBe("cancelado");
  });
});

describe("datas", () => {
  it("formata o dia relativo", () => {
    const now = new Date(2026, 9, 15, 23, 0);
    expect(formatRelativeDay(new Date(2026, 9, 15, 1, 0), now)).toBe("Hoje");
    expect(formatRelativeDay(new Date(2026, 9, 14), now)).toBe("Ontem");
    expect(formatRelativeDay(new Date(2026, 10, 2), now)).toBe("02/11");
  });
  it("envia LocalDateTime sem fuso e lê o horário do slot", () => {
    expect(toLocalDateTime(new Date(2026, 0, 5, 9, 30))).toBe("2026-01-05T09:30:00");
    expect(toSlotTime({ dataHoraInicio: "2026-01-05T09:30:00" })).toBe("09:30");
  });
});

describe("cadastro", () => {
  const address = {
    cep: "74000-000",
    street: "Rua 1",
    number: "10",
    complement: "",
    neighborhood: "Centro",
    city: "Goiânia",
    state: "GO",
  };
  it("monta o cadastro da cliente", () => {
    const body = toClientRegistration({
      ...address,
      name: " Ana Souza ",
      email: "ana@x.com",
      password: "Senha123",
      phone: "(62) 99999-0000",
      cpf: "529.982.247-25",
      birth: "1990-05-01",
      gender: "feminino",
      latitude: null,
      longitude: null,
    });
    expect(body).toMatchObject({
      nome: "Ana Souza",
      telefone: "62999990000",
      cpf: "52998224725",
      genero: "FEMININO",
      dataNascimento: "1990-05-01",
      endereco: { cep: "74000000", logradouro: "Rua 1", complemento: null },
    });
  });
  it("monta o cadastro da profissional com CNPJ como estabelecimento", () => {
    const body = toProfessionalRegistration({
      ...address,
      name: "Studio Bella",
      email: "s@x.com",
      password: "Senha123",
      phone: "62999990000",
      documentType: "cnpj",
      document: "11.222.333/0001-81",
      birth: "",
      specialties: ["Cabelo"],
      services: [{ id: "1", name: "Corte", price: "80", duration: "45" }],
    });
    expect(body).toMatchObject({
      cnpj: "11222333000181",
      cpf: null,
      dataNascimento: null,
      tipoEstabelecimento: "ESTABELECIMENTO",
      servicos: [{ nome: "Corte", preco: "80", duracao: "45" }],
    });
  });
});

describe("horário de funcionamento", () => {
  it("monta a semana a partir da segunda, com os dias ausentes fechados", () => {
    const week = toBusinessHours([
      { id: "d1", diaSemana: "SABADO", horaInicio: "08:00:00", horaFim: "12:00:00" },
      { id: "d2", diaSemana: "SEGUNDA", horaInicio: "09:30:00", horaFim: "18:00:00" },
    ]);
    expect(week.map((d) => d.day)).toEqual(["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"]);
    expect(week[0]).toEqual({ day: "SEGUNDA", open: true, start: "09:30", end: "18:00" });
    expect(week[1]).toEqual({ day: "TERCA", open: false, start: "09:00", end: "18:00" });
    expect(week[5]).toEqual({ day: "SABADO", open: true, start: "08:00", end: "12:00" });
  });

  it("envia só os dias abertos, com segundos no horário", () => {
    const week = toBusinessHours([]).map((d) => (d.day === "QUARTA" ? { ...d, open: true, end: "17:30" } : d));
    expect(toBusinessHoursRequest(week)).toEqual({
      dias: [{ diaSemana: "QUARTA", horaInicio: "09:00:00", horaFim: "17:30:00" }],
    });
  });
});
