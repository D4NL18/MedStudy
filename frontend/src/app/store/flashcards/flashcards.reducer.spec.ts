import { reducer, initialState } from './flashcards.reducer';
import { FlashcardsActions } from './flashcards.actions';
import { createMockFlashcard } from '@testing/fixtures/flashcard.fixture';

describe('FlashcardsReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' } as any;
    const state = reducer(initialState, action);
    expect(state).toBe(initialState);
  });

  it('should set loading on loadStudyQueue', () => {
    const action = FlashcardsActions.loadStudyQueue();
    const state = reducer(initialState, action);
    expect(state.loading).toBeTrue();
    expect(state.studyModeActive).toBeTrue();
  });

  it('should set queue on loadStudyQueueSuccess', () => {
    const mockCards = [createMockFlashcard()];
    const action = FlashcardsActions.loadStudyQueueSuccess({ flashcards: mockCards });
    const state = reducer(initialState, action);
    expect(state.queue).toEqual(mockCards);
    expect(state.loading).toBeFalse();
  });

  it('should increment index on rateFlashcardSuccess (not missed)', () => {
    const startState = { ...initialState, currentIndex: 0, queue: [createMockFlashcard()] };
    const action = FlashcardsActions.rateFlashcardSuccess({ 
      flashcard: createMockFlashcard(), 
      missed: false 
    });
    const state = reducer(startState, action);
    expect(state.currentIndex).toBe(1);
  });

  it('should move card to back on rateFlashcardSuccess (missed)', () => {
    const card1 = createMockFlashcard({ id: '1' });
    const card2 = createMockFlashcard({ id: '2' });
    const startState = { ...initialState, currentIndex: 0, queue: [card1, card2] };
    
    const action = FlashcardsActions.rateFlashcardSuccess({ 
      flashcard: card1, 
      missed: true 
    });
    const state = reducer(startState, action);
    
    expect(state.queue.length).toBe(2);
    expect(state.queue[1].id).toBe('1'); // Card 1 moved to end
    expect(state.currentIndex).toBe(0); // Current index stays same (next card is now at index 0)
  });

  it('should clear state on closeStudyMode', () => {
    const startState = { ...initialState, studyModeActive: true, queue: [createMockFlashcard()] };
    const action = FlashcardsActions.closeStudyMode();
    const state = reducer(startState, action);
    expect(state.studyModeActive).toBeFalse();
    expect(state.queue.length).toBe(0);
  });

  it('should set allCards on loadFlashcardsSuccess', () => {
    const mockCards = [createMockFlashcard()];
    const action = FlashcardsActions.loadFlashcardsSuccess({ flashcards: mockCards, totalElements: 1 });
    const state = reducer(initialState, action);
    expect(state.allCards).toEqual(mockCards);
  });

  it('should remove card on deleteFlashcardSuccess', () => {
    const card = createMockFlashcard({ id: '1' });
    const startState = { ...initialState, allCards: [card] };
    const action = FlashcardsActions.deleteFlashcardSuccess({ id: '1' });
    const state = reducer(startState, action);
    expect(state.allCards.length).toBe(0);
  });
});
