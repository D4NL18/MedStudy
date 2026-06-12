import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { FlashcardsEffects } from './flashcards.effects';
import { FlashcardService } from '@core/services/flashcard.service';
import { FlashcardsActions } from './flashcards.actions';
import { RevisionActions } from '../revision/revision.actions';
import { provideMockStore } from '@ngrx/store/testing';

describe('FlashcardsEffects', () => {
  let actions$: Observable<any>;
  let effects: FlashcardsEffects;
  let flashcardService: jasmine.SpyObj<FlashcardService>;

  beforeEach(() => {
    flashcardService = jasmine.createSpyObj('FlashcardService', ['getTodayQueue', 'rateFlashcard', 'getFlashcards', 'getSummary', 'deleteFlashcard']);

    TestBed.configureTestingModule({
      providers: [
        FlashcardsEffects,
        provideMockActions(() => actions$),
        { provide: FlashcardService, useValue: flashcardService },
        provideMockStore()
      ]
    });

    effects = TestBed.inject(FlashcardsEffects);
  });

  it('should load study queue successfully', (done) => {
    const flashcards = [{ id: '1' } as any];
    flashcardService.getTodayQueue.and.returnValue(of(flashcards));
    actions$ = of(FlashcardsActions.loadStudyQueue());

    effects.loadQueue$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.loadStudyQueueSuccess({ flashcards }));
      done();
    });
  });

  it('should rate flashcard successfully', (done) => {
    const flashcard = { id: '1' } as any;
    const rating = { flashcardId: '1', dificuldade: 'EASY' } as any;
    flashcardService.rateFlashcard.and.returnValue(of(flashcard));
    actions$ = of(FlashcardsActions.rateFlashcard({ rating }));

    effects.rateFlashcard$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.rateFlashcardSuccess({ flashcard, missed: undefined }));
      done();
    });
  });

  it('should load all flashcards successfully', (done) => {
    const flashcards = [{ id: '1' } as any];
    flashcardService.getFlashcards.and.returnValue(of({ content: flashcards, totalElements: 1 }));
    actions$ = of(FlashcardsActions.loadFlashcards({}));

    effects.loadAll$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.loadFlashcardsSuccess({ flashcards, totalElements: 1 }));
      done();
    });
  });

  it('should delete flashcard successfully', (done) => {
    flashcardService.deleteFlashcard.and.returnValue(of(undefined));
    actions$ = of(FlashcardsActions.deleteFlashcard({ id: '1' }));

    effects.deleteFlashcard$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.deleteFlashcardSuccess({ id: '1' }));
      done();
    });
  });

  it('should refresh summary after rate success', (done) => {
    actions$ = of(FlashcardsActions.rateFlashcardSuccess({ flashcard: {} as any, missed: false }));
    const emittedActions: any[] = [];
    
    effects.refreshSummary$.subscribe(action => {
      emittedActions.push(action);
      if (emittedActions.length === 2) {
        expect(emittedActions).toContain(jasmine.objectContaining({ type: RevisionActions.loadSummary.type }));
        expect(emittedActions).toContain(jasmine.objectContaining({ type: FlashcardsActions.loadSummary.type }));
        done();
      }
    });
  });

  it('should load summary successfully', (done) => {
    const summary = { total: 10 } as any;
    flashcardService.getSummary.and.returnValue(of(summary));
    actions$ = of(FlashcardsActions.loadSummary());

    effects.loadSummary$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.loadSummarySuccess({ summary }));
      done();
    });
  });

  it('should handle load all failure', (done) => {
    const error = { message: 'Error' };
    flashcardService.getFlashcards.and.returnValue(throwError(() => error));
    actions$ = of(FlashcardsActions.loadFlashcards({}));

    effects.loadAll$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.loadFlashcardsFailure({ error: 'Error' }));
      done();
    });
  });

  it('should handle load queue failure', (done) => {
    const error = { message: 'Error' };
    flashcardService.getTodayQueue.and.returnValue(throwError(() => error));
    actions$ = of(FlashcardsActions.loadStudyQueue());

    effects.loadQueue$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.loadStudyQueueFailure({ error: 'Error' }));
      done();
    });
  });

  it('should handle rate failure', (done) => {
    const error = { message: 'Error' };
    flashcardService.rateFlashcard.and.returnValue(throwError(() => error));
    actions$ = of(FlashcardsActions.rateFlashcard({ rating: {} as any }));

    effects.rateFlashcard$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.rateFlashcardFailure({ error: 'Error' }));
      done();
    });
  });

  it('should handle load summary failure', (done) => {
    const error = { message: 'Error' };
    flashcardService.getSummary.and.returnValue(throwError(() => error));
    actions$ = of(FlashcardsActions.loadSummary());

    effects.loadSummary$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.loadSummaryFailure({ error: 'Error' }));
      done();
    });
  });

  it('should handle delete failure', (done) => {
    const error = { message: 'Error' };
    flashcardService.deleteFlashcard.and.returnValue(throwError(() => error));
    actions$ = of(FlashcardsActions.deleteFlashcard({ id: '1' }));

    effects.deleteFlashcard$.subscribe(action => {
      expect(action).toEqual(FlashcardsActions.deleteFlashcardFailure({ error: 'Error' }));
      done();
    });
  });
});
