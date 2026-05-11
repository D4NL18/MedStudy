# Roadmap: MedStudy

## Milestones

- ✅ **v1.0 MVP** — Phases 1-15 (shipped 2026-05-11) [v1.0-ROADMAP.md](.planning/milestones/v1.0-ROADMAP.md)
- 🚧 **v1.1 Legacy Convergence** — Phases 16-20 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-15) — SHIPPED 2026-05-11</summary>

- [x] Phase 1-15: Monorepo Setup to Docs & E2E

</details>

---

### Phase 16 — Refinamento de Analytics & Tendências
**Goal:** Implementar tendências de 30 dias e drill-down por subárea conforme legado.
**Requirements:** ANLY-01, ANLY-02, ANLY-03, ANLY-04
**Deliverables:**
- Lógica de backend para cálculo de tendência (comparativo de janelas de tempo).
- UI: Indicadores de tendência (setas up/down) no Dashboard.
- UI: Breakpoints de cores atualizados.
- UI: Componente de detalhamento de Subáreas.

### Phase 17 — Sincronização de Regras & Normalização
**Goal:** Sincronizar algoritmos de revisão e normalização de dados.
**Requirements:** SYNC-01, SYNC-02, SYNC-03, SYNC-04
**Deliverables:**
- Utilitário de Normalização de Strings (backend).
- Atualização do algoritmo de Spaced Repetition (Sessions).
- Ajuste no agendamento de Flashcards.
- Botão de "Reset de Progresso" no módulo de Flashcards.

### Phase 18 — Alertas de Performance & Exportação
**Goal:** Inteligência de reforço e geração de arquivos PDF/CSV.
**Requirements:** PLAN-07, PLAN-08, PLAN-09, EXPO-01, EXPO-02
**Deliverables:**
- Sinalizadores visuais (Reforço/Teoria Ineficiente) no Plano de Aulas.
- Endpoint backend para geração de PDF (relatórios).
- Funcionalidade de download de CSV no Banco de Dados.

### Phase 19 — Gamificação & Notificações
**Goal:** Engajamento do usuário via badges e alertas in-app.
**Requirements:** GAMI-01, NOTF-01
**Deliverables:**
- Backend: Sistema de conquista de Badges.
- UI: Galeria de Badges no perfil do usuário.
- UI: Navbar notifications para revisões pendentes.

### Phase 20 — PWA & Otimização Final
**Goal:** Tornar o sistema instalável e offline-ready.
**Requirements:** PWA-01
**Deliverables:**
- Configuração de Service Worker e Manifest.json.
- Otimização de bundle size.
- Teste de instalação (Mobile/Desktop).

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-15  | v1.0      | 100%           | Shipped| 2026-05-11|
| 16    | v1.1      | 0/1            | Planned| -         |
| 17    | v1.1      | 0/1            | Planned| -         |

---
*Roadmap updated for v1.1 on 2026-05-11*
