import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Flashcard, FlashcardStudyRating } from '../../core/models/flashcard.model';

export const FlashcardsActions = createActionGroup({
  source: 'Flashcards',
  events: {
    'Load Study Queue': emptyProps(),
    'Load Study Queue Success': props<{ flashcards: Flashcard[] }>(),
    'Load Study Queue Failure': props<{ error: string }>(),
    
    'Load Flashcards': props<{ page?: number, size?: number, filter?: any }>(),
    'Load Flashcards Success': props<{ flashcards: Flashcard[], totalElements: number }>(),
    'Load Flashcards Failure': props<{ error: string }>(),

    'Load Summary': emptyProps(),
    'Load Summary Success': props<{ summary: any }>(),
    'Load Summary Failure': props<{ error: string }>(),

    'Delete Flashcard': props<{ id: string }>(),
    'Delete Flashcard Success': props<{ id: string }>(),
    'Delete Flashcard Failure': props<{ error: string }>(),

    'Rate Flashcard': props<{ rating: FlashcardStudyRating }>(),
    'Rate Flashcard Success': props<{ flashcard: Flashcard; missed?: boolean }>(),
    'Rate Flashcard Failure': props<{ error: string }>(),
    'Set Current Card': props<{ cardIndex: number }>(),
    'Move Current Card To Back': emptyProps(),
    'Close Study Mode': emptyProps(),
    'Reset Progress': props<{ grandeArea?: string }>(),
    'Reset Progress Success': emptyProps(),
    'Reset Progress Failure': props<{ error: string }>(),
  }
});
