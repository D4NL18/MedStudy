import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { OnboardingComponent } from './onboarding.component';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ProfileActions } from '../../../store/profile/profile.actions';

describe('OnboardingComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(OnboardingComponent)
      .provide(provideMockStore({
        initialState: {
          profile: {
            profile: null,
            loading: false,
            error: null,
            handleAvailability: null,
            handleChecking: false
          }
        }
      }));
  });

  it('should create', () => {
    const fixture = MockRender(OnboardingComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should enable/disable next step based on form validity', () => {
    const fixture = MockRender(OnboardingComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;

    expect(comp.isNextDisabled()).toBeTrue();

    comp.basicForm.patchValue({
      nomeCompleto: 'Dr. John Doe',
      semestre: '5',
      faculdade: 'USP'
    });

    expect(comp.isNextDisabled()).toBeFalse();
  });

  it('should increment step on nextStep', () => {
    const fixture = MockRender(OnboardingComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;

    expect(comp.step).toBe(1);
    comp.nextStep();
    expect(comp.step).toBe(2);
  });

  it('should dispatch saveProfile on step 3 nextStep', () => {
    const fixture = MockRender(OnboardingComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    comp.step = 3;
    comp.basicForm.patchValue({
      nomeCompleto: 'Dr. John Doe',
      isFormado: false,
      semestre: '5',
      faculdade: 'USP'
    });
    comp.handleForm.patchValue({
      handle: 'john.doe'
    });
    comp.selectedAvatarId = 'cardiologia';

    comp.nextStep();

    expect(dispatchSpy).toHaveBeenCalledWith(ProfileActions.saveProfile({
      profile: {
        nomeCompleto: 'Dr. John Doe',
        isFormado: false,
        semestre: 5,
        faculdade: 'USP',
        handle: 'john.doe',
        avatarPresetId: 'cardiologia'
      }
    }));
  });
});
