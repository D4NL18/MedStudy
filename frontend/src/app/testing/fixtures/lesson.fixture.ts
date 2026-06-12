import { Lesson, LessonPriority } from '@core/models/lesson.model';


/**
 * Test fixture data for Lesson.
 * @description Provides reusable mock objects for use in unit and integration tests.
 */
export const createMockLesson = (overrides?: Partial<Lesson>): Lesson => ({
  id: '1',
  grandeArea: 'Clínica Médica',
  tema: 'Hepatologia',
  prioridade: LessonPriority.DIAMANTE,
  aulaAssistida: false,
  reforco: false,
  revisao: false,
  ...overrides
});

export const mockLessonsResponse = [
  createMockLesson(),
  createMockLesson({ id: '2', tema: 'Cardiologia', aulaAssistida: true }),
  createMockLesson({ id: '3', tema: 'Nefrologia', prioridade: LessonPriority.ALTA })
];
