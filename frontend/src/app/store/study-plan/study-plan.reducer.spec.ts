import { reducer, initialState } from './study-plan.reducer';
import { StudyPlanActions } from './study-plan.actions';

describe('StudyPlanReducer', () => {
  it('should set loading on loadLessons', () => {
    const action = StudyPlanActions.loadLessons({});
    const state = reducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set lessons on loadLessonsSuccess', () => {
    const lessons = [{ id: '1' } as any];
    const action = StudyPlanActions.loadLessonsSuccess({ lessons, totalElements: 1 });
    const state = reducer(initialState, action);
    expect(state.lessons).toEqual(lessons);
    expect(state.loading).toBeFalse();
  });

  it('should update lesson on updateLessonSuccess', () => {
    const initialStateWithLessons = { ...initialState, lessons: [{ id: '1', tema: 'Old' } as any, { id: '2', tema: 'Other' } as any] };
    const updatedLesson = { id: '1', tema: 'New' } as any;
    const action = StudyPlanActions.updateLessonSuccess({ lesson: updatedLesson });
    const state = reducer(initialStateWithLessons, action);
    expect(state.lessons[0].tema).toBe('New');
    expect(state.lessons[1].tema).toBe('Other'); // No match branch
  });

  it('should remove lesson on deleteLessonSuccess', () => {
    const initialStateWithLessons = { ...initialState, lessons: [{ id: '1' } as any] };
    const action = StudyPlanActions.deleteLessonSuccess({ id: '1' });
    const state = reducer(initialStateWithLessons, action);
    expect(state.lessons.length).toBe(0);
  });

  it('should update lesson on toggleLessonAssistedSuccess', () => {
    const lesson = { id: '1', aulaAssistida: false } as any;
    const other = { id: '2', aulaAssistida: false } as any;
    const startState = { ...initialState, lessons: [lesson, other] };
    const updated = { ...lesson, aulaAssistida: true };
    const action = StudyPlanActions.toggleLessonAssistedSuccess({ lesson: updated });
    const state = reducer(startState, action);
    expect(state.lessons[0].aulaAssistida).toBeTrue();
    expect(state.lessons[1].aulaAssistida).toBeFalse(); // No match branch
  });

  it('should set loading on createLesson', () => {
    const action = StudyPlanActions.createLesson({ lesson: {} as any });
    const state = reducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should add lesson on createLessonSuccess', () => {
    const lesson = { id: '2' } as any;
    const action = StudyPlanActions.createLessonSuccess({ lesson });
    const state = reducer(initialState, action);
    expect(state.lessons).toContain(lesson);
    expect(state.loading).toBeFalse();
  });

  it('should set error on loadLessonsFailure', () => {
    const error = 'Failed';
    const action = StudyPlanActions.loadLessonsFailure({ error });
    const state = reducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.loading).toBeFalse();
  });

  it('should set error on createLessonFailure', () => {
    const error = 'Failed';
    const action = StudyPlanActions.createLessonFailure({ error });
    const state = reducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.loading).toBeFalse();
  });
});
