import * as fromAuth from './auth.reducer';
import * as AuthSelectors from './auth.selectors';
import { createMockUser } from '../../testing/fixtures/auth.fixture';

describe('AuthSelectors', () => {
  const initialState: fromAuth.AuthState = {
    token: 'mock-token',
    user: createMockUser(),
    error: 'some-error',
    loading: true
  };

  it('should select the auth state', () => {
    const result = AuthSelectors.selectAuthState.projector(initialState);
    expect(result).toEqual(initialState);
  });

  it('should select the token', () => {
    const result = AuthSelectors.selectToken.projector(initialState);
    expect(result).toBe('mock-token');
  });

  it('should select the user', () => {
    const result = AuthSelectors.selectUser.projector(initialState);
    expect(result).toEqual(initialState.user);
  });

  it('should select isAuthenticated', () => {
    const result = AuthSelectors.selectIsAuthenticated.projector('token');
    expect(result).toBeTrue();
  });

  it('should select error', () => {
    const result = AuthSelectors.selectAuthError.projector(initialState);
    expect(result).toBe('some-error');
  });

  it('should select loading', () => {
    const result = AuthSelectors.selectAuthLoading.projector(initialState);
    expect(result).toBeTrue();
  });
});
