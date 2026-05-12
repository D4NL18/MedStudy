export interface AreaPerformance {
  area: string;
  totais: number;
  acertos: number;
}

export interface Simulado {
  id: string;
  nome: string;
  dataRealizacao: string;
  instituicao?: string;
  ano?: number;
  
  cmTotal: number; cmAcertos: number; cmErros: number;
  cirTotal: number; cirAcertos: number; cirErros: number;
  pedTotal: number; pedAcertos: number; pedErros: number;
  goTotal: number; goAcertos: number; goErros: number;
  prevTotal: number; prevAcertos: number; prevErros: number;
  newlyEarnedBadges?: string[];
}

export interface SimuladoFilters {
  nome?: string;
  instituicao?: string;
  page: number;
  size: number;
}
