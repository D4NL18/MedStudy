import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { DistributionChartComponent } from './distribution-chart.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('DistributionChartComponent', () => {
  beforeEach(() => {
    return MockBuilder(DistributionChartComponent)
      .mock(NgxChartsModule)
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
