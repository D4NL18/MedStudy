import { createAction, props } from '@ngrx/store';
import { AppTheme } from '@core/services/theme.service';

export const setTheme = createAction(
  '[Theme] Set Theme',
  props<{ theme: AppTheme }>()
);

export const loadTheme = createAction('[Theme] Load Theme');
