// Detalhe do agendamento + botão de segurança · mock · denúncia: futura POST /api/denuncias
import { MessageCircle, XCircle } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { ReportButton } from "../../shared/components/Safety";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody } from "../../shared/theme";
import { appointmentsMock } from "../data/mocks";

export default function ClientAgendaDetailScreen() {
  const { selectedAppointmentId, setScreen } = useKira();
  const appointment = appointmentsMock.find((a) => a.id === selectedAppointmentId) || appointmentsMock[0];
  const pro = mockProfessionals.find((p) => p.id === appointment.proId) || mockProfessionals[0];
  const canCancel = appointment.status === "proximo";
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientAgenda")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <img src={pro.photo} alt={pro.name} style={{ width: 60, height: 60, borderRadius: 16, objectFit: "cover" }} />
          <div>
            <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: 0 }}>{pro.name}</p>
            <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{pro.role}</p>
          </div>
        </div>

        <div style={{ borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.card, padding: 16, marginBottom: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Serviço", appointment.service],
            ["Data", appointment.date],
            ["Horário", appointment.time],
            ["Endereço", appointment.place],
            ["Preço", `R$ ${appointment.price.toFixed(2)}`],
            ["Pagamento", appointment.payment],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>{label}</span>
              <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${colors.border}` }}>
            <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground }}>Status</span>
            <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: appointment.status === "cancelado" ? colors.destructive : colors.primary }}>
              {appointment.status === "proximo" ? "✓ Confirmado" : appointment.status === "concluido" ? "Concluído" : "Cancelado"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SecondaryButton onClick={() => {}}><MessageCircle size={15} /> Conversar com {pro.name.split(" ")[0]}</SecondaryButton>
          {appointment.status === "concluido" && !appointment.rated && (
            <PrimaryButton onClick={() => {}}>Avaliar atendimento</PrimaryButton>
          )}
          {canCancel && (
            <button
              onClick={() => {}}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "transparent", color: colors.destructive, fontWeight: 600, fontSize: 13, fontFamily: fontBody, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <XCircle size={15} /> Cancelar agendamento
            </button>
          )}
          <ReportButton agendamentoId={appointment.id} papel="CLIENTE" />
        </div>
      </div>
    </div>
  );
}
