// Provador: foto de referência · FileReader local
import { Wand2 } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";

// ---------- Provador virtual ----------
// Fluxo: referência → foto da cliente → resultado/preview → "Encontrar
// profissionais" (leva ao Ranking já no modo personalizado).
export default function ClientTryOnReferenceScreen() {
  const {
    goToTab,
    handlePhoto,
    setScreen,
    setTryOnReference,
    tryOnRefInputRef,
    tryOnReference,
  } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Provador virtual</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Escolha uma referência do visual que você deseja experimentar.</p>

        <div
          onClick={() => tryOnRefInputRef.current?.click()}
          style={{
            width: "100%", aspectRatio: "1/1", maxWidth: 280, margin: "0 auto 16px", borderRadius: 20, overflow: "hidden",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            border: `2px ${tryOnReference ? "solid" : "dashed"} ${tryOnReference ? colors.primary : colors.border}`,
            background: colors.muted, cursor: "pointer",
          }}
        >
          {tryOnReference ? (
            <img src={tryOnReference} alt="Referência escolhida" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <Wand2 size={30} color={colors.mutedForeground} />
              <span style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody }}>Enviar foto de referência</span>
            </>
          )}
        </div>
        <input ref={tryOnRefInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files?.[0], setTryOnReference)} />

        <div style={{ width: "100%", maxWidth: 280, margin: "0 auto" }}>
          <PrimaryButton disabled={!tryOnReference} onClick={() => setScreen("clientTryOnPhoto")}>Continuar</PrimaryButton>
        </div>
      </div>
      <BottomNav active="clientTryOnReference" onNavigate={goToTab} />
    </div>
  );
}
