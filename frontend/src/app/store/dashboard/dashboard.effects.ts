import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { DashboardService } from '@core/services/dashboard.service';
import * as DashboardActions from './dashboard.actions';


/**
 * NgRx effects for the Dashboard feature slice.
 * @description Handles side effects such as HTTP calls in response to Dashboard actions.
 */
@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      exhaustMap(() =>
        this.dashboardService.getDashboardKPIs().pipe(
          map((kpis) => DashboardActions.loadDashboardSuccess({ kpis })),
          catchError((error) => of(DashboardActions.loadDashboardFailure({ error })))
        )
      )
    )
  );
}
