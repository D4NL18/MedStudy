# Plan: Phase 4 — Backend: Banco de Questões (Sessões de Estudo)

## 0. Technical Objective
Implement the complete CRUD for study sessions with dynamic filtering (JPA Specifications), automated revision scheduling based on legacy performance rules, and a comprehensive metrics endpoint for the dashboard.

## 1. Task Breakdown

### Infrastructure & Repository
- [ ] **Task 1.1**: Update `StudySessionRepository` to extend `JpaSpecificationExecutor<StudySession>`.
- [ ] **Task 1.2**: Create `StudySessionSpecifications` utility class to handle dynamic filtering for:
  - `grandeArea`, `tema` (ILIKE), `instituicao` (ILIKE), `revisaoConcluida`, and `successRateRange`.

### DTOs & Mappers
- [ ] **Task 2.1**: Update `StudySessionResponse` to include all entity fields (if missing).
- [ ] **Task 2.2**: Create `StudySessionMetricsResponse` (Java Record) to hold aggregate performance data.

### Business Logic (Service)
- [ ] **Task 3.1**: Implement `StudySessionService.createSession()`:
  - Validate `qtsCorretas <= qtsFeitas`.
  - Calculate `dataProximaRevisao` based on legacy logic (+3, +5, +10, or +20 days).
  - Associate session with the currently authenticated user.
- [ ] **Task 3.2**: Implement `StudySessionService.findAll()` with pagination and Specifications.
- [ ] **Task 3.3**: Implement `StudySessionService.updateSession()`, `deleteSession()`, and `getById()`.
- [ ] **Task 3.4**: Implement `StudySessionService.getMetrics()`:
  - Total sessions, total questions, global success rate.
  - Count of critical revisions (past due and not completed).
  - Streak calculation (consecutive days).

### API Layer (Controller)
- [ ] **Task 4.1**: Implement `StudySessionController` endpoints:
  - `GET /api/study-sessions` (Paginated list with filters).
  - `GET /api/study-sessions/{id}`.
  - `POST /api/study-sessions`.
  - `PUT /api/study-sessions/{id}`.
  - `DELETE /api/study-sessions/{id}`.
  - `GET /api/study-sessions/metrics`.
- [ ] **Task 4.2**: Ensure all endpoints are protected and filtered by the authenticated user's ID.

### Documentation & Verification
- [ ] **Task 5.1**: Verify Swagger UI (/api/docs) for correct endpoint documentation.
- [ ] **Task 5.2**: Execute UAT Test Cases (CRUD, Filtering, Logic, Metrics).

## 2. Threat Model
- **Data Leakage**: Sessions must be filtered by `userId` in every query (Repository/Service layer).
- **Insecure Direct Object Reference (IDOR)**: `GET/PUT/DELETE` by ID must verify that the session belongs to the authenticated user.
- **Business Logic Flaw**: `qtsCorretas > qtsFeitas` could lead to > 100% success rates; must be blocked.
- **SQL Injection**: Prevented by using JPA Specifications and Criteria API (parametrized).

## 3. Verification Plan
- **Manual Verification**: Test all endpoints via Swagger or Postman.
- **UAT**: Run the 7 test cases defined in `04-VALIDATION.md`.
