# Research: Phase 4 — Backend: Banco de Questões (Sessões de Estudo)

## Implementation Strategy

### 1. Dynamic Filtering (JPA Specifications)
To fulfill `BNCO-05` and `BNCO-06`, we will use `JpaSpecificationExecutor`. This allows us to build complex queries dynamically based on optional request parameters.

- **Key Specs**:
  - `grandeArea`: Exact match.
  - `tema`: Case-insensitive partial match (`ILIKE`).
  - `instituicao`: Case-insensitive partial match (`ILIKE`).
  - `performanceRange`: Calculated as `(qtsCorretas / qtsFeitas) * 100` using CriteriaBuilder expressions.
  - `revisaoConcluida`: Boolean match.

### 2. Automated Revision Scheduling
The backend will handle the calculation of `data_proxima_revisao` using the logic extracted from the legacy frontend:
- **Calculation Rule**:
  - Hits ≤ 65% → Session Date + 3 days
  - 65% < Hits ≤ 75% → Session Date + 5 days
  - 75% < Hits ≤ 85% → Session Date + 10 days
  - Hits > 85% → Session Date + 20 days
- **Edge Case**: If `qtsFeitas` is 0, the date will be null (though validation should prevent this).

### 3. Metrics Aggregation
The `/api/study-sessions/metrics` endpoint will return a summary of the user's performance:
- **Total Sessions**: `COUNT(*)`
- **Total Questions**: `SUM(qtsFeitas)`
- **Success Rate**: `(SUM(qtsCorretas) / SUM(qtsFeitas)) * 100`
- **Critical Revisions**: `COUNT(*)` where `data_proxima_revisao < TODAY` and `revisao_concluida = false`.

### 4. Streak Calculation (Consecutive Days)
To calculate the "Streak" (BNCO-07 / DASH-06):
1. Fetch distinct `data_sessao` for the user, ordered descending.
2. If the most recent date is not TODAY or YESTERDAY, streak is 0.
3. Iterate through the dates: if the gap between `date[i]` and `date[i+1]` is exactly 1 day, increment streak. Stop at the first gap > 1 day.

## Technical Landmines
- **Division by Zero**: Metrics calculation must handle cases where `qtsFeitas` is 0 across all sessions.
- **Timezones**: Ensure `data_sessao` (LocalDate) is handled consistently between the frontend and database to avoid "off-by-one-day" errors.
- **Performance**: As the number of sessions grows, calculating global success rates via `SUM` queries on every request might be heavy. For v1, JPA/JPQL is sufficient, but consider indexing `user_id` and `data_sessao`.

## References
- `StudySession.java`: Already contains basic fields.
- `LessonRepository`: Needed for course progress calculation in Phase 6 (and partially in Phase 4 metrics).
- `SecurityContext`: Used to retrieve the current `User` and ensure data isolation.
