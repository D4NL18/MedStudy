import * as Selectors from './simulados.selectors';
import { SimuladosState } from './simulados.reducer';

describe('SimuladosSelectors', () => {
  const initialState: SimuladosState = {
    ids: [],
    entities: {},
    loading: false,
    error: null,
    totalCount: 10,
    filters: { page: 0, size: 20 }
  };

  it('should select totalCount', () => {
    const result = Selectors.selectSimuladosTotalCount.projector(initialState);
    expect(result).toBe(10);
  });

  it('should select loading', () => {
    const result = Selectors.selectSimuladosLoading.projector(initialState);
    expect(result).toBeFalse();
  });
});
