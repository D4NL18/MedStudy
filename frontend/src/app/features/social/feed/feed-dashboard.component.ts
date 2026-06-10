import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedService } from './feed.service';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FeedItemComponent } from './feed-item.component';

@Component({
  selector: 'app-feed-dashboard',
  standalone: true,
  imports: [CommonModule, FeedItemComponent],
  template: `
    <div class="feed-dashboard-container fade-in">
      <div class="feed-list" *ngIf="events$ | async as events">
        <app-feed-item 
          *ngFor="let event of events" 
          [event]="event" 
          [currentUserId]="currentUserId">
        </app-feed-item>
        
        <div *ngIf="events.length === 0" class="empty-state">
          No recent activities.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feed-dashboard-container { 
      max-width: 680px; 
      margin: 0 auto; 
      padding: 0 16px; 
    }
    .feed-header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #E2E8F0;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .empty-state { 
      text-align: center; 
      color: #94A3B8; 
      margin-top: 48px; 
      padding: 40px;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }
  `]
})
export class FeedDashboardComponent implements OnInit, OnDestroy {
  
  events$!: Observable<any[]>;
  currentUserId = 1; // PoC: Hardcoded current user

  constructor(private feedService: FeedService) {}

  ngOnInit() {
    this.events$ = this.feedService.events$;
    this.feedService.loadFeed(this.currentUserId);
    this.feedService.startSseConnection(this.currentUserId);
  }

  ngOnDestroy() {
    this.feedService.stopSseConnection();
  }
}
