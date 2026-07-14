import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RevisionSummary, StudySession, PaginatedResponse, RedistributionPreviewRequest, RedistributionDraftResponse } from '@core/models/revision.model';


/**
 * NgRx actions for the Revision feature slice.
 * @description Defines the action creators used to dispatch state changes for Revision.
 */
export const RevisionActions = createActionGroup({
  source: 'Revision',
  events: {
    'Load Summary': emptyProps(),
    'Load Summary Success': props<{ summary: RevisionSummary }>(),
    'Load Summary Failure': props<{ error: string }>(),
    'Load Sessions': props<{ filter: string, page?: number, size?: number, search?: string }>(),
    'Load Sessions Success': props<{ response: PaginatedResponse<StudySession> }>(),
    'Load Sessions Failure': props<{ error: string }>(),
    
    // Redistribution
    'Preview Redistribution': props<{ request: RedistributionPreviewRequest }>(),
    'Preview Redistribution Success': props<{ response: RedistributionDraftResponse }>(),
    'Preview Redistribution Failure': props<{ error: string }>(),
    
    'Apply Redistribution': props<{ draftId: string }>(),
    'Apply Redistribution Success': emptyProps(),
    'Apply Redistribution Failure': props<{ error: string }>(),
    
    'Clear Redistribution Draft': emptyProps()
  }
});
