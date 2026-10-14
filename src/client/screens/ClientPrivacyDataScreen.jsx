// Perfil: privacidade e dados · estático, lê dados do cadastro
import { ShieldCheck } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, ProfileSection, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// === PERFIL: Dados e privacidade ===
export default function ClientPrivacyDataScreen() {
  const { cForm, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "4px 0 4px",
          }}
        >
          Dados e privacidade
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Estes são os dados que a Kira guarda sobre sua conta.
        </p>
        <ProfileSection title="Dados cadastrados">
          {[
            ["Nome", cForm.name || "—"],
            ["E-mail", cForm.email || "—"],
            ["Telefone", cForm.phone || "—"],
            ["Endereço", cForm.street ? `${cForm.street}, ${cForm.city}` : "—"],
            ["Documento de identidade", cForm.docFront ? "Enviado" : "Não enviado"],
          ].map(([label, value], i, arr) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderBottom: i === arr.length - 1 ? "none" : `1px solid ${colors.border}`,
              }}
            >
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>{label}</span>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.foreground,
                  textAlign: "right",
                  maxWidth: 180,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </ProfileSection>
        <SecondaryButton onClick={() => {}}>
          <ShieldCheck size={15} /> Solicitar exportação dos meus dados
        </SecondaryButton>
      </div>
    </div>
  );
}
