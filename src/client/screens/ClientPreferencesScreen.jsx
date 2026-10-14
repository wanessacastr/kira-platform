// Preferências de serviços · estado local
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { preferenceCategories } from "../data/mocks";

export default function ClientPreferencesScreen() {
  const { cPreferences, setScreen, toggleCPreference } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("clientDone")} />
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
          ✨ Vamos personalizar sua experiência
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Escolha os serviços que mais combinam com você. Assim a Kira poderá mostrar profissionais e inspirações mais
          relevantes.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {preferenceCategories.map((cat) => {
            const selected = cPreferences.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCPreference(cat.id)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: 18,
                  borderRadius: 16,
                  border: `2px solid ${selected ? colors.primary : colors.border}`,
                  background: selected ? "hsl(340 70% 55% / 0.08)" : colors.card,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: selected ? gradientKira : colors.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {cat.emoji}
                </div>
                <span style={{ fontWeight: 600, fontSize: 13, color: colors.foreground, fontFamily: fontBody }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <PrimaryButton onClick={() => setScreen("clientHome")}>Continuar</PrimaryButton>
      </div>
    </div>
  );
}
