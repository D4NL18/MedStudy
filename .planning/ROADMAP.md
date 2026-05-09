# ROADMAP: MedStudy — Plataforma de Estudos Médicos

**Milestone:** v1.0 — Reescrita completa com Angular + Spring Boot + PostgreSQL
**Granularity:** Fine (15 phases)
**Mode:** Interactive
**Started:** 2026-05-05

---

## Architecture Overview

```
medstudy/                          ← Monorepo root
├── frontend/                      ← Angular 18
│   ├── src/app/
│   │   ├── core/                  ← Auth, interceptors, guards, singleton services
│   │   ├── shared/                ← Reusable components, pipes, directives
│   │   └── features/
│   │       ├── auth/              ← Login, recuperação de senha
│   │       ├── dashboard/         ← KPIs, gráficos
│   │       ├── banco-questoes/    ← Sessões de estudo CRUD
│   │       ├── simulados/         ← Mock exams
│   │       ├── plano-aulas/       ← Course plan
│   │       ├── analise-area/      ← Per-area analytics
│   │       ├── analise-tema/      ← Per-topic analytics
│   │       ├── revisao/           ← Spaced repetition
│   │       └── flashcards/        ← Active recall
│   └── store/                     ← NgRx state (actions, reducers, effects, selectors)
│
└── backend/                       ← Spring Boot 3 / Java 21
    └── src/main/java/com/medstudy/
        ├── config/                ← Security, CORS, OpenAPI, Flyway
        ├── auth/                  ← JWT filter, token service, auth controller
        ├── exception/             ← Custom exceptions + @ControllerAdvice
        └── modules/
            ├── user/              ← User entity, service, repository
            ├── sessao/            ← Study sessions (banco de questões)
            ├── simulado/          ← Mock exams
            ├── aula/              ← Course plan entries
            ├── flashcard/         ← Flashcard management
            ├── dashboard/         ← Aggregate metrics service
            └── revisao/           ← Spaced repetition queries
```

**Data Flow:**
```
Angular (Component + NgRx Store)
  → HTTP Interceptor (inject JWT)
    → Spring Controller (validate DTO)
      → Service (business logic)
        → Repository (JPA → PostgreSQL)
      ← DTO (MapStruct)
    ← JSON Response
  ← NgRx Effect (dispatch action)
← Component (Signal/Observable)
```

---

## Phases

### Phase 1 — Monorepo Setup & Infraestrutura Base
**Goal:** Repositório configurado, projetos Angular e Spring Boot rodando, PostgreSQL disponível via Docker.
**Requirements:** INFR-01, INFR-02, INFR-05, INFR-06
**Deliverables:**
- `docker-compose.yml` com PostgreSQL 16
- Projeto Angular 18 inicializado em `frontend/` (standalone components habilitado)
- Projeto Spring Boot 3 inicializado em `backend/` com dependências: JPA, Security, Validation, MapStruct, Flyway, OpenAPI
- `application.properties` para datasource (com variáveis de env)
- `.gitignore` configurado para o monorepo
- `README.md` com instruções de setup
**Plans:**
- [ ] 1.1 — Docker Compose + PostgreSQL
- [ ] 1.2 — Angular 18 project scaffold
- [ ] 1.3 — Spring Boot 3 project scaffold
- [ ] 1.4 — Monorepo root config + README

---

