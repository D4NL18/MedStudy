export enum LessonPriority {
  DIAMANTE = 'DIAMANTE',
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA'
}

export interface Lesson {
  id: string;
  grandeArea: string;
  tema: string;
  prioridade: LessonPriority;
  aulaAssistida: boolean;
}
