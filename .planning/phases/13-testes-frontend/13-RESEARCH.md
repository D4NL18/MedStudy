# Research: Phase 13 — Testes Frontend (Angular + NgRx)

## Overview
A Fase 13 foca em garantir a qualidade do frontend através de testes unitários e de integração utilizando Jasmine e Karma. Como o projeto utiliza Angular 18 (Standalone) e NgRx 18, a estratégia de testes deve ser moderna e eficiente.

## Technical Findings

### 1. Angular 18 Standalone Testing
- **Standalone Components:** Testes devem usar `TestBed.configureTestingModule` com `imports: [ComponentUnderTest]`.
- **Mocks:** Para evitar testar dependências em cadeia, a biblioteca `ng-mocks` (especialmente `MockBuilder`) é recomendada.
- **Signals:** Angular 18 Signals devem ser testados verificando as mudanças de estado reativo no template ou através de `computed` values.

### 2. NgRx 18 Testing Patterns
- **Store Mocking:** Utilizar `provideMockStore({ initialState })` para componentes. Isso permite isolar a UI da lógica de negócio complexa da Store.
- **Selectors:** Utilizar `store.overrideSelector(selector, value)` para simular estados específicos em diferentes cenários de teste.
- **Effects:** Utilizar `provideMockActions(() => actions$)` para testar Effects. Recomenda-se o uso de `jasmine-marbles` para testar fluxos assíncronos (observables) de forma determinística.
- **Reducers:** Testes puros comparando o estado inicial + action com o estado esperado.

### 3. Code Coverage with Karma
Para atingir o objetivo de **80% de cobertura com falha no build**, a configuração no `karma.conf.js` deve ser:
```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```
Como o projeto não possui um `karma.conf.js` customizado, ele precisará ser gerado (`ng generate config karma`) e configurado.

## Dependencies Needed
- `ng-mocks`: Para facilitar o mocking de componentes e serviços no Angular.
- `jasmine-marbles`: Para testes de observables em Effects.

## Proposed Patterns
- **Fixtures/Builders:** Criar uma pasta `src/app/testing/fixtures/` para centralizar objetos de mock (ex: `auth.fixture.ts`, `dashboard.fixture.ts`).
- **Mock Store setup:** Criar um helper para configurar o `MockStore` com estados comuns de autenticação.

## Validation Architecture
- **Unit Tests:** Reducers, Selectors, Pipes e Serviços simples.
- **Component Tests:** Testes de integração leves focados na interação da UI com a Store e serviços mockados.
- **Effect Tests:** Validação de fluxos de API (HttpClient mockado) e despacho de ações sucessoras.