### Phase 2 — Database Schema & Backend Skeleton
**Goal:** Schema PostgreSQL versionado com Flyway; estrutura de camadas do backend definida com entidades, repositórios e DTOs base.
**Requirements:** INFR-03, BACK-01..06, SECU-03, SECU-05
**Deliverables:**
- Migrations Flyway: `users`, `study_sessions`, `simulados`, `lessons`, `flashcards`, `refresh_tokens`
- Entidades JPA mapeadas com validações
- Repositórios Spring Data JPA
- DTOs (Java Records) com `jakarta.validation` para todos os módulos
- MapStruct mappers para todos os módulos
- `@ControllerAdvice` global com handlers para: `ResourceNotFoundException`, `ValidationException`, `UnauthorizedException`, `BusinessRuleException`
- Paginação padrão configurada (PageRequest, max 50 itens)
**Plans:**
- [ ] 2.1 — Flyway migrations (all tables)
- [ ] 2.2 — JPA Entities
- [ ] 2.3 — Spring Data Repositories
- [ ] 2.4 — DTOs (Records) + jakarta.validation
- [ ] 2.5 — MapStruct Mappers
- [ ] 2.6 — Global Exception Handler (@ControllerAdvice)

---

### Phase 3 — Auth Backend (Spring Security + JWT)
**Goal:** Autenticação segura com JWT + refresh token rotation. Backend protegido end-to-end.
**Requirements:** AUTH-01..07, SECU-01..02, SECU-04, SECU-06..07, BACK-07, INFR-04
**Deliverables:**
- `JwtTokenService`: geração, validação e parsing de tokens
- `JwtAuthenticationFilter`: filtro do Spring Security para todas as requisições
- `AuthController`: POST `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/forgot-password`
- `AuthService` com lógica de autenticação e BCrypt
- Entidade `refresh_tokens` com TTL (7 dias) e invalidação ao usar
- CORS configurado para `localhost:4200`
- Headers de segurança HTTP via Spring Security
- Rate limiting no `/api/auth/login` (ex: Bucket4j ou filtro customizado)
- Swagger/OpenAPI em `/api/docs` com autenticação Bearer
**Plans:**
- [ ] 3.1 — JwtTokenService + JwtAuthenticationFilter
- [ ] 3.2 — AuthController + AuthService + BCrypt
- [ ] 3.3 — Refresh token entity + rotation logic
- [ ] 3.4 — Spring Security config (CORS, headers, route protection)
- [ ] 3.5 — Rate limiting no login
- [ ] 3.6 — Swagger/OpenAPI config com Bearer auth

---

### Phase 4 — Backend: Banco de Questões (Sessões de Estudo)
**Goal:** CRUD completo de sessões de estudo com paginação, filtros e ordenação no backend.
**Requirements:** BNCO-01..07
**Deliverables:**
- `StudySessionController`: GET (paginado + filtros), POST, PUT, DELETE
- `StudySessionService` com regras de negócio (validação de qts_corretas ≤ qts_feitas, cálculo de data_proxima_revisao)
- Filtros: grande_area, faixa de desempenho, status revisao_concluida
- Busca textual: tema, grande_area, instituicao (ILIKE)
- Endpoint de métricas: GET `/api/study-sessions/metrics` (totais, média de acertos, revisões críticas)
- Testes unitários do Service (JUnit 5 + Mockito)
**Plans:**
- [x] 4.1 — StudySessionController (CRUD endpoints)
- [x] 4.2 — StudySessionService (business logic + validation)
- [x] 4.3 — Repository: filtros dinâmicos (JPA Specification ou JPQL)
- [x] 4.4 — Metrics endpoint
- [x] 4.5 — Unit tests for StudySessionService

---

### Phase 5 — Backend: Simulados & Plano de Aulas
**Goal:** CRUD de simulados (por área médica) e plano de aulas com prioridades.
**Requirements:** SIML-01..06, PLAN-01..06
**Deliverables:**
- `SimuladoController` + `SimuladoService`: CRUD, cálculo automático erros = total − acertos (validado server-side)
- `LessonController` + `LessonService`: CRUD, toggle `aula_assistida`, filtros por área/prioridade/status
- Validações: acertos ≤ total em cada área do simulado; prioridade ∈ {DIAMANTE, ALTA, MEDIA, BAIXA}
- Testes unitários de ambos os services
**Plans:**
- [ ] 5.1 — SimuladoController + SimuladoService
- [ ] 5.2 — Simulado: validações e cálculos automáticos
- [ ] 5.3 — LessonController + LessonService
- [ ] 5.4 — Lesson: filtros + toggle assistida
- [ ] 5.5 — Unit tests (Simulado + Lesson services)

