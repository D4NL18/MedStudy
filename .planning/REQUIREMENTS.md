# Requirements: MedStudy — Plataforma de Estudos Médicos

**Defined:** 2026-05-05
**Core Value:** O estudante registra desempenho em questões, acompanha revisões e vê sua evolução — com dados seguros, rápidos e confiáveis.

---

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: Usuário pode fazer login com e-mail e senha
- [ ] **AUTH-02**: Usuário pode solicitar recuperação de senha via e-mail
- [ ] **AUTH-03**: Backend emite JWT access token (curto prazo) + refresh token (longo prazo)
- [ ] **AUTH-04**: Sessão persiste após reload do browser via refresh token armazenado de forma segura
- [ ] **AUTH-05**: Rotas protegidas retornam 401 sem token válido
- [ ] **AUTH-06**: Refresh token rotation — token antigo invalidado após uso
- [ ] **AUTH-07**: Logout invalida o refresh token no servidor

### Infrastructure

- [ ] **INFR-01**: Monorepo com diretórios `frontend/` (Angular) e `backend/` (Spring Boot) na raiz
- [ ] **INFR-02**: PostgreSQL 16 disponível localmente (via Docker Compose)
- [ ] **INFR-03**: Flyway para versionamento e execução de migrations SQL
- [ ] **INFR-04**: Swagger/OpenAPI 3 acessível em `/api/docs`
- [ ] **INFR-05**: `.env` / `application.properties` para variáveis sensíveis (sem secrets no código)
- [ ] **INFR-06**: Scripts `npm run dev` e `./mvnw spring-boot:run` funcionam out-of-the-box

### Backend Core

- [ ] **BACK-01**: Estrutura em camadas: Controller → Service → Repository (nenhuma lógica de negócio em Controller)
- [ ] **BACK-02**: DTOs com validação `jakarta.validation` para todas as entradas (request bodies)
- [ ] **BACK-03**: MapStruct para conversão bidirecional Entity ↔ DTO
- [ ] **BACK-04**: `@ControllerAdvice` com handlers para todas as exceções customizadas
- [ ] **BACK-05**: Respostas de erro não expõem stack trace nem informações internas
- [ ] **BACK-06**: Paginação obrigatória em todos os endpoints de listagem (máximo configurável, default 20)
- [ ] **BACK-07**: CORS configurado estritamente (apenas origin do frontend permitida)

### Security

- [ ] **SECU-01**: Spring Security com filtro JWT em todas as rotas (exceto `/api/auth/**`)
- [ ] **SECU-02**: Senhas armazenadas com BCrypt (fator de custo ≥ 10)
- [ ] **SECU-03**: Proteção contra SQL Injection via JPA/Hibernate (queries parametrizadas)
- [ ] **SECU-04**: Headers de segurança HTTP configurados (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] **SECU-05**: Limite de payload de requisição configurado (max body size)
- [ ] **SECU-06**: Rate limiting básico no endpoint de login (prevenção de brute-force)
- [ ] **SECU-07**: Tokens JWT com expiração adequada (access: 15min, refresh: 7 dias)

### Dashboard

- [ ] **DASH-01**: Exibe taxa global de acertos (% corretas / total de questões)
- [ ] **DASH-02**: Exibe total de questões no mês atual e no ano atual
- [ ] **DASH-03**: Identifica e exibe a Grande Área mais forte (maior % acerto)
- [ ] **DASH-04**: Identifica e exibe a Grande Área mais fraca (menor % acerto)
- [ ] **DASH-05**: Exibe progresso teórico (% de aulas assistidas sobre total)
- [ ] **DASH-06**: Exibe streak (sequência de dias consecutivos com sessão de estudo)
- [ ] **DASH-07**: Gráfico de linha — evolução mensal de % acertos nos 12 meses do ano
- [ ] **DASH-08**: Gráfico de barras horizontais — % acerto por Grande Área (colorização por faixa)
- [ ] **DASH-09**: Gráfico de pizza — distribuição de volume de questões por área
- [ ] **DASH-10**: Lista de top 5 aulas com prioridade Alta ou Diamante não assistidas

### Banco de Questões (Sessões de Estudo)

- [ ] **BNCO-01**: Criar sessão de estudo (grande_area, tema, data, qts_feitas, qts_corretas, instituicao, data_proxima_revisao)
- [ ] **BNCO-02**: Editar sessão de estudo existente
- [ ] **BNCO-03**: Excluir sessão com modal de confirmação
- [ ] **BNCO-04**: Listar sessões com paginação e ordenação por qualquer coluna
- [ ] **BNCO-05**: Filtrar por grande_area, faixa de desempenho (<70%, 70–80%, >80%) e status de revisão
- [ ] **BNCO-06**: Busca textual por tema, grande_area e instituição
- [ ] **BNCO-07**: Cards de métricas: total de sessões, total de questões, média de acertos, revisões críticas pendentes

