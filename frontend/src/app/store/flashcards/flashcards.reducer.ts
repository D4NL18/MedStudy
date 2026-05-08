import { createFeature, createReducer, on } from '@ngrx/store';
import { Flashcard } from '../../core/models/flashcard.model';
import { FlashcardsActions } from './flashcards.actions';

export interface FlashcardsState {
  queue: Flashcard[];
  allCards: Flashcard[];
  summary: any | null;
  currentIndex: number;
  loading: boolean;
  error: string | null;
  studyModeActive: boolean;
}

export const initialState: FlashcardsState = {
  queue: [],
  allCards: [],
  summary: null,
  currentIndex: 0,
  loading: false,
  error: null,
  studyModeActive: false,
};

export const flashcardsFeature = createFeature({
  name: 'flashcards',
  reducer: createReducer(
    initialState,
    on(FlashcardsActions.loadStudyQueue, (state) => ({
      ...state,
      loading: true,
      studyModeActive: true,
      currentIndex: 0
    })),
    on(FlashcardsActions.loadStudyQueueSuccess, (state, { flashcards }) => ({
      ...state,
      queue: flashcards,
      loading: false
    })),
    on(FlashcardsActions.loadStudyQueueFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(FlashcardsActions.loadFlashcards, (state) => ({
      ...state,
      loading: true
    })),
    on(FlashcardsActions.loadFlashcardsSuccess, (state, { flashcards }) => ({
      ...state,
      allCards: flashcards,
      loading: false
    })),
    on(FlashcardsActions.loadSummarySuccess, (state, { summary }) => ({
      ...state,
      summary
    })),
    on(FlashcardsActions.setCurrentCard, (state, { cardIndex }) => ({
      ...state,
      currentIndex: cardIndex
    })),
    on(FlashcardsActions.rateFlashcardSuccess, (state) => ({
      ...state,
      currentIndex: state.currentIndex + 1
    })),
    on(FlashcardsActions.closeStudyMode, (state) => ({
      ...state,
      studyModeActive: false,
      queue: [],
      currentIndex: 0
    })),
  ),
});

export const {
  name,
  reducer,
  selectFlashcardsState,
  selectQueue,
  selectAllCards,
  selectSummary,
  selectCurrentIndex,
  selectLoading,
  selectError,
  selectStudyModeActive,
} = flashcardsFeature;
