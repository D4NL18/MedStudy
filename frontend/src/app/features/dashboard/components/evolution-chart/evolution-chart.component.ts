import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-evolution-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container" #containerRef>
      <ngx-charts-line-chart
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
      text { fill: var(--color-text); opacity: 0.7; font-size: 12px; }
      .gridline-path { stroke: rgba(255, 255, 255, 0.05); }
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
    domain: ['#10b981'] // Default Emerald for Verde
  });

  curve: any; // Can use d3 curve if imported

  ngOnInit() {
    // Update colors based on active theme
    this.updateColors();
  }

  private updateColors() {
    // In a real app, we would map all 8 themes to specific colors
    // For now, let's just react to the theme change
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    if (accent) {
      this.colorScheme.set({
        ...this.colorScheme(),
        domain: [accent]
      });
    }
  }
}
