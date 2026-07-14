---
status: complete
phase: 41-integracao-api-pix-banco-do-brasil-webhooks
source:
  - 41-01-SUMMARY.md
started: 2026-07-14T21:36:30Z
updated: 2026-07-14T21:37:10Z
---

## Current Test

[testing complete]

## Tests

### 1. Geração de Cobrança PIX Dinâmica (PIX-01, PIX-04)
expected: Endpoint POST /api/subscriptions/pix/create retorna HTTP 201 Created com txid único (formato MEDSTUDY...), pixCopiaECola preenchido e status CREATED com 15min de expiração.
result: pass

### 2. Receptáculo de Webhook do Banco do Brasil (PIX-02)
expected: Endpoint público POST /api/webhooks/pix/bb processa eventos de pagamento com idempotência por endToEndId, estende a assinatura por +365 dias e invalida o cache Caffeine.
result: pass

### 3. Mecanismo de Fallback "Já Paguei" (PIX-03)
expected: Endpoint GET /api/subscriptions/pix/{txid}/status realiza consulta de status no banco local e aciona fallback na API com rate-limit de 5 segundos por chamada.
result: pass

### 4. Perfil de Simulação Dev (mock-pix) (PIX-04)
expected: Endpoint POST /api/subscriptions/dev/simulate-pix-paid/{txid} simula confirmação instantânea no ambiente local, atualizando o status para PAID e liberando o paywall.
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
