import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { QuestionSession, QuestionSessionFilters } from '@core/models/question-session.model';
import * as BancoActions from './banco.actions';


/**
 * NgRx reducer for the Banco feature slice.
 * @description Handles state transitions in response to dispatched Banco actions.
 */
export interface BancoState extends EntityState<QuestionSession> {
  loading: boolean;
  error: string | null;
  totalCount: number;
  filters: QuestionSessionFilters;
}

export const adapter: EntityAdapter<QuestionSession> = createEntityAdapter<QuestionSession>();

export const initialState: BancoState = adapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    page: 0,
    size: 10,
    sort: 'dataSessao,desc'
  }
});

export const bancoReducer = createReducer(
  initialState,
  on(BancoActions.loadSessions, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BancoActions.loadSessionsSuccess, (state, { sessions, totalCount, append }) => {
    if (append) {
      return adapter.addMany(sessions, {
        ...state,
        loading: false,
        totalCount
      });
    } else {
      return adapter.setAll(sessions, {
        ...state,
        loading: false,
        totalCount
      });
    }
  }),
  on(BancoActions.loadSessionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(BancoActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { 
      ...state.filters, 
      ...filters, 
      page: filters.page !== undefined ? filters.page : 0 
    }
  })),
  on(BancoActions.createSessionSuccess, (state, { session }) => 
    adapter.addOne(session, { ...state, totalCount: state.totalCount + 1 })
  ),
  on(BancoActions.updateSessionSuccess, (state, { session }) => 
    adapter.updateOne({ id: session.id, changes: session }, state)
  ),
  on(BancoActions.deleteSessionSuccess, (state, { id }) => 
    adapter.removeOne(id, { ...state, totalCount: state.totalCount - 1 })
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
