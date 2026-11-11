// Contextos da Kira IA (cliente e profissional): textos, atalhos e escolha pelo tipo de conta autenticada · API: nenhuma

export const CHAT_CONTEXTS = { CLIENT: "client", PROFESSIONAL: "professional" };

// O contexto vem da conta autenticada (accountType da sessão), nunca de um parâmetro livre da tela
export const contextForAccount = (accountType) =>
  accountType === "professional" ? CHAT_CONTEXTS.PROFESSIONAL : CHAT_CONTEXTS.CLIENT;

export const chatContexts = {
  [CHAT_CONTEXTS.CLIENT]: {
    title: "Oi, eu sou a Kira",
    lines: [
      "Sou a nossa inteligência artificial e posso te ajudar a encontrar profissionais, agendar horários e tirar dúvidas.",
    ],
    tagline: "beleza, tecnologia, confiança",
    prompt: "Por onde você quer começar?",
    shortcuts: ["Encontrar um profissional", "Agendar um horário", "Tirar uma dúvida", "Falar com atendente"],
    strip: "Você está falando com a nossa inteligência artificial",
    headerName: "Kira",
    notice: "as respostas são simuladas e nada é agendado por aqui.",
  },
  [CHAT_CONTEXTS.PROFESSIONAL]: {
    title: "Oi! Sou a Kira ✨",
    lines: [
      "Sua assistente profissional!",
      "Estou aqui para ajudar você a aproveitar melhor a plataforma, atrair mais clientes e desenvolver seu negócio.",
      "O que vamos fazer hoje?",
    ],
    tagline: null,
    prompt: null,
    shortcuts: ["Tenho uma dúvida.", "Quero mais clientes.", "Melhorar meu perfil.", "Agendamentos e ganhos."],
    strip: "Kira IA Pro: assistente da sua conta, usa só os seus dados",
    headerName: "Kira Pro",
    notice: "a conversa é simulada, mas os números vêm da sua conta. Nada é alterado sem a sua confirmação.",
  },
};
