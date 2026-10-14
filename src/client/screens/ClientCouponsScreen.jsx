// Perfil: cupons · estático
import { Gift } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

// === PERFIL: Cupons e gift cards ===
export default function ClientCouponsScreen() {
  const { setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "4px 0 4px",
          }}
        >
          Cupons e gift cards
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Resgate um cupom ou gift card para usar nos seus agendamentos.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input placeholder="Código do cupom" style={{ ...inputStyle(false), flex: 1 }} />
          <button
            style={{
              padding: "0 18px",
              borderRadius: 12,
              border: "none",
              background: gradientKira,
              color: colors.primaryForeground,
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Aplicar
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            padding: "24px 24px",
            textAlign: "center",
          }}
        >
          <Gift size={30} color={colors.mutedForeground} />
          <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>
            Nenhum cupom ativo no momento.
          </p>
        </div>
      </div>
    </div>
  );
}
