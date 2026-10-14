// Gera os horários disponíveis de um profissional em uma data específica.
// Mock determinístico por enquanto — no futuro, substituir o corpo desta função
// por uma chamada à API (ex: GET /profissionais/:id/disponibilidade?data=YYYY-MM-DD),
// que deverá consultar a tabela de disponibilidade do profissional no PostgreSQL.
// A assinatura (date, pro) => string[] pode permanecer a mesma para a integração real.
export const getDaySchedule = (date, pro) => {
  const day = date.getDate();
  const base = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  if (day % 6 === 0) return []; // dia sem horários disponíveis (exemplo mockado)
  const seed = (day * 7 + pro.id * 13) % base.length;
  const count = 3 + (day % 4);
  const slots = [];
  for (let i = 0; i < count; i++) slots.push(base[(seed + i * 3) % base.length]);
  return Array.from(new Set(slots)).sort();
};

export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
