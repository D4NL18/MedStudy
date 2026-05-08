# Summary: Plan 11-01-01 — Infrastructure & State (NgRx)

## Key Changes
Implemented the NgRx state management and core services for Study Plan, Revisions, and Flashcards features.

### Infrastructure
- **Models:** Created `lesson.model.ts`, `revision.model.ts`, and `flashcard.model.ts` matching backend DTOs.
- **Services:**
  - `LessonService`: Lesson list and assisted toggle.
  - `RevisionService`: Summary counts and session listing by category.
  - `FlashcardService`: Study queue, rating submission, and CRUD.

### NgRx Features
- **StudyPlan:**
  - Full CRUD state for lessons.
  - Effect for toggling assisted status.
- **Revision:**
  - Categorized state for Atrasadas, Hoje, Futuras, and Concluidas.
  - Real-time summary updates.
- **Flashcards:**
  - Focused study session state (queue management, indexing).
  - Post-rating effect to refresh revision summary.

## Verification Results
- Models verified against Java records in backend.
- Actions and Reducers implemented following standalone feature pattern.
- State slices organized for modularity.

## Next Steps
Proceed to **Wave 2: Components & Layout** to build the user interfaces for these features.
