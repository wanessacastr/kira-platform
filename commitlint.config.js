// Regras de mensagem de commit: tipo(escopo): verbo no infinitivo + objeto · API: nenhuma
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "refactor", "style", "test", "docs", "chore", "build", "ci"]],
    "scope-enum": [2, "always", ["shared", "client", "professional", "core", "build", "ci", "docs"]],
    "header-max-length": [2, "always", 60],
    // minúsculo, mas aceita siglas no meio (CPF, PR)
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-full-stop": [2, "never", "."],
    "body-max-line-length": [2, "always", 100],
    "body-max-length": [1, "always", 200],
    "footer-max-line-length": [0],
  },
  ignores: [(msg) => /^Merge /.test(msg)],
};
