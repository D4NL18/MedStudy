# Milestones: MedStudy

## v1.4 Reorganização Inteligente de Revisões (Shipped: 2026-07-14)

**Phases completed:** 4 phases (36-39), 26 commits, 76 files changed, +2635/-82 lines
**Timeline:** 2026-07-13 → 2026-07-14

**Key accomplishments:**

- Algoritmo de redistribuição de flashcards atrasados com carga balanceada por dia.
- Endpoints REST para preview e aplicação de redistribuição (draft/apply pattern).
- Modal interativo com gráfico comparativo (NgxCharts) mostrando carga "Antes vs Depois".
- Skeleton loaders, overlay de sucesso e UX polish para fluxo completo de reorganização.
- Integração NgRx completa (Actions, Effects, Reducers, Selectors) para estado de redistribuição.

**Known deferred items at close:** 18 (UAT label gaps from prior milestones, 0 pending scenarios — see STATE.md)

---

## v1.0 MVP — Reescrita Angular + Spring Boot

**Status:** Shipped (2026-05-11)
**Phases:** 1-15
**Key Accomplishments:**

- Full monorepo setup (Angular 18, Spring Boot 3, PostgreSQL).
- Secure Authentication with HttpOnly cookies & Refresh Token rotation.
- Dashboard with performance analytics and 12-month evolution.
- Banco de Questões, Simulados, Flashcards and Study Session management.
- 8-theme dynamic color system.
- 80% test coverage in backend and frontend.

## v1.1 Legacy Convergence

**Status:** Shipped (2026-05-18)
**Phases:** 16-21
**Key Accomplishments:**

- Exportação em PDF/CSV, Gamificação (Badges), Notificações e PWA.

## v1.2 Socialização Aprofundada

**Status:** Shipped (2026-06-10)
**Phases:** 22-28
**Key Accomplishments:**

- Perfis, Amigos, Grupos de Competição e Feed Reativo com Privacidade Granular.

## v1.3 Code Quality, Performance & UX Polish

**Status:** Shipped (2026-07-13)
**Phases:** 29-35
**Key Accomplishments:**

- Padronização de DTOs, Refatoração Frontend, Testes expandidos e Hardening de Segurança (OWASP).

## v1.5 Planos de Usuário e Monetização (PIX)

**Status:** Pending
**Phases:** TBD
**Key Accomplishments:**

- Implementação de paywall/bloqueio total do app para contas não pagantes.
- Pagamento anual via QR Code PIX Dinâmico (sem exposição de dados bancários).
- Painel admin/feature flag para concessão de acesso gratuito manual.
