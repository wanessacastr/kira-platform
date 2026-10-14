// Perfil da profissional (serviços, portfólio, avaliações) · mock
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Clock,
  MapPin,
} from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { PrimaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { startOfMonth } from "../../shared/utils/date";
import { RatingStars } from "../components/ProfessionalCards";
import { getProfileExtras, getRankingExtras } from "../data/mocks";

export default function ClientProfessionalProfileScreen() {
  const {
    favoriteProIds,
    selectedProId,
    setBookedSlot,
    setScheduleError,
    setScheduleTime,
    setScreen,
    setSelectedDate,
    setViewMonth,
    toggleFavoriteProfessional,
  } = useKira();
  const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
  const extras = getProfileExtras(pro);
  const nextSlots = getRankingExtras(pro).nextSlot;
  const goToScheduling = () => { setBookedSlot(null); setSelectedDate(null); setScheduleTime(null); setScheduleError(false); setViewMonth(startOfMonth(new Date())); setScreen("clientScheduling"); };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ position: "relative", height: 140, background: gradientKira, flexShrink: 0 }}>
          <button
            onClick={() => setScreen("clientSearch")}
            aria-label="Voltar"
            style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <ArrowLeft size={20} color={colors.primaryForeground} />
          </button>
          <button
            onClick={() => toggleFavoriteProfessional(pro.id)}
            aria-label={favoriteProIds.includes(pro.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Bookmark size={17} color={colors.primaryForeground} fill={favoriteProIds.includes(pro.id) ? colors.primaryForeground : "none"} />
          </button>
        </div>
        <div style={{ padding: "0 24px 24px", marginTop: -40 }}>
          <img src={pro.photo} alt={pro.name} style={{ width: 84, height: 84, borderRadius: 20, objectFit: "cover", border: `3px solid ${colors.card}`, boxShadow: "0 2px 10px hsl(280 20% 15% / 0.15)" }} />
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: colors.foreground, margin: "12px 0 2px" }}>{pro.name}</h1>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 6px" }}>{pro.role}</p>
          {extras.verified && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary, margin: "0 0 10px" }}>
              <BadgeCheck size={14} /> Profissional verificado
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 12, color: colors.foreground, fontWeight: 600 }}>
              <RatingStars value={pro.rating} size={13} /> {pro.rating} <span style={{ color: colors.mutedForeground, fontWeight: 400 }}>({pro.reviews})</span>
            </span>
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 6px" }}>Sobre</h2>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 18px" }}>{pro.description}</p>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Serviços</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {pro.services.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                <div>
                  <span style={{ fontFamily: fontBody, fontSize: 13, color: colors.foreground, display: "block" }}>{s}</span>
                  <span style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground }}>≈ 45 min</span>
                </div>
                <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>R$ {pro.price}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Portfólio</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
            {extras.portfolio.map((photo, i) => (
              <img key={i} src={photo} alt={`Trabalho ${i + 1} de ${pro.name}`} style={{ width: "100%", aspectRatio: "1/1", borderRadius: 12, objectFit: "cover" }} />
            ))}
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Avaliações</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card, marginBottom: extras.reviewComments.length > 0 ? 10 : 20 }}>
            <RatingStars value={pro.rating} size={15} />
            <span style={{ fontFamily: fontBody, fontSize: 13, color: colors.foreground, fontWeight: 700 }}>{pro.rating}</span>
            <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>com base em {pro.reviews} avaliações</span>
          </div>
          {extras.reviewComments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {extras.reviewComments.map((r, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.foreground }}>{r.author}</span>
                    <RatingStars value={r.stars} size={10} />
                  </div>
                  <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Localização</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card, marginBottom: 20 }}>
            <MapPin size={16} color={colors.primary} />
            <div>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground, margin: 0 }}>{extras.address}</p>
              <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{pro.distance} km de você</p>
            </div>
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Disponibilidade</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
            <Clock size={16} color={colors.primary} />
            <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground }}>Próximo horário: {nextSlots}</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 24px calc(12px + env(safe-area-inset-bottom, 0px))", borderTop: `1px solid ${colors.border}`, background: colors.card, flexShrink: 0 }}>
        <PrimaryButton onClick={goToScheduling}>Agendar</PrimaryButton>
      </div>
    </div>
  );
}
