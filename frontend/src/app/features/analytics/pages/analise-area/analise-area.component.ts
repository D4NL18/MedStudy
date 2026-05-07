import { Component, OnInit, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';
import { selectAreaAnalytics, selectAnalyticsLoading } from '../../../../store/analytics/analytics.selectors';
import { loadAreaAnalytics, AreaAnalytics } from '../../../../store/analytics/analytics.actions';

@Component({
  selector: 'app-analise-area',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="analytics-page" #containerRef>
      <header>
        <h2>Desempenho por Grande Área</h2>
        <p>Clique em uma área para ver o detalhamento no banco de questões.</p>
      </header>

      @if (loading()) {
        <div class="skeleton-chart glass"></div>
      } @else {
        <div class="chart-wrapper glass">
          <ngx-charts-bar-horizontal *ngIf="chartData().length > 0 && containerRef.offsetWidth > 0"
            [view]="[containerRef.offsetWidth - 64, chartHeight()]"
            [results]="chartData()"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="false"
            [showXAxisLabel]="true"
            [xAxisLabel]="'Taxa de Acerto (%)'"
            [scheme]="colorScheme()"
            [barPadding]="20"
            [roundDomains]="true"
            (select)="onSelect($event)"
          >
          </ngx-charts-bar-horizontal>
        </div>

        <div class="stats-grid">
          <div class="stat-card glass" *ngFor="let area of displayAreas()">
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
      min-height: 300px;
      padding: 24px;
      border-radius: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      width: 100%;
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
    
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text) !important; opacity: 0.8; font-size: 13px; }
      .gridline-path { stroke: rgba(var(--color-accent-rgb), 0.1) !important; }
      .tick line { stroke: var(--color-border) !important; }
      .axis-label { fill: var(--color-text) !important; font-weight: 600; }
    }

    .skeleton-chart { height: 400px; border-radius: 20px; background: var(--color-border); animation: pulse 1.5s infinite; }
    @keyframes pulse { 50% { opacity: 0.3; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AnaliseAreaComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  areas = this.store.selectSignal(selectAreaAnalytics);
  loading = this.store.selectSignal(selectAnalyticsLoading);

  private themeService = inject(ThemeService);

  colorScheme = signal<any>({
    name: 'performance',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
  });

  constructor() {
    effect(() => {
      this.themeService.activeTheme();
      setTimeout(() => this.updateColors(), 50);
    });
  }

  private updateColors() {
    const root = document.documentElement;
    let accent = getComputedStyle(root).getPropertyValue('--color-accent').trim();
    const isClaro = this.themeService.activeTheme() === 'claro';
    
    if (isClaro) {
      accent = '#10B981';
    } else if (accent === '#FFFFFF' || accent.toLowerCase() === 'white' || !accent) {
      accent = getComputedStyle(root).getPropertyValue('--color-primary').trim();
    }

    if (accent) {
      // If the browser returns rgb(), we should ideally convert or just use the base color.
      // For ngx-charts to show multiple bars, we can just repeat the accent or use a static palette if it fails.
      const domain = [accent];
      
      // Add variations if accent is hex
      if (accent.startsWith('#')) {
        domain.push(accent + 'CC', accent + '99', accent + '66', accent + '33');
      } else {
        // Fallback for rgb() - just use the color for all bars or common emerald shades
        domain.push('#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5');
      }

      this.colorScheme.set({
        ...this.colorScheme(),
        domain: domain
      });
    }
  }

  private readonly DEFAULT_AREAS = [
    'Cirurgia',
    'Clínica Médica',
    'Ginecologia e Obstetrícia',
    'Pediatria',
    'Medicina Preventiva'
  ];

  chartHeight = computed(() => {
    const count = Math.max(this.DEFAULT_AREAS.length, this.areas().length);
    return count * 60 + 100;
  });

  displayAreas = computed(() => {
    const apiData = this.areas();
    return this.DEFAULT_AREAS.map(areaName => {
      const match = apiData.find(a => a.grandeArea === areaName);
      if (match) return match;
      
      // Return a skeleton object for areas without data
      return {
        grandeArea: areaName,
        totalQuestions: 0,
        accuracy: 0,
        sessionsCount: 0,
        trendRate: 0
      } as AreaAnalytics;
    });
  });

  chartData = computed(() => {
    return this.displayAreas().map(a => ({
      name: a.grandeArea,
      value: a.accuracy || 0
    }));
  });

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
