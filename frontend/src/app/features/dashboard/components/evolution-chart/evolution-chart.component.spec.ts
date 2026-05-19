import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { EvolutionChartComponent } from './evolution-chart.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectDashboardKPIs } from '../../../../store/dashboard/dashboard.selectors';

describe('EvolutionChartComponent', () => {
  beforeEach(() => {
    return MockBuilder(EvolutionChartComponent)
      .mock(NgxChartsModule)
      .provide(provideMockStore({
        initialState: {
          dashboard: {
            kpis: {
              evolution: [
                { label: 'Jan', value: 80 }
              ]
            }
          }
        }
      }))
      .provide({
        provide: ThemeService,
        useValue: { activeTheme: () => 'verde' }
      });
  });

  it('should create', () => {
    const fixture = MockRender(EvolutionChartComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should have initial chart data', () => {
    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectDashboardKPIs, {
      evolution: [
        { label: 'Jan', value: 80 }
      ]
    } as any);
    store.refreshState();

    const fixture = MockRender(EvolutionChartComponent, null, { reset: true });
    expect(fixture.point.componentInstance.chartData().length).toBeGreaterThan(0);
  });
});
