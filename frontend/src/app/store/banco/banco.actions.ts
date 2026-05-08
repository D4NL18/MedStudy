import { createAction, props } from '@ngrx/store';
import { QuestionSession, QuestionSessionFilters } from '../../core/models/question-session.model';

export const loadSessions = createAction(
  '[Banco] Load Sessions',
  props<{ filters: QuestionSessionFilters; append: boolean }>()
);

export const loadSessionsSuccess = createAction(
  '[Banco] Load Sessions Success',
  props<{ sessions: QuestionSession[]; totalCount: number; append: boolean }>()
);

export const loadSessionsFailure = createAction(
  '[Banco] Load Sessions Failure',
  props<{ error: string }>()
);

export const createSession = createAction(
  '[Banco] Create Session',
  props<{ session: Partial<QuestionSession> }>()
);

export const createSessionSuccess = createAction(
  '[Banco] Create Session Success',
  props<{ session: QuestionSession }>()
);

export const createSessionFailure = createAction(
  '[Banco] Create Session Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[Banco] Update Filters',
  props<{ filters: Partial<QuestionSessionFilters> }>()
);

export const updateSession = createAction(
  '[Banco] Update Session',
  props<{ id: string; session: Partial<QuestionSession> }>()
);

export const updateSessionSuccess = createAction(
  '[Banco] Update Session Success',
  props<{ session: QuestionSession }>()
);

export const updateSessionFailure = createAction(
  '[Banco] Update Session Failure',
  props<{ error: string }>()
);

export const deleteSession = createAction(
  '[Banco] Delete Session',
  props<{ id: string }>()
);

export const deleteSessionSuccess = createAction(
  '[Banco] Delete Session Success',
  props<{ id: string }>()
);

export const deleteSessionFailure = createAction(
  '[Banco] Delete Session Failure',
  props<{ error: string }>()
);
