import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile, ProfileCheckResponse } from '../../core/models/profile.model';
import { ProfileActions } from './profile.actions';

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  handleAvailability: ProfileCheckResponse | null;
  handleChecking: boolean;
}

export const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  handleAvailability: null,
  handleChecking: false,
};

export const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialState,
    on(ProfileActions.loadProfile, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(ProfileActions.loadProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      loading: false,
      error: null
    })),
    on(ProfileActions.loadProfileFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(ProfileActions.saveProfile, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(ProfileActions.saveProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      loading: false,
      error: null
    })),
    on(ProfileActions.saveProfileFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(ProfileActions.checkHandle, (state) => ({
      ...state,
      handleChecking: true,
      handleAvailability: null
    })),
    on(ProfileActions.checkHandleSuccess, (state, { response }) => ({
      ...state,
      handleChecking: false,
      handleAvailability: response
    })),
    on(ProfileActions.checkHandleFailure, (state, { error }) => ({
      ...state,
      handleChecking: false,
      error
    })),
    on(ProfileActions.clearProfileState, () => initialState)
  ),
});

export const {
  name,
  reducer,
  selectProfileState,
  selectProfile,
  selectLoading,
  selectError,
  selectHandleAvailability,
  selectHandleChecking,
} = profileFeature;
