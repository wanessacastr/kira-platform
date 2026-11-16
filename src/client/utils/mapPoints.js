// Pontos do mapa de profissionais: filtra quem tem coordenadas, conta quem está perto e calcula o enquadramento · função pura

export const NEARBY_KM = 10;

/** Só aparece no mapa quem tem latitude e longitude. */
export const mapPoints = (professionals = []) =>
  professionals.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));

/** Quantos estão a até `radiusKm` da cliente. Sem a posição da cliente, não há como dizer: devolve null. */
export const nearbyCount = (professionals = [], radiusKm = NEARBY_KM) => {
  if (!professionals.some((p) => p.distance != null)) return null;
  return mapPoints(professionals).filter((p) => p.distance != null && p.distance <= radiusKm).length;
};

/** Texto da faixa: "12 perto de você" com a posição da cliente, ou "12 no mapa" sem ela. */
export const nearbyLabel = (professionals = []) => {
  const near = nearbyCount(professionals);
  if (near !== null) return `${near} perto de você`;
  return `${mapPoints(professionals).length} no mapa`;
};

/** Cantos [[sul, oeste], [norte, leste]] que enquadram os pontos e a cliente. Nulo se não houver nenhum ponto. */
export const boundsOf = (points = [], me = null) => {
  const all = [...points];
  if (Number.isFinite(me?.latitude) && Number.isFinite(me?.longitude)) all.push(me);
  if (all.length === 0) return null;
  const lats = all.map((p) => p.latitude);
  const lngs = all.map((p) => p.longitude);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
};

/**
 * Posição dos pontos numa miniatura, em % (x da esquerda, y de cima, norte para cima), dentro das margens dadas.
 * Um ponto só, ou todos no mesmo lugar, ficam no centro. Mostra no máximo `limit` pontos.
 */
export const projectPoints = (points = [], { padX = 14, padY = 24, limit = 6 } = {}) => {
  const shown = points.slice(0, limit);
  const lats = shown.map((p) => p.latitude);
  const lngs = shown.map((p) => p.longitude);
  const [south, north] = [Math.min(...lats), Math.max(...lats)];
  const [west, east] = [Math.min(...lngs), Math.max(...lngs)];
  const place = (value, min, max, pad) => (max === min ? 50 : pad + ((value - min) / (max - min)) * (100 - 2 * pad));
  return shown.map((p) => ({
    id: p.id,
    x: place(p.longitude, west, east, padX),
    y: 100 - place(p.latitude, south, north, padY),
  }));
};
