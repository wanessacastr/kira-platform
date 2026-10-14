// Verificação facial simulada, nenhum dado biométrico é salvo · API: nenhuma
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, ScanFace } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { Header, PrimaryButton } from "../components/ui";
import { colors, fontBody, fontDisplay } from "../theme";

// ---------- Compartilhado ----------
export default function FaceScreen() {
  const { setScreen } = useSession();
  const { state } = useLocation();
  const faceBackTo = state?.backTo ?? "terms";
  const faceReturnTo = state?.returnTo ?? "home";
  const [faceStatus, setFaceStatus] = useState("idle"); // idle | scanning | success
  const [faceProgress, setFaceProgress] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => () => clearInterval(timerRef.current), []);
  const startFaceScan = () => {
    setFaceStatus("scanning");
    setFaceProgress(0);
    timerRef.current = setInterval(() => {
      setFaceProgress((p) => {
        if (p >= 100) {
          clearInterval(timerRef.current);
          setFaceStatus("success");
          return 100;
        }
        return p + 5;
      });
    }, 70);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen(faceBackTo)} />
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
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: 0,
          }}
        >
          Reconhecimento facial
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            textAlign: "center",
            margin: 0,
            maxWidth: 260,
          }}
        >
          Posicione seu rosto no centro da câmera para validar sua identidade.
        </p>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "var(--radius-round)",
            background: colors.muted,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {faceStatus === "idle" && <ScanFace size={44} color={colors.mutedForeground} />}
          {faceStatus === "scanning" && (
            <>
              <div
                style={{
                  width: "75%",
                  height: "75%",
                  borderRadius: "var(--radius-round)",
                  border: "4px solid hsl(var(--primary-hsl) / 0.7)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 3,
                  background: colors.primary,
                  top: `${faceProgress}%`,
                }}
              />
            </>
          )}
          {faceStatus === "success" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-6)" }}>
              <CheckCircle2 size={44} color={colors.primary} />
              <span
                style={{
                  fontFamily: fontDisplay,
                  fontSize: "var(--font-size-base)",
                  fontWeight: 700,
                  color: colors.foreground,
                }}
              >
                Identidade verificada
              </span>
            </div>
          )}
        </div>
        {faceStatus === "scanning" && (
          <p
            style={{ fontSize: "var(--font-size-xs)", color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}
          >
            Analisando rosto… {faceProgress}%
          </p>
        )}
        <div style={{ width: "100%", maxWidth: 280 }}>
          {faceStatus === "idle" && <PrimaryButton onClick={startFaceScan}>Iniciar verificação</PrimaryButton>}
          {faceStatus === "success" && <PrimaryButton onClick={() => setScreen(faceReturnTo)}>Continuar</PrimaryButton>}
        </div>
        <p
          style={{
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            fontFamily: fontBody,
            textAlign: "center",
            margin: 0,
          }}
        >
          Tela de teste — nenhum dado biométrico é armazenado.
        </p>
      </div>
    </div>
  );
}
