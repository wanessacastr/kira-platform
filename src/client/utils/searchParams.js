// Traduz o estado da tela de busca para o pedido de api.professionals.search · função pura
import { categoryToApi } from "../data/options";

const MAX_TEXT = 100;

const sortToApi = { proximo: "PROXIMO", avaliado: "AVALIADO", preco: "PRECO", recomendado: "RECOMENDADO" };

// O modo de atendimento não vai: o backend ainda não tem esse dado
export const toSearchParams = ({ query, category, filters }) => ({
  text: query.trim().slice(0, MAX_TEXT) || null,
  category: categoryToApi[category] ?? null,
  maxPrice: filters.price,
  minRating: filters.minRating > 0 ? filters.minRating : null,
  maxDistanceKm: filters.maxDistance,
  sort: sortToApi[filters.sort] ?? null,
});
