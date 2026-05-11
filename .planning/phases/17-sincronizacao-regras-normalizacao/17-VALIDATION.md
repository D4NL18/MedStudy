# Validation Strategy: Phase 17 — Sincronização de Regras & Normalização

**Phase:** 17
**Date:** 2026-05-11

## 1. Unit Tests (Backend)
- `StringNormalizerTest`:
  - Input: `"  pediatria  "` -> Output: `"Pediatria"`
  - Input: `"Obstetrícia"` -> Output: `"Obstetricia"` (for comparison)
  - Input: `"CLÍNICA médica"` -> Output: `"Clinica Medica"`
- `StudySessionServiceTest`:
  - Verify `calculateNextRevision` mapping accuracy rates to correct days.
  - Verify `urgente` flag is set when success < 40%.
- `SpacedRepetitionServiceTest`:
  - Verify `EaseFactor` reduction on lapse (0.20 penalty).
  - Verify Jitter logic chooses the day with the lowest load in a ±10% window.

## 2. Integration Tests (Backend)
- `FlashcardControllerTest`:
  - Verify `POST /api/flashcards/reset` resets progress only for the specified area and user.
  - Verify bulk update efficiency (count query before/after).

## 3. UI Tests (Frontend)
- `FlashcardResetComponentTest`:
  - Verify the "RESETAR" string confirmation works as expected.
  - Verify the reset button is disabled until the correct string is typed.

## 4. Manual UAT
1. **Normalization Smoke Test:** Create a session with messy casing and accents; check if it displays cleaned in the list.
2. **Jitter Stability:** Answer 10 cards in a row and verify if they are spread across different days/times rather than all at the same second.
3. **Reset Safety:** Try to reset an area with the wrong confirmation string; verify it fails.
