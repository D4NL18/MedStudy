import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { CompeticoesComponent } from './competicoes.component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SocialService } from '../../core/services/social.service';
import { ToastService } from '../../core/services/toast.service';
import { of } from 'rxjs';
import { CompetitionActions } from '../../store/competition/competition.actions';
import { 
  CompetitionType, 
  MetricType, 
  CompetitionStatus, 
  ParticipantStatus 
} from '../../core/models/competition.model';

describe('CompeticoesComponent', () => {
  MockInstance.scope();

  const mockProfile = {
    userId: 'user-123',
    nomeCompleto: 'Dr. Test',
    handle: 'drtest',
    avatarPresetId: 'avatar-1'
  };

  const mockCompetitions = [
    {
      id: 'comp-1',
      title: 'Grupo de Estudo Premium',
      creatorId: 'user-123',
      competitionType: CompetitionType.GROUP,
      metricType: MetricType.TOTAL_QUESTIONS,
      startDate: '2026-05-20',
      endDate: '2026-05-27',
      status: CompetitionStatus.ACTIVE,
      participants: [
        {
          userId: 'user-123',
          name: 'Dr. Test',
          handle: 'drtest',
          avatarPresetId: 'avatar-1',
          status: ParticipantStatus.ACCEPTED
        }
      ]
    }
  ];

  beforeEach(() => {
    return MockBuilder(CompeticoesComponent)
      .provide(provideMockStore({
        initialState: {
          competition: {
            competitions: mockCompetitions,
            leaderboards: {},
            loading: false,
            creating: false,
            error: null
          },
          profile: {
            profile: mockProfile
          }
        }
      }))
      .mock(SocialService, {
        getFriends: () => of([])
      })
      .mock(ToastService, {
        success: () => {},
        error: () => {}
      });
  });

  it('should create the component', () => {
    const fixture = MockRender(CompeticoesComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should load competitions and friends on init', () => {
    const fixture = MockRender(CompeticoesComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    fixture.point.componentInstance.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(CompetitionActions.loadCompetitions());
  });

  it('should initialize form correctly', () => {
    const fixture = MockRender(CompeticoesComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;
    
    expect(comp.competitionForm).toBeDefined();
    expect(comp.competitionForm.get('title')).toBeDefined();
    expect(comp.competitionForm.get('competitionType')?.value).toBe(CompetitionType.GROUP);
  });

  it('should toggle friend selection', () => {
    const fixture = MockRender(CompeticoesComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;

    expect(comp.selectedFriendIds()).toEqual([]);
    comp.toggleFriendSelection('friend-1');
    expect(comp.selectedFriendIds()).toEqual(['friend-1']);
    comp.toggleFriendSelection('friend-1');
    expect(comp.selectedFriendIds()).toEqual([]);
  });

  it('should open and close the modal', () => {
    const fixture = MockRender(CompeticoesComponent, null, { reset: true });
    const comp = fixture.point.componentInstance;

    expect(comp.showCreateModal()).toBeFalse();
    comp.openCreateModal();
    expect(comp.showCreateModal()).toBeTrue();
    comp.closeCreateModal();
    expect(comp.showCreateModal()).toBeFalse();
  });
});
