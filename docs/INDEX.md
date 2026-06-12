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

---

## 7. Padrões de Engenharia e Clean Code

A manutenção da excelência técnica é inegociável. Para assegurar a escalabilidade, a legibilidade e a estabilidade da base de código do MedStudy, todos os desenvolvedores devem aderir estritamente às seguintes diretrizes e convenções de Clean Code:

### 7.1. Tipagem Forte e Contratos Rigorosos
- **Tipagem Estrita Obrigatória**: É expressamente proibido o uso do tipo `any` no TypeScript (Frontend) ou a omissão de tipos genéricos no Java (Backend). Todos os retornos de funções, parâmetros e variáveis devem possuir tipagem explícita e formalmente definida.
- **Utilização Sistemática de Interfaces e DTOs**: A comunicação entre camadas — e em especial o tráfego de dados via API — deve ser mediada por Interfaces (no Frontend) e por DTOs (Data Transfer Objects, no Backend). As entidades do banco de dados (Models) jamais devem ser expostas diretamente nas respostas da API.
- **Imutabilidade e Records**: No Backend (Java 21), utilize ativamente a estrutura `record` para DTOs, favorecendo a imutabilidade dos dados em trânsito e reduzindo códigos *boilerplate*.

### 7.2. Princípio da Responsabilidade Única (SRP)
- **Desacoplamento Sistêmico**: Componentes e Serviços devem possuir uma única razão para mudar. Funções não devem exceder o escopo de suas responsabilidades originais. Se um serviço está formatando dados, validando fluxos e executando lógica de negócio simultaneamente, ele deve ser particionado em componentes menores e mais coesos.
- **Injeção de Dependências Otimizada**: Favoreça a injeção de dependências via construtor (tanto no Spring Boot quanto no Angular) para garantir a integridade da classe e maximizar a cobertura e a facilidade na criação de testes unitários.

### 7.3. Nomenclatura Intencional e Expressividade
- **Nomes Altamente Descritivos**: Variáveis, métodos e classes devem revelar sua intenção intrínseca de forma cristalina. Evite abreviações (ex: prefira `calculateMonthlyStreakAnalytics` em vez de `calcMthStrk`). O código deve ser autoexplicativo, reduzindo a dependência excessiva de comentários em linha.
- **Eliminação de *Magic Numbers/Strings***: Valores literais soltos no código que ditam regras de negócio devem ser impreterivelmente encapsulados em Constantes globais nomeadas ou `Enums` (ex: `MAX_LOGIN_ATTEMPTS = 5`).

### 7.4. Resiliência e Tratamento de Erros
- **Falha Rápida (Fail-Fast)**: Valide os dados nas fronteiras do sistema (nos *Controllers* com `@Valid` e no Frontend utilizando *Reactive Forms*). Inputs corrompidos devem ser barrados antes de tocarem a camada de domínio.
- **Padronização Global de Exceções**: O Backend não deve retornar *stack traces* não tratados. Utilize exceções de domínio (ex: `UserNotAuthorizedException`) geridas por um `GlobalExceptionHandler` (`@ControllerAdvice`) para garantir que todos os erros de API sigam um contrato visual previsível.

---

## 8. Workflow de Desenvolvimento (Como Criar Novas Funcionalidades)

Para garantir a consistência e previsibilidade ao longo de todo o ciclo de desenvolvimento, a implementação de qualquer nova funcionalidade (seja ela um pequeno componente, uma nova página ou um CRUD completo) deve seguir rigorosamente o *Pipeline* de Engenharia estabelecido abaixo.

### Passo 1: Construção e Tipagem no Backend (Spring Boot)
Toda funcionalidade que manipula dados duráveis se inicia obrigatoriamente no Backend:
1. **Entidade (Model)**: Crie a sua classe de domínio mapeada (anotação `@Entity`) no pacote do módulo correspondente em `src/main/java/.../modules/seu_modulo/entity/`.
2. **Repositório**: Defina a interface herdando de `JpaRepository` dentro de `.../repository/` para habilitar a persistência no banco de dados.
3. **DTOs e Contratos (Records)**: Estabeleça as fronteiras de entrada e saída da API mapeando-as como `Records` (Java 21) na pasta `.../dto/` (Ex: `CreateFeatureRequest`, `FeatureResponse`). Nunca trafegue a sua Entidade de Banco de Dados de volta para o cliente.
4. **Service (Regras de Negócio)**: Crie uma classe anotada com `@Service` para abrigar a lógica puramente transacional da funcionalidade. É **expressamente proibido** alocar regras de negócio ou lógicas operacionais em *Controllers*.
5. **Controller (Entrypoint)**: Exponha o seu recurso na API REST através de um `@RestController`. Garanta que a semântica dos verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) seja tratada rigorosamente.
6. **Testes do Backend (Prevenção de Regressões)**: 
   - Desenvolva os testes isolados para o seu `Service` dentro de `src/test/java/...` utilizando a biblioteca **Mockito**.
   - Execute localmente `./mvnw test` e valide não apenas o seu novo teste, mas certifique-se de que a malha inteira compila e finaliza sem quebrar outras áreas (Zero Regressão).

### Passo 2: Consumo e Interface no Frontend (Angular 18)
Com o Backend operante, avance para a SPA respeitando a sua arquitetura baseada em *Standalone Components*:
1. **Modelos Base (Interfaces)**: Espelhe exatamente o DTO/Record exposto pelo Backend declarando uma `Interface` TypeScript dedicada, idealmente em `/shared/models/`.
2. **Serviços (API Calls)**: Isole a lógica de comunicação HTTP através de um novo serviço injetável (`@Injectable`) localizado em `/core/services/` (ou dentro do seu escopo de feature), tipando o retorno via `Observable<T>`.
3. **Páginas e Componentes**:
   - Para interfaces completas de rota (Páginas), hospede-as em `/features/seu_modulo/pages/`.
   - Para as menores unidades fragmentadas e reutilizáveis (modais, tabelas personalizadas, formulários base), crie-as em `/features/seu_modulo/components/` ou em `/shared/components/`.
4. **Fidelidade ao Design System e UI**: A interface de usuário do seu componente deve herdar exclusivamente as variáveis globais de CSS/SCSS (tipografia, bordas e espaçamentos). O componente deve ser fluido o suficiente para não quebrar a coesão quando o aluno alternar entre o *Light/Dark Mode* ou navegar por um dos outros 6 temas coloridos suportados pela aplicação. Valores estáticos ou *hardcoded* em arquivos CSS paralelos serão rejeitados.

### Passo 3: Auditoria Final de Qualidade
Antes de acoplar sua *feature* ao branch principal (*Pull Request*), siga este *checklist* mandatório de mitigação de riscos:
1. **Testes Visuais e Locais (Jasmine/Karma)**: Acesse o arquivo gerado `.spec.ts` respectivo ao seu componente para mapear e testar os cenários de interação e renderização fundamentais. Execute `npm test` no terminal do frontend, validando se o seu novo código não comprometeu outros diretórios.
2. **Auditoria de UX Manual (Smoke Test)**: Suba as aplicações localmente e navegue pela rota desenvolvida em `http://localhost:4200`. Inspecione o terminal e certifique-se de que nenhum fluxo dispara falhas ou resíduos não tratados no *DevTools* do navegador.
3. **Zero Impacto (Princípio de Não Agressão)**: Caso a sua implementação exija refatorar um `Service` ou `Component` clássico e preexistente para se adaptar, é seu dever confirmar que o fluxo antigo dependente desta classe não foi fragmentado, repetindo exaustivamente testes manuais na ponta de acesso do usuário anterior.
