# Phase 37 Research: Endpoints da API e Configurações de Usuário

## Domain Overview
This phase introduces the API layer for the flashcard redistribution algorithm developed in Phase 36. It includes saving user preferences for redistribution limits and the execution of the redistribution preview and apply flows.

## What I Learned
1. **User Settings**: The `User` entity exists and has no linked preferences table. To satisfy the decision from CONTEXT.md, we will create a `UserSettings` entity with a `@OneToOne` relationship to `User`, containing fields like `maxReviewsPerDay`.
2. **Draft Storage**: We need to store the preview draft. Since Redis is out of scope for now (per project decisions), we will create a `RedistributionDraft` JPA entity to store the calculated preview result (as JSON or structured data) and return its UUID to the frontend.
3. **Endpoints**:
   - `GET /api/v1/user-settings`: Fetch current max reviews per day limit.
   - `PUT /api/v1/user-settings`: Update user settings.
   - `POST /api/v1/redistribute/preview`: Triggers the algorithm (from Phase 36), saves the draft, and returns the draft ID and preview data. If the max reviews per day limit causes the target date to be breached, it includes a warning flag.
   - `POST /api/v1/redistribute/apply/{draftId}`: Retrieves the draft and actually updates the flashcards' `proximaRevisao` dates in the database.

## Technical Approach
- Create `UserSettings` entity and `UserSettingsRepository`.
- Create `RedistributionDraft` entity (with a `userId`, `draftData` (JSON string), `createdAt`).
- Create `FlashcardRedistributionController`.
- Create `UserSettingsController`.
- Implement draft saving and applying logic in `FlashcardRedistributionService`.

## Dependencies
- `FlashcardRedistributionService` from Phase 36.
- Liquibase migration script to add `user_settings` and `redistribution_drafts` tables.
