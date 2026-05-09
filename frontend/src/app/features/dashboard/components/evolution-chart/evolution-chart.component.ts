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
  templateUrl: './evolution-chart.component.html',
  styleUrl: './evolution-chart.component.scss'
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
