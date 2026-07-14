import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectToken } from '@store/auth/auth.selectors';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectToken).pipe(
    take(1),
    map(token => {
      if (!token) {
        router.navigate(['/login']);
        return false;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = payload.roles || payload.role || payload.authorities || [];
        const roleStr = Array.isArray(roles) ? roles.join(',') : String(roles);
        const isAdmin = roleStr.includes('ROLE_ADMIN') || roleStr.includes('ADMIN');

        if (isAdmin) {
          return true;
        }
      } catch (e) {
        // Ignora erro de parse
      }

      router.navigate(['/']);
      return false;
    })
  );
};
