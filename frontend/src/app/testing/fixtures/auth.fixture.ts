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
