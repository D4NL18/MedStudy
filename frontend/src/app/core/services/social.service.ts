import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * Angular service responsible for Social-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Social operations.
 */
export interface SocialProfile {
  userId: string;
  name: string;
  handle: string;
  faculdade: string;
  semestre: number;
  avatarPresetId: string;
  isFormado: boolean;
  relationshipStatus: 'NONE' | 'PENDING' | 'ACCEPTED' | 'BLOCKED';
  isRequester: boolean;
  streak: number;
}

export interface SocialNotification {
  id: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderAvatarPresetId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private http = inject(HttpClient);
  private readonly FRIENDSHIPS_API = '/api/friendships';
  private readonly NOTIFICATIONS_API = '/api/notifications';

  searchProfiles(query: string): Observable<SocialProfile[]> {
    return this.http.get<SocialProfile[]>(`${this.FRIENDSHIPS_API}/search`, {
      params: { query }
    });
  }

  getFriends(): Observable<SocialProfile[]> {
    return this.http.get<SocialProfile[]>(this.FRIENDSHIPS_API);
  }

  getPendingRequests(): Observable<SocialProfile[]> {
    return this.http.get<SocialProfile[]>(`${this.FRIENDSHIPS_API}/pending`);
  }

  getBlockedUsers(): Observable<SocialProfile[]> {
    return this.http.get<SocialProfile[]>(`${this.FRIENDSHIPS_API}/blocked`);
  }

  sendFriendRequest(receiverId: string): Observable<void> {
    return this.http.post<void>(`${this.FRIENDSHIPS_API}/request/${receiverId}`, {});
  }

  acceptFriendRequest(requesterId: string): Observable<void> {
    return this.http.post<void>(`${this.FRIENDSHIPS_API}/accept/${requesterId}`, {});
  }

  declineFriendRequest(requesterId: string): Observable<void> {
    return this.http.post<void>(`${this.FRIENDSHIPS_API}/decline/${requesterId}`, {});
  }

  removeFriend(friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.FRIENDSHIPS_API}/${friendId}`);
  }

  blockUser(targetUserId: string): Observable<void> {
    return this.http.post<void>(`${this.FRIENDSHIPS_API}/block/${targetUserId}`, {});
  }

  unblockUser(targetUserId: string): Observable<void> {
    return this.http.post<void>(`${this.FRIENDSHIPS_API}/unblock/${targetUserId}`, {});
  }

  getSocialNotifications(): Observable<SocialNotification[]> {
    return this.http.get<SocialNotification[]>(`${this.NOTIFICATIONS_API}/social`);
  }

  markNotificationAsRead(id: string): Observable<void> {
    return this.http.post<void>(`${this.NOTIFICATIONS_API}/social/${id}/read`, {});
  }

  markAllNotificationsAsRead(): Observable<void> {
    return this.http.post<void>(`${this.NOTIFICATIONS_API}/social/read-all`, {});
  }
}
