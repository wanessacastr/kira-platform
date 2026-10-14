// Login simulado, sem autenticação real · API: nenhuma
import { Eye, EyeOff } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Field, Header, PrimaryButton, inputStyle } from "../components/ui";
import { colors, fontBody, fontDisplay } from "../theme";

export default function LoginScreen() {
  const {
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    setScreen,
    setShowLoginPassword,
    showLoginPassword,
  } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("splash")} />
      <div style={{ flex: 1, padding: "8px 24px 32px" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 26,
            color: colors.foreground,
            margin: "4px 0 4px",
          }}
        >
          Bem-vinda de volta
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: "0 0 24px" }}>
          Entre na sua conta Kira
        </p>
        <Field label="E-mail">
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="seu@email.com"
            style={inputStyle(false)}
          />
        </Field>
        <Field label="Senha">
          <div style={{ position: "relative" }}>
            <input
              type={showLoginPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle(false)}
            />
            <button
              onClick={() => setShowLoginPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: colors.mutedForeground,
                cursor: "pointer",
              }}
            >
              {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <PrimaryButton onClick={() => setScreen("home")}>Entrar</PrimaryButton>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: colors.mutedForeground,
            fontFamily: fontBody,
            marginTop: 20,
          }}
        >
          Não tem conta?{" "}
          <span
            style={{ color: colors.primary, fontWeight: 600, cursor: "pointer" }}
            onClick={() => setScreen("signup")}
          >
            Criar conta
          </span>
        </p>
      </div>
    </div>
  );
}
