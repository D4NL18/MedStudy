/**
 * TypeScript model/interface for Lesson.
 * @description Defines the data shape used by the application for Lesson entities.
 */
export enum LessonPriority {
  DIAMANTE = 'DIAMANTE',
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA'
}

export interface Lesson {
  id: string;
  grandeArea: string;
  subArea?: string;
  tema: string;
  prioridade: LessonPriority;
  aulaAssistida: boolean;
  dataAula?: string;
  percentAcerto?: number;
  reforco: boolean;
  revisao: boolean;
}

export interface LessonSummary {
  total: number;
  assistidas: number;
  pendentes: number;
  diamantePendentes: number;
}
