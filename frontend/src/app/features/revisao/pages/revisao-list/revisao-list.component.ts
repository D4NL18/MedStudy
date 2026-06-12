import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { RevisionActions } from '@store/revision/revision.actions';
import { selectSessions, selectSummary, selectLoading, selectCurrentPage, selectTotalPages, selectPageSize, selectTotalElements } from '@store/revision/revision.reducer';
import { RevisionService } from '@core/services/revision.service';


/**
 * Angular component for the Revisao List feature.
 * @description Handles the presentation logic and user interactions for the Revisao List view.
 */
type RevisionTab = 'ATRASADAS' | 'HOJE' | 'FUTURAS' | 'CONCLUIDAS';

@Component({
  selector: 'app-revisao-list',
  standalone: true,
  imports: [ButtonComponent, 
    CommonModule, 
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './revisao-list.component.html',
  styleUrl: './revisao-list.component.scss'
})
export class RevisaoListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private revisionService = inject(RevisionService);
  
  summary$ = this.store.select(selectSummary);
  sessions$ = this.store.select(selectSessions);
  loading$ = this.store.select(selectLoading);
  currentPage$ = this.store.select(selectCurrentPage);
  totalPages$ = this.store.select(selectTotalPages);
  pageSize$ = this.store.select(selectPageSize);
  totalElements$ = this.store.select(selectTotalElements);

  searchControl = new FormControl('');

  activeTab: RevisionTab = 'HOJE';
  tabs: { id: RevisionTab, label: string }[] = [
    { id: 'ATRASADAS', label: 'Atrasadas' },
    { id: 'HOJE', label: 'Hoje' },
    { id: 'FUTURAS', label: 'Futuras' },
    { id: 'CONCLUIDAS', label: 'Realizadas' }
  ];

  ngOnInit() {
    this.store.dispatch(RevisionActions.loadSummary());
    this.loadSessions();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.store.dispatch(RevisionActions.loadSessions({ 
        filter: this.activeTab, 
        page: 0, 
        search: searchTerm || '' 
      }));
    });
  }

  setActiveTab(tab: RevisionTab) {
    this.activeTab = tab;
    this.searchControl.setValue('', { emitEvent: false });
    this.store.dispatch(RevisionActions.loadSessions({ 
      filter: this.activeTab, 
      page: 0, 
      search: '' 
    }));
  }

  loadSessions() {
    this.store.dispatch(RevisionActions.loadSessions({ 
      filter: this.activeTab, 
      page: 0, 
      search: this.searchControl.value || '' 
    }));
  }

  changePage(newPage: number) {
    this.store.dispatch(RevisionActions.loadSessions({ 
      filter: this.activeTab, 
      page: newPage,
      search: this.searchControl.value || '' 
    }));
  }

  getIndicatorPos(): number {
    return this.tabs.findIndex(t => t.id === this.activeTab) * 25;
  }

  getCount(tabId: RevisionTab, summary: any): number {
    switch(tabId) {
      case 'ATRASADAS': return summary.atrasadas;
      case 'HOJE': return summary.hoje;
      case 'FUTURAS': return summary.futuras;
      case 'CONCLUIDAS': return summary.concluidas;
    }
  }

  getAccuracy(session: any): number {
    if (session.qtsFeitas === 0) return 0;
    return Math.round((session.qtsCorretas / session.qtsFeitas) * 100);
  }

  startRevision(session: any) {
    if (session.id && !session.revisaoConcluida) {
      this.revisionService.concluirRevisao(session.id).subscribe(() => {
        this.store.dispatch(RevisionActions.loadSummary());
        this.loadSessions();
      });
    }
  }

  getTabIcon(tab: RevisionTab): string {
    switch(tab) {
      case 'ATRASADAS': return 'alert-circle';
      case 'HOJE': return 'clock';
      case 'FUTURAS': return 'calendar';
      case 'CONCLUIDAS': return 'check-circle';
    }
  }

  getTabLabel(tab: RevisionTab): string {
    switch(tab) {
      case 'ATRASADAS': return 'Revisões Atrasadas';
      case 'HOJE': return 'Para Revisar Hoje';
      case 'FUTURAS': return 'Revisões Futuras';
      case 'CONCLUIDAS': return 'Realizadas';
    }
  }
}
