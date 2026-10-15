// Painel do profissional: mês e dia da agenda e regras de fidelidade · API: nenhuma (fidelidade ainda não tem backend)
import { createContext, useContext, useState } from "react";
import { startOfDay, startOfMonth } from "../shared/utils/date";

const ProDashboardContext = createContext(null);

const initialLoyaltySettings = { enabled: true, pointsPerReal: 1, cashbackPercent: 5 };

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
