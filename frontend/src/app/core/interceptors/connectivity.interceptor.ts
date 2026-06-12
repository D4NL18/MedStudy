import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


/**
 * HTTP interceptor for Connectivity.
 * @description Intercepts outgoing HTTP requests and/or incoming responses to apply cross-cutting concerns.
 */
export const connectivityInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se não houver internet (navigator.onLine == false) ou 
      // se for um erro típico de Service Worker / Offline (status 0 ou 504 Gateway Timeout)
      if (!navigator.onLine || error.status === 0 || error.status === 504) {
        // Ignora redirecionamento para URLs de API de background ou analytics
        // e redireciona caso a tentativa seja de carregar a interface (navegação)
        // No caso do Angular, a interceptação ocorre em chamadas Http (ex: fetch data).
        // Podemos redirecionar para a página offline se a rota atual exigir os dados e não estiver em cache.
        
        // Exceção: evitar redirecionar se já estivermos na página offline ou de login
        if (!router.url.includes('/offline') && !router.url.includes('/login')) {
          router.navigate(['/offline']);
        }
      }
      return throwError(() => error);
    })
  );
};
