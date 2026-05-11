import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { AnalyticsEffects } from './analytics.effects';
import { AnalyticsService } from '../../core/services/analytics.service';
import * as AnalyticsActions from './analytics.actions';

describe('AnalyticsEffects', () => {
  let actions$: Observable<any>;
  let effects: AnalyticsEffects;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(() => {
    analyticsService = jasmine.createSpyObj('AnalyticsService', ['getAreaAnalytics', 'getTopicAnalytics']);

    TestBed.configureTestingModule({
      providers: [
        AnalyticsEffects,
        provideMockActions(() => actions$),
        { provide: AnalyticsService, useValue: analyticsService }
      ]
    });

    effects = TestBed.inject(AnalyticsEffects);
  });

  it('should load area analytics successfully', (done) => {
    const mockData = [{ grandeArea: 'A', acertos: 1 } as any];
    analyticsService.getAreaAnalytics.and.returnValue(of(mockData));
    actions$ = of(AnalyticsActions.loadAreaAnalytics());

    effects.loadAreaAnalytics$.subscribe(action => {
      expect(action).toEqual(AnalyticsActions.loadAreaAnalyticsSuccess({ areas: mockData }));
      done();
    });
  });
});
