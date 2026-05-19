# Roadmap: MedStudy

## Milestones

- ✅ **v1.0 MVP** — Phases 1-15 (shipped 2026-05-11) [v1.0-ROADMAP.md](.planning/milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Legacy Convergence** — Phases 16-21 (shipped 2026-05-18) [v1.1-ROADMAP.md](.planning/milestones/v1.1-ROADMAP.md)
- 🚧 **v1.2 Socialização Aprofundada** — Phases 22-26 (in progress)

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

---

### Phase 22 — Perfis de Usuário & Cadastro de Informações
**Goal:** Criar a infraestrutura de perfis com informações básicas e visualização pública/privada.
**Requirements:** PROF-01, PROF-02
**Deliverables:**
- Backend: Schema de Profile associado ao User.
- Backend: Endpoints de CRUD de informações de perfil (nome, semestre, faculdade, avatar).
- UI: Tela de Edição de Perfil nas configurações.
- UI: Tela de Perfil Público amigável exibindo badges conquistadas.

### Phase 23 — Sistema de Conexões (Amigos) & Busca
**Goal:** Permitir adicionar, aceitar, recusar amizades e realizar pesquisas na base.
**Requirements:** FRND-01, FRND-02
**Deliverables:**
- Backend: Tabela/Entidade de Friendships (Pending, Accepted, Blocked).
- Backend: Busca otimizada de usuários por nome ou faculdade.
- UI: Painel Social na barra de navegação/módulo com listagem de amigos e solicitações pendentes.
- UI: Barra de busca e botão de "Adicionar Amigo".

### Phase 24 — Configurações Granulares de Privacidade
**Goal:** Garantir privacidade total e proteção de dados sensíveis na rede social do app.
**Requirements:** PRIV-01, PRIV-02
**Deliverables:**
- Backend: Filtros automáticos em buscas e perfis baseados nas restrições salvas pelo usuário.
- UI: Painel de Configurações de Privacidade detalhado (alternar visibilidade de Streak, Faculdade, Questões, Badges).
- Backend/Frontend: Testes rigorosos de controle de acesso aos endpoints de perfil.

### Phase 25 — Grupos de Competição Automatizados (Gymrats style)
**Goal:** Criar competições baseadas em volume de questões resolvidas e duelos 1v1.
**Requirements:** COMP-01, COMP-02, COMP-03, COMP-04
**Deliverables:**
- Backend: Modelos de Competição (título, duração, participantes, ranking).
- Backend: Contador dinâmico de questões do banco agregando automaticamente aos desafios ativos.
- UI: Dashboard de Competição de Grupos com gráficos e ranking dinâmico.
- UI: Interface rápida de "Duelos 1v1" temporários.

### Phase 26 — Feed de Atividades & Interações Silenciosas
**Goal:** Implementar o feed de conquistas automatizadas e interações silenciosas de suporte.
**Requirements:** FEED-01, FEED-02, FRND-03
**Deliverables:**
- Backend: Geração automática de eventos no Feed para amigos baseados em conquistas e metas de questões.
- Backend: Sistema de reações (Clap, Cheer) e notificações reativas instantâneas.
- UI: Feed de atividade social dinâmico no Dashboard principal.

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-15  | v1.0      | 100%           | Shipped | 2026-05-11|
| 16-21 | v1.1      | 100%           | Shipped | 2026-05-18|
| 22    | v1.2      | 0/1            | Planned | -         |
| 23    | v1.2      | 0/1            | Planned | -         |
| 24    | v1.2      | 0/1            | Planned | -         |
| 25    | v1.2      | 0/1            | Planned | -         |
| 26    | v1.2      | 0/1            | Planned | -         |

---
*Roadmap updated for v1.2 on 2026-05-18*
