import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';


/**
 * NgRx reducer for the Auth feature slice.
 * @description Handles state transitions in response to dispatched Auth actions.
 */
export interface AuthState {
  token: string | null;
  user: { email: string; nome: string } | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  token: localStorage.getItem('auth_token'),
  user: null,
  error: null,
  loading: false
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    token: response.accessToken,
    user: null, // User data needs separate fetch or JWT decode
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  on(AuthActions.logout, () => ({
    token: null,
    user: null,
    error: null,
    loading: false
  }))
);
