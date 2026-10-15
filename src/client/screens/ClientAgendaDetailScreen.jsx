// Detalhe do agendamento, cancelamento e botão de segurança · API: kira-backend (agendamentos) · denúncia: futura POST /api/denuncias
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, XCircle } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { ReportButton } from "../../shared/components/Safety";
import { api, errorMessage } from "../../shared/api";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody } from "../../shared/theme";
import { statusOf } from "../../shared/data/appointments";
import { ProPhoto } from "../components/ProfessionalCards";
import { useMyAppointments, useMyReviews } from "../hooks/useProfessionals";

export default function ClientAgendaDetailScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const queryClient = useQueryClient();
  const appointments = useMyAppointments();
  const reviews = useMyReviews();
  const cancel = useMutation({
    mutationFn: () => api.appointments.cancel(selectedAppointmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
  const appointment = appointments.data?.find((a) => a.id === selectedAppointmentId);
  if (!appointment) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientAgenda")} />
        <div style={{ padding: "0 var(--space-24) var(--space-32)" }}>
          {appointments.isLoading ? (
            <SkeletonLoading count={2} />
          ) : (
            <ErrorState
              onRetry={appointments.isError ? appointments.refetch : () => setScreen("clientAgenda")}
              message={
                appointments.isError
                  ? errorMessage(appointments.error, "Não foi possível carregar o agendamento.")
                  : "Agendamento não encontrado."
              }
            />
          )}
        </div>
      </div>
    );
  }
  const pro = { name: appointment.proName, photo: null };
  const canCancel = appointment.status === "proximo";
  const rated = reviews.data?.some((r) => r.appointmentId === appointment.id) ?? true;
  const status = statusOf(appointment);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientAgenda")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-12)", marginBottom: "var(--space-18)" }}>
          <ProPhoto pro={pro} size={60} radius="var(--radius-2xl)" />
          <div>
            <p
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
                margin: 0,
              }}
            >
              {pro.name}
            </p>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              {appointment.staffName ? `com ${appointment.staffName}` : ""}
            </p>
          </div>
        </div>

        <div
          style={{
            borderRadius: "var(--radius-2xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: "var(--space-16)",
            marginBottom: "var(--space-18)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-10)",
          }}
        >
          {[
            ["Serviço", appointment.service],
            ["Data", appointment.start.toLocaleDateString("pt-BR")],
            ["Horário", appointment.time],
            ["Duração", appointment.durationMinutes ? `${appointment.durationMinutes} min` : ""],
            ["Pagamento", appointment.payment],
            ["Observações", appointment.notes],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 600,
                    color: colors.foreground,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "var(--space-8)",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              Status
            </span>
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 700,
                color: status.color,
              }}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
          <SecondaryButton onClick={() => {}}>
            <MessageCircle size={15} /> Conversar com {pro.name.split(" ")[0]}
          </SecondaryButton>
          {appointment.status === "concluido" && !rated && (
            <PrimaryButton onClick={() => {}}>Avaliar atendimento</PrimaryButton>
          )}
          {cancel.isError && (
            <p
              role="alert"
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.destructiveText,
                margin: 0,
              }}
            >
              {errorMessage(cancel.error, "Não foi possível cancelar agora.")}
            </p>
          )}
          {canCancel && (
            <button
              disabled={cancel.isPending}
              onClick={() => cancel.mutate()}
              style={{
                width: "100%",
                padding: "var(--space-12)",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "transparent",
                color: colors.destructiveText,
                fontWeight: 600,
                fontSize: "var(--font-size-sm)",
                fontFamily: fontBody,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-6)",
              }}
            >
              <XCircle size={15} /> {cancel.isPending ? "Cancelando..." : "Cancelar agendamento"}
            </button>
          )}
          <ReportButton agendamentoId={appointment.id} papel="CLIENTE" />
        </div>
      </div>
    </div>
  );
}
