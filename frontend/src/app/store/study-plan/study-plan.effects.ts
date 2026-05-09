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
      mergeMap((filters) =>
        this.lessonService.getLessons(filters).pipe(
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

  createLesson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.createLesson),
      mergeMap(({ lesson }) =>
        this.lessonService.createLesson(lesson).pipe(
          map(savedLesson => StudyPlanActions.createLessonSuccess({ lesson: savedLesson })),
          catchError(error => of(StudyPlanActions.createLessonFailure({ error: error.message })))
        )
      )
    )
  );

  updateLesson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.updateLesson),
      mergeMap(({ id, lesson }) =>
        this.lessonService.updateLesson(id, lesson).pipe(
          map(savedLesson => StudyPlanActions.updateLessonSuccess({ lesson: savedLesson })),
          catchError(error => of(StudyPlanActions.updateLessonFailure({ error: error.message })))
        )
      )
    )
  );

  deleteLesson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.deleteLesson),
      mergeMap(({ id }) =>
        this.lessonService.deleteLesson(id).pipe(
          map(() => StudyPlanActions.deleteLessonSuccess({ id })),
          catchError(error => of(StudyPlanActions.deleteLessonFailure({ error: error.message })))
        )
      )
    )
  );
}
