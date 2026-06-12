import { createAction, props } from '@ngrx/store';


/**
 * NgRx actions for the Analytics feature slice.
 * @description Defines the action creators used to dispatch state changes for Analytics.
 */
export interface AreaAnalytics {
  grandeArea: string;
  totalQuestions: number;
  accuracy: number;
  sessionsCount: number;
  trendShort: number;
  trendLong: number;
  performanceLevel: string;
}

export interface TopicAnalytics {
  tema: string;
  grandeArea: string;
  totalQuestions: number;
  accuracy: number;
  sessionsCount: number;
  trendShort: number;
  trendLong: number;
  performanceLevel: string;
}

export const loadAreaAnalytics = createAction('[Analytics] Load Area Analytics');
export const loadAreaAnalyticsSuccess = createAction(
  '[Analytics] Load Area Analytics Success',
  props<{ areas: AreaAnalytics[] }>()
);
export const loadAreaAnalyticsFailure = createAction(
  '[Analytics] Load Area Analytics Failure',
  props<{ error: any }>()
);

export const loadTopicAnalytics = createAction('[Analytics] Load Topic Analytics');
export const loadTopicAnalyticsSuccess = createAction(
  '[Analytics] Load Topic Analytics Success',
  props<{ topics: TopicAnalytics[] }>()
);
export const loadTopicAnalyticsFailure = createAction(
  '[Analytics] Load Topic Analytics Failure',
  props<{ error: any }>()
);
