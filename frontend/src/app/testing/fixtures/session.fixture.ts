import { QuestionSession } from '../../core/models/question-session.model';

export const createMockSession = (overrides?: Partial<QuestionSession>): QuestionSession => ({
  id: 1,
  tema: 'Hepatologia',
  grandeArea: 'Clínica Médica',
  data: '2026-05-01',
  qtsFeitas: 50,
  qtsCorretas: 40,
  instituicao: 'MedCurso',
  dataProximaRevisao: '2026-05-08',
  revisaoConcluida: false,
  ...overrides
});

export const mockSessionsResponse = {
  content: [createMockSession(), createMockSession({ id: 2, tema: 'Cardiologia' })],
  totalElements: 2,
  totalPages: 1,
  size: 20,
  number: 0
};
