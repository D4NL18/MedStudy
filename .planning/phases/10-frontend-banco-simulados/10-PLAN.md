# PLAN: Phase 10 - Frontend: Banco de Dados & Simulados

## Overview
Esta fase foca na implementação do frontend para os módulos de **Banco de Dados de Questões** e **Simulados**. A interface será moderna, utilizando modais com efeito Glassmorphism, tabelas com Scroll Infinito (CDK Virtual Scroll) e gerenciamento de estado robusto com NgRx.

## Tasks

### 0. Refactoring & Standardization
- **Task 10.0: Refactor Existing Components to Separate Files**
  - Migrar templates e estilos inline para arquivos `.html` e `.scss` separados em todos os componentes já criados (Auth, Dashboard, Analytics, Shell).
  - **Files modified**: 
    - `frontend/src/app/core/layout/shell.component.ts` (+ .html, .scss)
    - `frontend/src/app/features/auth/login/login.component.ts` (+ .html, .scss)
    - `frontend/src/app/features/auth/forgot-password/forgot-password.component.ts` (+ .html, .scss)
    - `frontend/src/app/features/dashboard/pages/dashboard/dashboard.component.ts` (+ .html, .scss)
    - `frontend/src/app/features/dashboard/components/evolution-chart/evolution-chart.component.ts` (+ .html, .scss)
    - `frontend/src/app/features/analytics/pages/analise-area/analise-area.component.ts` (+ .html, .scss)
    - `frontend/src/app/features/analytics/pages/analise-tema/analise-tema.component.ts` (+ .html, .scss)
  - `autonomous`: true

### 1. NgRx Store Setup
- **Task 10.1: Feature Store - Banco de Dados**
  - Implementar o estado NgRx para sessões de estudo utilizando `@ngrx/entity`.
  - Incluir ações para carregar páginas (pagination), adicionar novas sessões, editar e excluir.
  - **Files modified**: 
    - `frontend/src/app/core/state/banco/banco.actions.ts`
    - `frontend/src/app/core/state/banco/banco.reducer.ts`
    - `frontend/src/app/core/state/banco/banco.effects.ts`
    - `frontend/src/app/core/state/banco/banco.selectors.ts`
  - `autonomous`: true

- **Task 10.2: Feature Store - Simulados**
  - Implementar o estado NgRx para resultados de simulados.
  - Incluir ações de CRUD e seletores para métricas agregadas.
  - **Files modified**:
    - `frontend/src/app/core/state/simulados/simulados.actions.ts`
    - `frontend/src/app/core/state/simulados/simulados.reducer.ts`
    - `frontend/src/app/core/state/simulados/simulados.effects.ts`
    - `frontend/src/app/core/state/simulados/simulados.selectors.ts`
  - `autonomous`: true

### 2. Shared Components
- **Task 10.3: Infinite Scroll Sentinel**
  - Criar um componente reutilizável que utiliza o Intersection Observer para disparar o carregamento de mais itens ao atingir o final da lista.
  - **Files modified**:
    - `frontend/src/app/shared/components/infinite-scroll-sentinel/infinite-scroll-sentinel.component.ts`
    - `frontend/src/app/shared/components/infinite-scroll-sentinel/infinite-scroll-sentinel.component.html`
    - `frontend/src/app/shared/components/infinite-scroll-sentinel/infinite-scroll-sentinel.component.scss`
  - `autonomous`: true

- **Task 10.4: Glass Modal Base**
  - Padronizar o componente base para modais com design Glassmorphism e animações.
  - **Files modified**:
    - `frontend/src/app/shared/components/modal-base/modal-base.component.ts`
    - `frontend/src/app/shared/components/modal-base/modal-base.component.html`
    - `frontend/src/app/shared/components/modal-base/modal-base.component.scss`
  - `autonomous`: true

### 3. Banco de Dados Module
- **Task 10.5: Banco de Dados Page & Table**
  - Implementar a página principal com a barra de filtros superior e a tabela utilizando `cdk-virtual-scroll-viewport`.
  - **Files modified**:
    - `frontend/src/app/features/banco-questoes/pages/banco-questoes-list/banco-questoes-list.component.ts`
    - `frontend/src/app/features/banco-questoes/pages/banco-questoes-list/banco-questoes-list.component.html`
    - `frontend/src/app/features/banco-questoes/pages/banco-questoes-list/banco-questoes-list.component.scss`
  - `autonomous`: true

### 4. Simulados Module
- **Task 10.6: Simulados Page & Table**
  - Implementar a página de Simulados exibindo histórico e cabeçalho de métricas.
  - **Files modified**:
    - `frontend/src/app/features/simulados/pages/simulados-list/simulados-list.component.ts`
    - `frontend/src/app/features/simulados/pages/simulados-list/simulados-list.component.html`
    - `frontend/src/app/features/simulados/pages/simulados-list/simulados-list.component.scss`
  - `autonomous`: true

### 5. CRUD Modals
- **Task 10.7: Session Form Modal**
  - Formulário modal para criar/editar sessões de estudo.
  - **Files modified**:
    - `frontend/src/app/features/banco-questoes/components/session-modal/session-modal.component.ts`
    - `frontend/src/app/features/banco-questoes/components/session-modal/session-modal.component.html`
    - `frontend/src/app/features/banco-questoes/components/session-modal/session-modal.component.scss`
  - `autonomous`: true

- **Task 10.8: Simulado Form Modal**
  - Formulário vertical para preenchimento das 5 áreas médicas.
  - **Files modified**:
    - `frontend/src/app/features/simulados/components/simulado-modal/simulado-modal.component.ts`
    - `frontend/src/app/features/simulados/components/simulado-modal/simulado-modal.component.html`
    - `frontend/src/app/features/simulados/components/simulado-modal/simulado-modal.component.scss`
  - `autonomous`: true

### 6. Routing & Integration
- **Task 10.9: Feature Routing Setup**
  - Registrar as rotas no `app.routes.ts` e integrar os novos NgRx states.
  - **Files modified**:
    - `frontend/src/app/app.routes.ts`
    - `frontend/src/app/app.config.ts`
  - `autonomous`: true

## Verification
Consulte `.planning/phases/10-frontend-banco-simulados/10-UAT.md` para os cenários de teste.
