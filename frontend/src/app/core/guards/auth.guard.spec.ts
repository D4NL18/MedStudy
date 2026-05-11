import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { authGuard } from './auth.guard';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should return true if authenticated', (done) => {
    store.overrideSelector(selectIsAuthenticated, true);
    
    const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    if (result instanceof of || typeof result === 'boolean') {
        // handle synchronous
    }
    
    (result as any).subscribe((val: boolean) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should navigate to /login and return false if not authenticated', (done) => {
    store.overrideSelector(selectIsAuthenticated, false);
    
    const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    (result as any).subscribe((val: boolean) => {
      expect(val).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
