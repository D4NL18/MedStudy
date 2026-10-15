import { reducer, initialState } from './revision.reducer';
import { RevisionActions } from './revision.actions';

describe('RevisionReducer', () => {
  it('should set loading on loadSummary', () => {
    const action = RevisionActions.loadSummary();
    const state = reducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set summary on loadSummarySuccess', () => {
    const summary = { totalCards: 10 } as any;
    const action = RevisionActions.loadSummarySuccess({ summary });
    const state = reducer(initialState, action);
    expect(state.summary).toEqual(summary);
    expect(state.loading).toBeFalse();
  });

  it('should set loading on loadSessions', () => {
    const action = RevisionActions.loadSessions({ filter: 'HOJE' });
    const state = reducer(initialState, action);
    expect(state.loading).toBeTrue();
  });

  it('should set sessions on loadSessionsSuccess', () => {
    const sessions = [{ id: '1' } as any];
    const response = {
      content: sessions,
      totalElements: 1,
      totalPages: 1,
      size: 10,
      number: 0
    };
    const action = RevisionActions.loadSessionsSuccess({ response });
    const state = reducer(initialState, action);
    expect(state.sessions).toEqual(sessions);
    expect(state.loading).toBeFalse();
  });
});
