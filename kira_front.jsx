import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Briefcase,
  Camera,
  Check,
  Trash2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ScanFace,
  Plus,
  X,
  Sparkles,
  ImagePlus,
  Search,
  Star,
  Calendar,
  Trophy,
  Home,
  Scissors,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  SearchX,
  Clock,
  Wand2,
  BadgeCheck,
  MessageCircle,
  LogOut,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  Bookmark,
  Gift,
  Settings,
  XCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const colors = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(280 20% 15%)",
  card: "hsl(0 0% 100%)",
  primary: "hsl(340 70% 55%)",
  primaryForeground: "hsl(40 80% 92%)",
  secondary: "hsl(280 40% 50%)",
  accent: "hsl(15 80% 60%)",
  muted: "hsl(340 20% 96%)",
  mutedForeground: "hsl(280 10% 45%)",
  border: "hsl(340 20% 90%)",
  destructive: "hsl(0 84% 60%)",
};

const gradientKira =
  "linear-gradient(135deg, hsl(15 80% 60%), hsl(340 70% 55%), hsl(270 60% 55%))";

const fontDisplay = "'Playfair Display', serif";
const fontBody = "'DM Sans', sans-serif";

const onlyDigits = (v) => v.replace(/\D/g, "");

const formatPhone = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const formatCpf = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const formatCep = (v) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

const formatCnpj = (v) => {
  const d = onlyDigits(v).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

const isValidCpf = (cpf) => {
  const d = onlyDigits(cpf);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10) r = 0;
  if (r !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10) r = 0;
  return r === parseInt(d[10]);
};

const isValidCnpj = (cnpj) => {
  const d = onlyDigits(cnpj);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (base, weights) => {
    const sum = base.split("").reduce((acc, digit, i) => acc + parseInt(digit) * weights[i], 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calc(d.slice(0, 12), w1);
  if (d1 !== parseInt(d[12])) return false;
  const d2 = calc(d.slice(0, 13), w2);
  return d2 === parseInt(d[13]);
};

const genderOptions = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "nao_binario", label: "Não Binário" },
  { value: "prefiro_nao_informar", label: "Prefiro não informar" },
];

const specialtySuggestions = ["Cabelo", "Unhas", "Estética", "Makeup"];

const preferenceCategories = [
  { id: "cabelo", emoji: "💇", label: "Cabelo" },
  { id: "unhas", emoji: "💅", label: "Unhas" },
  { id: "cilios", emoji: "👁️", label: "Cílios" },
  { id: "sobrancelhas", emoji: "✨", label: "Sobrancelhas" },
  { id: "estetica", emoji: "💆", label: "Estética" },
  { id: "maquiagem", emoji: "💄", label: "Maquiagem" },
  { id: "pedicure", emoji: "🦶", label: "Pedicure" },
  { id: "barbearia", emoji: "💈", label: "Barbearia" },
];

const dashboardCategories = [
  { id: "cabelo", label: "Cabelo", icon: Scissors },
  { id: "unhas", label: "Unhas", icon: Sparkles },
  { id: "estetica", label: "Estética", icon: Heart },
  { id: "makeup", label: "Makeup", icon: Sparkles },
];

const nearbyProfessionals = [
  { id: 1, name: "Ana Paula", role: "Cabeleireira", rating: "4.9", distance: "1.2 km", price: "R$ 80", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
  { id: 2, name: "Carlos Silva", role: "Barbeiro", rating: "4.8", distance: "2.0 km", price: "R$ 50", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
  { id: 3, name: "Marina Costa", role: "Massagista", rating: "5", distance: "0.8 km", price: "R$ 120", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
];

const categoryOptions = [
  { id: "todos", label: "Todos" },
  { id: "cabelo", label: "Cabelo" },
  { id: "barba", label: "Barba" },
  { id: "unhas", label: "Unhas" },
  { id: "estetica", label: "Estética" },
  { id: "massagem", label: "Massagem" },
];

// Categorias do Ranking geral (conforme especificado) — podem não ter dados
// mockados para todas ainda; o fallback de recommendProfessionals() cobre
// esse caso mostrando o catálogo completo até existirem profissionais reais
// nessas categorias.
const rankingCategoryOptions = [
  { id: "todos", label: "Todos" },
  { id: "cabelo", label: "Cabelo" },
  { id: "unhas", label: "Unhas" },
  { id: "cilios", label: "Cílios" },
  { id: "sobrancelhas", label: "Sobrancelhas" },
  { id: "estetica", label: "Estética" },
  { id: "maquiagem", label: "Maquiagem" },
  { id: "barbearia", label: "Barbearia" },
];

const defaultSearchFilters = { price: 500, minRating: 0, maxDistance: 30, mode: "ambos", sort: "proximo" };

const mockProfessionals = [
  { id: 1, name: "Ana Paula", role: "Cabeleireira", category: "cabelo", rating: 4.9, reviews: 128, price: 80, distance: 1.2, mode: "ambos", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", description: "Especialista em cortes femininos e coloração, com 8 anos de experiência.", services: ["Corte", "Coloração", "Escova"], schedule: ["09:00", "10:30", "13:00", "15:00", "16:30"] },
  { id: 2, name: "Carlos Silva", role: "Barbeiro", category: "barba", rating: 4.8, reviews: 96, price: 50, distance: 2.0, mode: "presencial", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop", description: "Barbeiro clássico, especialista em degradê e barba desenhada.", services: ["Corte", "Barba", "Sobrancelha"], schedule: ["08:30", "10:00", "11:30", "14:00", "17:00"] },
  { id: 3, name: "Marina Costa", role: "Massagista", category: "massagem", rating: 5, reviews: 64, price: 120, distance: 0.8, mode: "domicilio", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop", description: "Massoterapeuta especializada em relaxamento e drenagem linfática.", services: ["Massagem relaxante", "Drenagem"], schedule: ["09:00", "11:00", "14:00", "16:00"] },
  { id: 4, name: "Beatriz Lima", role: "Cabeleireira", category: "cabelo", rating: 4.7, reviews: 82, price: 90, distance: 3.1, mode: "presencial", photo: "https://picsum.photos/seed/kira4/200/200", description: "Focada em cortes modernos e tratamentos capilares.", services: ["Corte", "Hidratação"], schedule: ["09:00", "12:00", "14:30"] },
  { id: 5, name: "Juliana Alves", role: "Cabeleireira", category: "cabelo", rating: 4.6, reviews: 51, price: 70, distance: 4.5, mode: "ambos", photo: "https://picsum.photos/seed/kira5/200/200", description: "Coloração, luzes e penteados para eventos.", services: ["Coloração", "Penteado"], schedule: ["10:00", "13:00", "16:00"] },
  { id: 6, name: "Rafael Torres", role: "Cabeleireiro", category: "cabelo", rating: 4.5, reviews: 40, price: 65, distance: 5.0, mode: "presencial", photo: "https://picsum.photos/seed/kira6/200/200", description: "Cortes masculinos e barboterapia.", services: ["Corte", "Barboterapia"], schedule: ["09:30", "11:00", "15:00"] },
  { id: 7, name: "Eduardo Ramos", role: "Barbeiro", category: "barba", rating: 4.9, reviews: 110, price: 55, distance: 1.8, mode: "presencial", photo: "https://picsum.photos/seed/kira7/200/200", description: "Barbeiro premium, especialista em navalha.", services: ["Corte", "Barba na navalha"], schedule: ["08:00", "10:30", "13:00", "16:00"] },
  { id: 8, name: "Thiago Nunes", role: "Barbeiro", category: "barba", rating: 4.4, reviews: 33, price: 45, distance: 2.6, mode: "ambos", photo: "https://picsum.photos/seed/kira8/200/200", description: "Corte rápido e acabamento em domicílio.", services: ["Corte", "Acabamento"], schedule: ["09:00", "11:00", "14:00"] },
  { id: 9, name: "Lucas Prado", role: "Barbeiro", category: "barba", rating: 4.7, reviews: 58, price: 60, distance: 3.4, mode: "presencial", photo: "https://picsum.photos/seed/kira9/200/200", description: "Especialista em degradê e desenhos.", services: ["Corte", "Desenho"], schedule: ["10:00", "12:30", "15:30"] },
  { id: 10, name: "Camila Rocha", role: "Manicure", category: "unhas", rating: 4.9, reviews: 140, price: 40, distance: 1.0, mode: "ambos", photo: "https://picsum.photos/seed/kira10/200/200", description: "Unhas em gel e nail art personalizada.", services: ["Manicure", "Nail art"], schedule: ["09:00", "10:30", "13:00", "15:00"] },
  { id: 11, name: "Patrícia Souza", role: "Manicure", category: "unhas", rating: 4.6, reviews: 47, price: 35, distance: 2.2, mode: "domicilio", photo: "https://picsum.photos/seed/kira11/200/200", description: "Atendimento domiciliar com pontualidade.", services: ["Manicure", "Pedicure"], schedule: ["09:00", "11:30", "14:00"] },
  { id: 12, name: "Larissa Dias", role: "Manicure", category: "unhas", rating: 4.8, reviews: 73, price: 50, distance: 3.9, mode: "presencial", photo: "https://picsum.photos/seed/kira12/200/200", description: "Alongamento em fibra e esmaltação em gel.", services: ["Alongamento", "Esmaltação em gel"], schedule: ["10:00", "13:00", "16:30"] },
  { id: 13, name: "Fernanda Melo", role: "Manicure", category: "unhas", rating: 4.3, reviews: 22, price: 30, distance: 4.7, mode: "ambos", photo: "https://picsum.photos/seed/kira13/200/200", description: "Cuidado delicado com esmaltação tradicional.", services: ["Manicure", "Cutilagem"], schedule: ["09:30", "12:00", "15:00"] },
  { id: 14, name: "Vanessa Cruz", role: "Esteticista", category: "estetica", rating: 4.9, reviews: 105, price: 150, distance: 1.5, mode: "presencial", photo: "https://picsum.photos/seed/kira14/200/200", description: "Limpeza de pele e tratamentos faciais avançados.", services: ["Limpeza de pele", "Peeling"], schedule: ["09:00", "11:00", "14:00", "16:00"] },
  { id: 15, name: "Bruna Ferreira", role: "Esteticista", category: "estetica", rating: 4.5, reviews: 39, price: 130, distance: 2.9, mode: "ambos", photo: "https://picsum.photos/seed/kira15/200/200", description: "Massagem modeladora e drenagem facial.", services: ["Massagem modeladora"], schedule: ["10:00", "13:30", "16:00"] },
  { id: 16, name: "Renata Gomes", role: "Esteticista", category: "estetica", rating: 4.7, reviews: 61, price: 140, distance: 3.6, mode: "presencial", photo: "https://picsum.photos/seed/kira16/200/200", description: "Especialista em sobrancelhas e design facial.", services: ["Design de sobrancelhas", "Micropigmentação"], schedule: ["09:00", "12:00", "15:00"] },
  { id: 17, name: "Débora Martins", role: "Esteticista", category: "estetica", rating: 4.2, reviews: 18, price: 100, distance: 5.2, mode: "domicilio", photo: "https://picsum.photos/seed/kira17/200/200", description: "Tratamentos faciais em domicílio.", services: ["Limpeza de pele"], schedule: ["11:00", "14:00", "17:00"] },
  { id: 18, name: "Gabriel Santos", role: "Massoterapeuta", category: "massagem", rating: 4.8, reviews: 88, price: 110, distance: 2.3, mode: "presencial", photo: "https://picsum.photos/seed/kira18/200/200", description: "Massagem terapêutica e relaxante.", services: ["Massagem terapêutica"], schedule: ["09:00", "11:30", "14:30"] },
  { id: 19, name: "André Barbosa", role: "Massoterapeuta", category: "massagem", rating: 4.4, reviews: 27, price: 90, distance: 4.1, mode: "domicilio", photo: "https://picsum.photos/seed/kira19/200/200", description: "Atendimento domiciliar com foco em relaxamento.", services: ["Massagem relaxante"], schedule: ["10:00", "13:00", "16:00"] },
  { id: 20, name: "Priscila Rocha", role: "Massoterapeuta", category: "massagem", rating: 4.6, reviews: 34, price: 100, distance: 1.9, mode: "ambos", photo: "https://picsum.photos/seed/kira20/200/200", description: "Massagem relaxante e drenagem linfática.", services: ["Drenagem linfática"], schedule: ["09:30", "12:00", "15:30"] },
];

const initialClientForm = {
  photo: "",
  selfiePhoto: "",
  name: "",
  email: "",
  phone: "",
  cpf: "",
  birth: "",
  gender: "",
  password: "",
  confirm: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  latitude: null,
  longitude: null,
  docFront: "",
  docBack: "",
  termsUse: false,
  termsPrivacy: false,
};

const initialProForm = {
  photo: "",
  name: "",
  documentType: "cpf",
  document: "",
  email: "",
  phone: "",
  birth: "",
  password: "",
  confirm: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  latitude: null,
  longitude: null,
  specialties: [],
  services: [],
  workPhotos: [],
  docFrontPhoto: "",
  docBackPhoto: "",
  termsUse: false,
  termsPrivacy: false,
};

const inputStyle = (hasError) => ({
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

const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
    <label style={{ fontSize: 12, fontWeight: 500, color: colors.foreground, fontFamily: fontBody }}>
      {label}
    </label>
    {children}
    {error && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: 0 }}>{error}</p>}
  </div>
);

const PrimaryButton = ({ children, onClick, disabled, pill, type = "button" }) => (
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

const SecondaryButton = ({ children, onClick }) => (
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

const DocUploadBox = ({ label, value, error, inputRef, onChange }) => (
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

const Header = ({ onBack }) => (
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

const StepDots = ({ total, done }) => (
  <div style={{ display: "flex", gap: 3, padding: "0 22px 4px" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < done ? colors.primary : colors.border }} />
    ))}
  </div>
);

const SearchBar = ({ value, onChange, onFilterClick }) => (
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

const CategoryChip = ({ label, active, onClick }) => (
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

const ProfessionalCard = ({ pro, onClick }) => (
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

const CompatibilityBadge = ({ value }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999,
    background: gradientKira, color: colors.primaryForeground, fontFamily: fontBody, fontSize: 11, fontWeight: 700,
  }}>
    <Sparkles size={11} /> {value}% combina com você
  </span>
);

const RecommendedProfessionalCard = ({ pro, onViewProfile }) => {
  const extras = getRankingExtras(pro);
  return (
    <div style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.card, overflow: "hidden" }}>
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

const RatingStars = ({ value, size = 12 }) => {
  const rounded = Math.round(value);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} color={colors.accent} fill={i < rounded ? colors.accent : "none"} />
      ))}
    </span>
  );
};

const rankMedalStyle = (rank) => {
  if (rank === 1) return { background: "linear-gradient(135deg, #FFD76A, #FFB84D)", color: "#5A3B00" };
  if (rank === 2) return { background: "linear-gradient(135deg, #E4E7EC, #C7CCD6)", color: colors.foreground };
  if (rank === 3) return { background: "linear-gradient(135deg, #E7B78C, #CE9564)", color: "#4A2A0E" };
  return null;
};

const RankingCard = ({ pro, rank, onClick }) => {
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

const AppointmentCard = ({ appointment, pro, onClick }) => {
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

const ProfileSection = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <p style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.mutedForeground, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>{title}</p>
    <div style={{ borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card, overflow: "hidden" }}>{children}</div>
  </div>
);

const ProfileMenuRow = ({ icon: Icon, label, onClick, destructive, last }) => (
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

const SkeletonCard = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card }}>
    <div style={{ width: 56, height: 56, borderRadius: 14, background: colors.muted, animation: "kiraPulse 1.2s ease-in-out infinite" }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ width: "55%", height: 11, borderRadius: 6, background: colors.muted, animation: "kiraPulse 1.2s ease-in-out infinite" }} />
      <div style={{ width: "35%", height: 9, borderRadius: 6, background: colors.muted, animation: "kiraPulse 1.2s ease-in-out infinite" }} />
      <div style={{ width: "45%", height: 9, borderRadius: 6, background: colors.muted, animation: "kiraPulse 1.2s ease-in-out infinite" }} />
    </div>
  </div>
);

const SkeletonLoading = ({ count = 5 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <style>{"@keyframes kiraPulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }"}</style>
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

const EmptyState = ({ onClear }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "48px 24px", textAlign: "center" }}>
    <div style={{ width: 72, height: 72, borderRadius: "50%", background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SearchX size={30} color={colors.mutedForeground} />
    </div>
    <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Nenhum profissional encontrado.</p>
    <div style={{ width: "100%", maxWidth: 220 }}><SecondaryButton onClick={onClear}>Limpar filtros</SecondaryButton></div>
  </div>
);

const ErrorState = ({ onRetry, message = "Não foi possível carregar os profissionais agora." }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "48px 24px", textAlign: "center" }}>
    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "hsl(0 84% 60% / 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AlertCircle size={30} color={colors.destructive} />
    </div>
    <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>{message}</p>
    <div style={{ width: "100%", maxWidth: 220 }}><PrimaryButton onClick={onRetry}>Tentar novamente</PrimaryButton></div>
  </div>
);

// Bottom navigation unificada dos 6 destinos do Kira. Fundo branco, cantos
// superiores arredondados, sombra bem sutil, ícones lineares com rótulo
// abaixo, estado ativo com pílula de fundo, e respeito à safe area de
// dispositivos com "ilha" inferior (iPhone com notch/gesture bar).
const BottomNav = ({ active, onNavigate }) => (
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
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
            flex: 1, minWidth: 0, padding: "6px 2px", borderRadius: 12,
            background: isActive ? "hsl(340 70% 55% / 0.1)" : "transparent",
            border: "none", cursor: "pointer",
          }}
        >
          <Icon size={18} color={isActive ? colors.primary : colors.mutedForeground} strokeWidth={isActive ? 2.3 : 1.8} />
          <span style={{ fontFamily: fontBody, fontSize: 9.5, fontWeight: isActive ? 700 : 500, color: isActive ? colors.primary : colors.mutedForeground, whiteSpace: "nowrap" }}>{item.label}</span>
        </button>
      );
    })}
  </div>
);

// NOVO — Bottom nav do profissional. Mesmos tokens visuais do BottomNav do
// cliente (fundo branco, pílula ativa, ícones lineares, safe area), só que
// aponta para os 5 destinos do painel profissional. Componente independente:
// o BottomNav original não é tocado.
const ProBottomNav = ({ active, onNavigate }) => (
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
    {proBottomNavItems.map((item) => {
      const Icon = item.icon;
      const isActive = active === item.key;
      return (
        <button
          key={item.key}
          onClick={() => onNavigate?.(item.key)}
          aria-label={item.label}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
            flex: 1, minWidth: 0, padding: "6px 2px", borderRadius: 12,
            background: isActive ? "hsl(340 70% 55% / 0.1)" : "transparent",
            border: "none", cursor: "pointer",
          }}
        >
          <Icon size={18} color={isActive ? colors.primary : colors.mutedForeground} strokeWidth={isActive ? 2.3 : 1.8} />
          <span style={{ fontFamily: fontBody, fontSize: 9.5, fontWeight: isActive ? 700 : 500, color: isActive ? colors.primary : colors.mutedForeground, whiteSpace: "nowrap" }}>{item.label}</span>
        </button>
      );
    })}
  </div>
);

