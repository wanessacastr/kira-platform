// Ponto único de acesso à API: adaptador HTTP do kira-backend · URL em VITE_API_URL
import { httpAdapter } from "./httpAdapter";

export { ApiError, errorMessage } from "./contract";
export { authStore } from "./http";

export const api = httpAdapter;
