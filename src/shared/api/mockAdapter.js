// Adaptador mock da API: dados locais com latência simulada · mock · futuro: adaptador HTTP real
import { recommendProfessionals } from "../../client/recommendation";
import { mockProfessionals } from "../data/professionals";
import { getDaySchedule } from "../utils/date";
import { ApiError } from "./contract";
import { mockChat } from "./mockChat";
import { mockReports } from "./mockReports";
import { mockTryOn } from "./mockTryOn";

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** @type {import("./contract").KiraApi} */
export const mockAdapter = {
  professionals: {
    list: async () => {
      await wait(650);
      return mockProfessionals;
    },
  },
  availability: {
    // Dias múltiplos de 13 falham na primeira tentativa, para exercitar o estado de erro.
    get: async ({ pro, date, retried = false }) => {
      await wait(500);
      if (date.getDate() % 13 === 0 && !retried) throw new ApiError("availability_unavailable");
      return getDaySchedule(date, pro);
    },
  },
  recommendations: {
    get: async (params) => {
      await wait(550);
      return recommendProfessionals(params);
    },
  },
  address: {
    lookupCep: async () => {
      await wait(500);
      return { street: "Av. T-4", neighborhood: "Setor Bueno", city: "Goiânia", state: "GO" };
    },
  },
  profile: {
    save: async () => {
      await wait(700);
      return { ok: true };
    },
  },
  chat: mockChat,
  tryOn: mockTryOn,
  reports: mockReports,
};
