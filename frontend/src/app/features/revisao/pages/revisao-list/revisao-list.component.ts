import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule, Calendar, Clock, CheckCircle, Play, AlertCircle } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { RevisionActions } from '../../../../store/revision/revision.actions';
import { selectSessions, selectSummary, selectLoading } from '../../../../store/revision/revision.reducer';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';

type RevisionTab = 'ATRASADAS' | 'HOJE' | 'FUTURAS' | 'CONCLUIDAS';

@Component({
  selector: 'app-revisao-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  template: `
    <div class="revisao-container">
      <div class="header">
        <div class="title-row">
          <h1>Minhas Revisões</h1>
          <button class="create-btn" routerLink="/flashcards/novo">
            <span>+ Novo Flashcard</span>
          </button>
        </div>
        <p>Mantenha seu conhecimento fresco com a técnica de repetição espaçada.</p>
      </div>

      <div class="tabs-wrapper" *ngIf="summary$ | async as summary">
        <div class="tabs">
          <button *ngFor="let tab of tabs" 
                  [class.active]="activeTab === tab.id"
                  (click)="setActiveTab(tab.id)">
            <span>{{ tab.label }}</span>
            <span class="badge" [class.pulse]="tab.id === 'ATRASADAS' && summary.atrasadas > 0"
                  [ngClass]="tab.id.toLowerCase()">
              {{ getCount(tab.id, summary) }}
            </span>
          </button>
        </div>
        <div class="tab-indicator" [style.left.%]="getIndicatorPos()"></div>
      </div>

      <div class="sessions-list" *ngIf="!(loading$ | async); else loading">
        <div class="session-card" *ngFor="let session of sessions$ | async">
          <div class="session-info">
            <span class="area">{{ session.grandeArea }}</span>
            <h3>{{ session.tema }}</h3>
            <div class="meta">
              <span><lucide-icon name="calendar" [size]="14"></lucide-icon> {{ session.dataSessao | date:'dd/MM' }}</span>
              <span><lucide-icon name="clock" [size]="14"></lucide-icon> Próxima: {{ session.dataProximaRevisao | date:'dd/MM' }}</span>
            </div>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="val">{{ session.qtsFeitas }}</span>
              <span class="lab">Questões</span>
            </div>
            <div class="stat">
              <span class="val">{{ getAccuracy(session) }}%</span>
              <span class="lab">Acerto</span>
            </div>
          </div>

          <button class="action-btn" (click)="startRevision(session.id)" 
                  [disabled]="session.revisaoConcluida">
            <lucide-icon [name]="session.revisaoConcluida ? 'check-circle' : 'play'" [size]="18"></lucide-icon>
            <span>{{ session.revisaoConcluida ? 'Concluída' : 'Revisar Agora' }}</span>
          </button>
        </div>

        <div class="empty-state" *ngIf="(sessions$ | async)?.length === 0">
          <lucide-icon name="alert-circle" [size]="48"></lucide-icon>
          <h3>Nada para revisar por aqui!</h3>
          <p>Que tal iniciar uma nova sessão de estudos ou adicionar novos flashcards?</p>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Carregando revisões...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .revisao-container {
      padding: var(--spacing-xl);
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: var(--spacing-2xl);
      h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 2.5rem;
        margin-bottom: var(--spacing-xs);
        color: var(--color-text);
      }
      p { color: var(--color-text-secondary); }

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .create-btn {
        background: var(--color-primary-soft);
        color: var(--color-primary);
        border: none;
        padding: 10px 20px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover { background: var(--color-primary); color: white; }
      }
    }

    .tabs-wrapper {
      position: relative;
      margin-bottom: var(--spacing-xl);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .tabs {
      display: flex;
      gap: var(--spacing-xl);
      
      button {
        background: none;
        border: none;
        padding: var(--spacing-md) 0;
        color: var(--color-text-secondary);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: color 0.3s ease;
        position: relative;

        &.active { color: var(--color-primary); }

        .badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: white;

          &.atrasadas { background: #EF4444; }
          &.hoje { background: #10B981; }
          
          &.pulse {
            animation: pulse-red 2s infinite;
          }
        }
      }
    }

    .tab-indicator {
      position: absolute;
      bottom: -1px;
      height: 2px;
      width: 25%;
      background: var(--color-primary);
      transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .session-card {
      background: var(--color-surface);
      border-radius: 16px;
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: transform 0.2s ease;

      &:hover { transform: scale(1.01); }
    }

    .session-info {
      flex: 1;
      .area { font-size: 0.75rem; color: var(--color-primary); text-transform: uppercase; }
      h3 { font-size: 1.125rem; margin: 4px 0; font-family: 'Outfit', sans-serif; }
      .meta {
        display: flex;
        gap: 12px;
        font-size: 0.813rem;
        color: var(--color-text-secondary);
        span { display: flex; align-items: center; gap: 4px; }
      }
    }

    .stats {
      display: flex;
      gap: var(--spacing-lg);
      text-align: center;
      .stat {
        .val { display: block; font-size: 1.125rem; font-weight: 700; color: var(--color-text); }
        .lab { font-size: 0.75rem; color: var(--color-text-secondary); }
      }
    }

    .action-btn {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(255, 255, 255, 0.05); color: var(--color-text-secondary); }
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-3xl) 0;
      color: var(--color-text-secondary);
      lucide-icon { margin-bottom: var(--spacing-md); opacity: 0.5; }
      h3 { color: var(--color-text); margin-bottom: 8px; }
    }

    .loading-state {
      text-align: center;
      padding: var(--spacing-3xl);
      .spinner { margin: 0 auto var(--spacing-md); width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; }
    }

    @keyframes pulse-red {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
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
    // This will connect to Wave 3 Study Mode
    this.store.dispatch(FlashcardsActions.loadStudyQueue());
  }
}
