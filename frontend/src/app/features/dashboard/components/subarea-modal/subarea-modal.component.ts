import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { PerformanceThemeService } from '../../../../core/services/performance-theme.service';
import { TopicAnalytics } from '../../../../store/analytics/analytics.actions'; // Wait, I should use the one in dashboard.actions or analytics.actions
import { AreaAnalytics } from '../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-subarea-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, LucideAngularModule],
  template: `
    <div class="modal-container glass">
      <header class="modal-header">
        <h2>Detalhamento: {{ data.area.grandeArea }}</h2>
        <button class="close-btn" (click)="dialogRef.close()">
          <lucide-icon name="x"></lucide-icon>
        </button>
      </header>

      <div class="modal-content">
        <div class="stats-overview">
          <div class="stat-card">
            <span class="label">Taxa Global</span>
            <span class="value" [style.color]="perfTheme.getColor(data.area.accuracy)">
              {{ data.area.accuracy | number:'1.1-1' }}%
            </span>
          </div>
          <div class="stat-card">
            <span class="label">Tendência (30d)</span>
            <span class="value trend" [class]="data.area.trendLong >= 0 ? 'up' : 'down'">
              <lucide-icon [name]="data.area.trendLong >= 0 ? 'trending-up' : 'trending-down'"></lucide-icon>
              {{ data.area.trendLong | number:'1.1-1' }}%
            </span>
          </div>
        </div>

        <div class="topics-list">
          <h3>Subáreas (Temas)</h3>
          @if (loading) {
            <div class="loading-spinner">Carregando subáreas...</div>
          } @else {
            <table>
              <thead>
                <tr>
                  <th>Tema</th>
                  <th>Questões</th>
                  <th>Acerto</th>
                  <th>Tendência (7d)</th>
                </tr>
              </thead>
              <tbody>
                @for (topic of topics; track topic.tema) {
                  <tr>
                    <td>{{ topic.tema }}</td>
                    <td>{{ topic.totalQuestions }}</td>
                    <td [style.color]="perfTheme.getColor(topic.accuracy)">
                      {{ topic.accuracy | number:'1.1-1' }}%
                    </td>
                    <td>
                      <div class="trend-wrapper" [class]="topic.trendShort >= 0 ? 'up' : 'down'">
                        <lucide-icon [name]="topic.trendShort >= 0 ? 'trending-up' : 'trending-down'"></lucide-icon>
                        <span>{{ topic.trendShort | number:'1.1-1' }}%</span>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container { padding: 24px; border-radius: 16px; color: var(--color-text); width: 800px; max-width: 95vw; max-height: 85vh; display: flex; flex-direction: column; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-shrink: 0; }
    .close-btn { background: none; border: none; color: var(--color-text); cursor: pointer; opacity: 0.7; }
    
    .modal-content { display: flex; flex-direction: column; overflow: hidden; }
    
    .stats-overview { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; flex-shrink: 0; }
    .stat-card { background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; }
    .stat-card .label { font-size: 12px; opacity: 0.7; margin-bottom: 4px; }
    .stat-card .value { font-size: 24px; font-weight: 700; }
    
    .trend { display: flex; align-items: center; gap: 8px; }
    .trend.up, .trend-wrapper.up { color: var(--color-success); }
    .trend.down, .trend-wrapper.down { color: var(--color-error); }

    .topics-list { overflow-y: auto; padding-right: 8px; }
    .topics-list h3 { margin-bottom: 16px; font-size: 18px; position: sticky; top: 0; background: var(--color-surface); padding-bottom: 8px; z-index: 10; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); opacity: 0.6; font-size: 12px; text-transform: uppercase; position: sticky; top: 40px; background: var(--color-surface); z-index: 10; }
    td { padding: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; }
    
    .trend-wrapper { display: inline-flex; align-items: center; gap: 8px; }
    .loading-spinner { padding: 40px; text-align: center; opacity: 0.7; }

    :host ::ng-deep lucide-icon { width: 16px; height: 16px; }
  `]
})
export class SubareaModalComponent implements OnInit {
  topics: any[] = [];
  loading = true;
  perfTheme = inject(PerformanceThemeService);
  private analyticsService = inject(AnalyticsService);

  constructor(
    public dialogRef: MatDialogRef<SubareaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { area: AreaAnalytics }
  ) {}

  ngOnInit() {
    this.analyticsService.getTopicAnalytics().subscribe(allTopics => {
      this.topics = allTopics.filter(t => t.grandeArea === this.data.area.grandeArea);
      this.loading = false;
    });
  }
}