---

### Phase 6 — Backend: Analytics (Dashboard, Área, Tema)
**Goal:** Endpoints de agregação para Dashboard, Análise por Área e Análise por Tema.
**Requirements:** DASH-01..10, AREA-01..03, TEMA-01..03
**Deliverables:**
- `DashboardController`: GET `/api/dashboard` — retorna KPIs agregados (taxa global, streak, progresso, questões mês/ano, área forte/fraca)
- `AnalyticsController`: GET `/api/analytics/by-area`, GET `/api/analytics/by-topic`
- `DashboardService` com lógica de streak (consecutividade de datas), evolução mensal
- Queries JPQL/nativas otimizadas com índices no PostgreSQL
- Testes unitários do DashboardService (streak algorithm, edge cases)
**Plans:**
- [ ] 6.1 — DashboardService (KPIs, streak algorithm)
- [ ] 6.2 — DashboardController
- [ ] 6.3 — AnalyticsService (by-area, by-topic aggregations)
- [ ] 6.4 — AnalyticsController
- [ ] 6.5 — Database indexes + query optimization
- [ ] 6.6 — Unit tests (streak edge cases, analytics)

---

### Phase 7 — Backend: Revisão Intervalada & Flashcards
**Goal:** Endpoints para revisão espaçada e CRUD de flashcards com agendamento por dificuldade.
**Requirements:** REVI-01..07, FLSH-01..08
**Deliverables:**
- `RevisionController`: GET `/api/revisions?status=overdue|today|future|done`
- `RevisionService`: lógica de categorização por data e status
- `FlashcardController`: CRUD + GET `/api/flashcards/study?area=...`
- `FlashcardService`: scheduling algorithm (Fácil: +7d, Médio: +3d, Difícil: +1d), PATCH `/rate` para avaliar dificuldade
- Testes unitários dos services
**Plans:**
- [ ] 7.1 — RevisionController + RevisionService
- [ ] 7.2 — FlashcardController (CRUD)
- [ ] 7.3 — FlashcardService (scheduling + rating)
- [ ] 7.4 — Unit tests (revision categorization + flashcard scheduling)

---

### Phase 8 — Frontend Core: Angular Setup, NgRx, Auth Module
**Goal:** Projeto Angular configurado com NgRx, interceptors, guards, fluxo de autenticação funcional e sistema de temas de cores.
**Requirements:** AUTH-01..07 (frontend), INFR-06, THEM-01..13
**Deliverables:**
- Angular 18 com Standalone Components, Signals, RxJS
- NgRx Store configurado com feature state para `auth`
- `AuthState`: `{ user, accessToken, isAuthenticated, isLoading, error }`
- `AuthActions`, `AuthReducer`, `AuthEffects`, `AuthSelectors`
- `JwtInterceptor` (inject Bearer token em todas as requisições)
- `AuthErrorInterceptor` (401 → dispatch logout + redirect)
- `AuthGuard` (rota protegida → redirect para login se não autenticado)
- Tela de Login (UI fiel ao design do legado — paleta rosa/vinho)
- Tela de Recuperação de Senha
- `AuthService` (HTTP calls para `/api/auth/**`)
- Refresh token automático quando access token expira
- **Design System de Temas:**
  - `theme.service.ts`: `ThemeService` com Signal `activeTheme`, método `setTheme()`, persistência em `localStorage`
  - `themes.scss`: 8 temas definidos como data-attributes (`[data-theme="rosa"]`, `[data-theme="escuro"]`, etc.) com CSS Custom Properties
  - Variáveis definidas por tema: `--color-primary`, `--color-primary-dark`, `--color-primary-light`, `--color-accent`, `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`
  - 8 temas implementados: `rosa` (padrão), `claro`, `escuro`, `verde`, `azul`, `vermelho`, `roxo`, `laranja`
  - `ThemeSwitcherComponent`: dropdown/modal na navbar com preview de cor de cada tema (swatches)
  - Gráficos (ng2-charts/ngx-charts): cores dinâmicas via `ThemeService`
  - Transição CSS `200ms ease` em todas as variáveis de cor
