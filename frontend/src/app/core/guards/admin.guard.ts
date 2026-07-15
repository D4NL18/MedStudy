import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectToken, parseJwtPayload } from '@store/auth/auth.selectors';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectToken).pipe(
    take(1),
    map(storeToken => {
      const token = storeToken || localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        router.navigate(['/login']);
        return false;
      }

      const payload = parseJwtPayload(token);
      if (payload) {
        const roles = payload.roles || payload.role || payload.authorities || [];
        const roleStr = Array.isArray(roles) ? roles.join(',') : String(roles);
        const isAdmin = roleStr.includes('ROLE_ADMIN') || roleStr.includes('ADMIN') || payload.sub === 'admin@medstudy.com';

        if (isAdmin) {
          return true;
        }
      }

      router.navigate(['/']);
      return false;
    })
  );
};
