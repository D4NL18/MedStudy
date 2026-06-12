import { AreaAnalytics } from '@store/analytics/analytics.actions';


/**
 * Test fixture data for Analytics.
 * @description Provides reusable mock objects for use in unit and integration tests.
 */
export const createMockAreaAnalytics = (overrides?: Partial<AreaAnalytics>): AreaAnalytics => ({
  grandeArea: 'Clínica Médica',
  totalQuestions: 100,
  accuracy: 75,
  sessionsCount: 10,
  trendShort: 5,
  trendLong: 2,
  performanceLevel: 'HIGH',
  ...overrides
});

export const mockAreaAnalyticsResponse = [
  createMockAreaAnalytics(),
  createMockAreaAnalytics({ grandeArea: 'Pediatria', accuracy: 70 }),
  createMockAreaAnalytics({ grandeArea: 'Cirurgia', accuracy: 60 })
];
