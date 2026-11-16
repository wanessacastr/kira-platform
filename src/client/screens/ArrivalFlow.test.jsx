// @vitest-environment jsdom
// Confirmação presencial: "Estou a caminho" (cliente) e "Confirmar chegada" (profissional) · API: api.arrival
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../shared/api/contract";
import { ArrivalValidation } from "../../professional/components/ArrivalValidation";
import { ArrivalCode } from "../components/ArrivalCode";

const h = vi.hoisted(() => ({ arrival: { getToken: vi.fn(), requestToken: vi.fn(), validateToken: vi.fn() } }));
vi.mock("../../shared/api", () => ({ api: { arrival: h.arrival } }));

const wrap = (ui) =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {ui}
    </QueryClientProvider>,
  );
const appt = (rawStatus) => ({ id: "a1", rawStatus });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("cliente: Estou a caminho", () => {
  it("só aparece com o agendamento confirmado", () => {
    h.arrival.getToken.mockResolvedValue(null);
    wrap(<ArrivalCode appointment={appt("PENDENTE")} />);
    expect(screen.queryByText("Estou a caminho")).toBeNull();
    expect(h.arrival.getToken).not.toHaveBeenCalled();
  });

  it("pede o código ao backend e mostra o que ele devolveu", async () => {
    h.arrival.getToken.mockResolvedValue(null);
    h.arrival.requestToken.mockResolvedValue({ code: "482913", expiresAt: new Date(Date.now() + 600000) });
    wrap(<ArrivalCode appointment={appt("CONFIRMADO")} />);
    fireEvent.click(await screen.findByRole("button", { name: /Estou a caminho/ }));
    expect(await screen.findByText("482913")).toBeTruthy();
    expect(screen.getByText("Seu código de confirmação")).toBeTruthy();
    expect(screen.getByText(/Apresente este código ao profissional/)).toBeTruthy();
    expect(h.arrival.requestToken).toHaveBeenCalledTimes(1);
  });

  it("impede clique duplicado enquanto gera", async () => {
    h.arrival.getToken.mockResolvedValue(null);
    h.arrival.requestToken.mockReturnValue(new Promise(() => {}));
    wrap(<ArrivalCode appointment={appt("CONFIRMADO")} />);
    fireEvent.click(await screen.findByRole("button", { name: /Estou a caminho/ }));
    const busy = await screen.findByRole("button", { name: /Gerando código/ });
    expect(busy.disabled).toBe(true);
    fireEvent.click(busy);
    expect(h.arrival.requestToken).toHaveBeenCalledTimes(1);
  });

  it("rota inexistente: avisa que não está disponível e não mostra código", async () => {
    h.arrival.getToken.mockResolvedValue(null);
    h.arrival.requestToken.mockRejectedValue(new ApiError("http_404", "x", 404));
    wrap(<ArrivalCode appointment={appt("CONFIRMADO")} />);
    fireEvent.click(await screen.findByRole("button", { name: /Estou a caminho/ }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/ainda não está disponível/);
  });

  it("código expirado oferece gerar outro", async () => {
    h.arrival.getToken.mockResolvedValue({ code: "111111", expiresAt: new Date(Date.now() - 1000) });
    wrap(<ArrivalCode appointment={appt("CONFIRMADO")} />);
    expect(await screen.findByRole("button", { name: /Gerar novo código/ })).toBeTruthy();
    expect(screen.queryByText("111111")).toBeNull();
  });

  it("chegada confirmada mostra a mensagem final", () => {
    wrap(<ArrivalCode appointment={appt("CHEGADA_CONFIRMADA")} />);
    expect(screen.getByText(/Chegada confirmada! Seu atendimento está pronto para começar./)).toBeTruthy();
  });

  it("não guarda o código em armazenamento do navegador", async () => {
    h.arrival.getToken.mockResolvedValue({ code: "654321", expiresAt: null });
    wrap(<ArrivalCode appointment={appt("CONFIRMADO")} />);
    await screen.findByText("654321");
    expect(JSON.stringify({ ...localStorage })).not.toContain("654321");
    expect(JSON.stringify({ ...sessionStorage })).not.toContain("654321");
  });
});

describe("profissional: Confirmar chegada", () => {
  const open = () => wrap(<ArrivalValidation appointment={appt("CONFIRMADO")} onClose={() => {}} />);
  const field = () => screen.getByPlaceholderText("000000");

  it("aceita só números, no máximo 6, e só libera com 6 dígitos", () => {
    open();
    const button = screen.getByRole("button", { name: "Validar código" });
    fireEvent.change(field(), { target: { value: "12ab34" } });
    expect(field().value).toBe("1234");
    expect(button.disabled).toBe(true);
    fireEvent.change(field(), { target: { value: "1234567" } });
    expect(field().value).toBe("123456");
    expect(button.disabled).toBe(false);
  });

  it("envia o código e o agendamento ao backend e confirma", async () => {
    h.arrival.validateToken.mockResolvedValue({});
    open();
    fireEvent.change(field(), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Validar código" }));
    await waitFor(() => expect(h.arrival.validateToken).toHaveBeenCalledWith({ appointmentId: "a1", code: "123456" }));
    expect(await screen.findByText(/Chegada confirmada/)).toBeTruthy();
  });

  it.each([
    ["TOKEN_INVALIDO", /Código incorreto\. Confira com o cliente e tente novamente\./],
    ["TOKEN_EXPIRADO", /Este código expirou\. Solicite ao cliente um novo código\./],
    ["TOKEN_JA_UTILIZADO", /Este código já foi utilizado\./],
  ])("mostra a mensagem de %s", async (erro, message) => {
    h.arrival.validateToken.mockRejectedValue(new ApiError(erro, "x", 400));
    open();
    fireEvent.change(field(), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Validar código" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(message);
  });

  it("erro de comunicação permite tentar de novo", async () => {
    h.arrival.validateToken.mockRejectedValueOnce(new ApiError("sem_conexao", "x", 0)).mockResolvedValueOnce({});
    open();
    fireEvent.change(field(), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Validar código" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Validar código" }));
    expect(await screen.findByText(/Chegada confirmada/)).toBeTruthy();
  });
});
