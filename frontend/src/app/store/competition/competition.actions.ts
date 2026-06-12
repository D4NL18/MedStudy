import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Competition, CompetitionRequest, LeaderboardEntry } from '@core/models/competition.model';


/**
 * NgRx actions for the Competition feature slice.
 * @description Defines the action creators used to dispatch state changes for Competition.
 */
export const CompetitionActions = createActionGroup({
  source: 'Competition',
  events: {
    'Load Competitions': emptyProps(),
    'Load Competitions Success': props<{ competitions: Competition[] }>(),
    'Load Competitions Failure': props<{ error: string }>(),

    'Create Competition': props<{ request: CompetitionRequest }>(),
    'Create Competition Success': props<{ competition: Competition }>(),
    'Create Competition Failure': props<{ error: string }>(),

    'Accept Invite': props<{ id: string }>(),
    'Accept Invite Success': props<{ competition: Competition }>(),
    'Accept Invite Failure': props<{ error: string }>(),

    'Decline Invite': props<{ id: string }>(),
    'Decline Invite Success': props<{ competition: Competition }>(),
    'Decline Invite Failure': props<{ error: string }>(),

    'Load Leaderboard': props<{ id: string }>(),
    'Load Leaderboard Success': props<{ id: string, leaderboard: LeaderboardEntry[] }>(),
    'Load Leaderboard Failure': props<{ error: string }>(),

    'Clear Competition State': emptyProps(),
  }
});
