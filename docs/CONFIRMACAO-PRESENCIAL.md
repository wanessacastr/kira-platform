# Kira Confirm: confirmação presencial por código de 6 dígitos

Frontend do cliente e do profissional. **O backend ainda não tem nada disso** (conferido em `kira-backend`, `main`: não há rota de código, nem o status de chegada, nem status de pagamento). O app está pronto para ligar, mas **não simula sucesso, não gera código local e não guarda o código**.

## Fluxo

1. Agendamento **CONFIRMADO** → na tela de detalhe da cliente aparece **"Estou a caminho"**.
2. O app pede o código ao backend, mostra os 6 dígitos, o botão de copiar e a validade (se o backend informar).
3. No card do agendamento (agenda do profissional) aparece **"Confirmar chegada do cliente"**: campo numérico de 6 dígitos e "Validar código".
4. O backend confere. Se válido, o agendamento passa a **CHEGADA_CONFIRMADA**; as duas telas atualizam (a cliente confere a cada 8 s enquanto o código está à mostra) e o profissional segue para "Concluir atendimento".

## Contrato esperado (a combinar com o backend)

| Quem         | Rota                                          | Corpo                    | Resposta                                                     |
| ------------ | --------------------------------------------- | ------------------------ | ------------------------------------------------------------ |
| Cliente      | `POST /api/agendamentos/{id}/token-chegada`   | nenhum                   | `{ "codigo": "123456", "expiraEm": "2026-11-10T10:10:00Z" }` |
| Cliente      | `GET /api/agendamentos/{id}/token-chegada`    | nenhum                   | o mesmo JSON; `404` se não houver código ativo               |
| Profissional | `POST /api/agendamentos/{id}/chegada/validar` | `{ "codigo": "123456" }` | o agendamento com `status: "CHEGADA_CONFIRMADA"`             |

Erros de validação, no campo `erro` da resposta (formato que o backend já usa): `TOKEN_INVALIDO`, `TOKEN_EXPIRADO` e `TOKEN_JA_UTILIZADO`. O app mostra as mensagens da especificação para cada um.

Regras que o backend precisa garantir (o app só confia nelas): o código pertence a um único agendamento; só a cliente dona vê o código; só o estúdio responsável valida; uso único; validade; o status só muda pela validação.

## No app

- `api.arrival` em `src/shared/api/httpAdapter.js` (`requestToken`, `getToken`, `validateToken`). Hoje, com as rotas inexistentes, a cliente vê "Este recurso ainda não está disponível" e o profissional também.
- `src/client/components/ArrivalCode.jsx` (dentro de `ClientAgendaDetailScreen`) e `src/professional/components/ArrivalValidation.jsx` (dentro do card de `ProAgendaDashScreen`).
- `src/shared/utils/arrival.js`: só números, 6 dígitos, mensagens por erro.
- O código vive só na memória da consulta (TanStack Query): não vai para localStorage, sessionStorage nem log.
- Status novo `CHEGADA_CONFIRMADA`: rótulo "Chegada confirmada", ainda na aba "Próximos".

## Pendências (dependem do backend)

- Rotas acima e o status `CHEGADA_CONFIRMADA`.
- **"Pagamento aprovado":** não existe status de pagamento. Hoje o botão aparece com o agendamento CONFIRMADO. Quando o gateway existir, trocar a condição por "pago e confirmado".
- **Foto do cliente** na tela do profissional: o backend não envia. Entra quando houver um campo (ex.: `fotoCliente`).
- Mobile (Expo) fora do escopo.
