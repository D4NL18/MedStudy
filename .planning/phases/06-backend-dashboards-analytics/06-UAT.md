status: complete
phase: 06-backend-dashboards-analytics
source: [06-WALKTHROUGH.md]
started: 2026-05-07T14:35:00Z
updated: 2026-05-07T14:41:40Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 5
name: Filtros de Período
expected: |
  Testar o parâmetro ?period=LAST_30_DAYS e verificar se os totais de questões mudam conforme o filtro (ou se a query executa sem erros).
awaiting: user response

[testing complete]

## Tests

### 1. Dashboard KPIs (Sessions & Simulados)
expected: Chamar GET /api/dashboard e verificar se os objetos 'sessions' e 'simulados' retornam métricas consistentes.
result: pass

### 2. Algoritmo de Streak
expected: Verificar se o campo 'currentStreak' reflete corretamente a consecutividade de dias de estudo.
result: pass

### 3. Analytics por Área (Trend)
expected: Chamar GET /api/analytics/areas e verificar se 'trendRate' (últimos 7 dias) é calculado separadamente do 'successRate'.
result: pass

### 4. Analytics por Tema
expected: Chamar GET /api/analytics/topics e verificar se o agrupamento por tema e área está correto.
result: pass

### 5. Filtros de Período
expected: Testar o parâmetro ?period=LAST_30_DAYS e verificar se os totais de questões mudam conforme o filtro.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps
### Gap 1: ClassCastException in AnalyticsService
- Issue: Inconsistent Object[] indices between Area and Topic queries caused String-to-Long cast error.
- Diagnosis: calculateTrend was hardcoded to index 1, but Topic query has Area name at index 1.
- Fix: Parameterized valueIndex in calculateTrend and used safe ((Number) row[i]).longValue() casting.
- Status: Closed. Fixed and verified.
