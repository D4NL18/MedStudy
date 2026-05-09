import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-distribution-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container" #containerRef>
      <ngx-charts-pie-chart
        [view]="[containerRef.offsetWidth, 250]"
        [scheme]="colorScheme()"
        [results]="chartData"
        [gradient]="true"
        [legend]="false"
        [labels]="true"
        [doughnut]="true"
        [arcWidth]="0.25"
      >
      </ngx-charts-pie-chart>
    </div>
  `,
  styles: [`
    .chart-container { width: 100%; height: 250px; }
    :host ::ng-deep .ngx-charts {
      text { fill: var(--color-text); opacity: 0.8; font-size: 10px; font-weight: 600; }
    }
  `]
})
export class DistributionChartComponent {
  chartData = [
    { name: 'Clínica Médica', value: 450 },
    { name: 'Pediatria', value: 320 },
    { name: 'Cirurgia', value: 280 },
    { name: 'Preventiva', value: 150 },
    { name: 'Ginecologia', value: 210 }
  ];

  colorScheme = signal<Color>({
    name: 'distribution',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#52B788', '#00B4D8', '#9D4EDD', '#FF8531', '#FF4D6D']
  });
}
