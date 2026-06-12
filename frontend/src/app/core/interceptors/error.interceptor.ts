import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


/**
 * HTTP interceptor for Error.
 * @description Intercepts outgoing HTTP requests and/or incoming responses to apply cross-cutting concerns.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429) {
        snackBar.open('Muitas requisições (Rate Limit). Por favor, aguarde um momento antes de tentar novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
      return throwError(() => error);
    })
  );
};
