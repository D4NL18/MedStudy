import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SimuladosState, adapter } from './simulados.reducer';


/**
 * NgRx selectors for the Simulados feature slice.
 * @description Provides memoized queries to extract Simulados state from the store.
 */
export const selectSimuladosState = createFeatureSelector<SimuladosState>('simulados');

const { selectAll } = adapter.getSelectors();

export const selectAllSimulados = createSelector(
  selectSimuladosState,
  selectAll
);

export const selectSimuladosLoading = createSelector(
  selectSimuladosState,
  (state) => state.loading
);

export const selectSimuladosError = createSelector(
  selectSimuladosState,
  (state) => state.error
);

export const selectSimuladosFilters = createSelector(
  selectSimuladosState,
  (state) => state.filters
);

export const selectSimuladosTotalCount = createSelector(
  selectSimuladosState,
  (state) => state.totalCount
);
