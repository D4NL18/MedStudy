import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Lesson } from '../../core/models/lesson.model';

export const StudyPlanActions = createActionGroup({
  source: 'Study Plan',
  events: {
    'Load Lessons': emptyProps(),
    'Load Lessons Success': props<{ lessons: Lesson[] }>(),
    'Load Lessons Failure': props<{ error: string }>(),
    'Toggle Lesson Assisted': props<{ lessonId: string }>(),
    'Toggle Lesson Assisted Success': props<{ lesson: Lesson }>(),
    'Toggle Lesson Assisted Failure': props<{ error: string }>(),
  }
});
