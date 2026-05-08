import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LessonService } from '../../core/services/lesson.service';
import { StudyPlanActions } from './study-plan.actions';

@Injectable()
export class StudyPlanEffects {
  private actions$ = inject(Actions);
  private lessonService = inject(LessonService);

  loadLessons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.loadLessons),
      mergeMap(() =>
        this.lessonService.getLessons().pipe(
          map(lessons => StudyPlanActions.loadLessonsSuccess({ lessons })),
          catchError(error => of(StudyPlanActions.loadLessonsFailure({ error: error.message })))
        )
      )
    )
  );

  toggleLessonAssisted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.toggleLessonAssisted),
      mergeMap(({ lessonId }) =>
        this.lessonService.toggleAssisted(lessonId).pipe(
          map(lesson => StudyPlanActions.toggleLessonAssistedSuccess({ lesson })),
          catchError(error => of(StudyPlanActions.toggleLessonAssistedFailure({ error: error.message })))
        )
      )
    )
  );
}
