// Qual agendamento está em pagamento e acompanhamento: o escolhido na agenda, o recém-agendado ou o primeiro de exemplo · API: nenhuma
import { mockProfessionals } from "../../shared/data/professionals";
import { appointmentsMock } from "../data/mocks";

const dayLabel = (date) => date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

/**
 * @param {{ selectedAppointmentId: string|null, bookedSlot: string|null, selectedDate: Date|null, pro: object }} source
 * @returns {{ id: string, service: string, proName: string, when: string, price: number }}
 */
export function resolveBookingTarget({ selectedAppointmentId, bookedSlot, selectedDate, pro }) {
  const fromAgenda = appointmentsMock.find((a) => a.id === selectedAppointmentId);
  if (fromAgenda) {
    return {
      id: fromAgenda.id,
      service: fromAgenda.service,
      proName: (mockProfessionals.find((p) => p.id === fromAgenda.proId) ?? pro).name,
      when: `${fromAgenda.date}, ${fromAgenda.time}`,
      price: fromAgenda.price,
    };
  }
  if (bookedSlot && selectedDate) {
    return {
      id: `novo-${pro.id}-${selectedDate.toISOString().slice(0, 10)}-${bookedSlot}`,
      service: pro.services?.[0] ?? pro.role,
      proName: pro.name,
      when: `${dayLabel(selectedDate)}, ${bookedSlot}`,
      price: pro.price,
    };
  }
  const first = appointmentsMock[0];
  return {
    id: first.id,
    service: first.service,
    proName: (mockProfessionals.find((p) => p.id === first.proId) ?? pro).name,
    when: `${first.date}, ${first.time}`,
    price: first.price,
  };
}
