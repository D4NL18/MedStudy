# Arquitetura e Mapeamento de Domínio: MedStudy

Este documento estabelece o mapeamento estrutural e arquitetural do repositório **MedStudy**, detalhando as responsabilidades, divisões sistêmicas e as principais regras de negócio subjacentes a cada domínio da plataforma. O MedStudy é um ecossistema educacional de alta performance voltado para o aprimoramento contínuo de médicos e estudantes de medicina, estruturado em uma arquitetura robusta dividida entre uma API Backend (Spring Boot) e uma Single Page Application Frontend (Angular).

---

## 1. Visão Geral da Solução (Core Purpose)

O propósito central do repositório é prover a base tecnológica para uma experiência de estudo orientada a dados. A plataforma viabiliza a otimização da preparação para residência médica e provas de título de especialista por meio de metodologias ativas de aprendizado, como repetição espaçada (Spaced Repetition), testes simulados e análise métrica de desempenho em tempo real.

---

## 2. Domínios de Negócio e Regras Sistêmicas

A arquitetura do projeto adota uma abordagem modular orientada ao domínio (Domain-Driven). Abaixo, detalhamos os módulos de backend (espelhados por componentes autônomos no frontend) e suas principais regras de negócio:

### 2.1. Gestão de Identidade e Acesso (`auth`, `user`, `profile`)
- **Responsabilidade**: Garantir o controle de acesso seguro, o onboarding de novos alunos e a manutenção dos perfis.
- **Principais Regras de Negócio**:
  - **Autenticação Segura**: Implementação de tokens JWT injetados via cookies `HttpOnly` para mitigar ataques XSS.
  - **Prevenção de Abusos**: Rastreamento e bloqueio temporário de tentativas sucessivas de login falhas (`LoginAttemptService`).
  - **Sessões Prolongadas**: Uso de rotação de *Refresh Tokens* para manter a sessão do usuário ativa sem comprometer a segurança.
  - **Integridade de Perfil**: Obrigatoriedade de preenchimento de preferências e áreas de interesse médico para habilitar a curadoria automática de conteúdo.

### 2.2. Avaliação e Simulações Práticas (`simulado`)
- **Responsabilidade**: Orquestrar a geração, a submissão e a auditoria de exames simulados.
- **Principais Regras de Negócio**:
  - **Geração Dinâmica**: Criação de simulados baseados em filtros complexos, como instituição, grandes áreas da medicina (Clínica Médica, Cirurgia, etc.) e subtemas.
  - **Cálculo de Aproveitamento**: As submissões acionam processos de autocorreção em tempo real, retroalimentando as estatísticas globais do aluno com a taxa de acerto por disciplina.

### 2.3. Active Recall e Repetição Espaçada (`flashcard`, `revision`)
- **Responsabilidade**: Facilitar a memorização de longo prazo utilizando algoritmos de agendamento cognitivo.
- **Principais Regras de Negócio**:
  - **Agendamento Algorítmico**: O `SpacedRepetitionService` calcula a próxima data de revisão de um flashcard com base no feedback qualitativo do usuário (Fácil, Médio, Difícil). Erros encurtam drasticamente o intervalo, enquanto acertos o expandem exponencialmente.
  - **Fila de Revisão Diária**: Apenas cartões cujo tempo de maturação expirou são apresentados no ciclo diário de estudos do aluno.

### 2.4. Telemetria e Hábitos de Estudo (`sessao`, `aula`)
- **Responsabilidade**: Registrar o consumo de conteúdo didático e rastrear a volumetria de estudo.
- **Principais Regras de Negócio**:
  - **Rastreamento de Sessões**: O sistema valida e contabiliza o tempo de estudo ativo (Study Sessions), distinguindo sessões manuais de cronômetros pomodoro, alimentando o cálculo de constância (streak) do usuário.
  - **Controle de Progresso**: O consumo de vídeo-aulas gera checkpoints de visualização, impedindo a perda de contexto e permitindo a retomada exata.

### 2.5. Inteligência de Dados e Métricas (`analytics`, `dashboard`)
- **Responsabilidade**: Consolidar dados brutos de todos os módulos para fornecer *insights* acionáveis.
- **Principais Regras de Negócio**:
  - **Agregação Analítica**: O `AnalyticsService` processa dados assíncronos das sessões, simulados e revisões para plotar gráficos de evolução mensal, projetar o desempenho futuro e calcular a constância de acesso (Streaks).