### Simulados

- [ ] **SIML-01**: Criar simulado com nome, data e dados por área (CM, Cir, Ped, GO, Prev): total, acertos, erros
- [ ] **SIML-02**: Calcular automaticamente erros = total − acertos (validação server-side)
- [ ] **SIML-03**: Editar simulado existente
- [ ] **SIML-04**: Excluir simulado com confirmação
- [ ] **SIML-05**: Listar histórico de simulados com métricas agregadas (total geral, % acerto global)
- [ ] **SIML-06**: Visualizar detalhes de simulado com breakdown por área

### Plano de Aulas

- [ ] **PLAN-01**: Criar entrada de aula (grande_area, tema, prioridade: Diamante/Alta/Média/Baixa, aula_assistida: boolean)
- [ ] **PLAN-02**: Editar aula existente
- [ ] **PLAN-03**: Excluir aula com confirmação
- [ ] **PLAN-04**: Marcar/desmarcar aula como assistida
- [ ] **PLAN-05**: Filtrar por grande_area, prioridade e status (assistida/não assistida)
- [ ] **PLAN-06**: Busca textual por tema

### Análise por Área

- [ ] **AREA-01**: Agregar estatísticas de desempenho por grande_area (total de questões, % acerto, sessões)
- [ ] **AREA-02**: Gráfico comparativo de % acerto entre as 5 grandes áreas
- [ ] **AREA-03**: Ranking de áreas por desempenho (melhor → pior)

### Análise por Tema

- [ ] **TEMA-01**: Agregar estatísticas de desempenho por tema dentro de cada grande_area
- [ ] **TEMA-02**: Tabela com colunas: tema, área, total de questões, % acerto, nº de sessões
- [ ] **TEMA-03**: Ordenação e filtragem da tabela por qualquer coluna

### Revisão Intervalada

- [ ] **REVI-01**: Listar sessões com revisão atrasada (data_proxima_revisao < hoje, não concluída)
- [ ] **REVI-02**: Listar sessões para revisar hoje
- [ ] **REVI-03**: Listar revisões futuras agendadas
- [ ] **REVI-04**: Listar revisões já concluídas
- [ ] **REVI-05**: Marcar revisão como concluída (atualiza revisao_concluida = true)
- [ ] **REVI-06**: Desfazer marcação de revisão (revisao_concluida = false)
- [ ] **REVI-07**: Cards de contagem por categoria (atrasadas, hoje, futuras, realizadas)

### Flashcards

- [ ] **FLSH-01**: Criar flashcard (grande_area, frente JSONB, verso JSONB)
- [ ] **FLSH-02**: Editar flashcard existente
- [ ] **FLSH-03**: Excluir flashcard com confirmação
- [ ] **FLSH-04**: Modo de estudo: exibir frente → flip → exibir verso
- [ ] **FLSH-05**: Avaliar dificuldade após revisão: Fácil / Médio / Difícil
- [ ] **FLSH-06**: Calcular próxima data de revisão baseada na dificuldade (Fácil: +7d, Médio: +3d, Difícil: +1d)
- [ ] **FLSH-07**: Filtrar flashcards por grande_area
- [ ] **FLSH-08**: Exibir contagem de flashcards por estado (para revisar hoje, atrasados, em dia)

### Theming (Sistema de Temas de Cores)

- [ ] **THEM-01**: Sistema de temas baseado em CSS Custom Properties (variáveis) — nenhum valor de cor hardcoded nos components
- [ ] **THEM-02**: Tema **Rosa** (padrão) — paleta do legado (`#430428`, `#6F0642`, `#F553B0`, `#FBBCE0`)
- [ ] **THEM-03**: Tema **Claro** — base branca/cinza clara, acentos neutros e profissionais
- [ ] **THEM-04**: Tema **Escuro** — dark mode com fundo `#0f1117`, superfícies `#1a1d27`, acentos em índigo/violeta
- [ ] **THEM-05**: Tema **Verde** — tons de esmeralda/floresta (`#065f46`, `#10b981`), remetendo à área médica
- [ ] **THEM-06**: Tema **Azul** — azul cobalto/marinho (`#1e40af`, `#3b82f6`), estilo clínico clássico
- [ ] **THEM-07**: Tema **Vermelho** — vermelho cardinal (`#991b1b`, `#ef4444`), tom de urgência/energia
- [ ] **THEM-08**: Tema **Roxo** — violeta/lavanda (`#4c1d95`, `#8b5cf6`), estilo moderno e distinto
- [ ] **THEM-09**: Tema **Laranja** — âmbar/caramelo (`#92400e`, `#f59e0b`), tom caloroso e motivacional
- [ ] **THEM-10**: Seletor de tema acessível na barra de navegação (ícone de paleta + dropdown/modal)
- [ ] **THEM-11**: Preferência de tema persistida em `localStorage` — mantida após reload e entre sessões
- [ ] **THEM-12**: Todos os gráficos (linha, barras, pizza) adaptam suas cores primárias ao tema ativo
- [ ] **THEM-13**: Transição suave ao trocar de tema (CSS `transition` nas variáveis — `200ms ease`)

