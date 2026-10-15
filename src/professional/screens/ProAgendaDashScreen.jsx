// Agenda do profissional com calendário · API: kira-backend (GET /api/agendamentos/empresa/{id})
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useProDashboard } from "../../context/ProDashboardContext";
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { CalendarHeader, CalendarMonth } from "../../shared/components/Calendar";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { startOfDay } from "../../shared/utils/date";
import { ProBottomNav } from "../components/ProBottomNav";
import { statusOf } from "../../shared/data/appointments";
import { useBusinessData } from "../hooks/useBusinessData";
import { appointmentsOn } from "../utils/metrics";

// "Minha agenda" do profissional — reaproveita o CalendarHeader/CalendarMonth
// já existentes (genéricos, recebidos por props), só com estado próprio.
export default function ProAgendaDashScreen() {
  const { changeProMonth, proSelectedDate, proViewMonth, setProSelectedDate } = useProDashboard();
  const { goToProTab } = useSession();
  const today = startOfDay(new Date());
  const [proMonthAnimKey, setProMonthAnimKey] = useState(0);
  const handleChangeMonth = (delta) => {
    changeProMonth(delta);
    setProMonthAnimKey((k) => k + 1);
  };
  const business = useBusinessData();
  const dayAppointments = appointmentsOn(business.appointments, proSelectedDate);
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
          onPrev={() => handleChangeMonth(-1)}
          onNext={() => handleChangeMonth(1)}
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
        {business.loading ? (
          <SkeletonLoading count={2} />
        ) : business.error ? (
          <ErrorState
            onRetry={business.retry}
            message={errorMessage(business.error, "Não foi possível carregar a agenda.")}
          />
        ) : dayAppointments.length === 0 ? (
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
                key={a.id}
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
                    {a.clientName}
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
                    {a.staffName ? ` · ${a.staffName}` : ""}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    color: statusOf(a).color,
                  }}
                >
                  {statusOf(a).label}
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
