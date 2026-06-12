import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BancoService } from '@core/services/banco.service';
import * as BancoActions from './banco.actions';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { QuestionSession } from '@core/models/question-session.model';
import { Store } from '@ngrx/store';
import { selectBancoFilters } from './banco.selectors';

import { ToastService } from '@core/services/toast.service';


/**
 * NgRx effects for the Banco feature slice.
 * @description Handles side effects such as HTTP calls in response to Banco actions.
 */
@Injectable()
export class BancoEffects {
  private actions$ = inject(Actions);
  private bancoService = inject(BancoService);
  private toastService = inject(ToastService);
  private store = inject(Store);

  private badgeMap: Record<string, string> = {
    'STREAK_7': 'Mestre da Ofensiva',
    'QUESTIONS_1000': 'Maratonista de Questões',
    'SIMULADOS_10': 'Estratega de Simulados'
  };

  showBadgeToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BancoActions.createSessionSuccess, BancoActions.updateSessionSuccess),
      map(({ session }) => {
        if (session.newlyEarnedBadges && session.newlyEarnedBadges.length > 0) {
          session.newlyEarnedBadges.forEach(badgeType => {
            const name = this.badgeMap[badgeType] || badgeType;
            this.toastService.badge(name);
          });
        }
      })
    ),
    { dispatch: false }
  );

  loadSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BancoActions.loadSessions),
      mergeMap(({ filters, append }) =>
        this.bancoService.getSessions(filters).pipe(
          map((response) =>
            BancoActions.loadSessionsSuccess({
              sessions: response.content,
              totalCount: response.totalElements,
              append
            })
          ),
          catchError((error) =>
            of(BancoActions.loadSessionsFailure({ error: 'Erro ao carregar sessões.' }))
          )
        )
      )
    )
  );

  createSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BancoActions.createSession),
      mergeMap(({ session }) =>
        this.bancoService.createSession(session).pipe(
          map((newSession) => BancoActions.createSessionSuccess({ session: newSession })),
          catchError((error) =>
            of(BancoActions.createSessionFailure({ error: 'Erro ao criar sessão.' }))
          )
        )
      )
    )
  );

  updateSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BancoActions.updateSession),
      mergeMap(({ id, session }) =>
        this.bancoService.updateSession(id, session).pipe(
          map((updated: QuestionSession) => BancoActions.updateSessionSuccess({ session: updated })),
          catchError((error) =>
            of(BancoActions.updateSessionFailure({ error: 'Erro ao atualizar sessão.' }))
          )
        )
      )
    )
  );

  deleteSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BancoActions.deleteSession),
      mergeMap(({ id }) =>
        this.bancoService.deleteSession(id).pipe(
          map(() => BancoActions.deleteSessionSuccess({ id })),
          catchError((error) =>
            of(BancoActions.deleteSessionFailure({ error: 'Erro ao excluir sessão.' }))
          )
        )
      )
    )
  );

  syncDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        BancoActions.createSessionSuccess,
        BancoActions.updateSessionSuccess,
        BancoActions.deleteSessionSuccess
      ),
      map(() => ({ type: '[Dashboard] Load Dashboard' }))
    )
  );

  reloadAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BancoActions.createSessionSuccess),
      withLatestFrom(this.store.select(selectBancoFilters)),
      map(([action, filters]) => BancoActions.loadSessions({ filters, append: false }))
    )
  );
}
