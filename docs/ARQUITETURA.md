# Arquitetura e integrações

## Visão geral

Protótipo front-end em Vite + React. Não há backend: todo dado vem de mocks e todo "carregamento" é simulado pelos serviços de `src/shared/api/`.

- **Navegação:** React Router. `src/routes.js` tem a tabela chave → URL, `src/screens.js` liga a chave ao componente e `src/AppRoutes.jsx` monta as rotas. `/cliente/*` e `/profissional/*` têm layout próprio (`ClientLayout`, `ProLayout`) que bloqueia o tipo de conta errado; sem conta escolhida, as duas áreas ficam livres (modo protótipo). `setScreen(chave)` do `useSession()` navega para a rota.
- **Estado:** `src/context/` tem um contexto por assunto (`useSession`, `useSignup`, `useSearch`, `useScheduling`, `useTryOn`, `useProDashboard`), reunidos em `AppProviders`. Só dado que sobrevive à troca de tela mora no contexto; estado de uma tela só (modal aberto, carregando, aba) fica na própria tela e volta ao início ao sair dela.
- **Serviços:** `src/shared/api/` tem o contrato (`contract.js`) e o adaptador de mock (`mockAdapter.js`). As telas chamam `api.*` por TanStack Query (carregando, erro e cache); para usar uma API real, basta criar outro adaptador com o mesmo contrato.
- **Formulários:** regras em `src/shared/schemas/forms.js` (zod); a edição de perfil usa react-hook-form.
- **Design system:** valores visuais ficam em `src/shared/styles/tokens.css` (cor, espaço, raio, sombra, tipografia). `shared/theme.js` aponta para essas variáveis e `shared/components/primitives.jsx` traz os blocos de UI. Cor, fonte e raio fixos são barrados pelo lint.
- **Acessibilidade:** controles clicáveis são `<button>`; campos usam `Field` (rótulo, erro e id ligados); modais fecham com Esc; textos seguem contraste AA (`--color-primary-text`). As regras `jsx-a11y` do lint são erros.
- **Organização:** por feature (`client/`, `professional/`) e `shared/` para o que é comum. `shared/` nunca importa de uma feature.

## O que roda em cada integração

| Integração                  | Tipo                                       | Onde roda                                                          | Situação                                                   |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Geolocalização              | API do navegador (`navigator.geolocation`) | `useLocationActivation` (`shared/hooks`)                           | Real                                                       |
| Câmera da selfie            | API do navegador (`getUserMedia`)          | `useSelfieCamera` (`client/hooks`)                                 | Real                                                       |
| Upload de imagens           | API do navegador (`FileReader`)            | Cadastro, documentos, fotos e Provador                             | Real, só local, nada é enviado                             |
| Fontes                      | Google Fonts (CSS externo)                 | `App.jsx`                                                          | Real                                                       |
| Busca e filtros             | Simulado                                   | `useSearchScreen` + `api.professionals`                            | Mock, latência simulada                                    |
| Recomendação e TOP 5        | Simulado                                   | `client/recommendation.js`, `api.recommendations` via `useRanking` | Mock sobre `mockProfessionals`; futura API de recomendação |
| Disponibilidade de horários | Simulado                                   | `api.availability` (usa `getDaySchedule`)                          | Mock; futura `GET /profissionais/:id/disponibilidade`      |
| Denúncia e emergência       | Simulado                                   | `shared/components/Safety.jsx`                                     | Mock; futura `POST /api/denuncias`                         |
| CEP                         | Simulado                                   | `api.address.lookupCep` via `useCepLookup`                         | Mock (ViaCEP não integrado)                                |
| Verificação facial          | Simulado                                   | `FaceScreen`                                                       | Mock, nenhum dado biométrico é salvo                       |
| Login e cadastro            | Sem backend                                | Telas de cadastro e login                                          | Mock, sem autenticação real                                |
| Mapa da Home                | Visual                                     | `ClientHomeScreen`                                                 | Mock, sem mapa real                                        |
| Pagamento                   | Não implementado                           | Perfil do cliente                                                  | Sem gateway                                                |

## Fluxo principal do Provador

Home → Provador (referência) → Provador (foto) → Resultado → "Encontrar profissionais" → Home com "Recomendadas para você" → Perfil → Agendamento.

## Evoluindo para API real

1. Trocar o corpo da função mock mantendo a assinatura (ex.: `getDaySchedule(date, pro)`).
2. Criar um adaptador real em `src/shared/api/` com o mesmo contrato e trocá-lo em `index.js`; as telas não mudam.
3. Atualizar a tabela acima e a legenda do arquivo alterado.
