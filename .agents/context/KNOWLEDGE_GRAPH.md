# Knowledge Graph & Project Memory

## Core Features & Completed Domains

### FLASHCARDS
- **Repetição Espaçada & Distribuição Futura (Story 1):** Novos cards são distribuídos em vales dos próximos dias usando algoritmo de carga de revisão para balancear o estudo diário. Edição suporta parsing bidirecional de TipTap e HTML.
- **Visualização sob Demanda / Modo Leitura (Story 2 - [P-030], [P-031]):**
  - **Ação na Tabela:** Botão `icon-btn` com ícone `eye` e `aria-label="Visualizar flashcard"` na coluna Ações de cada linha em `FlashcardsListComponent`.
  - **Ação NgRx:** Despacha `FlashcardsActions.openPreviewMode({ flashcard })`.
  - **Estado:** `FlashcardsState.isReadOnly: true`, `studyModeActive: true`, `queue: [flashcard]`.
  - **Comportamento Visual (`FlashcardsStudyComponent`):** Exibe o flashcard interativo com virada frente/verso, Markdown, TipTap e zoom em imagens. Oculta barra de progresso da sessão e suprime estritamente os botões de resultado ("Acertei" / "Errei") e botões de dificuldade ("Fácil", "Médio", "Difícil"). Nenhuma chamada de API de rating ou agendamento é disparada. Fechamento via `closeStudyMode` reseta `isReadOnly: false`.

### GAMIFICAÇÃO, FLASHCARDS & MAESTRIA CLÍNICA ([P-040], [P-041], [P-042], [P-050], [P-060], [P-070])
- **Micro-Mecânicas de Flashcards (Tópico 1):**
  - **Combo & Foco em Chamas ([P-040]):** HUD dinâmico na sessão de estudo. Aumenta em +1 com "Fácil" e "Médio". Dispara "Foco Quente 🔥" aos 5x (1.5x XP) e "Em Chamas ⚡🔥" aos 10x (2.0x XP). Reseta para 0 ao marcar "Difícil" ou errar.
  - **Bounty Cards ("Cards Sangrentos" - [P-042]):** Mapeados via `consecutiveHardCount >= 2` ou `easeFactor < 1.7`. Exibem moldura carmesim pulsante (`bounty-glow`) e badge "BOUNTY CARD • 3x XP".
  - **Inbox Zero / Celebração ([P-041]):** Ao zerar a fila do dia, exibe modal de vitória com animação de confetti, troféu dourado e métricas da sessão (total de cards, tempo de sessão, média de seg/card, precisão % e maior combo).
- **Árvore de Maestria Clínica Anatômica ([P-050]):**
  - Componente SVG interativo `CorpoHumanoMaestriaComponent` no Dashboard principal com as 5 grandes áreas médicas (Clínica Médica `#3B82F6`, Cirurgia Geral `#F97316`, Pediatria `#10B981`, GO `#EC4899`, Preventiva `#EAB308`).
  - Gradientes dinâmicos de preenchimento (`fill`) pelos 7 Níveis: Iniciante (0-14%), Bronze (15-29%), Prata (30-44%), Ouro (45-59%), Platina (60-74%), Rubi (75-84%), Esmeralda (85-94%), Diamante (95-100%).
  - Cálculo ponderado no backend: 50% questões/acerto, 30% flashcards/retenção, 20% aulas concluídas via `ClinicalMasteryService` em `GET /api/dashboard/maestria-clinica`.
- **Streak Repair (Tópico 4 - [P-060]):**
  - Se a ofensiva quebrou ontem, o usuário tem 24h para resgatar mediante meta de estudo intensivo (20 cards). Cooldown de 14 dias para evitar abuso. Bridge persistida na tabela `streak_repairs` da migration `V24` e integrada no cálculo de streak.
  - Exibido via `StreakRepairBannerComponent` no Dashboard.
- **22 Conquistas de Flashcards ([P-070]):**
  - Enum `BadgeType` estendido com 22 badges `FLASH_*` e novo contexto `BadgeContext.FLASHCARD_SESSION`. Suporte visual no perfil e celebrações.
