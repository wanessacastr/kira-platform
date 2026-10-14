// Barra de navegação inferior do profissional · API: nenhuma
import { colors, fontBody } from "../../shared/theme";
import { proBottomNavItems } from "../data/mocks";

// NOVO — Bottom nav do profissional. Mesmos tokens visuais do BottomNav do
// cliente (fundo branco, pílula ativa, ícones lineares, safe area), só que
// aponta para os 5 destinos do painel profissional. Componente independente:
// o BottomNav original não é tocado.
export const ProBottomNav = ({ active, onNavigate }) => (
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
    {proBottomNavItems.map((item) => {
      const Icon = item.icon;
      const isActive = active === item.key;
      return (
        <button
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
              fontSize: 9.5,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? colors.primary : colors.mutedForeground,
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
