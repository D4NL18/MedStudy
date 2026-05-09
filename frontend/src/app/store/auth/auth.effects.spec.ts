import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';
import { mockAuthResponse } from '../../testing/fixtures/auth.fixture';
import { hot, cold } from 'jasmine-marbles';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    effects = TestBed.inject(AuthEffects);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('login$', () => {
    it('should return loginSuccess on successful login', () => {
      const email = 'test@test.com';
      const senha = '123';
      const response = { accessToken: 'token', refreshToken: 'refresh' };
      const action = AuthActions.login({ email, senha });
      const completion = AuthActions.loginSuccess({ response });

      actions$ = hot('-a', { a: action });
      authServiceSpy.login.and.returnValue(of(response));
      const expected = cold('-b', { b: completion });

      expect(effects.login$).toBeObservable(expected);
    });

    it('should return loginFailure on failed login', () => {
      const email = 'test@test.com';
      const senha = '123';
      const error = { error: { message: 'Erro' } };
      const action = AuthActions.login({ email, senha });
      const completion = AuthActions.loginFailure({ error: 'Erro' });

      actions$ = hot('-a', { a: action });
      authServiceSpy.login.and.returnValue(throwError(() => error));
      const expected = cold('-b', { b: completion });

      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe('loginSuccess$', () => {
    it('should navigate to dashboard and save tokens', () => {
      const response = { accessToken: 'token', refreshToken: 'refresh' };
      const action = AuthActions.loginSuccess({ response });

      actions$ = of(action);

      effects.loginSuccess$.subscribe();

      expect(localStorage.getItem('token')).toBe('token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('logout$', () => {
    it('should navigate to login and remove tokens', () => {
      const action = AuthActions.logout();
      actions$ = of(action);

      effects.logout$.subscribe();

      expect(localStorage.getItem('token')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
