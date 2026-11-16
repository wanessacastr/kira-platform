// Pagamento (demonstração): ao fim, confirma o agendamento · API: kira-backend (POST /api/agendamentos); nenhum pagamento real acontece
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { DemoBanner } from "../../shared/components/demo";
import { Chip } from "../../shared/components/primitives";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { api, errorMessage } from "../../shared/api";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

const STATES = [
  {
    id: "waiting",
    chip: "Aguardando",
    Icon: Clock,
    title: "Aguardando o pagamento",
    text: "Exemplo do estado em que o Kira espera a confirmação do pagamento.",
  },
  {
    id: "processing",
    chip: "Processando",
    Icon: Loader2,
    title: "Processando o pagamento",
    text: "Exemplo do estado de conferência do pagamento.",
  },
  {
    id: "result",
    chip: "Resultado",
    Icon: CheckCircle2,
    title: "Resultado demonstrativo",
    text: "Nenhum pagamento foi realizado. Este é só o layout do resultado.",
  },
];

export default function ClientPaymentProcessingScreen() {
  const { setScreen } = useSession();
  const { selectedProId, selectedServiceId, selectedStaffId, selectedDate, scheduleTime, setBookedSlot } =
    useScheduling();
  const queryClient = useQueryClient();
  // Com o gateway, isto passa a rodar quando o backend confirmar o pagamento (webhook)
  const book = useMutation({
    mutationFn: () => {
      const [h, m] = scheduleTime.split(":").map(Number);
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h, m);
      return api.appointments.create({
        proId: selectedProId,
        serviceId: selectedServiceId,
        staffId: selectedStaffId,
        start,
      });
    },
    onSuccess: () => {
      setBookedSlot(scheduleTime);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setScreen("clientScheduling");
    },
  });
  const [state, setState] = useState("waiting");
  const current = STATES.find((s) => s.id === state);
  const { Icon } = current;
  return (
    <ScreenFrame
      onBack={() => setScreen("clientCheckout")}
      title="Pagamento"
      subtitle="Acompanhe a situação do pagamento."
    >
      <DemoBanner>Demonstração: escolha abaixo o estado que quer visualizar. Nada é processado de verdade.</DemoBanner>
      <div
        role="group"
        aria-label="Estado exibido"
        className="k-hscroll"
        style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-24)" }}
      >
        {STATES.map((s) => (
          <Chip key={s.id} style={{ minHeight: 44 }} active={state === s.id} onClick={() => setState(s.id)}>
            {s.chip}
          </Chip>
        ))}
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "var(--space-12)",
          padding: "var(--space-24) 0",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 72,
            height: 72,
            borderRadius: "var(--radius-round)",
            background: colors.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={32} color={colors.primaryText} className={state === "processing" ? "spin" : undefined} />
        </span>
        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-xl)",
            color: colors.foreground,
            margin: 0,
          }}
        >
          {current.title}
        </h2>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-sm)",
            color: colors.mutedForeground,
            margin: 0,
            maxWidth: 280,
          }}
        >
          {current.text}
        </p>
      </div>
      {book.isError && (
        <p
          role="alert"
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.destructiveText,
            margin: "0 0 var(--space-12)",
          }}
        >
          {errorMessage(book.error, "Não foi possível confirmar o agendamento.")}
        </p>
      )}
      <PrimaryButton disabled={state !== "result" || book.isPending || !scheduleTime} onClick={() => book.mutate()}>
        {book.isPending ? "Confirmando..." : "Confirmar agendamento"}
      </PrimaryButton>
      {state !== "result" && (
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            textAlign: "center",
            margin: "var(--space-8) 0 0",
          }}
        >
          A confirmação vem depois do pagamento. Veja o resultado demonstrativo para continuar.
        </p>
      )}
      <div style={{ height: "var(--space-8)" }} />
      <SecondaryButton onClick={() => setScreen("clientCheckout")}>Voltar ao pagamento</SecondaryButton>
    </ScreenFrame>
  );
}
