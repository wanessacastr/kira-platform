// @vitest-environment jsdom
// Ajustes visuais da área do cliente: perfil real em Dados e privacidade, estados neutros e Provador sem imagem · API: api.profile
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ClientAccountSecurityScreen from "./ClientAccountSecurityScreen";
import ClientLgpdConsentsScreen from "./ClientLgpdConsentsScreen";
import ClientPrivacyDataScreen from "./ClientPrivacyDataScreen";
import ClientTryOnResultScreen from "./ClientTryOnResultScreen";

const state = vi.hoisted(() => ({
  cForm: {},
  photo: null,
  reference: null,
  profile: {
    name: "Cliente Demo",
    email: "cliente@kira.demo",
    phone: "11999990000",
    cpf: "12345678901",
    address: { street: "Rua A", number: "10", neighborhood: "Centro", city: "São Paulo", state: "SP" },
  },
}));

vi.mock("../../context/SessionContext", () => ({
  useSession: () => ({ auth: { id: 1 }, setScreen: vi.fn() }),
}));
vi.mock("../../context/SignupContext", () => ({ useSignup: () => ({ cForm: state.cForm }) }));
vi.mock("../../context/SchedulingContext", () => ({
  useScheduling: () => ({ setBookedSlot: vi.fn(), setSelectedProId: vi.fn() }),
}));
vi.mock("../../context/TryOnContext", () => ({
  useTryOn: () => ({
    goToPersonalizedRanking: vi.fn(),
    tryOnClientPhoto: state.photo,
    tryOnReference: state.reference,
  }),
  useRanking: () => ({ loadRanking: vi.fn(), rankingError: false, rankingLoading: false, recommended: [] }),
}));
vi.mock("../../shared/api", () => ({ api: { profile: { getMine: () => Promise.resolve(state.profile) } } }));

afterEach(() => {
  cleanup();
  state.cForm = {};
  state.photo = null;
  state.reference = null;
});

const wrap = (ui) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {ui}
  </QueryClientProvider>
);

describe("Dados e privacidade", () => {
  it("mostra o perfil real da conta, com CPF mascarado", async () => {
    render(wrap(<ClientPrivacyDataScreen />));
    expect(await screen.findByText("Cliente Demo")).toBeTruthy();
    expect(screen.getByText("cliente@kira.demo")).toBeTruthy();
    expect(screen.getByText("•••.•••.•••-01")).toBeTruthy();
    expect(screen.queryByText("12345678901")).toBeNull();
  });
});

describe("Consentimentos e Segurança sem sessão de cadastro", () => {
  it("não mostra 'Pendente' enganoso nos consentimentos", () => {
    render(<ClientLgpdConsentsScreen />);
    expect(screen.queryByText("Pendente")).toBeNull();
    expect(screen.getAllByText("Sem informação").length).toBe(2);
  });
  it("mostra status indisponível na segurança da conta", () => {
    render(<ClientAccountSecurityScreen />);
    expect(screen.getByText("Status indisponível")).toBeTruthy();
    expect(screen.queryByText("Verificação pendente")).toBeNull();
  });
  it("mantém 'Aceito' quando o aceite veio do cadastro", () => {
    state.cForm = { termsUse: true, termsPrivacy: true };
    render(<ClientLgpdConsentsScreen />);
    expect(screen.getAllByText("Aceito").length).toBe(2);
  });
});

describe("Provador sem imagens", () => {
  it("usa caixa neutra em vez de imagem quebrada", () => {
    render(<ClientTryOnResultScreen />);
    expect(document.querySelectorAll("img").length).toBe(0);
    expect(screen.getAllByText("Sem imagem").length).toBe(2);
  });
});
