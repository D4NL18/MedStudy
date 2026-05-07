import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container" #containerRef>
      <ngx-charts-bar-horizontal
        [view]="[containerRef.offsetWidth, 250]"
        [scheme]="colorScheme()"
        [results]="chartData"
        [gradient]="true"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="false"
        [showXAxisLabel]="false"
        [showYAxisLabel]="false"
        [xAxisLabel]="'Acerto %'"
      >
      </ngx-charts-bar-horizontal>
    </div>
  `,
  styles: [`
    .chart-container { width: 100%; height: 250px; }
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text); opacity: 0.7; font-size: 11px; }
      .gridline-path { stroke: rgba(255, 255, 255, 0.05); }
    }
  `]
})
export class AreaChartComponent {
  chartData = [
    { name: 'Pediatria', value: 85 },
    { name: 'Cirurgia', value: 72 },
    { name: 'Preventiva', value: 68 },
    { name: 'Clínica Médica', value: 62 },
    { name: 'Ginecologia', value: 58 }
  ];

  colorScheme = signal<Color>({
    name: 'performance',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#52B788', '#2D6A4F', '#1B4332', '#081C15', '#40916c']
  });
}
