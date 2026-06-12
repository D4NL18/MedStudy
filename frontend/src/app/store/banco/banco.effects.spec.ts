import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { BancoEffects } from './banco.effects';
import { BancoService } from '@core/services/banco.service';
import * as BancoActions from './banco.actions';

describe('BancoEffects', () => {
  let actions$: Observable<any>;
  let effects: BancoEffects;
  let bancoService: jasmine.SpyObj<BancoService>;

  beforeEach(() => {
    bancoService = jasmine.createSpyObj('BancoService', [
      'getSessions',
      'createSession',
      'updateSession',
      'deleteSession'
    ]);

    TestBed.configureTestingModule({
      providers: [
        BancoEffects,
        provideMockActions(() => actions$),
        { provide: BancoService, useValue: bancoService }
      ]
    });

    effects = TestBed.inject(BancoEffects);
  });

  it('should load sessions successfully', (done) => {
    const mockResponse = { content: [{ id: '1' } as any], totalElements: 1 };
    bancoService.getSessions.and.returnValue(of(mockResponse));
    actions$ = of(BancoActions.loadSessions({ filters: {} as any, append: false }));

    effects.loadSessions$.subscribe(action => {
      expect(action).toEqual(BancoActions.loadSessionsSuccess({ 
        sessions: mockResponse.content, 
        totalCount: 1, 
        append: false 
      }));
      done();
    });
  });

  it('should create session successfully', (done) => {
    const mockSession = { id: '1' } as any;
    bancoService.createSession.and.returnValue(of(mockSession));
    actions$ = of(BancoActions.createSession({ session: mockSession }));

    effects.createSession$.subscribe(action => {
      expect(action).toEqual(BancoActions.createSessionSuccess({ session: mockSession }));
      done();
    });
  });

  it('should update session successfully', (done) => {
    const mockSession = { id: '1' } as any;
    bancoService.updateSession.and.returnValue(of(mockSession));
    actions$ = of(BancoActions.updateSession({ id: '1', session: mockSession }));

    effects.updateSession$.subscribe(action => {
      expect(action).toEqual(BancoActions.updateSessionSuccess({ session: mockSession }));
      done();
    });
  });

  it('should delete session successfully', (done) => {
    bancoService.deleteSession.and.returnValue(of(undefined));
    actions$ = of(BancoActions.deleteSession({ id: '1' }));

    effects.deleteSession$.subscribe(action => {
      expect(action).toEqual(BancoActions.deleteSessionSuccess({ id: '1' }));
      done();
    });
  });
});
