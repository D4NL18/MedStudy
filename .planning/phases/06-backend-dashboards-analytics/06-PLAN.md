# Implementation Plan — Phase 06: Dashboards & Analytics

## Goal
Implementar os serviços e controllers de agregação para fornecer métricas de desempenho e estatísticas de uso.

## Proposed Changes

### 1. DTOs de Resposta
- `DashboardResponse`: Consolidado de sessões e simulados.
- `AreaAnalyticsResponse`: Métricas por área médica.
- `TopicAnalyticsResponse`: Métricas por tema específico.

### 2. Dashboard Module
#### [NEW] [DashboardService.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/dashboard/service/DashboardService.java)
- Lógica de agregação de KPIs globais.
- Centralização do algoritmo de Streak.
- Integração de dados de `StudySession` e `Simulado`.

#### [NEW] [DashboardController.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/dashboard/controller/DashboardController.java)
- Endpoint `GET /api/dashboard`.

### 3. Analytics Module
#### [NEW] [AnalyticsService.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/analytics/service/AnalyticsService.java)
- Agregação por Área (`grandeArea`).
- Agregação por Tema (`tema`).
- Cálculo de `trendRate` (últimos 7 dias).

#### [NEW] [AnalyticsController.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/analytics/controller/AnalyticsController.java)
- Endpoints `GET /api/analytics/areas` e `GET /api/analytics/topics`.

### 4. Database Optimization
#### [NEW] [V3__add_analytics_indexes.sql](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/resources/db/migration/V3__add_analytics_indexes.sql)
- Índices para acelerar agrupamentos:
    - `idx_sessions_user_area` em `study_sessions(user_id, grande_area)`.
    - `idx_sessions_user_date` em `study_sessions(user_id, data_sessao)`.
    - `idx_simulados_user_date` em `simulados(user_id, data_realizacao)`.

## Verification Plan

### Automated Tests
- `DashboardServiceTest`: Validar cálculo de streak com gaps (ex: estuda hoje, pula ontem, estudou anteontem -> streak 1).
- `AnalyticsServiceTest`: Validar agregação de médias entre múltiplos temas da mesma área.

### Manual Verification
- **Swagger UI**:
  - Validar `GET /api/dashboard` com dados de teste.
  - Testar filtros de período (`LAST_30_DAYS`) no Analytics.
