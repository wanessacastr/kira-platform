# Integração do Kira: frontend e backend

Situação em 26/10/2026. Lista do que o app (kira-platform) já usa do backend (kira-backend).

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

- **Chat sem checagem de acesso:** `GET /api/mensagens/agendamento/{id}` e `PATCH /api/mensagens/{id}/lida` não conferem se quem pede é a cliente ou o estúdio do agendamento. Qualquer pessoa logada lê qualquer conversa. Precisa corrigir antes de o chat ir para o ar.
- **Lista de comissões:** `GET /api/comissoes/funcionaria/{id}` devolve a entidade `ComissaoAgendamento` direto, com relações LAZY e `open-in-view: false`. A tendência é dar erro 500 quando houver comissão. O app usa só o total (`/total`) até o backend devolver um DTO.
- **Painel conta só atendimentos concluídos:** o `/dashboard` não traz ranking de serviços nem avaliações. As telas de Analytics e Financeiro continuam precisando dos agendamentos para esses números.

## O app tem, mas o backend não

- Editar o perfil, fotos, favoritas, denúncia e emergência, gift cards, fidelidade, cupons e formas de pagamento.
- **Documento e selfie do cadastro:** as fotos ficam só no navegador e não são enviadas. O backend não tem rota de upload nem campo de verificação, então o botão "Continuar para verificação facial" não verifica nada. Falta decidir entre verificação por um serviço externo (guardar só o resultado e descartar a selfie), revisão manual dos documentos ou esconder essas telas por enquanto.

## Para tudo funcionar de verdade

1. **O backend precisa rodar com as branches novas.** A versão antiga, sem o id no login, faz as telas que precisam de login falharem. Para ter tudo, é preciso juntar a `feat/login-devolve-id` e a `feat/remarcar-antecedencia`.
2. **E-mail:** faltam `MAIL_USERNAME` e `MAIL_PASSWORD` no `.env` do backend. Sem eles, o e-mail de "esqueci a senha" e o de boas-vindas não chegam.
