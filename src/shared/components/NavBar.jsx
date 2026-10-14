// Barra de navegação inferior usada por cliente e profissional (recebe os itens) · API: nenhuma
import { colors, fontBody } from "../theme";

// Fundo branco, cantos superiores arredondados, sombra sutil, ícones lineares com
// rótulo, pílula no item ativo e respeito à safe area (iPhone com gesture bar).
export const NavBar = ({ items, active, onNavigate }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-2)",
      padding: "var(--space-8) var(--space-6) calc(var(--space-8) + env(safe-area-inset-bottom, 0px))",
      borderTop: `1px solid ${colors.border}`,
      borderRadius: "var(--radius-4xl) var(--radius-4xl) 0 0",
      boxShadow: "var(--shadow-nav)",
      background: colors.card,
      flexShrink: 0,
    }}
  >
    {items.map((item) => {
      const Icon = item.icon;
      const isActive = active === item.key;
      return (
        <button
          type="button"
          className="k-chip"
          key={item.key}
          onClick={() => onNavigate?.(item.key)}
          aria-label={item.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)",
            flex: 1,
            minWidth: 0,
            padding: "var(--space-6) var(--space-2)",
            borderRadius: "var(--radius-lg)",
            background: isActive ? "hsl(var(--primary-hsl) / 0.1)" : "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Icon
            size={18}
            color={isActive ? colors.primary : colors.mutedForeground}
            strokeWidth={isActive ? 2.3 : 1.8}
          />
          <span
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? colors.primaryText : colors.mutedForeground,
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
        </button>
      );
    })}
  </div>
);
