// @vitest-environment jsdom
// Informações do cliente de um atendimento: só leitura, vindas do agendamento do estúdio · API: api.appointments
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProClientInfoScreen from "./ProClientInfoScreen";

const h = vi.hoisted(() => ({ list: vi.fn(), setScreen: vi.fn() }));
vi.mock("../../context/SessionContext", () => ({ useSession: () => ({ setScreen: h.setScreen }) }));
vi.mock("../../context/SchedulingContext", () => ({ useScheduling: () => ({ selectedAppointmentId: "a1" }) }));
vi.mock("../../shared/hooks/useBack", () => ({ useBack: () => vi.fn() }));
vi.mock("../../shared/api", () => ({
  api: { appointments: { listForMyBusiness: h.list } },
  errorMessage: (_e, fallback) => fallback,
}));

const wrap = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ProClientInfoScreen />
    </QueryClientProvider>,
  );
const appt = {
  id: "a1",
  clientName: "Rafael Lima",
  service: "Corte feminino",
  start: new Date(2026, 10, 18, 14, 0),
  time: "14:00",
  durationMinutes: 60,
  staffName: "Joana",
  payment: "Pix",
  notes: "Alergia a amônia",
  rawStatus: "CONFIRMADO",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("informações do cliente", () => {
  it("mostra o cliente e os dados do atendimento, sem botões de ação", async () => {
    h.list.mockResolvedValue([appt]);
    wrap();
    expect(await screen.findByText("Rafael Lima")).toBeTruthy();
    expect(screen.getByText("Corte feminino")).toBeTruthy();
    expect(screen.getByText("18/11/2026")).toBeTruthy();
    expect(screen.getByText("Alergia a amônia")).toBeTruthy();
    expect(screen.getByText(/Confirmado/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Confirmar|Cancelar|Remarcar|Concluir/ })).toBeNull();
  });

  it("atendimento que não existe mais mostra aviso", async () => {
    h.list.mockResolvedValue([]);
    wrap();
    expect(await screen.findByText("Atendimento não encontrado.")).toBeTruthy();
  });

  it("erro ao carregar mostra a mensagem", async () => {
    h.list.mockRejectedValue(new Error("x"));
    wrap();
    expect(await screen.findByText("Não foi possível carregar o atendimento.")).toBeTruthy();
  });
});
