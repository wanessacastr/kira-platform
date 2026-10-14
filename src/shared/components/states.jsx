// Estados de carregamento (skeleton), vazio e erro · API: nenhuma
import { AlertCircle, SearchX } from "lucide-react";
import { colors, fontBody } from "../theme";
import { PrimaryButton, SecondaryButton } from "./ui";

export const SkeletonCard = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 16,
      border: `1px solid ${colors.border}`,
      background: colors.card,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: colors.muted,
        animation: "kiraPulse 1.2s ease-in-out infinite",
      }}
    />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          width: "55%",
          height: 11,
          borderRadius: 6,
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "35%",
          height: 9,
          borderRadius: 6,
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "45%",
          height: 9,
          borderRadius: 6,
          background: colors.muted,
          animation: "kiraPulse 1.2s ease-in-out infinite",
        }}
      />
    </div>
  </div>
);

export const SkeletonLoading = ({ count = 5 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <style>{"@keyframes kiraPulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }"}</style>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const EmptyState = ({ onClear }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      padding: "48px 24px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: colors.muted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SearchX size={30} color={colors.mutedForeground} />
    </div>
    <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>
      Nenhum profissional encontrado.
    </p>
    <div style={{ width: "100%", maxWidth: 220 }}>
      <SecondaryButton onClick={onClear}>Limpar filtros</SecondaryButton>
    </div>
  </div>
);

export const ErrorState = ({ onRetry, message = "Não foi possível carregar os profissionais agora." }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      padding: "48px 24px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "hsl(0 84% 60% / 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AlertCircle size={30} color={colors.destructive} />
    </div>
    <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>{message}</p>
    <div style={{ width: "100%", maxWidth: 220 }}>
      <PrimaryButton onClick={onRetry}>Tentar novamente</PrimaryButton>
    </div>
  </div>
);
