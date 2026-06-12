import { Component, Input, OnInit } from '@angular/core';
import { FeedEvent, FeedService } from './feed.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';


/**
 * Angular component for the Feed Item feature.
 * @description Handles the presentation logic and user interactions for the Feed Item view.
 */
@Component({
  selector: 'app-feed-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit {
  @Input() event!: FeedEvent;
  @Input() currentUserId!: number;
  
  interacted = false;
  parsedMetadata: any = null;

  constructor(private feedService: FeedService) {}

  ngOnInit() {
    if (this.event.metadata) {
      try {
        this.parsedMetadata = JSON.parse(this.event.metadata);
      } catch (e) {
        console.error('Failed to parse feed metadata', e);
      }
    }
  }

  getFeedMessage(): string {
    switch(this.event.type) {
      case 'BADGE_EARNED': return 'Conquistou uma nova medalha!';
      case 'STREAK_RECORD': return 'Bateu um novo recorde de ofensiva!';
      default: return 'Alcançou algo incrível!';
    }
  }

  onInteract(type: 'CLAP' | 'CHEER') {
    this.interacted = true; // Optimistic locking
    this.feedService.interact(this.event.id, this.currentUserId, type).subscribe({
      next: () => console.log('Interaction sent successfully'),
      error: () => {
        console.error('Interaction failed (maybe spam)');
        // Don't revert interacted state to prevent further spam locally
      }
    });
  }
}
