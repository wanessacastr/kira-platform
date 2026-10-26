// Gateway mock do acompanhamento: etapas que avançam sozinhas e Pix conferido depois do aviso · mock · futuro: API da Kira
import { ApiError } from "./contract";
import { BOOKING_ERRORS, BOOKING_STEPS, PAYMENT_STATES } from "./bookingContract";

const defaultTiming = { latency: 400, step: 6000 };

// etapas que avançam sozinhas depois que o pagamento é confirmado
const AFTER_PAYMENT = [BOOKING_STEPS.READY, BOOKING_STEPS.IN_SERVICE, BOOKING_STEPS.DONE];

/**
 * @param {{ latency: number, step: number }} [timing]
 * @param {{ failFirst?: boolean, amount?: number }} [options] a primeira leitura falha, para exercitar o estado de erro
 * @returns {import("./bookingContract").BookingGateway}
 */
export function createMockBookings(timing = defaultTiming, { failFirst = true, amount = 80 } = {}) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const store = new Map();
  let reads = 0;

  const emit = (entry) => {
    entry.booking = { ...entry.booking, updatedAt: new Date().toISOString() };
    entry.listeners.forEach((listener) => listener(entry.booking));
  };

  const reach = (entry, step) => {
    const at = new Date().toISOString();
    entry.booking = { ...entry.booking, step, history: [...entry.booking.history, { step, at }] };
    emit(entry);
  };

  const advanceAfterPayment = (entry, index = 0) => {
    if (index >= AFTER_PAYMENT.length) return;
    setTimeout(() => {
      reach(entry, AFTER_PAYMENT[index]);
      advanceAfterPayment(entry, index + 1);
    }, timing.step);
  };

  const open = (id, meta) => {
    if (store.has(id)) return store.get(id);
    const now = new Date().toISOString();
    const entry = {
      listeners: new Set(),
      booking: {
        id,
        step: BOOKING_STEPS.RECEIVED,
        payment: {
          method: "pix",
          state: PAYMENT_STATES.PENDING,
          amount: meta?.amount ?? amount,
          // código de exemplo: o real vem do provedor de pagamento
          pixCode: `KIRA-PIX-EXEMPLO-${id}`,
        },
        history: [{ step: BOOKING_STEPS.RECEIVED, at: now }],
        updatedAt: now,
      },
    };
    store.set(id, entry);
    setTimeout(() => reach(entry, BOOKING_STEPS.CONFIRMED), timing.step);
    return entry;
  };

  return {
    get: async (id, meta) => {
      await wait(timing.latency);
      reads += 1;
      if (failFirst && reads === 1) throw new ApiError(BOOKING_ERRORS.UNAVAILABLE);
      return open(id, meta).booking;
    },
    subscribe: (id, onChange) => {
      const entry = open(id);
      entry.listeners.add(onChange);
      return () => entry.listeners.delete(onChange);
    },
    reportPayment: async (id) => {
      await wait(timing.latency);
      const entry = store.get(id);
      if (!entry) throw new ApiError(BOOKING_ERRORS.NOT_FOUND);
      if (entry.booking.payment.state !== PAYMENT_STATES.PENDING) return entry.booking;
      // o aviso do cliente não prova nada: o pagamento fica em conferência até a equipe ou o provedor responder
      entry.booking = { ...entry.booking, payment: { ...entry.booking.payment, state: PAYMENT_STATES.REVIEW } };
      emit(entry);
      return entry.booking;
    },
    retryPayment: async (id) => {
      await wait(timing.latency);
      const entry = store.get(id);
      if (!entry) throw new ApiError(BOOKING_ERRORS.NOT_FOUND);
      if (entry.booking.payment.state !== PAYMENT_STATES.FAILED) throw new ApiError(BOOKING_ERRORS.RETRY_NOT_ALLOWED);
      entry.booking = { ...entry.booking, payment: { ...entry.booking.payment, state: PAYMENT_STATES.PENDING } };
      emit(entry);
      return entry.booking;
    },
    // faz o papel da equipe ou do provedor de pagamento; só o mock tem isso
    dev: {
      resolvePayment: (id, outcome) => {
        const entry = store.get(id);
        if (!entry || entry.booking.payment.state !== PAYMENT_STATES.REVIEW) return;
        const state = outcome === PAYMENT_STATES.CONFIRMED ? PAYMENT_STATES.CONFIRMED : PAYMENT_STATES.FAILED;
        entry.booking = { ...entry.booking, payment: { ...entry.booking.payment, state } };
        if (state === PAYMENT_STATES.CONFIRMED) {
          reach(entry, BOOKING_STEPS.PAYMENT);
          advanceAfterPayment(entry);
        } else emit(entry);
      },
    },
  };
}

export const mockBookings = createMockBookings();
