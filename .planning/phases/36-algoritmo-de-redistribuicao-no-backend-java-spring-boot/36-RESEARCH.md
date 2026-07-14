# Phase 36: Algoritmo de Redistribuição no Backend - Research

## Domain Knowledge
The algorithm must redistribute a backlog of flashcards that have `proximaRevisao < hoje` by spreading them evenly up to a user-provided end date.

## Entity Analysis
- **User**: `com.medstudy.backend.modules.user.entity.User`
- **Flashcard**: `com.medstudy.backend.modules.flashcard.entity.Flashcard`
  - Current fields: `proximaRevisao`, `grandeArea`, `dificuldadeUltima`, etc.
  - Notably, it does not explicitly store a `tema` (topic) column, which might be needed to link to the `Lesson` for priority. It might be stored inside the JSON `frente`/`verso` or we need to map `grandeArea` to `Lesson`.
- **Lesson**: `com.medstudy.backend.modules.aula.entity.Lesson`
  - Current fields: `tema`, `grandeArea`, `prioridade` (DIAMANTE, ALTA, MEDIA, BAIXA), `percentAcerto`.
- **Settings/Inputs**: The API must receive the target `endDate` from the user to determine the redistribution window.

## Proposed Algorithm Flow
1. Fetch all overdue flashcards for the user (`proximaRevisao` < `LocalDate.now()`).
2. Fetch the corresponding lessons to determine priority and performance (`percentAcerto`).
3. Sort the overdue flashcards based on the composite priority (Lesson Priority -> Overdue Days -> Accuracy).
4. Calculate the number of days between `now()` and the `endDate`.
5. Calculate the equalized daily load (`totalOverdue / days`).
6. Distribute the flashcards into buckets (days), ensuring no day exceeds the equalized load (or filling them smoothly).
7. Update the `proximaRevisao` of each flashcard and save.

## Dependencies
- `FlashcardRepository` to find and save.
- `LessonRepository` to fetch priorities.
