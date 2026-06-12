import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { DashboardComponent } from './dashboard.component';
import { ThemeService } from '@core/services/theme.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectDashboardKPIs, selectDashboardLoading } from '@store/dashboard/dashboard.selectors';
import { EvolutionChartComponent } from './components/evolution-chart/evolution-chart.component';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import { DistributionChartComponent } from './components/distribution-chart/distribution-chart.component';
import { loadDashboard } from '@store/dashboard/dashboard.actions';

describe('DashboardComponent', () => {
  beforeEach(() => {
    return MockBuilder(DashboardComponent)
      .mock(EvolutionChartComponent)
      .mock(AreaChartComponent)
      .mock(DistributionChartComponent)
      .provide(provideMockStore({
        initialState: {
          auth: { user: null },
          theme: { activeTheme: 'verde' },
          dashboard: { loading: false, kpis: null }
        }
      }))
      .keep(ThemeService);
  });

  it('should create', () => {
    const fixture = MockRender(DashboardComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch loadDashboard on init', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    
    expect(dispatchSpy).toHaveBeenCalledWith(loadDashboard());
  });

  it('should display loading skeleton when loading is true', () => {
    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectDashboardLoading, true);
    store.refreshState();
    
    ngMocks.flushTestBed();
    const fixture = MockRender(DashboardComponent);
    const skeleton = ngMocks.find(fixture, '.skeleton-grid', null);
    
    expect(skeleton).not.toBeNull();
  });

  it('should display KPIs when loaded', () => {
    const store = TestBed.inject(MockStore);
    const mockKPIs = {
      sessions: { totalSessions: 100, totalQuestions: 500, successRate: 85, performanceLevel: 'HIGH' },
      simulados: { totalSimulados: 50, averageScore: 80, bestArea: 'Pediatria', worstArea: 'GO' },
      strongArea: 'Pediatria',
      weakArea: 'GO',
      currentStreak: 5,
      areaAnalytics: [],
      topErrors: [],
      evolution: []
    } as any;
    store.overrideSelector(selectDashboardLoading, false);
    store.overrideSelector(selectDashboardKPIs, mockKPIs);
    store.refreshState();
    
    const fixture = MockRender(DashboardComponent);
    const accuracy = ngMocks.find(fixture, '.highlight .kpi-value');
    
    expect(accuracy.nativeElement.textContent).toContain('85%');
  });

});
