import * as fromTheme from './theme.reducer';
import * as ThemeSelectors from './theme.selectors';

describe('ThemeSelectors', () => {
  const initialState: fromTheme.ThemeState = {
    activeTheme: 'rosa'
  };

  it('should select activeTheme', () => {
    const result = ThemeSelectors.selectActiveTheme.projector(initialState);
    expect(result).toBe('rosa');
  });
});
