import * as Selectors from './auth.selectors';
import { AuthState } from './auth.reducer';

describe('AuthSelectors', () => {
  const initialState: AuthState = {
    user: { email: 'test@test.com' } as any,
    token: 'token',
    loading: false,
    error: null,
    showPaywall: false
  };

  it('should select token', () => {
    const result = Selectors.selectToken.projector(initialState);
    expect(result).toBe('token');
  });

  it('should select isAuthenticated', () => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    const validJwt = `header.${payload}.signature`;
    const result = Selectors.selectIsAuthenticated.projector(validJwt);
    expect(result).toBeTrue();
  });

  it('should select user', () => {
    const result = Selectors.selectUser.projector(initialState);
    expect(result?.email).toBe('test@test.com');
  });

  it('should select error', () => {
    const result = Selectors.selectAuthError.projector({ ...initialState, error: 'Error' });
    expect(result).toBe('Error');
  });

  it('should select loading', () => {
    const result = Selectors.selectAuthLoading.projector({ ...initialState, loading: true });
    expect(result).toBeTrue();
  });
});
