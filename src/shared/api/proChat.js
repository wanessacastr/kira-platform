// Kira IA Pro: respostas do contexto profissional, calculadas só com os dados da própria conta · mock (conversa) + dados reais (api)
import { AUTHORS, MESSAGE_TYPES } from "./chatContract";
import { createMockChat, defaultTiming } from "./mockChat";
import {
  analyticsSummary,
  averageRating,
  appointmentsOn,
  completed,
  monthlyRevenue,
  serviceRanking,
  weeklyRevenue,
} from "../../professional/utils/metrics";

const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const money = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const sum = (list) => list.reduce((total, item) => total + item.value, 0);

const say = (text) => ({ type: MESSAGE_TYPES.TEXT, author: AUTHORS.AI, text });
const quickReplies = (options) => ({ type: MESSAGE_TYPES.QUICK_REPLIES, author: AUTHORS.AI, options });

const NO_DATA =
  "Ainda não consegui carregar os dados da sua conta. Abra o seu painel, confira a conexão e me pergunte de novo.";
const NO_VIEWS =
  "Visualizações e cliques do seu perfil ainda não estão disponíveis na plataforma, então não vou estimar esses números.";

// Respostas da Suporte Kira: só regras que existem hoje no aplicativo. O que ainda não foi definido é dito como tal.
const SUPPORT = {
  pagamento:
    "Os pagamentos dos clientes são feitos por Pix: o cliente copia o código, avisa que pagou e a equipe da Kira confere. Os valores dos atendimentos concluídos aparecem na sua gestão financeira.",
  taxa: "A regra de taxas ainda não está publicada no aplicativo, então não vou te passar um valor que eu não possa confirmar. O suporte da Kira consegue te informar.",
  avaliacao:
    "Depois do atendimento, o cliente pode avaliar com nota e comentário. A nota média do seu perfil é calculada com todas as avaliações recebidas.",
  cancelamento:
    "Você acompanha pedidos e cancelamentos na sua agenda. A regra de prazo e de cobrança para cancelar ainda não está publicada no aplicativo, então confirme com o suporte antes de prometer algo ao cliente.",
  seguranca:
    "O Canal de Segurança é o caminho para registrar um problema de segurança. Em risco imediato, ligue primeiro para o 190. A denúncia comum é anônima perante a outra parte.",
  cadastro:
    "Seu cadastro tem dados pessoais, endereço, documento, selfie, especialidades, serviços, fotos e termos. Você edita serviços, fotos e horários depois, pelo menu do seu perfil.",
  suporte:
    "O atendimento por pessoa da equipe para profissionais ainda não está disponível por aqui. Em Ajuda e suporte você encontra as perguntas frequentes.",
  recomendacao:
    "A recomendação com inteligência artificial ainda está em definição, então não tenho uma regra confirmada para te explicar.",
};
const SUPPORT_MENU = ["Como recebo pelos meus pagamentos?", "Como funcionam as avaliações?", "Canal de Segurança"];

const supportAnswer = (t) => {
  if (/taxa|comissao|mensalidade/.test(t)) return SUPPORT.taxa;
  if (/pagament|receb|pix|repasse/.test(t)) return SUPPORT.pagamento;
  if (/avalia|nota media/.test(t)) return SUPPORT.avaliacao;
  if (/cancel/.test(t)) return SUPPORT.cancelamento;
  if (/seguranc|denunc|risco|assedio/.test(t)) return SUPPORT.seguranca;
  if (/cadastr|document|selfie/.test(t)) return SUPPORT.cadastro;
  if (/recomenda|inteligencia/.test(t)) return SUPPORT.recomendacao;
  if (/suporte|falar com|atendente|equipe/.test(t)) return SUPPORT.suporte;
  return null;
};

