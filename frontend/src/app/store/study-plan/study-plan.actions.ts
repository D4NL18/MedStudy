import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Lesson } from '../../core/models/lesson.model';

export const StudyPlanActions = createActionGroup({
  source: 'Study Plan',
  events: {
    'Load Lessons': props<{ 
      grandeArea?: string, 
      prioridade?: string, 
      aulaAssistida?: boolean, 
      tema?: string 
    }>(),
    'Load Lessons Success': props<{ lessons: Lesson[] }>(),
    'Load Lessons Failure': props<{ error: string }>(),
    
    'Toggle Lesson Assisted': props<{ lessonId: string }>(),
    'Toggle Lesson Assisted Success': props<{ lesson: Lesson }>(),
    'Toggle Lesson Assisted Failure': props<{ error: string }>(),
    
    'Create Lesson': props<{ lesson: Partial<Lesson> }>(),
    'Create Lesson Success': props<{ lesson: Lesson }>(),
    'Create Lesson Failure': props<{ error: string }>(),

    'Update Lesson': props<{ id: string, lesson: Partial<Lesson> }>(),
    'Update Lesson Success': props<{ lesson: Lesson }>(),
    'Update Lesson Failure': props<{ error: string }>(),
    
    'Delete Lesson': props<{ id: string }>(),
    'Delete Lesson Success': props<{ id: string }>(),
    'Delete Lesson Failure': props<{ error: string }>()
  }
});
