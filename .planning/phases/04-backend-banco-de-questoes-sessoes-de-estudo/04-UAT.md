---
status: complete
phase: 04-backend-banco-de-questoes-sessoes-de-estudo
source: [04-SUMMARY.md]
started: 2026-05-07T10:33:45Z
updated: 2026-05-07T10:33:45Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: |
  Start the application with `docker-compose up -d` and `./mvnw spring-boot:run`.
  The application should boot without errors and connect to the PostgreSQL database on port 5433.
result: pass

### 2. Create Session & Auto-Schedule
expected: |
  POST a session to `/api/study-sessions` with 10 questions and 9 correct (90%).
  The response should be 201 Created and `dataProximaRevisao` should be exactly 20 days after the session date.
result: pass

### 3. Filter Sessions by Area and Success Rate
expected: |
  GET `/api/study-sessions?grandeArea=Cirurgia&minRate=80`.
  The API should return only sessions belonging to "Cirurgia" with at least 80% success rate.
result: pass

### 4. Metrics Accuracy
expected: |
  GET `/api/study-sessions/metrics`.
  The API should return correct `totalSessoes`, `mediaAcertos`, and `streakAtual` based on the data in the database.
result: pass

### 5. Swagger Documentation
expected: |
  Access `http://localhost:8080/api/docs`.
  All Study Session endpoints (CRUD + Metrics) should be listed and documented.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
