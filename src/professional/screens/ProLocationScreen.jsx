// Cadastro: ativar localização · API do navegador: geolocation
import { AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

export default function ProLocationScreen() {
  const {
    handleActivateLocation,
    pForm,
    pLocationStatus,
    setPForm,
    setPLocationStatus,
    setScreen,
  } = useKira();
  return (
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
}
