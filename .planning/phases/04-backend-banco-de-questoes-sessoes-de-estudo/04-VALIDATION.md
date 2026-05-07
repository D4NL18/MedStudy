# Validation Strategy — Phase 4: Backend: Banco de Questões (Sessões de Estudo)

## Phase Goals
Implement the CRUD and business logic for Study Sessions, ensuring correct performance tracking and revision scheduling.

## UAT Test Cases

### 1. Create Session & Auto-Schedule Revision
- **Action**: POST `/api/study-sessions` with `qts_feitas=10`, `qts_corretas=9` (90%), `data_sessao="2026-05-01"`.
- **Assertion**: Response 201. `data_proxima_revisao` should be `2026-05-21` (+20 days).

### 2. Validation: Corrects > Total
- **Action**: POST `/api/study-sessions` with `qts_feitas=10`, `qts_corretas=11`.
- **Assertion**: Response 400 Bad Request with error message.

### 3. Filter by Area & Text
- **Action**: GET `/api/study-sessions?grandeArea=Cirurgia&tema=Apendicite`.
- **Assertion**: Only returns sessions in "Cirurgia" with "Apendicite" in the topic name.

### 4. Filter by Performance Range
- **Action**: GET `/api/study-sessions?minSuccessRate=80`.
- **Assertion**: Returns only sessions where `(corretas/feitas) >= 0.8`.

### 5. Metrics Endpoint Accuracy
- **Action**: Create 2 sessions (10/10 and 0/10). Call GET `/api/study-sessions/metrics`.
- **Assertion**: `taxaGlobal` should be 50%. `totalQuestoes` should be 20.

### 6. Data Isolation
- **Action**: User A creates a session. User B attempts to GET/PUT/DELETE User A's session.
- **Assertion**: Response 404 or 403. User B should only see their own sessions.

### 7. Swagger Documentation
- **Action**: Access `/api/docs`.
- **Assertion**: All StudySession endpoints are listed and well-documented with appropriate DTO schemas.
