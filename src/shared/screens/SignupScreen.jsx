// Escolha do tipo de conta (cliente ou profissional) · API: nenhuma
import { Briefcase, User } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header } from "../components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../theme";

export default function SignupScreen() {
  const { accountType, setAccountType, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("splash")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-3xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Criar conta
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-sm)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-24)",
          }}
        >
          Escolha seu perfil para começar
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-10)",
            marginBottom: "var(--space-24)",
          }}
        >
          {[
            { type: "client", icon: User, label: "Cliente", desc: "Agendar serviços", go: "clientPersonal" },
            {
              type: "professional",
              icon: Briefcase,
              label: "Profissional",
              desc: "Oferecer serviços",
              go: "proPersonal",
            },
          ].map(({ type, icon: Icon, label, desc, go }) => (
            <button
              key={type}
              onClick={() => {
                setAccountType(type);
                setScreen(go);
              }}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-6)",
                padding: "var(--space-18)",
                borderRadius: "var(--radius-2xl)",
                border: `2px solid ${accountType === type ? colors.primary : colors.border}`,
                background: accountType === type ? "hsl(var(--primary-hsl) / 0.08)" : colors.card,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-lg)",
                  background: accountType === type ? gradientKira : colors.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color={accountType === type ? colors.primaryForeground : colors.mutedForeground} />
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "var(--font-size-sm)",
                  color: colors.foreground,
                  fontFamily: fontBody,
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: "var(--font-size-xs)", color: colors.mutedForeground, fontFamily: fontBody }}>
                {desc}
              </span>
            </button>
          ))}
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            fontFamily: fontBody,
          }}
        >
          Já tem conta?{" "}
          <button
            type="button"
            className="k-reset"
            style={{ color: colors.primaryText, fontWeight: 600, cursor: "pointer" }}
            onClick={() => setScreen("login")}
          >
            Entrar
          </span>
        </p>
      </div>
    </div>
  );
}
