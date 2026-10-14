// Testes da tabela de rotas e do mapa de telas (cada tela tem uma URL única) · API: nenhuma
import { describe, expect, it } from "vitest";
import { keyFor, pathFor, routePaths } from "./routes";
import { screens } from "./screens";

describe("rotas", () => {
  it("toda tela registrada tem rota e toda rota tem tela", () => {
    expect(Object.keys(routePaths).sort()).toEqual(Object.keys(screens).sort());
  });
  it("caminhos são únicos", () => {
    const paths = Object.values(routePaths);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("telas do cliente ficam em /cliente e do profissional em /profissional", () => {
    for (const [key, path] of Object.entries(routePaths)) {
      if (key.startsWith("client")) expect(path.startsWith("/cliente/")).toBe(true);
      if (key.startsWith("pro") || key === "face") expect(path.startsWith("/profissional/")).toBe(true);
    }
  });
  it("pathFor e keyFor são inversos", () => {
    for (const key of Object.keys(routePaths)) expect(keyFor(pathFor(key))).toBe(key);
  });
  it("keyFor ignora a barra final e devolve null para caminho desconhecido", () => {
    expect(keyFor("/cliente/buscar/")).toBe("clientSearch");
    expect(keyFor("/nao-existe")).toBeNull();
  });
  it("pathFor de chave desconhecida volta para a abertura", () => {
    expect(pathFor("xyz")).toBe("/");
  });
});
