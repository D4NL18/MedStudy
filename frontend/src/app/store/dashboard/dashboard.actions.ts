import { createAction, props } from '@ngrx/store';

export interface DashboardKPIs {
  sessions: {
    total: number;
    completed: number;
    accuracy: number;
  };
  simulados: {
    total: number;
    averageAccuracy: number;
  };
  currentStreak: number;
  strongArea: string;
  weakArea: string;
}

export const loadDashboard = createAction('[Dashboard] Load Dashboard');

export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Dashboard Success',
  props<{ kpis: DashboardKPIs }>()
);

export const loadDashboardFailure = createAction(
  '[Dashboard] Load Dashboard Failure',
  props<{ error: any }>()
);