const MENTORING = [
  {
    test: /fideliz|retorn|voltar|recorrente/,
    text: (b) =>
      `Fidelizar custa menos do que conquistar cliente novo. Três ações simples: peça o retorno antes de a cliente sair, lembre quem não volta há mais de 30 dias e agradeça depois do atendimento.${
        b ? `\n\nHoje ${b.retentionRate}% das suas clientes com atendimento concluído voltaram pelo menos uma vez.` : ""
      }`,
  },
  {
    test: /divulg|redes|instagram|marketing|publicidade/,
    text: () =>
      "Para divulgar: poste antes e depois dos seus trabalhos (com autorização da cliente), mostre os bastidores e coloque o seu perfil da Kira na bio. Um bom portfólio converte mais do que qualquer texto.",
  },
  {
    test: /organiz|agenda|encaixe|buraco|janela/,
    text: () =>
      "Para organizar a agenda: agrupe serviços longos no mesmo período, deixe uma folga curta entre eles e concentre os horários livres nos dias de maior procura. Confira seu horário de funcionamento para refletir isso.",
  },
  {
    test: /precific|preco|cobrar|valor/,
    text: (b) =>
      `Para precificar, some o tempo gasto, o custo dos produtos e o valor da sua hora. Reajuste aos poucos e avise com antecedência.${
        b && b.avgTicket ? `\n\nSeu ticket médio hoje é ${money(b.avgTicket)}.` : ""
      }`,
  },
  {
    test: /ticket/,
    text: (b) =>
      `Para subir o ticket médio, ofereça um combo ou um serviço complementar na hora de agendar.${
        b && b.avgTicket
          ? `\n\nSeu ticket médio hoje é ${money(b.avgTicket)}.`
          : " Quando houver atendimentos concluídos, eu mostro o seu."
      }`,
  },
  {
    test: /promo|desconto|cupom|oferta/,
    text: () =>
      "Promoções funcionam melhor com prazo e objetivo claros, por exemplo preencher um horário vazio ou trazer cliente de volta. Evite descontos fixos o ano todo: eles viram o novo preço.",
  },
  {
    test: /estrategia|crescer|negocio|mentoria|dica/,
    text: () =>
      "Uma estratégia simples: 1) perfil completo com bons registros dos trabalhos, 2) agenda aberta nos horários de procura, 3) resposta rápida aos pedidos, 4) clientes satisfeitas avaliando você.",
  },
];

const hoursSummary = (hours) => {
  if (!hours) return null;
  const open = hours.filter((d) => d.open).length;
  return open === 0
    ? "Você não tem nenhum dia aberto na disponibilidade, então ninguém consegue agendar com você."
    : `Você atende em ${plural(open, "dia", "dias")} por semana.`;
};

/** Resumo de gestão: agendamentos, pendências e faturamento, tudo da conta autenticada. */
const managementReply = (b, now) => {
  const today = appointmentsOn(b.appointments, now);
  const pending = b.appointments.filter((a) => a.rawStatus === "PENDENTE");
  const week = sum(weeklyRevenue(b.appointments, now));
  const month = sum(monthlyRevenue(b.appointments, now));
  const done = completed(b.appointments).length;
  const lines = [
    `Hoje você tem ${plural(today.length, "atendimento", "atendimentos")}.`,
    pending.length
      ? `Há ${plural(pending.length, "solicitação pendente", "solicitações pendentes")} esperando a sua resposta.`
      : "Nenhuma solicitação pendente no momento.",
    `Faturamento da semana: ${money(week)}. Do mês: ${money(month)}.`,
    "Contam só atendimentos concluídos, pelo preço do serviço cadastrado.",
  ];
  const top = serviceRanking(b.appointments)[0];
  if (top)
    lines.push(`Serviço mais feito: ${top.service}, ${plural(top.count, "vez", "vezes")} (${money(top.revenue)}).`);
  if (!done) lines.push("Você ainda não tem atendimentos concluídos, por isso os valores estão zerados.");
  return [say(lines.join("\n")), quickReplies(["Quero mais clientes.", "Melhorar meu perfil."])];
};

/** Análise de crescimento: aponta o que os dados mostram e sugere ações práticas, sem inventar métricas. */
const growthReply = (b) => {
  const rating = averageRating(b.reviews);
  const facts = [
    rating === null
      ? "Você ainda não recebeu avaliações."
      : `Nota média: ${rating} em ${plural(b.reviews.length, "avaliação", "avaliações")}.`,
    `Serviços cadastrados: ${b.services.length}.`,
    `Atendimentos concluídos: ${completed(b.appointments).length}.`,
  ];
  if (b.portfolioCount != null) facts.push(`Fotos no portfólio: ${b.portfolioCount}.`);
  const hours = hoursSummary(b.hours);
  if (hours) facts.push(hours);
  const tips = [];
  if (b.hours && b.hours.every((d) => !d.open))
    tips.push("Abra pelo menos alguns dias na disponibilidade: sem isso você não aparece para agendamento.");
  if (b.services.length < 3)
    tips.push("Cadastre mais serviços, com descrição e duração. Perfis com mais opções recebem mais pedidos.");
  if (b.portfolioCount === 0 || (b.portfolioCount != null && b.portfolioCount < 6))
    tips.push("Suba mais fotos de trabalhos. Mire em pelo menos 6, com boa luz.");
  if (rating === null || b.reviews.length < 5)
    tips.push("Peça avaliação às clientes satisfeitas logo após o atendimento.");
  if (rating !== null && rating < 4.5)
    tips.push("Veja os comentários das últimas avaliações e ajuste o ponto que mais se repete.");
  if (!tips.length)
    tips.push(
      "Seu perfil está bem completo. Vale divulgar o link do perfil nas redes e manter a agenda aberta nos horários de procura.",
    );
  return [
    say(`Olhei a sua conta. ${facts.join(" ")}\n\n${NO_VIEWS}`),
    say(`O que eu faria agora:\n${tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}`),
    quickReplies(["Melhorar meu perfil.", "Agendamentos e ganhos."]),
  ];
};

