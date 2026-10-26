// Testes da etapa de pagamento e do agendamento em pagamento: estados, Pix seguro e sem sucesso presumido · API: nenhuma
import { describe, expect, it } from "vitest";
import { BOOKING_STEPS, PAYMENT_STATES } from "../../shared/api/bookingContract";
import { keyFor, pathFor } from "../../routes";
import { canRetry, canShowPix, isPending, PAYMENT_STAGES, paymentStage, stageContent } from "./paymentStage";
import { resolveBookingTarget } from "./bookingTarget";

const booking = (state) => ({ id: "ag1", step: BOOKING_STEPS.CONFIRMED, payment: { state }, history: [] });

describe("paymentStage", () => {
  it("mapeia cada estado da API para uma etapa", () => {
    expect(paymentStage(booking(PAYMENT_STATES.PENDING))).toBe(PAYMENT_STAGES.AWAITING);
    expect(paymentStage(booking(PAYMENT_STATES.REVIEW))).toBe(PAYMENT_STAGES.PROCESSING);
    expect(paymentStage(booking(PAYMENT_STATES.CONFIRMED))).toBe(PAYMENT_STAGES.CONFIRMED);
    expect(paymentStage(booking(PAYMENT_STATES.FAILED))).toBe(PAYMENT_STAGES.FAILED);
  });

  it("enquanto o aviso é enviado mostra a etapa de envio, nunca sucesso", () => {
    const stage = paymentStage(booking(PAYMENT_STATES.PENDING), { sending: true });
    expect(stage).toBe(PAYMENT_STAGES.SENT);
    expect(isPending(stage)).toBe(true);
  });

  it("só aparece como confirmado quando a API diz confirmado", () => {
    const others = [PAYMENT_STATES.PENDING, PAYMENT_STATES.REVIEW, PAYMENT_STATES.FAILED];
    others.forEach((state) => expect(paymentStage(booking(state))).not.toBe(PAYMENT_STAGES.CONFIRMED));
    expect(paymentStage(booking(PAYMENT_STATES.REVIEW), { sending: true })).not.toBe(PAYMENT_STAGES.CONFIRMED);
  });

  it("o Pix só é mostrado quando é seguro pagar, para não induzir pagamento em duplicidade", () => {
    expect(canShowPix(PAYMENT_STAGES.AWAITING)).toBe(true);
    [PAYMENT_STAGES.SENT, PAYMENT_STAGES.PROCESSING, PAYMENT_STAGES.CONFIRMED, PAYMENT_STAGES.FAILED].forEach((s) =>
      expect(canShowPix(s)).toBe(false),
    );
  });

  it("nova tentativa só existe depois de falha", () => {
    expect(canRetry(PAYMENT_STAGES.FAILED)).toBe(true);
    expect(canRetry(PAYMENT_STAGES.PROCESSING)).toBe(false);
    expect(canRetry(PAYMENT_STAGES.AWAITING)).toBe(false);
  });

  it("a indicação de processamento vale só enquanto a confirmação está pendente", () => {
    expect(isPending(PAYMENT_STAGES.PROCESSING)).toBe(true);
    expect(isPending(PAYMENT_STAGES.CONFIRMED)).toBe(false);
    expect(isPending(PAYMENT_STAGES.FAILED)).toBe(false);
  });

  it("todas as etapas têm título e texto, sem travessão", () => {
    Object.values(PAYMENT_STAGES).forEach((stage) => {
      expect(stageContent[stage].title).toBeTruthy();
      expect(stageContent[stage].text).toBeTruthy();
      expect(JSON.stringify(stageContent[stage])).not.toContain("\u2014");
    });
  });

  it("a mensagem de falha manda falar com o atendimento antes de pagar de novo", () => {
    expect(stageContent[PAYMENT_STAGES.FAILED].text).toMatch(/não pague de novo/);
  });
});

describe("resolveBookingTarget", () => {
  const pro = { id: 1, name: "Ana Paula", role: "Cabeleireira", services: ["Corte"], price: 90 };

  it("usa o agendamento escolhido na agenda", () => {
    const target = resolveBookingTarget({ selectedAppointmentId: "ag1", bookedSlot: null, selectedDate: null, pro });
    expect(target).toMatchObject({ id: "ag1", service: "Corte feminino", price: 80 });
  });

  it("cria um id estável para o recém-agendado, para o pagamento não se perder ao navegar", () => {
    const input = { selectedAppointmentId: null, bookedSlot: "10:30", selectedDate: new Date(2026, 9, 30), pro };
    const a = resolveBookingTarget(input);
    expect(a.id).toBe(resolveBookingTarget(input).id);
    expect(a).toMatchObject({ service: "Corte", price: 90, proName: "Ana Paula" });
    expect(a.when).toContain("10:30");
  });

  it("sem nada escolhido, cai no primeiro agendamento de exemplo", () => {
    const target = resolveBookingTarget({ selectedAppointmentId: null, bookedSlot: null, selectedDate: null, pro });
    expect(target.id).toBe("ag1");
  });
});

describe("rota do pagamento", () => {
  it("a tela de processamento tem rota própria", () => {
    expect(pathFor("clientPaymentProcessing")).toBe("/cliente/agenda/pagamento");
    expect(keyFor("/cliente/agenda/pagamento")).toBe("clientPaymentProcessing");
    expect(keyFor("/cliente/agenda/acompanhar")).toBe("clientBookingTracking");
  });
});
