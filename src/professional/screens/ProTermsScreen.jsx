// Cadastro: aceite de termos · API: nenhuma
import { Check } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { Checkbox } from "../../shared/components/primitives";

export default function ProTermsScreen() {
  const { pErrors, pForm, setPErrors, setPField, validateTerms } = useSignup();
  const { setScreen } = useSession();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={8} />
      <Header onBack={() => setScreen("proPhotos")} />
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
            <label style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-10)", cursor: "pointer" }}>
              <Checkbox
                checked={!!pForm[key]}
                onChange={() => setPField(key, !pForm[key])}
                invalid={!!pErrors[key]}
                style={{ marginTop: "var(--space-2)" }}
              />
              <span style={{ fontSize: "var(--font-size-sm)", color: colors.foreground, fontFamily: fontBody }}>
                Aceito {key === "termsUse" ? "os" : "a"}{" "}
                <span style={{ color: colors.primaryText, fontWeight: 600 }}>{label}</span>
              </span>
            </label>
            {pErrors[key] && (
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: colors.destructiveText,
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
