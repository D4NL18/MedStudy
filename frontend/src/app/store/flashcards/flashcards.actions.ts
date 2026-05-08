import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Flashcard, FlashcardStudyRating } from '../../core/models/flashcard.model';

export const FlashcardsActions = createActionGroup({
  source: 'Flashcards',
  events: {
    'Load Study Queue': emptyProps(),
    'Load Study Queue Success': props<{ flashcards: Flashcard[] }>(),
    'Load Study Queue Failure': props<{ error: string }>(),
    
    'Load Flashcards': props<{ filter?: any }>(),
    'Load Flashcards Success': props<{ flashcards: Flashcard[] }>(),
    'Load Flashcards Failure': props<{ error: string }>(),

    'Load Summary': emptyProps(),
    'Load Summary Success': props<{ summary: any }>(),
    'Load Summary Failure': props<{ error: string }>(),

    'Rate Flashcard': props<{ rating: FlashcardStudyRating }>(),
    'Rate Flashcard Success': props<{ flashcard: Flashcard }>(),
    'Rate Flashcard Failure': props<{ error: string }>(),
    'Set Current Card': props<{ cardIndex: number }>(),
    'Close Study Mode': emptyProps(),
  }
});
