// Primitivos de UI (Heading, Text, Card, Stack, Button, Chip, Badge, ListRow, ScreenHeader) · API: nenhuma
import { ArrowLeft, ChevronRight } from "lucide-react";
import { colors, fontBody, fontDisplay, gradientKira } from "../theme";

const sizeVar = (size) => `var(--font-size-${size})`;

export const Stack = ({ as: Tag = "div", direction = "column", gap = 8, align, justify, style, children, ...rest }) => (
  <Tag
    style={{
      display: "flex",
      flexDirection: direction,
      gap: `var(--space-${gap})`,
      alignItems: align,
      justifyContent: justify,
      ...style,
    }}
    {...rest}
  >
    {children}
  </Tag>
);

export const Text = ({ as: Tag = "p", size = "md", weight, color = colors.foreground, style, children, ...rest }) => (
  <Tag
    style={{ fontFamily: fontBody, fontSize: sizeVar(size), fontWeight: weight, color, margin: 0, ...style }}
    {...rest}
  >
    {children}
  </Tag>
);

export const Heading = ({ as: Tag = "h2", size = "2xl", color = colors.foreground, style, children, ...rest }) => (
  <Tag
    style={{ fontFamily: fontDisplay, fontSize: sizeVar(size), fontWeight: 700, color, margin: 0, ...style }}
    {...rest}
  >
    {children}
  </Tag>
);

export const Card = ({ radius = "2xl", padding, clip = true, style, children, ...rest }) => (
  <div
    style={{
      borderRadius: `var(--radius-${radius})`,
      border: `1px solid ${colors.border}`,
      background: colors.card,
      overflow: clip ? "hidden" : undefined,
      padding: padding ? `var(--space-${padding})` : undefined,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const buttonVariants = {
  primary: { background: gradientKira, color: colors.primaryForeground },
  secondary: { background: colors.muted, color: colors.primary },
};

export const Button = ({
  variant = "primary",
  radius = "2xl",
  pad = 15,
  size = "md",
  disabled,
  type = "button",
  style,
  children,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled}
    className="k-btn"
    style={{
      width: "100%",
      padding: `var(--space-${pad})`,
      borderRadius: `var(--radius-${radius})`,
      border: "none",
      fontWeight: 600,
      fontSize: sizeVar(size),
      fontFamily: fontBody,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      ...buttonVariants[variant],
      ...style,
    }}
    {...rest}
  >
    {children}
  </button>
);

export const Chip = ({ active, style, children, ...rest }) => (
  <button
    type="button"
    className="k-chip"
    style={{
      padding: "var(--space-9) var(--space-16)",
      borderRadius: "var(--radius-pill)",
      border: "none",
      whiteSpace: "nowrap",
      background: active ? gradientKira : colors.muted,
      color: active ? colors.primaryForeground : colors.foreground,
      fontFamily: fontBody,
      fontWeight: 600,
      fontSize: sizeVar("xs"),
      cursor: "pointer",
      flexShrink: 0,
      ...style,
    }}
    {...rest}
  >
    {children}
  </button>
);

const badgeTones = {
  primary: { background: "hsl(var(--primary-hsl) / 0.1)", color: colors.primary },
  danger: { background: "hsl(var(--destructive-hsl) / 0.1)", color: colors.destructive },
  neutral: { background: colors.muted, color: colors.mutedForeground },
};

export const Badge = ({ tone = "primary", style, children, ...rest }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "var(--space-2) var(--space-8)",
      borderRadius: "var(--radius-pill)",
      fontFamily: fontBody,
      fontSize: sizeVar("xs"),
      fontWeight: 600,
      ...badgeTones[tone],
      ...style,
    }}
    {...rest}
  >
    {children}
  </span>
);

export const ListRow = ({ icon: Icon, label, onClick, destructive, last }) => (
  <button
    type="button"
    className="k-row"
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-12)",
      width: "100%",
      padding: "var(--space-13) var(--space-14)",
      border: "none",
      borderBottom: last ? "none" : `1px solid ${colors.border}`,
      background: "transparent",
      textAlign: "left",
      cursor: onClick ? "pointer" : "default",
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "var(--radius-icon)",
        background: destructive ? "hsl(var(--destructive-hsl) / 0.1)" : colors.muted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={15} color={destructive ? colors.destructive : colors.mutedForeground} />
    </div>
    <span
      style={{
        flex: 1,
        fontFamily: fontBody,
        fontSize: sizeVar("sm"),
        color: destructive ? colors.destructive : colors.foreground,
        fontWeight: destructive ? 600 : 500,
      }}
    >
      {label}
    </span>
    {!destructive && <ChevronRight size={16} color={colors.mutedForeground} />}
  </button>
);

export const ScreenHeader = ({ onBack, children }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "var(--space-14)" }}>
    <button
      type="button"
      className="k-chip"
      onClick={onBack}
      aria-label="Voltar"
      style={{
        width: 34,
        height: 34,
        borderRadius: "var(--radius-round)",
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.foreground,
        cursor: "pointer",
      }}
    >
      <ArrowLeft size={20} />
    </button>
    {children}
  </div>
);
