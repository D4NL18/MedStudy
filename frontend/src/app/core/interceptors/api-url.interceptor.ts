import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { environment as devEnvironment } from '@env/environment';
import { environment as prodEnvironment } from '@env/environment.prod';


/**
 * HTTP interceptor for Api Url.
 * @description Intercepts outgoing HTTP requests and/or incoming responses to apply cross-cutting concerns.
 */
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const currentEnv = isDevMode() ? devEnvironment : prodEnvironment;
    const apiReq = req.clone({ url: req.url.replace('/api', currentEnv.apiUrl) });
    return next(apiReq);
  }
  return next(req);
};
