# Context: Phase 13 — Testes Frontend (Angular + NgRx)

## Purpose
Estabelecer uma suíte de testes robusta para o frontend do MedStudy, garantindo que a lógica de estado (NgRx), a integração de componentes standalone e os serviços de infraestrutura (Auth, Temas) funcionem conforme os requisitos, mantendo uma cobertura mínima de 80%.

## Decisions Locked

### 1. Tooling & Infrastructure
- **Engine:** Jasmine + Karma.
- **Mocking Strategy:** Utilizar `ng-mocks` para realizar mocks declarativos de componentes dependentes, pipes e diretivas nos testes de integração do `TestBed`.
- **NgRx Testing:**
    - **Reducers:** Testes unitários puros (Input State + Action -> Output State).
    - **Effects:** Testes isolados usando `provideMockActions`.
    - **Components:** Utilizar `provideMockStore` para simular o estado e validar o disparo de ações (`store.dispatch`).

### 2. Test Data Strategy
- **Approach:** Manual Data Builders / Fixtures.
- **Constraint:** Não utilizar bibliotecas de dados aleatórios (Faker). Criar funções de fábrica (ex: `createMockUser()`) para centralizar a criação de mocks consistentes e determinísticos.

### 3. Code Coverage
- **Threshold:** 80% global e por arquivo (onde aplicável).
- **Enforcement:** O build deve **falhar** se a cobertura for inferior a 80%. Configurar `karma.conf.js` com `check: { global: { statements: 80, ... } }`.

### 4. Scope Priority (Maximize Coverage)
- **Features:**
    - `Auth Module`: Login, Recuperação de Senha, Logout.
    - `Dashboard`: KPI Cards, Renderização de Gráficos (mockar bibliotecas de terceiros), Streak logic.
    - `Banco de Questões`: Tabela, Paginação, Filtros e Modais de CRUD.
    - `Simulados`: Cálculos de área e histórico.
    - `Flashcards`: Lógica de flip, animação e persistência de rating.
    - `Plano de Aulas` & `Revisão`: Toggles de status e categorização por data.
- **Infrastructure:**
    - `ThemeService`: Troca de variáveis CSS e persistência no `localStorage`.
    - `AuthGuard`: Proteção de rotas e redirecionamentos.
    - `Interceptors`: Injeção de JWT e tratamento de erros 401.

## Codebase Patterns to Follow
- **Standalone Components:** Utilizar `ComponentFixture` com `TestBed.configureTestingModule` importando os componentes standalone necessários ou seus mocks.
- **Signals:** Testar os Signals do Angular 18 garantindo que as mudanças de estado reflitam no template/computeds.
- **Clean Tests:** Seguir o padrão Arrange-Act-Assert (AAA).

## Out of Scope (for this phase)
- Testes E2E (reservados para a Fase 15 com integração total).
- Testes de performance de renderização.
