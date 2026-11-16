// @vitest-environment jsdom
// Correções de fluxo da área do cliente: resultado do Provador sem erro e "Refazer selfie" que não reabre o cadastro · API: nenhuma
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ClientSelfieScreen from "./ClientSelfieScreen";
import ClientTryOnResultScreen from "./ClientTryOnResultScreen";

const state = vi.hoisted(() => ({
  setScreen: vi.fn(),
  auth: null,
  reference: "ref.png",
  recommended: [{ id: 1, name: "Ana", category: "cabelo", compatibility: 87 }],
}));

vi.mock("../../context/SessionContext", () => ({
  useSession: () => ({ auth: state.auth, setScreen: state.setScreen }),
}));
vi.mock("../../context/SchedulingContext", () => ({
  useScheduling: () => ({ setBookedSlot: vi.fn(), setSelectedProId: vi.fn() }),
}));
vi.mock("../../context/TryOnContext", () => ({
  useTryOn: () => ({
    goToPersonalizedRanking: vi.fn(),
    tryOnClientPhoto: "foto.png",
    tryOnReference: state.reference,
  }),
  useRanking: () => ({
    loadRanking: vi.fn(),
    rankingError: false,
    rankingLoading: false,
    recommended: state.recommended,
  }),
}));
vi.mock("../../context/SignupContext", () => ({
  useSignup: () => ({ cForm: { selfiePhoto: "selfie.png" }, setCField: vi.fn() }),
}));
vi.mock("../hooks/useSelfieCamera", () => ({
  useSelfieCamera: () => ({
    cSelfieCanvasRef: { current: null },
    cSelfieVideoRef: { current: null },
    cSelfieError: "",
    cSelfieStatus: "idle",
    captureClientSelfie: vi.fn(),
    retakeClientSelfie: vi.fn(),
    startClientSelfieCamera: vi.fn(),
    stopClientSelfieCamera: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
  state.setScreen.mockClear();
  state.auth = null;
  state.reference = "ref.png";
});

describe("resultado do Provador", () => {
  it("abre com a referência escolhida e mostra a compatibilidade do primeiro da lista", () => {
    render(<ClientTryOnResultScreen />);
    expect(screen.getByText(/Compatibilidade com o seu visual/)).toBeTruthy();
    expect(screen.getByText(/Estimativa do melhor profissional/)).toBeTruthy();
  });

  it("sem referência, avisa que a compatibilidade está indisponível", () => {
    state.reference = null;
    render(<ClientTryOnResultScreen />);
    expect(screen.getByText(/Indisponível/)).toBeTruthy();
  });
});

describe("selfie de verificação", () => {
  it("no cadastro, confirmar segue para os termos", () => {
    render(<ClientSelfieScreen />);
    fireEvent.click(screen.getByText("Confirmar selfie"));
    expect(state.setScreen).toHaveBeenCalledWith("clientTerms");
  });

  it("com conta criada, confirmar volta para Segurança e não reabre o cadastro", () => {
    state.auth = { id: 1, tipo: "CLIENTE" };
    render(<ClientSelfieScreen />);
    fireEvent.click(screen.getByText("Confirmar selfie"));
    expect(state.setScreen).toHaveBeenCalledWith("clientAccountSecurity");
  });
});
