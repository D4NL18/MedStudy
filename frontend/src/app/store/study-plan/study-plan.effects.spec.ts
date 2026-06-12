import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { StudyPlanEffects } from './study-plan.effects';
import { LessonService } from '@core/services/lesson.service';
import { StudyPlanActions } from './study-plan.actions';
import { createMockLesson } from '@testing/fixtures/lesson.fixture';

describe('StudyPlanEffects', () => {
  let actions$: Observable<any>;
  let effects: StudyPlanEffects;
  let lessonService: jasmine.SpyObj<LessonService>;

  beforeEach(() => {
    lessonService = jasmine.createSpyObj('LessonService', [
      'getLessons',
      'toggleAssisted',
      'createLesson',
      'updateLesson',
      'deleteLesson'
    ]);

    TestBed.configureTestingModule({
      providers: [
        StudyPlanEffects,
        provideMockActions(() => actions$),
        { provide: LessonService, useValue: lessonService }
      ]
    });

    effects = TestBed.inject(StudyPlanEffects);
  });

  it('should load lessons successfully', (done) => {
    const mockLessons = [createMockLesson()];
    lessonService.getLessons.and.returnValue(of({ content: mockLessons, totalElements: 1 }));
    actions$ = of(StudyPlanActions.loadLessons({}));

    effects.loadLessons$.subscribe(action => {
      expect(action).toEqual(StudyPlanActions.loadLessonsSuccess({ lessons: mockLessons, totalElements: 1 }));
      done();
    });
  });

  it('should toggle assisted successfully', (done) => {
    const mockLesson = createMockLesson({ id: '1', aulaAssistida: true });
    lessonService.toggleAssisted.and.returnValue(of(mockLesson));
    actions$ = of(StudyPlanActions.toggleLessonAssisted({ lessonId: '1' }));

    effects.toggleLessonAssisted$.subscribe(action => {
      expect(action).toEqual(StudyPlanActions.toggleLessonAssistedSuccess({ lesson: mockLesson }));
      done();
    });
  });

  it('should delete lesson successfully', (done) => {
    lessonService.deleteLesson.and.returnValue(of(undefined));
    actions$ = of(StudyPlanActions.deleteLesson({ id: '1' }));

    effects.deleteLesson$.subscribe(action => {
      expect(action).toEqual(StudyPlanActions.deleteLessonSuccess({ id: '1' }));
      done();
    });
  });

  it('should create lesson successfully', (done) => {
    const mockLesson = createMockLesson();
    lessonService.createLesson.and.returnValue(of(mockLesson));
    actions$ = of(StudyPlanActions.createLesson({ lesson: mockLesson }));

    effects.createLesson$.subscribe(action => {
      expect(action).toEqual(StudyPlanActions.createLessonSuccess({ lesson: mockLesson }));
      done();
    });
  });

  it('should update lesson successfully', (done) => {
    const mockLesson = createMockLesson();
    lessonService.updateLesson.and.returnValue(of(mockLesson));
    actions$ = of(StudyPlanActions.updateLesson({ id: '1', lesson: mockLesson }));

    effects.updateLesson$.subscribe(action => {
      expect(action).toEqual(StudyPlanActions.updateLessonSuccess({ lesson: mockLesson }));
      done();
    });
  });
});
