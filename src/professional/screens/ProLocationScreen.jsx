// Cadastro: ativar localização · API do navegador: geolocation
import { AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { useLocationActivation } from "../../shared/hooks/useLocationActivation";

export default function ProLocationScreen() {
  const { pForm, setPForm } = useSignup();
  const { setScreen } = useSession();
  const { status: pLocationStatus, activate: handleActivateLocation } = useLocationActivation(
    setPForm,
    Boolean(pForm.latitude),
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={3} />
      <Header onBack={() => setScreen("proAddress")} />
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
          Localização
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Isso nos ajuda a mostrar seu perfil para clientes próximos.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-12)",
            padding: "var(--space-22)",
            borderRadius: "var(--radius-2xl)",
            border: `1px solid ${colors.border}`,
            textAlign: "center",
            marginBottom: "var(--space-16)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "var(--radius-round)",
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapPin size={22} color={colors.primaryForeground} />
          </div>
          {pLocationStatus === "idle" && (
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: 0,
              }}
            >
              Ative sua localização para clientes próximos encontrarem você.
            </p>
          )}
          {pLocationStatus === "loading" && (
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "var(--space-6)",
              }}
            >
              <Loader2 size={14} /> Obtendo localização…
            </p>
          )}
          {pLocationStatus === "success" && (
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: colors.primaryText,
                  fontFamily: fontBody,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-6)",
                  justifyContent: "center",
                  margin: "0 0 var(--space-2)",
                }}
              >
                <CheckCircle2 size={16} /> Localização ativada
              </p>
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  fontFamily: fontBody,
                  margin: 0,
                }}
              >
                Lat {pForm.latitude?.toFixed(4)}, Long {pForm.longitude?.toFixed(4)}
              </p>
            </div>
          )}
          {pLocationStatus === "error" && (
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: colors.destructiveText,
                  fontFamily: fontBody,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-6)",
                  justifyContent: "center",
                  margin: "0 0 var(--space-2)",
                }}
              >
                <AlertCircle size={16} /> Não foi possível ativar
              </p>
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: colors.mutedForeground,
                  fontFamily: fontBody,
                  margin: 0,
                }}
              >
                Você pode ativar depois, nas configurações.
              </p>
            </div>
          )}
          {(pLocationStatus === "idle" || pLocationStatus === "error") && (
            <PrimaryButton pill onClick={() => handleActivateLocation()}>
              {pLocationStatus === "error" ? "Tentar novamente" : "Ativar localização"}
            </PrimaryButton>
          )}
        </div>
        <PrimaryButton onClick={() => setScreen("proDocument")}>Continuar</PrimaryButton>
      </div>
    </div>
  );
}
