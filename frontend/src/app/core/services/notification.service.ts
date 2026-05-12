import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationSummary {
  pendingRevisions: number;
  reinforcementLessons: number;
  totalAlerts: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  getSummary(): Observable<NotificationSummary> {
    return this.http.get<NotificationSummary>(`${this.apiUrl}/summary`);
  }
}