// NOVO — Cartão pequeno de estatística usado no painel do profissional
// (clientes hoje, receita, nota, saldo disponível etc.).
const ProStatCard = ({ label, value, icon: Icon }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, padding: 14, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground }}>{label}</span>
      {Icon && <Icon size={13} color={colors.primary} />}
    </div>
    <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 17, color: colors.foreground }}>{value}</span>
  </div>
);

// NOVO — Gráfico de barras simples (sem libs externas, só CSS) para o
// faturamento do profissional, igual ao mockup do folheto. Funcional: cada
// barra é clicável e destaca o dia/semana selecionado (selectedIndex/onSelect
// são opcionais — sem eles o gráfico continua só ilustrativo, como antes).
const RevenueBarChart = ({ data, selectedIndex, onSelect }) => {
  const max = Math.max(...data.map((d) => d.value));
  const peakIndex = data.reduce((best, d, i, arr) => (d.value > arr[best].value ? i : best), 0);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
      {data.map((d, i) => {
        const isSelected = selectedIndex === i;
        const isPeak = i === peakIndex;
        return (
          <button
            key={d.label}
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(i); }}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: "none", border: "none", padding: 0, cursor: onSelect ? "pointer" : "default",
            }}
          >
            <div
              style={{
                width: "100%", borderRadius: 8, height: `${Math.max(10, (d.value / max) * 74)}px`,
                background: isPeak || isSelected ? gradientKira : colors.muted,
                boxShadow: isSelected ? `0 0 0 2px ${colors.primary}` : "none",
              }}
            />
            <span style={{ fontFamily: fontBody, fontSize: 10, fontWeight: isSelected ? 700 : 400, color: isSelected ? colors.primary : colors.mutedForeground }}>{d.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const FilterModal = ({
  open, mounted, onClose,
  draft, setDraft,
  onApply, onClear,
}) => {
  if (!open) return null;
  const labelStyle = { fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: "0 0 8px" };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "hsl(280 20% 15% / 0.45)", display: "flex",
        alignItems: "flex-end", justifyContent: "center", zIndex: 50,
        opacity: mounted ? 1 : 0, transition: "opacity 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 380, background: colors.card, borderRadius: "24px 24px 0 0",
          padding: "20px 24px 28px", maxHeight: "85%", overflowY: "auto",
          transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "transform 0.25s ease",
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: colors.border, margin: "0 auto 16px" }} />
        <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18, color: colors.foreground, margin: "0 0 18px" }}>Filtros</h2>

        <p style={labelStyle}>Faixa de preço</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input type="range" min={0} max={500} step={10} value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))} style={{ flex: 1, accentColor: colors.primary }} />
          <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, minWidth: 74, textAlign: "right" }}>até R$ {draft.price}</span>
        </div>

        <p style={labelStyle}>Avaliação mínima</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setDraft((d) => ({ ...d, minRating: r }))}
              style={{
                padding: "8px 12px", borderRadius: 999, border: "none",
                background: draft.minRating === r ? gradientKira : colors.muted,
                color: draft.minRating === r ? colors.primaryForeground : colors.foreground,
                fontFamily: fontBody, fontSize: 11, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              {r === 0 ? "Todas" : <>{r} <Star size={11} fill="currentColor" /></>}
            </button>
          ))}
        </div>

        <p style={labelStyle}>Distância máxima</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input type="range" min={1} max={30} step={1} value={draft.maxDistance} onChange={(e) => setDraft((d) => ({ ...d, maxDistance: Number(e.target.value) }))} style={{ flex: 1, accentColor: colors.primary }} />
          <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, minWidth: 56, textAlign: "right" }}>{draft.maxDistance} km</span>
        </div>

        <p style={labelStyle}>Atendimento</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["presencial", "Presencial"], ["domicilio", "Domicílio"], ["ambos", "Ambos"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDraft((d) => ({ ...d, mode: key }))}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 12,
                border: `1px solid ${draft.mode === key ? colors.primary : colors.border}`,
                background: draft.mode === key ? "hsl(340 70% 55% / 0.08)" : colors.card,
                color: colors.foreground, fontFamily: fontBody, fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <p style={labelStyle}>Ordenar por</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {[["proximo", "Mais próximo"], ["avaliado", "Melhor avaliado"], ["preco", "Menor preço"], ["recomendado", "Mais recomendado"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDraft((d) => ({ ...d, sort: key }))}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12,
                border: `1px solid ${draft.sort === key ? colors.primary : colors.border}`,
                background: draft.sort === key ? "hsl(340 70% 55% / 0.08)" : colors.card, cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground }}>{label}</span>
              {draft.sort === key && <CheckCircle2 size={16} color={colors.primary} />}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><SecondaryButton onClick={onClear}>Limpar filtros</SecondaryButton></div>
          <div style={{ flex: 1 }}><PrimaryButton onClick={onApply}>Aplicar</PrimaryButton></div>
        </div>
      </div>
    </div>
  );
};

const CalendarHeader = ({ monthDate, onPrev, onNext, canGoPrev }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <button
      onClick={onPrev}
      disabled={!canGoPrev}
      aria-label="Mês anterior"
      style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: canGoPrev ? "pointer" : "not-allowed", opacity: canGoPrev ? 1 : 0.4 }}
    >
      <ChevronLeft size={17} color={colors.foreground} />
    </button>
    <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, textTransform: "capitalize" }}>
      {monthDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
    </span>
    <button
      onClick={onNext}
      aria-label="Próximo mês"
      style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
    >
      <ChevronRight size={17} color={colors.foreground} />
    </button>
  </div>
);

const CalendarDay = ({ cell, selected, onClick }) => {
  const disabled = !cell.inMonth || cell.unavailable;
  return (
    <button
      onClick={() => !disabled && onClick(cell.date)}
      disabled={disabled}
      style={{
        aspectRatio: "1/1",
        borderRadius: 12,
        border: cell.isToday && !selected ? `1.5px solid ${colors.primary}` : "1.5px solid transparent",
        background: selected ? gradientKira : "transparent",
        color: !cell.inMonth ? colors.border : cell.unavailable ? colors.mutedForeground : selected ? colors.primaryForeground : colors.foreground,
        opacity: !cell.inMonth ? 0.35 : cell.unavailable ? 0.5 : 1,
        textDecoration: cell.unavailable && cell.inMonth ? "line-through" : "none",
        fontFamily: fontBody,
        fontSize: 13,
        fontWeight: selected ? 700 : 500,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease",
        transform: selected ? "scale(1.05)" : "scale(1)",
      }}
    >
      {cell.date.getDate()}
    </button>
  );
};

const CalendarMonth = ({ monthDate, selectedDate, today, monthKey, onSelect }) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month, 1 - (startOffset - i));
    cells.push({ date: d, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return (
    <div key={monthKey} style={{ animation: "kiraCalendarFade 0.25s ease" }}>
      <style>{"@keyframes kiraCalendarFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }"}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
        {weekDays.map((w) => (
          <span key={w} style={{ textAlign: "center", fontFamily: fontBody, fontSize: 10, fontWeight: 700, color: colors.mutedForeground }}>{w}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((cell, i) => {
          const midnight = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate());
          const isPast = midnight < today;
          const isSunday = cell.date.getDay() === 0;
          const unavailable = cell.inMonth && (isPast || isSunday);
          const isToday = midnight.getTime() === today.getTime();
          const isSelected = !!selectedDate && midnight.getTime() === selectedDate.getTime();
          return (
            <CalendarDay key={i} cell={{ ...cell, unavailable, isToday }} selected={isSelected} onClick={onSelect} />
          );
        })}
      </div>
    </div>
  );
};

const TimeSlotButton = ({ time, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "10px 6px", borderRadius: 12,
      border: `1px solid ${selected ? colors.primary : colors.border}`,
      background: selected ? gradientKira : colors.card,
      color: selected ? colors.primaryForeground : colors.foreground,
      fontFamily: fontBody, fontSize: 12, fontWeight: selected ? 700 : 500, cursor: "pointer",
      transition: "background 0.2s ease, transform 0.15s ease",
      transform: selected ? "scale(1.04)" : "scale(1)",
    }}
  >
    <Clock size={12} color={selected ? colors.primaryForeground : colors.mutedForeground} /> {time}
  </button>
);

const TimeSlotGrid = ({ times, selectedTime, onSelect }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
    {times.map((time) => (
      <TimeSlotButton key={time} time={time} selected={selectedTime === time} onClick={() => onSelect(time)} />
    ))}
  </div>
);

const EmptySchedule = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "28px 16px", textAlign: "center" }}>
    <span style={{ fontSize: 28 }}>📅</span>
    <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.foreground, fontWeight: 600, margin: 0 }}>Nenhum horário disponível nesta data.</p>
    <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>Escolha outro dia.</p>
  </div>
);

const LoadingSchedule = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
    <style>{"@keyframes kiraPulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }"}</style>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ height: 38, borderRadius: 12, background: colors.muted, animation: "kiraPulse 1.2s ease-in-out infinite" }} />
    ))}
  </div>
);

