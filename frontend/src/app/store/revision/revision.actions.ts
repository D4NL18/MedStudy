import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RevisionSummary, StudySession } from '../../core/models/revision.model';

export const RevisionActions = createActionGroup({
  source: 'Revision',
  events: {
    'Load Summary': emptyProps(),
    'Load Summary Success': props<{ summary: RevisionSummary }>(),
    'Load Summary Failure': props<{ error: string }>(),
    'Load Sessions': props<{ filter: 'ATRASADAS' | 'HOJE' | 'FUTURAS' | 'CONCLUIDAS' }>(),
    'Load Sessions Success': props<{ sessions: StudySession[] }>(),
    'Load Sessions Failure': props<{ error: string }>(),
  }
});
