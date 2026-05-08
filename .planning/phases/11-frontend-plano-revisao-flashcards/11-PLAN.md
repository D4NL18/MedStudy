# Plan: Phase 11 — Frontend: Plano de Aulas, Revisão & Flashcards

## Overview
Implement the frontend interfaces and state management for lesson planning, interval revisions, and flashcard study sessions. This phase focuses on premium UI/UX, including 3D animations, Markdown support, and ergonomic controls.

## 🌊 Wave 1: Infrastructure & State (NgRx)
*Goal: Establish the data backbone and services.*

### [11-01-01] NgRx Feature: StudyPlan
- Define actions, reducer, effects, and selectors for lesson CRUD and status management.
- **Requirement:** PLAN-01, PLAN-02.
- **Verification:** Unit tests for reducer state transitions.

### [11-01-02] NgRx Feature: Revision
- Define state for the 4 revision categories (Atrasadas, Hoje, Futuras, Realizadas).
- Implement selectors to filter sessions based on `data_proxima_revisao`.
- **Requirement:** REVI-01, REVI-02.
- **Verification:** Selector tests with mocked session dates.

### [11-01-03] NgRx Feature: Flashcards
- Define state for the study session: current card, deck queue, and rating results.
- **Requirement:** FLSH-01, FLSH-02.
- **Verification:** Effect tests for loading the "Study Today" queue.

### [11-01-04] Service: FlashcardDataService
- Implement HTTP calls for flashcard CRUD and rating PATCH.
- **Requirement:** FLSH-05, FLSH-06.

---

## 🌊 Wave 2: Components & Layout (Standard Features)
*Goal: Build the lesson table and revision tabs following UI-SPEC.*

### [11-02-01] UI: LessonPlanComponent
- Create table with 8px grid and Outfit/Inter fonts.
- Implement priority icons and colors.
- **Diamond Highlighting:** Special gradient and glow effect as per UI-SPEC.
- **Requirement:** PLAN-03, PLAN-05, PLAN-06.
- **Verification:** Visual check against UI-SPEC.

### [11-02-02] UI: RevisionTabsComponent
- Implement sliding tabs for the 4 revision states.
- Add dynamic counter badges (Red Pulse for Atrasadas, Solid Green for Hoje).
- **Requirement:** REVI-03, REVI-04, REVI-07.
- **Verification:** Verify tab switching and counter updates.

### [11-02-03] Shared: MarkdownRendererComponent
- Integrate `ngx-markdown` and configure `provideMarkdown()`.
- Ensure theme compatibility for text colors.

---

## 🌊 Wave 3: Study Mode & Advanced Interactions
*Goal: High-fidelity study experience and image pasting.*

### [11-03-01] UI: FlashcardStudyOverlay
- Create the focused mode overlay with blur background.
- Implement the "Mobile-first" large action buttons at the bottom.
- **Requirement:** FLSH-04, FLSH-05.
- **Verification:** Responsive testing on small viewports.

### [11-03-02] Interaction: 3D Flip Card
- Implement CSS 3D transform logic (`rotateY`, `backface-visibility`).
- Bind "Girar" action to the flip state.
- **Requirement:** FLSH-04.
- **Verification:** Manual check of animation smoothness (600ms).

### [11-03-03] Feature: Ctrl+V Image Paste
- Add `(paste)` listener to the flashcard editor textarea.
- Logic: Intercept, convert File to Base64, and insert `![image](data:...)`.
- **Requirement:** Essential for V1 (User Constraint).
- **Verification:** Manual UAT: Copy an image, Paste in editor, see Markdown string.

---

## 🌊 Wave 4: Integration & UAT
*Goal: End-to-end flow validation.*

### [11-04-01] Flow: Revision to Study Mode
- Connect "Revisar Agora" buttons in Revision tabs to the Flashcard Study overlay.
- Ensure state updates correctly after rating a card.

### [11-04-02] Final Polish
- Apply micro-animations to priority badges and tab transitions.
- Audit spacing compliance (8px grid).

### [11-04-03] Verification Session
- Run full Karma test suite.
- Perform manual UAT walkthrough.
