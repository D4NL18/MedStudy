---
phase: 41
title: Integração API PIX Banco do Brasil & Webhooks (Spring Boot)
created: 2026-07-14
status: locked
---

# Phase 41 Context — Integração API PIX Banco do Brasil & Webhooks (Spring Boot)

## Domain Boundary
Esta fase implementa o cliente HTTP e motor de pagamentos PIX no Spring Boot integrado à API do Banco do Brasil:
- Autenticação OAuth2 + mTLS para obtenção do token do Banco do Brasil.
- Geração de cobrança PIX Dinâmica (`PUT /v2/cob/{txid}`) com QR Code e chave Copia e Cola.
- Receptáculo público de Webhooks (`POST /api/webhooks/pix/bb`) para confirmação passiva em tempo real.
- Endpoint de verificação "Já Paguei" (`GET /api/subscriptions/pix/{txid}/status`) com consulta direta de fallback.
- Profile Spring `mock-pix` para testes locais e desenvolvimento desacoplado.

---

## Canonical Refs
- [REQUIREMENTS.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/REQUIREMENTS.md) — Requisitos PIX-01..04
- [ROADMAP.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/ROADMAP.md) — Definição da Fase 41 no Milestone v1.5
- [40-CONTEXT.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/phases/40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend/40-CONTEXT.md) — Decisões do modelo de dados (`Subscription`, `PixTransaction`) e paywall

---

## Locked Implementation Decisions

### 1. Perfil de Desenvolvimento & Testes (`mock-pix`)
- **Comportamento**: Quando o Spring profile `mock-pix` estiver ativo (padrão em ambiente dev/local sem certs mTLS do BB), o serviço PIX intercepta chamadas à API remota.
- **Endpoint Dev de Simulação**: `POST /api/subscriptions/dev/simulate-pix-paid/{txid}` que executa o pipeline completo do Webhook fake.
- **Auto-delay opcional**: Permite agendar disparo do webhook fake após 5 segundos para simulação realista.

### 2. Validade do QR Code & Expiração do PIX
- **TTL da Cobrança**: Configurado para 15 minutos (900 segundos) no payload do BB (`calendario.expiracao = 900`).
- **Status Expirado**: Transações não pagas após 15 minutos têm o status alterado para `EXPIRED` no banco local.

### 3. Mecanismo de Fallback / Botão "Já Paguei"
- **Fluxo do Endpoint (`GET /api/subscriptions/pix/{txid}/status`)**:
  1. Consulta a transação no banco de dados local.
  2. Se a transação já estiver `PAID` ou `EXPIRED`, retorna o status imediatamente.
  3. Se ainda estiver `CREATED`, realiza chamada direta de fallback `GET /v2/cob/{txid}` na API do Banco do Brasil.
  4. Se o BB confirmar pagamento (`CONCLUIDA`), processa a ativação da assinatura.
- **Rate Limit**: Restrição de no mínimo 5 segundos entre consultas manuais por `txid` para evitar throttling do BB.

### 4. Regra de Renovação / Acúmulo de Período
- **Cálculo da Validade (`currentPeriodEnd`)**:
  - Se o usuário tiver um `trialEndDate` ou `currentPeriodEnd` vigente no futuro, o período de 365 dias é somado a essa data limite anterior (sem perda de dias).
  - Se o usuário estiver `EXPIRED`, os 365 dias contam a partir de `Instant.now()`.
- **Ativação**: Status da assinatura passa para `ACTIVE` e o cache Caffeine (`subscriptionStatusCache`) é evictado.

---

## Deferred Ideas
- *Nenhuma ideia diferida nesta fase.*
