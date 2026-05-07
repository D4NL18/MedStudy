# Walkthrough — Phase 06: Dashboards & Analytics

## Alterações Realizadas

### Backend
- **Novos Módulos**: `dashboard` e `analytics`.
- **DTOs**: `DashboardResponse`, `AreaAnalyticsResponse`, `TopicAnalyticsResponse`.
- **Serviços**:
    - `DashboardService`: Agrega KPIs globais e calcula o streak diário.
    - `AnalyticsService`: Processa dados históricos vs recentes para gerar indicadores de tendência.
- **Banco de Dados**: Migração `V3` adicionando índices compostos em `(user_id, data_sessao)` e `(user_id, grande_area)`.

## Verificação Realizada

### Testes Unitários
- **DashboardServiceTest**: Validado cálculo de streak (hoje+ontem, apenas ontem, quebra de streak).
- **AnalyticsServiceTest**: Validado cálculo de `trendRate` (performance dos últimos 7 dias).

### Manual (Swagger)
- `GET /api/dashboard`: Retornando JSON com `sessions`, `simulados` e `currentStreak`.
- `GET /api/analytics/areas`: Retornando lista de áreas com `performanceLevel` e `trendRate`.

## Próximos Passos
- **Phase 07**: Backend - Revisão Espaçada & Flashcards (Lógica de agendamento e repetição).
