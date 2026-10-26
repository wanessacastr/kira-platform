// Etapa do processamento do pagamento a partir do estado vindo da API, sem nunca presumir sucesso · API: nenhuma
import { PAYMENT_STATES } from "../../shared/api/bookingContract";

export const PAYMENT_STAGES = {
  AWAITING: "aguardando",
  SENT: "enviado",
  PROCESSING: "processando",
  CONFIRMED: "confirmado",
  FAILED: "falha",
};

/**
 * @param {import("../../shared/api/bookingContract").BookingTracking} booking
 * @param {{ sending?: boolean, retrying?: boolean }} [local] ações em andamento neste aparelho
 */
export function paymentStage(booking, { sending = false, retrying = false } = {}) {
  if (sending) return PAYMENT_STAGES.SENT;
  if (retrying) return PAYMENT_STAGES.AWAITING;
  switch (booking.payment.state) {
    case PAYMENT_STATES.CONFIRMED:
      return PAYMENT_STAGES.CONFIRMED;
    case PAYMENT_STATES.FAILED:
      return PAYMENT_STAGES.FAILED;
    case PAYMENT_STATES.REVIEW:
      return PAYMENT_STAGES.PROCESSING;
    default:
      return PAYMENT_STAGES.AWAITING;
  }
}

// o Pix só deve ser mostrado quando é seguro pagar: nunca durante a conferência nem depois de confirmado
export const canShowPix = (stage) => stage === PAYMENT_STAGES.AWAITING;
export const canRetry = (stage) => stage === PAYMENT_STAGES.FAILED;
export const isPending = (stage) => stage === PAYMENT_STAGES.SENT || stage === PAYMENT_STAGES.PROCESSING;

export const stageContent = {
  [PAYMENT_STAGES.AWAITING]: {
    title: "Aguardando o seu pagamento",
    text: "Pague o Pix e depois toque em “Já fiz o pagamento”.",
  },
  [PAYMENT_STAGES.SENT]: {
    title: "Enviando o seu aviso",
    text: "Só um instante.",
  },
  [PAYMENT_STAGES.PROCESSING]: {
    title: "Estamos confirmando seu pagamento",
    text: "A confirmação pode levar alguns instantes. Não precisa pagar de novo, avisamos aqui assim que terminar.",
  },
  [PAYMENT_STAGES.CONFIRMED]: {
    title: "Pagamento confirmado",
    text: "Recebemos o seu Pix. Agora é só acompanhar o seu agendamento.",
  },
  [PAYMENT_STAGES.FAILED]: {
    title: "Não conseguimos confirmar o pagamento",
    text: "Se você já pagou, não pague de novo: fale com o atendimento. Se ainda não pagou, tente de novo.",
  },
};
