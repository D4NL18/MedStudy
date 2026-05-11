---
phase: 11-frontend-plano-revisao-flashcards
status: discussed
updated: 2026-05-07T22:09:00Z
---

# Phase 11 Context: Frontend: Plano de Aulas, Revisão & Flashcards

## Domain Boundary
Implementation of the education planning, revision management, and flashcard study modules. This phase covers the UI and state management (NgRx) for tracking lessons, spaced repetition intervals, and the interactive flashcard learning experience with flip animations and difficulty rating.

## Implementation Decisions

### 1. Flashcard Study Experience
- **Focused Mode:** Study sessions will trigger an overlay/modal focus mode that dims the background to minimize distractions.
- **Mobile-First Controls:** Large action buttons at the bottom of the screen for difficulty evaluation (Fácil, Médio, Difícil) to ensure ergonomic usage on mobile/tablets and quick mouse access on desktop.
- **Flip Animation:** CSS-based 3D flip animation for the cards.

### 2. Revision Layout
- **Tabs Organization:** The revision screen will use a tabbed interface to separate content into four logical categories: **Atrasadas**, **Hoje**, **Futuras**, and **Realizadas**. This keeps the UI clean and helps the user prioritize immediate tasks.

### 3. Lesson Plan (Plano de Aulas) Priorities
- **Visual Indicators:** Priorities (Diamante, Alta, Média, Baixa) will be distinguished using both specific colors and icons. 
- **Diamond Priority:** Special visual emphasis (e.g., purple/glow effect) to highlight the most critical lessons.

### 4. Content & Editing
- **Markdown Support:** Both Flashcards (Front/Back) and Lesson notes will support Markdown rendering.
- **Rich Media & Ctrl+V:** Markdown implementation **MUST** support embedded images. Crucially, the editor must allow **pasting images directly (Ctrl+V)**, converting them to inline Markdown (Base64) to allow fast card creation without manual URL handling.
- **Forms:** Use Modals for creating/editing lessons and flashcards, following the pattern established in Phase 10.

## Canonical Refs
- `.planning/ROADMAP.md` (Phase 11)
- `.planning/REQUIREMENTS.md` (PLAN-01..06, REVI-01..07, FLSH-01..08)
- `frontend/src/app/shared/components/modal-layout/` (Base for modals)

## Code Context
- **NgRx:** 3 new feature states: `planoAulas`, `revisao`, and `flashcards`.
- **Styling:** Use `var(--color-...)` variables for all priority colors to ensure theme compatibility.
- **Assets:** Icons should be sourced from the project's standard icon set (e.g., Lucide/Bootstrap Icons).
