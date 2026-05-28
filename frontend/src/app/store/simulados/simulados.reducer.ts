import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Simulado, SimuladoFilters } from '../../core/models/simulado.model';
import * as SimuladosActions from './simulados.actions';

export interface SimuladosState extends EntityState<Simulado> {
  loading: boolean;
  error: string | null;
  totalCount: number;
  filters: SimuladoFilters;
}

export const adapter: EntityAdapter<Simulado> = createEntityAdapter<Simulado>();

export const initialState: SimuladosState = adapter.getInitialState({
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    page: 0,
    size: 10
  }
});

export const simuladosReducer = createReducer(
  initialState,
  on(SimuladosActions.loadSimulados, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SimuladosActions.loadSimuladosSuccess, (state, { simulados, totalCount, append }) => {
    if (append) {
      return adapter.addMany(simulados, {
        ...state,
        loading: false,
        totalCount
      });
    } else {
      return adapter.setAll(simulados, {
        ...state,
        loading: false,
        totalCount
      });
    }
  }),
  on(SimuladosActions.loadSimuladosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(SimuladosActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { 
      ...state.filters, 
      ...filters, 
      page: filters.page !== undefined ? filters.page : 0 
    }
  })),
  on(SimuladosActions.createSimuladoSuccess, (state, { simulado }) => 
    adapter.addOne(simulado, { ...state, totalCount: state.totalCount + 1 })
  ),
  on(SimuladosActions.updateSimuladoSuccess, (state, { simulado }) => 
    adapter.updateOne({ id: simulado.id, changes: simulado }, state)
  ),
  on(SimuladosActions.deleteSimuladoSuccess, (state, { id }) => 
    adapter.removeOne(id, { ...state, totalCount: state.totalCount - 1 })
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
