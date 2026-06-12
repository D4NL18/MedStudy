import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@store/auth/auth.selectors';
import { map, take } from 'rxjs';


/**
 * Route guard for Guest.
 * @description Determines whether navigation to a route should be allowed.
 */
export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    })
  );
};
