import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';
import { selectAllCards, selectSummary, selectLoading } from '../../../../store/flashcards/flashcards.reducer';

@Component({
  selector: 'app-flashcards-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './flashcards-list.component.html',
  styleUrl: './flashcards-list.component.scss'
})
export class FlashcardsListComponent implements OnInit {
  private store = inject(Store);
  
  cards$ = this.store.select(selectAllCards);
  summary$ = this.store.select(selectSummary);
  loading$ = this.store.select(selectLoading);

  ngOnInit() {
    this.store.dispatch(FlashcardsActions.loadFlashcards({}));
    this.store.dispatch(FlashcardsActions.loadSummary());
  }

  startStudy() {
    this.store.dispatch(FlashcardsActions.loadStudyQueue());
  }

  getDifficultyClass(difficulty: string): string {
    return difficulty?.toLowerCase() || '';
  }
}
