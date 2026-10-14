// Agenda do cliente por abas · mock
import { Calendar } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { AppointmentCard } from "../components/ProfessionalCards";
import { appointmentTabs, appointmentsMock } from "../data/mocks";

// ---------- Agenda ----------
export default function ClientAgendaScreen() {
  const { agendaTab, goToTab, setAgendaTab, setScreen, setSelectedAppointmentId } = useKira();
  const filtered = appointmentsMock.filter((a) => a.status === agendaTab);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ padding: "0 24px 4px" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "0 0 4px",
          }}
        >
          Minha agenda
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 16px" }}>
          Seus próximos momentos de beleza
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {appointmentTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setAgendaTab(t.id)}
              style={{
                flex: 1,
                padding: "9px 8px",
                borderRadius: 12,
                border: "none",
                background: agendaTab === t.id ? gradientKira : colors.muted,
                color: agendaTab === t.id ? colors.primaryForeground : colors.mutedForeground,
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <Calendar size={30} color={colors.mutedForeground} />
            <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>
              Nenhum agendamento aqui ainda.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((a) => {
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
        )}
      </div>
      <BottomNav active="clientAgenda" onNavigate={goToTab} />
    </div>
  );
}
