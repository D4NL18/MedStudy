# Context — Phase 06: Backend - Dashboards & Analytics

## Domain Boundary
Agregação de dados de performance e estatísticas de uso para visualização no Dashboard e telas de Análise (Área/Tema).

## Decisions

### 1. Estrutura do Dashboard
- O dashboard retornará métricas isoladas para permitir comparação:
    - `sessaoMetrics`: totalSessions, totalQuestions, successRate, currentStreak.
    - `simuladoMetrics`: totalSimulados, averageScore, bestArea, worstArea.
- O campo `performanceLevel` será calculado no backend:
    - `LOW`: < 70%
    - `MEDIUM`: 70% - 80%
    - `HIGH`: > 80%

### 2. Analytics e Evolução
- Os endpoints de análise por área/tema incluirão:
    - `successRate`: Performance histórica total.
    - `trendRate`: Performance nos últimos 7 dias.
    - `totalQuestions`: Volume de dados processados.

### 3. Filtros Temporais (Períodos Fixos)
- Parâmetro `period` aceitará: `LAST_7_DAYS`, `LAST_30_DAYS`, `CURRENT_YEAR`, `TOTAL`.
- Não haverá suporte para `startDate` / `endDate` customizados nesta fase.

### 4. Reuso de Lógica
- A lógica de Streak será migrada/centralizada para o `DashboardService`.
- Uso de `JPA Projections` ou `DTOs` de agregação para otimizar queries de performance (evitar carregar todas as entidades em memória).

## Canonical Refs
- [ROADMAP.md](file:///c:/Users/PC/Documents/GitHub/MedStudy/.planning/ROADMAP.md)
- [REQUIREMENTS.md](file:///c:/Users/PC/Documents/GitHub/MedStudy/.planning/REQUIREMENTS.md) (DASH-01..10, AREA-01..03, TEMA-01..03)

## Deferred Ideas
- Gráficos de linha históricos (série temporal dia a dia) — será avaliado na fase de UI se houver necessidade de dados brutos para D3/Chart.js.
