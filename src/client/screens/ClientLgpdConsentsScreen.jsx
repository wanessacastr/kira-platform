// Perfil: consentimentos LGPD · estático, lê aceite do cadastro
import { CheckCircle2, XCircle } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, ProfileSection } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// === PERFIL: Consentimentos LGPD ===
export default function ClientLgpdConsentsScreen() {
  const { cForm, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Consentimentos LGPD</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Consentimentos aceitos durante o seu cadastro.</p>
        <ProfileSection title="Termos aceitos">
          {[
            { label: "Termos de Uso", accepted: cForm.termsUse },
            { label: "Política de Privacidade", accepted: cForm.termsPrivacy },
          ].map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", borderBottom: i === 0 ? `1px solid ${colors.border}` : "none" }}>
              {item.accepted ? <CheckCircle2 size={16} color={colors.primary} /> : <XCircle size={16} color={colors.mutedForeground} />}
              <span style={{ flex: 1, fontFamily: fontBody, fontSize: 13, color: colors.foreground }}>{item.label}</span>
              <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: item.accepted ? colors.primary : colors.mutedForeground }}>{item.accepted ? "Aceito" : "Pendente"}</span>
            </div>
          ))}
        </ProfileSection>
      </div>
    </div>
  );
}
