import { Component, inject, signal, effect, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';
import { Store } from '@ngrx/store';
import { selectAreaAnalytics } from '../../../../store/dashboard/dashboard.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-distribution-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container">
      @if (chartData().length > 0) {
        <ngx-charts-pie-chart
          [scheme]="colorScheme()"
          [results]="chartData()"
          [gradient]="false"
          [legend]="false"
          [labels]="true"
          [doughnut]="true"
          [arcWidth]="0.25"
          [animations]="true"
          (window:resize)="onResize()"
        >
        </ngx-charts-pie-chart>
      } @else {
        <div class="empty-chart">Sem dados de questões para distribuir</div>
      }
    </div>
  `,
  styles: [`
    .chart-container { width: 100%; height: 250px; display: block; position: relative; }
    .empty-chart { height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.5; font-size: 14px; }
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text); opacity: 0.7; font-size: 11px; }
      .pie-label { fill: var(--color-text) !important; }
    }
  `]
})
export class DistributionChartComponent {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private themeService = inject(ThemeService);

  areaAnalytics = toSignal(this.store.select(selectAreaAnalytics));

  chartData = computed(() => {
    const data = this.areaAnalytics() || [];
    return data
      .filter(a => a.totalQuestions > 0)
      .map(a => ({
        name: a.grandeArea,
        value: Number(a.totalQuestions)
      }));
  });

  colorScheme = signal<Color>({
    name: 'distribution',
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

  onResize() {
    this.cdr.detectChanges();
  }

  private updateColors() {
    const root = document.documentElement;
    let accent = getComputedStyle(root).getPropertyValue('--color-accent').trim();
    if (this.themeService.activeTheme() === 'claro') {
      accent = '#10B981';
    } else if (accent === '#FFFFFF' || !accent) {
      accent = getComputedStyle(root).getPropertyValue('--color-primary').trim();
    }

    if (accent) {
      const domain = [
        accent,
        this.adjustOpacity(accent, 0.8),
        this.adjustOpacity(accent, 0.6),
        this.adjustOpacity(accent, 0.4),
        this.adjustOpacity(accent, 0.2)
      ];
      this.colorScheme.set({ ...this.colorScheme(), domain });
    }
  }

  private adjustOpacity(hex: string, opacity: number): string {
    if (!hex.startsWith('#')) return hex;
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return hex + alpha;
  }
}
