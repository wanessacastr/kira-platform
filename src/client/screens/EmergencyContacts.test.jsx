// @vitest-environment jsdom
// Contatos de emergência: lista, cadastro validado, limite de 5, remoção e ligação no botão de emergência · API: api.emergencyContacts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmergencyFlow } from "../../shared/components/Safety";
import ClientEmergencyContactsScreen from "./ClientEmergencyContactsScreen";

const h = vi.hoisted(() => ({
  setScreen: vi.fn(),
  auth: { id: "c1", tipo: "CLIENTE" },
  api: { emergencyContacts: { list: vi.fn(), create: vi.fn(), remove: vi.fn() } },
}));
vi.mock("../../context/SessionContext", () => ({ useSession: () => ({ auth: h.auth, setScreen: h.setScreen }) }));
vi.mock("../../shared/api", () => ({ api: h.api, errorMessage: (_e, fallback) => fallback }));

const wrap = (ui) =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {ui}
    </QueryClientProvider>,
  );
const contact = (n) => ({ id: `k${n}`, name: `Contato ${n}`, phone: "62999990000", relationship: "Mãe" });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  h.auth = { id: "c1", tipo: "CLIENTE" };
});

describe("tela de contatos", () => {
  it("lista os contatos do backend com link para ligar", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([contact(1)]);
    wrap(<ClientEmergencyContactsScreen />);
    expect(await screen.findByText("Contato 1")).toBeTruthy();
    expect(screen.getByLabelText("Ligar para Contato 1").getAttribute("href")).toBe("tel:62999990000");
  });

  it("sem contatos, mostra o estado vazio", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([]);
    wrap(<ClientEmergencyContactsScreen />);
    expect(await screen.findByText(/ainda não cadastrou/)).toBeTruthy();
  });

  it("valida nome e telefone antes de enviar", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([]);
    wrap(<ClientEmergencyContactsScreen />);
    await screen.findByText(/ainda não cadastrou/);
    fireEvent.click(screen.getByRole("button", { name: /Adicionar contato/ }));
    expect(await screen.findByText("Informe o nome")).toBeTruthy();
    expect(screen.getByText("Telefone incompleto")).toBeTruthy();
    expect(h.api.emergencyContacts.create).not.toHaveBeenCalled();
  });

  it("cadastra mandando só os dígitos do telefone", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([]);
    h.api.emergencyContacts.create.mockResolvedValue(contact(1));
    wrap(<ClientEmergencyContactsScreen />);
    await screen.findByText(/ainda não cadastrou/);
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Maria Souza" } });
    fireEvent.change(screen.getByLabelText("Telefone"), { target: { value: "62 99999-0000" } });
    fireEvent.click(screen.getByRole("button", { name: /Adicionar contato/ }));
    await waitFor(() => expect(h.api.emergencyContacts.create).toHaveBeenCalled());
    expect(h.api.emergencyContacts.create.mock.calls[0][0]).toMatchObject({
      name: "Maria Souza",
      phone: "62999990000",
    });
  });

  it("com 5 contatos, esconde o cadastro e avisa o limite", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([1, 2, 3, 4, 5].map(contact));
    wrap(<ClientEmergencyContactsScreen />);
    expect(await screen.findByText(/limite de 5 contatos/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Adicionar contato/ })).toBeNull();
  });

  it("remove o contato escolhido", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([contact(1)]);
    h.api.emergencyContacts.remove.mockResolvedValue();
    wrap(<ClientEmergencyContactsScreen />);
    fireEvent.click(await screen.findByLabelText("Remover Contato 1"));
    await waitFor(() => expect(h.api.emergencyContacts.remove.mock.calls[0][0]).toBe("k1"));
  });

  it("erro ao carregar permite tentar de novo", async () => {
    h.api.emergencyContacts.list.mockRejectedValue(new Error("x"));
    wrap(<ClientEmergencyContactsScreen />);
    expect(await screen.findByText(/Não foi possível carregar seus contatos/)).toBeTruthy();
  });
});

describe("botão de emergência", () => {
  it("mostra 'Ligar para' cada contato da cliente", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([contact(1)]);
    wrap(<EmergencyFlow onClose={() => {}} />);
    expect(await screen.findByText(/Ligar para Contato 1/)).toBeTruthy();
    expect(screen.getByText(/Ligar para 190 agora/)).toBeTruthy();
  });

  it("sem contatos, oferece cadastrar e leva à tela", async () => {
    h.api.emergencyContacts.list.mockResolvedValue([]);
    const onClose = vi.fn();
    wrap(<EmergencyFlow onClose={onClose} />);
    fireEvent.click(await screen.findByText("Cadastrar contato de emergência"));
    expect(onClose).toHaveBeenCalled();
    expect(h.setScreen).toHaveBeenCalledWith("clientEmergencyContacts");
  });

  it("profissional não consulta contatos da cliente", () => {
    h.auth = { id: "e1", tipo: "EMPRESA" };
    wrap(<EmergencyFlow onClose={() => {}} />);
    expect(h.api.emergencyContacts.list).not.toHaveBeenCalled();
    expect(screen.queryByText("Cadastrar contato de emergência")).toBeNull();
  });
});
