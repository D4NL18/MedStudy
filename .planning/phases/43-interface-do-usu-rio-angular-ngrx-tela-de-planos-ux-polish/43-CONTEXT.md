---
phase: 43
title: Interface do Usuário (Angular NgRx), Tela de Planos & UX Polish
created: 2026-07-15
status: locked
---

# Phase 43 Context — Interface do Usuário (Angular NgRx), Tela de Planos & UX Polish

## Domain Boundary
Tela de planos (/planos) com checkout PIX, bloqueios visuais de paywall (modais e redirecionamentos), banners de notificação de expiração e exibição do histórico de pagamentos para o usuário logado.

---

## Canonical Refs
- [REQUIREMENTS.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/REQUIREMENTS.md) — Requisitos PAYWALL-03, NOTIF-01..02
- [ROADMAP.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/ROADMAP.md) — Definição da Fase 43 no Milestone v1.5
- [41-CONTEXT.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/phases/41-integracao-api-pix-banco-do-brasil-webhooks/41-CONTEXT.md) — Backend do PIX
- [40-CONTEXT.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/phases/40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend/40-CONTEXT.md) — Modelo de paywall

---

## Locked Implementation Decisions

### 1. Experiência de Bloqueio (Paywall)
- Quando o usuário recebe um HTTP 402, será exibido um modal obstrutivo in-place mantendo-o na rota atual (com o fundo borrado), contendo um botão para "Ver Planos".

### 2. Fluxo de Checkout PIX
- Na tela `/planos`, ao clicar em Assinar, o fluxo de pagamento deve abrir em um modal/overlay sobrepondo a própria página.
- Esse modal deve conter o QR Code, a chave PIX (Copia e Cola) e o botão "Já Paguei" (que engatilha o polling para o backend).

### 3. Posicionamento do Banner de Aviso
- O aviso de dias restantes/expiração deve ser um banner de alerta no topo do Dashboard e demais telas principais, exibido de forma permanente/sticky até que seja fechado ou pago.

### 4. Histórico de Pagamentos
- O histórico de pagamentos/faturas do PIX ficará hospedado em uma nova aba/seção específica de pagamentos e assinaturas dentro do "Meu Perfil" (Configurações da Conta).

---

## Deferred Ideas
- *Nenhuma ideia diferida nesta fase.*
