export type MasteryTier = 
  | 'INICIANTE' 
  | 'BRONZE' 
  | 'PRATA' 
  | 'OURO' 
  | 'PLATINA' 
  | 'RUBI' 
  | 'ESMERALDA' 
  | 'DIAMANTE';

export type GrandeAreaKey = 
  | 'CLINICA_MEDICA' 
  | 'CIRURGIA_GERAL' 
  | 'PEDIATRIA' 
  | 'GINECOLOGIA_OBSTETRICIA' 
  | 'MEDICINA_PREVENTIVA';

export interface AreaMastery {
  grandeArea: GrandeAreaKey;
  displayName: string;
  regionKey: 'torax_snc' | 'abdome_tgi' | 'cabeca_membros' | 'pelve_urogenital' | 'silhueta_sistemica';
  masteryPercentage: number;
  tier: MasteryTier;
  corHex: string;
  questoesFeitas: number;
  taxaAcertoQuestoes: number;
  cardsRevisados: number;
  taxaRetencaoCards: number;
  aulasAssistidas: number;
  totalAulas: number;
  questoesSimulados?: number;
  taxaAcertoSimulados?: number;
}

export interface ClinicalMasteryResponse {
  overallMastery: number;
  overallTier: MasteryTier;
  areas: AreaMastery[];
}
