// Pontos do mapa de profissionais · testes das funções puras
import { describe, expect, it } from "vitest";
import { boundsOf, mapPoints, nearbyCount, nearbyLabel, projectPoints } from "./mapPoints";

const pro = (id, latitude, longitude, distance = null) => ({ id, latitude, longitude, distance });

describe("mapPoints", () => {
  it("ignora quem não tem coordenadas", () => {
    const list = [pro(1, -16.7, -49.2), pro(2, null, null), pro(3, -16.6, undefined)];
    expect(mapPoints(list).map((p) => p.id)).toEqual([1]);
  });

  it("aceita lista vazia", () => {
    expect(mapPoints()).toEqual([]);
  });
});

describe("nearbyCount e nearbyLabel", () => {
  it("conta só quem está até o raio", () => {
    const list = [pro(1, -16.7, -49.2, 2), pro(2, -16.8, -49.3, 10), pro(3, -17, -49.5, 30)];
    expect(nearbyCount(list)).toBe(2);
    expect(nearbyLabel(list)).toBe("2 perto de você");
  });

  it("sem a posição da cliente, não diz perto: mostra quantos estão no mapa", () => {
    const list = [pro(1, -16.7, -49.2), pro(2, -16.8, -49.3), pro(3, null, null)];
    expect(nearbyCount(list)).toBeNull();
    expect(nearbyLabel(list)).toBe("2 no mapa");
  });

  it("não conta quem está perto mas não tem coordenadas", () => {
    expect(nearbyCount([pro(1, null, null, 1)])).toBe(0);
  });
});

describe("boundsOf", () => {
  it("enquadra todos os pontos", () => {
    expect(boundsOf([pro(1, -16.7, -49.4), pro(2, -16.5, -49.1)])).toEqual([
      [-16.7, -49.4],
      [-16.5, -49.1],
    ]);
  });

  it("inclui a posição da cliente", () => {
    const bounds = boundsOf([pro(1, -16.7, -49.2)], { latitude: -16.9, longitude: -49.0 });
    expect(bounds).toEqual([
      [-16.9, -49.2],
      [-16.7, -49.0],
    ]);
  });

  it("sem pontos, devolve nulo", () => {
    expect(boundsOf([])).toBeNull();
  });
});

describe("projectPoints", () => {
  it("põe o norte para cima e o oeste para a esquerda, dentro das margens", () => {
    const [a, b] = projectPoints([pro(1, -16.7, -49.4), pro(2, -16.5, -49.1)], { padX: 10, padY: 20 });
    expect(a).toEqual({ id: 1, x: 10, y: 80 });
    expect(b).toEqual({ id: 2, x: 90, y: 20 });
  });

  it("um ponto só fica no centro", () => {
    expect(projectPoints([pro(1, -16.7, -49.2)])).toEqual([{ id: 1, x: 50, y: 50 }]);
  });

  it("limita a quantidade de pontos", () => {
    const many = Array.from({ length: 9 }, (_, i) => pro(i, -16 - i / 10, -49 - i / 10));
    expect(projectPoints(many, { limit: 4 })).toHaveLength(4);
  });
});
