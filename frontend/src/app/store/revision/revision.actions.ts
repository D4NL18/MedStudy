import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RevisionSummary, StudySession, PaginatedResponse } from '@core/models/revision.model';


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
  }
});
