import { themeReducer, initialState } from './theme.reducer';
import * as ThemeActions from './theme.actions';

describe('ThemeReducer', () => {
  it('should set activeTheme', () => {
    const action = ThemeActions.setTheme({ theme: 'rosa' });
    const state = themeReducer(initialState, action);
    expect(state.activeTheme).toBe('rosa');
  });
});
