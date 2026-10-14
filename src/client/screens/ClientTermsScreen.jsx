// Cadastro: aceite de termos · API: nenhuma
import { Check } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ClientTermsScreen() {
  const { cErrors, cForm, setCErrors, setCField, setScreen, validateTerms } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={6} />
      <Header onBack={() => setScreen("clientSelfie")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Termos
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
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
              onClick={() => setCField(key, !cForm[key])}
            >
              <span
                style={{
                  marginTop: "var(--space-2)",
                  width: 18,
                  height: 18,
                  borderRadius: "var(--radius-xs)",
                  border: `1px solid ${cForm[key] ? colors.primary : cErrors[key] ? colors.destructive : colors.border}`,
                  background: cForm[key] ? colors.primary : colors.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {cForm[key] && <Check size={12} color={colors.primaryForeground} />}
              </span>
              <span style={{ fontSize: "var(--font-size-sm)", color: colors.foreground, fontFamily: fontBody }}>
                Aceito {key === "termsUse" ? "os" : "a"}{" "}
                <span style={{ color: colors.primary, fontWeight: 600 }}>{label}</span>
              </span>
            </label>
            {cErrors[key] && (
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: colors.destructive,
                  fontFamily: fontBody,
                  margin: "var(--space-4) 0 0 var(--space-28)",
                }}
              >
                {cErrors[key]}
              </p>
            )}
          </div>
        ))}
        <PrimaryButton onClick={() => validateTerms(cForm, setCErrors) && setScreen("clientDone")}>
          Concluir cadastro
        </PrimaryButton>
      </div>
    </div>
  );
}
