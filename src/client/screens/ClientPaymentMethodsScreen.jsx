// Perfil: formas de pagamento · estático, sem gateway
import { CreditCard, Plus } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// === PERFIL: Formas de pagamento ===
export default function ClientPaymentMethodsScreen() {
  const { setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Formas de pagamento
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Adicione um cartão ou use Pix na hora de agendar.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-14)",
            padding: "var(--space-40) var(--space-24)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: colors.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCard size={26} color={colors.mutedForeground} />
          </div>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>
            Nenhuma forma de pagamento cadastrada ainda.
          </p>
        </div>
        <PrimaryButton onClick={() => {}}>
          <Plus size={15} /> Adicionar cartão
        </PrimaryButton>
      </div>
    </div>
  );
}
