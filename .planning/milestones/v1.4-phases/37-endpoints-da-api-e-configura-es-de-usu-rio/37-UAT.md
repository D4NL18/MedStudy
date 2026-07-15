---
status: complete
phase: 37-endpoints-da-api-e-configura-es-de-usu-rio
source: [.planning/phases/37-endpoints-da-api-e-configura-es-de-usu-rio/37-SUMMARY.md]
started: 2026-07-13T21:14:15Z
updated: 2026-07-13T21:14:15Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 4
name: Redistribute Apply
expected: |
  Sending a POST request to /api/redistribute/apply/{draftId} takes the draft UUID and applies the cached dates to the flashcards successfully.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: pass

### 2. Update User Settings
expected: Sending a PUT request to /api/user-settings with max_reviews_per_day and theme_color successfully returns the updated configurations and persists them.
result: pass

### 3. Redistribute Preview
expected: Sending a POST request to /api/redistribute/preview with targetEndDate returns a valid UUID draftId and warningLimitExceeded flag.
result: pass

### 4. Redistribute Apply
expected: Sending a POST request to /api/redistribute/apply/{draftId} takes the draft UUID and applies the cached dates to the flashcards successfully.
result: pending

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Gaps

