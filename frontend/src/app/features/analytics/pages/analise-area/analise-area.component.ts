import { Component, OnInit, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';
import { selectAreaAnalytics, selectAnalyticsLoading } from '../../../../store/analytics/analytics.selectors';
import { loadAreaAnalytics, AreaAnalytics } from '../../../../store/analytics/analytics.actions';

@Component({
  selector: 'app-analise-area',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './analise-area.component.html',
  styleUrl: './analise-area.component.scss'
})
export class AnaliseAreaComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  areas = this.store.selectSignal(selectAreaAnalytics);
  loading = this.store.selectSignal(selectAnalyticsLoading);

  private themeService = inject(ThemeService);

  colorScheme = signal<any>({
    name: 'performance',
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
      // If the browser returns rgb(), we should ideally convert or just use the base color.
      // For ngx-charts to show multiple bars, we can just repeat the accent or use a static palette if it fails.
      const domain = [accent];
      
      // Add variations if accent is hex
      if (accent.startsWith('#')) {
        domain.push(accent + 'CC', accent + '99', accent + '66', accent + '33');
      } else {
        // Fallback for rgb() - just use the color for all bars or common emerald shades
        domain.push('#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5');
      }

      this.colorScheme.set({
        ...this.colorScheme(),
        domain: domain
      });
    }
  }

  private readonly DEFAULT_AREAS = [
    'Cirurgia',
    'Clínica Médica',
    'Ginecologia e Obstetrícia',
    'Pediatria',
    'Medicina Preventiva'
  ];

  chartHeight = computed(() => {
    const count = Math.max(this.DEFAULT_AREAS.length, this.areas().length);
    return count * 60 + 100;
  });

  displayAreas = computed(() => {
    const apiData = this.areas();
    return this.DEFAULT_AREAS.map(areaName => {
      const match = apiData.find(a => a.grandeArea === areaName);
      if (match) return match;
      
      // Return a skeleton object for areas without data
      return {
        grandeArea: areaName,
        totalQuestions: 0,
        accuracy: 0,
        sessionsCount: 0,
        trendShort: 0,
        trendLong: 0,
        performanceLevel: 'LOW'
      } as AreaAnalytics;
    });
  });

  chartData = computed(() => {
    return this.displayAreas().map(a => ({
      name: a.grandeArea,
      value: Math.round(a.accuracy || 0)
    }));
  });

  ngOnInit() {
    this.store.dispatch(loadAreaAnalytics());
  }

  getPerformanceClass(acc: number) {
    if (acc >= 80) return 'accuracy-high';
    if (acc >= 70) return 'accuracy-mid';
    return 'accuracy-low';
  }

  onSelect(event: any) {
    const areaName = typeof event === 'string' ? event : event.name;
    this.router.navigate(['/banco-questoes'], { queryParams: { area: areaName } });
  }
}
