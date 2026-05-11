import * as Selectors from './analytics.selectors';
import { AnalyticsState } from './analytics.reducer';

describe('AnalyticsSelectors', () => {
  const initialState: AnalyticsState = {
    areas: [{ grandeArea: 'Test', totalQuestions: 10, accuracy: 80, sessionsCount: 1, trendShort: 0, trendLong: 0, performanceLevel: 'MEDIUM' }],
    topics: [],
    loading: false,
    error: null
  };

  it('should select areas', () => {
    const result = Selectors.selectAreaAnalytics.projector(initialState);
    expect(result.length).toBe(1);
    expect(result[0].grandeArea).toBe('Test');
  });

  it('should select loading', () => {
    const result = Selectors.selectAnalyticsLoading.projector(initialState);
    expect(result).toBeFalse();
  });
});
