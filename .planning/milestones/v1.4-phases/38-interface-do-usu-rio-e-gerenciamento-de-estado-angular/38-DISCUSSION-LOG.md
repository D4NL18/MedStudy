# Phase 38 Discussion Log

## 1. Posicionamento do Botão "Reorganizar Atrasos"
- **Options Presented:** Dashboard principal vs. Aba específica vs. Flutuante.
- **User Selection:** Um botão dentro da aba de "Revisão intervalada" e deve reorganizar apenas as revisões, e nao os flashcards.
- **Notes:** Confirmado escopo exclusivo para revisões intervaladas, deixando flashcards de fora da lógica desta aba.

## 2. Estrutura do Modal de Preview
- **Options Presented:** Simples, Detalhado, Básico (Tem Certeza).
- **User Selection:** Modal detalhado: Data estimada, aviso e um breve resumo em texto de como a carga ficou distribuída.
- **Notes:** A exibição gráfica mais profunda ficará para a fase 39, mas o preview textual já dará uma boa ideia da distribuição.

## 3. Gerenciamento do Draft ID
- **Options Presented:** Estado Local vs. Estado Global (NgRx).
- **User Selection:** Estado Global (NgRx): O draftId fica salvo na Store. Se o usuário fechar o modal e voltar em seguida, podemos recuperar o rascunho se ainda for válido.
- **Notes:** Mais robusto e tolerante a falhas.
