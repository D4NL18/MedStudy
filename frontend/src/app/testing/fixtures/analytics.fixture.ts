import { AreaAnalytics } from '../../store/analytics/analytics.actions';

export const createMockAreaAnalytics = (overrides?: Partial<AreaAnalytics>): AreaAnalytics => ({
  grandeArea: 'Clínica Médica',
  totalQuestions: 100,
  accuracy: 85,
  sessionsCount: 10,
  trendRate: 5,
  ...overrides
});

export const mockAreaAnalyticsResponse = [
  createMockAreaAnalytics(),
  createMockAreaAnalytics({ grandeArea: 'Pediatria', accuracy: 70 }),
  createMockAreaAnalytics({ grandeArea: 'Cirurgia', accuracy: 60 })
];
