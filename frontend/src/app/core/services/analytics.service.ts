import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaAnalytics, TopicAnalytics } from '@store/analytics/analytics.actions';


/**
 * Angular service responsible for Analytics-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Analytics operations.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getAreaAnalytics(): Observable<AreaAnalytics[]> {
    return this.http.get<AreaAnalytics[]>('/api/analytics/areas');
  }

  getTopicAnalytics(): Observable<TopicAnalytics[]> {
    return this.http.get<TopicAnalytics[]>('/api/analytics/topics');
  }

  getTopErrors(period = 'LAST_60_DAYS'): Observable<any[]> {
    return this.http.get<any[]>(`/api/analytics/errors?period=${period}`);
  }
}
