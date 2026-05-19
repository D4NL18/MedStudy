import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { guestGuard } from './guest.guard';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('guestGuard', () => {
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

  it('should return true if NOT authenticated', (done) => {
    store.overrideSelector(selectIsAuthenticated, false);
    
    const result = TestBed.runInInjectionContext(() => guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    (result as any).subscribe((val: boolean) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should navigate to /dashboard and return false if authenticated', (done) => {
    store.overrideSelector(selectIsAuthenticated, true);
    
    const result = TestBed.runInInjectionContext(() => guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    (result as any).subscribe((val: boolean) => {
      expect(val).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      done();
    });
  });
});
