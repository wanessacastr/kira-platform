# Arquitetura e integrações

## Visão geral

Front-end em Vite + React que consome o kira-backend (Spring Boot). Em desenvolvimento as chamadas vão para `/api` na origem do app e o proxy do Vite repassa ao backend (`VITE_API_PROXY`, padrão `http://localhost:8081`), sem CORS. No build, a URL vem de `VITE_API_URL`. O app não tem dados de exemplo: sem backend no ar, as telas mostram o estado de erro com "Tentar novamente".

- **Navegação:** React Router. `src/routes.js` tem a tabela chave → URL, `src/screens.js` liga a chave ao componente e `src/AppRoutes.jsx` monta as rotas. `/cliente/*` e `/profissional/*` têm layout próprio (`ClientLayout`, `ProLayout`) que bloqueia o tipo de conta errado; sem conta escolhida, as duas áreas ficam livres (modo protótipo). `setScreen(chave)` do `useSession()` navega para a rota.
- **Estado:** `src/context/` tem um contexto por assunto (`useSession`, `useSignup`, `useSearch`, `useScheduling`, `useTryOn`, `useProDashboard`), reunidos em `AppProviders`. Só dado que sobrevive à troca de tela mora no contexto; estado de uma tela só (modal aberto, carregando, aba) fica na própria tela e volta ao início ao sair dela.
- **Serviços:** `src/shared/api/` tem o cliente HTTP (`http.js`: URL base, token Bearer, renovação do token no 401 e conversão do `ErroResponse` em `ApiError`), o adaptador (`httpAdapter.js`), a conversão de formatos (`mappers.js`) e o contrato em JSDoc (`contract.js`). As telas chamam `api.*` por TanStack Query.
- **Sessão:** o login guarda `{ token, refreshToken, tipo, nome, email, id }` no `localStorage` (`authStore`). `tipo` define a área (CLIENTE → `/cliente`, EMPRESA → `/profissional`). Os endpoints de agenda, avaliações e serviços do usuário recebem o `id` na URL.
- **Formulários:** regras em `src/shared/schemas/forms.js` (zod); a edição de perfil usa react-hook-form.
- **Design system:** valores visuais ficam em `src/shared/styles/tokens.css` (cor, espaço, raio, sombra, tipografia). `shared/theme.js` aponta para essas variáveis e `shared/components/primitives.jsx` traz os blocos de UI. Cor, fonte e raio fixos são barrados pelo lint.
- **Acessibilidade:** controles clicáveis são `<button>`; campos usam `Field` (rótulo, erro e id ligados); modais fecham com Esc; textos seguem contraste AA (`--color-primary-text`). As regras `jsx-a11y` do lint são erros.
- **Organização:** por feature (`client/`, `professional/`) e `shared/` para o que é comum. `shared/` nunca importa de uma feature.

## O que roda em cada integração

| Integração                                             | Onde roda                                            | Endpoint                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Login, refresh e logout                                | `LoginScreen`, `SessionContext`, `http.js`           | `POST /api/auth/login`, `/refresh`, `/logout`                                                       |
| Cadastro                                               | `ClientTermsScreen`, `ProTermsScreen`                | `POST /api/auth/registro/cliente`, `/registro/empresa`                                              |
| Busca, Home e ranking                                  | `useProfessionals`, `useSearchScreen`, `useRanking`  | `GET /api/studios` + `GET /api/studios/{id}/servicos` (um por estúdio)                              |
| Perfil do profissional                                 | `ClientProfessionalProfileScreen`                    | `GET /api/studios/{id}`, `/servicos`, `/avaliacoes`                                                 |
| Horários livres                                        | `ClientSchedulingScreen`                             | `GET /api/empresas/{id}/disponibilidade/slots?servicoId&data`                                       |
| Agendar e cancelar                                     | `ClientSchedulingScreen`, `ClientAgendaDetailScreen` | `POST /api/agendamentos/cliente/{id}`, `PATCH /api/agendamentos/{id}/cancelar`                      |
| Agenda, histórico, pagamentos                          | telas da agenda e do perfil do cliente               | `GET /api/agendamentos/cliente/{id}`                                                                |
| Avaliações da cliente                                  | `ClientReviewsScreen`, detalhe do agendamento        | `GET /api/avaliacoes/cliente/{id}`, `POST /api/avaliacoes/cliente` (`ReviewForm`)                   |
| Painel, agenda, financeiro e analytics do profissional | `useBusinessData` + `professional/utils/metrics.js`  | `GET /api/agendamentos/empresa/{id}`, `/api/empresas/{id}/servicos`, `/api/avaliacoes/empresa/{id}` |
| Concluir e cancelar (profissional)                     | `ProAgendaDashScreen`                                | `PATCH /api/agendamentos/{id}/concluir`, `/cancelar/empresa`                                        |
| Horário de funcionamento                               | `ProBusinessHoursScreen`, aviso no `ProHomeScreen`   | `GET` e `PUT /api/empresas/{id}/disponibilidade`                                                    |
| CEP                                                    | `useCepLookup`                                       | ViaCEP (`viacep.com.br`)                                                                            |
| Geolocalização                                         | `useLocationActivation`                              | API do navegador                                                                                    |
| Câmera da selfie                                       | `useSelfieCamera`                                    | API do navegador                                                                                    |
| Fontes                                                 | `App.jsx`                                            | Google Fonts                                                                                        |

### Ainda sem backend

| Recurso                                             | Situação no app                                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Edição do perfil                                    | Salva só na sessão atual (não há `PUT` de cliente)                                                         |
| Fotos (perfil, documentos, portfólio)               | Ficam no navegador; o cadastro não envia imagens                                                           |
| Categoria e distância do estúdio                    | Categoria reconhecida por palavras nos serviços; distância não aparece (o estúdio não devolve coordenadas) |
| Favoritas                                           | Guardadas só na sessão atual                                                                               |
| Denúncia e emergência                               | Só a interface (futura `POST /api/denuncias`)                                                              |
| Verificação facial                                  | Só a interface, nenhum dado biométrico é salvo                                                             |
| Gift cards, fidelidade, cupons, formas de pagamento | Telas sem dados                                                                                            |
| Saldo e repasse                                     | Dependem de gateway de pagamento                                                                           |
| Similaridade visual do Provador                     | O ranking usa procedimento e avaliação; não há análise de imagem                                           |

## Fluxo principal do Provador

Home → Provador (referência) → Provador (foto) → Resultado → "Encontrar profissionais" → Home com "Recomendadas para você" → Perfil → Agendamento.

## Ligando uma tela a um endpoint novo

1. Adicionar a função em `httpAdapter.js` e, se o formato mudar, a conversão em `mappers.js` (com teste).
2. Chamar `api.*` na tela por `useQuery`/`useMutation`, com carregando e erro.
3. Atualizar as tabelas acima e a legenda do arquivo alterado.
