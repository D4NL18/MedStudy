import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardKPIs = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.kpis
);

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading
);

export const selectAreaAnalytics = createSelector(
  selectDashboardKPIs,
  (kpis) => kpis?.areaAnalytics || []
);

export const selectTopErrors = createSelector(
  selectDashboardKPIs,
  (kpis) => kpis?.topErrors || []
);

export const selectDashboardError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.error
);
