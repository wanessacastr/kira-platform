// Testes de compatibilidade e ranking de profissionais · mock sobre mockProfessionals · API: nenhuma
import { describe, expect, it } from "vitest";
import { mockProfessionals } from "../shared/data/professionals";
import { recommendProfessionals, scoreProfessional } from "./recommendation";

describe("scoreProfessional", () => {
  it("devolve valor entre 0 e 1 para todos os profissionais", () => {
    for (const pro of mockProfessionals) {
      for (const opts of [{}, { category: "cabelo" }, { referenceImage: "x", category: "cabelo" }]) {
        const s = scoreProfessional(pro, opts);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
      }
    }
  });
  it("com foto de referência, a categoria certa pontua mais que a errada", () => {
    const cabelo = mockProfessionals.find((p) => p.category === "cabelo");
    const barba = { ...cabelo, category: "barba" };
    const opts = { referenceImage: "x", category: "cabelo" };
    expect(scoreProfessional(cabelo, opts)).toBeGreaterThan(scoreProfessional(barba, opts));
  });
  it("é determinístico", () => {
    const opts = { referenceImage: "x", generatedImage: "y", category: "unhas" };
    expect(scoreProfessional(mockProfessionals[0], opts)).toBe(scoreProfessional(mockProfessionals[0], opts));
  });
});

describe("recommendProfessionals", () => {
  it("devolve 3 por padrão, ordenados pela compatibilidade (0 a 100)", () => {
    const list = recommendProfessionals();
    expect(list).toHaveLength(3);
    list.forEach((p) => {
      expect(p.compatibility).toBeGreaterThanOrEqual(0);
      expect(p.compatibility).toBeLessThanOrEqual(100);
    });
    const scores = list.map((p) => p.compatibility);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
  it("respeita o limite informado", () => {
    expect(recommendProfessionals({ limit: 5 })).toHaveLength(5);
  });
  it("filtra pela categoria", () => {
    const list = recommendProfessionals({ category: "unhas", limit: 10 });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.category === "unhas")).toBe(true);
  });
  it("usa todos os profissionais quando o filtro não encontra ninguém", () => {
    expect(recommendProfessionals({ minRating: 6 })).toHaveLength(3);
  });
});
