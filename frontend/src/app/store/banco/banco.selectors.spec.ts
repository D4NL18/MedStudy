import * as Selectors from './banco.selectors';
import { BancoState } from './banco.reducer';

describe('BancoSelectors', () => {
  const initialState: BancoState = {
    ids: [],
    entities: {},
    loading: false,
    error: null,
    totalCount: 5,
    filters: { page: 0, size: 10 }
  };

  it('should select totalCount', () => {
    const result = Selectors.selectBancoTotalCount.projector(initialState);
    expect(result).toBe(5);
  });

  it('should select loading', () => {
    const result = Selectors.selectBancoLoading.projector(initialState);
    expect(result).toBeFalse();
  });
});
