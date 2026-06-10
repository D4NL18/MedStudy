import { createReducer, on } from '@ngrx/store';
import { AppTheme } from '@core/services/theme.service';
import * as ThemeActions from './theme.actions';

export interface ThemeState {
  activeTheme: AppTheme;
}

export const initialState: ThemeState = {
  activeTheme: (localStorage.getItem('medstudy-theme-v2') as AppTheme) || 'verde'
};

export const themeReducer = createReducer(
  initialState,
  on(ThemeActions.setTheme, (state, { theme }) => ({
    ...state,
    activeTheme: theme
  }))
);
