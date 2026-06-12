import { Flashcard, FlashcardDifficulty } from '@core/models/flashcard.model';


/**
 * Test fixture data for Flashcard.
 * @description Provides reusable mock objects for use in unit and integration tests.
 */
export const createMockFlashcard = (overrides?: Partial<Flashcard>): Flashcard => ({
  id: '1',
  grandeArea: 'Pediatria',
  frente: 'Qual a dose de paracetamol em crianças?',
  verso: '10-15 mg/kg/dose',
  proximaRevisao: '2026-05-10',
  dificuldadeUltima: FlashcardDifficulty.MEDIUM,
  intervaloAtual: 1,
  ...overrides
});

export const mockFlashcardsResponse = [
  createMockFlashcard(),
  createMockFlashcard({ id: '2', grandeArea: 'Ginecologia' })
];
