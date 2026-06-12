import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from './theme.reducer';


/**
 * NgRx selectors for the Theme feature slice.
 * @description Provides memoized queries to extract Theme state from the store.
 */
export const selectThemeState = createFeatureSelector<ThemeState>('theme');

export const selectActiveTheme = createSelector(
  selectThemeState,
  (state) => state.activeTheme
);
