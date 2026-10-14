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
      gap: 2,
      padding: "8px 6px calc(8px + env(safe-area-inset-bottom, 0px))",
      borderTop: `1px solid ${colors.border}`,
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -6px 20px -12px hsl(var(--foreground-hsl) / 0.18)",
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
            gap: 2,
            flex: 1,
            minWidth: 0,
            padding: "6px 2px",
            borderRadius: 12,
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
