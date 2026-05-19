import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { PerfilComponent } from './perfil.component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { BadgeService } from '../../core/services/badge.service';
import { of } from 'rxjs';
import { ProfileActions } from '../../store/profile/profile.actions';

describe('PerfilComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(PerfilComponent)
      .provide(provideMockStore({
        initialState: {
          auth: { user: { nome: 'João', email: 'joao@test.com' } },
          profile: {
            profile: {
              nomeCompleto: 'João Med',
              isFormado: false,
              semestre: 4,
              faculdade: 'USP',
              handle: 'joao.med',
              avatarPresetId: 'cardiologia'
            },
            loading: false
          },
          theme: {
            activeTheme: 'light'
          }
        }
      }))
      .mock(BadgeService, {
        getUserBadges: () => of([])
      });
  });

  it('should create', () => {
    const fixture = MockRender(PerfilComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should toggle edit mode and populate form', () => {
    const fixture = MockRender(PerfilComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;

    expect(comp.isEditing()).toBeFalse();
    comp.startEditing();
    expect(comp.isEditing()).toBeTrue();
    expect(comp.editForm.value.nomeCompleto).toBe('João Med');
  });

  it('should dispatch saveProfile on form submission', () => {
    const fixture = MockRender(PerfilComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    comp.startEditing();
    comp.editForm.patchValue({
      nomeCompleto: 'João Alterado',
      isFormado: false,
      semestre: 6,
      faculdade: 'UNICAMP'
    });
    comp.selectedAvatarId = 'neurologia';

    comp.saveProfile();

    expect(dispatchSpy).toHaveBeenCalledWith(ProfileActions.saveProfile({
      profile: {
        nomeCompleto: 'João Alterado',
        isFormado: false,
        semestre: 6,
        faculdade: 'UNICAMP',
        handle: 'joao.med',
        avatarPresetId: 'neurologia'
      }
    }));
  });
});
