import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectToken, parseJwtPayload } from '@store/auth/auth.selectors';
import { map, take } from 'rxjs';
import * as AuthActions from '@store/auth/auth.actions';

/**
 * Route guard for Auth.
 * @description Determines whether navigation to a route should be allowed.
 */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectToken).pipe(
    take(1),
    map(storeToken => {
      const token = storeToken || localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        store.dispatch(AuthActions.logout()); // Clears invalid/expired token
        return false;
      }

      const payload = parseJwtPayload(token);
      if (payload && payload.exp) {
        const isNotExpired = Date.now() < (payload.exp * 1000);
        if (isNotExpired) {
          return true;
        }
      } else if (payload) {
        return true;
      }

      store.dispatch(AuthActions.logout());
      return false;
    })
  );
};
