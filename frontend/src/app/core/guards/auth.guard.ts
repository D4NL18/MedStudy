import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@store/auth/auth.selectors';
import { map, take } from 'rxjs';
import * as AuthActions from '@store/auth/auth.actions';


/**
 * Route guard for Auth.
 * @description Determines whether navigation to a route should be allowed.
 */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        store.dispatch(AuthActions.logout()); // Clears invalid/expired token
        return false; // Redirection is handled by the logout effect
      }
    })
  );
};
