---
status: complete
phase: 40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend
source: [.planning/phases/40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend/40-01-PLAN.md]
started: 2026-07-14T19:39:30Z
updated: 2026-07-14T19:50:50Z
---

## Current Test

[testing complete]

## Tests

### 1. Cadastro de Usuário com Trial Gratuito de 30 Dias
expected: Ao cadastrar um novo usuário (POST /api/auth/register), o sistema salva automaticamente a assinatura (Subscription) vinculada com status TRIAL e trialEndDate configurado para 30 dias no futuro.
result: pass

### 2. Acesso Liberado a Rotas Protegidas em Período de Trial
expected: Requisições autenticadas com JWT para rotas protegidas (ex: GET /api/user-settings) retornam HTTP 200 OK durante o período de trial ativo.
result: pass

### 3. Interceptação Freemium Paywall com HTTP 402 Payment Required
expected: Quando a assinatura do usuário está EXPIRED, o filtro SubscriptionStatusFilter bloqueia requisições a rotas protegidas retornando HTTP 402 Payment Required com o JSON contendo `code: PAYWALL_REQUIRED`.
result: pass

### 4. Isenção de Rotas Públicas e de Autenticação/Planos
expected: Usuários com assinatura expirada conseguem acessar rotas de autenticação (/api/auth/**) e planos (/api/subscriptions/**) sem serem bloqueados pelo Paywall.
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
