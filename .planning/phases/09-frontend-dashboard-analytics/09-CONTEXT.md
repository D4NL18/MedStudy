# Phase 09 Context: Frontend: Dashboard & Análises

## Domain
Dashboard com KPIs, gráficos e análises por área e por tema, integrado ao backend usando Angular e NgRx.

## Decisions
- **Biblioteca de Gráficos:** `ngx-charts` (escolhido por renderizar SVG nativo no Angular, facilitando o uso direto de CSS Custom Properties para os 8 temas sem necessidade de forçar re-render de canvas via JS).
- **Estratégia de Carregamento (NgRx):** Lazy loading. O carregamento dos dados de análise é disparado sob demanda conforme o usuário navega para a aba específica (Área/Tema), garantindo carregamento inicial ultrarrápido da tela principal.
- **Empty States (Novos Usuários):** Placeholders / Skeletons amigáveis com ilustrações nos eixos dos gráficos e cards, acompanhados de botões CTA educando o usuário a iniciar a sua primeira sessão.
- **Interatividade dos Gráficos:** Drill-down ativado. Ao clicar na barra ou fatia de um gráfico (ex: "Pediatria"), o sistema redireciona automaticamente o usuário para a tabela de Banco de Questões, já preenchida com o filtro aplicado.

## Code Context
- Gráficos devem consumir a paleta legada (`#430428`, `#F553B0`) mapeada via variáveis do `ThemeService` desenvolvido na Fase 8.
- Usar Signals nos componentes para ler os Selectors do NgRx.
- As chamadas de fetch assíncronas do Dashboard e Analytics Features ficarão isoladas via `createEffect`.

## Canonical Refs
- `ROADMAP.md` (DASH-01..10, AREA-01..03, TEMA-01..03)
