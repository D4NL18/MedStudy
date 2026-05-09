# Discussion Log — Phase 4: Backend: Banco de Questões (Sessões de Estudo)

## Context
- **Date**: 2026-05-06
- **Phase**: 4
- **Goal**: Clarify implementation details for study sessions and dashboard metrics.

## Areas Discussed

### 1. Dynamic Filtering
- **Options presented**: JPA Specifications vs simple JPQL.
- **User selection**: JPA Specifications.
- **Notes**: User wants full flexibility for combined filters (Area + Topic + Performance).

### 2. Revision Logic
- **Options presented**: Fixed vs Performance-based vs Legacy.
- **User selection**: Legacy (Extract from existing JS code).
- **Extracted Logic**:
  - <= 65%: 3 days
  - 65-75%: 5 days
  - 75-85%: 10 days
  - > 85%: 20 days
- **Notes**: This will be implemented in `StudySessionService`.

### 3. Dashboard Metrics
- **Options presented**: Legacy KPIs + new Critical Revisions and Streak.
- **User selection**: All + Legacy metrics.
- **Metrics to implement**: taxaGlobal, feitasMes/Ano, areaForte/Fraca, progressoCurso, streakDias, and revisoesCriticas.

## Deferred Ideas
- CSV/PDF Export.
- Advanced Analytics Charts (Radar/Heatmap).
