import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '../../store/auth/auth.selectors';
import { catchError, throwError } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  let token: string | null = null;
  
  // Get token from Store
  store.select(selectToken).subscribe(t => token = t);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Auto logout on unauthorized error
        store.dispatch(AuthActions.logout());
      }
      return throwError(() => error);
    })
  );
};
