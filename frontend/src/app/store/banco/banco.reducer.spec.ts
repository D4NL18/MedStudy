import { bancoReducer, initialState } from './banco.reducer';
import * as BancoActions from './banco.actions';

describe('BancoReducer', () => {
  it('should set loading on loadSessions', () => {
    const action = BancoActions.loadSessions({ filters: { page: 0, size: 10 }, append: false });
    const state = bancoReducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set all sessions on loadSessionsSuccess when not appending', () => {
    const sessions = [{ id: '1' } as any];
    const action = BancoActions.loadSessionsSuccess({ sessions, totalCount: 1, append: false });
    const state = bancoReducer(initialState, action);
    expect(state.ids.length).toBe(1);
    expect(state.loading).toBeFalse();
  });

  it('should add session on createSessionSuccess', () => {
    const session = { id: '1' } as any;
    const action = BancoActions.createSessionSuccess({ session });
    const state = bancoReducer(initialState, action);
    expect(state.ids.length).toBe(1);
    expect(state.totalCount).toBe(1);
  });
});
