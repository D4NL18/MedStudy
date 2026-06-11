import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-dashboard-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, CardComponent],
  template: `
    <div class="dashboard-skeleton">
      <div class="dashboard-header">
        <app-skeleton variant="line" width="30%" height="32px"></app-skeleton>
        <app-skeleton variant="line" width="20%" height="24px"></app-skeleton>
      </div>
      
      <div class="dashboard-grid">
        <!-- Main Chart Skeleton -->
        <app-card customClass="chart-card">
          <div class="card-header">
            <app-skeleton variant="line" width="40%" height="24px"></app-skeleton>
            <app-skeleton variant="circle" width="32px" height="32px"></app-skeleton>
          </div>
          <app-skeleton variant="block" height="250px"></app-skeleton>
        </app-card>

        <!-- Secondary Stats -->
        <div class="stats-grid">
          <app-card *ngFor="let i of [1, 2, 3, 4]" customClass="stat-card">
            <app-skeleton variant="line" width="60%" height="16px"></app-skeleton>
            <app-skeleton variant="line" width="40%" height="32px" customClass="mt-2"></app-skeleton>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-skeleton {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 24px;
    }
    .dashboard-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .dashboard-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .mt-2 {
      margin-top: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSkeletonComponent {}
