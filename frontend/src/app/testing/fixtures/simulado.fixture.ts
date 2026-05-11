import { Simulado } from '../../core/models/simulado.model';

export const createMockSimulado = (overrides?: Partial<Simulado>): Simulado => ({
  id: '1',
  nome: 'Simulado USP 2024',
  instituicao: 'USP',
  ano: 2024,
  dataRealizacao: '2024-05-09',
  cmTotal: 20, cmAcertos: 15, cmErros: 5,
  cirTotal: 20, cirAcertos: 15, cirErros: 5,
  pedTotal: 20, pedAcertos: 15, pedErros: 5,
  goTotal: 20, goAcertos: 15, goErros: 5,
  prevTotal: 20, prevAcertos: 15, prevErros: 5,
  ...overrides
});

export const mockSimuladosResponse = [
  createMockSimulado(),
  createMockSimulado({ id: '2', instituicao: 'UNICAMP', cmAcertos: 10 })
];
