import { createReducer, on } from '@ngrx/store';
import { AppTheme } from '../../core/services/theme.service';
import * as ThemeActions from './theme.actions';

export interface ThemeState {
  activeTheme: AppTheme;
}

export const initialState: ThemeState = {
  activeTheme: (localStorage.getItem('medstudy-theme') as AppTheme) || 'rosa'
};

export const themeReducer = createReducer(
  initialState,
  on(ThemeActions.setTheme, (state, { theme }) => ({
    ...state,
    activeTheme: theme
  }))
);
