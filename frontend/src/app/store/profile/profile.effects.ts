import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '@core/services/profile.service';
import { ProfileActions } from './profile.actions';
import * as AuthActions from '../auth/auth.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ToastService } from '@core/services/toast.service';


/**
 * NgRx effects for the Profile feature slice.
 * @description Handles side effects such as HTTP calls in response to Profile actions.
 */
@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      mergeMap(() =>
        this.profileService.getMyProfile().pipe(
          map((profile) => ProfileActions.loadProfileSuccess({ profile })),
          catchError((error) => {
            // If 404, we don't have a profile yet (expected for new users), don't show toast error
            const errorMsg = error.status === 404 ? 'Perfil não encontrado' : 'Erro ao carregar perfil';
            return of(ProfileActions.loadProfileFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  saveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.saveProfile),
      mergeMap(({ profile }) =>
        this.profileService.saveProfile(profile).pipe(
          map((savedProfile) => {
            this.toastService.success('Perfil salvo com sucesso!');
            return ProfileActions.saveProfileSuccess({ profile: savedProfile });
          }),
          catchError((error) => {
            const errorMsg = error.error?.message || 'Erro ao salvar perfil';
            this.toastService.error(errorMsg);
            return of(ProfileActions.saveProfileFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  checkHandle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.checkHandle),
      mergeMap(({ handle }) =>
        this.profileService.checkHandle(handle).pipe(
          map((response) => ProfileActions.checkHandleSuccess({ response })),
          catchError((error) => of(ProfileActions.checkHandleFailure({ error: 'Erro ao verificar handle' })))
        )
      )
    )
  );

  uploadProfilePicture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.uploadProfilePicture),
      mergeMap(({ file }) =>
        this.profileService.uploadProfilePicture(file).pipe(
          map((profile) => {
            this.toastService.success('Foto de perfil atualizada!');
            return ProfileActions.uploadProfilePictureSuccess({ profile });
          }),
          catchError((error) => {
            const errorMsg = error.error?.message || 'Erro ao atualizar foto de perfil';
            this.toastService.error(errorMsg);
            return of(ProfileActions.uploadProfilePictureFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  loadProfileOnLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => ProfileActions.loadProfile())
    )
  );

  clearProfileOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => ProfileActions.clearProfileState())
    )
  );
}
