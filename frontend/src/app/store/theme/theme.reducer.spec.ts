import * as fromTheme from './theme.reducer';
import * as ThemeActions from './theme.actions';

describe('ThemeReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromTheme;
      const action = { type: 'Unknown' } as any;
      const state = fromTheme.themeReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('setTheme action', () => {
    it('should set the active theme', () => {
      const { initialState } = fromTheme;
      const theme: any = 'rosa';
      const action = ThemeActions.setTheme({ theme });
      const state = fromTheme.themeReducer(initialState, action);

      expect(state.activeTheme).toBe('rosa');
    });
  });
});
