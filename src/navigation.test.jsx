// @vitest-environment jsdom
// Testes de navegação: cada rota abre a tela certa, os layouts barram a conta errada e os menus só apontam para telas que existem · API: nenhuma
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import AppRoutes from "./AppRoutes";
import { clientProfileMenu } from "./client/data/options";
import { proProfileMenu } from "./professional/data/navigation";
import { CLIENT_HOME, PRO_HOME, routePaths } from "./routes";

const session = vi.hoisted(() => ({ accountType: null }));

vi.mock("./context/SessionContext", () => ({ useSession: () => session }));
// Cada tela vira um marcador com a própria chave: o teste confere só o roteamento
vi.mock("./screens", async () => {
  const { routePaths: paths } = await import("./routes");
  return { screens: Object.fromEntries(Object.keys(paths).map((key) => [key, () => <p>tela:{key}</p>])) };
});

const open = async (path) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
};

afterEach(() => {
  cleanup();
  session.accountType = null;
});

describe("navegação por rota", () => {
  it.each(Object.entries(routePaths))("%s abre em %s", async (key, path) => {
    await open(path);
    expect(await screen.findByText(`tela:${key}`)).toBeTruthy();
  });

  it("caminho desconhecido volta para a abertura", async () => {
    await open("/nao-existe");
    expect(await screen.findByText("tela:splash")).toBeTruthy();
  });

  it("/cliente e /profissional levam para a home de cada área", async () => {
    await open("/cliente");
    expect(await screen.findByText("tela:clientHome")).toBeTruthy();
    cleanup();
    await open("/profissional");
    expect(await screen.findByText("tela:proHome")).toBeTruthy();
  });
});

describe("proteção por tipo de conta", () => {
  it("profissional logada não entra na área do cliente", async () => {
    session.accountType = "professional";
    await open(CLIENT_HOME);
    expect(await screen.findByText("tela:proHome")).toBeTruthy();
  });

  it("cliente logada não entra na área do profissional", async () => {
    session.accountType = "client";
    await open(PRO_HOME);
    expect(await screen.findByText("tela:clientHome")).toBeTruthy();
  });

  it("cada conta abre a própria área", async () => {
    session.accountType = "client";
    await open(CLIENT_HOME);
    expect(await screen.findByText("tela:clientHome")).toBeTruthy();
    cleanup();
    session.accountType = "professional";
    await open(PRO_HOME);
    expect(await screen.findByText("tela:proHome")).toBeTruthy();
  });
});

describe("menus de perfil", () => {
  const targets = (menu) => menu.flatMap((section) => section.items.map((item) => item.go));

  it("só apontam para telas com rota", () => {
    for (const go of [...targets(clientProfileMenu), ...targets(proProfileMenu)]) {
      expect(routePaths[go], `rota de ${go}`).toBeTruthy();
    }
  });

  it("o menu de cada área aponta para telas da própria área", () => {
    for (const go of targets(clientProfileMenu)) expect(go.startsWith("client")).toBe(true);
    for (const go of targets(proProfileMenu)) expect(go.startsWith("pro")).toBe(true);
  });
});
