// Indicador visual do pagamento: relógio pulsando enquanto confere, check ao confirmar, aviso suave na falha · API: nenhuma
import { AlertCircle, Check, Clock, QrCode } from "lucide-react";
import { colors, gradientKira } from "../../../shared/theme";
import { PAYMENT_STAGES, isPending } from "../../booking/paymentStage";

const icons = {
  [PAYMENT_STAGES.AWAITING]: QrCode,
  [PAYMENT_STAGES.SENT]: Clock,
  [PAYMENT_STAGES.PROCESSING]: Clock,
  [PAYMENT_STAGES.CONFIRMED]: Check,
  [PAYMENT_STAGES.FAILED]: AlertCircle,
};

const motion =
  "@keyframes kiraPulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } } @media (prefers-reduced-motion: reduce) { .k-pay-pulse { animation: none !important } }";

export const PaymentStatusVisual = ({ stage }) => {
  const Icon = icons[stage];
  const confirmed = stage === PAYMENT_STAGES.CONFIRMED;
  const failed = stage === PAYMENT_STAGES.FAILED;
  return (
    <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", padding: "var(--space-8) 0" }}>
      <style>{motion}</style>
      <div
        className={isPending(stage) ? "k-pay-pulse" : undefined}
        style={{
          width: 96,
          height: 96,
          borderRadius: "var(--radius-round)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          background: confirmed ? gradientKira : failed ? colors.muted : "var(--color-primary-tint)",
          border: isPending(stage) ? `3px solid ${colors.primary}` : "none",
          animation: isPending(stage) ? "kiraPulse 1.6s ease-in-out infinite" : undefined,
        }}
      >
        <Icon
          size={40}
          color={confirmed ? colors.primaryForeground : failed ? colors.primaryText : colors.foreground}
        />
      </div>
    </div>
  );
};
