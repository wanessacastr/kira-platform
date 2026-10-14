// Ponto único de acesso à API (hoje o adaptador mock) · mock · futuro: trocar por adaptador HTTP
import { mockAdapter } from "./mockAdapter";

export { ApiError } from "./contract";

/** @type {import("./contract").KiraApi} */
export const api = mockAdapter;
