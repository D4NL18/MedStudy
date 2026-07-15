import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminSubscriptionStats {
  activeCount: number;
  trialCount: number;
  expiredCount: number;
  lifetimeCount: number;
  totalPixRevenue: number;
}

export interface AdminUserSubscription {
  userId: string;
  userName: string;
  userEmail: string;
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'LIFETIME';
  trialEndDate: string | null;
  currentPeriodEnd: string | null;
  isAdminOverride: boolean;
  notes: string | null;
}

export interface AdminPixTransaction {
  id: string;
  txid: string;
  userEmail: string;
  amount: number;
  status: 'CREATED' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  paidAt: string | null;
  e2eId: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type OverrideOption = 'ADD_30_DAYS' | 'ADD_90_DAYS' | 'ADD_365_DAYS' | 'GRANT_LIFETIME' | 'FORCE_EXPIRE';

@Injectable({
  providedIn: 'root'
})
export class AdminSubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/admin/subscriptions';

  getStats(): Observable<AdminSubscriptionStats> {
    return this.http.get<AdminSubscriptionStats>(`${this.apiUrl}/stats`);
  }

  getUsers(
    search?: string, 
    statuses?: string[], 
    isOrigins?: boolean[], 
    sortCol?: string, 
    sortDir?: 'asc' | 'desc',
    page = 0, 
    size = 20
  ): Observable<PageResponse<AdminUserSubscription>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) params = params.set('search', search);
    if (statuses && statuses.length > 0) {
      params = params.set('statuses', statuses.join(','));
    }
    if (isOrigins && isOrigins.length > 0) {
      params = params.set('isOrigins', isOrigins.join(','));
    }
    if (sortCol && sortDir) {
      params = params.set('sort', `${sortCol},${sortDir}`);
    }

    return this.http.get<PageResponse<AdminUserSubscription>>(`${this.apiUrl}/users`, { params });
  }

  overrideSubscription(userId: string, option: OverrideOption, notes: string): Observable<AdminUserSubscription> {
    return this.http.post<AdminUserSubscription>(`${this.apiUrl}/users/${userId}/override`, { option, notes });
  }

  getTransactions(
    page: number = 0,
    size: number = 20,
    sortCol?: string,
    sortDir?: string,
    search?: string,
    statuses?: string[]
  ): Observable<PageResponse<AdminPixTransaction>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (sortCol && sortDir) {
      params = params.set('sort', `${sortCol},${sortDir}`);
    }

    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    if (statuses && statuses.length > 0) {
      params = params.set('statuses', statuses.join(','));
    }

    return this.http.get<PageResponse<AdminPixTransaction>>(`${this.apiUrl}/transactions`, { params });
  }
}
