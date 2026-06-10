import { MockBuilder, MockRender } from 'ng-mocks';
import { DistributionChartComponent } from './distribution-chart.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { provideMockStore } from '@ngrx/store/testing';

describe('DistributionChartComponent', () => {
  beforeEach(() => {
    return MockBuilder(DistributionChartComponent)
      .mock(NgxChartsModule)
      .provide(provideMockStore({
        initialState: {
          dashboard: {
            kpis: {
              areaAnalytics: []
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
    const fixture = MockRender(DistributionChartComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
