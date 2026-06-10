import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';
import * as AnalyticsActions from './analytics.actions';

@Injectable()
export class AnalyticsEffects {
  private actions$ = inject(Actions);
  private analyticsService = inject(AnalyticsService);

  loadAreaAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadAreaAnalytics),
      exhaustMap(() =>
        this.analyticsService.getAreaAnalytics().pipe(
          map((areas) => AnalyticsActions.loadAreaAnalyticsSuccess({ areas })),
          catchError((error) => of(AnalyticsActions.loadAreaAnalyticsFailure({ error })))
        )
      )
    )
  );

  loadTopicAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyticsActions.loadTopicAnalytics),
      exhaustMap(() =>
        this.analyticsService.getTopicAnalytics().pipe(
          map((topics) => AnalyticsActions.loadTopicAnalyticsSuccess({ topics })),
          catchError((error) => of(AnalyticsActions.loadTopicAnalyticsFailure({ error })))
        )
      )
    )
  );
}
