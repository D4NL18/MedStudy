import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SimuladosService } from '../../core/services/simulados.service';
import * as SimuladosActions from './simulados.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

import { ToastService } from '../../core/services/toast.service';

@Injectable()
export class SimuladosEffects {
  private actions$ = inject(Actions);
  private simuladosService = inject(SimuladosService);
  private toastService = inject(ToastService);

  private badgeMap: Record<string, string> = {
    'STREAK_7': 'Mestre da Ofensiva',
    'QUESTIONS_1000': 'Maratonista de Questões',
    'SIMULADOS_10': 'Estratega de Simulados'
  };

  showBadgeToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimuladosActions.createSimuladoSuccess, SimuladosActions.updateSimuladoSuccess),
      map(({ simulado }) => {
        if (simulado.newlyEarnedBadges && simulado.newlyEarnedBadges.length > 0) {
          simulado.newlyEarnedBadges.forEach(badgeType => {
            const name = this.badgeMap[badgeType] || badgeType;
            this.toastService.badge(name);
          });
        }
      })
    ),
    { dispatch: false }
  );

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