### 2.6. Engajamento, Gamificação e Social (`feed`, `friendship`, `notificacao`, `gamificacao`, `competition`)
- **Responsabilidade**: Estimular a retenção do aluno por meio de mecânicas de jogos e interação comunitária.
- **Principais Regras de Negócio**:
  - **Distribuição de Conquistas (Badges)**: O `BadgeSchedulerService` audita periodicamente os marcos atingidos pelos usuários (ex: "7 dias seguidos de estudo" ou "100 questões acertadas em Cirurgia") e concede troféus automaticamente.
  - **Feed em Tempo Real**: Através de conexões SSE (Server-Sent Events), os usuários recebem atualizações imediatas sobre as conquistas de amigos, fomentando um ambiente colaborativo e competitivo.
  - **Competições Ranqueadas**: Competições fechadas entre usuários onde as pontuações são atualizadas em lote, considerando critérios específicos (ex: precisão em Cardiologia durante o final de semana).

---

## 3. Topologia de Pontos de Entrada (API Entrypoints)

A camada de interface da API (Controllers RESTful) expõe os serviços de forma padronizada. Os recursos seguem a taxonomia de prefixos listada abaixo:

- **Segurança & Identidade**: `/api/auth`, `/api/profiles`
- **Métricas & Visão Geral**: `/api/dashboard`, `/api/analytics`
- **Consumo Didático**: `/api/lessons`, `/api/study-sessions`
- **Prática Acadêmica**: `/api/simulados`, `/api/flashcards`, `/api/revisoes`
- **Interação Social & Feed**: `/api/feed`, `/api/friendships`, `/api/notifications`
- **Gamificação**: `/api/competitions`, `/api/badges`
- **Utilitários**: `/api/export` (Exportação de relatórios em CSV/PDF)

---

## 4. Arquitetura de Dados (Esquema Relacional)

A persistência de dados opera primariamente sob um banco relacional (PostgreSQL), gerenciado via JPA/Hibernate. As entidades de domínio refletem as regras supracitadas:

- **Core Domains**: `User`, `Profile` e `RefreshToken`.
- **Learning Objects**: `Lesson`, `Flashcard`, `Simulado`.
- **Tracking & History**: `StudySession` e agregações de submissões.
- **Social Graph**: `Friendship` (autorreferenciada), `FeedEvent` e `SocialNotification`.
- **Gamification Tree**: `Competition`, `CompetitionParticipant` e `UserBadge`.

---

## 5. Garantia de Qualidade (Testes)

A política de engenharia do repositório engloba uma suíte de testes rigorosa para assegurar a integridade das regras de negócio:

- **Backend (API)**: 
  - Fundamentado em `JUnit 5` e `Mockito` para testes unitários isolados, complementados pelo `Spring Boot Test` para validações de integração.
  - *Execução*: Utiliza-se o wrapper do Maven (`./mvnw test` dentro de `/backend`).
- **Frontend (SPA)**:
  - Baseado em `Jasmine` provido pelo `Karma` test runner para garantir o isolamento e comportamento das diretivas e signals do Angular.
  - *Execução*: Processado via script NPM (`npm run test` dentro de `/frontend`).

---

## 6. Orquestração Local (Ambiente de Desenvolvimento)

A infraestrutura local é provisionada para garantir um ambiente agnóstico e de rápida inicialização:

1. **Infraestrutura de Banco de Dados**:
   Inicializado através de contêineres Docker, injetando as variáveis do `.env`:
   ```bash
   cp .env.example .env
   docker-compose up -d
   ```
2. **Subida do Backend (Spring Boot)**:
   A API é executada via Maven e estará escutando requisições locais.
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
3. **Subida do Frontend (Angular)**:
   O client web é processado via Webpack/Vite do Angular CLI.
   ```bash
   cd frontend
   npm install
   npm start
   ```
   > *Acesso à Interface Web: `http://localhost:4200`*
   > *Acesso ao OpenAPI/Swagger Interativo: `http://localhost:8080/api/docs`*
