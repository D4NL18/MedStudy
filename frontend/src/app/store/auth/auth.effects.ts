import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, tap, of } from 'rxjs';
import { Router } from '@angular/router';


/**
 * NgRx effects for the Auth feature slice.
 * @description Handles side effects such as HTTP calls in response to Auth actions.
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, senha }) =>
        this.authService.login(email, senha).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => 
            of(AuthActions.loginFailure({ 
              error: error.error?.message || 'Erro ao realizar login. Verifique suas credenciais.' 
            }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          // Persist token immediately so interceptor can read it before
          // the Store update propagates (prevents race-condition 401 #BF-03)
          localStorage.setItem('auth_token', response.accessToken);
          // Give a small delay to ensure the Store is updated and
          // any HTTP cookies are fully processed by the browser
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 100);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