**Plans:**
- [ ] 8.1 — NgRx setup + auth feature state (actions, reducer, selectors)
- [ ] 8.2 — AuthEffects (login, logout, refresh, token persistence)
- [ ] 8.3 — JwtInterceptor + AuthErrorInterceptor
- [ ] 8.4 — AuthGuard + router configuration
- [ ] 8.5 — Login page UI (Standalone Component)
- [ ] 8.6 — Forgot password page UI
- [ ] 8.7 — App shell layout (header, nav tabs, responsive mobile menu)
- [ ] 8.8 — ThemeService + themes.scss (CSS Custom Properties para 8 temas)
- [ ] 8.9 — ThemeSwitcherComponent (seletor na navbar com swatches)
- [ ] 8.10 — Aplicar tema em todos os components base + integração com gráficos

---

### Phase 9 — Frontend: Dashboard & Análises
**Goal:** Dashboard com KPIs, gráficos e análises por área e por tema, integrado ao backend.
**Requirements:** DASH-01..10, AREA-01..03, TEMA-01..03
**Deliverables:**
- NgRx feature state para `dashboard` e `analytics`
- `DashboardComponent` com Signals para estado local + KPI cards
- Gráfico de linha (evolução mensal) — biblioteca: ng2-charts ou ngx-charts
- Gráfico de barras horizontais (por área) com colorização por faixa
- Gráfico de pizza (distribuição de volume)
- Lista de top 5 aulas pendentes
- `AnaliseAreaComponent` com gráfico e tabela
- `AnaliseTemComponent` com tabela ordenável/filtrável
- Paleta de cores preservada do legado (`#430428`, `#F553B0`, etc.)
**Plans:**
- [ ] 9.1 — NgRx: dashboard + analytics feature state
- [ ] 9.2 — DashboardComponent: KPI cards + streak badge
- [ ] 9.3 — Charts: linha + barras + pizza (ng2-charts/ngx-charts)
- [ ] 9.4 — Dashboard: top 5 aulas pendentes
- [ ] 9.5 — AnaliseAreaComponent
- [ ] 9.6 — AnaliseTemComponent (tabela com sort/filter)

---

### Phase 10 — Frontend: Banco de Questões & Simulados
**Goal:** UI de CRUD para sessões de estudo e simulados com tabelas, filtros e modais.
**Requirements:** BNCO-01..07, SIML-01..06
**Deliverables:**
- NgRx feature state para `bancoDados` e `simulados`
- `BancoDadosComponent`: tabela paginada, filtros, busca, ordenação por coluna
- Modais: Nova Sessão, Edição, Confirmação de Exclusão (Standalone Components)
- `SimuladosComponent`: histórico em tabela, métricas agregadas
- Modal de Novo/Editar Simulado com inputs por área (cálculo automático de erros)
- Métricas de topo (cards) em ambas as páginas
**Plans:**
- [ ] 10.1 — NgRx: bancoDados + simulados feature states
- [ ] 10.2 — BancoDadosComponent: tabela + paginação + filtros
- [ ] 10.3 — Modais: NovaSessao, EdicaoSessao, ConfirmacaoExclusao
- [ ] 10.4 — SimuladosComponent: tabela + métricas
- [ ] 10.5 — Modais: NovoSimulado, EdicaoSimulado

---

