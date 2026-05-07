# Implementation Plan — Phase 09: Frontend: Dashboard & Análises

## Goal
Implementar a interface de Dashboard e Análises, integrando gráficos dinâmicos com ngx-charts, gerenciamento de estado lazy com NgRx e navegação drill-down.

## Proposed Changes

### 1. Dependências & Configuração
- **Task 1.1**: Instalar `@swimlane/ngx-charts`.
- **Task 1.2**: Registrar `provideAnimations()` no `app.config.ts`.
- **Task 1.3**: Criar mocks de dados para desenvolvimento offline dos gráficos.

### 2. NgRx State Management (Lazy)
#### [NEW] [dashboard.actions.ts, dashboard.reducer.ts, dashboard.effects.ts](file:///c:/Users/PC/Documents/GitHub/MedStudy/frontend/src/app/store/dashboard/)
- Implementar feature state para o Dashboard (KPIs globais).
- Effect para `GET /api/dashboard`.

#### [NEW] [analytics.actions.ts, analytics.reducer.ts, analytics.effects.ts](file:///c:/Users/PC/Documents/GitHub/MedStudy/frontend/src/app/store/analytics/)
- Implementar feature state para Analytics (Áreas e Temas).
- Effects para `GET /api/analytics/areas` e `GET /api/analytics/topics`.
- Configurar carregamento lazy no router.

### 3. Dashboard UI Components
#### [NEW] [DashboardComponent](file:///c:/Users/PC/Documents/GitHub/MedStudy/frontend/src/app/features/dashboard/dashboard.component.ts)
- Grid layout para os KPI Cards (Taxa Global, Questões Mês/Ano, Grande Área Forte/Fraca).
- Integração do componente de Gráfico de Evolução Mensal (Linha).
- Lista de Top 5 aulas pendentes (Alta/Diamante).

#### [NEW] [EvolutionChartComponent](file:///c:/Users/PC/Documents/GitHub/MedStudy/frontend/src/app/features/dashboard/components/evolution-chart/evolution-chart.component.ts)
- Implementação com `ngx-charts-line-chart`.
- Binding de cores dinâmicas via `ThemeService` (padrão Verde).

### 4. Analytics UI Components
#### [NEW] [AnaliseAreaComponent](file:///c:/Users/PC/Documents/GitHub/MedStudy/frontend/src/app/features/analytics/pages/analise-area/analise-area.component.ts)
- Gráfico de Barras Horizontais (`ngx-charts-bar-horizontal`).
- Implementação de lógica de colorização por faixa de desempenho (<70% vermelho, 70-80% amarelo, >80% verde).
- Evento de clique para drill-down no Banco de Questões.

#### [NEW] [AnaliseTemaComponent](file:///c:/Users/PC/Documents/GitHub/MedStudy/frontend/src/app/features/analytics/pages/analise-tema/analise-tema.component.ts)
- Tabela ordenável e filtrável (Angular Material Table ou Vanilla).
- Colunas: Tema, Área, Questões, % Acerto, Sessões.

### 5. Interatividade & Temas
- **Task 5.1**: Implementar `DrillDownService` ou helper para centralizar redirecionamentos com query params.
- **Task 5.2**: Validar contraste dos gráficos em todos os 8 temas (especialmente Verde e Rosa).

## Verification Plan

### Automated Tests
- **NgRx Tests**: Validar que as actions de Analytics só são disparadas ao acessar as respectivas sub-rotas.
- **Component Tests**: Verificar se o `DashboardComponent` exibe placeholders/skeletons quando o estado é `loading`.

### Manual Verification
- **E2E Flow**: Login -> Dashboard (carrega KPIs) -> Aba Análise Área (carrega áreas) -> Clique em Área -> Redirecionamento para Banco de Questões filtrado.
- **Theme Swap**: Trocar tema para "Escuro" e validar se o gráfico do ngx-charts atualiza as cores sem reload.
