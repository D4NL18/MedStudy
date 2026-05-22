# Contexto de Decisão - Phase 25: Grupos de Competição Automatizados (Gymrats style)

Este documento registra as decisões de design, requisitos técnicos e caminhos de implementação para o módulo de grupos e competições automatizadas (Milestone v1.2), alinhado com o feedback do usuário.

---

## 🔒 Decisões Homologadas pelo Usuário

### 📊 1. Métrica de Pontuação do Ranking
* **Decisão**: A métrica de cálculo será configurável no momento da criação da competição pelo criador.
* **Opções Suportadas**:
  * **Total de Questões Resolvidas**: Soma de todas as questões realizadas (`qtsFeitas`) no período.
  * **Apenas Questões Corretas**: Soma de todas as questões respondidas corretamente (`qtsCorretas`) no período.
* **Justificativa**: Permite flexibilidade de objetivos (incentivo ao volume vs. busca por excelência e precisão).

### ⚔️ 2. Mecanismo de Duelos 1v1
* **Decisão**: Serão suportados **ambos** os tipos de duelos rápidos:
  * **Duelo por Meta (Corrida)**: Os dois participantes competem para ver quem atinge um volume pré-estabelecido de questões primeiro (ex: corrida de 50 ou 100 questões).
  * **Duelo por Tempo (Maior Pontuação)**: Competição em uma janela de tempo fixa (ex: 24h, 48h, 72h) para ver quem pontua mais.
* **Regra de Término**:
  * O duelo por Meta encerra-se automaticamente no instante em que o primeiro participante cruza o limite (`targetValue`).
  * O duelo por Tempo encerra-se automaticamente ao atingir o prazo final (`endTime`).

### ✉️ 3. Fluxo de Convites e Participação
* **Decisão**: Fluxo de **Convite Formal**.
* **Funcionamento**:
  1. O usuário A cria a competição ou duelo e seleciona um ou mais amigos.
  2. Os participantes convidados recebem um registro na tabela de relacionamentos com status `INVITED`.
  3. Uma notificação social (`COMPETITION_INVITE` ou `DUEL_INVITE`) é disparada para os convidados.
  4. O participante convidado deve clicar em "Aceitar" ou "Recusar" no painel. Apenas após aceitar ele passa a figurar ativamente e a acumular pontos no ranking dinâmico.

### 🌐 4. Localização na Interface do Usuário (UI)
* **Decisão**: **Rota Principal Dedicada (`/competicoes`)**.
* **Layout**:
  * Um painel premium completo que se destaca no menu principal/sidebar.
  * Dashboard de competições contendo:
    * Seção de Competições de Grupos Ativas.
    * Seção de Duelos 1v1 (Ativos e Histórico).
    * Aba de Convites Recebidos pendentes de resposta.
    * Gráficos dinâmicos de barras/linhas comparativos de progresso (utilizando `@swimlane/ngx-charts`).
    * Quadro de Líderes (Leaderboard) com avatares circulares interativos.

---

## 🛠️ Arquitetura e Modelagem Técnica

### 1. Database Schema (Flyway)
Criaremos um arquivo de migração `V18__create_competitions_tables.sql`:
* **Tabela `competitions`**:
  * `id` UUID/BIGINT PRIMARY KEY.
  * `title` VARCHAR(100) NOT NULL.
  * `creator_id` FK para `users`.
  * `competition_type` VARCHAR(30) NOT NULL (`GROUP`, `DUEL_TIME`, `DUEL_TARGET`).
  * `metric_type` VARCHAR(30) NOT NULL (`TOTAL_QUESTIONS`, `CORRECT_QUESTIONS`).
  * `target_value` INT (para `DUEL_TARGET`).
  * `start_time` TIMESTAMP NOT NULL.
  * `end_time` TIMESTAMP NOT NULL.
  * `status` VARCHAR(20) NOT NULL (`PENDING`, `ACTIVE`, `FINISHED`).
  * `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP.

* **Tabela `competition_participants`**:
  * `competition_id` FK para `competitions`.
  * `user_id` FK para `users`.
  * `status` VARCHAR(20) NOT NULL (`INVITED`, `ACCEPTED`, `DECLINED`).
  * `joined_at` TIMESTAMP NULL.
  * `PRIMARY KEY (competition_id, user_id)`.

### 2. Lógica do Ranking (Backend)
O ranking é calculado em tempo real a partir das sessões de estudo registradas na tabela `study_sessions` dentro da janela da competição:
* **Query Otimizada**:
  ```sql
  SELECT SUM(s.qts_feitas) OR SUM(s.qts_corretas)
  FROM study_sessions s
  WHERE s.user_id = :userId
    AND s.data_sessao >= :startDate
    AND s.data_sessao <= :endDate
  ```
* Se o duelo for do tipo `DUEL_TARGET` e o `SUM` atingir o `target_value` pela primeira vez, o status da competição avança automaticamente para `FINISHED` e o participante é coroado vencedor.

---

## 🔍 Próximos Passos
1. **Discuss Phase**: Discussão e alinhamento concluídos.
2. **Implementation Plan**: Elaborar o plano detalhado de implementação no `implementation_plan.md` listando todas as alterações na store do NgRx, models, controllers do Spring e componentes da nova tela de competições.
3. **Approval**: Solicitar aprovação do usuário sobre o plano técnico de execução da Phase 25.
