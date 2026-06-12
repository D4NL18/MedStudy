/**
 * TypeScript model/interface for Question Session.
 * @description Defines the data shape used by the application for Question Session entities.
 */
export interface QuestionSession {
  id: string;
  dataSessao: string;
  grandeArea: string;
  tema: string;
  qtsFeitas: number;
  qtsCorretas: number;
  instituicao?: string;
  dataProximaRevisao?: string;
  revisaoConcluida: boolean;
  observacoes?: string;
  newlyEarnedBadges?: any[];
}

export interface QuestionSessionFilters {
  grandeArea?: string;
  tema?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
  sort?: string;
}
