import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ClinicalMasteryResponse } from '@core/models/clinical-mastery.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicalMasteryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/dashboard/maestria-clinica';

  getMastery(): Observable<ClinicalMasteryResponse> {
    return this.http.get<ClinicalMasteryResponse>(this.apiUrl).pipe(
      catchError(() => of(this.getFallbackMastery()))
    );
  }

  private getFallbackMastery(): ClinicalMasteryResponse {
    return {
      overallMastery: 48,
      overallTier: 'OURO',
      areas: [
        {
          grandeArea: 'CLINICA_MEDICA',
          displayName: 'Clínica Médica',
          regionKey: 'torax_snc',
          masteryPercentage: 68,
          tier: 'PLATINA',
          corHex: '#3B82F6',
          questoesFeitas: 420,
          taxaAcertoQuestoes: 76,
          cardsRevisados: 190,
          taxaRetencaoCards: 82,
          aulasAssistidas: 24,
          totalAulas: 30
        },
        {
          grandeArea: 'CIRURGIA_GERAL',
          displayName: 'Cirurgia Geral',
          regionKey: 'abdome_tgi',
          masteryPercentage: 54,
          tier: 'OURO',
          corHex: '#F97316',
          questoesFeitas: 310,
          taxaAcertoQuestoes: 69,
          cardsRevisados: 120,
          taxaRetencaoCards: 74,
          aulasAssistidas: 18,
          totalAulas: 28
        },
        {
          grandeArea: 'PEDIATRIA',
          displayName: 'Pediatria',
          regionKey: 'cabeca_membros',
          masteryPercentage: 78,
          tier: 'RUBI',
          corHex: '#10B981',
          questoesFeitas: 280,
          taxaAcertoQuestoes: 85,
          cardsRevisados: 160,
          taxaRetencaoCards: 88,
          aulasAssistidas: 20,
          totalAulas: 22
        },
        {
          grandeArea: 'GINECOLOGIA_OBSTETRICIA',
          displayName: 'Ginecologia e Obstetrícia',
          regionKey: 'pelve_urogenital',
          masteryPercentage: 38,
          tier: 'PRATA',
          corHex: '#EC4899',
          questoesFeitas: 190,
          taxaAcertoQuestoes: 58,
          cardsRevisados: 85,
          taxaRetencaoCards: 62,
          aulasAssistidas: 12,
          totalAulas: 26
        },
        {
          grandeArea: 'MEDICINA_PREVENTIVA',
          displayName: 'Medicina Preventiva',
          regionKey: 'silhueta_sistemica',
          masteryPercentage: 88,
          tier: 'ESMERALDA',
          corHex: '#EAB308',
          questoesFeitas: 340,
          taxaAcertoQuestoes: 91,
          cardsRevisados: 210,
          taxaRetencaoCards: 94,
          aulasAssistidas: 25,
          totalAulas: 25
        }
      ]
    };
  }
}
