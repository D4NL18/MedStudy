import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';
import { selectAllCards, selectSummary, selectLoading } from '../../../../store/flashcards/flashcards.reducer';

@Component({
  selector: 'app-flashcards-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, MatDialogModule],
  templateUrl: './flashcards-list.component.html',
  styleUrl: './flashcards-list.component.scss'
})
export class FlashcardsListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  
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

  deleteCard(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Flashcard',
        message: 'Tem certeza que deseja excluir este flashcard permanentemente?',
        confirmText: 'Excluir',
        isDelete: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(FlashcardsActions.deleteFlashcard({ id }));
      }
    });
  }

  getDifficultyClass(difficulty: string): string {
    return difficulty?.toLowerCase() || '';
  }

  formatPreview(content: any): string {
    if (!content) return '';
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    return text.replace(/!\[image\]\(.*?\)/g, '🖼️');
  }
}
