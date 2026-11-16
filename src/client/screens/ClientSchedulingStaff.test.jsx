// @vitest-environment jsdom
// Agendamento: escolher a funcionária ("Com quem?") e mandar o staffId para horários e agendamento · API: api.professionals.listStaff
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ClientSchedulingScreen from "./ClientSchedulingScreen";

const h = vi.hoisted(() => ({
  state: { selectedStaffId: null, selectedServiceId: "s1", selectedDate: new Date(2030, 0, 10), scheduleTime: null },
  setSelectedStaffId: vi.fn(),
  api: {
    professionals: { listStaff: vi.fn() },
    availability: { get: vi.fn() },
    appointments: { create: vi.fn() },
    businessHours: { get: vi.fn() },
  },
}));

vi.mock("../../context/SessionContext", () => ({ useSession: () => ({ setScreen: vi.fn() }) }));
vi.mock("../../context/SchedulingContext", () => ({
  useScheduling: () => ({
    ...h.state,
    selectedProId: "p1",
    bookedSlot: null,
    viewMonth: new Date(2030, 0, 1),
    changeMonth: vi.fn(),
    selectScheduleDate: vi.fn(),
    setAgendaTab: vi.fn(),
    setBookedSlot: vi.fn(),
    setScheduleTime: vi.fn(),
    setSelectedServiceId: vi.fn(),
    setSelectedStaffId: h.setSelectedStaffId,
  }),
}));
vi.mock("../hooks/useProfessionals", async () => {
  const { useQuery } = await import("@tanstack/react-query");
  return {
    useProfessional: () => ({
      data: { id: "p1", name: "Studio Bela", services: [{ id: "s1", name: "Corte", price: 80 }] },
    }),
    useStudioStaff: () => useQuery({ queryKey: ["staff"], queryFn: () => h.api.professionals.listStaff("p1") }),
  };
});
vi.mock("../../shared/hooks/useBookableDays", () => ({ useBookableDays: () => () => true }));
vi.mock("../../shared/api", () => ({ api: h.api, errorMessage: (_e, fallback) => fallback }));

const renderScreen = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ClientSchedulingScreen />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  h.api.availability.get.mockResolvedValue(["09:00"]);
  h.api.professionals.listStaff.mockResolvedValue([
    { id: "f1", name: "Joana" },
    { id: "f2", name: "Marta" },
  ]);
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  h.state.selectedStaffId = null;
});

describe("escolher a funcionária", () => {
  it("lista 'Sem preferência' e as funcionárias, e guarda a escolha", async () => {
    renderScreen();
    expect(await screen.findByText("Joana")).toBeTruthy();
    expect(screen.getByText("Sem preferência")).toBeTruthy();
    fireEvent.click(screen.getByText("Marta"));
    expect(h.setSelectedStaffId).toHaveBeenCalledWith("f2");
  });

  it("pede os horários com a funcionária escolhida", async () => {
    h.state.selectedStaffId = "f1";
    renderScreen();
    await waitFor(() => expect(h.api.availability.get).toHaveBeenCalled());
    expect(h.api.availability.get.mock.calls[0][0].staffId).toBe("f1");
  });

  it("sem preferência, manda staffId nulo", async () => {
    renderScreen();
    await waitFor(() => expect(h.api.availability.get).toHaveBeenCalled());
    expect(h.api.availability.get.mock.calls[0][0].staffId).toBeNull();
  });

  it("estúdio sem funcionárias ativas não mostra o bloco", async () => {
    h.api.professionals.listStaff.mockResolvedValue([]);
    renderScreen();
    await waitFor(() => expect(h.api.professionals.listStaff).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText("Carregando a equipe...")).toBeNull());
    expect(screen.queryByText("Com quem?")).toBeNull();
  });

  it("falha ao carregar a equipe avisa e deixa seguir sem preferência", async () => {
    h.api.professionals.listStaff.mockRejectedValue(new Error("x"));
    renderScreen();
    expect(await screen.findByText(/seguir sem preferência/)).toBeTruthy();
  });
});
