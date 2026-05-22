import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { CompetitionEffects } from './competition.effects';
import { CompetitionService } from '../../core/services/competition.service';
import { ToastService } from '../../core/services/toast.service';
import { CompetitionActions } from './competition.actions';
import { 
  Competition, 
  CompetitionType, 
  MetricType, 
  CompetitionStatus, 
  ParticipantStatus 
} from '../../core/models/competition.model';

describe('CompetitionEffects', () => {
  let actions$: Observable<any>;
  let effects: CompetitionEffects;
  let competitionService: jasmine.SpyObj<CompetitionService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockCompetition: Competition = {
    id: 'uuid-1',
    title: 'Desafio Semanal',
    creatorId: 'user-1',
    creatorName: 'Carlos',
    competitionType: CompetitionType.GROUP,
    metricType: MetricType.TOTAL_QUESTIONS,
    startDate: '2026-05-20',
    endDate: '2026-05-27',
    status: CompetitionStatus.ACTIVE,
    participants: [],
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z'
  };

  beforeEach(() => {
    competitionService = jasmine.createSpyObj('CompetitionService', [
      'getUserCompetitions',
      'createCompetition',
      'acceptInvite',
      'declineInvite',
      'getLeaderboard'
    ]);
    toastService = jasmine.createSpyObj('ToastService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        CompetitionEffects,
        provideMockActions(() => actions$),
        { provide: CompetitionService, useValue: competitionService },
        { provide: ToastService, useValue: toastService }
      ]
    });

    effects = TestBed.inject(CompetitionEffects);
  });

  it('should load competitions successfully', (done) => {
    competitionService.getUserCompetitions.and.returnValue(of([mockCompetition]));
    actions$ = of(CompetitionActions.loadCompetitions());

    effects.loadCompetitions$.subscribe(action => {
      expect(action).toEqual(CompetitionActions.loadCompetitionsSuccess({ competitions: [mockCompetition] }));
      done();
    });
  });

  it('should create competition successfully', (done) => {
    const request = {
      title: 'Desafio Semanal',
      competitionType: CompetitionType.GROUP,
      metricType: MetricType.TOTAL_QUESTIONS,
      startDate: '2026-05-20',
      endDate: '2026-05-27',
      friendIds: ['friend-1']
    };
    competitionService.createCompetition.and.returnValue(of(mockCompetition));
    actions$ = of(CompetitionActions.createCompetition({ request }));

    effects.createCompetition$.subscribe(action => {
      expect(action).toEqual(CompetitionActions.createCompetitionSuccess({ competition: mockCompetition }));
      expect(toastService.success).toHaveBeenCalledWith('Competição criada com sucesso!');
      done();
    });
  });

  it('should accept invite successfully', (done) => {
    competitionService.acceptInvite.and.returnValue(of(mockCompetition));
    actions$ = of(CompetitionActions.acceptInvite({ id: 'uuid-1' }));

    effects.acceptInvite$.subscribe(action => {
      expect(action).toEqual(CompetitionActions.acceptInviteSuccess({ competition: mockCompetition }));
      expect(toastService.success).toHaveBeenCalledWith('Convite aceito com sucesso!');
      done();
    });
  });

  it('should decline invite successfully', (done) => {
    competitionService.declineInvite.and.returnValue(of(mockCompetition));
    actions$ = of(CompetitionActions.declineInvite({ id: 'uuid-1' }));

    effects.declineInvite$.subscribe(action => {
      expect(action).toEqual(CompetitionActions.declineInviteSuccess({ competition: mockCompetition }));
      expect(toastService.success).toHaveBeenCalledWith('Convite recusado.');
      done();
    });
  });
});
