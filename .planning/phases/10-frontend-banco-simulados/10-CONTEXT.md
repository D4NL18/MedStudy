---
phase: 10-frontend-banco-simulados
status: discussed
updated: 2026-05-07T19:32:00Z
---

# Phase 10 Context: Frontend: Banco de Dados & Simulados

## Domain Boundary
Implementation of the Study Sessions (Banco de Dados) and Mock Exams (Simulados) management interfaces. This includes listing, filtering, creating, editing, and deleting entries, integrated with the backend via NgRx.

## Implementation Decisions

### UI/UX & Layout
- **Forms:** Both Study Sessions and Simulados will use **Modals** for Create/Edit operations to maintain context.
- **Filters:** A **top bar (Barra Superior)** will be used for filters and search, keeping them always visible and accessible.
- **Table Navigation:** **Infinite Scroll** implementation for all main tables to provide a modern and fluid experience.

### Module Specifics
- **Simulados Form:** A **single vertical form** within the modal to allow quick entry of results for all 5 medical areas (Surgery, Pediatrics, etc.) without step-based navigation.
- **Feedback:** Success/Error notifications (Toasts) should be used for CRUD operations (standardized in Phase 8).

## Canonical Refs
- `.planning/ROADMAP.md` (Phase 10)
- `.planning/REQUIREMENTS.md` (BNCO-01..07, SIML-01..06)
- `frontend/src/app/shared/components/` (Check for reusable Modal/Input patterns)

## Code Context
- Reusable `glass` effect and `var(--color-border)` variables from Phase 9.
- NgRx pattern: `Actions` -> `Effects` -> `Service` -> `Reducer` -> `Selectors` (already established in Phase 8/9).
