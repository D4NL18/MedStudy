import { createFeature, createReducer, on } from '@ngrx/store';
import { Competition, LeaderboardEntry } from '@core/models/competition.model';
import { CompetitionActions } from './competition.actions';


/**
 * NgRx reducer for the Competition feature slice.
 * @description Handles state transitions in response to dispatched Competition actions.
 */
export interface CompetitionState {
  competitions: Competition[];
  leaderboards: Record<string, LeaderboardEntry[]>;
  loading: boolean;
  creating: boolean;
  error: string | null;
}

export const initialState: CompetitionState = {
  competitions: [],
  leaderboards: {},
  loading: false,
  creating: false,
  error: null
};

export const competitionFeature = createFeature({
  name: 'competition',
  reducer: createReducer(
    initialState,
    on(CompetitionActions.loadCompetitions, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(CompetitionActions.loadCompetitionsSuccess, (state, { competitions }) => ({
      ...state,
      competitions,
      loading: false,
      error: null
    })),
    on(CompetitionActions.loadCompetitionsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    on(CompetitionActions.createCompetition, (state) => ({
      ...state,
      creating: true,
      error: null
    })),
    on(CompetitionActions.createCompetitionSuccess, (state, { competition }) => ({
      ...state,
      competitions: [competition, ...state.competitions],
      creating: false,
      error: null
    })),
    on(CompetitionActions.createCompetitionFailure, (state, { error }) => ({
      ...state,
      creating: false,
      error
    })),

    on(CompetitionActions.acceptInvite, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(CompetitionActions.acceptInviteSuccess, (state, { competition }) => ({
      ...state,
      competitions: state.competitions.map((c) => c.id === competition.id ? competition : c),
      loading: false,
      error: null
    })),
    on(CompetitionActions.acceptInviteFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    on(CompetitionActions.declineInvite, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(CompetitionActions.declineInviteSuccess, (state, { competition }) => ({
      ...state,
      competitions: state.competitions.filter((c) => c.id !== competition.id),
      loading: false,
      error: null
    })),
    on(CompetitionActions.declineInviteFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    on(CompetitionActions.loadLeaderboard, (state) => ({
      ...state,
      error: null
    })),
    on(CompetitionActions.loadLeaderboardSuccess, (state, { id, leaderboard }) => ({
      ...state,
      leaderboards: {
        ...state.leaderboards,
        [id]: leaderboard
      },
      error: null
    })),
    on(CompetitionActions.loadLeaderboardFailure, (state, { error }) => ({
      ...state,
      error
    })),

    on(CompetitionActions.clearCompetitionState, () => initialState)
  )
});

export const {
  name,
  reducer,
  selectCompetitionState,
  selectCompetitions,
  selectLeaderboards,
  selectLoading,
  selectCreating,
  selectError
} = competitionFeature;
