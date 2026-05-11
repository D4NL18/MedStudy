import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';
import { Store } from '@ngrx/store';
import { selectAreaAnalytics } from '../../../../store/dashboard/dashboard.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container" #containerRef>
      @if (chartData().length > 0) {
        <ngx-charts-bar-horizontal
          [view]="[containerRef.offsetWidth, 250]"
          [scheme]="colorScheme()"
          [results]="chartData()"
          [gradient]="true"
          [xAxis]="true"
          [yAxis]="true"
          [legend]="false"
          [showXAxisLabel]="false"
          [showYAxisLabel]="false"
        >
        </ngx-charts-bar-horizontal>
      } @else {
        <div class="empty-chart">Sem dados suficientes para gerar o gráfico</div>
      }
    </div>
  `,
  styles: [`
    .chart-container { width: 100%; height: 250px; display: flex; align-items: center; justify-content: center; }
    .empty-chart { opacity: 0.5; font-size: 14px; }
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text); opacity: 0.7; font-size: 11px; }
      .gridline-path { stroke: rgba(255, 255, 255, 0.05); }
    }
  `]
})
export class AreaChartComponent {
  private store = inject(Store);
  private themeService = inject(ThemeService);

  areaAnalytics = toSignal(this.store.select(selectAreaAnalytics));

  chartData = computed(() => {
    const data = this.areaAnalytics() || [];
    return data.map(a => ({
      name: a.grandeArea,
      value: a.accuracy
    })).sort((a, b) => b.value - a.value);
  });

  colorScheme = signal<Color>({
    name: 'performance',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#52B788']
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
      this.colorScheme.set({
        ...this.colorScheme(),
        domain: [accent, accent + 'CC', accent + '99', accent + '66', accent + '33']
      });
    }
  }
}
