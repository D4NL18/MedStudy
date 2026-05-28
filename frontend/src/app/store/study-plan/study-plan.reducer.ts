import { createFeature, createReducer, on } from '@ngrx/store';
import { Lesson } from '../../core/models/lesson.model';
import { StudyPlanActions } from './study-plan.actions';

export interface StudyPlanState {
  lessons: Lesson[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

export const initialState: StudyPlanState = {
  lessons: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const studyPlanFeature = createFeature({
  name: 'studyPlan',
  reducer: createReducer(
    initialState,
    on(StudyPlanActions.loadLessons, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(StudyPlanActions.loadLessonsSuccess, (state, { lessons, totalElements }) => ({
      ...state,
      lessons,
      totalElements,
      loading: false
    })),
    on(StudyPlanActions.loadLessonsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(StudyPlanActions.createLesson, (state) => ({
      ...state,
      loading: true
    })),
    on(StudyPlanActions.createLessonSuccess, (state, { lesson }) => ({
      ...state,
      lessons: [lesson, ...state.lessons],
      loading: false
    })),
    on(StudyPlanActions.createLessonFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(StudyPlanActions.updateLessonSuccess, (state, { lesson }) => ({
      ...state,
      lessons: state.lessons.map(l => l.id === lesson.id ? lesson : l)
    })),
    on(StudyPlanActions.deleteLessonSuccess, (state, { id }) => ({
      ...state,
      lessons: state.lessons.filter(l => l.id !== id)
    })),
    on(StudyPlanActions.toggleLessonAssistedSuccess, (state, { lesson }) => ({
      ...state,
      lessons: state.lessons.map(l => l.id === lesson.id ? lesson : l)
    }))
  ),
});

export const {
  name,
  reducer,
  selectStudyPlanState,
  selectLessons,
  selectTotalElements,
  selectLoading,
  selectError,
} = studyPlanFeature;
