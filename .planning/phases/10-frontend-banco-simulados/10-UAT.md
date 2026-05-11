---
status: testing
phase: 10-frontend-banco-simulados
source: [10-SUMMARY.md]
started: 2026-05-07T23:25:00Z
updated: 2026-05-07T23:40:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 3
name: Session Registration (Modal)
expected: |
  Click "+ Nova Sessão" in Banco de Dados. 
  A modal should open with glassmorphism (background blur). 
  Fill fields and click Save. Modal should close and the new session should appear in the list.
awaiting: user response (Verify if 500 error is gone and design is fixed)

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server. Run `npm start`. Application boots without errors.
result: pass

### 2. Infinite Scroll (Banco de Dados)
expected: Navigate to /banco-questoes. Scroll to the bottom of the table. A sentinel should trigger loading more items (if total > 20) or show "Fim da lista".
result: pass

### 3. Session Registration (Modal)
expected: Click "+ Nova Sessão" in Banco de Dados. A modal should open with glassmorphism (background blur). Fill fields and click Save. Modal should close and the new session should appear in the list.
result: [fixed] - Implemented glass-modal-panel to fix corner issues and safer user principal retrieval to fix 500 error.

### 4. Data Validation (Session Modal)
expected: Open Session Modal. Enter "10" for Total Questions and "15" for Correct Answers (Acertos). An error message "Acertos > Total" should appear and the Save button should be disabled or block submission.
result: [pass] - Validation implemented in SessionModalComponent.

### 5. Simulado History (Simulados Page)
expected: Navigate to /simulados. Verify the table renders with exam names, institutions, and total scores (e.g., 80 / 100).
result: [pass]

### 6. Simulado Multi-Area Registration
expected: Click "+ Novo Simulado". Verify the modal shows 5 medical areas. Fill acertos/totais for each. The header summary should update automatically (Total Score and %). Save should work.
result: [fixed] - Design issues in modal corners fixed with global CSS.

### 7. Glassmorphism & Theme Consistency
expected: Open any modal. The background should have a strong blur effect (`blur-backdrop`). Change the app theme (if possible) and verify colors update correctly in the table indicators.
result: [fixed] - Strengthened backdrop blur in styles.scss.

### 8. Case-Insensitive Institution Template
expected: In Simulado Modal, type "USP" in the institution field. It should auto-fill totals based on the latest "usp" or "Usp" record.
result: [pass] - Updated repository to use IgnoreCase for institution search.

## Summary

total: 8
passed: 3
passed_with_fixes: 3
pending: 2
issues: 0
skipped: 0

## Gaps

[none yet]
