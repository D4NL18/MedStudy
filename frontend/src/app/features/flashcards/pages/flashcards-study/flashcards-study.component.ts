import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardsActions } from '@store/flashcards/flashcards.actions';
import { selectQueue, selectCurrentIndex, selectStudyModeActive, selectLoading, selectIsReadOnly } from '@store/flashcards/flashcards.reducer';
import { FlashcardDifficulty } from '@core/models/flashcard.model';
import { MarkdownRendererComponent } from '@shared/components/markdown-renderer/markdown-renderer.component';
import { tap } from 'rxjs';

/**
 * Angular component for the Flashcards Study feature with Gamification micro-mechanics.
 * @description Implements Combo counter, Foco em Chamas, Bounty Cards and Inbox Zero celebration summary.
 */
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
  private actions$ = inject(Actions);
  
  active$ = this.store.select(selectStudyModeActive);
  isReadOnly$ = this.store.select(selectIsReadOnly);
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

  // Card interaction state
  isFlipped = signal(false);
  hasResult = signal(false);
  lastResultMissed = signal(false);
  isZoomed = signal(false);
  zoomImageUrl = signal('');

  // Gamification: Combo & Performance Metrics
  combo = signal(0);
  highestCombo = signal(0);
  correctCount = signal(0);
  wrongCount = signal(0);
  hardCount = signal(0);
  bountyCardsDefeated = signal(0);
  sessionStartTime = signal(Date.now());
  sessionEndTime = signal(Date.now());

  // Confetti particles for Inbox Zero
  confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animDelay: Math.random() * 2,
    color: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#EF4444'][Math.floor(Math.random() * 6)]
  }));

  comboMultiplier = computed(() => {
    const c = this.combo();
    if (c >= 10) return '2.0x XP';
    if (c >= 5) return '1.5x XP';
    if (c >= 3) return '1.2x XP';
    return null;
  });

  comboTier = computed<'none' | 'streak' | 'foco_quente' | 'em_chamas'>(() => {
    const c = this.combo();
    if (c >= 10) return 'em_chamas';
    if (c >= 5) return 'foco_quente';
    if (c >= 3) return 'streak';
    return 'none';
  });

  // Session Statistics
  sessionStats = computed(() => {
    const total = this.correctCount() + this.wrongCount();
    const durationSeconds = Math.max(1, Math.round((this.sessionEndTime() - this.sessionStartTime()) / 1000));
    const avgSecondsPerCard = total > 0 ? (durationSeconds / total).toFixed(1) : '0';
    const accuracy = total > 0 ? Math.round((this.correctCount() / total) * 100) : 0;
    const bonusXp = (this.correctCount() * 10) + (this.highestCombo() * 15) + (this.bountyCardsDefeated() * 50);

    return {
      totalCards: total,
      correctCount: this.correctCount(),
      accuracy,
      durationMinutes: Math.floor(durationSeconds / 60),
      durationSecondsRem: durationSeconds % 60,
      avgSecondsPerCard,
      highestCombo: this.highestCombo(),
      bounties: this.bountyCardsDefeated(),
      bonusXp
    };
  });

  constructor() {
    // Reset internal state whenever a card is successfully rated
    this.actions$.pipe(
      ofType(FlashcardsActions.rateFlashcardSuccess),
      tap(() => this.resetState())
    ).subscribe();

    this.isSessionOver$.pipe(
      tap((over) => {
        if (over) {
          this.sessionEndTime.set(Date.now());
        }
      })
    ).subscribe();
  }

  handleCardClick(event: MouseEvent) {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    
    // Se clicou numa imagem, abre o zoom e não vira o card
    if (target.tagName === 'IMG') {
      this.zoomImageUrl.set((target as HTMLImageElement).src);
      this.isZoomed.set(true);
      return;
    }

    // Toggle flip (permite desvirar)
    this.isFlipped.update(v => !v);

    // Ao voltar para a frente, reseta o estado de resultado
    if (!this.isFlipped()) {
      this.hasResult.set(false);
      this.lastResultMissed.set(false);
    }
  }

  handleOverlayClick(event: MouseEvent) {
    if (this.isZoomed()) return;

    const target = event.target as HTMLElement;
    if (!target) return;

    const clickedInsideCard = target.closest('.flashcard');
    const clickedInsideHeader = target.closest('.header');
    const clickedInsideActions = target.closest('.actions');
    const clickedInsideZoom = target.closest('.zoom-backdrop');

    if (!clickedInsideCard && !clickedInsideHeader && !clickedInsideActions && !clickedInsideZoom) {
      this.close();
    }
  }

  closeZoom(event?: Event) {
    if (event) event.stopPropagation();
    this.isZoomed.set(false);
    this.zoomImageUrl.set('');
  }

  setResult(missed: boolean) {
    this.lastResultMissed.set(missed);
    this.hasResult.set(true);

    if (missed) {
      this.wrongCount.update(c => c + 1);
      this.combo.set(0); // Errou -> reseta combo
    }
  }

  rate(difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
    const card = this.currentCard();
    if (card) {
      if (difficulty === 'EASY' || difficulty === 'MEDIUM') {
        if (!this.lastResultMissed()) {
          this.combo.update(c => {
            const next = c + 1;
            if (next > this.highestCombo()) this.highestCombo.set(next);
            return next;
          });
          this.correctCount.update(c => c + 1);
          if (card.bountyCard) {
            this.bountyCardsDefeated.update(b => b + 1);
          }
        }
      } else {
        // Dificuldade Hard -> reseta combo
        this.hardCount.update(h => h + 1);
        this.combo.set(0);
      }

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
    this.combo.set(0);
    this.correctCount.set(0);
    this.wrongCount.set(0);
  }

  getProgress(index: number, total: number): number {
    if (total === 0) return 0;
    const safeIndex = Math.min(index, total);
    return (safeIndex / total) * 100;
  }
}
