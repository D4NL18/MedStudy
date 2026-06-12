import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * Angular service responsible for Badge-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Badge operations.
 */
export interface UserBadge {
  type: string;
  displayName: string;
  description: string;
  earnedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/badges';

  getUserBadges(): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(this.apiUrl);
  }

  getAllBadges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
