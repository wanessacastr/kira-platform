// Perfil: status de verificação (selfie e documentos do cadastro) · estado local
import { CheckCircle2, Clock, ScanFace, XCircle } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

// === PERFIL: IdentityVerification (Segurança da conta) ===
export default function ClientAccountSecurityScreen() {
  const { cForm, setScreen } = useKira();
  const hasSelfie = !!cForm.selfiePhoto;
  const hasDocs = !!cForm.docFront && !!cForm.docBack;
  const verified = hasSelfie && hasDocs;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Segurança da conta</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Status da verificação de identidade da sua conta.</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 22, borderRadius: 16, border: `1px solid ${colors.border}`, textAlign: "center", marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: verified ? gradientKira : colors.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ScanFace size={22} color={verified ? colors.primaryForeground : colors.mutedForeground} />
          </div>
          {verified ? (
            <p style={{ fontSize: 13, fontWeight: 700, color: colors.primary, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, margin: 0 }}><CheckCircle2 size={16} /> Identidade verificada</p>
          ) : (
            <p style={{ fontSize: 13, fontWeight: 700, color: colors.mutedForeground, fontFamily: fontBody, display: "flex", alignItems: "center", gap: 6, margin: 0 }}><Clock size={16} /> Verificação pendente</p>
          )}
          <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>{verified ? "Selfie e documento confirmados." : "Conclua a selfie e o documento para verificar sua conta."}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Selfie de verificação", done: hasSelfie },
            { label: "Documento com foto", done: hasDocs },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
              {item.done ? <CheckCircle2 size={16} color={colors.primary} /> : <XCircle size={16} color={colors.mutedForeground} />}
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.foreground, flex: 1 }}>{item.label}</span>
              <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 600, color: item.done ? colors.primary : colors.mutedForeground }}>{item.done ? "Concluído" : "Pendente"}</span>
            </div>
          ))}
        </div>

        <SecondaryButton onClick={() => setScreen("clientSelfie")}><ScanFace size={15} /> Refazer verificação facial</SecondaryButton>
      </div>
    </div>
  );
}
