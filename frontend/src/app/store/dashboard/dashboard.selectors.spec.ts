import * as Selectors from './dashboard.selectors';
import { DashboardState } from './dashboard.reducer';

describe('DashboardSelectors', () => {
  const initialState: DashboardState = {
    kpis: { currentStreak: 5 } as any,
    loading: false,
    error: null
  };

  it('should select KPIs', () => {
    const result = Selectors.selectDashboardKPIs.projector(initialState);
    expect(result?.currentStreak).toBe(5);
  });

  it('should select loading', () => {
    const result = Selectors.selectDashboardLoading.projector(initialState);
    expect(result).toBeFalse();
  });
});
