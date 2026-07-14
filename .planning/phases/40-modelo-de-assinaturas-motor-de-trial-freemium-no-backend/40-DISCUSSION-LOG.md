# Phase 40: Modelo de Assinaturas & Motor de Trial Freemium no Backend - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-14
**Phase:** 40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend
**Areas discussed:** Tratamento de Bloqueio por Expiração, Ciclo de Vida do Trial & Agendador, Rotas Isentas do Bloqueio

---

## Tratamento de Bloqueio por Expiração

| Option | Description | Selected |
|--------|-------------|----------|
| HTTP 403 Forbidden | Retorna 403 com código PAYWALL_REQUIRED no JSON de erro | |
| HTTP 402 Payment Required | Retorna HTTP 402 Payment Required com JSON de detalhes do plano expirado | ✓ |
| Você decide | Abordagem mais idiomática | |

**User's choice:** HTTP 402 Payment Required com JSON de detalhes do plano expirado

| Option | Description | Selected |
|--------|-------------|----------|
| Payload completo | code, message, expiredAt timestamp e status ('EXPIRED') | ✓ |
| Payload enxuto | Apenas error = 'PAYWALL_REQUIRED' e status = 402 | |
| Você decide | Definir estrutura ideal | |

**User's choice:** Payload completo: code, message, expiredAt timestamp e status ('EXPIRED')

| Option | Description | Selected |
|--------|-------------|----------|
| SubscriptionStatusFilter | Filtro customizado na cadeia do Spring Security (após JwtAuthenticationFilter) | ✓ |
| Annotation @RequiresActiveSubscription | AOP nos Controllers | |
| Você decide | Abordagem segura | |

**User's choice:** Filtro customizado 'SubscriptionStatusFilter' na cadeia do Spring Security (após JwtAuthenticationFilter)

| Option | Description | Selected |
|--------|-------------|----------|
| Cache em memória | Checagem rápida com Spring Cache / Caffeine com TTL curto ou invalidação na renovação | ✓ |
| Query a cada request | Consulta direta via JPA / Repository a cada requisição HTTP | |
| Você decide | Definir mecanismo ideal | |

**User's choice:** Checagem rápida com cache em memória (Spring Cache / Caffeine) invalidado apenas na renovação ou por TTL curto

---

## Ciclo de Vida do Trial & Agendador

| Option | Description | Selected |
|--------|-------------|----------|
| Concessão Automática no Cadastro | Criação automática da assinatura TRIAL de 30 dias diretamente no UserService.register | ✓ |
| Criação Lazy | Criação apenas no primeiro login | |
| Você decide | Padrão mais seguro | |

**User's choice:** Criação automática da assinatura TRIAL de 30 dias diretamente no evento/método de cadastro do usuário (UserService.register)

| Option | Description | Selected |
|--------|-------------|----------|
| Cron diário (00:00 UTC) | Agendador diário para marcar assinaturas/trials vencidas como EXPIRED | ✓ |
| Intervalo de 1 hora | Agendador executando a cada hora | |
| Você decide | Frequência adequada | |

**User's choice:** Cron diário (ex: 00:00 UTC) para marcar assinaturas/trials vencidas como EXPIRED e atualizar métricas

---

## Rotas Isentas do Bloqueio

| Option | Description | Selected |
|--------|-------------|----------|
| Liberação ampla | Auth, Subscriptions, Profile (/users/me) e Webhooks | |
| Isentar apenas /auth/** e /subscriptions/** | Apenas endpoints de autenticação e gerenciamento/checkout de assinaturas | ✓ |
| Você decide | Lista completa e segura | |

**User's choice:** Isentar apenas /auth/** e /subscriptions/**

---

## the agent's Discretion

- Estrutura interna DTO (`SubscriptionResponseDTO`, etc.).
- Detalhes de Mapeamento MapStruct e criação de repositórios JPA.

## Deferred Ideas

Nenhuma ideia diferida — discussão 100% no escopo da Fase 40.
