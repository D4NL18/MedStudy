# Roadmap: MedStudy

## Milestones

- ✅ **v1.0 MVP** — Phases 1-15 (shipped 2026-05-11) [v1.0-ROADMAP.md](.planning/milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Legacy Convergence** — Phases 16-21 (shipped 2026-05-18) [v1.1-ROADMAP.md](.planning/milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 Socialização Aprofundada** — Phases 22-28 (shipped 2026-06-10) [v1.2-ROADMAP.md](.planning/milestones/v1.2-ROADMAP.md)
- ✅ **v1.3 Code Quality, Performance & UX Polish** — Phases 29-35 (shipped 2026-07-13)
- ✅ **v1.4 Reorganização Inteligente de Revisões** — Phases 36-39 (shipped 2026-07-14) [v1.4-ROADMAP.md](.planning/milestones/v1.4-ROADMAP.md)
- 🚧 **v1.5 Planos de Usuário e Monetização (PIX)** — Phases 40-43 (In Progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-15) — SHIPPED 2026-05-11</summary>

- [x] Phase 1-15: Monorepo Setup to Docs & E2E

</details>

<details>
<summary>✅ v1.1 Legacy Convergence (Phases 16-21) — SHIPPED 2026-05-18</summary>

- [x] Phase 16: Refinamento de Analytics & Tendências (1/1 plans)
- [x] Phase 17: Sincronização de Regras & Normalização (1/1 plans)
- [x] Phase 18: Alertas de Performance & Exportação (2/2 plans)
- [x] Phase 19: Gamificação & Notificações (1/1 plans)
- [x] Phase 20: Ajustes de Responsividade (2/2 plans)
- [x] Phase 21: PWA & Otimização Final (1/1 plans)

</details>

<details>
<summary>✅ v1.2 Socialização Aprofundada (Phases 22-28) — SHIPPED 2026-06-10</summary>

- [x] Phase 22: Perfis de Usuário & Cadastro de Informações
- [x] Phase 23: Sistema de Conexões (Amigos) & Busca
- [x] Phase 24: Configurações Granulares de Privacidade
- [x] Phase 25: Grupos de Competição Automatizados (Gymrats style)
- [x] Phase 26: Tela de Registro de Usuário
- [x] Phase 27: Redução de Custos, Paginação & Rate Limiting
- [x] Phase 28: Feed de Atividades & Interações Silenciosas

</details>

<details>
<summary>✅ v1.3 Code Quality, Performance & UX Polish (Phases 29-35) — SHIPPED 2026-07-13</summary>

- [x] Phase 29: Limpeza & Refatoração do Backend (Java/Spring Boot)
- [x] Phase 30: Arquitetura Frontend & Reuso de Componentes (Angular)
- [x] Phase 31: Hardening e Segurança Avançada (OWASP Deep Dive)
- [x] Phase 32: Expansão de Cobertura de Testes
- [x] Phase 33: UX Polish, Animações e Fluidez (Aesthetics)
- [x] Phase 33.1: Padronização e Documentação de DTOs
- [x] Phase 34: Documentação em Código (Clean Comments & Javadoc/TSDoc)
- [x] Phase 35: Refatoração Frontend - Separação de Arquivos (HTML, SCSS, TS)

</details>

<details>
<summary>✅ v1.4 Reorganização Inteligente de Revisões (Phases 36-39) — SHIPPED 2026-07-14</summary>

- [x] Phase 36: Algoritmo de Redistribuição no Backend (Java/Spring Boot)
- [x] Phase 37: Endpoints da API e Configurações de Usuário
- [x] Phase 38: Interface do Usuário e Gerenciamento de Estado (Angular)
- [x] Phase 39: Feedback Visual e UX Polish

</details>

### 🚧 v1.5 Planos de Usuário e Monetização (PIX) (Phases 40-43)

### Phase 40: Modelo de Assinaturas & Motor de Trial Freemium no Backend
- Status: Complete (1/1 plans)
- Description: Entidades JPA (`Subscription`, `PixTransaction`), concessão automática de 30 dias de trial no cadastro, scheduler para expiração e interceptor de segurança para bloqueio de contas expiradas.
- Requirements: PAYWALL-01, PAYWALL-02

### Phase 41: Integração API PIX Banco do Brasil & Webhooks (Spring Boot)
- Status: Complete (1/1 plans)
- Description: Cliente OAuth2 + mTLS para API BB PIX, endpoints REST de geração de PIX Dinâmico, webhook receiver seguro e mecanismo de fallback ("Já Paguei") com suporte a profile dev `mock-pix`.
- Requirements: PIX-01, PIX-02, PIX-03, PIX-04

### Phase 42: Painel Administrativo de Assinaturas (Single Admin)
- Status: Planned
- Description: Controle de acessos por Role `ADMIN`, endpoints e tela no Angular para gerenciar usuários, conceder/estender acesso manual (VIP/Lifetime) e visualizar relatórios de pagamentos.
- Requirements: ADMIN-01, ADMIN-02, ADMIN-03

### Phase 43: Interface do Usuário (Angular NgRx), Tela de Planos & UX Polish
- Status: Planned
- Description: Tela de Planos (`/planos`), modal de checkout PIX com QR Code e Copia e Cola, NgRx State slice de assinatura, Route Guard (`CanActivateFn`), banners de aviso de expiração e histórico de pagamentos na conta.
- Requirements: PAYWALL-03, NOTIF-01, NOTIF-02

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-15  | v1.0      | 100%           | Shipped | 2026-05-11|
| 16-21 | v1.1      | 100%           | Shipped | 2026-05-18|
| 22-28 | v1.2      | 100%           | Shipped | 2026-06-10|
| 29-35 | v1.3      | 100%           | Shipped | 2026-07-13|
| 36-39 | v1.4      | 100%           | Shipped | 2026-07-14|
| 40    | v1.5      | 1/1            | Complete| 2026-07-14|
| 41    | v1.5      | 1/1            | Complete| 2026-07-14|
| 42    | v1.5      | 0/1            | Planned | -          |
| 43    | v1.5      | 0/1            | Planned | -          |

---
*Roadmap updated for v1.5 on 2026-07-14*
