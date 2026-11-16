// Contatos de emergência da cliente (até 5): lista, cadastro e remoção · API: kira-backend (api.emergencyContacts)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";

export const MAX_EMERGENCY_CONTACTS = 5;

export const useEmergencyContacts = ({ enabled = true } = {}) => {
  const { auth } = useSession();
  const userId = auth?.id;
  const queryClient = useQueryClient();
  const queryKey = ["emergencyContacts", userId];
  const invalidate = () => queryClient.invalidateQueries({ queryKey });
  const list = useQuery({
    queryKey,
    queryFn: api.emergencyContacts.list,
    enabled: enabled && auth?.tipo === "CLIENTE",
  });
  const create = useMutation({ mutationFn: api.emergencyContacts.create, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: api.emergencyContacts.remove, onSuccess: invalidate });
  return { list, create, remove };
};
