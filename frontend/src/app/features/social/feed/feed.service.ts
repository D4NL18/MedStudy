import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


/**
 * Angular service responsible for Feed-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Feed operations.
 */
export interface FeedEvent {
  id: number;
  userId: number;
  type: string;
  createdAt: string;
  metadata: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private feedUrl = '/api/feed';
  private eventsSubject = new BehaviorSubject<FeedEvent[]>([]);
  public events$ = this.eventsSubject.asObservable();
  
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {}

  loadFeed(userId: number) {
    this.http.get<{content: FeedEvent[]}>(`${this.feedUrl}?currentUserId=${userId}`).subscribe(res => {
      this.eventsSubject.next(res.content);
    });
  }

  startSseConnection(userId: number) {
    if (this.eventSource) {
      this.eventSource.close();
    }
    
    this.eventSource = new EventSource(`${this.feedUrl}/stream?userId=${userId}`);
    
    this.eventSource.addEventListener('feed_event', (e: any) => {
      const newEvent = JSON.parse(e.data) as FeedEvent;
      const currentEvents = this.eventsSubject.value;
      this.eventsSubject.next([newEvent, ...currentEvents]);
    });

    this.eventSource.onerror = (e) => {
      console.error('SSE Error', e);
      this.eventSource?.close();
      // Reconnect logic could be implemented here
    };
  }

  interact(eventId: number, userId: number, type: 'CLAP' | 'CHEER'): Observable<any> {
    return this.http.post(`${this.feedUrl}/${eventId}/interact?userId=${userId}&type=${type}`, {});
  }

  stopSseConnection() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
