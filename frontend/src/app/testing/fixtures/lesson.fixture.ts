import { Lesson, LessonPriority } from '@core/models/lesson.model';

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
