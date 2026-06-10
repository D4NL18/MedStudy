import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { RevisionEffects } from './revision.effects';
import { RevisionService } from '../../core/services/revision.service';
import { RevisionActions } from './revision.actions';
import { createMockRevisionSummary, createMockRevisionSession } from '../../testing/fixtures/revision.fixture';

describe('RevisionEffects', () => {
  let actions$: Observable<any>;
  let effects: RevisionEffects;
  let revisionService: jasmine.SpyObj<RevisionService>;

  beforeEach(() => {
    revisionService = jasmine.createSpyObj('RevisionService', ['getSummary', 'getSessions']);

    TestBed.configureTestingModule({
      providers: [
        RevisionEffects,
        provideMockActions(() => actions$),
        { provide: RevisionService, useValue: revisionService }
      ]
    });

    effects = TestBed.inject(RevisionEffects);
  });

  it('should load summary successfully', (done) => {
    const mockSummary = createMockRevisionSummary();
    revisionService.getSummary.and.returnValue(of(mockSummary));
    actions$ = of(RevisionActions.loadSummary());

    effects.loadSummary$.subscribe(action => {
      expect(action).toEqual(RevisionActions.loadSummarySuccess({ summary: mockSummary }));
      done();
    });
  });

  it('should load sessions successfully', (done) => {
    const mockSessions = [createMockRevisionSession()];
    revisionService.getSessions.and.returnValue(of(mockSessions));
    actions$ = of(RevisionActions.loadSessions({ filter: 'HOJE' }));

    effects.loadSessions$.subscribe(action => {
      expect(action).toEqual(RevisionActions.loadSessionsSuccess({ 
        sessions: mockSessions
      }));
      done();
    });
  });
});
