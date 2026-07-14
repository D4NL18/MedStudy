import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RevisionSummary, StudySession, PaginatedResponse, RedistributionPreviewRequest, RedistributionDraftResponse } from '../models/revision.model';


/**
 * Angular service responsible for Revision-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Revision operations.
 */
@Injectable({
  providedIn: 'root'
})
export class RevisionService {
  private apiUrl = '/api/revisoes';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<RevisionSummary> {
    return this.http.get<RevisionSummary>(`${this.apiUrl}/resumo`);
  }

  getSessions(filter: string, page = 0, size = 10, search = ''): Observable<PaginatedResponse<StudySession>> {
    let params = new HttpParams()
      .set('tipo', filter)
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<PaginatedResponse<StudySession>>(this.apiUrl, { params });
  }

  concluirRevisao(id: string): Observable<void> {
    return this.http.patch<void>(`/api/study-sessions/${id}/concluir`, {});
  }

  previewRedistribution(request: RedistributionPreviewRequest): Observable<RedistributionDraftResponse> {
    return this.http.post<RedistributionDraftResponse>('/api/redistribute/preview', request);
  }

  applyRedistribution(draftId: string): Observable<void> {
    return this.http.post<void>(`/api/redistribute/apply/${draftId}`, {});
  }
}
