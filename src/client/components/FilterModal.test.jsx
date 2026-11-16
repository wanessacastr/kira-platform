// @vitest-environment jsdom
// Filtros: preço e distância digitados; vazio = sem limite · API: nenhuma
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { defaultSearchFilters } from "../data/options";
import { FilterModal, parseLimit } from "./FilterModal";

afterEach(cleanup);

let latest;
const Harness = ({ initial = defaultSearchFilters }) => {
  const [draft, setDraft] = useState(initial);
  latest = draft;
  return (
    <FilterModal
      open
      mounted
      onClose={() => {}}
      draft={draft}
      setDraft={setDraft}
      onApply={() => {}}
      onClear={() => {}}
    />
  );
};

describe("parseLimit", () => {
  it("vazio é sem limite, número vale, vírgula vira ponto e texto inválido é ignorado", () => {
    expect(parseLimit("")).toBeNull();
    expect(parseLimit("  ")).toBeNull();
    expect(parseLimit("120")).toBe(120);
    expect(parseLimit("2,5")).toBe(2.5);
    expect(parseLimit("0")).toBe(0);
    expect(parseLimit("1.2.3")).toBeUndefined();
    expect(parseLimit("-3")).toBeUndefined();
  });
});

describe("campos de limite", () => {
  it("começam vazios, com 'Sem limite', e o filtro padrão não limita", () => {
    render(<Harness />);
    expect(screen.getAllByPlaceholderText("Sem limite")).toHaveLength(2);
    expect(latest.price).toBeNull();
    expect(latest.maxDistance).toBeNull();
  });
  it("aceita o preço digitado e ignora letras", () => {
    render(<Harness />);
    const field = screen.getByLabelText("Preço máximo em reais");
    fireEvent.change(field, { target: { value: "1500abc" } });
    expect(field.value).toBe("1500");
    expect(latest.price).toBe(1500);
  });
  it("aceita distância com vírgula", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Distância máxima em quilômetros"), { target: { value: "2,5" } });
    expect(latest.maxDistance).toBe(2.5);
  });
  it("apagar o campo volta para sem limite", () => {
    render(<Harness initial={{ ...defaultSearchFilters, price: 200 }} />);
    const field = screen.getByLabelText("Preço máximo em reais");
    expect(field.value).toBe("200");
    fireEvent.change(field, { target: { value: "" } });
    expect(latest.price).toBeNull();
  });
});
