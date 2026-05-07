# Research — Phase 09: Frontend: Dashboard & Análises

## Objective
Pesquisar a integração do `ngx-charts` com o sistema de temas do MedStudy e definir a estrutura do NgRx para carregamento lazy de métricas.

## Analysis

### 1. ngx-charts Integration
- **Library**: `@swimlane/ngx-charts`.
- **Standalone Support**: Compatível com Angular 18 e Standalone Components. Deve-se importar os módulos de gráficos específicos (ex: `LineChartModule`, `BarChartModule`) diretamente no componente ou `AppConfig`.
- **Theming**: Como o `ngx-charts` gera SVG, podemos usar classes CSS ou variáveis CSS para cores.
    - **Strategy**: Utilizar o `customColors` binding do ngx-charts vinculado ao `ThemeService` para garantir que as cores das séries mudem dinamicamente ao trocar o tema (Verde, Rosa, etc).
- **Animations**: Requer `provideAnimations()` no `app.config.ts`.

### 2. Backend Integration & DTOs
Mapeamento dos endpoints implementados na Fase 06:
- `GET /api/dashboard` -> `DashboardResponse` (sessions, simulados, streak).
- `GET /api/analytics/areas` -> `List<AreaAnalyticsResponse>` (performance por grande área).
- `GET /api/analytics/topics` -> `List<TopicAnalyticsResponse>` (desempenho granular por tema).

### 3. NgRx State Strategy
Para suportar o **Lazy Loading** decidido no Contexto:
- **Feature Store: Dashboard**: Carregado na inicialização da rota `/dashboard`. Contém os KPIs globais.
- **Feature Store: Analytics**: Carregado apenas quando o usuário alterna para as abas de análise.
- **Drill-down**: A ação de clique no gráfico disparará um `router.navigate(['/banco-questoes'], { queryParams: { area: '...' } })`.

## Technical Proposal

### Store Structure
```typescript
interface DashboardState {
  kpis: DashboardResponse | null;
  loading: boolean;
  error: any;
}

interface AnalyticsState {
  areas: AreaAnalyticsResponse[];
  topics: TopicAnalyticsResponse[];
  loading: boolean;
}
```

### Components Layout
- `DashboardComponent`: Grid de KPI cards + Gráfico de Evolução (Linha).
- `AnaliseAreaComponent`: Gráfico de Barras Horizontais com cores por faixa de desempenho.
- `AnaliseTemaComponent`: Tabela ordenável de tópicos.

## Risks & Mitigations
- **Performance de Renderização**: Muitos gráficos SVG simultâneos podem pesar em dispositivos móveis.
    - **Mitigation**: Lazy rendering — carregar componentes de gráfico apenas quando visíveis ou em abas ativas.
- **Sync de Cores**: O `ngx-charts` às vezes mantém paletas em cache.
    - **Mitigation**: Forçar a atualização do binding de cores via Signal no `ThemeService`.

## Canonical Refs
- `ROADMAP.md` (DASH-01..10, AREA-01..03, TEMA-01..03)
- `06-WALKTHROUGH.md` (Backend Endpoints)
- `09-UI-SPEC.md` (Visual Contracts)
