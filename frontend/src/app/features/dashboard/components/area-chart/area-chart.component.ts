import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';

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
  private themeService = inject(ThemeService);

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
    domain: ['#52B788'] // Default emerald
  });

  constructor() {
    // Re-calculate colors when theme changes
    effect(() => {
      this.themeService.activeTheme(); // Dependency
      setTimeout(() => this.updateColors(), 50); // Small delay to let CSS variables update
    });
  }

  private updateColors() {
    const root = document.documentElement;
    let accent = getComputedStyle(root).getPropertyValue('--color-accent').trim();
    const isClaro = this.themeService.activeTheme() === 'claro';
    
    // If accent is white (Claro) or too dark, use primary for better contrast in charts
    if (accent === '#FFFFFF' || accent.toLowerCase() === 'white' || isClaro) {
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
