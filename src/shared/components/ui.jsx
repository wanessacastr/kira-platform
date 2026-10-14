// UI base: botões, campos, cabeçalho, chips e seções · API: nenhuma
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { colors, fontBody, gradientKira } from "../theme";

export const inputStyle = (hasError) => ({
  width: "100%",
  padding: "13px 15px",
  borderRadius: 12,
  background: colors.muted,
  color: colors.foreground,
  fontFamily: fontBody,
  fontSize: 14,
  border: `1px solid ${hasError ? colors.destructive : colors.border}`,
  outline: "none",
  boxSizing: "border-box",
  colorScheme: "light",
});

export const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
    <label style={{ fontSize: 12, fontWeight: 500, color: colors.foreground, fontFamily: fontBody }}>
      {label}
    </label>
    {children}
    {error && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: 0 }}>{error}</p>}
  </div>
);

export const PrimaryButton = ({ children, onClick, disabled, pill, type = "button" }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={{
      width: "100%",
      padding: 15,
      borderRadius: pill ? 999 : 16,
      border: "none",
      background: gradientKira,
      color: colors.primaryForeground,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: fontBody,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      marginTop: 4,
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
      padding: 12,
      borderRadius: 12,
      border: "none",
      background: colors.muted,
      color: colors.primary,
      fontWeight: 600,
      fontSize: 13,
      fontFamily: fontBody,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    }}
  >
    {children}
  </button>
);

export const DocUploadBox = ({ label, value, error, inputRef, onChange }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 12, fontWeight: 500, color: colors.foreground, fontFamily: fontBody, display: "block", marginBottom: 6 }}>{label}</label>
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        width: "100%",
        aspectRatio: "16/10",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
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
          <span style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody }}>Toque para enviar</span>
        </>
      )}
    </div>
    <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onChange(e.target.files?.[0])} />
    {error && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "4px 0 0" }}>{error}</p>}
  </div>
);

export const Header = ({ onBack }) => (
  <div style={{ display: "flex", alignItems: "center", padding: 14 }}>
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
  <div style={{ display: "flex", gap: 3, padding: "0 22px 4px" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < done ? colors.primary : colors.border }} />
    ))}
  </div>
);

export const SearchBar = ({ value, onChange, onFilterClick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: colors.muted, borderRadius: 999, padding: "12px 16px" }}>
      <Search size={16} color={colors.mutedForeground} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar profissionais..."
        style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: fontBody, fontSize: 13, color: colors.foreground }}
      />
    </div>
    <button
      onClick={onFilterClick}
      aria-label="Filtros"
      style={{ width: 46, height: 46, borderRadius: 16, border: "none", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
    >
      <SlidersHorizontal size={18} color={colors.primaryForeground} />
    </button>
  </div>
);

export const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "9px 16px",
      borderRadius: 999,
      border: "none",
      whiteSpace: "nowrap",
      background: active ? gradientKira : colors.muted,
      color: active ? colors.primaryForeground : colors.foreground,
      fontFamily: fontBody,
      fontWeight: 600,
      fontSize: 12,
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {label}
  </button>
);

export const ProfileSection = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <p style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.mutedForeground, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>{title}</p>
    <div style={{ borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card, overflow: "hidden" }}>{children}</div>
  </div>
);

export const ProfileMenuRow = ({ icon: Icon, label, onClick, destructive, last }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "13px 14px",
      border: "none", borderBottom: last ? "none" : `1px solid ${colors.border}`, background: "transparent",
      textAlign: "left", cursor: onClick ? "pointer" : "default",
    }}
  >
    <div style={{ width: 30, height: 30, borderRadius: 9, background: destructive ? "hsl(0 84% 60% / 0.1)" : colors.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={15} color={destructive ? colors.destructive : colors.mutedForeground} />
    </div>
    <span style={{ flex: 1, fontFamily: fontBody, fontSize: 13, color: destructive ? colors.destructive : colors.foreground, fontWeight: destructive ? 600 : 500 }}>{label}</span>
    {!destructive && <ChevronRight size={16} color={colors.mutedForeground} />}
  </button>
);
