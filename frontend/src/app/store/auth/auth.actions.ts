import { createAction, props } from '@ngrx/store';

export interface AuthResponse {
  token: string;
  email: string;
  nome: string;
}

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; senha: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const refreshToken = createAction('[Auth] Refresh Token');
