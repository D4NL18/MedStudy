import { createFeature, createReducer, on } from '@ngrx/store';
import { Lesson } from '../../core/models/lesson.model';
import { StudyPlanActions } from './study-plan.actions';

export interface StudyPlanState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

export const initialState: StudyPlanState = {
  lessons: [],
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
    on(StudyPlanActions.loadLessonsSuccess, (state, { lessons }) => ({
      ...state,
      lessons,
      loading: false
    })),
    on(StudyPlanActions.loadLessonsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
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
  selectLoading,
  selectError,
} = studyPlanFeature;
