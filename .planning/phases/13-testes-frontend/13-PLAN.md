# Plan: Phase 13 — Testes Frontend (Angular + NgRx)

## Purpose
Implementar uma suíte de testes unitários e de integração para o frontend, garantindo 80% de cobertura de código e estabilidade das funcionalidades críticas (Auth, Dashboard, Banco de Dados, Flashcards).

## Context
- **Tooling:** Jasmine/Karma.
- **Patterns:** Standalone components, NgRx 18 (Reducers, Effects, Selectors), `ng-mocks`, `jasmine-marbles`.
- **Enforcement:** 80% coverage threshold with build failure.

## Tasks

### Wave 0: Infraestrutura e Configuração
- [x] **13-00-01:** Gerar configuração do Karma (`ng generate config karma`) e ajustar `karma.conf.js` para incluir o `coverageReporter` com thresholds de 80% (statements, branches, functions, lines).
- [x] **13-00-02:** Instalar dependências de desenvolvimento: `npm install --save-dev ng-mocks jasmine-marbles`.
- [x] **13-00-03:** Criar estrutura de fixtures em `src/app/testing/fixtures/` e implementar builders básicos para `User`, `StudySession`, `Flashcard`, `Lesson`, `Simulado`, `Analytics` e `Revision`.
- [x] **13-00-04:** Corrigir o teste inicial `app.component.spec.ts` que está falhando devido ao título incorreto.

### Wave 1: Store e Core
- [x] **13-01-01:** Implementar testes para **Auth Store**: Reducers, Selectors e Effects.
- [x] **13-01-02:** Implementar testes para **Theme Module**: `ThemeService` e `ThemeSwitcherComponent`.
- [x] **13-01-03:** Implementar testes para **Core Services/Guards**: `AuthGuard` e `JwtInterceptor`.

### Wave 2: Features Críticas
- [x] **13-02-01:** Implementar testes para **Dashboard**: `DashboardComponent` e KPIs.
- [x] **13-02-02:** Implementar testes para **Banco de Dados**: `BancoListComponent` e Reducer.
- [x] **13-02-03:** Implementar testes para **Flashcards**: `FlashcardsListComponent`, `FlashcardsStudyComponent`, Reducer e Effects.

### Wave 3: Cobertura e Refinamento
- [ ] **13-03-01:** Implementar testes para stores restantes: **Simulados** (Reducer/Effects), **Analytics** (Reducer/Effects), **Revision** (Reducer/Effects) e **Study Plan** (Effects).
- [ ] **13-03-02:** Implementar testes para serviços core: `AuthService`, `FlashcardService`, `SimuladosService`.
- [ ] **13-03-03:** Executar suíte completa com cobertura (`ng test --no-watch --code-coverage`) e garantir 80% de cobertura global.

## Verification
- **Automated:** `npm run test -- --no-watch --code-coverage`
- **Criteria:**
    - Suíte de testes verde (0 falhas).
    - Relatório de cobertura indicando ≥ 80% em Statements, Branches, Functions e Lines.
    - Nenhum erro de injeção de dependência em componentes standalone.
