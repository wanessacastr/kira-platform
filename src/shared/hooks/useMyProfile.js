// Perfil da conta logada (cliente ou estúdio) · api.profile
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../../context/SessionContext";
import { api } from "../api";

export const useMyProfile = () => {
  const { auth } = useSession();
  return useQuery({ queryKey: ["profile", auth?.id], queryFn: api.profile.getMine, enabled: Boolean(auth) });
};
