// Barra de navegação inferior do cliente · API: nenhuma
import { colors, fontBody } from "../../shared/theme";
import { bottomNavItems } from "../data/mocks";

// Bottom navigation unificada dos 6 destinos do Kira. Fundo branco, cantos
// superiores arredondados, sombra bem sutil, ícones lineares com rótulo
// abaixo, estado ativo com pílula de fundo, e respeito à safe area de
// dispositivos com "ilha" inferior (iPhone com notch/gesture bar).
export const BottomNav = ({ active, onNavigate }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      padding: "8px 6px calc(8px + env(safe-area-inset-bottom, 0px))",
      borderTop: `1px solid ${colors.border}`,
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -6px 20px -12px hsl(280 20% 15% / 0.18)",
      background: colors.card,
      flexShrink: 0,
    }}
  >
    {bottomNavItems.map((item) => {
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
            background: isActive ? "hsl(340 70% 55% / 0.1)" : "transparent",
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
