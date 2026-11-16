// Faixa do mapa na Home: ilustração com os pinos dos estúdios e a contagem de quem está perto · abre a tela do mapa
import { MapPin } from "lucide-react";
import { colors, fontBody } from "../../shared/theme";
import { mapPoints, nearbyLabel, projectPoints } from "../utils/mapPoints";

const PIN_COLORS = [colors.primary, "var(--color-violet)", colors.accent];

const Pin = ({ x, y, color }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: 26,
      height: 26,
      marginLeft: -13,
      marginTop: -26,
      borderRadius: "var(--radius-round) var(--radius-round) var(--radius-round) 0",
      transform: "rotate(-45deg)",
      background: color,
      border: `2px solid ${colors.card}`,
      boxShadow: "var(--shadow-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <span style={{ width: 8, height: 8, borderRadius: "var(--radius-round)", background: colors.card }} />
  </span>
);

export function NearbyMapStrip({ professionals, onOpen }) {
  const points = mapPoints(professionals);
  if (points.length === 0) return null;
  return (
    <button
      type="button"
      className="k-reset"
      onClick={onOpen}
      aria-label="Abrir o mapa dos profissionais"
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height: 128,
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        background: "color-mix(in srgb, var(--color-violet) 9%, var(--color-card))",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 340 128"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <g fill="none" stroke={colors.card} strokeLinecap="round" opacity="0.9">
          <path d="M-10 92 C 60 70, 110 112, 180 78 S 300 40, 350 58" strokeWidth="7" />
          <path d="M70 -10 C 90 30, 70 70, 120 138" strokeWidth="5" />
          <path d="M250 -10 C 230 30, 280 70, 262 138" strokeWidth="5" />
          <path d="M-10 36 C 50 28, 100 44, 160 22 S 280 10, 350 20" strokeWidth="3" />
        </g>
      </svg>
      {projectPoints(points).map((pin, i) => (
        <Pin key={pin.id} x={pin.x} y={pin.y} color={PIN_COLORS[i % PIN_COLORS.length]} />
      ))}
      <span
        style={{
          position: "absolute",
          left: "var(--space-12)",
          bottom: "var(--space-12)",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-4)",
          padding: "var(--space-6) var(--space-12)",
          borderRadius: "var(--radius-round)",
          background: colors.card,
          boxShadow: "var(--shadow-md)",
          fontFamily: fontBody,
          fontSize: "var(--font-size-xs)",
          fontWeight: 600,
          color: colors.foreground,
        }}
      >
        <MapPin size={12} color={colors.primary} /> {nearbyLabel(professionals)}
      </span>
    </button>
  );
}
