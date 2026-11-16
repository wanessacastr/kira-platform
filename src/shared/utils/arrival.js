// Confirmação presencial: regras de entrada e mensagens de erro · API: nenhuma (as rotas ficam em api.arrival)
import { ApiError } from "../api/contract";

export const ARRIVAL_CODE_LENGTH = 6;

// Só números, no máximo 6
export const arrivalDigits = (value) =>
  String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, ARRIVAL_CODE_LENGTH);

export const isArrivalCodeComplete = (value) => arrivalDigits(value).length === ARRIVAL_CODE_LENGTH;

const UNAVAILABLE = "Este recurso ainda não está disponível. Tente de novo mais tarde.";
const NETWORK = "Não foi possível falar com o servidor. Confira a conexão e tente novamente.";

// Mensagem de quem valida o código (profissional). O backend diz o motivo em `erro`.
export const validationErrorMessage = (error) => {
  if (!(error instanceof ApiError)) return NETWORK;
  if (error.code === "TOKEN_INVALIDO") return "Código incorreto. Confira com o cliente e tente novamente.";
  if (error.code === "TOKEN_EXPIRADO") return "Este código expirou. Solicite ao cliente um novo código.";
  if (error.code === "TOKEN_JA_UTILIZADO") return "Este código já foi utilizado.";
  if ([404, 405, 501].includes(error.status)) return UNAVAILABLE;
  if (error.status === 0 || error.status >= 500) return NETWORK;
  return error.message || "Não foi possível validar o código agora. Tente novamente.";
};

// Mensagem de quem gera o código (cliente)
export const generationErrorMessage = (error) => {
  if (!(error instanceof ApiError)) return NETWORK;
  if ([404, 405, 501].includes(error.status)) return UNAVAILABLE;
  if (error.status === 0 || error.status >= 500) return NETWORK;
  return error.message || "Não foi possível gerar o código agora. Tente novamente.";
};
