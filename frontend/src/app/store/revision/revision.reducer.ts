import { createFeature, createReducer, on } from '@ngrx/store';
import { RevisionSummary, StudySession } from '../../core/models/revision.model';
import { RevisionActions } from './revision.actions';

export interface RevisionState {
  summary: RevisionSummary | null;
  sessions: StudySession[];
  loading: boolean;
  error: string | null;
}

export const initialState: RevisionState = {
  summary: null,
  sessions: [],
  loading: false,
  error: null,
};

export const revisionFeature = createFeature({
  name: 'revision',
  reducer: createReducer(
    initialState,
    on(RevisionActions.loadSummary, (state) => ({ ...state, loading: true })),
    on(RevisionActions.loadSummarySuccess, (state, { summary }) => ({ ...state, summary, loading: false })),
    on(RevisionActions.loadSummaryFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(RevisionActions.loadSessions, (state) => ({ ...state, loading: true, sessions: [] })),
    on(RevisionActions.loadSessionsSuccess, (state, { sessions }) => ({ ...state, sessions, loading: false })),
    on(RevisionActions.loadSessionsFailure, (state, { error }) => ({ ...state, error, loading: false })),
  ),
});

export const {
  name,
  reducer,
  selectRevisionState,
  selectSummary,
  selectSessions,
  selectLoading,
  selectError,
} = revisionFeature;
