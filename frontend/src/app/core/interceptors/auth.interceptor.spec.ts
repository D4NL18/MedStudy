import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectToken } from '../../store/auth/auth.selectors';
import { of, throwError } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';

describe('authInterceptor', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });

    store = TestBed.inject(MockStore);
  });

  it('should add an Authorization header when token is present', (done) => {
    const token = 'mock-token';
    store.overrideSelector(selectToken, token);
    
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = (request: HttpRequest<any>) => {
      expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      return of({} as HttpEvent<any>);
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        done();
      });
    });
  });

  it('should NOT add an Authorization header when token is absent', (done) => {
    store.overrideSelector(selectToken, null);
    
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = (request: HttpRequest<any>) => {
      expect(request.headers.has('Authorization')).toBeFalse();
      return of({} as HttpEvent<any>);
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        done();
      });
    });
  });

  it('should dispatch logout on 401 error', (done) => {
    store.overrideSelector(selectToken, 'token');
    const dispatchSpy = spyOn(store, 'dispatch');
    
    const req = new HttpRequest('GET', '/test');
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe({
        error: (err) => {
          expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
          expect(err.status).toBe(401);
          done();
        }
      });
    });
  });
});
