import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { EvolutionChartComponent } from './evolution-chart.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('EvolutionChartComponent', () => {
  beforeEach(() => {
    return MockBuilder(EvolutionChartComponent)
      .mock(NgxChartsModule)
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
    const fixture = MockRender(EvolutionChartComponent);
    expect(fixture.point.componentInstance.chartData.length).toBeGreaterThan(0);
  });
});
