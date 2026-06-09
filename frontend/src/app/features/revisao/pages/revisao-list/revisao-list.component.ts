import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { RevisionActions } from '../../../../store/revision/revision.actions';
import { selectSessions, selectSummary, selectLoading } from '../../../../store/revision/revision.reducer';
import { RevisionService } from '../../../../core/services/revision.service';

type RevisionTab = 'ATRASADAS' | 'HOJE' | 'FUTURAS' | 'CONCLUIDAS';

@Component({
  selector: 'app-revisao-list',
  standalone: true,
  imports: [
    CommonModule, 
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
