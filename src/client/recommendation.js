// Compatibilidade e TOP 5 de profissionais · mock sobre mockProfessionals · futura API de recomendação
import { mockProfessionals } from "../shared/data/professionals";

// Calcula um score de compatibilidade (0 a 1) entre um profissional e os
// critérios informados pela cliente. Fica isolado em sua própria função para
// que, quando o algoritmo de visão computacional (busca por imagem de
// referência) estiver pronto, baste plugar o resultado dele aqui como mais
// um fator — sem mexer no restante da tela.
export function scoreProfessional(pro, { service, category, referenceImage, generatedImage, preferences, location, priceRange, minRating } = {}) {
  // Ranking personalizado do Provador Virtual: quando existe uma foto de
  // referência, a prioridade conceitual muda para "procedimento compatível
  // > similaridade com a referência > resultado gerado (complementar) >
  // distância > avaliação", conforme a regra de negócio do Provador. O
  // ranking geral (sem referenceImage, abaixo) continua com a fórmula
  // original, sem nenhuma alteração.
  if (referenceImage) {
    let score = 0;
    let weightTotal = 0;

    // 1. Procedimento compatível (peso 0.35) — critério prioritário.
    weightTotal += 0.35;
    if (category) {
      score += 0.35 * (pro.category === category ? 1 : 0.1);
    } else if (service) {
      const matches = pro.category === service || pro.services.some((s) => s.toLowerCase().includes(String(service).toLowerCase()));
      score += 0.35 * (matches ? 1 : 0.25);
    } else {
      score += 0.35 * 0.6;
    }

    // 2. Similaridade com a foto de referência (peso 0.30) — principal
    // sinal visual do Provador. Placeholder determinístico até a busca por
    // imagem (visão computacional) estar integrada; a referência NÃO é
    // substituída pelo resultado gerado.
    weightTotal += 0.3;
    const referenceSimilarity = 0.6 + ((pro.id * 37) % 40) / 100; // 0.60–0.99, mock
    score += 0.3 * referenceSimilarity;

    // 3. Resultado gerado pelo Provador (peso 0.10) — sinal complementar.
    weightTotal += 0.1;
    if (generatedImage) {
      const generatedCompatibility = 0.55 + ((pro.id * 19) % 35) / 100; // 0.55–0.89, mock
      score += 0.1 * generatedCompatibility;
    } else {
      score += 0.1 * 0.6;
    }

    // 4. Distância (peso 0.15)
    weightTotal += 0.15;
    score += 0.15 * Math.max(0, 1 - pro.distance / 10);

    // 5. Avaliação (peso 0.10)
    weightTotal += 0.1;
    score += 0.1 * (pro.rating / 5);

    return Math.max(0, Math.min(1, score / weightTotal));
  }

  let score = 0;
  let weightTotal = 0;

  // Avaliação (peso 0.30)
  weightTotal += 0.3;
  score += 0.3 * (pro.rating / 5);

  // Quantidade de avaliações, com saturação (peso 0.15)
  weightTotal += 0.15;
  score += 0.15 * Math.min(pro.reviews / 150, 1);

  // Distância (peso 0.20) — quanto mais perto, melhor
  weightTotal += 0.2;
  score += 0.2 * Math.max(0, 1 - pro.distance / 10);

  // Correspondência de serviço/categoria desejada (peso 0.20)
  weightTotal += 0.2;
  if (category) {
    score += 0.2 * (pro.category === category ? 1 : 0.15);
  } else if (service) {
    const matches = pro.category === service || pro.services.some((s) => s.toLowerCase().includes(String(service).toLowerCase()));
    score += 0.2 * (matches ? 1 : 0.3);
  } else {
    score += 0.2 * 0.6; // sem serviço/categoria definidos, pontuação neutra
  }

  // Faixa de preço (peso 0.10)
  weightTotal += 0.1;
  if (priceRange && priceRange.max) {
    score += 0.1 * (pro.price <= priceRange.max ? 1 : 0.2);
  } else {
    score += 0.1 * 0.7;
  }

  // Similaridade visual entre a referência da cliente e o portfólio do
  // profissional (peso 0.05). Hoje é um placeholder determinístico; quando a
  // busca por imagem/visão computacional estiver integrada, substituir por
  // referenceImage.similarityTo(pro.portfolioEmbeddings) ou equivalente.
  weightTotal += 0.05;
  if (referenceImage) {
    const pseudoSimilarity = 0.6 + ((pro.id * 37) % 40) / 100; // 0.60–0.99, mock
    score += 0.05 * pseudoSimilarity;
  } else {
    score += 0.05 * 0.6;
  }

  return Math.max(0, Math.min(1, score / weightTotal));
}

// Serviço/função modular de recomendação. Recebe os critérios da cliente e
// devolve os profissionais ordenados por score, cada um com seu
// `compatibility` (0–100) já calculado.
//
// Hoje funciona 100% sobre `mockProfessionals`. Quando a API de recomendação
// (GET /recomendacoes?servico=&imagem=&lat=&lng=&precoMax=...) estiver
// pronta, o corpo desta função deve trocar para uma chamada fetch/axios que
// devolva a mesma forma de dado (lista de profissionais com `compatibility`),
// sem precisar alterar `renderClientRanking` nem os componentes de card.
export function recommendProfessionals({ service, category, referenceImage, generatedImage, preferences = [], location, priceRange, minRating, limit = 3 } = {}) {
  let pool = mockProfessionals;
  if (category && category !== "todos") pool = pool.filter((p) => p.category === category);
  else if (preferences && preferences.length > 0) pool = pool.filter((p) => preferences.includes(p.category));
  if (minRating) pool = pool.filter((p) => p.rating >= minRating);
  const source = pool.length > 0 ? pool : mockProfessionals;

  return source
    .map((pro) => ({ ...pro, compatibility: Math.round(scoreProfessional(pro, { service, category, referenceImage, generatedImage, preferences, location, priceRange, minRating }) * 100) }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
}
