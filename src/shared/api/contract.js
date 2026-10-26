// Contrato da API (JSDoc): o que o front espera de qualquer adaptador, mock ou real · API: nenhuma

/**
 * @typedef {Object} Professional
 * @property {number} id
 * @property {string} name
 * @property {string} role
 * @property {string} category
 * @property {number} rating
 * @property {number} reviews
 * @property {number} price
 * @property {number} distance
 * @property {"presencial"|"domicilio"|"ambos"} mode
 * @property {string[]} services
 */

/**
 * @typedef {Object} Address
 * @property {string} street
 * @property {string} neighborhood
 * @property {string} city
 * @property {string} state
 */

/**
 * Interface que todo adaptador cumpre. Trocar o mock pelo real é trocar o adaptador em `api/index.js`.
 * @typedef {Object} KiraApi
 * @property {{ list: () => Promise<Professional[]> }} professionals
 *   futuro: GET /profissionais
 * @property {{ get: (p: { pro: Professional, date: Date, retried?: boolean }) => Promise<string[]> }} availability
 *   futuro: GET /profissionais/:id/disponibilidade?data=YYYY-MM-DD
 * @property {{ get: (params: object) => Promise<Array<Professional & { compatibility: number }>> }} recommendations
 *   futuro: GET /recomendacoes
 * @property {{ lookupCep: (cep: string) => Promise<Address> }} address
 *   futuro: ViaCEP ou GET /enderecos/:cep
 * @property {{ save: (data: object) => Promise<{ ok: true }> }} profile
 *   futuro: PUT /clientes/me
 * @property {import("./chatContract").ChatGateway} chat
 *   futuro: webhook e eventos do n8n (ver chatContract.js)
 * @property {import("./tryOnContract").TryOnGateway} tryOn
 *   futuro: API da Kira e Cloudflare Workers AI (ver tryOnContract.js)
 */

export class ApiError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.name = "ApiError";
    this.code = code;
  }
}
