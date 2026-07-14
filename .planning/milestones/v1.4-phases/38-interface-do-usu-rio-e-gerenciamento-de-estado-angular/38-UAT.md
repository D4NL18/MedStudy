---
status: complete
phase: 38-interface-do-usu-rio-e-gerenciamento-de-estado-angular
source: [.planning/phases/38-interface-do-usu-rio-e-gerenciamento-de-estado-angular/38-SUMMARY.md]
started: 2026-07-14T01:17:15Z
updated: 2026-07-14T01:21:45Z
---

## Current Test

[testing complete]

## Tests

### 1. Reorganizar Atrasos Button Visibility
expected: The "Reorganizar Atrasos" button is displayed on the Revisão list page ONLY when there are overdue revisions (Revisões Atrasadas > 0).
result: issue
reported: "o botão deve aparecer sempre, nao só quando tem atrasos"
severity: major

### 2. Open Reorganize Modal
expected: Clicking the "Reorganizar Atrasos" button opens the reorganization modal containing a date picker.
result: issue
reported: "o botão deve aparecer sempre, nao só quando tem atrasos"
severity: major

### 3. Date Preview
expected: Typing/selecting a valid future date in the modal triggers a preview, showing how the overdue sessions will be redistributed across the days.
result: pass

### 4. Apply Redistribution
expected: Clicking "Confirmar" applies the redistribution, closes the modal, and the overdue sessions disappear from the "Revisões Atrasadas" list since they are now scheduled for future dates.
result: pass

## Summary

total: 4
passed: 2
issues: 2
pending: 0
skipped: 0

## Gaps

- truth: "The \"Reorganizar Atrasos\" button is displayed on the Revisão list page ONLY when there are overdue revisions (Revisões Atrasadas > 0)."
  status: failed
  reason: "User reported: o botão deve aparecer sempre, nao só quando tem atrasos"
  severity: major
  test: 1
  artifacts: []
  missing: []

- truth: "Clicking the \"Reorganizar Atrasos\" button opens the reorganization modal containing a date picker."
  status: failed
  reason: "User reported: o botão deve aparecer sempre, nao só quando tem atrasos"
  severity: major
  test: 2
  artifacts: []
  missing: []
