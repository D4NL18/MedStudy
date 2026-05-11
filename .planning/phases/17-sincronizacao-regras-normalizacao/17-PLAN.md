# Plan: Phase 17 — Sincronização de Regras & Normalização

**Phase:** 17
**Goal:** Normalizar dados de temas/áreas e refinar algoritmos de repetição espaçada.
**Status:** In Progress
**Mode:** Standard

---

## 🏗️ Architecture & Design
- **Backend:** Spring Boot (JPA)
- **Normalizer:** Custom `StringNormalizer` using `java.text.Normalizer`.
- **Logic:** Refined `calculateNextRevision` in `StudySessionService` and `SpacedRepetitionService`.
- **Frontend:** Angular 21 with hard confirmation modal for resets.

## 📝 Tasks

### 1. Backend: Data Normalization (Infrastructure)
- [ ] **Task 1.1: Implement `StringNormalizer` Utility**
  - Create `com.medstudy.backend.core.util.StringNormalizer`.
  - Logic: Decompose Unicode, remove diacritics, trim, and apply Title Case.
  - *Files modified:* `backend/src/main/java/com/medstudy/backend/core/util/StringNormalizer.java`
- [ ] **Task 1.2: Add Lifecycle Hooks to Entities**
  - Use `@PrePersist` and `@PreUpdate` in `StudySession` and `Flashcard` to call `StringNormalizer`.
  - *Files modified:* `StudySession.java`, `Flashcard.java`
- [ ] **Task 1.3: Data Migration Script**
  - Create `V1.2__normalize_existing_data.sql` to clean existing records.
  - *Files created:* `backend/src/main/resources/db/migration/V1.2__normalize_existing_data.sql`

### 2. Backend: Logic Refinement
- [ ] **Task 2.1: Update StudySession Revision Intervals**
  - Implement the table: <50% (1d), 50-75% (3d), 75-90% (7d), >90% (15d).
  - Add `urgente` flag logic if rate < 40%.
  - *Files modified:* `StudySessionService.java`
- [ ] **Task 2.2: Implement Load-Balancing Jitter**
  - Update `SpacedRepetitionService` to calculate jitter based on existing database load in the target window (±10%).
  - Ensure integer day rounding.
  - *Files modified:* `SpacedRepetitionService.java`
- [ ] **Task 2.3: Implement Lapse Penalty**
  - Detect 3rd "HARD" or mature fail.
  - Penalize `EaseFactor` by 0.20 (min 1.30).
  - *Files modified:* `SpacedRepetitionService.java`

### 3. Backend: Progress Reset
- [ ] **Task 3.1: Create Reset Endpoint**
  - Implement `POST /api/flashcards/reset` with parameters for `grandeArea` (optional).
  - Use `@Modifying` bulk update for performance.
  - *Files modified:* `FlashcardRepository.java`, `FlashcardService.java`, `FlashcardController.java`

### 4. Frontend: UI & Safety
- [ ] **Task 4.1: Create Reset Confirmation Modal**
  - Implement component that requires typing "RESETAR" to enable the action.
  - *Files created:* `frontend/src/app/features/flashcards/components/reset-modal/...`
- [ ] **Task 4.2: Integrate Reset in Settings/List**
  - Add "Resetar Área" button to the flashcard area list/cards.
  - *Files modified:* `flashcard-list.component.html`, `flashcard.actions.ts`

---

## 🧪 Verification Plan

### Automated
- `mvn test` (Targeting `StringNormalizerTest` and `SpacedRepetitionServiceTest`).
- `npm test` (Targeting `ResetModalComponent`).

### Manual UAT
1. **Normalization:** Input "  obstetrícia  " -> Verify stored as "Obstetricia".
2. **Jitter:** Answer 5 cards -> Verify they are not all scheduled for the exact same second.
3. **Reset:** Reset "Pediatria" -> Verify only Pediatric cards are back to New state.

---

## 🚩 Threat Model
- **Performance:** Bulk reset could lock the table if not indexed properly. Ensure `user_id` and `grande_area` have an index.
- **Data Integrity:** String normalization must not lose meaning (e.g., differentiating between similar but distinct medical terms if any exist without accents).
