import { Component, Input, OnInit } from '@angular/core';
import { FeedEvent, FeedService } from './feed.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feed-item-card glass">
      <div class="card-glow"></div>
      
      <div class="feed-header">
        <div class="user-info">
          <div class="avatar-wrap">
            <div class="avatar-placeholder">U</div>
          </div>
          <div class="user-meta">
            <strong>Usuário ID: {{ event.userId }}</strong>
            <span class="time-ago">Há pouco</span>
          </div>
        </div>
        <span class="feed-type" *ngIf="event.type !== 'BADGE_EARNED'">{{ event.type }}</span>
      </div>
      
      <div class="feed-body" *ngIf="parsedMetadata">
        <div class="badge-display" *ngIf="event.type === 'BADGE_EARNED'">
          <div class="badge-icon-wrap">
            <div class="badge-icon">🏆</div>
          </div>
          <div class="badge-info">
            <h4>{{ parsedMetadata.badgeName }}</h4>
            <p>{{ parsedMetadata.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="feed-body text-content" *ngIf="!parsedMetadata">
        <p>{{ getFeedMessage() }}</p>
      </div>
      
      <div class="feed-actions">
        <button (click)="onInteract('CLAP')" [disabled]="interacted" class="btn-interact clap" [class.active]="interacted">
          <span class="icon">👏</span> Parabéns!
        </button>
        <button (click)="onInteract('CHEER')" [disabled]="interacted" class="btn-interact cheer" [class.active]="interacted">
          <span class="icon">🎉</span> Uau!
        </button>
      </div>
    </div>
  `,
  styles: [`
    .feed-item-card { 
      position: relative;
      padding: 20px; 
      border-radius: 16px; 
      margin-bottom: 20px; 
      background: rgba(30, 41, 59, 0.6); 
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feed-item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
      border-color: rgba(139, 92, 246, 0.3);
    }
    .card-glow {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .feed-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 16px; 
    }
    .user-info { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
    }
    .avatar-wrap {
      padding: 2px;
      background: linear-gradient(135deg, #8B5CF6, #EC4899);
      border-radius: 50%;
    }
    .avatar-placeholder { 
      width: 36px; 
      height: 36px; 
      border-radius: 50%; 
      background: #1E293B; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: bold; 
      color: #E2E8F0; 
      border: 2px solid #1E293B;
    }
    .user-meta {
      display: flex;
      flex-direction: column;
    }
    .user-meta strong {
      color: #F8FAFC;
      font-size: 0.95rem;
    }
    .user-meta .time-ago {
      color: #94A3B8;
      font-size: 0.75rem;
      margin-top: 2px;
    }
    .feed-type { 
      font-size: 0.75rem; 
      font-weight: 600;
      color: #A78BFA; 
      background: rgba(139, 92, 246, 0.1); 
      padding: 4px 10px; 
      border-radius: 20px; 
      border: 1px solid rgba(139, 92, 246, 0.2);
    }
    
    .feed-body {
      margin-bottom: 20px;
    }
    .text-content p {
      color: #E2E8F0;
      font-size: 1.05rem;
      line-height: 1.5;
      margin: 0;
    }
    
    .badge-display { 
      display: flex; 
      gap: 16px; 
      align-items: center; 
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9)); 
      padding: 16px; 
      border-radius: 12px; 
      border: 1px solid rgba(255, 255, 255, 0.05); 
    }
    .badge-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: rgba(139, 92, 246, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }
    .badge-icon { 
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    .badge-info h4 {
      margin: 0 0 4px 0;
      color: #F8FAFC;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .badge-info p {
      margin: 0;
      color: #94A3B8;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .feed-actions { 
      display: flex; 
      gap: 12px; 
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .btn-interact { 
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px; 
      background: rgba(255, 255, 255, 0.03); 
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px; 
      cursor: pointer; 
      transition: all 0.2s ease; 
      color: #CBD5E1; 
      font-weight: 500; 
      font-size: 0.9rem;
    }
    .btn-interact:hover:not(:disabled) { 
      background: rgba(255, 255, 255, 0.08); 
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
    .btn-interact:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn-interact.active, .btn-interact:disabled { 
      background: rgba(139, 92, 246, 0.15);
      border-color: rgba(139, 92, 246, 0.3);
      color: #A78BFA;
      cursor: default;
      opacity: 0.8;
    }
    .btn-interact .icon {
      font-size: 1.1rem;
    }
  `]
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
