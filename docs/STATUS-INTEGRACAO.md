# Integração do Kira: frontend e backend

Situação em 27/10/2026. Lista do que o app (kira-platform) já usa do backend (kira-backend).

## Funcionando: frontend ligado ao backend

### Conta

| Função                                                           | Onde fica no app                             |
| ---------------------------------------------------------------- | -------------------------------------------- |
| Entrar, continuar logada (renovação automática da sessão) e sair | Login, todas as telas                        |
| Criar conta de cliente                                           | Cadastro da cliente (última etapa, "Termos") |
| Criar conta de profissional, já com os serviços                  | Cadastro do profissional (última etapa)      |
| Esqueci a senha: pedir o link e criar nova senha                 | Login → "Esqueci minha senha"                |

### Cliente

| Função                                              | Onde fica no app                            |
| --------------------------------------------------- | ------------------------------------------- |
| Lista de estúdios, busca e ranking                  | Início e Buscar                             |
| Perfil do estúdio com serviços, preços e avaliações | Perfil do profissional                      |
| Ver horários livres de um dia                       | Agendamento                                 |
| Agendar                                             | Agendamento                                 |
| Ver a agenda: próximos, concluídos e cancelados     | Agenda                                      |
| Cancelar (até 2 horas antes)                        | Detalhe do agendamento                      |
| Remarcar (até 2 horas antes)                        | Detalhe do agendamento → "Remarcar horário" |
| Avaliar atendimento concluído                       | Detalhe do agendamento / Minhas avaliações  |
| Histórico e pagamentos                              | Perfil                                      |

### Profissional

| Função                                                        | Onde fica no app                    |
| ------------------------------------------------------------- | ----------------------------------- |
| Painel: clientes do dia, receita da semana e nota             | Início                              |
| Agenda com calendário                                         | Agenda                              |
| Concluir e cancelar atendimento                               | Agenda                              |
| Horário de funcionamento (dias e horas em que atende)         | Perfil → "Horário de funcionamento" |
| Financeiro e analytics (calculados a partir dos agendamentos) | Financeiro / Analytics              |
| Avaliações recebidas                                          | Painel                              |

### Serviços de fora (não são do kira-backend)

- **ViaCEP:** preenche o endereço pelo CEP.
- **Navegador:** localização e câmera da selfie.

## Integrado na API, mas ainda sem tela

As chamadas já existem em `src/shared/api/httpAdapter.js` (com conversão e testes). Falta só a tela usar.

| Função                                | Chamadas (`api.…`)                                                                                                                                    | Situação na tela                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Chat do agendamento                   | `messages.listByAppointment`, `send`, `markRead`                                                                                                      | O botão "Conversar com…" ainda não faz nada              |
| Gerenciar serviços depois do cadastro | `services.create`, `update`, `deactivate`                                                                                                             | Os serviços só são definidos no cadastro do profissional |
| Funcionárias                          | `staff.listForMyBusiness`, `create`, `update`, `deactivate`, `agendaDay`, `agendaWeek`, `listBlocks`, `createBlock`, `removeBlock`, `commissionTotal` | Não há tela de funcionárias                              |
| Painel pronto do backend              | `dashboard.getMine({ from, to })`                                                                                                                     | O app ainda calcula os números no navegador              |

### Problemas no backend encontrados na integração

- **Chat sem checagem de acesso (corrigido na `fix/conversa-so-participantes`):** antes, qualquer pessoa logada lia qualquer conversa. Com a correção, só a cliente e o estúdio do agendamento veem as mensagens, e só quem recebeu pode marcar como lida. Quem tentar marcar a própria mensagem recebe erro, então a tela deve chamar `markRead` só para mensagens com `mine: false`. A correção está no PR #7 do backend, ainda não juntado na `main`.
- **Lista de comissões (continua):** `GET /api/comissoes/funcionaria/{id}` devolve a entidade `ComissaoAgendamento` direto, com relações LAZY e `open-in-view: false`. A tendência é dar erro 500 quando houver comissão. O app usa só o total (`/total`) até o backend devolver um DTO.
- **Painel conta só atendimentos concluídos (continua):** o `/dashboard` não traz ranking de serviços nem avaliações. As telas de Analytics e Financeiro continuam precisando dos agendamentos para esses números.

## O backend tem, mas o app não usa

