import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';
import { selectQueue, selectCurrentIndex, selectStudyModeActive, selectLoading } from '../../../../store/flashcards/flashcards.reducer';
import { FlashcardDifficulty } from '../../../../core/models/flashcard.model';
import { MarkdownRendererComponent } from '../../../../shared/components/markdown-renderer/markdown-renderer.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-flashcards-study',
  standalone: true,
  imports: [ButtonComponent, 
    CommonModule, 
    LucideAngularModule, 
    MarkdownRendererComponent
  ],
  templateUrl: './flashcards-study.component.html',
  styleUrl: './flashcards-study.component.scss'
})
export class FlashcardsStudyComponent {
  private store = inject(Store);
  private actions$ = inject(Actions);
  
  active$ = this.store.select(selectStudyModeActive);
  queue$ = this.store.select(selectQueue);
  currentIndex$ = this.store.select(selectCurrentIndex);
  loading$ = this.store.select(selectLoading);
  
  isSessionOver$ = this.store.select(state => {
    const queue = selectQueue(state);
    const index = selectCurrentIndex(state);
    const active = selectStudyModeActive(state);
    return active && queue.length > 0 && index >= queue.length;
  });

  isEmpty$ = this.store.select(state => {
    const queue = selectQueue(state);
    const loading = selectLoading(state);
    const active = selectStudyModeActive(state);
    return active && !loading && queue.length === 0;
  });

  currentCard = this.store.selectSignal(state => {
    const queue = selectQueue(state);
    const index = selectCurrentIndex(state);
    return (index < queue.length) ? queue[index] : null;
  });

  isFlipped = signal(false);
  hasResult = signal(false);
  lastResultMissed = signal(false);
  isZoomed = signal(false);
  zoomImageUrl = signal('');

  constructor() {
    // Reset internal state whenever a card is successfully rated
    this.actions$.pipe(
      ofType(FlashcardsActions.rateFlashcardSuccess),
      tap(() => this.resetState())
    ).subscribe();
  }

  handleCardClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Se clicou numa imagem, abre o zoom e não vira o card
    if (target.tagName === 'IMG') {
      event.stopPropagation();
      this.zoomImageUrl.set((target as HTMLImageElement).src);
      this.isZoomed.set(true);
      return;
    }

    // Toggle flip (permite desvirar)
    this.isFlipped.update(v => !v);
  }

  closeZoom(event?: Event) {
    if (event) event.stopPropagation();
    this.isZoomed.set(false);
    this.zoomImageUrl.set('');
  }

  setResult(missed: boolean) {
    this.lastResultMissed.set(missed);
    this.hasResult.set(true);
  }

  rate(difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
    const card = this.currentCard();
    if (card) {
      this.store.dispatch(FlashcardsActions.rateFlashcard({
        rating: { 
          flashcardId: card.id, 
          dificuldade: difficulty as FlashcardDifficulty,
          missed: this.lastResultMissed()
        }
      }));
    }
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
    const safeIndex = Math.min(index, total);
    return (safeIndex / total) * 100;
  }
}
