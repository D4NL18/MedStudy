/**
 * Test fixture data for Revision.
 * @description Provides reusable mock objects for use in unit and integration tests.
 */
export const createMockRevisionSummary = (overrides?: any) => ({
  atrasadas: 5,
  hoje: 10,
  futuras: 15,
  concluidas: 20,
  ...overrides
});

export const createMockRevisionSession = (overrides?: any) => ({
  id: '1',
  tema: 'Hepatologia',
  qtsFeitas: 10,
  qtsCorretas: 8,
  data: '2024-05-09',
  ...overrides
});
