import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { showPaywall } from '../../store/auth/auth.actions';


/**
 * HTTP interceptor for Error.
 * @description Intercepts outgoing HTTP requests and/or incoming responses to apply cross-cutting concerns.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429) {
        snackBar.open('Muitas requisições (Rate Limit). Por favor, aguarde um momento antes de tentar novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status === 402) {
        store.dispatch(showPaywall());
      }
      return throwError(() => error);
    })
  );
};
