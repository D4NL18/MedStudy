import { createAction, props } from '@ngrx/store';

export interface AreaAnalytics {
  grandeArea: string;
  totalQuestions: number;
  accuracy: number;
  sessionsCount: number;
  trendShort: number;
  trendLong: number;
  performanceLevel: string;
}

export interface TopicError {
  tema: string;
  grandeArea: string;
  totalQuestions: number;
  errorRate: number;
}

export interface DashboardKPIs {
  sessions: {
    totalSessions: number;
    totalQuestions: number;
    successRate: number;
    performanceLevel: string;
  };
  simulados: {
    totalSimulados: number;
    averageScore: number;
    bestArea: string;
    worstArea: string;
  };
  currentStreak: number;
  strongArea: string;
  weakArea: string;
  areaAnalytics: AreaAnalytics[];
  topErrors: TopicError[];
  evolution: { label: string; value: number; }[];
  recentBadges: any[];
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
