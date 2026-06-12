import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RevisionService } from '@core/services/revision.service';
import { RevisionActions } from './revision.actions';


/**
 * NgRx effects for the Revision feature slice.
 * @description Handles side effects such as HTTP calls in response to Revision actions.
 */
@Injectable()
export class RevisionEffects {
  private actions$ = inject(Actions);
  private revisionService = inject(RevisionService);

  loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionActions.loadSummary),
      mergeMap(() =>
        this.revisionService.getSummary().pipe(
          map(summary => RevisionActions.loadSummarySuccess({ summary })),
          catchError(error => of(RevisionActions.loadSummaryFailure({ error: error.message })))
        )
      )
    )
  );

  loadSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionActions.loadSessions),
      mergeMap(({ filter, page, size, search }) =>
        this.revisionService.getSessions(filter, page, size, search).pipe(
          map(response => RevisionActions.loadSessionsSuccess({ response })),
          catchError(error => of(RevisionActions.loadSessionsFailure({ error: error.message })))
        )
      )
    )
  );
}
