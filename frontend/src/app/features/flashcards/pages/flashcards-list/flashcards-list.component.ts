import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FlashcardResetModalComponent } from '@features/flashcards/components/reset-modal/flashcard-reset-modal.component';
import { FlashcardsActions } from '@store/flashcards/flashcards.actions';
import { selectAllCards, selectSummary, selectLoading, selectTotalElements } from '@store/flashcards/flashcards.reducer';

@Component({
  selector: 'app-flashcards-list',
  standalone: true,
  imports: [ButtonComponent, CommonModule, LucideAngularModule, RouterLink, MatDialogModule, MatPaginatorModule],
  templateUrl: './flashcards-list.component.html',
  styleUrl: './flashcards-list.component.scss'
})
export class FlashcardsListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  
  cards$ = this.store.select(selectAllCards);
  summary$ = this.store.select(selectSummary);
  loading$ = this.store.select(selectLoading);
  totalElements$ = this.store.select(selectTotalElements);

  pageSize = 10;
  pageIndex = 0;

  ngOnInit() {
    this.loadCards();
    this.store.dispatch(FlashcardsActions.loadSummary());
  }

  loadCards() {
    this.store.dispatch(FlashcardsActions.loadFlashcards({ page: this.pageIndex, size: this.pageSize }));
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCards();
  }

  resetProgress(grandeArea?: string) {
    const dialogRef = this.dialog.open(FlashcardResetModalComponent, {
      data: { grandeArea },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(FlashcardsActions.resetProgress({ grandeArea }));
      }
    });
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
    let text = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Parse TipTap JSON
    if (typeof content === 'string' && content.trim().startsWith('{"type":"doc"')) {
      try {
        const json = JSON.parse(content);
        text = this.extractTextFromTipTap(json);
      } catch (e) {}
    } else if (typeof content === 'object' && content.type === 'doc') {
      text = this.extractTextFromTipTap(content);
    }
    
    return text.replace(/!\[image\]\(.*?\)/g, '🖼️').replace(/<img[^>]*>/gi, '🖼️');
  }

  private extractTextFromTipTap(node: any): string {
    if (!node) return '';
    if (node.type === 'text') return node.text || '';
    if (node.type === 'image') return '🖼️';
    if (node.content && Array.isArray(node.content)) {
      return node.content.map((c: any) => this.extractTextFromTipTap(c)).join(' ');
    }
    return '';
  }

  isAvailable(card: any): boolean {
    if (!card.proximaRevisao) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const revisionDate = new Date(card.proximaRevisao);
    return revisionDate <= today;
  }
}
