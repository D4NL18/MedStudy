import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '@core/services/theme.service';
import { Store } from '@ngrx/store';
import { selectAreaAnalytics } from '@store/dashboard/dashboard.selectors';
import { toSignal } from '@angular/core/rxjs-interop';


/**
 * Angular component for the Area Chart feature.
 * @description Handles the presentation logic and user interactions for the Area Chart view.
 */
@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss']
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
