# Phase 39 Plan: Feedback Visual e UX Polish

## 1. Backend: Atualizar DTOs e Cálculos
- **Arquivo**: `backend/src/main/java/com/medstudy/backend/modules/flashcard/dto/DailyLoadDto.java`
  - Criar DTO com `date` (LocalDate), `originalCount` (int), e `newCount` (int).
- **Arquivo**: `backend/src/main/java/com/medstudy/backend/modules/flashcard/dto/RedistributionPreviewResponse.java`
  - Adicionar `List<DailyLoadDto> dailyLoads` ao response.
- **Arquivo**: `backend/src/main/java/com/medstudy/backend/modules/flashcard/service/FlashcardRedistributionService.java`
  - Buscar a contagem atual (originalCount) de revisões agrupadas por data entre `hoje` e `targetEndDate`.
  - Atribuir todo o montante de cartões *atrasados* (overdue) para a data de *hoje* no `originalCount`.
  - Calcular o `newCount` baseando-se no `originalCount` e na nova distribuição que foi feita no draft (somando as alocações daquele dia aos cards que já estavam alocados e não estavam atrasados).
  - Preencher a lista `dailyLoads` do DTO de resposta.

## 2. Frontend: Modelos e Componente Gráfico
- **Arquivo**: `frontend/src/app/core/models/revision.model.ts`
  - Adicionar interface `DailyLoadDto` e listá-la no `RedistributionDraftResponse`.
- **Arquivo**: `frontend/src/app/features/revisao/components/reorganize-modal/reorganize-modal.component.ts`
  - Adicionar propriedades locais para os dados do gráfico (`chartData: any[]`).
  - No `ngOnInit` ou com um subscription em `draft$`, transformar os `dailyLoads` recebidos no formato `{ name, series: [ { name: 'Antes', value }, { name: 'Depois', value } ] }`.
  - Lidar com o estado de sucesso criando `showSuccess = false` e alterando `applyDraft()` para dar set nessa variável após sucesso (precisa ouvir a action correspondente no effect usando `Actions` do `@ngrx/effects`).
- **Arquivo**: `frontend/src/app/features/revisao/components/reorganize-modal/reorganize-modal.component.html`
  - Substituir o spinner simples da classe `.loading-state` e o "Carregando..." do `.loading-overlay` por divs com uma classe `skeleton`.
  - Usar a tag `ngx-charts-bar-vertical-2d` com os dados do gráfico e cores customizadas (vermelho para Antes, verde para Depois).
  - Implementar um bloco `*ngIf="showSuccess"` exibindo a animação (ex: `<lucide-icon name="check-circle" class="success-icon"></lucide-icon>`) com uma transição CSS scale/fade-in.
- **Arquivo**: `frontend/src/app/features/revisao/components/reorganize-modal/reorganize-modal.component.scss`
  - Estilizar a animação do Skeleton Loader (`@keyframes pulse`).
  - Estilizar o layout do gráfico e ajustar os tamanhos dentro do modal.
  - Estilizar a `success-icon` e seu container para sobrepor o modal e dar fade.

## 3. Testes Unitários
- **Backend**: Testes na Service `FlashcardRedistributionService` verificando o correto cálculo e preenchimento de `DailyLoadDto` na geração do Preview.
- **Frontend**: Mock do `draft$` no teste do `ReorganizeModalComponent` para validar se os dados estão sendo formatados corretamente para o `ngx-charts` e se a UI do skeleton é mostrada/escondida corretamente.
