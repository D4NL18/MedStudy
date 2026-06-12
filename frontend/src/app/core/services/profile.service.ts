import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile, ProfileCheckResponse } from '../models/profile.model';


/**
 * Angular service responsible for Profile-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Profile operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/profiles';

  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/me`);
  }

  saveProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.API_URL, profile);
  }

  checkHandle(handle: string): Observable<ProfileCheckResponse> {
    return this.http.get<ProfileCheckResponse>(`${this.API_URL}/check-handle`, {
      params: { handle }
    });
  }

  getPublicProfile(handle: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/public/${handle}`);
  }
}
