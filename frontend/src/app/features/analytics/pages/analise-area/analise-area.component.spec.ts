import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { AnaliseAreaComponent } from './analise-area.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ThemeService } from '../../../../core/services/theme.service';
import { Router } from '@angular/router';
import { loadAreaAnalytics } from '../../../../store/analytics/analytics.actions';
import { selectAreaAnalytics, selectAnalyticsLoading } from '../../../../store/analytics/analytics.selectors';
import { createMockAreaAnalytics } from '../../../../testing/fixtures/analytics.fixture';
import { signal } from '@angular/core';

describe('AnaliseAreaComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(AnaliseAreaComponent)
      .mock(NgxChartsModule)
      .mock(ThemeService, {
        activeTheme: signal('verde') as any
      })
      .mock(Router)
      .provide(provideMockStore({
        initialState: {
          analytics: {
            areas: [],
            loading: false
          }
        }
      }));
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AnaliseAreaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should dispatch loadAreaAnalytics on init', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    const fixture = TestBed.createComponent(AnaliseAreaComponent);
    fixture.detectChanges();
    
    expect(dispatchSpy).toHaveBeenCalledWith(loadAreaAnalytics());
  });

  it('should calculate chart data based on store state', () => {
    const store = TestBed.inject(MockStore);
    const mockData = [createMockAreaAnalytics({ grandeArea: 'Cirurgia', accuracy: 90 })];
    store.overrideSelector(selectAreaAnalytics, mockData);
    store.refreshState();
    
    const fixture = TestBed.createComponent(AnaliseAreaComponent);
    fixture.detectChanges();
    
    const chartData = fixture.componentInstance.chartData();
    const cirurgiaData = chartData.find(d => d.name === 'Cirurgia');
    expect(cirurgiaData?.value).toBe(90);
  });

  it('should navigate to banco-questoes when a bar is selected', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    
    const fixture = TestBed.createComponent(AnaliseAreaComponent);
    fixture.componentInstance.onSelect({ name: 'Pediatria' });
    
    expect(navigateSpy).toHaveBeenCalledWith(['/banco-questoes'], {
      queryParams: { area: 'Pediatria' }
    });
  });
});
