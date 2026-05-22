import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CompetitionService } from '../../core/services/competition.service';
import { ToastService } from '../../core/services/toast.service';
import { CompetitionActions } from './competition.actions';
import * as AuthActions from '../auth/auth.actions';

@Injectable()
export class CompetitionEffects {
  private actions$ = inject(Actions);
  private competitionService = inject(CompetitionService);
  private toastService = inject(ToastService);

  loadCompetitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionActions.loadCompetitions),
      mergeMap(() =>
        this.competitionService.getUserCompetitions().pipe(
          map((competitions) => CompetitionActions.loadCompetitionsSuccess({ competitions })),
          catchError((error) =>
            of(CompetitionActions.loadCompetitionsFailure({ error: 'Erro ao carregar competições' }))
          )
        )
      )
    )
  );

  createCompetition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionActions.createCompetition),
      mergeMap(({ request }) =>
        this.competitionService.createCompetition(request).pipe(
          map((competition) => {
            this.toastService.success('Competição criada com sucesso!');
            return CompetitionActions.createCompetitionSuccess({ competition });
          }),
          catchError((error) => {
            const errorMsg = error.error?.message || 'Erro ao criar competição';
            this.toastService.error(errorMsg);
            return of(CompetitionActions.createCompetitionFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  acceptInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionActions.acceptInvite),
      mergeMap(({ id }) =>
        this.competitionService.acceptInvite(id).pipe(
          map((competition) => {
            this.toastService.success('Convite aceito com sucesso!');
            return CompetitionActions.acceptInviteSuccess({ competition });
          }),
          catchError((error) => {
            const errorMsg = error.error?.message || 'Erro ao aceitar convite';
            this.toastService.error(errorMsg);
            return of(CompetitionActions.acceptInviteFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  declineInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionActions.declineInvite),
      mergeMap(({ id }) =>
        this.competitionService.declineInvite(id).pipe(
          map((competition) => {
            this.toastService.success('Convite recusado.');
            return CompetitionActions.declineInviteSuccess({ competition });
          }),
          catchError((error) => {
            const errorMsg = error.error?.message || 'Erro ao recusar convite';
            this.toastService.error(errorMsg);
            return of(CompetitionActions.declineInviteFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  loadLeaderboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionActions.loadLeaderboard),
      mergeMap(({ id }) =>
        this.competitionService.getLeaderboard(id).pipe(
          map((leaderboard) => CompetitionActions.loadLeaderboardSuccess({ id, leaderboard })),
          catchError((error) =>
            of(CompetitionActions.loadLeaderboardFailure({ error: 'Erro ao carregar ranking' }))
          )
        )
      )
    )
  );

  loadCompetitionsOnLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => CompetitionActions.loadCompetitions())
    )
  );

  clearCompetitionOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => CompetitionActions.clearCompetitionState())
    )
  );
}
