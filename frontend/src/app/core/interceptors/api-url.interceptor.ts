import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { environment as devEnvironment } from '../../../environments/environment';
import { environment as prodEnvironment } from '../../../environments/environment.prod';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const currentEnv = isDevMode() ? devEnvironment : prodEnvironment;
    const apiReq = req.clone({ url: req.url.replace('/api', currentEnv.apiUrl) });
    return next(apiReq);
  }
  return next(req);
};
