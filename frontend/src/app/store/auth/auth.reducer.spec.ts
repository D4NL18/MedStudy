import * as fromAuth from './auth.reducer';
import * as AuthActions from './auth.actions';
import { createMockUser } from '../../testing/fixtures/auth.fixture';

describe('AuthReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromAuth;
      const action = { type: 'Unknown' } as any;
      const state = fromAuth.authReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('login action', () => {
    it('should set loading to true and error to null', () => {
      const { initialState } = fromAuth;
      const action = AuthActions.login({ email: 'test@test.com', senha: '123' });
      const state = fromAuth.authReducer(initialState, action);

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess action', () => {
    it('should set token and loading to false', () => {
      const { initialState } = fromAuth;
      const response = { accessToken: 'token', refreshToken: 'refresh', user: createMockUser() };
      const action = AuthActions.loginSuccess({ response });
      const state = fromAuth.authReducer(initialState, action);

      expect(state.token).toBe('token');
      expect(state.loading).toBeFalse();
      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure action', () => {
    it('should set error and loading to false', () => {
      const { initialState } = fromAuth;
      const error = 'Invalid credentials';
      const action = AuthActions.loginFailure({ error });
      const state = fromAuth.authReducer(initialState, action);

      expect(state.error).toBe(error);
      expect(state.loading).toBeFalse();
    });
  });

  describe('logout action', () => {
    it('should reset state to null values', () => {
      const state: fromAuth.AuthState = {
        token: 'token',
        user: createMockUser(),
        error: null,
        loading: false
      };
      const action = AuthActions.logout();
      const result = fromAuth.authReducer(state, action);

      expect(result.token).toBeNull();
      expect(result.user).toBeNull();
    });
  });
});
