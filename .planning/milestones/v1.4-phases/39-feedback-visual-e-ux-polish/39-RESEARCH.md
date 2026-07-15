# Phase 39 Research: Feedback Visual e UX Polish

## Goal
Implementar o feedback visual para a reorganização inteligente de revisões, incluindo gráficos de Antes e Depois usando `ngx-charts`, estado de loading com skeletons, e uma animação de sucesso.

## Current State Analysis

### 1. Backend Preview Data (`RedistributionPreviewResponse`)
Atualmente, o `RedistributionPreviewResponse` no backend (Java) contém:
- `draftId`
- `warningLimitExceeded`
- `totalFlashcardsRedistributed`
- `daysSpread`

**Missing:** Ele não retorna a carga diária de revisões (Antes vs Depois).
- Precisaremos adicionar uma lista de dados diários (`DailyLoadDto`) ao response.
- O cálculo no `FlashcardRedistributionService` precisará consultar quantos flashcards já estão agendados para os dias da janela `[today, targetEndDate]`.
- O "Antes" do dia atual (`today`) deve incluir todos os flashcards atrasados, criando o visual de "Pico de acúmulo no dia atual".
- O "Depois" do dia atual será apenas o que já estava agendado + a nova parcela do draft para hoje.
- Para os dias futuros, o "Depois" será o "Antes" + a parcela do draft.

### 2. Frontend Component (`ReorganizeModalComponent`)
Atualmente, exibe uma lista `<ul>` simples com os totais.
- Será necessário importar o componente de gráfico de barras agrupadas do `@swimlane/ngx-charts` (`ngx-charts-bar-vertical-2d`).
- Converter a lista de `DailyLoadDto` do backend no formato esperado pelo ngx-charts:
  ```json
  [
    {
      "name": "13/07",
      "series": [
        { "name": "Antes", "value": 150 },
        { "name": "Depois", "value": 30 }
      ]
    },
    ...
  ]
  ```

### 3. Loading State (Skeletons)
- Atualmente, o modal usa um spinner simples (`<div class="spinner"></div>`).
- A decisão é substituir isso por Skeletons. Podemos criar classes CSS com animação `pulse` simulando as barras do gráfico de Antes e Depois, ou o espaço que o gráfico ocupará.

### 4. Success Animation
- O `applyDraft` no componente atualmente dispara a Action e fecha o modal imediatamente (`this.closeModal()`).
- Precisaremos alterar para:
  1. Aguardar o sucesso da Action (`Actions` do `@ngrx/effects`).
  2. Alterar uma flag de estado local (`showSuccess = true`).
  3. Renderizar uma tela/ícone de sucesso (ex: `lucide-angular` check-circle com classe de animação scale/fade).
  4. Usar `setTimeout` de 2000ms para chamar `this.closeModal()`.

## Validation Architecture
- **Backend:** Testes unitários para garantir que os cálculos do Before/After estão corretos.
- **Frontend:** Verificar se o estado de loading do skeleton é visível durante o request do preview, e se a animação de sucesso aparece após aplicar o draft.
