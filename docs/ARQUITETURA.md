# Arquitetura e integrações

## Visão geral

Protótipo front-end em Vite + React. Não há backend: todo dado vem de mocks e todo "carregamento" é simulado com `setTimeout`.

- **Navegação:** estado `screen` no `KiraContext`; `src/screens.js` liga cada chave a uma tela.
- **Estado:** `src/context/KiraContext.jsx` expõe estado e ações pelo hook `useKira()`.
- **Organização:** por feature (`client/`, `professional/`) e `shared/` para o que é comum. `shared/` nunca importa de uma feature.

## O que roda em cada integração

| Integração | Tipo | Onde roda | Situação |
|---|---|---|---|
| Geolocalização | API do navegador (`navigator.geolocation`) | `ClientLocationScreen`, `ProLocationScreen` via `KiraContext` | Real |
| Câmera da selfie | API do navegador (`getUserMedia`) | `ClientSelfieScreen` via `KiraContext` | Real |
| Upload de imagens | API do navegador (`FileReader`) | Cadastro, documentos, fotos e Provador | Real, só local, nada é enviado |
| Fontes | Google Fonts (CSS externo) | `App.jsx` | Real |
| Busca e filtros | Simulado | `ClientSearchScreen` + `KiraContext` | Mock, latência simulada |
| Recomendação e TOP 5 | Simulado | `client/recommendation.js`, `KiraContext.loadRanking` | Mock sobre `mockProfessionals`; futura API de recomendação |
| Disponibilidade de horários | Simulado | `shared/utils/date.js` (`getDaySchedule`) | Mock; futura `GET /profissionais/:id/disponibilidade` |
| Denúncia e emergência | Simulado | `shared/components/Safety.jsx` | Mock; futura `POST /api/denuncias` |
| CEP | Simulado | `handleCepBlur` no `KiraContext` | Mock (ViaCEP não integrado) |
| Verificação facial | Simulado | `FaceScreen` | Mock, nenhum dado biométrico é salvo |
| Login e cadastro | Sem backend | Telas de cadastro e login | Mock, sem autenticação real |
| Mapa da Home | Visual | `ClientHomeScreen` | Mock, sem mapa real |
| Pagamento | Não implementado | Perfil do cliente | Sem gateway |

## Fluxo principal do Provador

Home → Provador (referência) → Provador (foto) → Resultado → "Encontrar profissionais" → Home com "Recomendadas para você" → Perfil → Agendamento.

## Evoluindo para API real

1. Trocar o corpo da função mock mantendo a assinatura (ex.: `getDaySchedule(date, pro)`).
2. Centralizar chamadas em `src/shared/api/` (ainda não existe) em vez de chamar `fetch` dentro das telas.
3. Atualizar a tabela acima e a legenda do arquivo alterado.
