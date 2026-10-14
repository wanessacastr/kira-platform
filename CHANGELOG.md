# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [0.1.0] - 2026-10-14

### Alterado
- Protótipo em arquivo único migrado para projeto Vite + React organizado por feature (`client`, `professional`, `shared`).
- Estado e ações movidos para `KiraContext`; cada tela virou um componente.
- Telas, fluxos e visual preservados (52 telas conferidas por captura de tela contra o original).

### Adicionado
- Legenda de uma linha em cada arquivo de `src/` (função, dados e API).
- Documentação: `docs/ARQUITETURA.md`, `CONTRIBUTING.md`, template de PR.

### Movido
- `kira_front.jsx` para `legacy/kira_front.jsx`.
