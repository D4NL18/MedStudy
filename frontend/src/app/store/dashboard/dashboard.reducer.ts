import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';


/**
 * NgRx reducer for the Dashboard feature slice.
 * @description Handles state transitions in response to dispatched Dashboard actions.
 */
export interface DashboardState {
  kpis: DashboardActions.DashboardKPIs | null;
  loading: boolean;
  error: any;
}

export const initialState: DashboardState = {
  kpis: null,
  loading: false,
  error: null
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.loadDashboard, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DashboardActions.loadDashboardSuccess, (state, { kpis }) => ({
    ...state,
    kpis: { ...kpis },
    loading: false
  })),
  on(DashboardActions.loadDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
