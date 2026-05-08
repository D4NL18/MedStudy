import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionSession, QuestionSessionFilters } from '../models/question-session.model';

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/study-sessions';

  getSessions(filters: QuestionSessionFilters): Observable<{ content: QuestionSession[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString());

    if (filters.grandeArea) params = params.set('grandeArea', filters.grandeArea);
    if (filters.tema) params = params.set('tema', filters.tema);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);

    return this.http.get<{ content: QuestionSession[], totalElements: number }>(this.API_URL, { params });
  }

  createSession(session: Partial<QuestionSession>): Observable<QuestionSession> {
    return this.http.post<QuestionSession>(this.API_URL, session);
  }

  updateSession(id: string, session: Partial<QuestionSession>): Observable<QuestionSession> {
    return this.http.put<QuestionSession>(`${this.API_URL}/${id}`, session);
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
