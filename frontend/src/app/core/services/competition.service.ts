import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competition, CompetitionRequest, LeaderboardEntry } from '../models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private http = inject(HttpClient);
  private readonly API = '/api/competitions';

  createCompetition(request: CompetitionRequest): Observable<Competition> {
    return this.http.post<Competition>(this.API, request);
  }

  acceptInvite(id: string): Observable<Competition> {
    return this.http.post<Competition>(`${this.API}/${id}/accept`, {});
  }

  declineInvite(id: string): Observable<Competition> {
    return this.http.post<Competition>(`${this.API}/${id}/decline`, {});
  }

  getUserCompetitions(): Observable<Competition[]> {
    return this.http.get<Competition[]>(this.API);
  }

  getLeaderboard(id: string): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.API}/${id}/leaderboard`);
  }
}
