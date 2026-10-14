// Cadastro: selfie · API do navegador: getUserMedia (câmera)
import { AlertCircle } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, SecondaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ClientSelfieScreen() {
  const {
    cForm,
    cSelfieCanvasRef,
    cSelfieError,
    cSelfieStatus,
    cSelfieVideoRef,
    captureClientSelfie,
    retakeClientSelfie,
    setScreen,
    startClientSelfieCamera,
    stopClientSelfieCamera,
  } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={6} done={5} />
      <Header
        onBack={() => {
          stopClientSelfieCamera();
          setScreen("clientDocument");
        }}
      />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Verificação Facial
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Tire uma selfie para aumentarmos a segurança da sua conta e confirmarmos sua identidade.
        </p>

        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            maxWidth: 280,
            margin: "0 auto var(--space-16)",
            borderRadius: "var(--radius-4xl)",
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
            <img
              src={cForm.selfiePhoto}
              alt="Prévia da selfie"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : cSelfieStatus === "error" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-8)",
                padding: "var(--space-20)",
                textAlign: "center",
              }}
            >
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
            <div
              style={{
                position: "absolute",
                inset: 14,
                borderRadius: "var(--radius-xl)",
                border: "2px solid hsl(var(--primary-hsl) / 0.6)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
        <canvas ref={cSelfieCanvasRef} style={{ display: "none" }} />

        <div
          style={{
            width: "100%",
            maxWidth: 280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-10)",
          }}
        >
          {!cForm.selfiePhoto && cSelfieStatus !== "error" && (
            <PrimaryButton onClick={captureClientSelfie} disabled={cSelfieStatus !== "streaming"}>
              Tirar selfie
            </PrimaryButton>
          )}
          {cSelfieStatus === "error" && (
            <PrimaryButton onClick={startClientSelfieCamera}>Tentar novamente</PrimaryButton>
          )}
          {cForm.selfiePhoto && (
            <>
              <PrimaryButton onClick={() => setScreen("clientTerms")}>Confirmar selfie</PrimaryButton>
              <SecondaryButton onClick={retakeClientSelfie}>Tirar novamente</SecondaryButton>
            </>
          )}
        </div>
        <p
          style={{
            fontSize: 10,
            color: colors.mutedForeground,
            fontFamily: fontBody,
            textAlign: "center",
            margin: "var(--space-14) 0 0",
          }}
        >
          Sua selfie é usada apenas para confirmar sua identidade.
        </p>
      </div>
    </div>
  );
}
