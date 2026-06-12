import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { CardComponent } from '../../../../shared/components/card/card.component';


/**
 * Angular component for the Dashboard Skeleton feature.
 * @description Handles the presentation logic and user interactions for the Dashboard Skeleton view.
 */
@Component({
  selector: 'app-dashboard-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, CardComponent],
  templateUrl: './dashboard-skeleton.component.html',
  styleUrls: ['./dashboard-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSkeletonComponent {}
