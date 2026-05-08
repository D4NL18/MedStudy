import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';
import { selectQueue, selectCurrentIndex, selectStudyModeActive, selectLoading } from '../../../../store/flashcards/flashcards.reducer';
import { FlashcardDifficulty } from '../../../../core/models/flashcard.model';
import { MarkdownRendererComponent } from '../../../../shared/components/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-flashcards-study',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
    MarkdownRendererComponent
  ],
  templateUrl: './flashcards-study.component.html',
  styleUrl: './flashcards-study.component.scss'
})
export class FlashcardsStudyComponent {
  private store = inject(Store);
  
  active$ = this.store.select(selectStudyModeActive);
  queue$ = this.store.select(selectQueue);
  currentIndex$ = this.store.select(selectCurrentIndex);
  loading$ = this.store.select(selectLoading);
  
  isSessionOver$ = this.store.select(state => {
    const queue = selectQueue(state);
    const index = selectCurrentIndex(state);
    const loading = selectLoading(state);
    return !loading && (queue.length > 0 && index >= queue.length);
  });

  isEmpty$ = this.store.select(state => {
    const queue = selectQueue(state);
    const loading = selectLoading(state);
    return !loading && queue.length === 0;
  });

  currentCard$ = this.store.select(state => {
    const queue = selectQueue(state);
    const index = selectCurrentIndex(state);
    return index < queue.length ? queue[index] : null;
  });

  isFlipped = signal(false);
  hasResult = signal(false);
  lastResultMissed = signal(false);

  flip() {
    if (!this.isFlipped()) {
      this.isFlipped.set(true);
    }
  }

  setResult(missed: boolean) {
    this.lastResultMissed.set(missed);
    this.hasResult.set(true);
  }

  rate(difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
    this.currentCard$.subscribe(card => {
      if (card) {
        this.store.dispatch(FlashcardsActions.rateFlashcard({
          rating: { 
            flashcardId: card.id, 
            dificuldade: difficulty as FlashcardDifficulty,
            missed: this.lastResultMissed()
          }
        }));
        this.resetState();
      }
    }).unsubscribe();
  }

  private resetState() {
    this.isFlipped.set(false);
    this.hasResult.set(false);
    this.lastResultMissed.set(false);
  }

  close() {
    this.store.dispatch(FlashcardsActions.closeStudyMode());
    this.resetState();
  }

  getProgress(index: number, total: number): number {
    if (total === 0) return 0;
    return (index / total) * 100;
  }
}
