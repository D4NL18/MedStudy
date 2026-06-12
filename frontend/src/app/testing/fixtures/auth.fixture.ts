/**
 * Test fixture data for Auth.
 * @description Provides reusable mock objects for use in unit and integration tests.
 */
export const createMockUser = (overrides?: any) => ({
  email: 'test@example.com',
  nome: 'Test User',
  ...overrides
});

export const mockAuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: createMockUser()
};