const serviceTitles = (b) =>
  b.services.length
    ? b.services
        .slice(0, 4)
        .map((s) => `• ${s.name}: "${s.name} com acabamento caprichado e atendimento sem pressa"`)
        .join("\n")
    : "• Você ainda não tem serviços cadastrados. Cadastre o primeiro para eu sugerir um título.";

/** Otimização do perfil: gera textos prontos; nada é aplicado sem confirmação explícita. */
const profileReply = (b, t) => {
  if (/aplicar|salvar|confirm|quero usar/.test(t)) {
    return [
      say(
        "Ainda não consigo salvar alterações no seu perfil por aqui, então nada foi alterado. Copie o texto e cole em Meu perfil. Quando eu puder aplicar, vou sempre pedir a sua confirmação antes.",
      ),
    ];
  }
  const names = b.services.slice(0, 3).map((s) => s.name.toLowerCase());
  const rating = averageRating(b.reviews);
  if (/titulo|servico/.test(t)) {
    return [
      say(`Sugestões de títulos para os seus serviços:\n${serviceTitles(b)}\n\nÉ só uma sugestão. Quer usar algum?`),
      quickReplies(["Quero aplicar", "Reescrever minha bio"]),
    ];
  }
  const bio = `Sou profissional da beleza${names.length ? ` e trabalho com ${names.join(", ")}` : ""}. Atendo com cuidado, pontualidade e atenção ao que combina com você.${
    rating !== null && rating >= 4.5 ? ` Clientes me avaliam com nota ${rating}.` : ""
  } Agende o seu horário!`;
  return [
    say(
      `Aqui vai uma biografia pronta para você usar:\n\n"${bio}"\n\nPara o portfólio: priorize fotos de antes e depois, com boa luz, e destaque a sua especialidade nas primeiras imagens.`,
    ),
    quickReplies(["Quero aplicar", "Sugerir títulos de serviços"]),
  ];
};

/**
 * Decide a resposta da Kira IA Pro. Função pura: recebe o que a profissional escreveu e os dados da conta dela.
 * @param {string} input
 * @param {{ business: object | null, now?: Date }} ctx `business` é o resumo da conta autenticada (null enquanto não carrega)
 */
export const planProReply = (input, { business, now = new Date() }) => {
  const t = normalize(input);
  const needsData = (fn) => (business ? fn(business) : [say(NO_DATA)]);

  if (
    /ganho|faturamento|receita|agendamento|pendente|solicitac|desempenho|meus clientes/.test(t) &&
    !/pagament|taxa/.test(t)
  ) {
    return { messages: needsData((b) => managementReply(b, now)) };
  }
  if (/mais clientes|atrair|crescer|conquistar|visualiza|cliques/.test(t)) {
    return { messages: needsData(growthReply) };
  }
  if (/perfil|bio|descri|titulo|portfolio|especialidade/.test(t)) {
    return { messages: needsData((b) => profileReply(b, t)) };
  }
  if (/aplicar|salvar/.test(t)) return { messages: needsData((b) => profileReply(b, t)) };
  const support = supportAnswer(t);
  if (support) return { messages: [say(support), quickReplies(SUPPORT_MENU)] };
  const mentoring = MENTORING.find((m) => m.test.test(t));
  if (mentoring) {
    const summary = business ? analyticsSummary(business.appointments) : null;
    return { messages: [say(mentoring.text(summary))] };
  }
  if (/duvida|ajuda|como/.test(t)) {
    return { messages: [say("Claro! Sobre o que é a sua dúvida?"), quickReplies(SUPPORT_MENU)] };
  }
  return {
    messages: [
      say(
        "Posso ajudar com dúvidas da plataforma, ideias para atrair clientes, o texto do seu perfil e a gestão dos seus agendamentos e ganhos.",
      ),
      quickReplies(["Tenho uma dúvida.", "Quero mais clientes.", "Melhorar meu perfil.", "Agendamentos e ganhos."]),
    ],
  };
};

/**
 * Gateway da Kira IA Pro: mesmo chat da cliente (createMockChat) com o planejador profissional.
 * `setBusiness` recebe o resumo dos dados da conta autenticada, vindo da camada de api.
 */
export function createProChat(timing = defaultTiming) {
  let business = null;
  const chat = createMockChat(timing, { planner: (input, ctx) => planProReply(input, { business, ...ctx }) });
  return { ...chat, setBusiness: (next) => (business = next) };
}

// Uma conversa por profissional autenticada: trocar de conta nunca mostra a conversa de outra
const chats = new Map();
export const proChatFor = (userId) => {
  const key = String(userId ?? "anonima");
  if (!chats.has(key)) chats.set(key, createProChat());
  return chats.get(key);
};
