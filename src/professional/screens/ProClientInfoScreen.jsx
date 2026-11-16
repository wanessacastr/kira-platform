// Informações do cliente de um atendimento (somente leitura) · API: kira-backend (agendamentos do estúdio)
import { User } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { statusOf } from "../../shared/data/appointments";
import { useBack } from "../../shared/hooks/useBack";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { useBusinessAppointments } from "../hooks/useBusinessData";

export default function ProClientInfoScreen() {
  const { selectedAppointmentId } = useScheduling();
  const { setScreen } = useSession();
  const back = useBack("proHome");
  const appointments = useBusinessAppointments();
  const a = appointments.data?.find((x) => x.id === selectedAppointmentId);
  if (!a) {
    return (
      <ScreenFrame onBack={back} title="Cliente">
        {appointments.isLoading ? (
          <SkeletonLoading count={2} />
        ) : (
          <ErrorState
            onRetry={appointments.isError ? appointments.refetch : () => setScreen("proHome")}
            message={
              appointments.isError
                ? errorMessage(appointments.error, "Não foi possível carregar o atendimento.")
                : "Atendimento não encontrado."
            }
          />
        )}
      </ScreenFrame>
    );
  }
  const status = statusOf(a);
  const rows = [
    ["Serviço", a.service],
    ["Data", a.start.toLocaleDateString("pt-BR")],
    ["Horário", a.time],
    ["Duração", a.durationMinutes ? `${a.durationMinutes} min` : ""],
    ["Profissional", a.staffName],
    ["Pagamento", a.payment],
    ["Observações da cliente", a.notes],
  ].filter(([, value]) => value);
  return (
    <ScreenFrame onBack={back} title="Cliente" subtitle="Informações do atendimento agendado.">
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-14)", marginBottom: "var(--space-18)" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "var(--radius-2xl)",
            background: colors.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <User size={26} color={colors.mutedForeground} aria-hidden="true" />
        </div>
        <p
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-lg)",
            color: colors.foreground,
            margin: 0,
          }}
        >
          {a.clientName}
        </p>
      </div>
      <dl
        style={{
          margin: 0,
          padding: "var(--space-16)",
          borderRadius: "var(--radius-2xl)",
          border: `1px solid ${colors.border}`,
          background: colors.card,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-10)",
        }}
      >
        {rows.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-12)" }}>
            <dt style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              {label}
            </dt>
            <dd
              style={{
                margin: 0,
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 600,
                color: colors.foreground,
                textAlign: "right",
              }}
            >
              {value}
            </dd>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "var(--space-8)",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <dt style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
            Status
          </dt>
          <dd
            style={{
              margin: 0,
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: 700,
              color: status.color,
            }}
          >
            {status.label}
          </dd>
        </div>
      </dl>
    </ScreenFrame>
  );
}
