import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SimuladosService } from '../../core/services/simulados.service';
import * as SimuladosActions from './simulados.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class SimuladosEffects {
  private actions$ = inject(Actions);
  private simuladosService = inject(SimuladosService);

  loadSimulados$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimuladosActions.loadSimulados),
      mergeMap(({ filters, append }) =>
        this.simuladosService.getSimulados(filters).pipe(
          map((response) =>
            SimuladosActions.loadSimuladosSuccess({
              simulados: response.content,
              totalCount: response.totalElements,
              append
            })
          ),
          catchError((error) =>
            of(SimuladosActions.loadSimuladosFailure({ error: 'Erro ao carregar simulados.' }))
          )
        )
      )
    )
  );

  createSimulado$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimuladosActions.createSimulado),
      mergeMap(({ simulado }) =>
        this.simuladosService.createSimulado(simulado).pipe(
          map((newSimulado) => SimuladosActions.createSimuladoSuccess({ simulado: newSimulado })),
          catchError((error) =>
            of(SimuladosActions.createSimuladoFailure({ error: 'Erro ao criar simulado.' }))
          )
        )
      )
    )
  );

  updateSimulado$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimuladosActions.updateSimulado),
      mergeMap(({ id, simulado }) =>
        this.simuladosService.updateSimulado(id, simulado).pipe(
          map((updated) => SimuladosActions.updateSimuladoSuccess({ simulado: updated })),
          catchError((error) =>
            of(SimuladosActions.updateSimuladoFailure({ error: 'Erro ao atualizar simulado.' }))
          )
        )
      )
    )
  );

  deleteSimulado$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimuladosActions.deleteSimulado),
      mergeMap(({ id }) =>
        this.simuladosService.deleteSimulado(id).pipe(
          map(() => SimuladosActions.deleteSimuladoSuccess({ id })),
          catchError((error) =>
            of(SimuladosActions.deleteSimuladoFailure({ error: 'Erro ao excluir simulado.' }))
          )
        )
      )
    )
  );
}