- **Profissional remarcar:** `PATCH /api/agendamentos/{id}/reagendar/empresa`. Na agenda do profissional só há concluir e cancelar.
- **Busca no servidor:** `/api/studios/busca`, `/cidade` e `/tipo`. O app traz a lista inteira e filtra no navegador, o que funciona enquanto houver poucos estúdios.
- **Escolher a funcionária:** `GET /api/studios/{id}/funcionarias`. O agendamento não deixa a cliente escolher quem vai atender.
- **Médias de avaliação:** `/api/studios/{id}/media` e `/api/avaliacoes/empresa/{id}/media`. O app calcula a média a partir da lista.
- **Denúncias (só na `feat/canal-seguranca`):** `POST /api/denuncias` e as rotas de análise em `/api/admin/denuncias`. A branch parte de um commit antigo e ainda não foi juntada. O app tem a tela de denúncia, mas ela não envia nada. Os motivos também não batem: o app usa `endereco_invalido` e `risco_imediato`, e o backend espera `ENDERECO_FALSO`, `LOCAL_NAO_VALIDADO` e `PERIGO_DURANTE_ATENDIMENTO`.

## O app tem, mas o backend não

- Editar o perfil, fotos, favoritas, emergência, gift cards, fidelidade, cupons e formas de pagamento.
- **Documento e selfie do cadastro:** as fotos ficam só no navegador e não são enviadas. O backend não tem rota de upload nem campo de verificação, então o botão "Continuar para verificação facial" não verifica nada. Falta decidir entre verificação por um serviço externo (guardar só o resultado e descartar a selfie), revisão manual dos documentos ou esconder essas telas por enquanto.

## Situação das branches do backend

A `main` recebeu os PRs #1 a #5 em 26/10 (painel, Swagger, `.env`, horário de funcionamento, avisos do Sonar e permissão do `mvnw`) e **agora compila**. Mas ela ainda não tem o que o app precisa para funcionar inteiro. Essas mudanças estão numa pilha de branches, uma em cima da outra, e todas entram juntas pela `feat/integracao-app` ([PR #7](https://github.com/IsabelaCristinaDev/kira-backend/pull/7)):

| Branch                          | O que traz                                                     | No GitHub | Na `main` |
| ------------------------------- | -------------------------------------------------------------- | --------- | --------- |
| `feat/atendimento-empresa`      | Só o estúdio dono conclui ou cancela; sem erro 500 ao cancelar | Sim       | Não       |
| `feat/seguranca-agendamentos`   | Confere o dono nas rotas de agendamento                        | Sim       | Não       |
| `feat/seguranca-empresa`        | Confere o estúdio dono nas rotas do estabelecimento            | Sim       | Não       |
| `feat/recuperar-senha`          | Link de redefinição no e-mail de "esqueci a senha"             | Sim       | Não       |
| `feat/remarcar-antecedencia`    | Remarcar só até 2 horas antes                                  | Sim       | Não       |
| `feat/login-devolve-id-pilha`   | Id do usuário no login e no refresh (em cima da pilha)         | Sim       | Não       |
| `fix/conversa-so-participantes` | Chat só para quem participa do agendamento                     | Sim       | Não       |

A `feat/login-devolve-id` é a versão antiga, feita sobre um commit anterior à pilha. A que serve é a `feat/login-devolve-id-pilha`. O PR #6 (`feat/atendimento-empresa`) também fica coberto pelo PR #7.

A `feat/integracao-app` junta a `feat/login-devolve-id-pilha`, a `fix/conversa-so-participantes` e a `main`. O conflito com a `main` foi só em dois testes (`AgendamentoServiceTest` e `ServicoServiceTest`) e já está resolvido. Testado em 27/10: passa em 240 dos 241 testes. O único que falha é o `contextLoads`, que precisa do banco.

No app, os 69 testes passam.

## Para tudo funcionar de verdade

1. **Juntar o [PR #7](https://github.com/IsabelaCristinaDev/kira-backend/pull/7) do backend.** Até lá, o backend precisa rodar a partir da branch `feat/integracao-app`: com a `main` sozinha, o login não devolve o id e as telas que precisam de login falham.
2. **E-mail:** continuam faltando `MAIL_USERNAME` e `MAIL_PASSWORD` no `.env` do backend. Sem eles, o e-mail de "esqueci a senha" e o de boas-vindas não chegam.
3. **Telas que faltam no app:** chat do agendamento, gerenciar serviços, funcionárias e usar o painel do backend. As chamadas já estão prontas.
