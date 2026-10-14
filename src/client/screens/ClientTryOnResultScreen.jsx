// Provador: resultado e botão Encontrar profissionais · mock de recomendação
import { Sparkles } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header, PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { RecommendedProfessionalCard } from "../components/ProfessionalCards";

export default function ClientTryOnResultScreen() {
  const {
    goToPersonalizedRanking,
    loadRanking,
    rankingError,
    rankingLoading,
    recommended,
    setBookedSlot,
    setScreen,
    setSelectedProId,
    tryOnClientPhoto,
    tryOnReference,
  } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientTryOnPhoto")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Prévia do resultado</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>É assim que esse visual pode ficar em você. Que tal encontrar quem sabe fazer igual?</p>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 4px", textAlign: "center" }}>Referência</p>
            <img src={tryOnReference} alt="Referência" style={{ width: "100%", aspectRatio: "1/1", borderRadius: 14, objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: colors.primary, fontWeight: 700, fontFamily: fontBody, margin: "0 0 4px", textAlign: "center" }}>Resultado (prévia)</p>
            <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", position: "relative" }}>
              <img src={tryOnClientPhoto} alt="Prévia do resultado" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "hsl(340 70% 55% / 0.18)", border: `2px solid ${colors.primary}`, borderRadius: 14 }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, background: colors.muted, marginBottom: 20 }}>
          <Sparkles size={16} color={colors.primary} />
          <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>Prévia gerada por nossa inteligência artificial. O resultado real pode variar conforme o profissional.</span>
        </div>

        <PrimaryButton onClick={goToPersonalizedRanking}>Encontrar profissionais</PrimaryButton>

        <div style={{ marginTop: 22 }}>
          {rankingLoading ? (
            <>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: "0 0 12px" }}>Buscando profissionais para esse visual...</p>
              <SkeletonLoading count={3} />
            </>
          ) : rankingError ? (
            <ErrorState onRetry={loadRanking} message="Não foi possível carregar as recomendações." />
          ) : recommended.length === 0 ? (
            <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: "24px 0" }}>Ainda não encontramos profissionais compatíveis com esse visual.</p>
          ) : (
            <>
              <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: colors.foreground, margin: "0 0 12px" }}>Profissionais recomendados para você ✨</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 420, overflowY: "auto" }}>
                {recommended.map((pro) => (
                  <RecommendedProfessionalCard key={pro.id} pro={pro} onViewProfile={() => { setSelectedProId(pro.id); setBookedSlot(null); setScreen("clientProfessionalProfile"); }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
