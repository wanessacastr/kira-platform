// UI base: botões, campos, cabeçalho, chips e seções · API: nenhuma
import { ArrowLeft, Camera, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { colors, fontBody, gradientKira } from "../theme";

export const inputStyle = (hasError) => ({
  width: "100%",
  padding: "var(--space-13) var(--space-15)",
  borderRadius: "var(--radius-lg)",
  background: colors.muted,
  color: colors.foreground,
  fontFamily: fontBody,
  fontSize: "var(--font-size-md)",
  border: `1px solid ${hasError ? colors.destructive : colors.border}`,
  outline: "none",
  boxSizing: "border-box",
  colorScheme: "light",
});

export const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", marginBottom: "var(--space-14)" }}>
    <label style={{ fontSize: "var(--font-size-xs)", fontWeight: 500, color: colors.foreground, fontFamily: fontBody }}>
      {label}
    </label>
    {children}
    {error && (
      <p style={{ fontSize: "var(--font-size-xs)", color: colors.destructive, fontFamily: fontBody, margin: 0 }}>
        {error}
      </p>
    )}
  </div>
);

export const PrimaryButton = ({ children, onClick, disabled, pill, type = "button" }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={{
      width: "100%",
      padding: "var(--space-15)",
      borderRadius: pill ? 999 : 16,
      border: "none",
      background: gradientKira,
      color: colors.primaryForeground,
      fontWeight: 600,
      fontSize: "var(--font-size-md)",
      fontFamily: fontBody,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      marginTop: "var(--space-4)",
    }}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: "100%",
      padding: "var(--space-12)",
      borderRadius: "var(--radius-lg)",
      border: "none",
      background: colors.muted,
      color: colors.primary,
      fontWeight: 600,
      fontSize: "var(--font-size-sm)",
      fontFamily: fontBody,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-6)",
    }}
  >
    {children}
  </button>
);

export const DocUploadBox = ({ label, value, error, inputRef, onChange }) => (
  <div style={{ marginBottom: "var(--space-14)" }}>
    <label
      style={{
        fontSize: "var(--font-size-xs)",
        fontWeight: 500,
        color: colors.foreground,
        fontFamily: fontBody,
        display: "block",
        marginBottom: "var(--space-6)",
      }}
    >
      {label}
    </label>
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        width: "100%",
        aspectRatio: "16/10",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-6)",
        border: `2px ${value ? "solid" : "dashed"} ${error ? colors.destructive : value ? colors.primary : colors.border}`,
        background: colors.muted,
        cursor: "pointer",
      }}
    >
      {value ? (
        <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <Camera size={26} color={colors.mutedForeground} />
          <span style={{ fontSize: "var(--font-size-xs)", color: colors.mutedForeground, fontFamily: fontBody }}>
            Toque para enviar
          </span>
        </>
      )}
    </div>
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => onChange(e.target.files?.[0])}
    />
    {error && (
      <p
        style={{
          fontSize: "var(--font-size-xs)",
          color: colors.destructive,
          fontFamily: fontBody,
          margin: "var(--space-4) 0 0",
        }}
      >
        {error}
      </p>
    )}
  </div>
);

export const Header = ({ onBack }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "var(--space-14)" }}>
    <button
      onClick={onBack}
      aria-label="Voltar"
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
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
  </div>
);

export const StepDots = ({ total, done }) => (
  <div style={{ display: "flex", gap: "var(--space-3)", padding: "0 var(--space-22) var(--space-4)" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 3,
          flex: 1,
          borderRadius: "var(--radius-2xs)",
          background: i < done ? colors.primary : colors.border,
        }}
      />
    ))}
  </div>
);

export const SearchBar = ({ value, onChange, onFilterClick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)" }}>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-10)",
        background: colors.muted,
        borderRadius: "var(--radius-pill)",
        padding: "var(--space-12) var(--space-16)",
      }}
    >
      <Search size={16} color={colors.mutedForeground} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar profissionais..."
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: fontBody,
          fontSize: "var(--font-size-sm)",
          color: colors.foreground,
        }}
      />
    </div>
    <button
      onClick={onFilterClick}
      aria-label="Filtros"
      style={{
        width: 46,
        height: 46,
        borderRadius: "var(--radius-2xl)",
        border: "none",
        background: gradientKira,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <SlidersHorizontal size={18} color={colors.primaryForeground} />
    </button>
  </div>
);

export const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "var(--space-9) var(--space-16)",
      borderRadius: "var(--radius-pill)",
      border: "none",
      whiteSpace: "nowrap",
      background: active ? gradientKira : colors.muted,
      color: active ? colors.primaryForeground : colors.foreground,
      fontFamily: fontBody,
      fontWeight: 600,
      fontSize: "var(--font-size-xs)",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {label}
  </button>
);

export const ProfileSection = ({ title, children }) => (
  <div style={{ marginBottom: "var(--space-22)" }}>
    <p
      style={{
        fontFamily: fontBody,
        fontSize: "var(--font-size-xs)",
        fontWeight: 700,
        color: colors.mutedForeground,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        margin: "0 0 var(--space-8)",
      }}
    >
      {title}
    </p>
    <div
      style={{
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${colors.border}`,
        background: colors.card,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

export const ProfileMenuRow = ({ icon: Icon, label, onClick, destructive, last }) => (
  <button
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
        fontSize: "var(--font-size-sm)",
        color: destructive ? colors.destructive : colors.foreground,
        fontWeight: destructive ? 600 : 500,
      }}
    >
      {label}
    </span>
    {!destructive && <ChevronRight size={16} color={colors.mutedForeground} />}
  </button>
);
