import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { selectAllSessions, selectBancoLoading, selectBancoFilters, selectBancoTotalCount } from '../../../../store/banco/banco.selectors';
import * as BancoActions from '../../../../store/banco/banco.actions';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuestionSession, QuestionSessionFilters } from '../../../../core/models/question-session.model';
import { SessionModalComponent } from '../../components/session-modal/session-modal.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ExportService } from '../../../../core/services/export/export.service';

@Component({
  selector: 'app-banco-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatPaginatorModule],
  templateUrl: './banco-list.component.html',
  styleUrl: './banco-list.component.scss'
})
export class BancoListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private searchSubject = new Subject<string>();

  sessions = this.store.selectSignal<QuestionSession[]>(selectAllSessions);
  loading = this.store.selectSignal<boolean>(selectBancoLoading);
  filters = this.store.selectSignal<QuestionSessionFilters>(selectBancoFilters);
  totalCount = this.store.selectSignal<number>(selectBancoTotalCount);

  ngOnInit() {
    this.loadInitial();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.store.dispatch(BancoActions.updateFilters({ 
        filters: { tema: term, page: 0 } 
      }));
      this.loadInitial();
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  loadInitial() {
    this.store.dispatch(BancoActions.loadSessions({ 
      filters: this.filters(), 
      append: false 
    }));
  }

  onPageChange(event: any) {
    const filters = { ...this.filters(), page: event.pageIndex, size: event.pageSize };
    this.store.dispatch(BancoActions.updateFilters({ filters }));
    this.store.dispatch(BancoActions.loadSessions({ 
      filters, 
      append: false 
    }));
  }

  openCreateModal() {
    this.dialog.open(SessionModalComponent, {
      width: '600px',
      panelClass: 'glass-modal-panel',
      backdropClass: 'blur-backdrop'
    });
  }

  openEditModal(session: QuestionSession) {
    this.dialog.open(SessionModalComponent, {
      width: '600px',
      panelClass: 'glass-modal-panel',
      backdropClass: 'blur-backdrop',
      data: { session }
    });
  }


  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'glass-modal-panel',
      backdropClass: 'blur-backdrop',
      data: {
        title: 'Excluir Sessão',
        message: 'Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        isDelete: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(BancoActions.deleteSession({ id }));
      }
    });
  }

  getPerformanceClass(accuracy: number) {
    if (accuracy >= 80) return 'high';
    if (accuracy >= 70) return 'mid';
    return 'low';
  }

  exportCsv() {
    const filters = this.filters();
    this.exportService.exportCsv(filters).subscribe(blob => {
      this.exportService.downloadFile(blob, 'banco-questoes.csv');
    });
  }
}
