// Cadastro: aceite de termos · API: nenhuma
import { Check } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ClientTermsScreen() {
  const {
    cErrors,
    cForm,
    setCErrors,
    setCField,
    setScreen,
    validateTerms,
  } = useKira();
  return (
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
}
