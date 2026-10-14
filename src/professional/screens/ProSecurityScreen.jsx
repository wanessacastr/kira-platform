// Segurança Kira: verificação, denúncia e emergência · mock · futura API: POST /api/denuncias
import { BadgeCheck, CheckCircle2, Clock, User } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { ReportButton } from "../../shared/components/Safety";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { proDashboardStats } from "../data/mocks";

// "Segurança Kira" — perfil verificado, checklist de credibilidade e
// Canal de Segurança, conforme a segunda página do folheto profissional.
export default function ProSecurityScreen() {
  const { pForm, setScreen } = useKira();
  const hasDocs = !!pForm.docFrontPhoto && !!pForm.docBackPhoto;
  const certCount = pForm.specialties.length;
  const verified = hasDocs;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Segurança Kira</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Credibilidade que gera confiança, para você e para seus clientes.</p>

        <div style={{ borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.card, padding: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: colors.muted, flexShrink: 0 }}>
              {pForm.photo ? <img src={pForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={22} color={colors.mutedForeground} />}
            </div>
            <div>
              <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 14, color: colors.foreground, margin: 0 }}>{pForm.name || "Profissional Kira"}</p>
              {verified && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary, marginTop: 2 }}>
                  <BadgeCheck size={13} /> Perfil verificado
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Documento validado", detail: hasDocs ? "CPF confirmado" : "Pendente", done: hasDocs },
              { label: "Certificados autenticados", detail: `${certCount} certificado${certCount === 1 ? "" : "s"} enviado${certCount === 1 ? "" : "s"}`, done: certCount > 0 },
              { label: "Avaliações reais", detail: `${proDashboardStats.rating} · avaliações confirmadas`, done: true },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: colors.muted }}>
                {item.done ? <CheckCircle2 size={16} color={colors.primary} /> : <Clock size={16} color={colors.mutedForeground} />}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: 0 }}>{item.label}</p>
                  <p style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground, margin: 0 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ padding: "8px 12px", borderRadius: 999, background: gradientKira, color: colors.primaryForeground, fontFamily: fontBody, fontSize: 11, fontWeight: 700 }}>Pagamento protegido</span>
            <span onClick={() => setScreen("proFinance")} style={{ padding: "8px 12px", borderRadius: 999, background: colors.muted, color: colors.foreground, fontFamily: fontBody, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Histórico completo</span>
          </div>
        </div>

        <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Canal de Segurança</h2>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 14px" }}>A proteção vale para os dois lados. Clientes também passam por verificação, e você pode reportar qualquer situação suspeita de forma protegida, com análise da equipe Kira.</p>
        <ReportButton papel="PROFISSIONAL" />
      </div>
    </div>
  );
}
