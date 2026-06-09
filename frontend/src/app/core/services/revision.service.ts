import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RevisionSummary, StudySession } from '../models/revision.model';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {
  private apiUrl = '/api/revisoes';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<RevisionSummary> {
    return this.http.get<RevisionSummary>(`${this.apiUrl}/resumo`);
  }

  getSessions(filter: string): Observable<StudySession[]> {
    const params = new HttpParams().set('tipo', filter);
    return this.http.get<StudySession[]>(this.apiUrl, { params });
  }

  concluirRevisao(id: string): Observable<void> {
    return this.http.patch<void>(`/api/study-sessions/${id}/concluir`, {});
  }
}