### Phase 11 — Frontend: Plano de Aulas, Revisão & Flashcards
**Goal:** UI de Plano de Aulas, Revisão Intervalada e Flashcards com modo de estudo.
**Requirements:** PLAN-01..06, REVI-01..07, FLSH-01..08
**Deliverables:**
- NgRx feature states para `planoAulas`, `revisao`, `flashcards`
- `PlanoAulasComponent`: tabela com prioridades coloridas, toggle assistida, filtros
- `RevisaoComponent`: 4 seções (atrasadas, hoje, futuras, realizadas) com contadores
- `FlashcardsComponent`: modo lista + modo estudo (flip animation)
- Flip card CSS animation (preservar UX do legado)
- Avaliação de dificuldade pós-flip (Fácil/Médio/Difícil)
- Modais: NovaAula, EdicaoAula, NovoFlashcard, EdicaoFlashcard
**Plans:**
- [ ] 11.1 — NgRx: planoAulas + revisao + flashcards states
- [ ] 11.2 — PlanoAulasComponent: tabela + filtros + toggle
- [ ] 11.3 — RevisaoComponent: 4 seções + action buttons
- [ ] 11.4 — FlashcardsComponent: list view + study mode
- [ ] 11.5 — Flip card animation + difficulty rating UI
- [ ] 11.6 — Todos os modais (aula + flashcard)

---

### Phase 12 — Testes Backend (JUnit 5 + Mockito)
**Goal:** Cobertura de testes unitários ≥ 80% em todos os services e controllers do backend.
**Requirements:** TEST-01..04
**Deliverables:**
- Testes para todos os Services: `StudySessionService`, `SimuladoService`, `LessonService`, `DashboardService`, `AnalyticsService`, `RevisionService`, `FlashcardService`, `AuthService`
- Testes MockMvc para todos os Controllers (happy path + error cases)
- Testes de validação: requests com dados inválidos → 400 com mensagem clara
- Testes de segurança: endpoints sem token → 401
- Relatório de cobertura com JaCoCo
**Plans:**
- [ ] 12.1 — Tests: AuthService + AuthController
- [ ] 12.2 — Tests: StudySessionService + Controller
- [ ] 12.3 — Tests: SimuladoService + LessonService + Controllers
- [ ] 12.4 — Tests: DashboardService + AnalyticsService
- [ ] 12.5 — Tests: RevisionService + FlashcardService
- [ ] 12.6 — JaCoCo config + coverage report

---

### Phase 13 — Testes Frontend (Angular + NgRx)
**Goal:** Testes unitários para components, services e NgRx (reducers + effects).
**Requirements:** TEST-05..08
**Deliverables:**
- Testes de Components críticos com `TestBed` (Dashboard, BancoDados, Flashcards, Login)
- Testes de todos os Angular Services (HttpClientTestingModule)
- Testes de todos os NgRx reducers (estado inicial + cada action)
- Testes de NgRx effects (mocking de services + verificação de actions despachadas)
**Plans:**
- [ ] 13.1 — Tests: NgRx reducers (auth, dashboard, bancoDados, simulados, etc.)
- [ ] 13.2 — Tests: NgRx effects (com mocked services)
- [ ] 13.3 — Tests: Angular services (HTTP mocking)
- [ ] 13.4 — Tests: Components (DashboardComponent, BancoDadosComponent)
- [ ] 13.5 — Tests: Components (FlashcardsComponent, RevisaoComponent)

---

### Phase 14 — Security Hardening & OWASP Audit
**Goal:** Auditoria de segurança completa contra OWASP Top 10; correção de todas as vulnerabilidades identificadas.
**Requirements:** SECU-01..07 (revisão final)
**Deliverables:**
- Checklist OWASP Top 10 verificado e documentado
- Injeção SQL: verificação de todas as queries (sem concatenação de strings)
- XSS: validação de input no backend + Angular DomSanitizer onde aplicável
- CSRF: verificação de configuração Spring Security
- Configuração de JWT revisada (algoritmo, expiração, claims mínimas)
- Auditoria de headers HTTP (HSTS, CSP básico, X-Frame-Options)
- Verificação de logs: nenhum dado sensível (senhas, tokens) em logs
- Dependency check: `mvn dependency-check` + `npm audit`
**Plans:**
- [ ] 14.1 — OWASP A01-A05 audit (Broken Access, Crypto, Injection, Design, Config)
- [ ] 14.2 — OWASP A06-A10 audit (Outdated deps, Auth failures, Integrity, Logging, SSRF)
- [ ] 14.3 — Dependency vulnerability scan (mvn + npm)
- [ ] 14.4 — Security fixes e hardening final

