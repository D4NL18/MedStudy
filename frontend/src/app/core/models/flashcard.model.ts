export enum FlashcardDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Flashcard {
  id: string;
  grandeArea: string;
  frente: any; // Can be string or JSON
  verso: any;  // Can be string or JSON
  proximaRevisao: string;
  dificuldadeUltima: FlashcardDifficulty;
  intervaloAtual: number;
}

export interface FlashcardStudyRating {
  flashcardId: string;
  dificuldade: FlashcardDifficulty;
  missed?: boolean;
}
