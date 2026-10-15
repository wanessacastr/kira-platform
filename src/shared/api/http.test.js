// Testes do cliente HTTP: token Bearer, renovação no 401 e erros do backend · fetch simulado
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "./contract";
import { API_URL, authStore, request } from "./http";

const json = (status, body) => new Response(body === undefined ? null : JSON.stringify(body), { status });

beforeEach(() => {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("request", () => {
  it("envia o token salvo e devolve o JSON", async () => {
    authStore.set({ token: "t1", refreshToken: "r1", id: "u1" });
    const fetch = vi.fn().mockResolvedValue(json(200, [{ id: 1 }]));
    vi.stubGlobal("fetch", fetch);
    expect(await request("/api/studios", { query: { cidade: "Goiânia", vazio: null } })).toEqual([{ id: 1 }]);
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toBe(`${API_URL}/api/studios?cidade=Goi%C3%A2nia`);
    expect(init.headers.Authorization).toBe("Bearer t1");
  });

  it("no 401 renova o token uma vez e repete a chamada", async () => {
    authStore.set({ token: "velho", refreshToken: "r1", id: "u1" });
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(json(401))
      .mockResolvedValueOnce(json(200, { token: "novo", refreshToken: "r2", tipo: "CLIENTE" }))
      .mockResolvedValueOnce(json(200, { ok: true }));
    vi.stubGlobal("fetch", fetch);
    expect(await request("/api/agendamentos/cliente/u1")).toEqual({ ok: true });
    expect(fetch.mock.calls[2][1].headers.Authorization).toBe("Bearer novo");
    expect(authStore.get()).toMatchObject({ token: "novo", refreshToken: "r2", id: "u1" });
  });

  it("refresh recusado encerra a sessão", async () => {
    authStore.set({ token: "velho", refreshToken: "r1" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(json(401)).mockResolvedValueOnce(json(400)));
    await expect(request("/api/x")).rejects.toMatchObject({ status: 401 });
    expect(authStore.get()).toBeNull();
  });

  it("converte o ErroResponse do backend em ApiError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(json(400, { status: 400, erro: "REGRA_DE_NEGOCIO", mensagem: "Horário ocupado" })),
    );
    const error = await request("/api/x", { auth: false }).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect([error.code, error.message, error.status]).toEqual(["REGRA_DE_NEGOCIO", "Horário ocupado", 400]);
  });

  it("falha de rede vira ApiError sem_conexao", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(request("/api/x", { auth: false })).rejects.toMatchObject({ code: "sem_conexao", status: 0 });
  });
});
