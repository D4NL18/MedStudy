# Plano de Execução - Phase 25: Grupos de Competição Automatizados (Gymrats style)

Este plano detalha as tarefas, alterações de arquivos e entregáveis necessários para a implementação do módulo de grupos de competição automatizados e duelos 1v1 rápidos (Milestone v1.2), alinhado com as decisões de arquitetura de banco de dados e design acordadas em `25-CONTEXT.md`.

## Objetivos
1. **Banco de Dados (Flyway)**: Criar tabelas `competitions` e `competition_participants` com integridade referencial, índices e chaves compostas.
2. **Modelos de Negócio no Backend**:
   - Mapear enums para tipos de competição (`GROUP`, `DUEL_TIME`, `DUEL_TARGET`), tipo de métrica (`TOTAL_QUESTIONS`, `CORRECT_QUESTIONS`), status da competição (`PENDING`, `ACTIVE`, `FINISHED`) e status dos participantes (`INVITED`, `ACCEPTED`, `DECLINED`).
   - Implementar entidades JPA `Competition` e `CompetitionParticipant` (com ID embutido composto `@Embeddable` `CompetitionParticipantId`).
3. **Lógica de Agregação de Ranking Dinâmico**:
   - Calcular pontuações de ranking dinamicamente através de somatórios agregados (`SUM(qtsFeitas)` ou `SUM(qtsCorretas)`) na tabela `study_sessions` dentro da janela específica do desafio.
4. **Listener e Encerramento Automático de Duelo por Meta**:
   - Implementar método reativo no `CompetitionService` acionado ao final de salvar/atualizar sessões de estudo que verifica se alguma meta de corrida foi atingida, alterando o status da competição para `FINISHED` e coroando o vencedor.
5. **REST Controller**: Criar endpoints seguros para listagem de desafios, criação de competições, aceitar/recusar convites e busca de ranking (leaderboards).
6. **Frontend Store & API Service**: Mapear modelos em TypeScript, implementar `competition.service.ts` e configurar a Store do NgRx (actions, effects, reducer) para gerenciamento reativo e unificado de estado.
7. **Visual Premium Dashboard (UI)**:
   - Criar componente `/competicoes` com design premium glassmorphism, HSL tailord, micro-animações, abas separadas e um pódio estilizado com coroas luminosas para o Top 3.
   - Renderizar gráficos dinâmicos de barra/linha comparativos de progresso acumulado usando o pacote `@swimlane/ngx-charts`.

---

## 🛠️ Tarefas de Implementação

### 1. Database & Migrations
- [ ] **Migration**: Criar `V18__create_competitions_tables.sql` na pasta `backend/src/main/resources/db/migration/`:
  - Tabela `competitions` contendo id, título, criador, tipo, métrica, meta, datas de início/fim, status, timestamps.
  - Tabela `competition_participants` mapeando chaves estrangeiras compostas, status do convite e timestamp de aceite.
  - Adicionar índices: `idx_competitions_creator` e `idx_competition_participants_user`.

### 2. Backend: Enums e Entidades JPA
- [ ] **Enums**: Criar `CompetitionType.java`, `MetricType.java`, `CompetitionStatus.java` e `ParticipantStatus.java` no pacote `com.medstudy.backend.modules.competition.entity`.
- [ ] **Embeddable composite key**: Criar `CompetitionParticipantId.java` mapeando `competitionId` e `userId`.
- [ ] **JPA Entities**:
   - Criar `Competition.java` estendendo `BaseEntity` com relacionamentos apropriados.
   - Criar `CompetitionParticipant.java` mapeando a associação composta.

### 3. Backend: DTOs e MapStruct Mappers
- [ ] **DTOs**:
  - `CompetitionRequestDTO`: Dados de criação (Título, Tipo, Métrica, Meta, data inicial, data final e lista de IDs dos amigos convidados).
  - `CompetitionResponseDTO`: Dados estruturados da competição incluindo status e metadados.
  - `LeaderboardEntryDTO`: Nome, handle, avatar_preset, score e posição no ranking de cada participante.
- [ ] **Mapper**: Criar `CompetitionMapper.java` usando MapStruct para converter entidades e DTOs de forma limpa.

### 4. Backend: Camada de Persistência e Serviços
- [ ] **Repositories**:
  - Criar `CompetitionRepository.java` e `CompetitionParticipantRepository.java`.
