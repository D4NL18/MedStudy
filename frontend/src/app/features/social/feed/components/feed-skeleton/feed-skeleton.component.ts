import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../../shared/components/skeleton/skeleton.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';


/**
 * Angular component for the Feed Skeleton feature.
 * @description Handles the presentation logic and user interactions for the Feed Skeleton view.
 */
@Component({
  selector: 'app-feed-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, CardComponent],
  templateUrl: './feed-skeleton.component.html',
  styleUrls: ['./feed-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedSkeletonComponent {}
