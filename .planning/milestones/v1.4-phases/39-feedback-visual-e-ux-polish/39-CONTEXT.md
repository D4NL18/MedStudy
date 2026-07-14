# Phase 39 Context: Feedback Visual e UX Polish

## Domain
Adicionar animações, loading states e feedback visual para o remanejamento (como gráficos de Antes e Depois da carga de estudos).

## Canonical Refs
- [ROADMAP.md](../../ROADMAP.md)
- [37-CONTEXT.md](../37-endpoints-da-api-e-configura-es-de-usu-rio/37-CONTEXT.md)
- [38-CONTEXT.md](../38-interface-do-usu-rio-e-gerenciamento-de-estado-angular/38-CONTEXT.md)

## Decisions

### 1. Estilo do Gráfico de Antes e Depois
- **Decisão:** Gráfico de Barras Agrupadas (Lado a lado o Antes e Depois por dia).
- **Justificativa:** Facilita a comparação visual da carga diária usando ngx-charts.

### 2. Feedback de Sucesso
- **Decisão:** Pequena animação no modal (ex: ícone de check com fade/scale) e fecha após 2s.
- **Justificativa:** Dá um feedback claro sem interromper muito o fluxo do usuário.

### 3. Estado de Loading durante o Preview
- **Decisão:** Skeleton loaders onde os gráficos irão aparecer.
- **Justificativa:** Dá uma sensação de "montando os dados", mais agradável que um spinner que bloqueia a tela inteira.

## Prior Decisions Applied
* Angular 18, ngx-charts, TailwindCSS (ou CSS custom) seguem o padrão das fases anteriores.
