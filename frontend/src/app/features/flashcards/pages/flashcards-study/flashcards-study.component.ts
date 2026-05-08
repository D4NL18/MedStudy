import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule, X, RotateCw, Check, Clock, AlertTriangle } from 'lucide-angular';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';
import { selectQueue, selectCurrentIndex, selectStudyModeActive } from '../../../../store/flashcards/flashcards.reducer';
import { FlashcardDifficulty } from '../../../../core/models/flashcard.model';
import { MarkdownRendererComponent } from '../../../../shared/components/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-flashcards-study',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MarkdownRendererComponent],
  template: `
    <div class="study-overlay" *ngIf="active$ | async">
      <div class="header">
        <div class="progress-info">
          <span class="count">{{ (currentIndex$ | async)! + 1 }} / {{ (queue$ | async)?.length }}</span>
          <div class="progress-bar">
            <div class="fill" [style.width.%]="getProgress((currentIndex$ | async)!, (queue$ | async)?.length || 0)"></div>
          </div>
        </div>
        <button class="close-btn" (click)="close()">
          <lucide-icon name="x" [size]="24"></lucide-icon>
        </button>
      </div>

      <div class="card-container" *ngIf="currentCard$ | async as card">
        <div class="flashcard" [class.is-flipped]="isFlipped()" (click)="flip()">
          <div class="card-face front">
            <div class="card-label">FRENTE</div>
            <app-markdown-renderer [data]="card.frente"></app-markdown-renderer>
            <div class="flip-hint">
              <lucide-icon name="rotate-cw" [size]="16"></lucide-icon>
              Clique para girar
            </div>
          </div>
          <div class="card-face back">
            <div class="card-label">VERSO</div>
            <app-markdown-renderer [data]="card.verso"></app-markdown-renderer>
          </div>
        </div>
      </div>

      <div class="actions" *ngIf="isFlipped()">
        <button class="diff-btn easy" (click)="rate('EASY')">
          <lucide-icon name="check" [size]="24"></lucide-icon>
          <span>Fácil</span>
        </button>
        <button class="diff-btn medium" (click)="rate('MEDIUM')">
          <lucide-icon name="clock" [size]="24"></lucide-icon>
          <span>Médio</span>
        </button>
        <button class="diff-btn hard" (click)="rate('HARD')">
          <lucide-icon name="alert-triangle" [size]="24"></lucide-icon>
          <span>Difícil</span>
        </button>
      </div>

      <div class="no-cards" *ngIf="(queue$ | async)?.length === 0">
        <h3>Sessão Finalizada!</h3>
        <p>Você revisou todos os cartões de hoje.</p>
        <button class="finish-btn" (click)="close()">Voltar</button>
      </div>
    </div>
  `,
  styles: [`
    .study-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(20px);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      padding: var(--spacing-xl);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-2xl);
    }

    .progress-info {
      flex: 1;
      max-width: 400px;
      .count { font-size: 0.875rem; color: white; display: block; margin-bottom: 8px; }
      .progress-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        .fill { height: 100%; background: var(--color-primary); transition: width 0.3s ease; }
      }
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      opacity: 0.6;
      transition: opacity 0.2s;
      &:hover { opacity: 1; }
    }

    .card-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1500px;
    }

    .flashcard {
      width: 100%;
      max-width: 600px;
      height: 400px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &.is-flipped {
        transform: rotateY(180deg);
      }
    }

    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      background: var(--color-surface);
      border-radius: 32px;
      padding: var(--spacing-3xl);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);

      .card-label {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 2px;
        color: var(--color-primary);
        margin-bottom: var(--spacing-xl);
      }

      &.back {
        transform: rotateY(180deg);
      }
    }

    .flip-hint {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      opacity: 0.5;
    }

    .actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      max-width: 800px;
      margin: var(--spacing-2xl) auto 0;
      width: 100%;
    }

    .diff-btn {
      height: 80px;
      border-radius: 20px;
      border: none;
      color: white;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover { transform: scale(1.05); }

      &.easy { background: #10B981; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); }
      &.medium { background: #F59E0B; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); }
      &.hard { background: #EF4444; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); }
    }

    .no-cards {
      text-align: center;
      color: white;
      margin-top: 100px;
      h3 { font-size: 2rem; margin-bottom: 16px; }
      p { color: rgba(255,255,255,0.6); margin-bottom: 32px; }
      .finish-btn {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
      }
    }

    @media (max-width: 640px) {
      .study-overlay { padding: var(--spacing-md); }
      .flashcard { height: 350px; }
      .actions { gap: var(--spacing-sm); }
      .diff-btn { height: 70px; font-size: 0.875rem; }
    }
  `]
})
export class FlashcardsStudyComponent {
  private store = inject(Store);
  
  active$ = this.store.select(selectStudyModeActive);
  queue$ = this.store.select(selectQueue);
  currentIndex$ = this.store.select(selectCurrentIndex);
  
  currentCard$ = this.store.select(state => {
    const queue = selectQueue(state);
    const index = selectCurrentIndex(state);
    return queue[index];
  });

  isFlipped = signal(false);

  flip() {
    this.isFlipped.set(!this.isFlipped());
  }

  rate(difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
    this.currentCard$.subscribe(card => {
      if (card) {
        this.store.dispatch(FlashcardsActions.rateFlashcard({
          rating: { flashcardId: card.id, dificuldade: difficulty as FlashcardDifficulty }
        }));
        this.isFlipped.set(false);
      }
    }).unsubscribe();
  }

  close() {
    this.store.dispatch(FlashcardsActions.closeStudyMode());
    this.isFlipped.set(false);
  }

  getProgress(index: number, total: number): number {
    if (total === 0) return 0;
    return (index / total) * 100;
  }
}
