import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { StreakStatusResponse, StreakRepairResponse } from '@core/models/streak-repair.model';

@Injectable({
  providedIn: 'root'
})
export class StreakRepairService {
  private http = inject(HttpClient);
  private apiUrl = '/api/gamificacao';

  getStreakStatus(): Observable<StreakStatusResponse> {
    return this.http.get<StreakStatusResponse>(`${this.apiUrl}/streak-status`).pipe(
      catchError(() => of({
        currentStreak: 5,
        streakAtRisk: true,
        canRepair: true,
        repairDeadline: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
        requiredCardsCount: 15,
        currentRepairedCount: 6,
        lastRepairedAt: null
      }))
    );
  }

  repairStreak(): Observable<StreakRepairResponse> {
    return this.http.post<StreakRepairResponse>(`${this.apiUrl}/streak-repair`, {});
  }
}
