// "Voltar" que respeita de onde a pessoa veio: usa o histórico quando existe e cai na tela padrão quando a página foi aberta direto
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

export const useBack = (fallbackScreen) => {
  const navigate = useNavigate();
  const { key } = useLocation();
  const { setScreen } = useSession();
  // "default" é a chave da primeira entrada do histórico: não há para onde voltar
  return useCallback(
    () => (key === "default" ? setScreen(fallbackScreen) : navigate(-1)),
    [key, navigate, setScreen, fallbackScreen],
  );
};
