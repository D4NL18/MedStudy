import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RevisionSummary, StudySession, PaginatedResponse } from '@core/models/revision.model';

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
