import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnalyticsState } from './analytics.reducer';

export const selectAnalyticsState = createFeatureSelector<AnalyticsState>('analytics');

export const selectAreaAnalytics = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.areas
);

export const selectTopicAnalytics = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.topics
);

export const selectAnalyticsLoading = createSelector(
  selectAnalyticsState,
  (state: AnalyticsState) => state.loading
);