// Gera os horários disponíveis de um profissional em uma data específica.
// Mock determinístico por enquanto — no futuro, substituir o corpo desta função
// por uma chamada à API (ex: GET /profissionais/:id/disponibilidade?data=YYYY-MM-DD),
// que deverá consultar a tabela de disponibilidade do profissional no PostgreSQL.
// A assinatura (date, pro) => string[] pode permanecer a mesma para a integração real.
const getDaySchedule = (date, pro) => {
  const day = date.getDate();
  const base = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  if (day % 6 === 0) return []; // dia sem horários disponíveis (exemplo mockado)
  const seed = (day * 7 + pro.id * 13) % base.length;
  const count = 3 + (day % 4);
  const slots = [];
  for (let i = 0; i < count; i++) slots.push(base[(seed + i * 3) % base.length]);
  return Array.from(new Set(slots)).sort();
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// ==========================================================================
// Ranking personalizado — recomendação de profissionais
// ==========================================================================
// Dados extras de ranking para os profissionais mockados: próximo horário
// disponível e algumas fotos de portfólio (reaproveitando os picsum seeds
// já usados em outros lugares do protótipo, só que em outro tamanho).
// No backend real, isso viria do profissional (workPhotos) e da agenda dele.
const proRankingExtras = {
  1: { nextSlot: "Hoje às 15:30", portfolio: ["https://picsum.photos/seed/kiraport1a/160/160", "https://picsum.photos/seed/kiraport1b/160/160"] },
  2: { nextSlot: "Hoje às 17:00", portfolio: ["https://picsum.photos/seed/kiraport2a/160/160", "https://picsum.photos/seed/kiraport2b/160/160"] },
  3: { nextSlot: "Amanhã às 09:00", portfolio: ["https://picsum.photos/seed/kiraport3a/160/160", "https://picsum.photos/seed/kiraport3b/160/160"] },
  4: { nextSlot: "Amanhã às 12:00", portfolio: ["https://picsum.photos/seed/kiraport4a/160/160", "https://picsum.photos/seed/kiraport4b/160/160"] },
  7: { nextSlot: "Hoje às 16:00", portfolio: ["https://picsum.photos/seed/kiraport7a/160/160", "https://picsum.photos/seed/kiraport7b/160/160"] },
  10: { nextSlot: "Hoje às 15:00", portfolio: ["https://picsum.photos/seed/kiraport10a/160/160", "https://picsum.photos/seed/kiraport10b/160/160"] },
  14: { nextSlot: "Amanhã às 11:00", portfolio: ["https://picsum.photos/seed/kiraport14a/160/160", "https://picsum.photos/seed/kiraport14b/160/160"] },
  18: { nextSlot: "Hoje às 14:30", portfolio: ["https://picsum.photos/seed/kiraport18a/160/160", "https://picsum.photos/seed/kiraport18b/160/160"] },
};

const getRankingExtras = (pro) =>
  proRankingExtras[pro.id] || { nextSlot: "Consultar disponibilidade", portfolio: [pro.photo] };

// Detalhes extras para a tela de Perfil do Profissional (verificação, endereço,
// portfólio completo, avaliações em texto e próximos horários). Mantido
// separado de `mockProfessionals` para não reescrever a estrutura já
// existente — no backend real, viria tudo do mesmo registro do profissional.
const proProfileExtras = {
  1: {
    verified: true,
    address: "Av. T-4, Setor Bueno, Goiânia - GO",
    portfolio: ["https://picsum.photos/seed/kiraprof1a/300/300", "https://picsum.photos/seed/kiraprof1b/300/300", "https://picsum.photos/seed/kiraprof1c/300/300"],
    reviewComments: [
      { author: "Camila R.", stars: 5, text: "Adorei o corte, ficou exatamente como eu queria." },
      { author: "Juliana S.", stars: 5, text: "Atendimento super atencioso e pontual." },
    ],
  },
  2: {
    verified: true,
    address: "Rua 9, Setor Oeste, Goiânia - GO",
    portfolio: ["https://picsum.photos/seed/kiraprof2a/300/300", "https://picsum.photos/seed/kiraprof2b/300/300"],
    reviewComments: [{ author: "Rafael M.", stars: 5, text: "Melhor barbeiro da região, recomendo." }],
  },
  10: {
    verified: true,
    address: "Av. República do Líbano, Setor Oeste, Goiânia - GO",
    portfolio: ["https://picsum.photos/seed/kiraprof10a/300/300", "https://picsum.photos/seed/kiraprof10b/300/300", "https://picsum.photos/seed/kiraprof10c/300/300"],
    reviewComments: [
      { author: "Fernanda A.", stars: 5, text: "Nail art perfeita, super caprichosa." },
      { author: "Larissa D.", stars: 4, text: "Ótimo trabalho, só demorou um pouco mais que o previsto." },
    ],
  },
  14: {
    verified: true,
    address: "Av. T-63, Setor Bueno, Goiânia - GO",
    portfolio: ["https://picsum.photos/seed/kiraprof14a/300/300", "https://picsum.photos/seed/kiraprof14b/300/300"],
    reviewComments: [{ author: "Beatriz L.", stars: 5, text: "Minha pele nunca esteve tão bem cuidada." }],
  },
};

const getProfileExtras = (pro) =>
  proProfileExtras[pro.id] || {
    verified: pro.rating >= 4.6,
    address: `Goiânia - GO, próximo ao ${pro.neighborhood || "centro"}`,
    portfolio: [pro.photo],
    reviewComments: [],
  };

// ---------- Agenda (mock) ----------
// Estrutura pensada para já nascer no formato que o backend real (endpoint
// de agendamentos) deve devolver: profissional, serviço, data/hora, local,
// preço, forma de pagamento e status.
const appointmentsMock = [
  {
    id: "ag1",
    proId: 1,
    service: "Corte feminino",
    date: "Hoje",
    time: "15:30",
    place: "Studio Bella",
    price: 80,
    payment: "Pix",
    status: "proximo",
  },
  {
    id: "ag2",
    proId: 10,
    service: "Alongamento em gel",
    date: "Amanhã",
    time: "10:30",
    place: "Studio Camila Rocha",
    price: 120,
    payment: "Cartão de crédito",
    status: "proximo",
  },
  {
    id: "ag3",
    proId: 2,
    service: "Corte + barba",
    date: "18/08",
    time: "11:00",
    place: "Barbearia Carlos Silva",
    price: 90,
    payment: "Pix",
    status: "concluido",
    rated: false,
  },
  {
    id: "ag4",
    proId: 14,
    service: "Limpeza de pele",
    date: "05/08",
    time: "14:00",
    place: "Espaço Vanessa Cruz",
    price: 150,
    payment: "Cartão de débito",
    status: "concluido",
    rated: true,
  },
  {
    id: "ag5",
    proId: 7,
    service: "Barba na navalha",
    date: "22/07",
    time: "16:00",
    place: "Barbearia Eduardo Ramos",
    price: 55,
    payment: "Pix",
    status: "cancelado",
  },
];

const appointmentTabs = [
  { id: "proximo", label: "Próximos" },
  { id: "concluido", label: "Concluídos" },
  { id: "cancelado", label: "Cancelados" },
];

// ---------- Menu de Perfil da cliente ----------
// Cada linha navega para uma tela própria (render*), reaproveitando os dados
// já existentes no app (cForm, appointmentsMock) em vez de duplicá-los.
const clientProfileMenu = [
  {
    title: "Minha conta",
    items: [
      { label: "Editar perfil", icon: Settings, go: "clientProfileEdit" },
      { label: "Dados pessoais", icon: User, go: "clientProfileEdit" },
      { label: "Endereço", icon: MapPin, go: "clientAddress" },
      { label: "Preferências", icon: Sparkles, go: "clientPreferences" },
    ],
  },
  {
    title: "Minha atividade",
    items: [
      { label: "Meus agendamentos", icon: Calendar, go: "clientAgenda" },
      { label: "Minhas avaliações", icon: Star, go: "clientReviews" },
      { label: "Profissionais favoritos", icon: Bookmark, go: "clientFavorites" },
      { label: "Histórico", icon: Clock, go: "clientHistory" },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      { label: "Formas de pagamento", icon: CreditCard, go: "clientPaymentMethods" },
      { label: "Histórico de pagamentos", icon: Clock, go: "clientPaymentHistory" },
      { label: "Cupons e gift cards", icon: Gift, go: "clientCoupons" },
    ],
  },
  {
    title: "Privacidade e segurança",
    items: [
      { label: "Dados e privacidade", icon: ShieldCheck, go: "clientPrivacyData" },
      { label: "Consentimentos LGPD", icon: ShieldCheck, go: "clientLgpdConsents" },
      { label: "Segurança da conta", icon: BadgeCheck, go: "clientAccountSecurity" },
    ],
  },
  {
    title: "Suporte",
    items: [{ label: "Ajuda e suporte", icon: HelpCircle, go: "clientHelpSupport" }],
  },
];

// Avaliações que a cliente já deixou para profissionais atendidos (mock).
// Chaveado pelo id do agendamento em `appointmentsMock` — quando o backend
// real existir, isso vem do mesmo registro do agendamento (campo `review`).
const clientReviewsMock = {
  ag4: { rating: 5, text: "Atendimento impecável, super recomendo!", date: "06/08" },
};

// ---------- Navegação inferior (6 destinos) ----------
const bottomNavItems = [
  { label: "Home", icon: Home, key: "clientHome" },
  { label: "Buscar", icon: Search, key: "clientSearch" },
  { label: "Provador", icon: Wand2, key: "clientTryOnReference" },
  { label: "Agenda", icon: Calendar, key: "clientAgenda" },
  { label: "Ranking", icon: Trophy, key: "clientRanking" },
  { label: "Perfil", icon: User, key: "clientProfile" },
];

// ==========================================================================
// NOVO — Painel do profissional (mock)
// ==========================================================================
// Dados mockados para as telas do lado profissional descritas no folheto
// "Kira para Profissionais": painel com métricas e faturamento semanal,
// agenda com confirmação, Gift Cards, transações e fidelização. Tudo 100%
// aditivo — nenhuma estrutura, dado ou tela do cliente foi alterada.
const proWeeklyRevenue = [
  { label: "Seg", value: 420 },
  { label: "Ter", value: 380 },
  { label: "Qua", value: 510 },
  { label: "Qui", value: 460 },
  { label: "Sex", value: 600 },
  { label: "Sáb", value: 980 },
  { label: "Dom", value: 240 },
];

// Faturamento por semana do mês corrente, usado na alternância
// "Semana / Mês" da tela de gestão financeira (Financeiro).
const proMonthlyRevenue = [
  { label: "S1", value: 2860 },
  { label: "S2", value: 3120 },
  { label: "S3", value: 2740 },
  { label: "S4", value: 3590 },
];

const proDashboardStats = { clientsToday: 6, weeklyRevenue: 1240, rating: 4.9, revenueDelta: 18 };

// Dados para a tela de Analytics: atendimentos por dia, serviços mais
// procurados, distribuição de avaliações e métricas-resumo de desempenho.
const proAppointmentsWeekMock = [
  { label: "Seg", value: 3 },
  { label: "Ter", value: 2 },
  { label: "Qua", value: 4 },
  { label: "Qui", value: 3 },
  { label: "Sex", value: 5 },
  { label: "Sáb", value: 7 },
  { label: "Dom", value: 1 },
];

const proServiceRankingMock = [
  { service: "Escova modeladora", count: 18, revenue: 720 },
  { service: "Manicure completa", count: 14, revenue: 560 },
  { service: "Coloração", count: 9, revenue: 990 },
  { service: "Design de sobrancelhas", count: 7, revenue: 210 },
];

const proRatingBreakdownMock = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const proAnalyticsSummary = { avgTicket: 62, retentionRate: 68, completionRate: 94 };

const proUpcomingMock = [
  { id: "pa1", client: "Ana Souza", time: "10:30", service: "Coloração" },
  { id: "pa2", client: "Rafael Lima", time: "13:00", service: "Corte" },
  { id: "pa3", client: "Beatriz Nunes", time: "15:30", service: "Escova" },
];

// Agenda do profissional por dia (mock). Chave = "ano-mês-dia" (mês
// zero-indexado, igual ao Date do JS) relativa a hoje, para sempre ter dados
// de exemplo nos primeiros dias em que o protótipo for aberto.
const proAgendaMock = {};
(function seedProAgenda() {
  const base = new Date();
  const samples = [
    [
      { client: "Ana Souza", time: "10:30", service: "Coloração", status: "confirmado" },
      { client: "Rafael Lima", time: "13:00", service: "Corte", status: "confirmado" },
    ],
    [{ client: "Beatriz Nunes", time: "09:00", service: "Escova", status: "pendente" }],
    [],
    [{ client: "Camila Alves", time: "16:00", service: "Hidratação", status: "confirmado" }],
  ];
  samples.forEach((dayAppointments, offset) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
    proAgendaMock[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`] = dayAppointments;
  });
})();

const proGiftCardsMock = [
  { id: "gc1", code: "KIRA-8F2A", value: 100, buyer: "Ana Souza", status: "ativo" },
  { id: "gc2", code: "KIRA-3D91", value: 50, buyer: "Rafael Lima", status: "usado" },
];

const proTransactionsMock = [
  { id: "tx1", client: "Ana Souza", service: "Coloração", date: "Hoje", value: 180, method: "Pix" },
  { id: "tx2", client: "Rafael Lima", service: "Corte", date: "Ontem", value: 60, method: "Cartão" },
  { id: "tx3", client: "Beatriz Nunes", service: "Escova", date: "12/07", value: 70, method: "Gift Card Kira" },
];

const initialLoyaltySettings = { enabled: true, pointsPerReal: 1, cashbackPercent: 5 };

// Menu de Perfil do profissional — mesma lógica do clientProfileMenu (cada
// linha navega para uma tela própria via `go`).
const proProfileMenu = [
  {
    title: "Minha atividade",
    items: [
      { label: "Minha agenda", icon: Calendar, go: "proAgendaDash" },
      { label: "Analytics", icon: BarChart3, go: "proAnalytics" },
      { label: "Financeiro", icon: CreditCard, go: "proFinance" },
    ],
  },
  {
    title: "Ganhos e recompensas",
    items: [
      { label: "Gift Cards Kira", icon: Gift, go: "proGiftCards" },
      { label: "Programa de fidelidade", icon: Star, go: "proLoyalty" },
    ],
  },
  {
    title: "Segurança e confiança",
    items: [{ label: "Segurança Kira", icon: ShieldCheck, go: "proSecurity" }],
  },
  {
    title: "Suporte",
    items: [{ label: "Ajuda e suporte", icon: HelpCircle, go: "proHelp" }],
  },
];

// Destinos da bottom nav do profissional, conforme o mockup do folheto
// "Kira para Profissionais" (Início, Buscar, Agenda, Perfil).
// Componente próprio (ProBottomNav) — o BottomNav do cliente não é alterado.
const proBottomNavItems = [
  { label: "Início", icon: Home, key: "proHome" },
  { label: "Buscar", icon: Search, key: "proSearch" },
  { label: "Agenda", icon: Calendar, key: "proAgendaDash" },
  { label: "Perfil", icon: User, key: "proProfileMenu" },
];

// Calcula um score de compatibilidade (0 a 1) entre um profissional e os
// critérios informados pela cliente. Fica isolado em sua própria função para
// que, quando o algoritmo de visão computacional (busca por imagem de
// referência) estiver pronto, baste plugar o resultado dele aqui como mais
// um fator — sem mexer no restante da tela.
function scoreProfessional(pro, { service, category, referenceImage, preferences, location, priceRange, minRating } = {}) {
  let score = 0;
  let weightTotal = 0;

  // Avaliação (peso 0.30)
  weightTotal += 0.3;
  score += 0.3 * (pro.rating / 5);

  // Quantidade de avaliações, com saturação (peso 0.15)
  weightTotal += 0.15;
  score += 0.15 * Math.min(pro.reviews / 150, 1);

  // Distância (peso 0.20) — quanto mais perto, melhor
  weightTotal += 0.2;
  score += 0.2 * Math.max(0, 1 - pro.distance / 10);

  // Correspondência de serviço/categoria desejada (peso 0.20)
  weightTotal += 0.2;
  if (category) {
    score += 0.2 * (pro.category === category ? 1 : 0.15);
  } else if (service) {
    const matches = pro.category === service || pro.services.some((s) => s.toLowerCase().includes(String(service).toLowerCase()));
    score += 0.2 * (matches ? 1 : 0.3);
  } else {
    score += 0.2 * 0.6; // sem serviço/categoria definidos, pontuação neutra
  }

  // Faixa de preço (peso 0.10)
  weightTotal += 0.1;
  if (priceRange && priceRange.max) {
    score += 0.1 * (pro.price <= priceRange.max ? 1 : 0.2);
  } else {
    score += 0.1 * 0.7;
  }

  // Similaridade visual entre a referência da cliente e o portfólio do
  // profissional (peso 0.05). Hoje é um placeholder determinístico; quando a
  // busca por imagem/visão computacional estiver integrada, substituir por
  // referenceImage.similarityTo(pro.portfolioEmbeddings) ou equivalente.
  weightTotal += 0.05;
  if (referenceImage) {
    const pseudoSimilarity = 0.6 + ((pro.id * 37) % 40) / 100; // 0.60–0.99, mock
    score += 0.05 * pseudoSimilarity;
  } else {
    score += 0.05 * 0.6;
  }

  return Math.max(0, Math.min(1, score / weightTotal));
}

// Serviço/função modular de recomendação. Recebe os critérios da cliente e
// devolve os profissionais ordenados por score, cada um com seu
// `compatibility` (0–100) já calculado.
//
// Hoje funciona 100% sobre `mockProfessionals`. Quando a API de recomendação
// (GET /recomendacoes?servico=&imagem=&lat=&lng=&precoMax=...) estiver
// pronta, o corpo desta função deve trocar para uma chamada fetch/axios que
// devolva a mesma forma de dado (lista de profissionais com `compatibility`),
// sem precisar alterar `renderClientRanking` nem os componentes de card.
function recommendProfessionals({ service, category, referenceImage, preferences = [], location, priceRange, minRating, limit = 3 } = {}) {
  let pool = mockProfessionals;
  if (category && category !== "todos") pool = pool.filter((p) => p.category === category);
  else if (preferences && preferences.length > 0) pool = pool.filter((p) => preferences.includes(p.category));
  if (minRating) pool = pool.filter((p) => p.rating >= minRating);
  const source = pool.length > 0 ? pool : mockProfessionals;

  return source
    .map((pro) => ({ ...pro, compatibility: Math.round(scoreProfessional(pro, { service, category, referenceImage, preferences, location, priceRange, minRating }) * 100) }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
}

export default function KiraSignupUnified() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [screen, setScreen] = useState("splash");
  const [accountType, setAccountType] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [cForm, setCForm] = useState(initialClientForm);
  const [cErrors, setCErrors] = useState({});
  const [cShowPassword, setCShowPassword] = useState(false);
  const [cShowConfirm, setCShowConfirm] = useState(false);
  const [cCepLoading, setCCepLoading] = useState(false);
  const [cLocationStatus, setCLocationStatus] = useState("idle");
  const cFileInputRef = useRef(null);
  const cDocFrontRef = useRef(null);
  const cDocBackRef = useRef(null);

  const [cSelfieStatus, setCSelfieStatus] = useState("idle"); // idle | streaming | error | captured
  const [cSelfieError, setCSelfieError] = useState("");
  const cSelfieVideoRef = useRef(null);
  const cSelfieCanvasRef = useRef(null);
  const cSelfieStreamRef = useRef(null);

  const [cPreferences, setCPreferences] = useState([]);
  const toggleCPreference = (id) => {
    setCPreferences((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  // ---------- Busca de profissionais ----------
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [appliedFilters, setAppliedFilters] = useState(defaultSearchFilters);
  const [draftFilters, setDraftFilters] = useState(defaultSearchFilters);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterModalMounted, setFilterModalMounted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProId, setSelectedProId] = useState(null);
  const [bookedSlot, setBookedSlot] = useState(null);
  const [viewMonth, setViewMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(false);
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const retriedDatesRef = useRef(new Set());
  const today = startOfDay(new Date());

  const loadSchedule = (date) => {
    setScheduleLoading(true);
    setScheduleError(false);
    setScheduleTime(null);
    setTimeout(() => {
      const key = date.toDateString();
      const simulateError = date.getDate() % 13 === 0 && !retriedDatesRef.current.has(key);
      setScheduleLoading(false);
      setScheduleError(simulateError);
    }, 500);
  };

  const selectScheduleDate = (date) => {
    setSelectedDate(date);
    loadSchedule(date);
  };

  const retrySchedule = () => {
    if (!selectedDate) return;
    retriedDatesRef.current.add(selectedDate.toDateString());
    loadSchedule(selectedDate);
  };

  const changeMonth = (delta) => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setMonthAnimKey((k) => k + 1);
  };
  const searchListRef = useRef(null);
  const pullStartY = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);

  const filteredProfessionals = mockProfessionals
    .filter((p) => {
      if (categoryFilter !== "todos" && p.category !== categoryFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q && q !== "erro") {
        const haystack = `${p.name} ${p.role} ${p.category} ${p.services.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (p.price > appliedFilters.price) return false;
      if (appliedFilters.minRating > 0 && p.rating < appliedFilters.minRating) return false;
      if (p.distance > appliedFilters.maxDistance) return false;
      if (appliedFilters.mode !== "ambos" && p.mode !== "ambos" && p.mode !== appliedFilters.mode) return false;
      return true;
    })
    .sort((a, b) => {
      if (appliedFilters.sort === "avaliado") return b.rating - a.rating;
      if (appliedFilters.sort === "preco") return a.price - b.price;
      if (appliedFilters.sort === "recomendado") return b.reviews - a.reviews;
      return a.distance - b.distance;
    });

  const searchHasError = searchQuery.trim().toLowerCase() === "erro";

  const openFilterModal = () => {
    setDraftFilters(appliedFilters);
    setFilterModalOpen(true);
    setTimeout(() => setFilterModalMounted(true), 10);
  };
  const closeFilterModal = () => {
    setFilterModalMounted(false);
    setTimeout(() => setFilterModalOpen(false), 200);
  };
  const applyFilters = () => { setAppliedFilters(draftFilters); closeFilterModal(); };
  const clearFilters = () => { setDraftFilters(defaultSearchFilters); setAppliedFilters(defaultSearchFilters); setCategoryFilter("todos"); closeFilterModal(); };

  const runSearchLoad = () => {
    setSearchLoading(true);
    setVisibleCount(8);
    setTimeout(() => setSearchLoading(false), 650);
  };

  useEffect(() => {
    if (screen === "clientSearch") runSearchLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => { setVisibleCount(8); }, [searchQuery, categoryFilter, appliedFilters]);

  const handleSearchScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      setVisibleCount((v) => Math.min(v + 8, filteredProfessionals.length));
    }
  };

  const handlePullStart = (e) => {
    if (searchListRef.current && searchListRef.current.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const handlePullMove = (e) => {
    if (pullStartY.current === null) return;
    const diff = e.touches[0].clientY - pullStartY.current;
    if (diff > 0) setPullDistance(Math.min(diff, 80));
  };
  const handlePullEnd = () => {
    if (pullDistance > 55) {
      setRefreshing(true);
      setTimeout(() => { setRefreshing(false); runSearchLoad(); }, 600);
    }
    setPullDistance(0);
    pullStartY.current = null;
  };

  const goToTab = (key) => {
    const tabKeys = bottomNavItems.map((i) => i.key);
    if (!tabKeys.includes(key)) return;
    if (key === "clientRanking") setRankingSource("direct");
    setScreen(key);
  };

  const [pForm, setPForm] = useState(initialProForm);
  const [pErrors, setPErrors] = useState({});
  const [pShowPassword, setPShowPassword] = useState(false);
  const [pShowConfirm, setPShowConfirm] = useState(false);
  const [pCepLoading, setPCepLoading] = useState(false);
  const [pLocationStatus, setPLocationStatus] = useState("idle");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [serviceDraft, setServiceDraft] = useState({ name: "", price: "", duration: "" });
  const pFileInputRef = useRef(null);
  const pWorkPhotosInputRef = useRef(null);
  const pDocFrontRef = useRef(null);
  const pDocBackRef = useRef(null);

  // ---------- NOVO: Painel do profissional ----------
  const goToProTab = (key) => {
    const tabKeys = proBottomNavItems.map((i) => i.key);
    if (!tabKeys.includes(key)) return;
    setScreen(key);
  };

  const [proViewMonth, setProViewMonth] = useState(startOfMonth(new Date()));
  const [proSelectedDate, setProSelectedDate] = useState(startOfDay(new Date()));
  const [proMonthAnimKey, setProMonthAnimKey] = useState(0);

  const changeProMonth = (delta) => {
    setProViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setProMonthAnimKey((k) => k + 1);
  };

  const getProDayAppointments = (date) => proAgendaMock[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] || [];

  const [loyaltySettings, setLoyaltySettings] = useState(initialLoyaltySettings);

  const [proHomeRevenueSel, setProHomeRevenueSel] = useState(null);
  const [proAnalyticsSel, setProAnalyticsSel] = useState(null);
  const [financePeriod, setFinancePeriod] = useState("semana");
  const [financeRevenueSel, setFinanceRevenueSel] = useState(null);
  const financeData = financePeriod === "semana" ? proWeeklyRevenue : proMonthlyRevenue;

  const [faceStatus, setFaceStatus] = useState("idle");
  const [faceProgress, setFaceProgress] = useState(0);
  const [faceReturnTo, setFaceReturnTo] = useState("home");
  const [faceBackTo, setFaceBackTo] = useState("terms");

  // ---------- Ranking (personalizado quando vem do Provador, geral quando acessado direto) ----------
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [rankingSource, setRankingSource] = useState("direct"); // "direct" | "provador"
  const [rankingCategory, setRankingCategory] = useState("todos");

  const loadRanking = () => {
    setRankingLoading(true);
    setRankingError(false);
    setTimeout(() => {
      try {
        const results = recommendProfessionals({
          service: cPreferences[0] || null,
          category: rankingSource === "direct" ? rankingCategory : null,
          referenceImage: rankingSource === "provador" ? tryOnReference : null,
          preferences: cPreferences,
          location: cForm.latitude && cForm.longitude ? { lat: cForm.latitude, lng: cForm.longitude } : null,
          priceRange: null,
          limit: rankingSource === "provador" ? 3 : 10,
        });
        setRecommended(results);
        setRankingLoading(false);
      } catch (err) {
        setRankingLoading(false);
        setRankingError(true);
      }
    }, 550);
  };

  useEffect(() => {
    if (screen === "clientRanking") loadRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, rankingSource, rankingCategory]);

  // ---------- Provador virtual ----------
  const [tryOnReference, setTryOnReference] = useState("");
  const [tryOnClientPhoto, setTryOnClientPhoto] = useState("");
  const tryOnRefInputRef = useRef(null);
  const tryOnPhotoInputRef = useRef(null);

  const startTryOnFlow = () => {
    setTryOnReference("");
    setTryOnClientPhoto("");
    setScreen("clientTryOnReference");
  };

  const goToPersonalizedRanking = () => {
    setRankingSource("provador");
    setScreen("clientRanking");
  };

  // ---------- Agenda ----------
  const [agendaTab, setAgendaTab] = useState("proximo");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // ---------- Perfil da cliente: sub-páginas ----------
  const [profileSaveStatus, setProfileSaveStatus] = useState("idle"); // idle | saving | success
  const [favoriteProIds, setFavoriteProIds] = useState([]);
  const toggleFavoriteProfessional = (id) =>
    setFavoriteProIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const validateProfileEdit = () => {
    const e = {};
    if (!cForm.name.trim() || cForm.name.trim().length < 3 || !/\s/.test(cForm.name.trim())) e.name = "Informe nome e sobrenome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cForm.email)) e.email = "E-mail inválido";
    if (onlyDigits(cForm.phone).length < 10) e.phone = "Telefone incompleto";
    setCErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveProfileEdit = () => {
    if (!validateProfileEdit()) return;
    setProfileSaveStatus("saving");
    setTimeout(() => {
      setProfileSaveStatus("success");
      setTimeout(() => { setProfileSaveStatus("idle"); setScreen("clientProfile"); }, 700);
    }, 700);
  };

  const setCField = (key, value) => {
    setCForm((f) => ({ ...f, [key]: value }));
    if (cErrors[key]) setCErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };
  const setPField = (key, value) => {
    setPForm((f) => ({ ...f, [key]: value }));
    if (pErrors[key]) setPErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const handlePhoto = (file, setter) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleWorkPhotos = (files) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => setPForm((f) => ({ ...f, workPhotos: [...f.workPhotos, String(reader.result)] }));
      reader.readAsDataURL(file);
    });
  };

  const validateClientPersonal = () => {
    const e = {};
    if (!cForm.photo) e.photo = "Adicione uma foto de perfil";
    if (!cForm.name.trim() || cForm.name.trim().length < 3 || !/\s/.test(cForm.name.trim())) e.name = "Informe nome e sobrenome";
    if (!isValidCpf(cForm.cpf)) e.cpf = "CPF inválido";
    if (!cForm.birth) e.birth = "Informe sua data de nascimento";
    else {
      const age = (Date.now() - new Date(cForm.birth).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) e.birth = "Você precisa ter pelo menos 18 anos";
    }
    if (!cForm.gender) e.gender = "Selecione uma opção";
    if (onlyDigits(cForm.phone).length < 10) e.phone = "Telefone incompleto";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cForm.email)) e.email = "E-mail inválido";
    if (cForm.password.length < 8 || !/[A-Z]/.test(cForm.password) || !/[0-9]/.test(cForm.password)) e.password = "Mínimo 8 caracteres, com maiúscula e número";
    if (cForm.password !== cForm.confirm) e.confirm = "As senhas não coincidem";
    setCErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateAddress = (form, setErrors) => {
    const e = {};
    if (onlyDigits(form.cep).length !== 8) e.cep = "CEP inválido";
    if (!form.street.trim()) e.street = "Informe a rua";
    if (!form.number.trim()) e.number = "Informe o número";
    if (!form.neighborhood.trim()) e.neighborhood = "Informe o bairro";
    if (!form.city.trim()) e.city = "Informe a cidade";
    if (form.state.trim().length !== 2) e.state = "Use a sigla do estado (ex.: GO)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateTerms = (form, setErrors) => {
    const e = {};
    if (!form.termsUse) e.termsUse = "Aceite os Termos de Uso para continuar";
    if (!form.termsPrivacy) e.termsPrivacy = "Aceite a Política de Privacidade para continuar";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateProPersonal = () => {
    const e = {};
    if (!pForm.photo) e.photo = "Adicione uma foto de perfil";
    if (!pForm.name.trim() || pForm.name.trim().length < 3 || !/\s/.test(pForm.name.trim())) e.name = "Informe nome e sobrenome";
    const docValid = pForm.documentType === "cpf" ? isValidCpf(pForm.document) : isValidCnpj(pForm.document);
    if (!docValid) e.document = "Documento inválido";
    if (!pForm.birth) e.birth = "Informe sua data de nascimento";
    else {
      const age = (Date.now() - new Date(pForm.birth).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) e.birth = "Você precisa ter pelo menos 18 anos";
    }
    if (onlyDigits(pForm.phone).length < 10) e.phone = "Telefone incompleto";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pForm.email)) e.email = "E-mail inválido";
    if (pForm.password.length < 8 || !/[A-Z]/.test(pForm.password) || !/[0-9]/.test(pForm.password)) e.password = "Mínimo 8 caracteres, com maiúscula e número";
    if (pForm.password !== pForm.confirm) e.confirm = "As senhas não coincidem";
    setPErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCepBlur = (form, setter, setLoading) => {
    const digits = onlyDigits(form.cep);
    if (digits.length !== 8) return;
    setLoading(true);
    setTimeout(() => {
      setter((f) => ({
        ...f,
        street: f.street || "Av. T-4",
        neighborhood: f.neighborhood || "Setor Bueno",
        city: f.city || "Goiânia",
        state: f.state || "GO",
      }));
      setLoading(false);
    }, 500);
  };

  const handleActivateLocation = (setter, setStatus) => {
    setStatus("loading");
    if (!navigator.geolocation) {
      setTimeout(() => setStatus("error"), 400);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setter((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setStatus("success");
      },
      () => setStatus("error"),
      { timeout: 8000 }
    );
  };

  const addSpecialty = (value) => {
    const trimmed = value.trim();
    if (!trimmed || pForm.specialties.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSpecialtyInput("");
      return;
    }
    setPForm((f) => ({ ...f, specialties: [...f.specialties, trimmed] }));
    setSpecialtyInput("");
    setPErrors((e) => { const n = { ...e }; delete n.specialties; return n; });
  };
  const removeSpecialty = (value) => setPForm((f) => ({ ...f, specialties: f.specialties.filter((s) => s !== value) }));

  const addService = () => {
    if (!serviceDraft.name.trim() || !serviceDraft.price.trim() || !serviceDraft.duration.trim()) return;
    setPForm((f) => ({ ...f, services: [...f.services, { id: `${Date.now()}`, ...serviceDraft }] }));
    setServiceDraft({ name: "", price: "", duration: "" });
    setPErrors((e) => { const n = { ...e }; delete n.services; return n; });
  };
  const removeService = (id) => setPForm((f) => ({ ...f, services: f.services.filter((s) => s.id !== id) }));
  const removeWorkPhoto = (idx) => setPForm((f) => ({ ...f, workPhotos: f.workPhotos.filter((_, i) => i !== idx) }));

  const startFaceScan = () => {
    setFaceStatus("scanning");
    setFaceProgress(0);
    const interval = setInterval(() => {
      setFaceProgress((p) => {
        if (p >= 100) { clearInterval(interval); setFaceStatus("success"); return 100; }
        return p + 5;
      });
    }, 70);
  };

  const stopClientSelfieCamera = () => {
    cSelfieStreamRef.current?.getTracks().forEach((track) => track.stop());
    cSelfieStreamRef.current = null;
  };

  const startClientSelfieCamera = async () => {
    setCSelfieError("");
    setCSelfieStatus("idle");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      cSelfieStreamRef.current = stream;
      if (cSelfieVideoRef.current) {
        cSelfieVideoRef.current.srcObject = stream;
        await cSelfieVideoRef.current.play();
      }
      setCSelfieStatus("streaming");
    } catch (err) {
      setCSelfieError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      setCSelfieStatus("error");
    }
  };

  const captureClientSelfie = () => {
    const video = cSelfieVideoRef.current;
    const canvas = cSelfieCanvasRef.current;
    if (!video || !canvas) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCField("selfiePhoto", dataUrl);
    stopClientSelfieCamera();
    setCSelfieStatus("captured");
  };

  const retakeClientSelfie = () => {
    setCField("selfiePhoto", "");
    startClientSelfieCamera();
  };

  useEffect(() => {
    if (screen === "clientSelfie" && !cForm.selfiePhoto) {
      startClientSelfieCamera();
    }
    if (screen !== "clientSelfie") {
      stopClientSelfieCamera();
    }
    return () => stopClientSelfieCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const goToFace = (backTo, returnTo) => {
    setFaceStatus("idle");
    setFaceProgress(0);
    setFaceBackTo(backTo);
    setFaceReturnTo(returnTo);
    setScreen("face");
  };

  const phoneFrame = {
    width: 390,
    minHeight: 780,
    background: colors.background,
    borderRadius: 32,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
    fontFamily: fontBody,
    display: "flex",
    flexDirection: "column",
  };

  const outer = { minHeight: "100vh", display: "flex", justifyContent: "center", background: "#efeff1", padding: "32px 12px", colorScheme: "light" };

  const renderSplash = () => (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 18% 15%, hsl(15 85% 65% / 0.9), transparent 45%), radial-gradient(circle at 82% 10%, hsl(320 75% 75% / 0.85), transparent 50%), radial-gradient(circle at 88% 55%, hsl(300 65% 55% / 0.8), transparent 55%), radial-gradient(circle at 8% 68%, hsl(20 80% 60% / 0.8), transparent 50%), radial-gradient(circle at 50% 92%, hsl(0 0% 100% / 0.55), transparent 60%), linear-gradient(180deg, hsl(340 55% 88%), hsl(0 0% 97%))",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 96, lineHeight: 1, color: colors.primaryForeground, margin: 0, textShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>K</h1>
          <p style={{ fontFamily: fontDisplay, fontSize: 32, color: colors.primaryForeground, margin: 0, textShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>Kira</p>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.primaryForeground, opacity: 0.9, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 }}>Beleza com confiança</p>
        </div>
        <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => setScreen("login")} style={{ width: "100%", padding: 16, borderRadius: 999, border: "none", background: "rgba(255,255,255,0.95)", color: colors.foreground, fontWeight: 600, fontSize: 14, fontFamily: fontBody, cursor: "pointer", boxShadow: "0 4px 20px -4px hsl(340 70% 55% / 0.2)" }}>Entrar</button>
          <button onClick={() => setScreen("signup")} style={{ width: "100%", padding: 16, borderRadius: 999, border: "none", background: "hsl(340 70% 55% / 0.3)", color: colors.primaryForeground, fontWeight: 600, fontSize: 14, fontFamily: fontBody, cursor: "pointer" }}>Criar conta</button>
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("splash")} />
      <div style={{ flex: 1, padding: "8px 24px 32px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 26, color: colors.foreground, margin: "4px 0 4px" }}>Bem-vinda de volta</h1>
        <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 24px" }}>Entre na sua conta Kira</p>
        <Field label="E-mail">
          <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="seu@email.com" style={inputStyle(false)} />
        </Field>
        <Field label="Senha">
          <div style={{ position: "relative" }}>
            <input type={showLoginPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" style={inputStyle(false)} />
            <button onClick={() => setShowLoginPassword((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: colors.mutedForeground, cursor: "pointer" }}>
              {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <PrimaryButton onClick={() => setScreen("home")}>Entrar</PrimaryButton>
        <p style={{ textAlign: "center", fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody, marginTop: 20 }}>
          Não tem conta? <span style={{ color: colors.primary, fontWeight: 600, cursor: "pointer" }} onClick={() => setScreen("signup")}>Criar conta</span>
        </p>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("splash")} />
      <div style={{ flex: 1, padding: "0 24px 32px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 26, color: colors.foreground, margin: "4px 0 4px" }}>Criar conta</h1>
        <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 24px" }}>Escolha seu perfil para começar</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { type: "client", icon: User, label: "Cliente", desc: "Agendar serviços", go: "clientPersonal" },
            { type: "professional", icon: Briefcase, label: "Profissional", desc: "Oferecer serviços", go: "proPersonal" },
          ].map(({ type, icon: Icon, label, desc, go }) => (
            <button
              key={type}
              onClick={() => { setAccountType(type); setScreen(go); }}
              style={{
                position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 18, borderRadius: 16,
                border: `2px solid ${accountType === type ? colors.primary : colors.border}`,
                background: accountType === type ? "hsl(340 70% 55% / 0.08)" : colors.card,
                cursor: "pointer",
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: accountType === type ? gradientKira : colors.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={accountType === type ? colors.primaryForeground : colors.mutedForeground} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color: colors.foreground, fontFamily: fontBody }}>{label}</span>
              <span style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody }}>{desc}</span>
            </button>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody }}>
          Já tem conta? <span style={{ color: colors.primary, fontWeight: 600, cursor: "pointer" }} onClick={() => setScreen("login")}>Entrar</span>
        </p>
      </div>
    </div>
  );

  // ---------- Fluxo cliente ----------
  const renderClientPersonal = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={1} />
      <Header onBack={() => setScreen("signup")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Cadastro de cliente</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Complete seus dados para agendar com nossos profissionais.</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `2px ${cForm.photo ? "solid" : "dashed"} ${cErrors.photo ? colors.destructive : cForm.photo ? colors.primary : colors.border}`, background: colors.muted }}>
              {cForm.photo ? <img src={cForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={30} color={colors.mutedForeground} />}
            </div>
            <button onClick={() => cFileInputRef.current?.click()} aria-label="Adicionar foto" style={{ position: "absolute", bottom: -4, right: -4, width: 34, height: 34, borderRadius: "50%", border: "none", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Camera size={15} color={colors.primaryForeground} />
            </button>
          </div>
          <input ref={cFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setCField("photo", v))} />
          <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600, fontFamily: fontBody, cursor: "pointer" }} onClick={() => cFileInputRef.current?.click()}>{cForm.photo ? "Trocar foto" : "Enviar foto de perfil"}</span>
          {cErrors.photo && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: 0 }}>{cErrors.photo}</p>}
        </div>

        <Field label="Nome completo" error={cErrors.name}>
          <input value={cForm.name} onChange={(e) => setCField("name", e.target.value)} placeholder="Ex.: Maria Almeida" style={inputStyle(cErrors.name)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="CPF" error={cErrors.cpf}>
            <input value={cForm.cpf} onChange={(e) => setCField("cpf", formatCpf(e.target.value))} placeholder="000.000.000-00" style={inputStyle(cErrors.cpf)} />
          </Field>
          <Field label="Nascimento" error={cErrors.birth}>
            <input type="date" value={cForm.birth} onChange={(e) => setCField("birth", e.target.value)} max={new Date().toISOString().split("T")[0]} style={inputStyle(cErrors.birth)} />
          </Field>
        </div>
        <Field label="Sexo" error={cErrors.gender}>
          <select value={cForm.gender} onChange={(e) => setCField("gender", e.target.value)} style={inputStyle(cErrors.gender)}>
            <option value="" disabled>Selecione uma opção</option>
            {genderOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="E-mail" error={cErrors.email}>
          <input type="email" value={cForm.email} onChange={(e) => setCField("email", e.target.value)} placeholder="seu@email.com" style={inputStyle(cErrors.email)} />
        </Field>
        <Field label="Telefone" error={cErrors.phone}>
          <input value={cForm.phone} onChange={(e) => setCField("phone", formatPhone(e.target.value))} placeholder="(00) 00000-0000" style={inputStyle(cErrors.phone)} />
        </Field>
        <Field label="Senha" error={cErrors.password}>
          <div style={{ position: "relative" }}>
            <input type={cShowPassword ? "text" : "password"} value={cForm.password} onChange={(e) => setCField("password", e.target.value)} placeholder="Mínimo 8 caracteres" style={inputStyle(cErrors.password)} />
            <button onClick={() => setCShowPassword((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: colors.mutedForeground, cursor: "pointer" }}>{cShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </Field>
        <Field label="Confirmar senha" error={cErrors.confirm}>
          <div style={{ position: "relative" }}>
            <input type={cShowConfirm ? "text" : "password"} value={cForm.confirm} onChange={(e) => setCField("confirm", e.target.value)} placeholder="Repita a senha" style={inputStyle(cErrors.confirm)} />
            <button onClick={() => setCShowConfirm((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: colors.mutedForeground, cursor: "pointer" }}>{cShowConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </Field>

        <PrimaryButton onClick={() => validateClientPersonal() && setScreen("clientAddress")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderClientAddress = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={2} />
      <Header onBack={() => setScreen("clientPersonal")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Endereço</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Onde você quer receber os profissionais?</p>
        <Field label="CEP" error={cErrors.cep}>
          <div style={{ position: "relative" }}>
            <input value={cForm.cep} onChange={(e) => setCField("cep", formatCep(e.target.value))} onBlur={() => handleCepBlur(cForm, setCForm, setCCepLoading)} placeholder="00000-000" style={inputStyle(cErrors.cep)} />
            {cCepLoading && <Loader2 size={16} color={colors.mutedForeground} className="spin" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />}
          </div>
        </Field>
        <Field label="Rua" error={cErrors.street}>
          <input value={cForm.street} onChange={(e) => setCField("street", e.target.value)} placeholder="Ex.: Av. T-4" style={inputStyle(cErrors.street)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Número" error={cErrors.number}>
            <input value={cForm.number} onChange={(e) => setCField("number", e.target.value)} placeholder="Ex.: 123" style={inputStyle(cErrors.number)} />
          </Field>
          <Field label="Complemento">
            <input value={cForm.complement} onChange={(e) => setCField("complement", e.target.value)} placeholder="Ap., bloco..." style={inputStyle(false)} />
          </Field>
        </div>
        <Field label="Bairro" error={cErrors.neighborhood}>
          <input value={cForm.neighborhood} onChange={(e) => setCField("neighborhood", e.target.value)} placeholder="Ex.: Setor Bueno" style={inputStyle(cErrors.neighborhood)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Cidade" error={cErrors.city}>
            <input value={cForm.city} onChange={(e) => setCField("city", e.target.value)} placeholder="Ex.: Goiânia" style={inputStyle(cErrors.city)} />
          </Field>
          <Field label="Estado" error={cErrors.state}>
            <input value={cForm.state} onChange={(e) => setCField("state", e.target.value.toUpperCase())} placeholder="Ex.: GO" maxLength={2} style={inputStyle(cErrors.state)} />
          </Field>
        </div>
        <PrimaryButton onClick={() => validateAddress(cForm, setCErrors) && setScreen("clientLocation")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderClientLocation = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={3} />
      <Header onBack={() => setScreen("clientAddress")} />
      <div style={{ flex: 1, padding: "0 24px 32px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Localização</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Isso nos ajuda a encontrar profissionais perto de você.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 22, borderRadius: 16, border: `1px solid ${colors.border}`, textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={22} color={colors.primaryForeground} />
          </div>
          {cLocationStatus === "idle" && <p style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Ative sua localização para encontrarmos profissionais mais próximos de você.</p>}
          {cLocationStatus === "loading" && <p style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={14} /> Obtendo localização…</p>}
          {cLocationStatus === "success" && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: colors.primary, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", margin: "0 0 2px" }}><CheckCircle2 size={16} /> Localização ativada</p>
              <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Lat {cForm.latitude?.toFixed(4)}, Long {cForm.longitude?.toFixed(4)}</p>
            </div>
          )}
          {cLocationStatus === "error" && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: colors.destructive, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", margin: "0 0 2px" }}><AlertCircle size={16} /> Não foi possível ativar</p>
              <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Você pode ativar depois, nas configurações.</p>
            </div>
          )}
          {(cLocationStatus === "idle" || cLocationStatus === "error") && <PrimaryButton pill onClick={() => handleActivateLocation(setCForm, setCLocationStatus)}>{cLocationStatus === "error" ? "Tentar novamente" : "Ativar localização"}</PrimaryButton>}
        </div>
        <PrimaryButton onClick={() => setScreen("clientDocument")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderClientDocument = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={4} />
      <Header onBack={() => setScreen("clientLocation")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Documento de identidade</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Envie a foto da frente e do verso do seu documento com foto.</p>
        <DocUploadBox label="Frente do documento" value={cForm.docFront} error={cErrors.docFront} inputRef={cDocFrontRef} onChange={(f) => handlePhoto(f, (v) => setCField("docFront", v))} />
        <DocUploadBox label="Verso do documento" value={cForm.docBack} error={cErrors.docBack} inputRef={cDocBackRef} onChange={(f) => handlePhoto(f, (v) => setCField("docBack", v))} />
        <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, textAlign: "center", margin: "0 0 12px" }}>Aceitamos RG, CNH ou outro documento oficial com foto.</p>
        <PrimaryButton
          onClick={() => {
            const e = {};
            if (!cForm.docFront) e.docFront = "Adicione a foto da frente do documento";
            if (!cForm.docBack) e.docBack = "Adicione a foto do verso do documento";
            if (Object.keys(e).length > 0) { setCErrors(e); return; }
            setCErrors({});
            setScreen("clientSelfie");
          }}
        >
          Continuar para verificação facial
        </PrimaryButton>
      </div>
    </div>
  );

  const renderClientSelfie = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={5} />
      <Header onBack={() => { stopClientSelfieCamera(); setScreen("clientDocument"); }} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Verificação Facial</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Tire uma selfie para aumentarmos a segurança da sua conta e confirmarmos sua identidade.</p>

        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            maxWidth: 280,
            margin: "0 auto 16px",
            borderRadius: 20,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px ${cForm.selfiePhoto ? "solid" : "dashed"} ${cSelfieStatus === "error" ? colors.destructive : cForm.selfiePhoto ? colors.primary : colors.border}`,
            background: colors.muted,
            position: "relative",
          }}
        >
          {cForm.selfiePhoto ? (
            <img src={cForm.selfiePhoto} alt="Prévia da selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : cSelfieStatus === "error" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 20, textAlign: "center" }}>
              <AlertCircle size={30} color={colors.destructive} />
              <span style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody }}>{cSelfieError}</span>
            </div>
          ) : (
            <video
              ref={cSelfieVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
            />
          )}
          {cSelfieStatus === "streaming" && !cForm.selfiePhoto && (
            <div style={{ position: "absolute", inset: 14, borderRadius: 14, border: "2px solid hsl(340 70% 55% / 0.6)", pointerEvents: "none" }} />
          )}
        </div>
        <canvas ref={cSelfieCanvasRef} style={{ display: "none" }} />

        <div style={{ width: "100%", maxWidth: 280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {!cForm.selfiePhoto && cSelfieStatus !== "error" && (
            <PrimaryButton onClick={captureClientSelfie} disabled={cSelfieStatus !== "streaming"}>Tirar selfie</PrimaryButton>
          )}
          {cSelfieStatus === "error" && <PrimaryButton onClick={startClientSelfieCamera}>Tentar novamente</PrimaryButton>}
          {cForm.selfiePhoto && (
            <>
              <PrimaryButton onClick={() => setScreen("clientTerms")}>Confirmar selfie</PrimaryButton>
              <SecondaryButton onClick={retakeClientSelfie}>Tirar novamente</SecondaryButton>
            </>
          )}
        </div>
        <p style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: fontBody, textAlign: "center", margin: "14px 0 0" }}>Sua selfie é usada apenas para confirmar sua identidade.</p>
      </div>
    </div>
  );

  const renderClientTerms = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={6} />
      <Header onBack={() => setScreen("clientSelfie")} />
      <div style={{ flex: 1, padding: "0 24px 32px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Termos</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Só falta confirmar os termos para concluir o cadastro.</p>
        {[{ key: "termsUse", label: "Termos de Uso" }, { key: "termsPrivacy", label: "Política de Privacidade" }].map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }} onClick={() => setCField(key, !cForm[key])}>
              <span style={{ marginTop: 2, width: 18, height: 18, borderRadius: 6, border: `1px solid ${cForm[key] ? colors.primary : cErrors[key] ? colors.destructive : colors.border}`, background: cForm[key] ? colors.primary : colors.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {cForm[key] && <Check size={12} color={colors.primaryForeground} />}
              </span>
              <span style={{ fontSize: 13, color: colors.foreground, fontFamily: fontBody }}>Aceito {key === "termsUse" ? "os" : "a"} <span style={{ color: colors.primary, fontWeight: 600 }}>{label}</span></span>
            </label>
            {cErrors[key] && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "4px 0 0 28px" }}>{cErrors[key]}</p>}
          </div>
        ))}
        <PrimaryButton onClick={() => validateTerms(cForm, setCErrors) && setScreen("clientDone")}>Concluir cadastro</PrimaryButton>
      </div>
    </div>
  );

  const renderClientDone = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={32} color={colors.primaryForeground} />
      </div>
      <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: 0 }}>Cadastro concluído!</h1>
      <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: 0 }}>A conta do cliente foi criada com sucesso.</p>
      <div style={{ width: "100%", maxWidth: 280 }}><PrimaryButton onClick={() => setScreen("clientPreferences")}>Ir para o início</PrimaryButton></div>
    </div>
  );

  const renderClientPreferences = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("clientDone")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>✨ Vamos personalizar sua experiência</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Escolha os serviços que mais combinam com você. Assim a Kira poderá mostrar profissionais e inspirações mais relevantes.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {preferenceCategories.map((cat) => {
            const selected = cPreferences.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCPreference(cat.id)}
                style={{
                  position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 18, borderRadius: 16,
                  border: `2px solid ${selected ? colors.primary : colors.border}`,
                  background: selected ? "hsl(340 70% 55% / 0.08)" : colors.card,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: selected ? gradientKira : colors.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {cat.emoji}
                </div>
                <span style={{ fontWeight: 600, fontSize: 13, color: colors.foreground, fontFamily: fontBody }}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <PrimaryButton onClick={() => setScreen("clientHome")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderClientHome = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ background: gradientKira, padding: "24px 24px 20px", position: "relative" }}>
        <div style={{
          position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <MapPin size={18} color={colors.primaryForeground} />
        </div>
        <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.primaryForeground, opacity: 0.85, margin: 0 }}>Olá,</p>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.primaryForeground, margin: "2px 0 16px" }}>
          {cForm.name ? `${cForm.name.split(" ")[0]}!` : "Bem-vinda!"} <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle" }} />
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.95)", borderRadius: 999, padding: "12px 16px", cursor: "pointer" }} onClick={() => setScreen("clientSearch")}>
          <Search size={16} color={colors.mutedForeground} />
          <span style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground }}>Buscar profissionais...</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px" }}>
        <button
          onClick={startTryOnFlow}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 18, border: "none",
            background: "hsl(340 70% 55% / 0.08)", cursor: "pointer", marginBottom: 22, textAlign: "left",
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Wand2 size={20} color={colors.primaryForeground} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>Provador virtual</p>
            <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>Veja como um visual fica em você antes de agendar</p>
          </div>
          <ChevronRight size={18} color={colors.primary} />
        </button>

        <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: colors.foreground, margin: "0 0 14px" }}>Categorias</h2>
        <div style={{ display: "flex", gap: 20, marginBottom: 26, overflowX: "auto" }}>
          {dashboardCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 56 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={colors.primaryForeground} />
                </div>
                <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: colors.foreground }}>{cat.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: colors.foreground, margin: 0 }}>Perto de você</h2>
          <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.primary, cursor: "pointer" }}>Ver todos</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {nearbyProfessionals.map((pro) => (
            <div key={pro.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card }}>
              <img src={pro.photo} alt={pro.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>{pro.name}</p>
                <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 3px" }}>{pro.role}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
                    <Star size={11} color={colors.accent} fill={colors.accent} /> {pro.rating}
                  </span>
                  <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>{pro.distance}</span>
                </div>
              </div>
              <span style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.primary }}>{pro.price}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="clientHome" onNavigate={goToTab} />
    </div>
  );

  const renderClientSearch = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ padding: "0 24px 12px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "0 0 14px" }}>Buscar</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onFilterClick={openFilterModal} />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 0 4px" }}>
          {categoryOptions.map((c) => (
            <CategoryChip key={c.id} label={c.label} active={categoryFilter === c.id} onClick={() => setCategoryFilter(c.id)} />
          ))}
        </div>
      </div>

      <div
        ref={searchListRef}
        onScroll={handleSearchScroll}
        onTouchStart={handlePullStart}
        onTouchMove={handlePullMove}
        onTouchEnd={handlePullEnd}
        style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px", position: "relative" }}
      >
        {(pullDistance > 0 || refreshing) && (
          <div style={{ display: "flex", justifyContent: "center", padding: 8, height: refreshing ? 32 : pullDistance }}>
            <Loader2 size={18} color={colors.primary} className={refreshing ? "spin" : ""} style={{ opacity: refreshing ? 1 : Math.min(pullDistance / 55, 1) }} />
          </div>
        )}

        {searchLoading ? (
          <SkeletonLoading count={6} />
        ) : searchHasError ? (
          <ErrorState onRetry={runSearchLoad} />
        ) : filteredProfessionals.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredProfessionals.slice(0, visibleCount).map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} onClick={() => { setSelectedProId(pro.id); setBookedSlot(null); setScreen("clientProfessionalProfile"); }} />
              ))}
            </div>
            {visibleCount < filteredProfessionals.length && (
              <p style={{ textAlign: "center", fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "14px 0 0" }}>Carregando mais…</p>
            )}
          </>
        )}
      </div>

      <BottomNav active="clientSearch" onNavigate={goToTab} />
      <FilterModal
        open={filterModalOpen}
        mounted={filterModalMounted}
        onClose={closeFilterModal}
        draft={draftFilters}
        setDraft={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );

  const renderClientProfessionalProfile = () => {
    const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
    const extras = getProfileExtras(pro);
    const nextSlots = getRankingExtras(pro).nextSlot;
    const goToScheduling = () => { setBookedSlot(null); setSelectedDate(null); setScheduleTime(null); setScheduleError(false); setViewMonth(startOfMonth(new Date())); setScreen("clientScheduling"); };
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ position: "relative", height: 140, background: gradientKira, flexShrink: 0 }}>
            <button
              onClick={() => setScreen("clientSearch")}
              aria-label="Voltar"
              style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ArrowLeft size={20} color={colors.primaryForeground} />
            </button>
            <button
              onClick={() => toggleFavoriteProfessional(pro.id)}
              aria-label={favoriteProIds.includes(pro.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Bookmark size={17} color={colors.primaryForeground} fill={favoriteProIds.includes(pro.id) ? colors.primaryForeground : "none"} />
            </button>
          </div>
          <div style={{ padding: "0 24px 24px", marginTop: -40 }}>
            <img src={pro.photo} alt={pro.name} style={{ width: 84, height: 84, borderRadius: 20, objectFit: "cover", border: `3px solid ${colors.card}`, boxShadow: "0 2px 10px hsl(280 20% 15% / 0.15)" }} />
            <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: colors.foreground, margin: "12px 0 2px" }}>{pro.name}</h1>
            <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 6px" }}>{pro.role}</p>
            {extras.verified && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary, margin: "0 0 10px" }}>
                <BadgeCheck size={14} /> Profissional verificado
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 12, color: colors.foreground, fontWeight: 600 }}>
                <RatingStars value={pro.rating} size={13} /> {pro.rating} <span style={{ color: colors.mutedForeground, fontWeight: 400 }}>({pro.reviews})</span>
              </span>
            </div>

            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 6px" }}>Sobre</h2>
            <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 18px" }}>{pro.description}</p>

            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Serviços</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {pro.services.map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                  <div>
                    <span style={{ fontFamily: fontBody, fontSize: 13, color: colors.foreground, display: "block" }}>{s}</span>
                    <span style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground }}>≈ 45 min</span>
                  </div>
                  <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>R$ {pro.price}</span>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Portfólio</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {extras.portfolio.map((photo, i) => (
                <img key={i} src={photo} alt={`Trabalho ${i + 1} de ${pro.name}`} style={{ width: "100%", aspectRatio: "1/1", borderRadius: 12, objectFit: "cover" }} />
              ))}
            </div>

            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Avaliações</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card, marginBottom: extras.reviewComments.length > 0 ? 10 : 20 }}>
              <RatingStars value={pro.rating} size={15} />
              <span style={{ fontFamily: fontBody, fontSize: 13, color: colors.foreground, fontWeight: 700 }}>{pro.rating}</span>
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>com base em {pro.reviews} avaliações</span>
            </div>
            {extras.reviewComments.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {extras.reviewComments.map((r, i) => (
                  <div key={i} style={{ padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.foreground }}>{r.author}</span>
                      <RatingStars value={r.stars} size={10} />
                    </div>
                    <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Localização</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card, marginBottom: 20 }}>
              <MapPin size={16} color={colors.primary} />
              <div>
                <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground, margin: 0 }}>{extras.address}</p>
                <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{pro.distance} km de você</p>
              </div>
            </div>

            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Disponibilidade</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
              <Clock size={16} color={colors.primary} />
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground }}>Próximo horário: {nextSlots}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 24px calc(12px + env(safe-area-inset-bottom, 0px))", borderTop: `1px solid ${colors.border}`, background: colors.card, flexShrink: 0 }}>
          <PrimaryButton onClick={goToScheduling}>Agendar</PrimaryButton>
        </div>
      </div>
    );
  };

  const renderClientScheduling = () => {
    const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
    const times = selectedDate ? getDaySchedule(selectedDate, pro) : [];
    const canGoPrev = viewMonth.getFullYear() > today.getFullYear() || (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Header onBack={() => setScreen("clientProfessionalProfile")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          {bookedSlot ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "48px 0", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={32} color={colors.primaryForeground} />
              </div>
              <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: colors.foreground, margin: 0 }}>Agendamento confirmado!</h1>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{pro.name} • {selectedDate?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })} às {bookedSlot}</p>
              <div style={{ width: "100%", maxWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
                <PrimaryButton onClick={() => { setAgendaTab("proximo"); setScreen("clientAgenda"); }}>Ver na agenda</PrimaryButton>
                <SecondaryButton onClick={() => setScreen("clientHome")}>Voltar para o início</SecondaryButton>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: colors.foreground, margin: "4px 0 4px" }}>Agendar com {pro.name}</h1>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Escolha o melhor dia e horário para o seu atendimento.</p>

              <CalendarHeader monthDate={viewMonth} onPrev={() => changeMonth(-1)} onNext={() => changeMonth(1)} canGoPrev={canGoPrev} />
              <div style={{ marginBottom: 24 }}>
                <CalendarMonth monthDate={viewMonth} selectedDate={selectedDate} today={today} monthKey={monthAnimKey} onSelect={selectScheduleDate} />
              </div>

              {selectedDate && (
                <>
                  <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Horários disponíveis</h2>
                  {scheduleLoading ? (
                    <LoadingSchedule />
                  ) : scheduleError ? (
                    <ErrorState onRetry={retrySchedule} message="Não foi possível carregar os horários agora." />
                  ) : times.length === 0 ? (
                    <EmptySchedule />
                  ) : (
                    <>
                      <TimeSlotGrid times={times} selectedTime={scheduleTime} onSelect={setScheduleTime} />
                      <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, textAlign: "center", margin: "14px 0 0" }}>Toque em um horário para continuar.</p>
                    </>
                  )}
                </>
              )}

              {scheduleTime && (
                <div style={{ marginTop: 20 }}>
                  <PrimaryButton onClick={() => setBookedSlot(scheduleTime)}>Continuar para confirmação</PrimaryButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // ---------- Provador virtual ----------
  // Fluxo: referência → foto da cliente → resultado/preview → "Encontrar
  // profissionais" (leva ao Ranking já no modo personalizado).
  const renderClientTryOnReference = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Provador virtual</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Escolha uma referência do visual que você deseja experimentar.</p>

        <div
          onClick={() => tryOnRefInputRef.current?.click()}
          style={{
            width: "100%", aspectRatio: "1/1", maxWidth: 280, margin: "0 auto 16px", borderRadius: 20, overflow: "hidden",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            border: `2px ${tryOnReference ? "solid" : "dashed"} ${tryOnReference ? colors.primary : colors.border}`,
            background: colors.muted, cursor: "pointer",
          }}
        >
          {tryOnReference ? (
            <img src={tryOnReference} alt="Referência escolhida" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <Wand2 size={30} color={colors.mutedForeground} />
              <span style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody }}>Enviar foto de referência</span>
            </>
          )}
        </div>
        <input ref={tryOnRefInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files?.[0], setTryOnReference)} />

        <div style={{ width: "100%", maxWidth: 280, margin: "0 auto" }}>
          <PrimaryButton disabled={!tryOnReference} onClick={() => setScreen("clientTryOnPhoto")}>Continuar</PrimaryButton>
        </div>
      </div>
      <BottomNav active="clientTryOnReference" onNavigate={goToTab} />
    </div>
  );

  const renderClientTryOnPhoto = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientTryOnReference")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Sua foto</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Envie uma foto sua para vermos como o visual combina com você.</p>

        <div
          onClick={() => tryOnPhotoInputRef.current?.click()}
          style={{
            width: "100%", aspectRatio: "1/1", maxWidth: 280, margin: "0 auto 16px", borderRadius: 20, overflow: "hidden",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            border: `2px ${tryOnClientPhoto ? "solid" : "dashed"} ${tryOnClientPhoto ? colors.primary : colors.border}`,
            background: colors.muted, cursor: "pointer",
          }}
        >
          {tryOnClientPhoto ? (
            <img src={tryOnClientPhoto} alt="Foto enviada" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <Camera size={30} color={colors.mutedForeground} />
              <span style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody }}>Enviar sua foto</span>
            </>
          )}
        </div>
        <input ref={tryOnPhotoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files?.[0], setTryOnClientPhoto)} />

        <div style={{ width: "100%", maxWidth: 280, margin: "0 auto" }}>
          <PrimaryButton disabled={!tryOnClientPhoto} onClick={() => setScreen("clientTryOnResult")}>Gerar prévia</PrimaryButton>
        </div>
      </div>
      <BottomNav active="clientTryOnReference" onNavigate={goToTab} />
    </div>
  );

  const renderClientTryOnResult = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientTryOnPhoto")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Prévia do resultado</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>É assim que esse visual pode ficar em você. Que tal encontrar quem sabe fazer igual?</p>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 4px", textAlign: "center" }}>Referência</p>
            <img src={tryOnReference} alt="Referência" style={{ width: "100%", aspectRatio: "1/1", borderRadius: 14, objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: colors.primary, fontWeight: 700, fontFamily: fontBody, margin: "0 0 4px", textAlign: "center" }}>Resultado (prévia)</p>
            <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", position: "relative" }}>
              <img src={tryOnClientPhoto} alt="Prévia do resultado" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "hsl(340 70% 55% / 0.18)", border: `2px solid ${colors.primary}`, borderRadius: 14 }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, background: colors.muted, marginBottom: 20 }}>
          <Sparkles size={16} color={colors.primary} />
          <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>Prévia gerada por nossa inteligência artificial. O resultado real pode variar conforme o profissional.</span>
        </div>

        <PrimaryButton onClick={goToPersonalizedRanking}>Encontrar profissionais</PrimaryButton>
      </div>
    </div>
  );

  // ---------- Agenda ----------
  const renderClientAgenda = () => {
    const filtered = appointmentsMock.filter((a) => a.status === agendaTab);
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientHome")} />
        <div style={{ padding: "0 24px 4px" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "0 0 4px" }}>Minha agenda</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 16px" }}>Seus próximos momentos de beleza</p>
          <div style={{ display: "flex", gap: 8 }}>
            {appointmentTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setAgendaTab(t.id)}
                style={{
                  flex: 1, padding: "9px 8px", borderRadius: 12, border: "none",
                  background: agendaTab === t.id ? gradientKira : colors.muted,
                  color: agendaTab === t.id ? colors.primaryForeground : colors.mutedForeground,
                  fontFamily: fontBody, fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
          {filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "48px 24px", textAlign: "center" }}>
              <Calendar size={30} color={colors.mutedForeground} />
              <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Nenhum agendamento aqui ainda.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((a) => {
                const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
                return (
                  <AppointmentCard key={a.id} appointment={a} pro={pro} onClick={() => { setSelectedAppointmentId(a.id); setScreen("clientAgendaDetail"); }} />
                );
              })}
            </div>
          )}
        </div>
        <BottomNav active="clientAgenda" onNavigate={goToTab} />
      </div>
    );
  };

  const renderClientAgendaDetail = () => {
    const appointment = appointmentsMock.find((a) => a.id === selectedAppointmentId) || appointmentsMock[0];
    const pro = mockProfessionals.find((p) => p.id === appointment.proId) || mockProfessionals[0];
    const canCancel = appointment.status === "proximo";
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientAgenda")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <img src={pro.photo} alt={pro.name} style={{ width: 60, height: 60, borderRadius: 16, objectFit: "cover" }} />
            <div>
              <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: 0 }}>{pro.name}</p>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{pro.role}</p>
            </div>
          </div>

          <div style={{ borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card, padding: 16, marginBottom: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Serviço", appointment.service],
              ["Data", appointment.date],
              ["Horário", appointment.time],
              ["Endereço", appointment.place],
              ["Preço", `R$ ${appointment.price.toFixed(2)}`],
              ["Pagamento", appointment.payment],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>{label}</span>
                <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${colors.border}` }}>
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>Status</span>
              <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: appointment.status === "cancelado" ? colors.destructive : colors.primary }}>
                {appointment.status === "proximo" ? "✓ Confirmado" : appointment.status === "concluido" ? "Concluído" : "Cancelado"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SecondaryButton onClick={() => {}}><MessageCircle size={15} /> Conversar com {pro.name.split(" ")[0]}</SecondaryButton>
            {appointment.status === "concluido" && !appointment.rated && (
              <PrimaryButton onClick={() => {}}>Avaliar atendimento</PrimaryButton>
            )}
            {canCancel && (
              <button
                onClick={() => {}}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "transparent", color: colors.destructive, fontWeight: 600, fontSize: 13, fontFamily: fontBody, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <XCircle size={15} /> Cancelar agendamento
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---------- Perfil da cliente ----------
  const renderClientProfile = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ background: gradientKira, padding: "28px 24px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
          {cForm.photo ? <img src={cForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={28} color={colors.primaryForeground} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 17, color: colors.primaryForeground, margin: 0 }}>{cForm.name || "Cliente Kira"}</p>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.primaryForeground, opacity: 0.85, margin: "2px 0 0" }}>
            @{(cForm.name || "cliente").toLowerCase().replace(/\s+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "cliente"}
          </p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px" }}>
        {clientProfileMenu.map((section) => (
          <ProfileSection key={section.title} title={section.title}>
            {section.items.map((item, i) => (
              <ProfileMenuRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                last={i === section.items.length - 1}
                onClick={item.go ? () => setScreen(item.go) : undefined}
              />
            ))}
          </ProfileSection>
        ))}
        <button
          onClick={() => setScreen("splash")}
          style={{ width: "100%", padding: 13, borderRadius: 14, border: `1px solid hsl(0 84% 60% / 0.3)`, background: "hsl(0 84% 60% / 0.06)", color: colors.destructive, fontWeight: 700, fontSize: 13, fontFamily: fontBody, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <LogOut size={15} /> Sair da conta
        </button>
      </div>
      <BottomNav active="clientProfile" onNavigate={goToTab} />
    </div>
  );

  // === PERFIL: EditProfileScreen ===
  // Formulário de edição, reaproveitando cForm/cErrors direto (mesma fonte
  // de verdade usada no resto do app) em vez de duplicar estado.
  const renderClientProfileEdit = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Editar perfil</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Atualize seus dados pessoais.</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${colors.primary}`, background: colors.muted }}>
              {cForm.photo ? <img src={cForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={30} color={colors.mutedForeground} />}
            </div>
            <button onClick={() => cFileInputRef.current?.click()} aria-label="Trocar foto" style={{ position: "absolute", bottom: -4, right: -4, width: 34, height: 34, borderRadius: "50%", border: "none", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ImagePlus size={15} color={colors.primaryForeground} />
            </button>
          </div>
          <input ref={cFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setCField("photo", v))} />
        </div>

        <Field label="Nome completo" error={cErrors.name}>
          <input value={cForm.name} onChange={(e) => setCField("name", e.target.value)} placeholder="Ex.: Maria Almeida" style={inputStyle(cErrors.name)} />
        </Field>
        <Field label="E-mail" error={cErrors.email}>
          <input type="email" value={cForm.email} onChange={(e) => setCField("email", e.target.value)} placeholder="seu@email.com" style={inputStyle(cErrors.email)} />
        </Field>
        <Field label="Telefone" error={cErrors.phone}>
          <input value={cForm.phone} onChange={(e) => setCField("phone", formatPhone(e.target.value))} placeholder="(00) 00000-0000" style={inputStyle(cErrors.phone)} />
        </Field>

        <button
          onClick={() => setScreen("clientAddress")}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.muted, marginBottom: 18, cursor: "pointer", textAlign: "left" }}
        >
          <MapPin size={15} color={colors.mutedForeground} />
          <span style={{ flex: 1, fontFamily: fontBody, fontSize: 12, color: colors.foreground }}>{cForm.street ? `${cForm.street}, ${cForm.city}` : "Adicionar endereço"}</span>
          <ChevronRight size={15} color={colors.mutedForeground} />
        </button>

        {profileSaveStatus === "success" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 12, background: "hsl(340 70% 55% / 0.08)", marginBottom: 12 }}>
            <CheckCircle2 size={15} color={colors.primary} />
            <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.primary, fontWeight: 600 }}>Perfil atualizado!</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><SecondaryButton onClick={() => setScreen("clientProfile")}><X size={15} /> Cancelar</SecondaryButton></div>
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={saveProfileEdit} disabled={profileSaveStatus === "saving"}>
              {profileSaveStatus === "saving" ? <Loader2 size={15} className="spin" /> : <Check size={15} />} {profileSaveStatus === "saving" ? "Salvando..." : "Salvar"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );

  // === PERFIL: IdentityVerification (Segurança da conta) ===
  const renderClientAccountSecurity = () => {
    const hasSelfie = !!cForm.selfiePhoto;
    const hasDocs = !!cForm.docFront && !!cForm.docBack;
    const verified = hasSelfie && hasDocs;
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientProfile")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Segurança da conta</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Status da verificação de identidade da sua conta.</p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 22, borderRadius: 16, border: `1px solid ${colors.border}`, textAlign: "center", marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: verified ? gradientKira : colors.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ScanFace size={22} color={verified ? colors.primaryForeground : colors.mutedForeground} />
            </div>
            {verified ? (
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.primary, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, margin: 0 }}><CheckCircle2 size={16} /> Identidade verificada</p>
            ) : (
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.mutedForeground, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, margin: 0 }}><Clock size={16} /> Verificação pendente</p>
            )}
            <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>{verified ? "Selfie e documento confirmados." : "Conclua a selfie e o documento para verificar sua conta."}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {[
              { label: "Selfie de verificação", done: hasSelfie },
              { label: "Documento com foto", done: hasDocs },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                {item.done ? <CheckCircle2 size={16} color={colors.primary} /> : <XCircle size={16} color={colors.mutedForeground} />}
                <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground, flex: 1 }}>{item.label}</span>
                <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: item.done ? colors.primary : colors.mutedForeground }}>{item.done ? "Concluído" : "Pendente"}</span>
              </div>
            ))}
          </div>

          <SecondaryButton onClick={() => setScreen("clientSelfie")}><ScanFace size={15} /> Refazer verificação facial</SecondaryButton>
        </div>
      </div>
    );
  };

  // === PERFIL: Dados e privacidade ===
  const renderClientPrivacyData = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Dados e privacidade</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Estes são os dados que a Kira guarda sobre sua conta.</p>
        <ProfileSection title="Dados cadastrados">
          {[
            ["Nome", cForm.name || "—"],
            ["E-mail", cForm.email || "—"],
            ["Telefone", cForm.phone || "—"],
            ["Endereço", cForm.street ? `${cForm.street}, ${cForm.city}` : "—"],
            ["Documento de identidade", cForm.docFront ? "Enviado" : "Não enviado"],
          ].map(([label, value], i, arr) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${colors.border}` }}>
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>{label}</span>
              <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, textAlign: "right", maxWidth: 180 }}>{value}</span>
            </div>
          ))}
        </ProfileSection>
        <SecondaryButton onClick={() => {}}><ShieldCheck size={15} /> Solicitar exportação dos meus dados</SecondaryButton>
      </div>
    </div>
  );

  // === PERFIL: Consentimentos LGPD ===
  const renderClientLgpdConsents = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Consentimentos LGPD</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Consentimentos aceitos durante o seu cadastro.</p>
        <ProfileSection title="Termos aceitos">
          {[
            { label: "Termos de Uso", accepted: cForm.termsUse },
            { label: "Política de Privacidade", accepted: cForm.termsPrivacy },
          ].map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", borderBottom: i === 0 ? `1px solid ${colors.border}` : "none" }}>
              {item.accepted ? <CheckCircle2 size={16} color={colors.primary} /> : <XCircle size={16} color={colors.mutedForeground} />}
              <span style={{ flex: 1, fontFamily: fontBody, fontSize: 13, color: colors.foreground }}>{item.label}</span>
              <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: item.accepted ? colors.primary : colors.mutedForeground }}>{item.accepted ? "Aceito" : "Pendente"}</span>
            </div>
          ))}
        </ProfileSection>
      </div>
    </div>
  );

  // === PERFIL: Formas de pagamento ===
  const renderClientPaymentMethods = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Formas de pagamento</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Adicione um cartão ou use Pix na hora de agendar.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "40px 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={26} color={colors.mutedForeground} />
          </div>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Nenhuma forma de pagamento cadastrada ainda.</p>
        </div>
        <PrimaryButton onClick={() => {}}><Plus size={15} /> Adicionar cartão</PrimaryButton>
      </div>
    </div>
  );

  // === PERFIL: Histórico de pagamentos ===
  const renderClientPaymentHistory = () => {
    const paid = appointmentsMock.filter((a) => a.status === "concluido");
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientProfile")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Histórico de pagamentos</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Pagamentos de serviços já concluídos.</p>
          {paid.length === 0 ? (
            <EmptyState onClear={() => setScreen("clientProfile")} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {paid.map((a) => {
                const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                    <img src={pro.photo} alt={pro.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: 0 }}>{a.service}</p>
                      <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{a.date} • {a.payment}</p>
                    </div>
                    <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>R$ {a.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // === PERFIL: Cupons e gift cards ===
  const renderClientCoupons = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Cupons e gift cards</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Resgate um cupom ou gift card para usar nos seus agendamentos.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input placeholder="Código do cupom" style={{ ...inputStyle(false), flex: 1 }} />
          <button style={{ padding: "0 18px", borderRadius: 12, border: "none", background: gradientKira, color: colors.primaryForeground, fontFamily: fontBody, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Aplicar</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "24px 24px", textAlign: "center" }}>
          <Gift size={30} color={colors.mutedForeground} />
          <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Nenhum cupom ativo no momento.</p>
        </div>
      </div>
    </div>
  );

  // === PERFIL: Ajuda e suporte ===
  const renderClientHelpSupport = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Ajuda e suporte</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Como podemos ajudar?</p>
        <ProfileSection title="Dúvidas frequentes">
          {["Como funciona o Provador virtual?", "Como altero um agendamento?", "Como funciona o pagamento?"].map((q, i, arr) => (
            <ProfileMenuRow key={q} icon={HelpCircle} label={q} last={i === arr.length - 1} onClick={() => {}} />
          ))}
        </ProfileSection>
        <SecondaryButton onClick={() => {}}><MessageCircle size={15} /> Conversar com o suporte</SecondaryButton>
      </div>
    </div>
  );

  // === PERFIL: Minhas avaliações ===
  const renderClientReviews = () => {
    const reviewed = appointmentsMock.filter((a) => a.status === "concluido");
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientProfile")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Minhas avaliações</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Avaliações que você deixou para profissionais atendidos.</p>
          {reviewed.length === 0 ? (
            <EmptyState onClear={() => setScreen("clientProfile")} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reviewed.map((a) => {
                const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
                const review = clientReviewsMock[a.id];
                return (
                  <div key={a.id} style={{ padding: 14, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <img src={pro.photo} alt={pro.name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.foreground, margin: 0 }}>{pro.name}</p>
                        <p style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground, margin: 0 }}>{a.service}</p>
                      </div>
                      {review && <RatingStars value={review.rating} size={12} />}
                    </div>
                    {review ? (
                      <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{review.text}</p>
                    ) : (
                      <button onClick={() => { setSelectedAppointmentId(a.id); setScreen("clientAgendaDetail"); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.primary }}>
                        Avaliar este atendimento
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // === PERFIL: Profissionais favoritos ===
  const renderClientFavorites = () => {
    const favorites = mockProfessionals.filter((p) => favoriteProIds.includes(p.id));
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("clientProfile")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Profissionais favoritos</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Toque no ícone de marcador no perfil de um profissional para salvá-lo aqui.</p>
          {favorites.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "40px 24px", textAlign: "center" }}>
              <Bookmark size={30} color={colors.mutedForeground} />
              <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Você ainda não tem profissionais favoritos.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {favorites.map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} onClick={() => { setSelectedProId(pro.id); setBookedSlot(null); setScreen("clientProfessionalProfile"); }} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // === PERFIL: Histórico completo ===
  const renderClientHistory = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Histórico</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Todos os seus agendamentos, de qualquer status.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {appointmentsMock.map((a) => {
            const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
            return (
              <AppointmentCard key={a.id} appointment={a} pro={pro} onClick={() => { setSelectedAppointmentId(a.id); setScreen("clientAgendaDetail"); }} />
            );
          })}
        </div>
      </div>
    </div>
  );

  // ---------- Fluxo profissional ----------
  const renderProPersonal = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={1} />
      <Header onBack={() => setScreen("signup")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Cadastro de profissional</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Complete seus dados para começar a atender clientes.</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `2px ${pForm.photo ? "solid" : "dashed"} ${pErrors.photo ? colors.destructive : pForm.photo ? colors.primary : colors.border}`, background: colors.muted }}>
              {pForm.photo ? <img src={pForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={30} color={colors.mutedForeground} />}
            </div>
            <button onClick={() => pFileInputRef.current?.click()} aria-label="Adicionar foto" style={{ position: "absolute", bottom: -4, right: -4, width: 34, height: 34, borderRadius: "50%", border: "none", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Camera size={15} color={colors.primaryForeground} />
            </button>
          </div>
          <input ref={pFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setPField("photo", v))} />
          <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600, fontFamily: fontBody, cursor: "pointer" }} onClick={() => pFileInputRef.current?.click()}>{pForm.photo ? "Trocar foto" : "Enviar foto de perfil"}</span>
          {pErrors.photo && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: 0 }}>{pErrors.photo}</p>}
        </div>

        <Field label="Nome completo" error={pErrors.name}>
          <input value={pForm.name} onChange={(e) => setPField("name", e.target.value)} placeholder="Ex.: Ana Paula Ferreira" style={inputStyle(pErrors.name)} />
        </Field>

        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["cpf", "cnpj"].map((type) => (
            <button key={type} onClick={() => setPField("documentType", type)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: pForm.documentType === type ? gradientKira : colors.muted, color: pForm.documentType === type ? colors.primaryForeground : colors.mutedForeground, fontWeight: 600, fontSize: 12, fontFamily: fontBody, cursor: "pointer" }}>
              {type.toUpperCase()}
            </button>
          ))}
        </div>
        <Field label={pForm.documentType === "cpf" ? "CPF" : "CNPJ"} error={pErrors.document}>
          <input value={pForm.document} onChange={(e) => setPField("document", pForm.documentType === "cpf" ? formatCpf(e.target.value) : formatCnpj(e.target.value))} placeholder={pForm.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"} style={inputStyle(pErrors.document)} />
        </Field>

        <Field label="Data de nascimento" error={pErrors.birth}>
          <input type="date" value={pForm.birth} onChange={(e) => setPField("birth", e.target.value)} max={new Date().toISOString().split("T")[0]} style={inputStyle(pErrors.birth)} />
        </Field>
        <Field label="E-mail" error={pErrors.email}>
          <input type="email" value={pForm.email} onChange={(e) => setPField("email", e.target.value)} placeholder="seu@email.com" style={inputStyle(pErrors.email)} />
        </Field>
        <Field label="Telefone" error={pErrors.phone}>
          <input value={pForm.phone} onChange={(e) => setPField("phone", formatPhone(e.target.value))} placeholder="(00) 00000-0000" style={inputStyle(pErrors.phone)} />
        </Field>
        <Field label="Senha" error={pErrors.password}>
          <div style={{ position: "relative" }}>
            <input type={pShowPassword ? "text" : "password"} value={pForm.password} onChange={(e) => setPField("password", e.target.value)} placeholder="Mínimo 8 caracteres" style={inputStyle(pErrors.password)} />
            <button onClick={() => setPShowPassword((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: colors.mutedForeground, cursor: "pointer" }}>{pShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </Field>
        <Field label="Confirmar senha" error={pErrors.confirm}>
          <div style={{ position: "relative" }}>
            <input type={pShowConfirm ? "text" : "password"} value={pForm.confirm} onChange={(e) => setPField("confirm", e.target.value)} placeholder="Repita a senha" style={inputStyle(pErrors.confirm)} />
            <button onClick={() => setPShowConfirm((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: colors.mutedForeground, cursor: "pointer" }}>{pShowConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </Field>

        <PrimaryButton onClick={() => validateProPersonal() && setScreen("proAddress")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderProAddress = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={2} />
      <Header onBack={() => setScreen("proPersonal")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Endereço</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Onde fica o seu local de atendimento?</p>
        <Field label="CEP" error={pErrors.cep}>
          <div style={{ position: "relative" }}>
            <input value={pForm.cep} onChange={(e) => setPField("cep", formatCep(e.target.value))} onBlur={() => handleCepBlur(pForm, setPForm, setPCepLoading)} placeholder="00000-000" style={inputStyle(pErrors.cep)} />
            {pCepLoading && <Loader2 size={16} color={colors.mutedForeground} className="spin" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />}
          </div>
        </Field>
        <Field label="Rua" error={pErrors.street}>
          <input value={pForm.street} onChange={(e) => setPField("street", e.target.value)} placeholder="Ex.: Av. T-4" style={inputStyle(pErrors.street)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Número" error={pErrors.number}>
            <input value={pForm.number} onChange={(e) => setPField("number", e.target.value)} placeholder="Ex.: 123" style={inputStyle(pErrors.number)} />
          </Field>
          <Field label="Complemento">
            <input value={pForm.complement} onChange={(e) => setPField("complement", e.target.value)} placeholder="Sala, loja..." style={inputStyle(false)} />
          </Field>
        </div>
        <Field label="Bairro" error={pErrors.neighborhood}>
          <input value={pForm.neighborhood} onChange={(e) => setPField("neighborhood", e.target.value)} placeholder="Ex.: Setor Bueno" style={inputStyle(pErrors.neighborhood)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Cidade" error={pErrors.city}>
            <input value={pForm.city} onChange={(e) => setPField("city", e.target.value)} placeholder="Ex.: Goiânia" style={inputStyle(pErrors.city)} />
          </Field>
          <Field label="Estado" error={pErrors.state}>
            <input value={pForm.state} onChange={(e) => setPField("state", e.target.value.toUpperCase())} placeholder="Ex.: GO" maxLength={2} style={inputStyle(pErrors.state)} />
          </Field>
        </div>
        <PrimaryButton onClick={() => validateAddress(pForm, setPErrors) && setScreen("proLocation")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderProLocation = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={3} />
      <Header onBack={() => setScreen("proAddress")} />
      <div style={{ flex: 1, padding: "0 24px 32px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Localização</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Isso nos ajuda a mostrar seu perfil para clientes próximos.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 22, borderRadius: 16, border: `1px solid ${colors.border}`, textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={22} color={colors.primaryForeground} />
          </div>
          {pLocationStatus === "idle" && <p style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Ative sua localização para clientes próximos encontrarem você.</p>}
          {pLocationStatus === "loading" && <p style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={14} /> Obtendo localização…</p>}
          {pLocationStatus === "success" && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: colors.primary, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", margin: "0 0 2px" }}><CheckCircle2 size={16} /> Localização ativada</p>
              <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Lat {pForm.latitude?.toFixed(4)}, Long {pForm.longitude?.toFixed(4)}</p>
            </div>
          )}
          {pLocationStatus === "error" && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: colors.destructive, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", margin: "0 0 2px" }}><AlertCircle size={16} /> Não foi possível ativar</p>
              <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Você pode ativar depois, nas configurações.</p>
            </div>
          )}
          {(pLocationStatus === "idle" || pLocationStatus === "error") && <PrimaryButton pill onClick={() => handleActivateLocation(setPForm, setPLocationStatus)}>{pLocationStatus === "error" ? "Tentar novamente" : "Ativar localização"}</PrimaryButton>}
        </div>
        <PrimaryButton onClick={() => setScreen("proDocument")}>Continuar</PrimaryButton>
      </div>
    </div>
  );

  const renderProSpecialties = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={5} />
      <Header onBack={() => setScreen("face")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Especialidades</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Quais áreas você atende? Adicione quantas quiser.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialty(specialtyInput); } }}
            placeholder="Ex.: Coloração, Design de sobrancelhas..."
            style={inputStyle(pErrors.specialties)}
          />
          <button onClick={() => addSpecialty(specialtyInput)} style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Plus size={18} color={colors.primaryForeground} />
          </button>
        </div>
        {pErrors.specialties && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "0 0 10px" }}>{pErrors.specialties}</p>}

        <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: "6px 0 6px" }}>Sugestões</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {specialtySuggestions.filter((s) => !pForm.specialties.includes(s)).map((s) => (
            <span key={s} onClick={() => addSpecialty(s)} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 500, fontFamily: fontBody, background: colors.muted, color: colors.mutedForeground, cursor: "pointer" }}>+ {s}</span>
          ))}
        </div>

        {pForm.specialties.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 6px" }}>Suas especialidades ({pForm.specialties.length})</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {pForm.specialties.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: fontBody, background: gradientKira, color: colors.primaryForeground }}>
                  <Sparkles size={11} />{s}
                  <X size={11} style={{ cursor: "pointer" }} onClick={() => removeSpecialty(s)} />
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20 }}><PrimaryButton onClick={() => { if (pForm.specialties.length === 0) { setPErrors({ specialties: "Adicione pelo menos uma especialidade" }); return; } setScreen("proServices"); }}>Continuar</PrimaryButton></div>
      </div>
    </div>
  );

  const renderProServices = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={6} />
      <Header onBack={() => setScreen("proSpecialties")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Serviços</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Cadastre os serviços que você oferece, com valor e tempo estimado.</p>

        <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${colors.border}`, marginBottom: 14 }}>
          <Field label="Nome do serviço">
            <input value={serviceDraft.name} onChange={(e) => setServiceDraft((s) => ({ ...s, name: e.target.value }))} placeholder="Ex.: Corte feminino" style={inputStyle(false)} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Valor (R$)">
              <input value={serviceDraft.price} onChange={(e) => setServiceDraft((s) => ({ ...s, price: e.target.value }))} placeholder="Ex.: 80" style={inputStyle(false)} />
            </Field>
            <Field label="Tempo estimado">
              <input value={serviceDraft.duration} onChange={(e) => setServiceDraft((s) => ({ ...s, duration: e.target.value }))} placeholder="Ex.: 45 min" style={inputStyle(false)} />
            </Field>
          </div>
          <SecondaryButton onClick={addService}><Plus size={15} /> Adicionar serviço</SecondaryButton>
        </div>

        {pErrors.services && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "0 0 10px" }}>{pErrors.services}</p>}

        {pForm.services.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 8px" }}>Serviços cadastrados ({pForm.services.length})</p>
            {pForm.services.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12, border: `1px solid ${colors.border}`, marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: colors.foreground, fontFamily: fontBody, margin: 0 }}>{s.name}</p>
                  <p style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>{s.duration}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.primary, fontFamily: fontBody }}>R$ {s.price}</span>
                  <Trash2 size={15} color={colors.mutedForeground} style={{ cursor: "pointer" }} onClick={() => removeService(s.id)} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 8 }}><PrimaryButton onClick={() => { if (pForm.services.length === 0) { setPErrors({ services: "Adicione pelo menos um serviço" }); return; } setScreen("proPhotos"); }}>Continuar</PrimaryButton></div>
      </div>
    </div>
  );

  const renderProPhotos = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={7} />
      <Header onBack={() => setScreen("proServices")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Fotos</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Mostre seu estabelecimento e trabalhos. Sem limite de fotos.</p>

        <input ref={pWorkPhotosInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleWorkPhotos(e.target.files)} />
        <button onClick={() => pWorkPhotosInputRef.current?.click()} style={{ width: "100%", padding: 26, borderRadius: 16, border: `2px dashed ${pErrors.workPhotos ? colors.destructive : colors.border}`, background: colors.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 14 }}>
          <ImagePlus size={26} color={colors.mutedForeground} />
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.primary, fontFamily: fontBody }}>Adicionar fotos</span>
          <span style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, textAlign: "center" }}>Estabelecimento e trabalhos realizados. Sem limite.</span>
        </button>
        {pErrors.workPhotos && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "-8px 0 10px" }}>{pErrors.workPhotos}</p>}

        {pForm.workPhotos.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 8px" }}>Fotos adicionadas ({pForm.workPhotos.length})</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {pForm.workPhotos.map((photo, idx) => (
                <div key={idx} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden" }}>
                  <img src={photo} alt={`Foto ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div onClick={() => removeWorkPhoto(idx)} style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={12} color={colors.foreground} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}><PrimaryButton onClick={() => { if (pForm.workPhotos.length === 0) { setPErrors({ workPhotos: "Adicione pelo menos uma foto" }); return; } setScreen("proTerms"); }}>Continuar</PrimaryButton></div>
      </div>
    </div>
  );

  const renderProDocument = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={4} />
      <Header onBack={() => setScreen("proLocation")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Documento de identidade</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Envie a foto da frente e do verso do seu documento com foto.</p>
        <DocUploadBox label="Frente do documento" value={pForm.docFrontPhoto} error={pErrors.docFrontPhoto} inputRef={pDocFrontRef} onChange={(f) => handlePhoto(f, (v) => setPField("docFrontPhoto", v))} />
        <DocUploadBox label="Verso do documento" value={pForm.docBackPhoto} error={pErrors.docBackPhoto} inputRef={pDocBackRef} onChange={(f) => handlePhoto(f, (v) => setPField("docBackPhoto", v))} />
        <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, textAlign: "center", margin: "0 0 12px" }}>Aceitamos RG, CNH ou outro documento oficial com foto.</p>
        <PrimaryButton
          onClick={() => {
            const e = {};
            if (!pForm.docFrontPhoto) e.docFrontPhoto = "Adicione a foto da frente do documento";
            if (!pForm.docBackPhoto) e.docBackPhoto = "Adicione a foto do verso do documento";
            if (Object.keys(e).length > 0) { setPErrors(e); return; }
            setPErrors({});
            goToFace("proDocument", "proSpecialties");
          }}
        >
          Continuar para verificação facial
        </PrimaryButton>
      </div>
    </div>
  );

  const renderProTerms = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={8} />
      <Header onBack={() => setScreen("proPhotos")} />
      <div style={{ flex: 1, padding: "0 24px 32px" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Termos</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Só falta confirmar os termos para concluir o cadastro.</p>
        {[{ key: "termsUse", label: "Termos de Uso" }, { key: "termsPrivacy", label: "Política de Privacidade" }].map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }} onClick={() => setPField(key, !pForm[key])}>
              <span style={{ marginTop: 2, width: 18, height: 18, borderRadius: 6, border: `1px solid ${pForm[key] ? colors.primary : pErrors[key] ? colors.destructive : colors.border}`, background: pForm[key] ? colors.primary : colors.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {pForm[key] && <Check size={12} color={colors.primaryForeground} />}
              </span>
              <span style={{ fontSize: 13, color: colors.foreground, fontFamily: fontBody }}>Aceito {key === "termsUse" ? "os" : "a"} <span style={{ color: colors.primary, fontWeight: 600 }}>{label}</span></span>
            </label>
            {pErrors[key] && <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "4px 0 0 28px" }}>{pErrors[key]}</p>}
          </div>
        ))}
        <PrimaryButton onClick={() => validateTerms(pForm, setPErrors) && setScreen("proDone")}>Concluir cadastro</PrimaryButton>
      </div>
    </div>
  );

  const renderProDone = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={32} color={colors.primaryForeground} />
      </div>
      <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: 0 }}>Cadastro concluído!</h1>
      <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: 0 }}>O perfil profissional foi criado com sucesso.</p>
      <div style={{ width: "100%", maxWidth: 280 }}><PrimaryButton onClick={() => setScreen("proHome")}>Ir para o início</PrimaryButton></div>
    </div>
  );

  // ---------- NOVO: Telas do painel profissional ----------
  // Placeholder leve para os destinos "Buscar" e "Provador" da bottom nav do
  // profissional (mostrados no mockup do folheto, mas fora do escopo pedido
  // agora). Nada aqui altera o Provador virtual do cliente.
  const renderProPlaceholder = (title, message, activeKey) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proHome")} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={26} color={colors.mutedForeground} />
        </div>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18, color: colors.foreground, margin: 0 }}>{title}</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0, maxWidth: 240 }}>{message}</p>
      </div>
      <ProBottomNav active={activeKey} onNavigate={goToProTab} />
    </div>
  );

  // "Meu painel" — visão geral do profissional: estatísticas do dia,
  // faturamento semanal (gráfico) e próximos atendimentos, como no folheto.
  const renderProHome = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "20px 24px 4px" }}>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>Olá,</p>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "2px 0 18px" }}>
          {pForm.name ? pForm.name.split(" ")[0] : "Profissional"} <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle", color: colors.primary }} />
        </h1>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <ProStatCard label="Clientes hoje" value={proDashboardStats.clientsToday} icon={User} />
          <ProStatCard label="Receita" value={`R$ ${proDashboardStats.weeklyRevenue.toLocaleString("pt-BR")}`} icon={CreditCard} />
          <ProStatCard label="Nota" value={proDashboardStats.rating} icon={Star} />
        </div>

        <div
          onClick={() => setScreen("proFinance")}
          role="button"
          tabIndex={0}
          style={{ width: "100%", textAlign: "left", border: `1px solid ${colors.border}`, borderRadius: 18, background: colors.card, padding: 16, marginBottom: 22, cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: 0 }}>Faturamento semanal</h2>
            <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary }}>+{proDashboardStats.revenueDelta}%</span>
          </div>
          <RevenueBarChart data={proWeeklyRevenue} selectedIndex={proHomeRevenueSel} onSelect={(i) => { setProHomeRevenueSel(i); }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
              {proHomeRevenueSel !== null
                ? `${proWeeklyRevenue[proHomeRevenueSel].label} · R$ ${proWeeklyRevenue[proHomeRevenueSel].value.toLocaleString("pt-BR")}`
                : "Toque em um dia para ver o valor"}
            </span>
            <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary, display: "flex", alignItems: "center", gap: 2 }}>
              Ver gestão financeira <ChevronRight size={13} />
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: colors.foreground, margin: 0 }}>Próximos atendimentos</h2>
          <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.primary, cursor: "pointer" }} onClick={() => setScreen("proAgendaDash")}>Ver agenda</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {proUpcomingMock.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={17} color={colors.mutedForeground} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>{a.client}</p>
                <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{a.time} · {a.service}</p>
              </div>
              <ChevronRight size={16} color={colors.mutedForeground} />
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen("proSecurity")}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, border: "none", background: "hsl(340 70% 55% / 0.08)", cursor: "pointer", textAlign: "left" }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShieldCheck size={18} color={colors.primaryForeground} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>Perfil verificado</p>
            <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>Veja seu selo de confiança e segurança</p>
          </div>
          <ChevronRight size={18} color={colors.primary} />
        </button>
      </div>
      <ProBottomNav active="proHome" onNavigate={goToProTab} />
    </div>
  );

  // "Minha agenda" do profissional — reaproveita o CalendarHeader/CalendarMonth
  // já existentes (genéricos, recebidos por props), só com estado próprio.
  const renderProAgendaDash = () => {
    const dayAppointments = getProDayAppointments(proSelectedDate);
    const canGoPrev = proViewMonth.getFullYear() > today.getFullYear() || (proViewMonth.getFullYear() === today.getFullYear() && proViewMonth.getMonth() > today.getMonth());
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <div style={{ padding: "20px 24px 4px" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "0 0 4px" }}>Minha agenda</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 4px" }}>Horários em tempo real e confirmação automática</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px" }}>
          <CalendarHeader monthDate={proViewMonth} onPrev={() => changeProMonth(-1)} onNext={() => changeProMonth(1)} canGoPrev={canGoPrev} />
          <div style={{ marginBottom: 20 }}>
            <CalendarMonth monthDate={proViewMonth} selectedDate={proSelectedDate} today={today} monthKey={proMonthAnimKey} onSelect={setProSelectedDate} />
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>
            Atendimentos de {proSelectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
          </h2>
          {dayAppointments.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "28px 16px", textAlign: "center" }}>
              <Calendar size={28} color={colors.mutedForeground} />
              <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Nenhum atendimento neste dia.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {dayAppointments.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Clock size={17} color={colors.mutedForeground} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>{a.client}</p>
                    <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{a.time} · {a.service}</p>
                  </div>
                  <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: a.status === "confirmado" ? colors.primary : colors.accent }}>
                    {a.status === "confirmado" ? "✓ Confirmado" : "Aguardando"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <ProBottomNav active="proAgendaDash" onNavigate={goToProTab} />
      </div>
    );
  };

  // Menu de Perfil do profissional — mesma lógica do renderClientProfile.
  const renderProProfileMenu = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ background: gradientKira, padding: "28px 24px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
          {pForm.photo ? <img src={pForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={28} color={colors.primaryForeground} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 17, color: colors.primaryForeground, margin: 0 }}>{pForm.name || "Profissional Kira"}</p>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.primaryForeground, opacity: 0.85, margin: "2px 0 0" }}>{pForm.specialties.length > 0 ? pForm.specialties.join(" · ") : "Profissional da beleza"}</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px" }}>
        {proProfileMenu.map((section) => (
          <ProfileSection key={section.title} title={section.title}>
            {section.items.map((item, i) => (
              <ProfileMenuRow key={item.label} icon={item.icon} label={item.label} last={i === section.items.length - 1} onClick={() => setScreen(item.go)} />
            ))}
          </ProfileSection>
        ))}
        <button
          onClick={() => setScreen("splash")}
          style={{ width: "100%", padding: 13, borderRadius: 14, border: `1px solid hsl(0 84% 60% / 0.3)`, background: "hsl(0 84% 60% / 0.06)", color: colors.destructive, fontWeight: 700, fontSize: 13, fontFamily: fontBody, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <LogOut size={15} /> Sair da conta
        </button>
      </div>
      <ProBottomNav active="proProfileMenu" onNavigate={goToProTab} />
    </div>
  );

  // "Gestão financeira" — painel de controle financeiro do profissional:
  // saldo, próximo repasse, faturamento por semana ou mês (gráfico
  // interativo), formas de recebimento e últimas transações, conforme
  // "Controle financeiro com métricas e gráfico de faturamento" do folheto.
  const renderProFinance = () => {
    const periodTotal = financeData.reduce((sum, d) => sum + d.value, 0);
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("proProfileMenu")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Gestão financeira</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Controle financeiro com métricas e recebimento protegido.</p>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <ProStatCard label="Saldo disponível" value={`R$ ${Math.round(proDashboardStats.weeklyRevenue * 0.7)}`} icon={CreditCard} />
            <ProStatCard label="Próximo repasse" value="Sex, 18/07" icon={Calendar} />
          </div>

          <div style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.card, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: 0 }}>Faturamento</h2>
              <div style={{ display: "flex", gap: 4, background: colors.muted, borderRadius: 999, padding: 3 }}>
                {[{ key: "semana", label: "Semana" }, { key: "mes", label: "Mês" }].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => { setFinancePeriod(p.key); setFinanceRevenueSel(null); }}
                    style={{
                      padding: "5px 11px", borderRadius: 999, border: "none", cursor: "pointer",
                      fontFamily: fontBody, fontSize: 11, fontWeight: 700,
                      background: financePeriod === p.key ? colors.card : "transparent",
                      color: financePeriod === p.key ? colors.primary : colors.mutedForeground,
                      boxShadow: financePeriod === p.key ? "0 1px 2px hsl(280 20% 15% / 0.1)" : "none",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <RevenueBarChart data={financeData} selectedIndex={financeRevenueSel} onSelect={setFinanceRevenueSel} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
                {financeRevenueSel !== null
                  ? `${financeData[financeRevenueSel].label} · R$ ${financeData[financeRevenueSel].value.toLocaleString("pt-BR")}`
                  : "Toque em uma barra para ver o valor"}
              </span>
              <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.foreground }}>
                Total: R$ {periodTotal.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Formas de recebimento</h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["Pix", "Cartão", "Gift Card Kira"].map((m) => (
              <span key={m} style={{ padding: "8px 12px", borderRadius: 999, background: colors.muted, fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: colors.foreground }}>{m}</span>
            ))}
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Últimas transações</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {proTransactionsMock.map((tx) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                <div>
                  <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: 0 }}>{tx.client} · {tx.service}</p>
                  <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{tx.date} · {tx.method}</p>
                </div>
                <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>+R$ {tx.value.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <SecondaryButton onClick={() => {}}>Baixar relatório</SecondaryButton>
        </div>
      </div>
    );
  };

  // "Analytics" — painel de desempenho do profissional: atendimentos por
  // dia, serviços mais procurados, distribuição de avaliações e métricas
  // de conversão/retorno de clientes.
  const renderProAnalytics = () => {
    const maxServiceCount = Math.max(...proServiceRankingMock.map((s) => s.count));
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("proProfileMenu")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Analytics</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Desempenho do seu perfil profissional na Kira.</p>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <ProStatCard label="Ticket médio" value={`R$ ${proAnalyticsSummary.avgTicket}`} icon={CreditCard} />
            <ProStatCard label="Retorno de clientes" value={`${proAnalyticsSummary.retentionRate}%`} icon={TrendingUp} />
            <ProStatCard label="Conclusão" value={`${proAnalyticsSummary.completionRate}%`} icon={CheckCircle2} />
          </div>

          <div style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.card, padding: 16, marginBottom: 20 }}>
            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 14px" }}>Atendimentos por dia</h2>
            <RevenueBarChart data={proAppointmentsWeekMock} selectedIndex={proAnalyticsSel} onSelect={setProAnalyticsSel} />
            <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "12px 0 0" }}>
              {proAnalyticsSel !== null
                ? `${proAppointmentsWeekMock[proAnalyticsSel].label} · ${proAppointmentsWeekMock[proAnalyticsSel].value} atendimento(s)`
                : "Toque em um dia para ver o total"}
            </p>
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Serviços mais procurados</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {proServiceRankingMock.map((s) => (
              <div key={s.service} style={{ padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.foreground }}>{s.service}</span>
                  <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>{s.count}x · R$ {s.revenue}</span>
                </div>
                <div style={{ width: "100%", height: 6, borderRadius: 999, background: colors.muted, overflow: "hidden" }}>
                  <div style={{ width: `${(s.count / maxServiceCount) * 100}%`, height: "100%", borderRadius: 999, background: gradientKira }} />
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Distribuição de avaliações</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {proRatingBreakdownMock.map((r) => (
              <div key={r.stars} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: colors.foreground, width: 34, flexShrink: 0, display: "flex", alignItems: "center", gap: 2 }}>
                  {r.stars} <Star size={11} color={colors.primary} fill={colors.primary} />
                </span>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: colors.muted, overflow: "hidden" }}>
                  <div style={{ width: `${r.percent}%`, height: "100%", borderRadius: 999, background: gradientKira }} />
                </div>
                <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, width: 32, textAlign: "right", flexShrink: 0 }}>{r.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // "Gift Cards Kira" — vender/acompanhar gift cards como forma de pagamento.
  const renderProGiftCards = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Gift Cards Kira</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Aceite gift cards como forma de pagamento e acompanhe os que já foram vendidos.</p>

        {proGiftCardsMock.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "40px 24px", textAlign: "center" }}>
            <Gift size={30} color={colors.mutedForeground} />
            <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Nenhum gift card vendido ainda.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {proGiftCardsMock.map((gc) => (
              <div key={gc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Gift size={17} color={colors.primaryForeground} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.foreground, margin: 0 }}>{gc.code}</p>
                  <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>Comprado por {gc.buyer}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>R$ {gc.value}</span>
                  <span style={{ fontFamily: fontBody, fontSize: 10, fontWeight: 600, color: gc.status === "ativo" ? colors.primary : colors.mutedForeground }}>{gc.status === "ativo" ? "Ativo" : "Usado"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <SecondaryButton onClick={() => {}}><Plus size={15} /> Criar novo Gift Card</SecondaryButton>
      </div>
    </div>
  );

  // "Programa de fidelidade" — pontos, cashback e recompensas.
  const renderProLoyalty = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Programa de fidelidade</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Fidelize clientes com pontos, cashback e recompensas.</p>

        <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card, marginBottom: 18, cursor: "pointer" }} onClick={() => setLoyaltySettings((s) => ({ ...s, enabled: !s.enabled }))}>
          <span style={{ width: 18, height: 18, borderRadius: 6, border: `1px solid ${loyaltySettings.enabled ? colors.primary : colors.border}`, background: loyaltySettings.enabled ? colors.primary : colors.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {loyaltySettings.enabled && <Check size={12} color={colors.primaryForeground} />}
          </span>
          <span style={{ flex: 1, fontFamily: fontBody, fontSize: 13, color: colors.foreground, fontWeight: 600 }}>Ativar programa de fidelidade</span>
        </label>

        <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: "0 0 8px" }}>Pontos por real gasto</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input type="range" min={0} max={5} step={0.5} value={loyaltySettings.pointsPerReal} onChange={(e) => setLoyaltySettings((s) => ({ ...s, pointsPerReal: Number(e.target.value) }))} style={{ flex: 1, accentColor: colors.primary }} />
          <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, minWidth: 60, textAlign: "right" }}>{loyaltySettings.pointsPerReal} pts</span>
        </div>

        <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: "0 0 8px" }}>Cashback</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <input type="range" min={0} max={20} step={1} value={loyaltySettings.cashbackPercent} onChange={(e) => setLoyaltySettings((s) => ({ ...s, cashbackPercent: Number(e.target.value) }))} style={{ flex: 1, accentColor: colors.primary }} />
          <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, minWidth: 44, textAlign: "right" }}>{loyaltySettings.cashbackPercent}%</span>
        </div>

        <PrimaryButton onClick={() => {}}>Salvar configurações</PrimaryButton>
      </div>
    </div>
  );

  // "Segurança Kira" — perfil verificado, checklist de credibilidade e
  // Canal de Segurança, conforme a segunda página do folheto profissional.
  const renderProSecurity = () => {
    const hasDocs = !!pForm.docFrontPhoto && !!pForm.docBackPhoto;
    const certCount = pForm.specialties.length;
    const verified = hasDocs;
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen("proProfileMenu")} />
        <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Segurança Kira</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Credibilidade que gera confiança, para você e para seus clientes.</p>

          <div style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.card, padding: 18, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: colors.muted, flexShrink: 0 }}>
                {pForm.photo ? <img src={pForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={22} color={colors.mutedForeground} />}
              </div>
              <div>
                <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 14, color: colors.foreground, margin: 0 }}>{pForm.name || "Profissional Kira"}</p>
                {verified && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary, marginTop: 2 }}>
                    <BadgeCheck size={13} /> Perfil verificado
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Documento validado", detail: hasDocs ? "CPF confirmado" : "Pendente", done: hasDocs },
                { label: "Certificados autenticados", detail: `${certCount} certificado${certCount === 1 ? "" : "s"} enviado${certCount === 1 ? "" : "s"}`, done: certCount > 0 },
                { label: "Avaliações reais", detail: `${proDashboardStats.rating} · avaliações confirmadas`, done: true },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: colors.muted }}>
                  {item.done ? <CheckCircle2 size={16} color={colors.primary} /> : <Clock size={16} color={colors.mutedForeground} />}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: 0 }}>{item.label}</p>
                    <p style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground, margin: 0 }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ padding: "8px 12px", borderRadius: 999, background: gradientKira, color: colors.primaryForeground, fontFamily: fontBody, fontSize: 11, fontWeight: 700 }}>Pagamento protegido</span>
              <span onClick={() => setScreen("proFinance")} style={{ padding: "8px 12px", borderRadius: 999, background: colors.muted, color: colors.foreground, fontFamily: fontBody, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Histórico completo</span>
            </div>
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Canal de Segurança</h2>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 14px" }}>A proteção vale para os dois lados. Clientes também passam por verificação, e você pode reportar qualquer situação suspeita de forma protegida, com análise da equipe Kira.</p>
          <SecondaryButton onClick={() => {}}><ShieldCheck size={15} /> Reportar situação suspeita</SecondaryButton>
        </div>
      </div>
    );
  };

  // "Ajuda e suporte" do profissional — mesma lógica do renderClientHelpSupport.
  const renderProHelp = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Ajuda e suporte</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Como podemos ajudar?</p>
        <ProfileSection title="Dúvidas frequentes">
          {["Como funciona a recomendação por IA?", "Como recebo pelos meus atendimentos?", "Como funciona o Canal de Segurança?"].map((q, i, arr) => (
            <ProfileMenuRow key={q} icon={HelpCircle} label={q} last={i === arr.length - 1} onClick={() => {}} />
          ))}
        </ProfileSection>
        <SecondaryButton onClick={() => {}}><MessageCircle size={15} /> Conversar com o suporte</SecondaryButton>
      </div>
    </div>
  );

  // ---------- Compartilhado ----------
  const renderFace = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen(faceBackTo)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: 0 }}>Reconhecimento facial</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: 0, maxWidth: 260 }}>Posicione seu rosto no centro da câmera para validar sua identidade.</p>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: colors.muted, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {faceStatus === "idle" && <ScanFace size={44} color={colors.mutedForeground} />}
          {faceStatus === "scanning" && (
            <>
              <div style={{ width: "75%", height: "75%", borderRadius: "50%", border: "4px solid hsl(340 70% 55% / 0.7)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: colors.primary, top: `${faceProgress}%` }} />
            </>
          )}
          {faceStatus === "success" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={44} color={colors.primary} />
              <span style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: colors.foreground }}>Identidade verificada</span>
            </div>
          )}
        </div>
        {faceStatus === "scanning" && <p style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>Analisando rosto… {faceProgress}%</p>}
        <div style={{ width: "100%", maxWidth: 280 }}>
          {faceStatus === "idle" && <PrimaryButton onClick={startFaceScan}>Iniciar verificação</PrimaryButton>}
          {faceStatus === "success" && <PrimaryButton onClick={() => setScreen(faceReturnTo)}>Continuar</PrimaryButton>}
        </div>
        <p style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: fontBody, textAlign: "center", margin: 0 }}>Tela de teste — nenhum dado biométrico é armazenado.</p>
      </div>
    </div>
  );

  const renderHome = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      <p style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: colors.foreground, margin: 0 }}>Bem-vinda! ✨</p>
      <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: 0 }}>A partir daqui entra a Home real do app (fora do escopo deste protótipo).</p>
      <div style={{ width: "100%", maxWidth: 240 }}>
        <PrimaryButton
          onClick={() => {
            setCForm(initialClientForm); setCErrors({});
            setPForm(initialProForm); setPErrors({});
            setFaceStatus("idle"); setCLocationStatus("idle"); setPLocationStatus("idle"); setCPreferences([]);
            setScreen("splash");
          }}
        >
          Reiniciar protótipo
        </PrimaryButton>
      </div>
    </div>
  );

  // ---------- Ranking personalizado ----------
  function renderClientRanking() {
    const isPersonalized = rankingSource === "provador";
    const recommendedList = recommended;
    const nearby = [...mockProfessionals].sort((a, b) => a.distance - b.distance).slice(0, 6);

    const openProfile = (proId) => {
      setSelectedProId(proId);
      setBookedSlot(null);
      setScreen("clientProfessionalProfile");
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen(isPersonalized ? "clientTryOnResult" : "clientHome")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "0 0 4px" }}>Ranking</h1>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Profissionais que combinam com você</p>

          {isPersonalized ? (
            <>
              <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 17, color: colors.foreground, margin: "0 0 4px" }}>✨ Recomendados para você</h2>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 16px" }}>Encontramos profissionais que combinam com o resultado que você escolheu.</p>

              {rankingLoading ? (
                <SkeletonLoading count={3} />
              ) : rankingError ? (
                <ErrorState onRetry={loadRanking} message="Não foi possível carregar suas recomendações agora." />
              ) : recommendedList.length === 0 ? (
                <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "24px 0", textAlign: "center" }}>Nenhum profissional encontrado para esse resultado.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                  {recommendedList.map((pro) => (
                    <RecommendedProfessionalCard key={pro.id} pro={pro} onViewProfile={() => openProfile(pro.id)} />
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 4 }}>
                <SecondaryButton onClick={() => { setRankingSource("direct"); }}>Ver ranking geral</SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 12px" }}>
                <Trophy size={16} color={colors.accent} />
                <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 17, color: colors.foreground, margin: 0 }}>🏆 Melhores avaliados</h2>
              </div>

              <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 0 14px" }}>
                {rankingCategoryOptions.map((c) => (
                  <CategoryChip key={c.id} label={c.label} active={rankingCategory === c.id} onClick={() => setRankingCategory(c.id)} />
                ))}
              </div>

              {rankingLoading ? (
                <SkeletonLoading count={5} />
              ) : rankingError ? (
                <ErrorState onRetry={loadRanking} message="Não foi possível carregar o ranking agora." />
              ) : recommendedList.length === 0 ? (
                <EmptyState onClear={() => setRankingCategory("todos")} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {recommendedList.map((pro, i) => (
                    <RankingCard key={pro.id} pro={pro} rank={i + 1} onClick={() => openProfile(pro.id)} />
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 12px" }}>
                <MapPin size={16} color={colors.primary} />
                <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: colors.foreground, margin: 0 }}>Perto de você</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {nearby.map((pro) => (
                  <ProfessionalCard key={pro.id} pro={pro} onClick={() => openProfile(pro.id)} />
                ))}
              </div>
            </>
          )}
        </div>
        <BottomNav active="clientRanking" onNavigate={goToTab} />
      </div>
    );
  }

  const screens = {
    splash: renderSplash,
    login: renderLogin,
    signup: renderSignup,
    clientPersonal: renderClientPersonal,
    clientAddress: renderClientAddress,
    clientLocation: renderClientLocation,
    clientDocument: renderClientDocument,
    clientSelfie: renderClientSelfie,
    clientTerms: renderClientTerms,
    clientDone: renderClientDone,
    clientPreferences: renderClientPreferences,
    clientHome: renderClientHome,
    clientSearch: renderClientSearch,
    clientRanking: renderClientRanking,
    clientTryOnReference: renderClientTryOnReference,
    clientTryOnPhoto: renderClientTryOnPhoto,
    clientTryOnResult: renderClientTryOnResult,
    clientAgenda: renderClientAgenda,
    clientAgendaDetail: renderClientAgendaDetail,
    clientProfile: renderClientProfile,
    clientProfileEdit: renderClientProfileEdit,
    clientAccountSecurity: renderClientAccountSecurity,
    clientPrivacyData: renderClientPrivacyData,
    clientLgpdConsents: renderClientLgpdConsents,
    clientPaymentMethods: renderClientPaymentMethods,
    clientPaymentHistory: renderClientPaymentHistory,
    clientCoupons: renderClientCoupons,
    clientHelpSupport: renderClientHelpSupport,
    clientReviews: renderClientReviews,
    clientFavorites: renderClientFavorites,
    clientHistory: renderClientHistory,
    clientProfessionalProfile: renderClientProfessionalProfile,
    clientScheduling: renderClientScheduling,
    proPersonal: renderProPersonal,
    proAddress: renderProAddress,
    proLocation: renderProLocation,
    proSpecialties: renderProSpecialties,
    proServices: renderProServices,
    proPhotos: renderProPhotos,
    proDocument: renderProDocument,
    proTerms: renderProTerms,
    proDone: renderProDone,
    proHome: renderProHome,
    proAgendaDash: renderProAgendaDash,
    proProfileMenu: renderProProfileMenu,
    proFinance: renderProFinance,
    proAnalytics: renderProAnalytics,
    proGiftCards: renderProGiftCards,
    proLoyalty: renderProLoyalty,
    proSecurity: renderProSecurity,
    proHelp: renderProHelp,
    proSearch: () => renderProPlaceholder("Buscar", "Em breve você poderá buscar parcerias e profissionais próximos.", "proSearch"),
    face: renderFace,
    home: renderHome,
  };

  const navGroups = [
    { label: "Início", screens: [["Splash", "splash"], ["Login", "login"], ["Escolher tipo", "signup"]] },
    { label: "Cliente", screens: [["Dados", "clientPersonal"], ["Endereço", "clientAddress"], ["Localização", "clientLocation"], ["Documento", "clientDocument"], ["Selfie", "clientSelfie"], ["Termos", "clientTerms"], ["Concluído", "clientDone"], ["Personalizar", "clientPreferences"], ["Home (dashboard)", "clientHome"], ["Buscar", "clientSearch"], ["Ranking", "clientRanking"], ["Perfil Pro (mock)", "clientProfessionalProfile"], ["Agendamento (mock)", "clientScheduling"], ["Provador: referência", "clientTryOnReference"], ["Provador: foto", "clientTryOnPhoto"], ["Provador: resultado", "clientTryOnResult"], ["Agenda", "clientAgenda"], ["Agenda: detalhe", "clientAgendaDetail"], ["Perfil (menu)", "clientProfile"], ["Perfil: editar", "clientProfileEdit"], ["Perfil: segurança", "clientAccountSecurity"], ["Perfil: privacidade", "clientPrivacyData"], ["Perfil: LGPD", "clientLgpdConsents"], ["Perfil: pagamentos", "clientPaymentMethods"], ["Perfil: hist. pagamentos", "clientPaymentHistory"], ["Perfil: cupons", "clientCoupons"], ["Perfil: ajuda", "clientHelpSupport"], ["Perfil: avaliações", "clientReviews"], ["Perfil: favoritos", "clientFavorites"], ["Perfil: histórico", "clientHistory"]] },
    { label: "Profissional", screens: [["Dados", "proPersonal"], ["Endereço", "proAddress"], ["Localização", "proLocation"], ["Documento", "proDocument"], ["Selfie", "face"], ["Especialidades", "proSpecialties"], ["Serviços", "proServices"], ["Fotos", "proPhotos"], ["Termos", "proTerms"], ["Concluído", "proDone"], ["Painel", "proHome"], ["Agenda", "proAgendaDash"], ["Perfil (menu)", "proProfileMenu"], ["Financeiro", "proFinance"], ["Analytics", "proAnalytics"], ["Gift Cards", "proGiftCards"], ["Fidelidade", "proLoyalty"], ["Segurança Kira", "proSecurity"], ["Ajuda", "proHelp"], ["Buscar (em breve)", "proSearch"]] },
  ];

  return (
    <div style={outer}>
      <style>{".spin { animation: kiraspin 1s linear infinite; } @keyframes kiraspin { to { transform: rotate(360deg); } }"}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={phoneFrame}>{screens[screen]()}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 390 }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: colors.mutedForeground, fontFamily: fontBody, width: 72 }}>{group.label}</span>
              {group.screens.map(([label, key]) => (
                <button
                  key={key}
                  onClick={() => setScreen(key)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: `1px solid ${screen === key ? colors.primary : colors.border}`,
                    background: screen === key ? "hsl(340 70% 55% / 0.1)" : colors.card,
                    color: screen === key ? colors.primary : colors.mutedForeground,
                    fontSize: 10,
                    fontFamily: fontBody,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
