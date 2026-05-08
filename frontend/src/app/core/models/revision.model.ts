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
