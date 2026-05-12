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
    return this.http.get<DashboardKPIs>(this.apiUrl);
  }

  // Mock para desenvolvimento inicial sincronizado com a v1.1
  getDashboardKPIsMock(): Observable<DashboardKPIs> {
    return of({
      sessions: { 
        totalSessions: 45, 
        totalQuestions: 450, 
        successRate: 78.5,
        performanceLevel: 'MEDIUM' 
      },
      simulados: { 
        totalSimulados: 12, 
        averageScore: 72.0,
        bestArea: 'Clínica Médica',
        worstArea: 'Preventiva'
      },
      currentStreak: 5,
      strongArea: 'Clínica Médica',
      weakArea: 'Preventiva',
      areaAnalytics: [],
      topErrors: [],
      evolution: [],
      recentBadges: []
    });
  }
}
