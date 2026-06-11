import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../../shared/components/skeleton/skeleton.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-feed-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, CardComponent],
  template: `
    <div class="feed-skeleton">
      <app-card *ngFor="let i of [1, 2, 3]" customClass="post-skeleton">
        <div class="post-header">
          <app-skeleton variant="circle" width="48px" height="48px"></app-skeleton>
          <div class="post-meta">
            <app-skeleton variant="line" width="120px" height="16px"></app-skeleton>
            <app-skeleton variant="line" width="80px" height="12px" customClass="mt-1"></app-skeleton>
          </div>
        </div>
        
        <div class="post-content">
          <app-skeleton variant="line" width="100%" height="16px"></app-skeleton>
          <app-skeleton variant="line" width="90%" height="16px" customClass="mt-1"></app-skeleton>
          <app-skeleton variant="block" height="150px" customClass="mt-2"></app-skeleton>
        </div>
        
        <div class="post-actions">
          <app-skeleton variant="line" width="60px" height="24px"></app-skeleton>
          <app-skeleton variant="line" width="60px" height="24px"></app-skeleton>
          <app-skeleton variant="line" width="60px" height="24px"></app-skeleton>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .feed-skeleton {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    .post-skeleton {
      padding: 16px;
    }
    .post-header {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    .post-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .post-content {
      margin-bottom: 16px;
    }
    .post-actions {
      display: flex;
      gap: 16px;
      border-top: 1px solid var(--color-border);
      padding-top: 12px;
    }
    .mt-1 { margin-top: 4px; }
    .mt-2 { margin-top: 12px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedSkeletonComponent {}
