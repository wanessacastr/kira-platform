# kira-platform

Kira é uma plataforma inteligente de agendamento e gestão de serviços, criada para otimizar a disponibilidade de profissionais, automatizar processos e oferecer uma experiência escalável.

Este repositório contém o **front-end** (protótipo navegável, sem backend). Todos os dados vêm de mocks locais.

## Stack

Vite + React (JavaScript/JSX) e lucide-react. Navegação por estado `screen`, sem router.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # build de produção em dist/
```

## Estrutura

```
src/
  main.jsx                 entrada
  App.jsx                  moldura do celular + atalhos de tela (dev)
  screens.js               mapa screen -> tela
  context/KiraContext.jsx  estado e ações globais (useKira)
  shared/                  tema, utils, dados e componentes comuns
  client/                  lado cliente (telas, componentes, mocks, recomendação)
  professional/            lado profissional (telas, componentes, mocks)
```

Cada arquivo de `src/` começa com uma legenda de uma linha: o que faz, de onde vêm os dados e qual API usa.

## Documentação

- [Arquitetura e integrações](docs/ARQUITETURA.md): o que roda em cada API, o que é mock e o que é futuro
- [Como contribuir](CONTRIBUTING.md): commits, branches e PRs
- [Histórico de mudanças](CHANGELOG.md)

## Legado

`legacy/kira_front.jsx` guarda o protótipo em arquivo único anterior à migração, apenas para consulta.
