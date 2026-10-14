// Provador virtual e ranking: fotos da cliente e profissionais recomendadas · dados: mock · API: nenhuma (ranking vem de api.recommendations)
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { api } from "../shared/api";
import { useSession } from "./SessionContext";
import { useSignup } from "./SignupContext";

const TryOnContext = createContext(null);

export function TryOnProvider({ children }) {
  const { setScreen } = useSession();
  const [tryOnReference, setTryOnReference] = useState("");
  const [tryOnClientPhoto, setTryOnClientPhoto] = useState("");
  const [rankingSource, setRankingSource] = useState("direct"); // "direct" | "provador"

  const startTryOnFlow = () => {
    setTryOnReference("");
    setTryOnClientPhoto("");
    setScreen("clientTryOnReference");
  };
  const goToPersonalizedRanking = () => {
    setRankingSource("provador");
    setScreen("clientHome");
  };

  const value = {
    tryOnReference,
    setTryOnReference,
    tryOnClientPhoto,
    setTryOnClientPhoto,
    rankingSource,
    startTryOnFlow,
    goToPersonalizedRanking,
  };
  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
}

export const useTryOn = () => {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error("useTryOn precisa estar dentro de <TryOnProvider>");
  return ctx;
};

// Ranking: personalizado (referência do Provador) na tela de resultado e depois de "Encontrar
// profissionais"; geral quando acessado direto. Recarrega a cada entrada na tela, como no protótipo.
export function useRanking() {
  const { screen } = useSession();
  const { cPreferences, cForm } = useSignup();
  const { rankingSource, tryOnReference, tryOnClientPhoto } = useTryOn();
  const personalized = rankingSource === "provador" || screen === "clientTryOnResult";
  const location = cForm.latitude && cForm.longitude ? { lat: cForm.latitude, lng: cForm.longitude } : null;
  const query = useQuery({
    queryKey: [
      "ranking",
      { personalized, hasReference: personalized && !!tryOnReference, hasPhoto: personalized && !!tryOnClientPhoto },
      cPreferences,
      location,
    ],
    queryFn: () =>
      api.recommendations.get({
        service: cPreferences[0] || null,
        category: personalized ? null : "todos",
        referenceImage: personalized ? tryOnReference : null,
        generatedImage: personalized ? tryOnClientPhoto : null,
        preferences: cPreferences,
        location,
        priceRange: null,
        limit: personalized ? 5 : 10,
      }),
  });
  return {
    recommended: query.data ?? [],
    rankingLoading: query.isFetching,
    rankingError: query.isError && !query.isFetching,
    loadRanking: query.refetch,
  };
}
