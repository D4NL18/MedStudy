import { createAction, props } from '@ngrx/store';


/**
 * NgRx actions for the Auth feature slice.
 * @description Defines the action creators used to dispatch state changes for Auth.
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
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
