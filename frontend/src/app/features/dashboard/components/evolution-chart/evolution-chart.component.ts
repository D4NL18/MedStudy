import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';
// @ts-ignore
import * as shape from 'd3-shape';

@Component({
  selector: 'app-evolution-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container" #containerRef>
      <ngx-charts-line-chart *ngIf="containerRef.offsetWidth > 0"
        [view]="[containerRef.offsetWidth, 300]"
        [scheme]="colorScheme()"
        [results]="chartData"
        [gradient]="true"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="false"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
        [xAxisLabel]="'Meses'"
        [yAxisLabel]="'% Acerto'"
        [autoScale]="true"
        [curve]="curve"
      >
      </ngx-charts-line-chart>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 300px;
    }
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text) !important; opacity: 0.8; font-size: 12px; }
      .gridline-path { stroke: var(--color-border) !important; opacity: 0.5; }
      .axis-label { fill: var(--color-text) !important; }
    }
  `]
})
export class EvolutionChartComponent implements OnInit {
  public themeService = inject(ThemeService);
  
  chartData = [
    {
      name: 'Evolução %',
      series: [
        { name: 'Jan', value: 65 },
        { name: 'Fev', value: 68 },
        { name: 'Mar', value: 72 },
        { name: 'Abr', value: 70 },
        { name: 'Mai', value: 75 },
        { name: 'Jun', value: 82 }
      ]
    }
  ];

  colorScheme = signal<Color>({
    name: 'dynamic',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10b981'] // Default emerald
  });

  curve = shape.curveMonotoneX;

  constructor() {
    // Re-calculate colors when theme changes
    effect(() => {
      this.themeService.activeTheme(); // Dependency
      setTimeout(() => this.updateColors(), 50);
    });
  }

  ngOnInit() {
    this.updateColors();
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
        domain: [accent]
      });
    }
  }
}
