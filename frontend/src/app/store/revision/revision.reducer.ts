import { createFeature, createReducer, on } from '@ngrx/store';
import { RevisionSummary, StudySession, RedistributionDraftResponse } from '@core/models/revision.model';
import { RevisionActions } from './revision.actions';


/**
 * NgRx reducer for the Revision feature slice.
 * @description Handles state transitions in response to dispatched Revision actions.
 */
export interface RevisionState {
  summary: RevisionSummary | null;
  sessions: StudySession[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  redistributionDraft: RedistributionDraftResponse | null;
  isRedistributing: boolean;
}

export const initialState: RevisionState = {
  summary: null,
  sessions: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  searchQuery: '',
  loading: false,
  error: null,
  redistributionDraft: null,
  isRedistributing: false,
};

export const revisionFeature = createFeature({
  name: 'revision',
  reducer: createReducer(
    initialState,
    on(RevisionActions.loadSummary, (state) => ({ ...state, loading: true })),
    on(RevisionActions.loadSummarySuccess, (state, { summary }) => ({ ...state, summary, loading: false })),
    on(RevisionActions.loadSummaryFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(RevisionActions.loadSessions, (state, { search, page }) => ({ 
      ...state, 
      loading: true, 
      searchQuery: search !== undefined ? search : state.searchQuery,
      currentPage: page !== undefined ? page : state.currentPage
    })),
    on(RevisionActions.loadSessionsSuccess, (state, { response }) => ({ 
      ...state, 
      sessions: response.content, 
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      currentPage: response.number,
      pageSize: response.size,
      loading: false 
    })),
    on(RevisionActions.loadSessionsFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(RevisionActions.previewRedistribution, (state) => ({ ...state, isRedistributing: true, error: null })),
    on(RevisionActions.previewRedistributionSuccess, (state, { response }) => ({ ...state, isRedistributing: false, redistributionDraft: response })),
    on(RevisionActions.previewRedistributionFailure, (state, { error }) => ({ ...state, isRedistributing: false, error })),
    on(RevisionActions.applyRedistribution, (state) => ({ ...state, isRedistributing: true, error: null })),
    on(RevisionActions.applyRedistributionSuccess, (state) => ({ ...state, isRedistributing: false, redistributionDraft: null })),
    on(RevisionActions.applyRedistributionFailure, (state, { error }) => ({ ...state, isRedistributing: false, error })),
    on(RevisionActions.clearRedistributionDraft, (state) => ({ ...state, redistributionDraft: null }))
  ),
});

export const {
  name,
  reducer,
  selectRevisionState,
  selectSummary,
  selectSessions,
  selectTotalElements,
  selectTotalPages,
  selectCurrentPage,
  selectPageSize,
  selectSearchQuery,
  selectLoading,
  selectError,
  selectRedistributionDraft,
  selectIsRedistributing,
} = revisionFeature;
