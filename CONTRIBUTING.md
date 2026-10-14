# Como contribuir

## Branches

`<tipo>/<assunto-curto>`, a partir da `main`. Exemplos: `feat/agenda-cliente`, `fix/calendario-mes`, `docs/arquitetura`.

## Commits (Conventional Commits)

```
<tipo>(<escopo>): <resumo no imperativo, até 72 caracteres>

<corpo opcional: o que e por que>
```

- **Tipos:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `build`.
- **Escopos:** `shared`, `client`, `professional`, `core`, `docs`, `build`.
- Um commit, uma intenção. Não misturar refatoração com funcionalidade.
- Referencie a issue no rodapé quando houver: `Refs #12`.

## Pull Requests

- Título no mesmo padrão dos commits.
- Preencher o template: o que mudou, como testar, impacto.
- `npm run build` deve passar antes do merge.
- Merge com `--no-ff` para manter o histórico dos commits.

## Legenda de arquivo

Todo arquivo de `src/` começa com uma linha de comentário: o que faz, origem dos dados e API usada.
Ao trocar um mock por API real, atualize a legenda e `docs/ARQUITETURA.md`.

## Versionamento

SemVer (`MAJOR.MINOR.PATCH`). Toda mudança relevante entra no `CHANGELOG.md` (Keep a Changelog).
