import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '../../store/auth/auth.selectors';
import { catchError, throwError } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  let token: string | null = null;

  // Get token from Store (async — may not be populated yet right after login)
  store.select(selectToken).subscribe(t => token = t);

  // Fallback: read from localStorage, which is set synchronously in the loginSuccess effect.
  // This prevents the race-condition where the Store hasn't propagated yet (#BF-03)
  if (!token) {
    token = localStorage.getItem('auth_token');
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } else {
    req = req.clone({
      withCredentials: true
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Only auto-logout if there's no token at all (true session expiry),
        // not when a race-condition causes a transient 401 right after login (#BF-03)
        const hasToken = !!token || !!localStorage.getItem('auth_token');
        if (!hasToken) {
          store.dispatch(AuthActions.logout());
        }
      }
      return throwError(() => error);
    })
  );
};
