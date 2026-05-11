import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { DashboardEffects } from './dashboard.effects';
import { DashboardService } from '../../core/services/dashboard.service';
import * as DashboardActions from './dashboard.actions';

describe('DashboardEffects', () => {
  let actions$: Observable<any>;
  let effects: DashboardEffects;
  let dashboardService: jasmine.SpyObj<DashboardService>;

  beforeEach(() => {
    dashboardService = jasmine.createSpyObj('DashboardService', ['getDashboardKPIs']);

    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions$),
        { provide: DashboardService, useValue: dashboardService }
      ]
    });

    effects = TestBed.inject(DashboardEffects);
  });

  it('should load dashboard successfully', (done) => {
    const kpis = { currentStreak: 5 } as any;
    dashboardService.getDashboardKPIs.and.returnValue(of(kpis));
    actions$ = of(DashboardActions.loadDashboard());

    effects.loadDashboard$.subscribe(action => {
      expect(action).toEqual(DashboardActions.loadDashboardSuccess({ kpis }));
      done();
    });
  });
});
