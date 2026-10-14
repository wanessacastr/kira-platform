// Modal de filtros da busca (preço, nota, distância, ordem) · API: nenhuma
import { CheckCircle2, Star } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

export const FilterModal = ({ open, mounted, onClose, draft, setDraft, onApply, onClear }) => {
  if (!open) return null;
  const labelStyle = {
    fontFamily: fontBody,
    fontSize: 12,
    fontWeight: 600,
    color: colors.foreground,
    margin: "0 0 8px",
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "hsl(280 20% 15% / 0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: colors.card,
          borderRadius: "24px 24px 0 0",
          padding: "20px 24px 28px",
          maxHeight: "85%",
          overflowY: "auto",
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "transform 0.25s ease",
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: colors.border, margin: "0 auto 16px" }} />
        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 18,
            color: colors.foreground,
            margin: "0 0 18px",
          }}
        >
          Filtros
        </h2>

        <p style={labelStyle}>Faixa de preço</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={draft.price}
            onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: colors.primary }}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              fontWeight: 600,
              color: colors.foreground,
              minWidth: 74,
              textAlign: "right",
            }}
          >
            até R$ {draft.price}
          </span>
        </div>

        <p style={labelStyle}>Avaliação mínima</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setDraft((d) => ({ ...d, minRating: r }))}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "none",
                background: draft.minRating === r ? gradientKira : colors.muted,
                color: draft.minRating === r ? colors.primaryForeground : colors.foreground,
                fontFamily: fontBody,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {r === 0 ? (
                "Todas"
              ) : (
                <>
                  {r} <Star size={11} fill="currentColor" />
                </>
              )}
            </button>
          ))}
        </div>

        <p style={labelStyle}>Distância máxima</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={draft.maxDistance}
            onChange={(e) => setDraft((d) => ({ ...d, maxDistance: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: colors.primary }}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              fontWeight: 600,
              color: colors.foreground,
              minWidth: 56,
              textAlign: "right",
            }}
          >
            {draft.maxDistance} km
          </span>
        </div>

        <p style={labelStyle}>Atendimento</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[
            ["presencial", "Presencial"],
            ["domicilio", "Domicílio"],
            ["ambos", "Ambos"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDraft((d) => ({ ...d, mode: key }))}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 12,
                border: `1px solid ${draft.mode === key ? colors.primary : colors.border}`,
                background: draft.mode === key ? "hsl(340 70% 55% / 0.08)" : colors.card,
                color: colors.foreground,
                fontFamily: fontBody,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <p style={labelStyle}>Ordenar por</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {[
            ["proximo", "Mais próximo"],
            ["avaliado", "Melhor avaliado"],
            ["preco", "Menor preço"],
            ["recomendado", "Mais recomendado"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDraft((d) => ({ ...d, sort: key }))}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${draft.sort === key ? colors.primary : colors.border}`,
                background: draft.sort === key ? "hsl(340 70% 55% / 0.08)" : colors.card,
                cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground }}>{label}</span>
              {draft.sort === key && <CheckCircle2 size={16} color={colors.primary} />}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <SecondaryButton onClick={onClear}>Limpar filtros</SecondaryButton>
          </div>
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={onApply}>Aplicar</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
