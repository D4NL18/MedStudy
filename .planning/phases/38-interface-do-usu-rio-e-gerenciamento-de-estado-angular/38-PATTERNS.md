# Phase 38 Patterns: Interface do Usuário e Gerenciamento de Estado (Angular)

## Mapped Files & Analogs

### 1. Reorganize Modal Component
**File to create:** src/app/features/revisao/components/reorganize-modal/reorganize-modal.component.ts
**Role:** Modal UI for previewing and confirming the redistribution.
**Analog:** src/app/features/flashcards/components/reset-modal/flashcard-reset-modal.component.ts
**Pattern:**
- Use Angular Standalone Component.
- @Input for visibility.
- @Output for confirm/cancel actions.
- Uses lucide-icon for icons.

### 2. NgRx Actions, Reducers, Effects
**Files to modify:** src/app/store/revision/*
**Role:** State management for redistribution draft.
**Pattern:**
- Action groups via createActionGroup.
- Reducer via createReducer with on listeners.
- createEffect for API calls, using switchMap, catchError.

### 3. Service
**File to create/modify:** src/app/core/services/revision.service.ts (or create edistribution.service.ts)
**Role:** Make API calls for preview and apply endpoints.
**Pattern:**
- @Injectable({ providedIn: 'root' })
- HttpClient injected.
- Returns Observables of the response models.
