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
      <div style={{ padding: "var(--space-20) var(--space-24) var(--space-4)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "0 0 var(--space-4)",
          }}
        >
          Minha agenda
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-4)",
          }}
        >
          Horários em tempo real e confirmação automática
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8) var(--space-24) var(--space-24)" }}>
        <CalendarHeader
          monthDate={proViewMonth}
          onPrev={() => changeProMonth(-1)}
          onNext={() => changeProMonth(1)}
          canGoPrev={canGoPrev}
        />
        <div style={{ marginBottom: "var(--space-20)" }}>
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
            fontSize: "var(--font-size-base)",
            color: colors.foreground,
            margin: "0 0 var(--space-10)",
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
              gap: "var(--space-8)",
              padding: "var(--space-28) var(--space-16)",
              textAlign: "center",
            }}
          >
            <Calendar size={28} color={colors.mutedForeground} />
            <p
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-sm)",
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              Nenhum atendimento neste dia.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {dayAppointments.map((a) => (
              <div
                key={`${a.time}-${a.client}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-12)",
                  padding: "var(--space-12)",
                  borderRadius: "var(--radius-2xl)",
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-lg)",
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
                    style={{
                      fontFamily: fontBody,
                      fontWeight: 700,
                      fontSize: "var(--font-size-sm)",
                      color: colors.foreground,
                      margin: 0,
                    }}
                  >
                    {a.client}
                  </p>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      margin: "var(--space-1) 0 0",
                    }}
                  >
                    {a.time} · {a.service}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: a.status === "confirmado" ? colors.primaryText : colors.accent,
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
