import { authReducer, initialState } from './auth.reducer';
import * as AuthActions from './auth.actions';

describe('AuthReducer', () => {
  it('should set loading on login', () => {
    const action = AuthActions.login({ email: 'a', senha: 'b' });
    const state = authReducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set token on loginSuccess', () => {
    const response = { accessToken: 'token', refreshToken: 'refresh' } as any;
    const action = AuthActions.loginSuccess({ response });
    const state = authReducer(initialState, action);
    expect(state.token).toBe('token');
    expect(state.loading).toBeFalse();
  });

  it('should clear state on logout', () => {
    const stateWithToken = { ...initialState, token: 'token' };
    const action = AuthActions.logout();
    const state = authReducer(stateWithToken, action);
    expect(state.token).toBeNull();
  });

  it('should set error on loginFailure', () => {
    const error = 'Invalid credentials';
    const action = AuthActions.loginFailure({ error });
    const state = authReducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.loading).toBeFalse();
  });
});
