// Diz se um profissional atende uma categoria, por palavras no nome, descrição e serviços · função pura
import { categoryKeywords } from "../data/options";

export const professionalText = (pro) =>
  [pro.name, pro.role, pro.description, ...pro.services.map((s) => s.name)].join(" ").toLowerCase();

export function matchesCategory(pro, category) {
  if (!category || category === "todos") return true;
  const keywords = categoryKeywords[category] ?? [category];
  const text = professionalText(pro);
  return keywords.some((k) => text.includes(k));
}
