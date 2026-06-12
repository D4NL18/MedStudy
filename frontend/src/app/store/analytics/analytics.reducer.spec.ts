import { analyticsReducer, initialState } from './analytics.reducer';
import * as AnalyticsActions from './analytics.actions';
import { createMockAreaAnalytics } from '@testing/fixtures/analytics.fixture';

describe('AnalyticsReducer', () => {
  it('should set loading on loadAreaAnalytics', () => {
    const action = AnalyticsActions.loadAreaAnalytics();
    const state = analyticsReducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set areas on loadAreaAnalyticsSuccess', () => {
    const areas = [createMockAreaAnalytics({ grandeArea: 'A' })];
    const action = AnalyticsActions.loadAreaAnalyticsSuccess({ areas });
    const state = analyticsReducer(initialState, action);
    expect(state.areas).toEqual(areas);
    expect(state.loading).toBeFalse();
  });
});
