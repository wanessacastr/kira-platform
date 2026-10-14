// Agendamento: data e horário · mock com latência e erro simulados · futura API: GET /profissionais/:id/disponibilidade
import { Check } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import {
  CalendarHeader,
  CalendarMonth,
  EmptySchedule,
  LoadingSchedule,
  TimeSlotGrid,
} from "../../shared/components/Calendar";
import { ErrorState } from "../../shared/components/states";
import { Header, PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { getDaySchedule } from "../../shared/utils/date";

export default function ClientSchedulingScreen() {
  const {
    bookedSlot,
    changeMonth,
    monthAnimKey,
    retrySchedule,
    scheduleError,
    scheduleLoading,
    scheduleTime,
    selectScheduleDate,
    selectedDate,
    selectedProId,
    setAgendaTab,
    setBookedSlot,
    setScheduleTime,
    setScreen,
    today,
    viewMonth,
  } = useKira();
  const pro = mockProfessionals.find((p) => p.id === selectedProId) || mockProfessionals[0];
  const times = selectedDate ? getDaySchedule(selectedDate, pro) : [];
  const canGoPrev = viewMonth.getFullYear() > today.getFullYear() || (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header onBack={() => setScreen("clientProfessionalProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        {bookedSlot ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "48px 0", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: gradientKira, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={32} color={colors.primaryForeground} />
            </div>
            <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: colors.foreground, margin: 0 }}>Agendamento confirmado!</h1>
            <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>{pro.name} • {selectedDate?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })} às {bookedSlot}</p>
            <div style={{ width: "100%", maxWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
              <PrimaryButton onClick={() => { setAgendaTab("proximo"); setScreen("clientAgenda"); }}>Ver na agenda</PrimaryButton>
              <SecondaryButton onClick={() => setScreen("clientHome")}>Voltar para o início</SecondaryButton>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20, color: colors.foreground, margin: "4px 0 4px" }}>Agendar com {pro.name}</h1>
            <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Escolha o melhor dia e horário para o seu atendimento.</p>

            <CalendarHeader monthDate={viewMonth} onPrev={() => changeMonth(-1)} onNext={() => changeMonth(1)} canGoPrev={canGoPrev} />
            <div style={{ marginBottom: 24 }}>
              <CalendarMonth monthDate={viewMonth} selectedDate={selectedDate} today={today} monthKey={monthAnimKey} onSelect={selectScheduleDate} />
            </div>

            {selectedDate && (
              <>
                <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: "0 0 10px" }}>Horários disponíveis</h2>
                {scheduleLoading ? (
                  <LoadingSchedule />
                ) : scheduleError ? (
                  <ErrorState onRetry={retrySchedule} message="Não foi possível carregar os horários agora." />
                ) : times.length === 0 ? (
                  <EmptySchedule />
                ) : (
                  <>
                    <TimeSlotGrid times={times} selectedTime={scheduleTime} onSelect={setScheduleTime} />
                    <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, textAlign: "center", margin: "14px 0 0" }}>Toque em um horário para continuar.</p>
                  </>
                )}
              </>
            )}

            {scheduleTime && (
              <div style={{ marginTop: 20 }}>
                <PrimaryButton onClick={() => setBookedSlot(scheduleTime)}>Continuar para confirmação</PrimaryButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
