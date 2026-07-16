import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSubscription {
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'LIFETIME';
  trialEndDate: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  isLifetime: boolean;
}

export interface PixTransaction {
  id: string;
  txid: string;
  amount: number;
  status: 'CREATED' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  paidAt: string | null;
  e2eId: string | null;
  pixCopiaECola: string;
  qrCodeBase64: string;
  expirationDate: string;
}

export interface PixResponse {
  txid: string;
  qrCodeBase64: string;
  pixCopiaECola: string;
  expiresInSeconds: number;
}

export interface PixStatusResponse {
  txid: string;
  status: 'CREATED' | 'PAID' | 'EXPIRED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/subscriptions';

  getMySubscription(): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(`${this.apiUrl}/me`);
  }

  getMyTransactions(): Observable<PixTransaction[]> {
    return this.http.get<PixTransaction[]>(`${this.apiUrl}/me/transactions`);
  }

  createPixCharge(): Observable<PixResponse> {
    return this.http.post<PixResponse>(`${this.apiUrl}/pix/create`, {});
  }

  getPixStatus(txid: string): Observable<PixStatusResponse> {
    return this.http.get<PixStatusResponse>(`${this.apiUrl}/pix/${txid}/status`);
  }
}
