# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [0.3.0] - 2026-10-14

### Adicionado

- Tokens em variáveis CSS: cor, espaço, raio, sombra e tipografia.
- Primitivos de interface: Heading, Text, Card, Stack, Button, Chip, Badge, ListRow e ScreenHeader.
- Foco visível e hover em botões, links e campos.
- Regra de lint que barra cor, fonte e raio fixos.

### Alterado

- Componentes base usam os primitivos.
- Barra inferior do cliente e do profissional agora é um componente só (NavBar).
- Escala de fontes única, com mínimo de 12px (textos de 9, 10 e 11px subiram para 12px).
- Campos mostram o anel de foco ao receber foco por teclado.

## [0.2.0] - 2026-10-14

### Adicionado

- Lint com ESLint (hooks e acessibilidade).
- Formatação com Prettier.
- 23 testes dos utilitários com Vitest.
- CI no GitHub: commits, lint, formatação, testes e build.
- Commitlint e Husky para validar mensagens de commit.

### Alterado

- Código formatado com Prettier, sem mudar comportamento nem visual.
- Moldura e atalhos de tela ganham `data-testid` para testes.

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
