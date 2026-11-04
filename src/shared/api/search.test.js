// Testes de api.professionals.search: parâmetros e formato da resposta do backend · fetch simulado
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authStore } from "./http";
import { httpAdapter as api } from "./httpAdapter";

const json = (data) =>
  new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  });
  vi.stubGlobal("location", { origin: "http://localhost" });
  authStore.set({ token: "t", refreshToken: "r", tipo: "CLIENTE", id: "u1" });
});
afterEach(() => vi.unstubAllGlobals());

const item = {
  id: "e1",
  nome: "Estúdio",
  descricao: null,
  endereco: { cidade: "Goiânia", estado: "GO" },
  telefone: "62",
  fotoUrl: null,
  tipoEstabelecimento: "AUTONOMA",
  mediaAvaliacoes: 4.26,
  quantidadeAvaliacoes: 3,
  menorPreco: 40,
  latitude: -16,
  longitude: -49,
  distanciaKm: 1.26,
  servicos: [
    { id: "s2", nome: "Corte", duracaoMinutos: 60, preco: "80", ativo: true, categoria: "CABELO" },
    { id: "s1", nome: "Escova", duracaoMinutos: 30, preco: "40", ativo: true, categoria: "CABELO" },
  ],
};

describe("api.professionals.search", () => {
  it("manda só os filtros preenchidos, com a conta logada", async () => {
    const fetch = vi.fn(async () => json({ itens: [], pagina: 2, tamanho: 20, totalItens: 41, totalPaginas: 3 }));
    vi.stubGlobal("fetch", fetch);

    const result = await api.professionals.search({
      text: "corte",
      category: "CABELO",
      maxPrice: 500,
      minRating: null,
      maxDistanceKm: 30,
      sort: "PRECO",
      page: 2,
    });

    const url = new URL(String(fetch.mock.calls[0][0]));
    expect(url.pathname).toBe("/api/studios/pesquisa");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      texto: "corte",
      categoria: "CABELO",
      precoMaximo: "500",
      distanciaMaximaKm: "30",
      ordenacao: "PRECO",
      pagina: "2",
      tamanho: "20",
    });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer t");
    expect(result).toEqual({ items: [], page: 2, total: 41, totalPages: 3 });
  });
  it("converte o estúdio com serviços, preço, avaliações e distância", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ itens: [item], pagina: 0, tamanho: 20, totalItens: 1, totalPaginas: 1 })),
    );

    const {
      items: [pro],
    } = await api.professionals.search({});

    expect(pro).toMatchObject({
      id: "e1",
      name: "Estúdio",
      city: "Goiânia",
      rating: 4.3,
      reviews: 3,
      price: 40,
      distance: 1.3,
    });
    expect(pro.services.map((s) => s.name)).toEqual(["Corte", "Escova"]);
  });
  it("sem distância no backend, fica nula", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        json({ itens: [{ ...item, distanciaKm: null }], pagina: 0, tamanho: 20, totalItens: 1, totalPaginas: 1 }),
      ),
    );
    const { items } = await api.professionals.search({});
    expect(items[0].distance).toBeNull();
  });
});
