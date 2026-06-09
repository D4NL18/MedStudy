import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RevisionSummary, StudySession, PaginatedResponse } from '../models/revision.model';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {
  private apiUrl = '/api/revisoes';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<RevisionSummary> {
    return this.http.get<RevisionSummary>(`${this.apiUrl}/resumo`);
  }

  getSessions(filter: string, page: number = 0, size: number = 10, search: string = ''): Observable<PaginatedResponse<StudySession>> {
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
}