---

### Phase 15 — Documentação Final & Integração E2E
**Goal:** README completo, Swagger validado, integração frontend↔backend verificada end-to-end, projeto pronto para uso.
**Requirements:** INFR-04 (final), todas as INFR
**Deliverables:**
- `README.md` na raiz: arquitetura, setup completo (Docker, backend, frontend), como criar o primeiro usuário
- Swagger/OpenAPI validado com todos os endpoints documentados e testáveis
- Verificação E2E manual: login → dashboard → criar sessão → visualizar análise → flashcard → logout
- `SECURITY.md`: como reportar vulnerabilidades
- Checklist de "Go Live" (local): banco rodando, backend saudável, frontend buildando
**Plans:**
- [ ] 15.1 — README completo (setup + arquitetura + screenshots)
- [ ] 15.2 — Swagger: validação de todos os endpoints
- [ ] 15.3 — E2E manual: happy path completo
- [ ] 15.4 — SECURITY.md + checklist de go-live

---

## Progress

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Monorepo Setup | ✅ Complete | 2026-05-05 |
| Phase 2 — Database Schema | ✅ Complete | 2026-05-06 |
| Phase 3 — Auth Backend | ✅ Complete | 2026-05-06 |
| Phase 4 — Banco de Questões API | ✅ Complete | 2026-05-07 |
| Phase 5 — Simulados & Aulas API | ✅ Complete | 2026-05-07 |
| Phase 6 — Analytics API | ✅ Complete | 2026-05-07 |
| Phase 7 — Revisão & Flashcards API | ✅ Complete | 2026-05-07 |
| Phase 8 — Frontend Core + Auth | ✅ Complete | 2026-05-07 |
| Phase 9 — Dashboard & Análises UI | ✅ Complete | 2026-05-07 |
| Phase 10 — Banco & Simulados UI | ✅ Complete | 2026-05-07 |
| Phase 11 — Aulas, Revisão & Flashcards UI | ✅ Complete | 2026-05-08 |
| Phase 12 — Backend Tests | ⬜ Not Started | |
| Phase 13 — Frontend Tests | ⬜ Not Started | |
| Phase 14 — Security Hardening | ⬜ Not Started | |
| Phase 15 — Docs & E2E | ⬜ Not Started | |

---

## Security Checklist

| Vulnerability | Mitigation | Phase |
|--------------|-----------|-------|
| SQL Injection | JPA/Hibernate parametrized queries only | 2 |
| XSS | Input validation (jakarta.validation) + Angular's built-in XSS | 3, 8 |
| CSRF | Stateless JWT (no session cookies) + CORS strict | 3 |
| Broken Auth | JWT rotation, BCrypt, rate limiting | 3 |
| Sensitive Data Exposure | No stack traces in errors, BCrypt passwords, HTTPS-ready | 2, 3 |
| Broken Access Control | Spring Security route protection, user-scoped data | 3 |
| Security Misconfiguration | HTTP security headers, CORS whitelist | 3 |
| Outdated Dependencies | npm audit + mvn dependency-check | 14 |
| Logging & Monitoring | No sensitive data in logs | 14 |
| Payload Abuse | Max body size + pagination limits | 2, 3 |

---
*Roadmap created: 2026-05-05*
*Last updated: 2026-05-08 — Phase 11 Shipped (Plano de Aulas, Revisão & Flashcards)*
