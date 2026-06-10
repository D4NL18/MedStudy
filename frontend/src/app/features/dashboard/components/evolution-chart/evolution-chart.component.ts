import { Component, OnInit, inject, signal, effect, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '@core/services/theme.service';
import { Store } from '@ngrx/store';
import { selectDashboardKPIs } from '@store/dashboard/dashboard.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
// @ts-ignore
import * as shape from 'd3-shape';

@Component({
  selector: 'app-evolution-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container" #containerRef>
      @if (chartData().length > 0 && chartData()[0].series.length > 0) {
        <ngx-charts-line-chart
          [scheme]="colorScheme()"
          [results]="chartData()"
          [gradient]="true"
          [xAxis]="true"
          [yAxis]="true"
          [legend]="false"
          [showXAxisLabel]="false"
          [showYAxisLabel]="false"
          [autoScale]="true"
          [curve]="curve"
          [animations]="true"
          (window:resize)="onResize()"
        >
        </ngx-charts-line-chart>
      } @else {
        <div class="empty-state">Sem histórico de evolução disponível</div>
      }
    </div>
  `,
  styles: [`
    .chart-container { width: 100%; height: 280px; display: block; position: relative; }
    .empty-state { height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.5; font-size: 14px; }
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text); opacity: 0.7; font-size: 11px; }
      .gridline-path { stroke: rgba(255, 255, 255, 0.05); }
    }
  `]
})
export class EvolutionChartComponent implements OnInit {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  public themeService = inject(ThemeService);
  
  kpis = toSignal(this.store.select(selectDashboardKPIs));

  chartData = computed(() => {
    const data = this.kpis()?.evolution || [];
    if (data.length === 0) return [];
    
    return [
      {
        name: 'Evolução %',
        series: data.map(p => ({
          name: p.label,
          value: p.value || 0
        }))
      }
    ];
  });

  colorScheme = signal<Color>({
    name: 'dynamic',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10b981']
  });

  curve = shape.curveMonotoneX;

  constructor() {
    effect(() => {
      this.themeService.activeTheme();
      setTimeout(() => this.updateColors(), 50);
    });
  }

  ngOnInit() {
    this.updateColors();
  }

  onResize() {
    // Force redraw
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
      this.colorScheme.set({
        ...this.colorScheme(),
        domain: [accent]
      });
    }
  }
}
