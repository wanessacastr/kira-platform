// Consultas de profissionais (lista e detalhe) e do usuário logado · api.professionals, api.appointments, api.reviews
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api";

export const useProfessionals = () => useQuery({ queryKey: ["professionals"], queryFn: api.professionals.list });

export const useProfessional = (id) =>
  useQuery({ queryKey: ["professional", id], queryFn: () => api.professionals.get(id), enabled: !!id });

export const useMyAppointments = () =>
  useQuery({ queryKey: ["appointments", "mine"], queryFn: api.appointments.listMine });

export const useMyReviews = () => useQuery({ queryKey: ["reviews", "mine"], queryFn: api.reviews.listMine });
