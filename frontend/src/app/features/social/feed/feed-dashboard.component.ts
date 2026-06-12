import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedService } from './feed.service';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FeedItemComponent } from './feed-item.component';
import { FeedSkeletonComponent } from './components/feed-skeleton/feed-skeleton.component';


/**
 * Angular component for the Feed Dashboard feature.
 * @description Handles the presentation logic and user interactions for the Feed Dashboard view.
 */
@Component({
  selector: 'app-feed-dashboard',
  standalone: true,
  imports: [CommonModule, FeedItemComponent, FeedSkeletonComponent],
  templateUrl: './feed-dashboard.component.html',
  styleUrls: ['./feed-dashboard.component.scss']
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
