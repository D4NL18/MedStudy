import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface NotificationSummary {
  pendingRevisions: number;
  reinforcementLessons: number;
  socialAlerts: number;
  totalAlerts: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/notifications';

  summary = signal<NotificationSummary | null>(null);

  getSummary(): Observable<NotificationSummary> {
    return this.http.get<NotificationSummary>(`${this.apiUrl}/summary`).pipe(
      tap(sum => this.summary.set(sum))
    );
  }

  refreshSummary(): void {
    this.getSummary().subscribe();
  }
}