### Tests — Backend

- [ ] **TEST-01**: Cobertura de testes unitários ≥ 80% em todos os Services (JUnit 5 + Mockito)
- [ ] **TEST-02**: Testes unitários para todos os Controllers (MockMvc + Spring Test)
- [ ] **TEST-03**: Testes de validação: verificar que DTOs com dados inválidos retornam 400
- [ ] **TEST-04**: Testes de segurança: endpoints protegidos retornam 401 sem token

### Tests — Frontend

- [ ] **TEST-05**: Testes unitários para Components críticos (Dashboard, BancoDados, Flashcards)
- [ ] **TEST-06**: Testes unitários para todos os Angular Services (HttpClient mockado)
- [ ] **TEST-07**: Testes de NgRx reducers (estado inicial, cada action)
- [ ] **TEST-08**: Testes de NgRx effects (mocking de services)

---

## v2 Requirements

### Notificações

- **NOTF-01**: Notificação in-app quando há revisões atrasadas ao fazer login
- **NOTF-02**: E-mail diário com resumo de revisões do dia

### Exportação

- **EXPO-01**: Exportar sessões para CSV
- **EXPO-02**: Exportar relatório de desempenho em PDF

### Gamificação

- **GAMI-01**: Badges por milestone (100 questões, 30 dias de streak, etc.)
- **GAMI-02**: Metas semanais configuráveis

### Mobile

- **MOBI-01**: Progressive Web App (PWA) para uso offline básico

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Aplicativo mobile nativo | Web-first; alta complexidade; v2+ |
| Multi-usuário / multi-tenant | Instância pessoal na v1; auth isola por usuário |
| Upload de PDFs e imagens de questões | Risco de segurança, storage complexo; v2+ |
| Integração com bancos de questões externos | API licensing; fora do escopo inicial |
| Deploy em cloud (AWS, GCP, Azure) | Ambiente local na v1; v2+ |
| OAuth2/SSO (Google, etc.) | Email/senha suficiente para v1 |
| Chat ou comunidade | Não é core value |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Pending |
| INFR-02 | Phase 1 | Pending |
| INFR-03 | Phase 2 | Pending |
| INFR-04 | Phase 3 | Pending |
| INFR-05 | Phase 1 | Pending |
| INFR-06 | Phase 1 | Pending |
| AUTH-01 | Phase 3 | Pending |
| AUTH-02 | Phase 3 | Pending |
| AUTH-03 | Phase 3 | Pending |
| AUTH-04 | Phase 3 | Pending |
| AUTH-05 | Phase 3 | Pending |
| AUTH-06 | Phase 3 | Pending |
| AUTH-07 | Phase 3 | Pending |
| BACK-01 | Phase 2 | Pending |
| BACK-02 | Phase 2 | Pending |
| BACK-03 | Phase 2 | Pending |
| BACK-04 | Phase 2 | Pending |
| BACK-05 | Phase 2 | Pending |
| BACK-06 | Phase 2 | Pending |
| BACK-07 | Phase 3 | Pending |
| SECU-01 | Phase 3 | Pending |
| SECU-02 | Phase 3 | Pending |
| SECU-03 | Phase 2 | Pending |
| SECU-04 | Phase 3 | Pending |
| SECU-05 | Phase 2 | Pending |
| SECU-06 | Phase 3 | Pending |
| SECU-07 | Phase 3 | Pending |
| DASH-01..10 | Phase 6 | Pending |
| BNCO-01..07 | Phase 4 | Pending |
| SIML-01..06 | Phase 5 | Pending |
| PLAN-01..06 | Phase 5 | Pending |
| AREA-01..03 | Phase 6 | Pending |
| TEMA-01..03 | Phase 6 | Pending |
| REVI-01..07 | Phase 7 | Pending |
| FLSH-01..08 | Phase 7 | Pending |
| THEM-01..13 | Phase 8 | Pending |
| TEST-01..04 | Phase 12 | Pending |
| TEST-05..08 | Phase 13 | Pending |

**Coverage:**
- v1 requirements: 85 total (+ 13 theming)
- Mapped to phases: 85
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-05*
*Last updated: 2026-05-05 — added THEM-01..13 (multi-theme color system)*
