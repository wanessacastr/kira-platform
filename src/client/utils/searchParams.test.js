// Testes da tradução dos filtros da tela para o pedido da busca
import { describe, expect, it } from "vitest";
import { defaultSearchFilters } from "../data/options";
import { toSearchParams } from "./searchParams";

const base = { query: "", category: "todos", filters: defaultSearchFilters };

describe("toSearchParams", () => {
  it("sem nada escolhido, manda só os limites padrão", () => {
    expect(toSearchParams(base)).toEqual({
      text: null,
      category: null,
      maxPrice: 500,
      minRating: null,
      maxDistanceKm: 30,
      sort: "PROXIMO",
    });
  });
  it("texto sem espaços sobrando e dentro do limite do backend", () => {
    expect(toSearchParams({ ...base, query: "  corte  " }).text).toBe("corte");
    expect(toSearchParams({ ...base, query: "   " }).text).toBeNull();
    expect(toSearchParams({ ...base, query: "a".repeat(150) }).text).toHaveLength(100);
  });
  it("traduz categoria, nota e ordem", () => {
    const params = toSearchParams({
      query: "",
      category: "barbearia",
      filters: { ...defaultSearchFilters, minRating: 4, sort: "preco" },
    });
    expect(params).toMatchObject({ category: "BARBA", minRating: 4, sort: "PRECO" });
  });
});
