import { createReducer, on } from '@ngrx/store';
import * as AnalyticsActions from './analytics.actions';


/**
 * NgRx reducer for the Analytics feature slice.
 * @description Handles state transitions in response to dispatched Analytics actions.
 */
export interface AnalyticsState {
  areas: AnalyticsActions.AreaAnalytics[];
  topics: AnalyticsActions.TopicAnalytics[];
  loading: boolean;
  error: any;
}

export const initialState: AnalyticsState = {
  areas: [],
  topics: [],
  loading: false,
  error: null
};

export const analyticsReducer = createReducer(
  initialState,
  on(AnalyticsActions.loadAreaAnalytics, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AnalyticsActions.loadAreaAnalyticsSuccess, (state, { areas }) => ({
    ...state,
    areas,
    loading: false
  })),
  on(AnalyticsActions.loadAreaAnalyticsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AnalyticsActions.loadTopicAnalytics, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AnalyticsActions.loadTopicAnalyticsSuccess, (state, { topics }) => ({
    ...state,
    topics,
    loading: false
  })),
  on(AnalyticsActions.loadTopicAnalyticsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
