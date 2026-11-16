// @vitest-environment jsdom
// Pagamento antes do agendamento: o agendamento só é criado depois do passo de pagamento · API: api.appointments.create
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ClientPaymentProcessingScreen from "./ClientPaymentProcessingScreen";

const h = vi.hoisted(() => ({
  setScreen: vi.fn(),
  setBookedSlot: vi.fn(),
  create: vi.fn(),
}));

vi.mock("../../context/SessionContext", () => ({ useSession: () => ({ setScreen: h.setScreen }) }));
vi.mock("../../context/SchedulingContext", () => ({
  useScheduling: () => ({
    selectedProId: "p1",
    selectedServiceId: "s1",
    selectedStaffId: "f1",
    selectedDate: new Date(2030, 0, 10),
    scheduleTime: "09:30",
    setBookedSlot: h.setBookedSlot,
  }),
}));
vi.mock("../../shared/api", () => ({
  api: { appointments: { create: h.create } },
  errorMessage: (_e, fallback) => fallback,
}));

const renderScreen = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ClientPaymentProcessingScreen />
    </QueryClientProvider>,
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("confirmar o agendamento depois do pagamento", () => {
  it("o botão só libera no resultado e não cria nada antes", () => {
    renderScreen();
    const button = screen.getByRole("button", { name: "Confirmar agendamento" });
    expect(button.disabled).toBe(true);
    expect(h.create).not.toHaveBeenCalled();
  });

  it("no resultado, cria o agendamento com horário e funcionária e volta para a confirmação", async () => {
    h.create.mockResolvedValue({});
    renderScreen();
    fireEvent.click(screen.getByText("Resultado"));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar agendamento" }));
    await waitFor(() => expect(h.create).toHaveBeenCalled());
    expect(h.create.mock.calls[0][0]).toMatchObject({ proId: "p1", serviceId: "s1", staffId: "f1" });
    expect(h.create.mock.calls[0][0].start.getHours()).toBe(9);
    await waitFor(() => expect(h.setBookedSlot).toHaveBeenCalledWith("09:30"));
    expect(h.setScreen).toHaveBeenCalledWith("clientScheduling");
  });

  it("se o agendamento falhar, mostra o erro e fica na tela", async () => {
    h.create.mockRejectedValue(new Error("x"));
    renderScreen();
    fireEvent.click(screen.getByText("Resultado"));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar agendamento" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(h.setScreen).not.toHaveBeenCalledWith("clientScheduling");
  });
});
