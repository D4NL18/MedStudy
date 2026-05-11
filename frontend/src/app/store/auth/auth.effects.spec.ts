import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    effects = TestBed.inject(AuthEffects);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should login successfully', (done) => {
    const response = { accessToken: 'token', refreshToken: 'refresh' } as any;
    authService.login.and.returnValue(of(response));
    actions$ = of(AuthActions.login({ email: 'test@test.com', senha: 'password' }));

    effects.login$.subscribe(action => {
      expect(action).toEqual(AuthActions.loginSuccess({ response }));
      done();
    });
  });

  it('should handle login success', (done) => {
    const response = { accessToken: 'token', refreshToken: 'refresh' } as any;
    actions$ = of(AuthActions.loginSuccess({ response }));

    effects.loginSuccess$.subscribe(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token');
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh');
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      done();
    });
  });

  it('should navigate to login on logout', (done) => {
    actions$ = of(AuthActions.logout());

    effects.logout$.subscribe(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should handle login failure with error message', (done) => {
    const errorResponse = { error: { message: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => errorResponse));
    actions$ = of(AuthActions.login({ email: 'test@test.com', senha: 'password' }));

    effects.login$.subscribe(action => {
      expect(action).toEqual(AuthActions.loginFailure({ error: 'Invalid credentials' }));
      done();
    });
  });

  it('should handle login failure without error message', (done) => {
    authService.login.and.returnValue(throwError(() => ({})));
    actions$ = of(AuthActions.login({ email: 'test@test.com', senha: 'password' }));

    effects.login$.subscribe(action => {
      expect(action).toEqual(AuthActions.loginFailure({ error: 'Erro ao realizar login. Verifique suas credenciais.' }));
      done();
    });
  });
});
