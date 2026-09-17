# Regras de Negócio: Visualização de Flashcard sob Demanda (Preview)

Documentação gerada pela skill `business-rules-expert` para a funcionalidade de consulta rápida e modo de leitura de flashcards na listagem.

---

### [P-030] Ação de Visualização sob Demanda na Listagem de Flashcards
- **Descrição:** A tabela de flashcards (`FlashcardsListComponent`) DEVE exibir, na coluna de ações de cada linha, um botão de ação com o ícone de olho (`lucide-icon name="eye"`), estilizado no padrão `icon-btn` com rótulo de acessibilidade `aria-label="Visualizar flashcard"`.
- **Comportamento:** Ao clicar no ícone de olho, o sistema DEVE abrir o flashcard selecionado no modo de visualização interativa instantânea.
- **Isolamento de Estudo:** Esta ação DEVE operar de forma independente da fila de revisão diária ("Estudar Hoje"), permitindo a visualização de qualquer cartão, independentemente da data de próxima revisão (`proximaRevisao`) ou do estado de conclusão diária.

---

### [P-031] Modo Somente Leitura (Read-Only / Preview)
- **Descrição:** Quando o flashcard for aberto a partir da ação de visualização da tabela, o componente de exibição (`FlashcardsStudyComponent`) DEVE operar em modo de visualização estrita (`isReadOnly = true`).
- **Interações Permitidas:**
  1. O usuário PODE alternar livremente entre a frente (pergunta) e o verso (resposta) clicando sobre a face do cartão ou no hint de rotação, preservando a animação e o renderizador de markdown/TipTap.
  2. O usuário PODE ampliar imagens contidas no card (Zoom Overlay) com clique na imagem e fechar o zoom.
  3. O usuário PODE fechar a visualização a qualquer instante pelo botão de fechar (`x`).
- **Restrições Rígidas (O que NÃO deve acontecer):**
  1. Os botões de resultado ("Acertei" e "Errei") NÃO DEVEM ser exibidos em hipótese alguma no modo somente leitura.
  2. Os botões de classificação de dificuldade ("Fácil", "Médio", "Difícil") NÃO DEVEM ser exibidos.
  3. Nenhuma chamada de API para computação de agendamento algorítmico (`rateFlashcard`) ou repetição espaçada DEVE ser disparada. O histórico, facilidade (`easeFactor`), intervalo e data de revisão do flashcard DEVEM permanecer inalterados.
  4. No cabeçalho da visualização, deve ser exibido o título semântico "Visualização de Flashcard" e o botão de fechar, omitindo a contagem e barra de progresso da sessão de estudo.
