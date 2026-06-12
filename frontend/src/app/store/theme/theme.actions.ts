import { createAction, props } from '@ngrx/store';
import { AppTheme } from '@core/services/theme.service';


/**
 * NgRx actions for the Theme feature slice.
 * @description Defines the action creators used to dispatch state changes for Theme.
 */
export const setTheme = createAction(
  '[Theme] Set Theme',
  props<{ theme: AppTheme }>()
);

export const loadTheme = createAction('[Theme] Load Theme');
