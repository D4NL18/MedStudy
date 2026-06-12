import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ProfileEffects } from './profile.effects';
import { ProfileService } from '@core/services/profile.service';
import { ToastService } from '@core/services/toast.service';
import { ProfileActions } from './profile.actions';
import * as AuthActions from '../auth/auth.actions';
import { Profile } from '@core/models/profile.model';

describe('ProfileEffects', () => {
  let actions$: Observable<any>;
  let effects: ProfileEffects;
  let profileService: jasmine.SpyObj<ProfileService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockProfile: Profile = {
    handle: 'pediatra_feliz',
    nomeCompleto: 'Dr. Pedro',
    semestre: 5,
    faculdade: 'USP',
    avatarPresetId: 'pediatria'
  };

  beforeEach(() => {
    profileService = jasmine.createSpyObj('ProfileService', ['getMyProfile', 'saveProfile', 'checkHandle']);
    toastService = jasmine.createSpyObj('ToastService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        ProfileEffects,
        provideMockActions(() => actions$),
        { provide: ProfileService, useValue: profileService },
        { provide: ToastService, useValue: toastService }
      ]
    });

    effects = TestBed.inject(ProfileEffects);
  });

  it('should load profile successfully', (done) => {
    profileService.getMyProfile.and.returnValue(of(mockProfile));
    actions$ = of(ProfileActions.loadProfile());

    effects.loadProfile$.subscribe(action => {
      expect(action).toEqual(ProfileActions.loadProfileSuccess({ profile: mockProfile }));
      done();
    });
  });

  it('should handle load profile failure', (done) => {
    profileService.getMyProfile.and.returnValue(throwError(() => ({ status: 500 })));
    actions$ = of(ProfileActions.loadProfile());

    effects.loadProfile$.subscribe(action => {
      expect(action).toEqual(ProfileActions.loadProfileFailure({ error: 'Erro ao carregar perfil' }));
      done();
    });
  });

  it('should save profile successfully', (done) => {
    profileService.saveProfile.and.returnValue(of(mockProfile));
    actions$ = of(ProfileActions.saveProfile({ profile: mockProfile }));

    effects.saveProfile$.subscribe(action => {
      expect(action).toEqual(ProfileActions.saveProfileSuccess({ profile: mockProfile }));
      expect(toastService.success).toHaveBeenCalledWith('Perfil salvo com sucesso!');
      done();
    });
  });

  it('should handle login success by triggering loadProfile', (done) => {
    actions$ = of(AuthActions.loginSuccess({ response: { accessToken: 'token', refreshToken: 'refresh' } }));

    effects.loadProfileOnLoginSuccess$.subscribe(action => {
      expect(action).toEqual(ProfileActions.loadProfile());
      done();
    });
  });
});
