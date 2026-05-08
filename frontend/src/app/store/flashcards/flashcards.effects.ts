import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { FlashcardService } from '../../core/services/flashcard.service';
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
          map(flashcard => FlashcardsActions.rateFlashcardSuccess({ flashcard })),
          catchError(error => of(FlashcardsActions.rateFlashcardFailure({ error: error.message })))
        )
      )
    )
  );

  // Refresh revision summary after rating
  refreshSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.rateFlashcardSuccess),
      map(() => RevisionActions.loadSummary())
    )
  );
}
