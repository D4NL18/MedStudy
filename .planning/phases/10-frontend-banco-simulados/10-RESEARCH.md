# Research: Phase 10 - Frontend: Banco de Dados & Simulados

## Overview
This document outlines the technical approach for implementing the Banco de Dados (Question Database) and Simulados (Mock Exams) modules, focusing on infinite scroll tables, modal-based CRUD, and complex form validation.

## Technical Approach

### Infinite Scroll
- **Pattern:** Custom Intersection Observer implementation.
- **Rationale:** Provides a "modern and fluid" experience as requested in Phase 10. It is more flexible than CDK Virtual Scroll for variable-height rows (e.g., sessions with long themes/institution names) and simpler to integrate with NgRx pagination.
- **Implementation:** A "Sentinel" element at the bottom of the table list will trigger a `loadMore` action when it enters the viewport.

### Modals & Forms
- **Library:** Angular Material `MatDialog`.
- **Scrolling:** Use `mat-dialog-content` to handle overflow for long forms (especially for Simulados).
- **Architecture:** Reactive Forms with nested `FormGroup`s to organize the 5 medical areas for Simulados.
- **UX:** Modal-based creation allows users to log sessions/exams without losing the context of the main list.

### NgRx Data Flow
- **State Structure:** 
  ```typescript
  interface State {
    ids: string[];
    entities: Dictionary<Item>;
    currentPage: number;
    totalCount: number;
    loading: boolean;
    filters: FilterCriteria;
  }
  ```
- **Sync Logic:** 
  - `LoadNextPage` action appends results using `adapter.addMany`.
  - `UpdateFilters` action resets `currentPage` to 1 and clears existing entities before fetching.
- **Concurrency:** Guard actions with a `loading` selector to prevent duplicate requests during rapid scrolling.

## Dependencies
- `@angular/cdk`: For Dialogs and accessibility.
- `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`: For state management.

## Patterns to Reuse
- **Filter Bar:** Standardized top-bar component layout.
- **Error Handling:** Centralized interceptors for API errors during pagination.
- **Theme Variables:** Use `--color-bg`, `--color-surface`, and `--color-text` for the table rows.

## Potential Landmines
- **Scroll Memory:** Ensure the table maintains scroll position when a modal is opened and closed.
- **Duplicate Loads:** Intersection Observer might trigger multiple times if not debounced or guarded by state.
- **Mobile View:** Vertical forms in modals must be fully responsive and touch-friendly.

## Validation Architecture (Nyquist) - MANDATORY
- **Infinite Scroll Verification:**
  - Verify that `loadMore` is dispatched when the user reaches the bottom of the list.
  - Verify that the loading spinner appears only during active requests.
- **Simulado Form Verification:**
  - Verify that `acertos` cannot exceed `totais` for any of the 5 areas (Cirurgia, Pediatria, etc.).
  - Verify that the "Total Score" updates instantly as individual fields are filled.
- **Modal Data Verification:**
  - Verify that clicking "Cancel" discards changes and "Save" dispatches the correct payload to NgRx.
  - Verify that the modal closes automatically on successful save.
