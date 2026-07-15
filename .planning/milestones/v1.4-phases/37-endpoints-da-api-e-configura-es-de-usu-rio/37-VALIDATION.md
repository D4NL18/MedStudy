# Phase 37 Validation Strategy

## Core Validation Goals
1. Verify `UserSettings` can be updated and persisted correctly.
2. Verify `POST /redistribute/preview` returns a valid draft ID and correctly calculates warnings if limits are breached.
3. Verify `POST /redistribute/apply` correctly updates flashcards using the stored draft data and deletes the draft.

## Testing Strategy
- Unit tests for `UserSettingsController` and `FlashcardRedistributionController`.
- Integration test for `FlashcardRedistributionService` draft saving/applying.
