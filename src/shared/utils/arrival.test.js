// Confirmação presencial: só números, 6 dígitos e mensagens por motivo de erro · API: nenhuma
import { describe, expect, it } from "vitest";
import { ApiError } from "../api/contract";
import { arrivalDigits, generationErrorMessage, isArrivalCodeComplete, validationErrorMessage } from "./arrival";

describe("entrada do código", () => {
  it("aceita só números e corta em 6", () => {
    expect(arrivalDigits("12a3-4 5678")).toBe("123456");
    expect(arrivalDigits(null)).toBe("");
  });
  it("só vale com exatamente 6 dígitos", () => {
    expect(isArrivalCodeComplete("12345")).toBe(false);
    expect(isArrivalCodeComplete("123456")).toBe(true);
    expect(isArrivalCodeComplete("1234567")).toBe(true); // o excedente é cortado na digitação
  });
});

describe("mensagens de validação", () => {
  const err = (code, status = 400) => new ApiError(code, "x", status);
  it("traduz código incorreto, expirado e já utilizado", () => {
    expect(validationErrorMessage(err("TOKEN_INVALIDO"))).toMatch(/Código incorreto/);
    expect(validationErrorMessage(err("TOKEN_EXPIRADO"))).toMatch(/expirou/);
    expect(validationErrorMessage(err("TOKEN_JA_UTILIZADO"))).toMatch(/já foi utilizado/);
  });
  it("rota inexistente vira aviso de indisponível, sem simular sucesso", () => {
    expect(validationErrorMessage(err("http_404", 404))).toMatch(/ainda não está disponível/);
    expect(generationErrorMessage(err("http_501", 501))).toMatch(/ainda não está disponível/);
  });
  it("falha de comunicação pede nova tentativa", () => {
    expect(validationErrorMessage(err("sem_conexao", 0))).toMatch(/tente novamente/);
    expect(generationErrorMessage(new Error("x"))).toMatch(/tente novamente/);
  });
});
