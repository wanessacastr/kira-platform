// Agenda do profissional com calendário · mock
import { Calendar, Clock } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { CalendarHeader, CalendarMonth } from "../../shared/components/Calendar";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";

// "Minha agenda" do profissional — reaproveita o CalendarHeader/CalendarMonth
// já existentes (genéricos, recebidos por props), só com estado próprio.
export default function ProAgendaDashScreen() {
  const {
    changeProMonth,
    getProDayAppointments,
    goToProTab,
    proMonthAnimKey,
    proSelectedDate,
    proViewMonth,
    setProSelectedDate,
    today,
  } = useKira();
  const dayAppointments = getProDayAppointments(proSelectedDate);
  const canGoPrev =
    proViewMonth.getFullYear() > today.getFullYear() ||
    (proViewMonth.getFullYear() === today.getFullYear() && proViewMonth.getMonth() > today.getMonth());
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "20px 24px 4px" }}>
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
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 4px" }}>
          Horários em tempo real e confirmação automática
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px" }}>
        <CalendarHeader
          monthDate={proViewMonth}
          onPrev={() => changeProMonth(-1)}
          onNext={() => changeProMonth(1)}
          canGoPrev={canGoPrev}
        />
        <div style={{ marginBottom: 20 }}>
          <CalendarMonth
            monthDate={proViewMonth}
            selectedDate={proSelectedDate}
            today={today}
            monthKey={proMonthAnimKey}
            onSelect={setProSelectedDate}
          />
        </div>
        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 15,
            color: colors.foreground,
            margin: "0 0 10px",
          }}
        >
          Atendimentos de {proSelectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
        </h2>
        {dayAppointments.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "28px 16px",
              textAlign: "center",
            }}
          >
            <Calendar size={28} color={colors.mutedForeground} />
            <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>
              Nenhum atendimento neste dia.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dayAppointments.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 16,
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: colors.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={17} color={colors.mutedForeground} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}
                  >
                    {a.client}
                  </p>
                  <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>
                    {a.time} · {a.service}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: 11,
                    fontWeight: 700,
                    color: a.status === "confirmado" ? colors.primary : colors.accent,
                  }}
                >
                  {a.status === "confirmado" ? "✓ Confirmado" : "Aguardando"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <ProBottomNav active="proAgendaDash" onNavigate={goToProTab} />
    </div>
  );
}
