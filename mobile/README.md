# Kira Mobile

App React Native (Expo SDK 58, Expo Router) da Kira. Roda com dados simulados, igual ao protótipo web.

## Rodar

```bash
cd mobile
npm install
npx expo start        # QR code para o Expo Go, ou pressione a (Android), i (iOS), w (web)
```

## Como se liga ao web

O app reaproveita, sem copiar, o código que não depende de navegador, pelo alias `@kira/*` (aponta para `../src`):

- `@kira/shared/api`: contrato, mock e gateway do chat (`api.chat`)
- `@kira/shared/data`, `@kira/shared/utils`: profissionais e datas
- `@kira/client/chat`: reducer, agrupamento por dia e textos do chat
- `@kira/client/utils`: busca de profissionais
- `@kira/context/SchedulingContext`: estado do agendamento

Trocar o mock pela API real em `src/shared/api` vale para o web e para o app ao mesmo tempo.

## O que já está convertido

Abertura, login (simulado), início, busca, perfil da profissional, agendamento, ajuda e suporte e o chat de atendimento
(carregando, boas-vindas, conversa, cartão de horário, transferência para atendente, falha de envio e sem conexão).

## O que falta converter

Cadastro de cliente e profissional, Provador virtual, agenda, denúncia e emergência, e toda a área da profissional.

## Regras do projeto

- Cores, raios e fontes vêm de `src/theme/tokens.js`, que espelha `src/shared/styles/tokens.css`.
- Textos em português do Brasil. Em qualquer texto sobre IA, usar "nossa inteligência artificial".
- `src/hooks/useChat.js` repete a lógica do `useChat` do web, trocando só o ouvinte de conexão (NetInfo). Extrair a parte
  comum para `src/shared` quando o web puder ser alterado.
