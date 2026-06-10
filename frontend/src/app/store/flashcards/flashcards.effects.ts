import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { FlashcardService } from '@core/services/flashcard.service';
import { FlashcardsActions } from './flashcards.actions';
import { RevisionActions } from '../revision/revision.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class FlashcardsEffects {
  private actions$ = inject(Actions);
  private flashcardService = inject(FlashcardService);
  private store = inject(Store);

  loadQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.loadStudyQueue),
      mergeMap(() =>
        this.flashcardService.getTodayQueue().pipe(
          map(flashcards => FlashcardsActions.loadStudyQueueSuccess({ flashcards })),
          catchError(error => of(FlashcardsActions.loadStudyQueueFailure({ error: error.message })))
        )
      )
    )
  );

  rateFlashcard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.rateFlashcard),
      mergeMap(({ rating }) =>
        this.flashcardService.rateFlashcard(rating).pipe(
          map(flashcard => FlashcardsActions.rateFlashcardSuccess({ flashcard, missed: rating.missed })),
          catchError(error => of(FlashcardsActions.rateFlashcardFailure({ error: error.message })))
        )
      )
    )
  );

  // Refresh revision summary after rating
  refreshSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.rateFlashcardSuccess),
      mergeMap(() => [
        RevisionActions.loadSummary(),
        FlashcardsActions.loadSummary()
      ])
    )
  );

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.loadFlashcards),
      mergeMap((action) =>
        this.flashcardService.getFlashcards(action.page || 0, action.size || 10).pipe(
          map(response => FlashcardsActions.loadFlashcardsSuccess({ flashcards: response.content, totalElements: response.totalElements })),
          catchError(error => of(FlashcardsActions.loadFlashcardsFailure({ error: error.message })))
        )
      )
    )
  );

  loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.loadSummary),
      mergeMap(() =>
        this.flashcardService.getSummary().pipe(
          map(summary => FlashcardsActions.loadSummarySuccess({ summary })),
          catchError(error => of(FlashcardsActions.loadSummaryFailure({ error: error.message })))
        )
      )
    )
  );

  deleteFlashcard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.deleteFlashcard),
      mergeMap(({ id }) =>
        this.flashcardService.deleteFlashcard(id).pipe(
          map(() => FlashcardsActions.deleteFlashcardSuccess({ id })),
          catchError(error => of(FlashcardsActions.deleteFlashcardFailure({ error: error.message })))
        )
      )
    )
  );

  resetProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.resetProgress),
      mergeMap(({ grandeArea }) =>
        this.flashcardService.resetProgress(grandeArea).pipe(
          map(() => FlashcardsActions.resetProgressSuccess()),
          catchError(error => of(FlashcardsActions.resetProgressFailure({ error: error.message })))
        )
      )
    )
  );

  onResetSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.resetProgressSuccess),
      map(() => FlashcardsActions.loadSummary())
    )
  );

  refreshAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.deleteFlashcardSuccess),
      mergeMap(() => [
        FlashcardsActions.loadSummary(),
        FlashcardsActions.loadFlashcards({ page: 0, size: 10 })
      ])
    )
  );
}
