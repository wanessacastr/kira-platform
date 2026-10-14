// Painel do profissional: mês e dia da agenda e regras de fidelidade · dados: mock · API: nenhuma
import { createContext, useContext, useState } from "react";
import { initialLoyaltySettings } from "../professional/data/mocks";
import { startOfDay, startOfMonth } from "../shared/utils/date";

const ProDashboardContext = createContext(null);

export function ProDashboardProvider({ children }) {
  const [proViewMonth, setProViewMonth] = useState(startOfMonth(new Date()));
  const [proSelectedDate, setProSelectedDate] = useState(startOfDay(new Date()));
  const [loyaltySettings, setLoyaltySettings] = useState(initialLoyaltySettings);

  const changeProMonth = (delta) => setProViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  const value = {
    proViewMonth,
    proSelectedDate,
    setProSelectedDate,
    changeProMonth,
    loyaltySettings,
    setLoyaltySettings,
  };
  return <ProDashboardContext.Provider value={value}>{children}</ProDashboardContext.Provider>;
}

export const useProDashboard = () => {
  const ctx = useContext(ProDashboardContext);
  if (!ctx) throw new Error("useProDashboard precisa estar dentro de <ProDashboardProvider>");
  return ctx;
};
