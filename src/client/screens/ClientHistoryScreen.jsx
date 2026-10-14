// Perfil: histórico de serviços · mock
import { useKira } from "../../context/KiraContext";
import { Header } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { AppointmentCard } from "../components/ProfessionalCards";
import { appointmentsMock } from "../data/mocks";

// === PERFIL: Histórico completo ===
export default function ClientHistoryScreen() {
  const { setScreen, setSelectedAppointmentId } = useKira();
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
          Histórico
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Todos os seus agendamentos, de qualquer status.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {appointmentsMock.map((a) => {
            const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
            return (
              <AppointmentCard
                key={a.id}
                appointment={a}
                pro={pro}
                onClick={() => {
                  setSelectedAppointmentId(a.id);
                  setScreen("clientAgendaDetail");
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
