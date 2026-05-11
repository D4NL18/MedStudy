import { dashboardReducer, initialState } from './dashboard.reducer';
import * as DashboardActions from './dashboard.actions';

describe('DashboardReducer', () => {
  it('should set loading on loadDashboard', () => {
    const action = DashboardActions.loadDashboard();
    const state = dashboardReducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set kpis on loadDashboardSuccess', () => {
    const kpis = { currentStreak: 5 } as any;
    const action = DashboardActions.loadDashboardSuccess({ kpis });
    const state = dashboardReducer(initialState, action);
    expect(state.kpis).toEqual(kpis);
    expect(state.loading).toBeFalse();
  });
});
