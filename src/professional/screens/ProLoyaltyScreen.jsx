// Fidelidade: pontos e cashback · estado local
import { Check } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// "Programa de fidelidade" — pontos, cashback e recompensas.
export default function ProLoyaltyScreen() {
  const { loyaltySettings, setLoyaltySettings, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
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
          Programa de fidelidade
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Fidelize clientes com pontos, cashback e recompensas.
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            background: colors.card,
            marginBottom: 18,
            cursor: "pointer",
          }}
          onClick={() => setLoyaltySettings((s) => ({ ...s, enabled: !s.enabled }))}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              border: `1px solid ${loyaltySettings.enabled ? colors.primary : colors.border}`,
              background: loyaltySettings.enabled ? colors.primary : colors.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {loyaltySettings.enabled && <Check size={12} color={colors.primaryForeground} />}
          </span>
          <span style={{ flex: 1, fontFamily: fontBody, fontSize: 13, color: colors.foreground, fontWeight: 600 }}>
            Ativar programa de fidelidade
          </span>
        </label>

        <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: "0 0 8px" }}>
          Pontos por real gasto
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={loyaltySettings.pointsPerReal}
            onChange={(e) => setLoyaltySettings((s) => ({ ...s, pointsPerReal: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: colors.primary }}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              fontWeight: 600,
              color: colors.foreground,
              minWidth: 60,
              textAlign: "right",
            }}
          >
            {loyaltySettings.pointsPerReal} pts
          </span>
        </div>

        <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: "0 0 8px" }}>
          Cashback
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={loyaltySettings.cashbackPercent}
            onChange={(e) => setLoyaltySettings((s) => ({ ...s, cashbackPercent: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: colors.primary }}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              fontWeight: 600,
              color: colors.foreground,
              minWidth: 44,
              textAlign: "right",
            }}
          >
            {loyaltySettings.cashbackPercent}%
          </span>
        </div>

        <PrimaryButton onClick={() => {}}>Salvar configurações</PrimaryButton>
      </div>
    </div>
  );
}
