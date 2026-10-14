// Cards de profissional, recomendação, ranking e agendamento · API: nenhuma
import {
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, gradientKira } from "../../shared/theme";
import { getRankingExtras } from "../data/mocks";

export const ProfessionalCard = ({ pro, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16,
      border: `1px solid ${colors.border}`, background: colors.card, width: "100%", textAlign: "left", cursor: "pointer",
    }}
  >
    <img src={pro.photo} alt={pro.name} style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>{pro.name}</p>
      <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 4px" }}>{pro.role}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
          <Star size={11} color={colors.accent} fill={colors.accent} /> {pro.rating}{pro.reviews ? ` (${pro.reviews})` : ""}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
          <MapPin size={11} /> {pro.distance} km
        </span>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
      <span style={{ fontFamily: fontBody, fontSize: 9, color: colors.mutedForeground }}>a partir de</span>
      <span style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 14, color: colors.primary }}>R$ {pro.price}</span>
    </div>
    <ChevronRight size={18} color={colors.mutedForeground} style={{ flexShrink: 0 }} />
  </button>
);

export const CompatibilityBadge = ({ value }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999,
    background: gradientKira, color: colors.primaryForeground, fontFamily: fontBody, fontSize: 11, fontWeight: 700,
  }}>
    <Sparkles size={11} /> {value}% compatível com seu visual
  </span>
);

export const RecommendedProfessionalCard = ({ pro, onViewProfile }) => {
  const extras = getRankingExtras(pro);
  return (
    <div onClick={onViewProfile} style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.card, overflow: "hidden", cursor: "pointer" }}>
      <div style={{ padding: "12px 14px 0" }}>
        <CompatibilityBadge value={pro.compatibility} />
      </div>
      <div style={{ display: "flex", gap: 12, padding: 14 }}>
        <img src={pro.photo} alt={pro.name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 14, color: colors.foreground, margin: 0 }}>{pro.name}</p>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "1px 0 5px" }}>{pro.role}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
              <Star size={11} color={colors.accent} fill={colors.accent} /> {pro.rating} ({pro.reviews} avaliações)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>R$ {pro.price} — R$ {pro.price + 70}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
              <MapPin size={11} /> {pro.distance} km
            </span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, color: colors.primary, fontWeight: 600, marginTop: 4 }}>
            <Clock size={11} /> Disponível {extras.nextSlot.toLowerCase()}
          </span>
        </div>
      </div>
      {extras.portfolio.length > 0 && (
        <div style={{ display: "flex", gap: 6, padding: "0 14px 14px" }}>
          {extras.portfolio.map((photo, i) => (
            <img key={i} src={photo} alt={`Trabalho de ${pro.name}`} style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} />
          ))}
        </div>
      )}
      <div style={{ padding: "0 14px 14px" }}>
        <SecondaryButton onClick={onViewProfile}>Ver perfil</SecondaryButton>
      </div>
    </div>
  );
};

export const RatingStars = ({ value, size = 12 }) => {
  const rounded = Math.round(value);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} color={colors.accent} fill={i < rounded ? colors.accent : "none"} />
      ))}
    </span>
  );
};

export const rankMedalStyle = (rank) => {
  if (rank === 1) return { background: "linear-gradient(135deg, #FFD76A, #FFB84D)", color: "#5A3B00" };
  if (rank === 2) return { background: "linear-gradient(135deg, #E4E7EC, #C7CCD6)", color: colors.foreground };
  if (rank === 3) return { background: "linear-gradient(135deg, #E7B78C, #CE9564)", color: "#4A2A0E" };
  return null;
};

export const RankingCard = ({ pro, rank, onClick }) => {
  const medal = rankMedalStyle(rank);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, width: "100%", textAlign: "left", cursor: "pointer",
        border: `1px solid ${medal ? "transparent" : colors.border}`,
        background: medal ? "hsl(340 70% 55% / 0.06)" : colors.card,
        boxShadow: medal ? "0 2px 14px -6px hsl(340 70% 55% / 0.35)" : "none",
      }}
    >
      {medal ? (
        <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontBody, fontWeight: 700, fontSize: 12, flexShrink: 0, ...medal }}>
          {rank}
        </div>
      ) : (
        <span style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontBody, fontWeight: 700, fontSize: 12, color: colors.mutedForeground, flexShrink: 0 }}>{rank}</span>
      )}
      <img src={pro.photo} alt={pro.name} style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>{pro.name}</p>
        <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 4px" }}>{pro.role}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <RatingStars value={pro.rating} size={10} />
          <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>{pro.rating} ({pro.reviews})</span>
        </div>
      </div>
      <ChevronRight size={18} color={colors.mutedForeground} style={{ flexShrink: 0 }} />
    </button>
  );
};

export const AppointmentCard = ({ appointment, pro, onClick }) => {
  const statusMap = {
    proximo: { label: "✓ Confirmado", color: colors.primary },
    concluido: { label: "Concluído", color: colors.mutedForeground },
    cancelado: { label: "Cancelado", color: colors.destructive },
  };
  const status = statusMap[appointment.status];
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card, width: "100%", textAlign: "left", cursor: "pointer" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={pro.photo} alt={pro.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>{pro.name}</p>
          <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{pro.role}</p>
        </div>
        <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: status.color }}>{status.label}</span>
      </div>
      <p style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 600, color: colors.foreground, margin: 0 }}>{appointment.service}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}><Clock size={11} /> {appointment.date} • {appointment.time}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}><MapPin size={11} /> {appointment.place}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>R$ {appointment.price.toFixed(2)}</span>
        <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: colors.primary, display: "flex", alignItems: "center", gap: 2 }}>Ver detalhes <ChevronRight size={13} /></span>
      </div>
    </button>
  );
};
