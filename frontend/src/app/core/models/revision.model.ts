/**
 * TypeScript model/interface for Revision.
 * @description Defines the data shape used by the application for Revision entities.
 */
export interface RevisionSummary {
  atrasadas: number;
  hoje: number;
  futuras: number;
  concluidas: number;
}

export interface StudySession {
  id: string;
  grandeArea: string;
  tema: string;
  dataSessao: string;
  qtsFeitas: number;
  qtsCorretas: number;
  instituicao: string;
  observacoes: string;
  dataProximaRevisao: string;
  revisaoConcluida: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface RedistributionPreviewRequest {
  targetEndDate: string;
}

export interface DailyLoadDto {
  date: string;
  originalCount: number;
  newCount: number;
}

export interface RedistributionDraftResponse {
  draftId: string;
  totalRevisionsRedistributed: number;
  daysSpread: number;
  warningLimitExceeded: boolean;
  dailyLoads: DailyLoadDto[];
}
