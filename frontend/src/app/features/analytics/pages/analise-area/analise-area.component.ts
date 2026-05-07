import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { selectAreaAnalytics, selectAnalyticsLoading } from '../../../../store/analytics/analytics.selectors';
import { loadAreaAnalytics } from '../../../../store/analytics/analytics.actions';

@Component({
  selector: 'app-analise-area',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="analytics-page">
      <header>
        <h2>Desempenho por Grande Área</h2>
        <p>Clique em uma área para ver o detalhamento no banco de questões.</p>
      </header>

      @if (loading()) {
        <div class="skeleton-chart glass"></div>
      } @else {
        <div class="chart-wrapper glass">
          <ngx-charts-bar-horizontal
            [results]="chartData()"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="false"
            [showXAxisLabel]="true"
            [xAxisLabel]="'Taxa de Acerto (%)'"
            [scheme]="colorScheme"
            (select)="onSelect($event)"
          >
          </ngx-charts-bar-horizontal>
        </div>

        <div class="stats-grid">
          <div class="stat-card glass" *ngFor="let area of areas()">
            <div class="area-name">{{ area.grandeArea }}</div>
            <div class="area-metrics">
              <span [class]="getPerformanceClass(area.accuracy)">{{ area.accuracy }}%</span>
              <span class="count">{{ area.totalQuestions }} questões</span>
            </div>
            <div class="trend" [class.up]="area.trendRate > 0" [class.down]="area.trendRate < 0">
              {{ area.trendRate > 0 ? '↑' : '↓' }} {{ area.trendRate }}% vs média
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.5s ease; }
    h2 { margin: 0; font-size: 1.5rem; }
    
    .chart-wrapper {
      height: 400px;
      padding: 24px;
      border-radius: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-card {
      padding: 20px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .area-name { font-weight: 700; color: var(--color-text); }
    .area-metrics { display: flex; justify-content: space-between; align-items: baseline; }
    
    .accuracy-high { color: #10b981; font-weight: 800; }
    .accuracy-mid { color: #f59e0b; font-weight: 800; }
    .accuracy-low { color: #ef4444; font-weight: 800; }
    
    .count { font-size: 0.8rem; opacity: 0.6; }
    .trend { font-size: 0.75rem; font-weight: 600; }
    .trend.up { color: #10b981; }
    .trend.down { color: #ef4444; }

    .glass { background: var(--color-surface-glass); backdrop-filter: blur(8px); border: 1px solid var(--color-border); }
    
    .skeleton-chart { height: 400px; border-radius: 20px; background: rgba(255,255,255,0.05); animation: pulse 1.5s infinite; }
    @keyframes pulse { 50% { opacity: 0.3; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AnaliseAreaComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  areas = this.store.selectSignal(selectAreaAnalytics);
  loading = this.store.selectSignal(selectAnalyticsLoading);

  colorScheme = {
    name: 'performance',
    selectable: true,
    group: 'Ordinal' as any,
    domain: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
  };

  chartData = () => this.areas().map(a => ({
    name: a.grandeArea,
    value: a.accuracy
  }));

  ngOnInit() {
    this.store.dispatch(loadAreaAnalytics());
  }

  getPerformanceClass(acc: number) {
    if (acc >= 80) return 'accuracy-high';
    if (acc >= 70) return 'accuracy-mid';
    return 'accuracy-low';
  }

  onSelect(event: any) {
    const areaName = typeof event === 'string' ? event : event.name;
    this.router.navigate(['/banco-questoes'], { queryParams: { area: areaName } });
  }
}
