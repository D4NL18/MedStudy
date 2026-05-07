import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DashboardKPIs } from '../../store/dashboard/dashboard.actions';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardKPIs(): Observable<DashboardKPIs> {
    // Para v1, podemos usar o HttpClient real ou mockar se o backend não estiver rodando
    return this.http.get<DashboardKPIs>(this.apiUrl);
  }

  // Mock para desenvolvimento inicial
  getDashboardKPIsMock(): Observable<DashboardKPIs> {
    return of({
      sessions: { total: 45, completed: 40, accuracy: 78.5 },
      simulados: { total: 12, averageAccuracy: 72.0 },
      currentStreak: 5,
      strongArea: 'Clínica Médica',
      weakArea: 'Preventiva'
    });
  }
}
