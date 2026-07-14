# Phase 38 Plan: Interface do Usuário e Gerenciamento de Estado (Angular)

## Objective
Implementar a interface de usuário (UI) e o gerenciamento de estado (NgRx) para a funcionalidade de Reorganizar Atrasos, focando apenas na aba de Revisões Intervaladas.

## Pre-requisites
- Backend da Fase 37 (Endpoints de preview e apply) concluído.
- Angular 18, Standalone Components.

## Plan

### 1. Data Models and Service Layer
1. Adicionar interfaces no arquivo src/app/core/models/revision.model.ts:
   - RedistributionPreviewRequest
   - RedistributionDraftResponse (com draftId, maxDate, dailyDistribution map, limitExceeded warning)
2. Atualizar/Criar Service:
   - Adicionar métodos no serviço que gerencia revisões (src/app/core/services/revision.service.ts ou criar um específico edistribution.service.ts) para chamar POST /api/redistribute/preview e POST /api/redistribute/apply/{draftId}.

### 2. NgRx State Management
1. Atualizar src/app/store/revision/revision.actions.ts:
   - Adicionar actions: previewRedistribution, previewRedistributionSuccess, previewRedistributionFailure.
   - Adicionar actions: pplyRedistribution, pplyRedistributionSuccess, pplyRedistributionFailure.
   - Adicionar action: clearRedistributionDraft.
2. Atualizar src/app/store/revision/revision.reducer.ts:
   - Adicionar edistributionDraft (tipo RedistributionDraftResponse | null) e isRedistributing (boolean) ao estado inicial.
   - Tratar as novas actions para popular o rascunho.
3. Atualizar src/app/store/revision/revision.effects.ts:
   - Adicionar Effect para chamar o serviço no previewRedistribution e disparar o Success.
   - Adicionar Effect para o pplyRedistribution. No Success, deve recarregar o sumário de revisões (loadSummary / loadSessions) e limpar o draft.

### 3. Reorganize Modal Component
1. Criar novo componente ReorganizeModalComponent em src/app/features/revisao/components/reorganize-modal/.
2. Implementar Input/Output (ou consumir o store diretamente usando inject/Store).
3. UI do Modal:
   - Apresentar input para selecionar a data final (ou manter padrão de distribuir igualmente).
   - Ao alterar data, disparar Action de preview e exibir loading.
   - Exibir limitWarning caso exceda o limite configurado do usuário.
   - Mostrar texto resumo da distribuição diária.
   - Botão Confirmar que dispara a action de Apply. Botão Cancelar que fecha o modal.

### 4. Integration with Revisão List
1. Em src/app/features/revisao/pages/revisao-list/revisao-list.component.html:
   - Inserir botão "Reorganizar Atrasos" na header (aparecer apenas se houver atrasadas).
   - Conectar o botão para abrir o Modal de Reorganizar.
   - Adicionar o elemento do Modal no HTML, vinculado a uma variável de controle isReorganizeModalOpen.

### 5. Verification
1. 
pm start para garantir que o projeto compila.
2. Interagir com o botão, verificar no DevTools se as Actions do NgRx disparam corretamente.
3. Verificar a integração com o backend via UAT.
