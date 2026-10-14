// Cadastro concluído · API: nenhuma
import { Check } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { PrimaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

export default function ProDoneScreen() {
  const { setScreen } = useKira();
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-16)",
        padding: "var(--space-24)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: gradientKira,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={32} color={colors.primaryForeground} />
      </div>
      <h1
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: "var(--font-size-2xl)",
          color: colors.foreground,
          margin: 0,
        }}
      >
        Cadastro concluído!
      </h1>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-xs)",
          color: colors.mutedForeground,
          textAlign: "center",
          margin: 0,
        }}
      >
        O perfil profissional foi criado com sucesso.
      </p>
      <div style={{ width: "100%", maxWidth: 280 }}>
        <PrimaryButton onClick={() => setScreen("proHome")}>Ir para o início</PrimaryButton>
      </div>
    </div>
  );
}
