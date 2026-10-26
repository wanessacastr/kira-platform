// Estado do acompanhamento do agendamento: carrega, escuta as etapas e avisa o pagamento · api.bookings
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../shared/api";

export function useBookingTracking(id, amount) {
  const [state, setState] = useState({ status: "loading", booking: null });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  // trava envios repetidos antes mesmo do estado de tela atualizar (duplo toque)
  const busy = useRef(false);

  const load = useCallback(() => {
    setState({ status: "loading", booking: null });
    return api.bookings.get(id, { amount }).then(
      (booking) => setState({ status: "ready", booking }),
      () => setState({ status: "error", booking: null }),
    );
  }, [id, amount]);

  useEffect(() => {
    let active = true;
    load();
    const stop = api.bookings.subscribe(id, (booking) => {
      if (active) setState({ status: "ready", booking });
    });
    return () => {
      active = false;
      stop();
    };
  }, [id, load]);

  const reportPayment = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setPaying(true);
    setPayError(false);
    try {
      const booking = await api.bookings.reportPayment(id);
      setState({ status: "ready", booking });
    } catch {
      setPayError(true);
    } finally {
      busy.current = false;
      setPaying(false);
    }
  }, [id]);

  const retryPayment = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setRetrying(true);
    setPayError(false);
    try {
      const booking = await api.bookings.retryPayment(id);
      setState({ status: "ready", booking });
    } catch {
      setPayError(true);
    } finally {
      busy.current = false;
      setRetrying(false);
    }
  }, [id]);

  return { ...state, reload: load, reportPayment, retryPayment, paying, retrying, payError };
}
