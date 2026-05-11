# Context: Phase 16 — Refinamento de Analytics & Tendências

**Date:** 2026-05-11
**Phase:** 16
**Goal:** Implementar tendências de 30 dias e drill-down por subárea conforme legado.

---

## Domain Boundary
Esta fase foca na evolução do módulo de Dashboard e Analytics, saindo de métricas estáticas para uma visão temporal e detalhada do desempenho do usuário. O objetivo é permitir que o estudante identifique rapidamente se está evoluindo e quais temas específicos (subáreas) exigem atenção imediata.

## Decisions Captured

### 1. Lógica de Tendência (ANLY-01)
- **Análise Dupla:** O sistema deve calcular e exibir dois tipos de tendência:
  - **Curto Prazo:** Média dos últimos 7 dias em relação à média dos últimos 30 dias.
  - **Longo Prazo:** Média dos últimos 30 dias em relação à média histórica total (Global).
- **Indicadores Visuais:** Setas de tendência (subida, descida ou estável) com base na variação percentual.

### 2. Interface de Drill-down (ANLY-03)
- **Componente:** Uso de **Modais** para exibição do detalhamento por subárea.
- **Interação:** Ao clicar em uma linha da tabela de Grandes Áreas, um modal deve abrir contendo:
  - Lista de subáreas com desempenho percentual.
  - Ranking de erros específico para aquela Grande Área.
  - Mini-gráficos de evolução da área.

### 3. Implementação de Breakpoints (ANLY-02)
- **Centralização:** Implementar o `PerformanceThemeService` no frontend (Angular).
- **Limites (v1.1):**
  - `< 70%`: Vermelho (Danger)
  - `70% - 85%`: Amarelo (Warning)
  - `> 85%`: Verde (Success)
- **Adoção:** Todos os componentes de dashboard, tabelas e relatórios devem consumir este serviço para garantir consistência visual.

### 4. Ranking de Erros (ANLY-04)
- **Filtro Dinâmico:** O ranking de Top 10 temas com maior taxa de erro terá um seletor de período:
  - **Padrão:** Últimos 60 dias.
  - **Opção:** Todo o período (Histórico).
- **Relevância:** Manter a regra de "mínimo de 3 questões resolvidas" para que o tema apareça no ranking.

---

## Canonical Refs
- [REQUIREMENTS.md](../../REQUIREMENTS.md) (ANLY-01..04)
- [ROADMAP.md](../../ROADMAP.md) (Phase 16)

## Code Context
- **Frontend Dashboard:** `frontend/src/app/features/dashboard`
- **Backend Analytics:** `backend/src/main/java/com/medstudy/backend/modules/analytics`
- **Asset sugerido:** Criar `frontend/src/app/core/services/performance-theme.service.ts`.

---

## Deferred Ideas
- *Nenhuma ideia adiada nesta fase.*

---

## Next Up
`/gsd-plan-phase 16`