- [ ] **Competition Service (`CompetitionService.java`)**:
  - No método de criação: Validar se todos os convidados são amigos do criador, salvar a competição, adicionar o criador automaticamente como `ACCEPTED` e criar convites (`INVITED`) com notificações sociais in-app associadas (`COMPETITION_INVITE` ou `DUEL_INVITE`).
  - No método de aceitação/recusa: Atualizar o status do participante e do joined_at, validando restrições de datas.
  - No cálculo de leaderboard: Executar queries de somatório acumulado na tabela de sessões para cada participante aceito.
  - No verificador de duelos de meta `checkActiveDuels`: Buscar corridas `DUEL_TARGET` ativas em que o usuário participa. Se a soma atual do usuário atingir a meta, fechar o duelo como `FINISHED` e enviar alerta de parabéns ao vencedor e derrotado.

### 5. Backend: Controladores e Integração
- [ ] **REST Controller (`CompetitionController.java`)**: Mapear endpoints com controle de acesso para o criador e participantes.
- [ ] **Sessões de Estudo (`StudySessionService.java`)**: Injetar `CompetitionService` e invocar `checkActiveDuels` de forma assíncrona ou síncrona logo após registrar ou atualizar sessões de estudo.

### 6. Frontend: Models, Services & Store
- [ ] **Angular Models & Service**: Criar `competition.model.ts` e `competition.service.ts` no frontend consumindo a API REST do Spring Boot.
- [ ] **Store NgRx**:
  - Criar `competition.actions.ts`, `competition.reducer.ts` e `competition.effects.ts` para lidar reativamente com o CRUD de competições, leaderboards e toasts.

### 7. Frontend: Painel de Competições Premium (UI)
- [ ] **Componente `/competicoes`**:
  - Criar `competicoes.component.ts`, `competicoes.component.html` e `competicoes.component.scss`.
  - Design premium: Cards glassmorphism translúcidos, HSL harmonious, micro-animações, pódio 3D estilizado com coroa luminosa para o 1º lugar.
  - Abas: "Grupos Ativos", "Duelos 1v1", "Convites Pendentes".
  - Quadro de Líderes completo com busca reativa integrada.
  - Formulário modal flutuante impecável para criação de novos desafios e seleção multitag de amigos amigos convidados.
  - Integrar gráficos de barras/linhas acumulativos da biblioteca `@swimlane/ngx-charts` comparando o avanço dinâmico de acertos dos competidores.
- [ ] **Navigation & Shell**:
  - Adicionar o link lazy-loaded em `app.routes.ts`.
  - Colocar o link de navegação "Competições" no menu lateral e no drawer mobile em `shell.component.html` com o ícone Lucide `target` ou `award`.

---

## 🔍 Plano de Verificação (UAT)

### 1. Fluxo de Convite e Notificações
- **UAT 25.1**: Usuário A cria um duelo 1v1 por meta, definindo "Questões Corretas" com meta de 20 questões e convidando Usuário B.
  - Usuário B deve receber instantaneamente a notificação social in-app sob o tipo `DUEL_INVITE`.
  - Ao entrar na aba "Convites" na tela `/competicoes` de B, o card do convite deve estar perfeitamente formatado.
  - Ao clicar em "Aceitar", o status do participante é atualizado no banco e o duelo é movido reativamente para a seção de duelos ativos de B.

### 2. Painel de Competição & Leaderboard Top 3
- **UAT 25.2**: Em um grupo de competição com 4 participantes ativos (A, B, C, D) criado para 7 dias:
  - O leaderboard dinâmico deve exibir os 3 primeiros colocados no pódio 3D premium com medalhas brilhantes e o primeiro lugar com uma linda coroa dourada luminosa.
  - O progresso de cada participante deve ser renderizado reativamente e ordenado de forma decrescente pelo volume somado de questões acumuladas na janela de datas.

### 3. Encerramento Dinâmico de Duelo por Meta
- **UAT 25.3**: Em um duelo `DUEL_TARGET` com limite de 30 questões de métrica "Total de Questões Feitas" entre A e B:
  - Usuário B realiza uma nova sessão de estudo registrando 35 questões feitas.
  - O sistema do backend intercepta a sessão e deve reverter o status do duelo para `FINISHED` de forma imediata.
  - A visualização do duelo na tela `/competicoes` de ambos os usuários deve mudar instantaneamente o badge para "CONCLUÍDO", coroando B como vencedor oficial.
  - Novas sessões de estudo realizadas por A após o término não devem alterar o ranking final estabelecido.

### 4. Gráficos Comparativos Dinâmicos
- **UAT 25.4**: Na visualização detalhada de qualquer competição ativa com dados reais de sessões:
  - O gráfico de barras comparativas do `@swimlane/ngx-charts` deve renderizar sem travamentos, escalando dinamicamente de acordo com as pontuações e adaptando-se organicamente a telas mobile e desktop.
