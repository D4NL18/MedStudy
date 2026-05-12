import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/badges`;

  getUserBadges(): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(this.apiUrl);
  }
}
