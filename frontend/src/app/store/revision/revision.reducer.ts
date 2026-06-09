import { createFeature, createReducer, on } from '@ngrx/store';
import { RevisionSummary, StudySession } from '../../core/models/revision.model';
import { RevisionActions } from './revision.actions';

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
} = revisionFeature;
