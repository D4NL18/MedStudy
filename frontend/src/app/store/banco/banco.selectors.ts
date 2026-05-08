import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BancoState, adapter } from './banco.reducer';

export const selectBancoState = createFeatureSelector<BancoState>('banco');

const { selectAll } = adapter.getSelectors();

export const selectAllSessions = createSelector(
  selectBancoState,
  selectAll
);

export const selectBancoLoading = createSelector(
  selectBancoState,
  (state) => state.loading
);

export const selectBancoError = createSelector(
  selectBancoState,
  (state) => state.error
);

export const selectBancoFilters = createSelector(
  selectBancoState,
  (state) => state.filters
);

export const selectBancoTotalCount = createSelector(
  selectBancoState,
  (state) => state.totalCount
);
