import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { authGuard } from './auth.guard';
import { selectToken } from '@store/auth/auth.selectors';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
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

  afterEach(() => {
    store?.resetSelectors();
    localStorage.clear();
  });

  it('should return true if authenticated', (done) => {
    // Payload mock com exp no futuro
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    const mockToken = `header.${payload}.signature`;
    store.overrideSelector(selectToken, mockToken);
    
    const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    
    (result as any).subscribe((val: boolean) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should navigate to /login and return false if not authenticated', (done) => {
    store.overrideSelector(selectToken, '');
    localStorage.clear();
    
    const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    (result as any).subscribe((val: boolean) => {
      expect(val).toBeFalse();
      done();
    });
  });
});
