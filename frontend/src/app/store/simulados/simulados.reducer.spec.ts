import { simuladosReducer, initialState } from './simulados.reducer';
import * as SimuladosActions from './simulados.actions';

describe('SimuladosReducer', () => {
  it('should set loading on loadSimulados', () => {
    const action = SimuladosActions.loadSimulados({ filters: { page: 0, size: 10 }, append: false });
    const state = simuladosReducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set all simulados on loadSimuladosSuccess when not appending', () => {
    const simulados = [{ id: '1' } as any];
    const action = SimuladosActions.loadSimuladosSuccess({ simulados, totalCount: 1, append: false });
    const state = simuladosReducer(initialState, action);
    expect(state.ids.length).toBe(1);
    expect(state.loading).toBeFalse();
  });

  it('should add simulado on createSimuladoSuccess', () => {
    const simulado = { id: '1' } as any;
    const action = SimuladosActions.createSimuladoSuccess({ simulado });
    const state = simuladosReducer(initialState, action);
    expect(state.ids.length).toBe(1);
    expect(state.totalCount).toBe(1);
  });
});
