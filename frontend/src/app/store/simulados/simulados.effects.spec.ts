import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { SimuladosEffects } from './simulados.effects';
import { SimuladosService } from '@core/services/simulados.service';
import * as SimuladosActions from './simulados.actions';
import { createMockSimulado } from '@testing/fixtures/simulado.fixture';

describe('SimuladosEffects', () => {
  let actions$: Observable<any>;
  let effects: SimuladosEffects;
  let simuladosService: jasmine.SpyObj<SimuladosService>;

  beforeEach(() => {
    simuladosService = jasmine.createSpyObj('SimuladosService', [
      'getSimulados',
      'createSimulado',
      'updateSimulado',
      'deleteSimulado'
    ]);

    TestBed.configureTestingModule({
      providers: [
        SimuladosEffects,
        provideMockActions(() => actions$),
        { provide: SimuladosService, useValue: simuladosService }
      ]
    });

    effects = TestBed.inject(SimuladosEffects);
  });

  it('should load simulados successfully', (done) => {
    const mockSimulados = [createMockSimulado()];
    simuladosService.getSimulados.and.returnValue(of({ content: mockSimulados, totalElements: 1 }));
    actions$ = of(SimuladosActions.loadSimulados({ filters: { page: 0, size: 10 }, append: false }));

    effects.loadSimulados$.subscribe(action => {
      expect(action).toEqual(SimuladosActions.loadSimuladosSuccess({ 
        simulados: mockSimulados, 
        totalCount: 1, 
        append: false 
      }));
      done();
    });
  });

  it('should handle load simulados failure', (done) => {
    simuladosService.getSimulados.and.returnValue(throwError(() => new Error('Error')));
    actions$ = of(SimuladosActions.loadSimulados({ filters: { page: 0, size: 10 }, append: false }));

    effects.loadSimulados$.subscribe(action => {
      expect(action).toEqual(SimuladosActions.loadSimuladosFailure({ error: 'Erro ao carregar simulados.' }));
      done();
    });
  });

  it('should create simulado successfully', (done) => {
    const mockSimulado = createMockSimulado();
    simuladosService.createSimulado.and.returnValue(of(mockSimulado));
    actions$ = of(SimuladosActions.createSimulado({ simulado: mockSimulado }));

    effects.createSimulado$.subscribe(action => {
      expect(action).toEqual(SimuladosActions.createSimuladoSuccess({ simulado: mockSimulado }));
      done();
    });
  });

  it('should delete simulado successfully', (done) => {
    simuladosService.deleteSimulado.and.returnValue(of(undefined));
    actions$ = of(SimuladosActions.deleteSimulado({ id: '1' }));

    effects.deleteSimulado$.subscribe(action => {
      expect(action).toEqual(SimuladosActions.deleteSimuladoSuccess({ id: '1' }));
      done();
    });
  });

  it('should update simulado successfully', (done) => {
    const mockSimulado = createMockSimulado();
    simuladosService.updateSimulado.and.returnValue(of(mockSimulado));
    actions$ = of(SimuladosActions.updateSimulado({ id: '1', simulado: mockSimulado }));

    effects.updateSimulado$.subscribe(action => {
      expect(action).toEqual(SimuladosActions.updateSimuladoSuccess({ simulado: mockSimulado }));
      done();
    });
  });
});
