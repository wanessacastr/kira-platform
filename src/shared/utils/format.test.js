// Testes de máscaras e validação de CPF, CNPJ, CEP e telefone · API: nenhuma
import { describe, expect, it } from "vitest";
import { formatCep, formatCnpj, formatCpf, formatPhone, isValidCnpj, isValidCpf, onlyDigits } from "./format";

describe("onlyDigits", () => {
  it("remove tudo que não é número", () => {
    expect(onlyDigits("(11) 9.8765-4321")).toBe("11987654321");
  });
});

describe("isValidCpf", () => {
  it("aceita CPF válido com ou sem máscara", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });
  it("recusa dígito verificador errado", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
  });
  it("recusa sequência repetida e tamanho errado", () => {
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("123")).toBe(false);
    expect(isValidCpf("")).toBe(false);
  });
});

describe("isValidCnpj", () => {
  it("aceita CNPJ válido com ou sem máscara", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11222333000181")).toBe(true);
  });
  it("recusa dígito verificador errado", () => {
    expect(isValidCnpj("11.222.333/0001-80")).toBe(false);
  });
  it("recusa sequência repetida e tamanho errado", () => {
    expect(isValidCnpj("00.000.000/0000-00")).toBe(false);
    expect(isValidCnpj("1122")).toBe(false);
  });
});

describe("formatadores", () => {
  it("formatPhone aplica a máscara aos poucos e limita em 11 dígitos", () => {
    expect(formatPhone("1")).toBe("1");
    expect(formatPhone("119")).toBe("(11) 9");
    expect(formatPhone("11987654321")).toBe("(11) 98765-4321");
    expect(formatPhone("119876543219999")).toBe("(11) 98765-4321");
  });
  it("formatCpf aplica a máscara aos poucos", () => {
    expect(formatCpf("5299")).toBe("529.9");
    expect(formatCpf("529982")).toBe("529.982");
    expect(formatCpf("529982247")).toBe("529.982.247");
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
  });
  it("formatCep aplica a máscara aos poucos", () => {
    expect(formatCep("01310")).toBe("01310");
    expect(formatCep("01310100")).toBe("01310-100");
  });
  it("formatCnpj aplica a máscara aos poucos", () => {
    expect(formatCnpj("11222")).toBe("11.222");
    expect(formatCnpj("11222333")).toBe("11.222.333");
    expect(formatCnpj("112223330001")).toBe("11.222.333/0001");
    expect(formatCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });
});
