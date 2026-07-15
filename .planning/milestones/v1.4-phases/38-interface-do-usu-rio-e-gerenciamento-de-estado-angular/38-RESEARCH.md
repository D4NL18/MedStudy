# Phase 38 Research: Interface do Usuário e Gerenciamento de Estado (Angular)

## Overview
This phase handles the UI for reorganizing delayed study sessions (revisões atrasadas). 
It focuses on integrating the backend endpoints built in Phase 37 into the Angular 18 frontend using NgRx state management.

## Codebase Findings
1. **Component Location:**
   - The button should be placed in evisao-list.component.html within the header actions when the ATRASADAS tab is active.
   - A modal component (eorganize-modal.component.ts) needs to be created, likely under src/app/features/revisao/components/.

2. **Models Needed:**
   - We need interfaces for RedistributionPreviewRequest, RedistributionDraftResponse, and potentially the daily summary mapping object.
   - These should be added to a new model or inside src/app/core/models/revision.model.ts (or edistribution.model.ts).

3. **NgRx Store (Revision Feature):**
   - The state is located in src/app/store/revision/.
   - The RevisionState needs to be extended to hold a edistributionDraft (ID and metadata like maxDate, limitWarning).
   - New actions needed: Preview Redistribution, Preview Redistribution Success/Failure, Apply Redistribution, Apply Redistribution Success/Failure.
   - The effect will call the new RedistributionService (or extended RevisionService).

4. **Service Integration:**
   - Need to create edistribution.service.ts or add to evision.service.ts to call:
     - POST /api/redistribute/preview
     - POST /api/redistribute/apply/{draftId}
     
## Missing Pieces & Dependencies
- A new Modal Component for confirmation. We can use the existing Dialog or Modal pattern in the app (like ResetModal).
- The draft state must be cleared when applied or when the modal is closed (or optionally preserved since it's global, as discussed).

## Next Step
Proceed to planning.
