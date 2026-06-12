import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile, ProfileCheckResponse } from '@core/models/profile.model';


/**
 * NgRx actions for the Profile feature slice.
 * @description Defines the action creators used to dispatch state changes for Profile.
 */
export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ profile: Profile }>(),
    'Load Profile Failure': props<{ error: string }>(),

    'Save Profile': props<{ profile: Profile }>(),
    'Save Profile Success': props<{ profile: Profile }>(),
    'Save Profile Failure': props<{ error: string }>(),

    'Check Handle': props<{ handle: string }>(),
    'Check Handle Success': props<{ response: ProfileCheckResponse }>(),
    'Check Handle Failure': props<{ error: string }>(),

    'Clear Profile State': emptyProps(),
  }
});
