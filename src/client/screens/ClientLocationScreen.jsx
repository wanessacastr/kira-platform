// Cadastro: ativar localização · API do navegador: geolocation
import { AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

export default function ClientLocationScreen() {
  const { cForm, cLocationStatus, handleActivateLocation, setCForm, setCLocationStatus, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={3} />
      <Header onBack={() => setScreen("clientAddress")} />
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
          Localização
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Isso nos ajuda a encontrar profissionais perto de você.
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
              borderRadius: "50%",
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapPin size={22} color={colors.primaryForeground} />
          </div>
          {cLocationStatus === "idle" && (
            <p
              style={{
                fontSize: 12,
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: 0,
              }}
            >
              Ative sua localização para encontrarmos profissionais mais próximos de você.
            </p>
          )}
          {cLocationStatus === "loading" && (
            <p
              style={{
                fontSize: 12,
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
          {cLocationStatus === "success" && (
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.primary,
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
                  fontSize: 11,
                  color: colors.mutedForeground,
                  fontFamily: fontBody,
                  margin: 0,
                }}
              >
                Lat {cForm.latitude?.toFixed(4)}, Long {cForm.longitude?.toFixed(4)}
              </p>
            </div>
          )}
          {cLocationStatus === "error" && (
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.destructive,
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
                  fontSize: 11,
                  color: colors.mutedForeground,
                  fontFamily: fontBody,
                  margin: 0,
                }}
              >
                Você pode ativar depois, nas configurações.
              </p>
            </div>
          )}
          {(cLocationStatus === "idle" || cLocationStatus === "error") && (
            <PrimaryButton pill onClick={() => handleActivateLocation(setCForm, setCLocationStatus)}>
              {cLocationStatus === "error" ? "Tentar novamente" : "Ativar localização"}
            </PrimaryButton>
          )}
        </div>
        <PrimaryButton onClick={() => setScreen("clientDocument")}>Continuar</PrimaryButton>
      </div>
    </div>
  );
}
