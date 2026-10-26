// Processando pagamento: Pix, aviso, conferência, confirmação ou falha, só confirma quando a API confirma · mock (api.bookings)
import { MessageCircle } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";
import { PaymentStatusVisual } from "../components/booking/PaymentStatusVisual";
import { PaymentPanel } from "../components/booking/PaymentPanel";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { resolveBookingTarget } from "../booking/bookingTarget";
import { canRetry, canShowPix, PAYMENT_STAGES, paymentStage, stageContent } from "../booking/paymentStage";
import { useBookingTracking } from "../hooks/useBookingTracking";

const money = (value) => `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

const Row = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-12)" }}>
    <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
      {label}
    </span>
    <span
      style={{
        fontFamily: fontBody,
        fontSize: "var(--font-size-xs)",
        fontWeight: 600,
        color: colors.foreground,
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

// só em desenvolvimento: faz o papel da equipe ou do provedor, que no app real é o back-end
const DevResolver = ({ id }) => (
  <div
    style={{
      borderRadius: "var(--radius-2xl)",
      border: `1px dashed ${colors.border}`,
      padding: "var(--space-12)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
    }}
  >
    <p style={{ margin: 0, fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
      Só em desenvolvimento: responder como a equipe da Kira
    </p>
    <SecondaryButton onClick={() => api.bookings.dev?.resolvePayment(id, "confirmado")}>
      Confirmar pagamento
    </SecondaryButton>
    <SecondaryButton onClick={() => api.bookings.dev?.resolvePayment(id, "falha")}>Não confirmar</SecondaryButton>
  </div>
);

export default function ClientPaymentProcessingScreen() {
  const { selectedAppointmentId, bookedSlot, selectedDate, selectedProId } = useScheduling();
  const { setScreen } = useSession();
  const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
  const target = resolveBookingTarget({ selectedAppointmentId, bookedSlot, selectedDate, pro });
  const { status, booking, reload, reportPayment, retryPayment, paying, retrying, payError } = useBookingTracking(
    target.id,
    target.price,
  );
  const stage = booking ? paymentStage(booking, { sending: paying, retrying }) : null;
  const content = stage ? stageContent[stage] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientAgenda")} />
      <div
        style={{
          flex: 1,
          padding: "0 var(--space-24) var(--space-32)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-16)",
        }}
      >
        <div>
          <h1
            style={{ margin: 0, fontFamily: fontDisplay, fontSize: "var(--font-size-2xl)", color: colors.foreground }}
          >
            Processando pagamento
          </h1>
          <p
            style={{
              margin: "var(--space-4) 0 0",
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.mutedForeground,
            }}
          >
            {target.service} com {target.proName} · {target.when}
          </p>
        </div>

        {status === "loading" && <SkeletonLoading count={3} />}
        {status === "error" && <ErrorState message="Não foi possível carregar o pagamento agora." onRetry={reload} />}

        {status === "ready" && (
          <>
            <PaymentStatusVisual stage={stage} />
            <div role="status" aria-live="polite" style={{ textAlign: "center" }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: fontDisplay,
                  fontSize: "var(--font-size-lg)",
                  color: colors.foreground,
                }}
              >
                {content.title}
              </h2>
              <p
                style={{
                  margin: "var(--space-6) 0 0",
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-sm)",
                  color: colors.mutedForeground,
                  lineHeight: 1.45,
                }}
              >
                {content.text}
              </p>
            </div>

            <div
              style={{
                borderRadius: "var(--radius-2xl)",
                border: `1px solid ${colors.border}`,
                background: colors.card,
                padding: "var(--space-16)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-8)",
              }}
            >
              <Row label="Valor" value={money(booking.payment.amount)} />
              <Row label="Forma de pagamento" value="Pix" />
            </div>

            {canShowPix(stage) && (
              <PaymentPanel payment={booking.payment} paying={paying} error={payError} onReport={reportPayment} />
            )}
            {canRetry(stage) && (
              <>
                <PrimaryButton onClick={retryPayment} disabled={retrying}>
                  {retrying ? "Preparando..." : "Tentar de novo"}
                </PrimaryButton>
                {payError && (
                  <p
                    role="alert"
                    style={{
                      margin: 0,
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.primaryText,
                    }}
                  >
                    Não foi possível preparar uma nova tentativa agora. Tente de novo em instantes.
                  </p>
                )}
              </>
            )}
            {stage === PAYMENT_STAGES.CONFIRMED && (
              <PrimaryButton onClick={() => setScreen("clientBookingTracking")}>Acompanhar agendamento</PrimaryButton>
            )}

            {stage !== PAYMENT_STAGES.CONFIRMED && (
              <SecondaryButton onClick={() => setScreen("clientChat")}>
                <MessageCircle size={15} aria-hidden="true" /> Falar com o atendimento
              </SecondaryButton>
            )}
            {import.meta.env.DEV && <DevResolver id={booking.id} />}
          </>
        )}
      </div>
    </div>
  );
}
