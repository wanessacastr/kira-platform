// Abertura do app (Entrar / Criar conta) · API: nenhuma
import { useKira } from "../../context/KiraContext";
import { colors, fontBody, fontDisplay } from "../theme";

export default function SplashScreen() {
  const { setScreen } = useKira();
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 15%, var(--color-orange-glow), transparent 45%), radial-gradient(circle at 82% 10%, var(--color-pink-light), transparent 50%), radial-gradient(circle at 88% 55%, var(--color-magenta), transparent 55%), radial-gradient(circle at 8% 68%, var(--color-amber-glow), transparent 50%), radial-gradient(circle at 50% 92%, hsl(var(--white-hsl) / 0.55), transparent 60%), linear-gradient(180deg, var(--color-primary-tint), var(--color-neutral-soft))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "hsl(var(--white-hsl) / 0.1)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <h1
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1,
              color: colors.primaryForeground,
              margin: 0,
              textShadow: "0 4px 12px hsl(var(--black-hsl) / 0.15)",
            }}
          >
            K
          </h1>
          <p
            style={{
              fontFamily: fontDisplay,
              fontSize: 32,
              color: colors.primaryForeground,
              margin: 0,
              textShadow: "0 4px 12px hsl(var(--black-hsl) / 0.12)",
            }}
          >
            Kira
          </p>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              color: colors.primaryForeground,
              opacity: 0.9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Beleza com confiança
          </p>
        </div>
        <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => setScreen("login")}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 999,
              border: "none",
              background: "hsl(var(--white-hsl) / 0.95)",
              color: colors.foreground,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: fontBody,
              cursor: "pointer",
              boxShadow: "0 4px 20px -4px hsl(var(--primary-hsl) / 0.2)",
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setScreen("signup")}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 999,
              border: "none",
              background: "hsl(var(--primary-hsl) / 0.3)",
              color: colors.primaryForeground,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: fontBody,
              cursor: "pointer",
            }}
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}
