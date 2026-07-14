---
phase: 42
title: Painel Administrativo de Assinaturas (Single Admin)
created: 2026-07-14
status: locked
---

# Phase 42 Context — Painel Administrativo de Assinaturas (Single Admin)

## Domain Boundary
Esta fase implementa o painel administrativo de assinaturas e a gestão de clientes para o único administrador (Role `ADMIN`):
- Restrição backend com `@PreAuthorize("hasRole('ADMIN')")` em `/api/admin/subscriptions/**`.
- Endpoints REST de estatísticas de assinaturas, receita total PIX, busca/listagem paginada de usuários, sobreposição manual de planos e relatório de transações PIX.
- Interface no Angular em `/admin/subscriptions` com 4 cards de métricas (Ativos, Trial, Expirados, Receita PIX), tabela de assinaturas, modal de concessão manual (com opções predefinidas e campo `notes` obrigatório), e aba dedicada de "Transações PIX".
- Route Guard `AdminGuard` no Angular e exibição condicional do item "Painel Admin" na navegação principal apenas para usuários `ROLE_ADMIN`.

---

## Canonical Refs
- [REQUIREMENTS.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/REQUIREMENTS.md) — Requisitos ADMIN-01..03
- [ROADMAP.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/ROADMAP.md) — Definição da Fase 42 no Milestone v1.5
- [40-CONTEXT.md](file:///C:/Users/PC/Documents/GitHub/MedStudy/.planning/phases/40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend/40-CONTEXT.md) — Modelo de entidades (`Subscription`, `PixTransaction`)

---

## Locked Implementation Decisions

### 1. Concessão e Sobreposição Manual (Admin Override)
- **Opções de Alteração**:
  - `+30 dias` (adiciona 30 dias ao vencimento atual ou a partir de agora).
  - `+90 dias` (adiciona 90 dias).
  - `+365 dias` (adiciona 1 ano).
  - `Conceder LIFETIME` (define status `LIFETIME` permanente).
  - `Forçar Expiração` (define status `EXPIRED`).
- **Observações Obrigatórias**: Campo de texto `notes` obrigatório no envio para registrar a justificativa no banco de dados.
- **Side-Effects**: Marcador `isAdminOverride = true` é setado e o cache Caffeine `subscriptionStatusCache` do usuário afetado é evictado imediatamente.

### 2. Cards de Métricas e Filtros da Tabela
- **4 Cards no Topo**:
  1. **Assinantes Ativos**: Contagem total de usuários com status `ACTIVE` + `LIFETIME`.
  2. **Em Trial**: Contagem total de usuários com status `TRIAL`.
  3. **Assinaturas Expiradas**: Contagem total de usuários com status `EXPIRED`.
  4. **Receita PIX Acumulada**: Soma monetária total (em R$) de todas as transações com status `PAID`.
- **Filtros da Tabela de Usuários**: Busca por nome/e-mail + filtro dropdown por status (`TRIAL`, `ACTIVE`, `EXPIRED`, `LIFETIME`).

### 3. Aba de Transações PIX
- **Aba Dedicada**: "Transações PIX" no painel admin.
- **Colunas**: `txid`, E-mail do Usuário, Valor (R$), Data de Criação/Pagamento, `endToEndId` e Badge de Status (`PAID`, `CREATED`, `EXPIRED`, `CANCELLED`).
- **Filtros**: Filtro dropdown por status do PIX.

### 4. Segurança e Navegação (Single Admin)
- **Backend Security**: Todos os endpoints sob `/api/admin/subscriptions/**` protegidos por `@PreAuthorize("hasRole('ADMIN')")`.
- **Angular Security**:
  - Rota `/admin/subscriptions` protegida por `AdminGuard` (`CanActivateFn` que valida `user.role === 'ROLE_ADMIN'`).
  - Menu Lateral / Header exibe o link "Painel Admin" (ícone de escudo/coroa) exclusivamente se o usuário autenticado for `ROLE_ADMIN`.

---

## Deferred Ideas
- *Nenhuma ideia diferida nesta fase.*
