# Entidade / Feature: Visualização de Flashcard sob Demanda (Preview Mode)

Este documento centraliza todo o planejamento, as especificações e as etapas de execução para a feature de visualização de flashcards.

## 1. Dúvidas Resolvidas (Especificação)
- **Dúvida:** A visualização deve afetar as métricas ou a fila de estudo de repetição espaçada?
  - **Decisão:** Não. A visualização é puramente consultiva. O estado de estudo diário, contadores e intervalos devem permanecer intactos.
- **Dúvida:** Qual componente visual deve ser utilizado para exibir o flashcard?
  - **Decisão:** Reutilizar o `FlashcardsStudyComponent` (que já possui layout responsivo de flashcard com virada frente/verso, suporte a Markdown e zoom de imagens), parametrizado pelo estado global do NgRx com a flag `isReadOnly: true`.
- **Dúvida:** Como deve se comportar o cabeçalho no modo de visualização?
  - **Decisão:** Exibir badge/título informativo "Modo de Visualização" e o botão de fechar (`x`), sem expor contadores de fila ou barra de progresso da sessão de estudo diário.

---

## 2. Tarefas e Etapas de Desenvolvimento

### Tarefa 1: Visualização de Flashcard na Tabela e Modo Somente Leitura no Estudo

**Descritivo Detalhado:**
Implementação no Frontend (Angular 18 / NgRx) de uma nova ação na tabela de flashcards (`flashcards-list.component.html`) com o ícone de olho (`lucide-icon name="eye"`). Ao clicar, o card é enviado para o estado do NgRx através de `FlashcardsActions.openPreviewMode({ flashcard })`. O componente `FlashcardsStudyComponent` detecta o modo de visualização (`isReadOnly = true`), exibindo o cartão com suporte completo a alternância de face (frente/verso), renderizador Markdown/TipTap e zoom em imagens, porém bloqueando a exibição dos blocos de botões de resultado ("Acertei" / "Errei") e classificação de dificuldade ("Fácil", "Médio", "Difícil"). Ao fechar (`close`), o estado é resetado sem efeitos colaterais na fila ou backend.

**Critérios de Aceite:**
- [x] [P-030] Na coluna de Ações de cada linha da tabela de flashcards, deve haver um botão com ícone de olho (`eye`), com acessibilidade `aria-label="Visualizar flashcard"` e estilo condizente com os outros botões de ação (`icon-btn`).
- [x] [P-030] Clicar no botão de olho abre o flashcard correspondente em tela cheia/overlay através da infraestrutura de estudo existente.
- [x] [P-031] O flashcard pode ser virado (frente/verso) clicando no cartão ou na dica inferior ("Clique para ver a resposta" / "Clique para ver a pergunta").
- [x] [P-031] No modo de visualização, os botões de "Acertei" e "Errei" e os botões de "Fácil", "Médio" e "Difícil" NÃO DEVEM ser exibidos em nenhum momento.
- [x] [P-031] Clicar no botão de fechar (`x`) encerra a visualização e limpa o estado.
- [x] [P-031] Nenhuma requisição de alteração de progresso (`rateFlashcard`) é disparada para o backend.

**Etapas de Execução (Checklist Técnico):**
- [x] **Etapa 1:** Atualizar NgRx Actions e Reducer (`flashcards.actions.ts`, `flashcards.reducer.ts`) para incluir a ação `openPreviewMode` e o seletor `selectIsReadOnly`.
- [x] **Etapa 2:** Atualizar `FlashcardsStudyComponent` (`.html` e `.ts`) para consumir `isReadOnly$` e condicionar a exibição do cabeçalho e dos botões de resposta/dificuldade.
- [x] **Etapa 3:** Atualizar `FlashcardsListComponent` (`.html` e `.ts`) para adicionar o botão de olho na coluna de ações e despachar a ação de abertura em preview.
- [x] **Etapa 4:** Desenvolver testes unitários abrangentes cobrindo a abertura de preview, o isolamento dos botões no template e os reducers do NgRx.
- [x] **Etapa 5:** Executar build completo e testes no frontend assegurando conformidade estrita.

**Audit (Testes e Validação):**
- [x] **Cenário 1:** Renderização da tabela: verificar se o ícone de olho é renderizado na coluna de ações de cada flashcard.
- [x] **Cenário 2:** Abertura do modo de visualização: clicar no ícone de olho e validar se a modal/overlay abre com os dados do cartão selecionado.
- [x] **Cenário 3:** Flip do cartão: clicar no cartão e confirmar que a face alterna entre pergunta e resposta sem erros.
- [x] **Cenário 4:** Ausência de botões de estudo: verificar que mesmo com o cartão virado, os botões "Errei", "Acertei", "Fácil", "Médio" e "Difícil" NÃO aparecem.
- [x] **Cenário 5:** Fechamento: clicar no botão `x` e verificar que a visualização fecha imediatamente e a listagem permanece operacional.
- [x] **Cenário 6:** Preservação de dados: confirmar que nenhuma chamada HTTP de avaliação é emitida no modo preview.
