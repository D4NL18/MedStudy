import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { AreaChartComponent } from './area-chart.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('AreaChartComponent', () => {
  beforeEach(() => {
    return MockBuilder(AreaChartComponent)
      .mock(NgxChartsModule)
      .provide({
        provide: ThemeService,
        useValue: { activeTheme: () => 'verde' }
      });
  });

  it('should create', () => {
    const fixture = MockRender(AreaChartComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
