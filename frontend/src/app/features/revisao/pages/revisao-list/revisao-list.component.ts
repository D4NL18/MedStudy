import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { RevisionActions } from '../../../../store/revision/revision.actions';
import { selectSessions, selectSummary, selectLoading } from '../../../../store/revision/revision.reducer';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';

type RevisionTab = 'ATRASADAS' | 'HOJE' | 'FUTURAS' | 'CONCLUIDAS';

@Component({
  selector: 'app-revisao-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './revisao-list.component.html',
  styleUrl: './revisao-list.component.scss'
})
export class RevisaoListComponent implements OnInit {
  private store = inject(Store);
  
  summary$ = this.store.select(selectSummary);
  sessions$ = this.store.select(selectSessions);
  loading$ = this.store.select(selectLoading);

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
  }

  setActiveTab(tab: RevisionTab) {
    this.activeTab = tab;
    this.loadSessions();
  }

  loadSessions() {
    this.store.dispatch(RevisionActions.loadSessions({ filter: this.activeTab }));
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

  startRevision(sessionId: string) {
    this.store.dispatch(FlashcardsActions.loadStudyQueue());
  }
}
