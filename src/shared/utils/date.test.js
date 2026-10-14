// Testes dos horários do agendamento (getDaySchedule) · mock determinístico · API: nenhuma
import { describe, expect, it } from "vitest";
import { getDaySchedule, startOfDay, startOfMonth } from "./date";

const pro = { id: 1 };

describe("getDaySchedule", () => {
  it("não devolve horários em dias múltiplos de 6", () => {
    expect(getDaySchedule(new Date(2026, 9, 6), pro)).toEqual([]);
    expect(getDaySchedule(new Date(2026, 9, 12), pro)).toEqual([]);
  });
  it("devolve de 3 a 6 horários únicos e em ordem", () => {
    for (let day = 1; day <= 28; day++) {
      if (day % 6 === 0) continue;
      const slots = getDaySchedule(new Date(2026, 9, day), pro);
      expect(slots.length).toBeGreaterThanOrEqual(3);
      expect(slots.length).toBeLessThanOrEqual(6);
      expect(new Set(slots).size).toBe(slots.length);
      expect(slots).toEqual([...slots].sort());
    }
  });
  it("devolve sempre o mesmo resultado para a mesma data e profissional", () => {
    const date = new Date(2026, 9, 14);
    expect(getDaySchedule(date, pro)).toEqual(getDaySchedule(date, pro));
  });
});

describe("datas auxiliares", () => {
  it("startOfMonth volta ao dia 1", () => {
    expect(startOfMonth(new Date(2026, 9, 14, 15, 30)).getDate()).toBe(1);
  });
  it("startOfDay zera a hora", () => {
    const d = startOfDay(new Date(2026, 9, 14, 15, 30));
    expect([d.getHours(), d.getMinutes()]).toEqual([0, 0]);
  });
});
