// Testes da busca de profissionais (filtros e ordenação)
import { describe, expect, it } from "vitest";
import { defaultSearchFilters } from "../data/mocks";
import { mockProfessionals } from "../../shared/data/professionals";
import { searchProfessionals } from "./searchProfessionals";

const base = { query: "", category: "todos", filters: defaultSearchFilters };

describe("searchProfessionals", () => {
  it("ordena por distância por padrão", () => {
    const r = searchProfessionals(mockProfessionals, base);
    const d = r.map((p) => p.distance);
    expect(d).toEqual([...d].sort((a, b) => a - b));
  });
  it("filtra pela categoria", () => {
    const cat = mockProfessionals[0].category;
    const r = searchProfessionals(mockProfessionals, { ...base, category: cat });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.category === cat)).toBe(true);
  });
  it("busca pelo nome sem diferenciar maiúsculas", () => {
    const name = mockProfessionals[0].name.toUpperCase();
    const r = searchProfessionals(mockProfessionals, { ...base, query: name });
    expect(r.map((p) => p.id)).toContain(mockProfessionals[0].id);
  });
  it("ignora o termo de erro simulado", () => {
    const r = searchProfessionals(mockProfessionals, { ...base, query: "erro" });
    expect(r.length).toBe(searchProfessionals(mockProfessionals, base).length);
  });
  it("ordena por preço e respeita a nota mínima", () => {
    const r = searchProfessionals(mockProfessionals, {
      ...base,
      filters: { ...defaultSearchFilters, sort: "preco", minRating: 4.5 },
    });
    expect(r.every((p) => p.rating >= 4.5)).toBe(true);
    const prices = r.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
