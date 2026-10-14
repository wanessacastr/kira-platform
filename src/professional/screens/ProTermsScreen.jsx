// Cadastro: aceite de termos · API: nenhuma
import { Check } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ProTermsScreen() {
  const { pErrors, pForm, setPErrors, setPField, setScreen, validateTerms } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={8} />
      <Header onBack={() => setScreen("proPhotos")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Termos
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Só falta confirmar os termos para concluir o cadastro.
        </p>
        {[
          { key: "termsUse", label: "Termos de Uso" },
          { key: "termsPrivacy", label: "Política de Privacidade" },
        ].map(({ key, label }) => (
          <div key={key} style={{ marginBottom: "var(--space-14)" }}>
            <label
              style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-10)", cursor: "pointer" }}
              onClick={() => setPField(key, !pForm[key])}
            >
              <span
                style={{
                  marginTop: "var(--space-2)",
                  width: 18,
                  height: 18,
                  borderRadius: "var(--radius-xs)",
                  border: `1px solid ${pForm[key] ? colors.primary : pErrors[key] ? colors.destructive : colors.border}`,
                  background: pForm[key] ? colors.primary : colors.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {pForm[key] && <Check size={12} color={colors.primaryForeground} />}
              </span>
              <span style={{ fontSize: 13, color: colors.foreground, fontFamily: fontBody }}>
                Aceito {key === "termsUse" ? "os" : "a"}{" "}
                <span style={{ color: colors.primary, fontWeight: 600 }}>{label}</span>
              </span>
            </label>
            {pErrors[key] && (
              <p
                style={{
                  fontSize: 11,
                  color: colors.destructive,
                  fontFamily: fontBody,
                  margin: "var(--space-4) 0 0 var(--space-28)",
                }}
              >
                {pErrors[key]}
              </p>
            )}
          </div>
        ))}
        <PrimaryButton onClick={() => validateTerms(pForm, setPErrors) && setScreen("proDone")}>
          Concluir cadastro
        </PrimaryButton>
      </div>
    </div>
  );
}
