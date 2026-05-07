import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectTopicAnalytics, selectAnalyticsLoading } from '../../../../store/analytics/analytics.selectors';
import { loadTopicAnalytics } from '../../../../store/analytics/analytics.actions';

@Component({
  selector: 'app-analise-tema',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-page">
      <header>
        <h2>Desempenho por Tema</h2>
        <p>Visão granular do seu conhecimento em cada tópico.</p>
      </header>

      <div class="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Tema</th>
              <th>Área</th>
              <th>Questões</th>
              <th>Acerto (%)</th>
              <th>Sessões</th>
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <tr *ngFor="let i of [1,2,3,4,5]">
                <td colspan="5"><div class="skeleton-row"></div></td>
              </tr>
            } @else {
              <tr *ngFor="let topic of topics()">
                <td class="theme-name">{{ topic.tema }}</td>
                <td><span class="badge">{{ topic.grandeArea }}</span></td>
                <td>{{ topic.totalQuestions }}</td>
                <td>
                  <div class="accuracy-cell">
                    <div class="progress-bar">
                      <div class="fill" [style.width.%]="topic.accuracy" [class]="getAccClass(topic.accuracy)"></div>
                    </div>
                    <span>{{ topic.accuracy }}%</span>
                  </div>
                </td>
                <td>{{ topic.sessionsCount }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.5s ease; }
    h2 { margin: 0; font-size: 1.5rem; }

    .table-container {
      overflow-x: auto;
      border-radius: 20px;
      padding: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: var(--color-text);
      
      th { text-align: left; padding: 16px; font-size: 0.85rem; opacity: 0.6; font-weight: 600; }
      td { padding: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
      
      tr:hover td { background: rgba(255,255,255,0.02); }
    }

    .theme-name { font-weight: 600; }
    .badge { 
      background: rgba(255,255,255,0.05); 
      padding: 4px 10px; 
      border-radius: 6px; 
      font-size: 0.75rem; 
      white-space: nowrap;
    }

    .accuracy-cell { display: flex; align-items: center; gap: 12px; }
    .progress-bar { width: 100px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
    .fill { height: 100%; transition: width 1s ease-in-out; }
    
    .bg-high { background: #10b981; }
    .bg-mid { background: #f59e0b; }
    .bg-low { background: #ef4444; }

    .glass { background: var(--color-surface-glass); backdrop-filter: blur(8px); border: 1px solid var(--color-border); }
    .skeleton-row { height: 20px; background: rgba(255,255,255,0.05); border-radius: 4px; animation: pulse 1.5s infinite; }
    @keyframes pulse { 50% { opacity: 0.3; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AnaliseTemaComponent implements OnInit {
  private store = inject(Store);
  
  topics = this.store.selectSignal(selectTopicAnalytics);
  loading = this.store.selectSignal(selectAnalyticsLoading);

  ngOnInit() {
    this.store.dispatch(loadTopicAnalytics());
  }

  getAccClass(acc: number) {
    if (acc >= 80) return 'bg-high';
    if (acc >= 70) return 'bg-mid';
    return 'bg-low';
  }
}
