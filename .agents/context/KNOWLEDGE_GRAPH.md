# Knowledge Graph & Project Memory

## Core Features & Completed Domains

### FLASHCARDS
- **Repetição Espaçada & Distribuição Futura (Story 1):** Novos cards são distribuídos em vales dos próximos dias usando algoritmo de carga de revisão para balancear o estudo diário. Edição suporta parsing bidirecional de TipTap e HTML.
- **Visualização sob Demanda / Modo Leitura (Story 2 - [P-030], [P-031]):**
  - **Ação na Tabela:** Botão `icon-btn` com ícone `eye` e `aria-label="Visualizar flashcard"` na coluna Ações de cada linha em `FlashcardsListComponent`.
  - **Ação NgRx:** Despacha `FlashcardsActions.openPreviewMode({ flashcard })`.
  - **Estado:** `FlashcardsState.isReadOnly: true`, `studyModeActive: true`, `queue: [flashcard]`.
  - **Comportamento Visual (`FlashcardsStudyComponent`):** Exibe o flashcard interativo com virada frente/verso, Markdown, TipTap e zoom em imagens. Oculta barra de progresso da sessão e suprime estritamente os botões de resultado ("Acertei" / "Errei") e botões de dificuldade ("Fácil", "Médio", "Difícil"). Nenhuma chamada de API de rating ou agendamento é disparada. Fechamento via `closeStudyMode` reseta `isReadOnly: false`.
