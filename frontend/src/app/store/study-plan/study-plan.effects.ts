import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LessonService } from '@core/services/lesson.service';
import { ToastService } from '@core/services/toast.service';
import { StudyPlanActions } from './study-plan.actions';

@Injectable()
export class StudyPlanEffects {
  private actions$ = inject(Actions);
  private lessonService = inject(LessonService);
  private toast = inject(ToastService);

  loadLessons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.loadLessons),
      mergeMap((filters) =>
        this.lessonService.getLessons(filters.page, filters.size, filters).pipe(
          map(result => StudyPlanActions.loadLessonsSuccess({ lessons: result.content, totalElements: result.totalElements })),
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
          map(savedLesson => {
            this.toast.success('Aula criada com sucesso!');
            return StudyPlanActions.createLessonSuccess({ lesson: savedLesson });
          }),
          catchError(error => {
            const errorMsg = error.error?.message || error.message || 'Erro desconhecido';
            this.toast.error('Erro ao criar aula: ' + errorMsg);
            return of(StudyPlanActions.createLessonFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  updateLesson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.updateLesson),
      mergeMap(({ id, lesson }) =>
        this.lessonService.updateLesson(id, lesson).pipe(
          map(savedLesson => {
            this.toast.success('Aula atualizada!');
            return StudyPlanActions.updateLessonSuccess({ lesson: savedLesson });
          }),
          catchError(error => {
            this.toast.error('Erro ao atualizar aula');
            return of(StudyPlanActions.updateLessonFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteLesson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudyPlanActions.deleteLesson),
      mergeMap(({ id }) =>
        this.lessonService.deleteLesson(id).pipe(
          map(() => {
            this.toast.success('Aula excluída');
            return StudyPlanActions.deleteLessonSuccess({ id });
          }),
          catchError(error => {
            this.toast.error('Erro ao excluir aula');
            return of(StudyPlanActions.deleteLessonFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
