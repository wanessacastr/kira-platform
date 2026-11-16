// Testes da Kira IA Pro: respostas por contexto, dados reais da conta, histórico separado e permissões · API: nenhuma
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAT_CONTEXTS, chatContexts, contextForAccount } from "../chat/chatContexts";
import { createMockChat, planReply } from "./mockChat";
import { createProChat, planProReply, proChatFor } from "./proChat";

const NOW = new Date(2026, 6, 15, 10, 0); // quarta-feira
const appt = (over) => ({
  id: 1,
  start: new Date(2026, 6, 15, 14, 0),
  rawStatus: "CONCLUIDO",
  status: "concluido",
  service: "Corte",
  price: 100,
  clientId: 1,
  clientName: "Ana",
  ...over,
});
const business = {
  appointments: [
    appt({}),
    appt({ id: 2, clientId: 2, price: 50, service: "Escova" }),
    appt({ id: 3, rawStatus: "PENDENTE", status: "proximo" }),
  ],
  reviews: [{ rating: 5 }, { rating: 4 }],
  services: [{ id: 1, name: "Corte", price: 100 }],
  hours: [{ day: "SEGUNDA", open: true }],
  portfolioCount: 2,
};
const textOf = (plan) =>
  plan.messages
    .filter((m) => m.text)
    .map((m) => m.text)
    .join("\n");
const ask = (input, b = business) => textOf(planProReply(input, { business: b, now: NOW }));

describe("contexto pelo perfil autenticado", () => {
  it("só a conta profissional entra no contexto Pro", () => {
    expect(contextForAccount("professional")).toBe(CHAT_CONTEXTS.PROFESSIONAL);
    expect(contextForAccount("client")).toBe(CHAT_CONTEXTS.CLIENT);
    expect(contextForAccount(null)).toBe(CHAT_CONTEXTS.CLIENT);
    expect(contextForAccount("PROFESSIONAL")).toBe(CHAT_CONTEXTS.CLIENT);
  });
  it("tem os quatro atalhos e a mensagem inicial pedidos", () => {
    const pro = chatContexts[CHAT_CONTEXTS.PROFESSIONAL];
    expect(pro.shortcuts).toEqual([
      "Tenho uma dúvida.",
      "Quero mais clientes.",
      "Melhorar meu perfil.",
      "Agendamentos e ganhos.",
    ]);
    expect(pro.title).toBe("Oi! Sou a Kira ✨");
    expect(pro.lines[0]).toBe("Sua assistente profissional!");
  });
});

describe("planProReply", () => {
  it("gestão usa os dados reais: faturamento e pendências", () => {
    const text = ask("Agendamentos e ganhos.");
    expect(text).toContain("Hoje você tem 3 atendimentos");
    expect(text).toContain("1 solicitação pendente");
    expect(text).toMatch(/semana: R\$\s150,00/);
  });
  it("sem dados carregados, não inventa números", () => {
    expect(ask("Agendamentos e ganhos.", null)).toContain("Ainda não consegui carregar");
  });
  it("análise de crescimento cita a nota real e não inventa visualizações", () => {
    const text = ask("Quero mais clientes.");
    expect(text).toContain("Nota média: 4.5 em 2 avaliações");
    expect(text).toContain("não vou estimar");
  });
  it("perfil gera texto pronto e nada é aplicado sem confirmação", () => {
    expect(ask("Melhorar meu perfil.")).toContain("biografia pronta");
    expect(ask("Quero aplicar")).toContain("nada foi alterado");
  });
  it("dúvidas da plataforma usam regras reais e admitem o que não existe", () => {
    expect(ask("Como recebo pelos meus pagamentos?")).toContain("Pix");
    expect(ask("qual a taxa?")).toContain("não está publicada");
    expect(ask("Canal de Segurança")).toContain("190");
  });
  it("mentoria usa o ticket médio real", () => {
    expect(ask("como subir meu ticket médio?")).toContain("R$");
  });
});

describe("conversas separadas", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  const timing = { load: 1, send: 1, typing: 1, reply: 1, handoff: 1 };

  it("cada conta profissional tem a sua conversa, e a da cliente não se mistura", async () => {
    expect(proChatFor(1)).toBe(proChatFor(1));
    expect(proChatFor(1)).not.toBe(proChatFor(2));
    const pro = createProChat(timing);
    const client = createMockChat(timing);
    pro.setBusiness(business);
    const settle = async (promise) => {
      const done = promise.then((value) => value);
      await vi.advanceTimersByTimeAsync(50);
      return done;
    };
    await settle(pro.send("Agendamentos e ganhos."));
    await vi.advanceTimersByTimeAsync(50);
    expect((await settle(pro.load())).messages.length).toBeGreaterThan(1);
    expect((await settle(client.load())).messages).toHaveLength(0);
    pro.dispose();
    client.dispose();
  });

  it("a Kira da cliente continua com o mesmo planejador", () => {
    const text = planReply("Encontrar um profissional", { agent: "ai" }).messages[0].text;
    expect(text).toContain("profissional bem avaliada");
  });
});
