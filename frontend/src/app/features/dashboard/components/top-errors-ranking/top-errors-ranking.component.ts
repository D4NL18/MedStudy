import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-top-errors-ranking',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="ranking-container glass">
      <header class="ranking-header">
        <h2>🚨 Temas com Maior Taxa de Erro</h2>
        <div class="filter-toggle">
          <button [class.active]="period() === 'LAST_60_DAYS'" (click)="setPeriod('LAST_60_DAYS')">60d</button>
          <button [class.active]="period() === 'TOTAL'" (click)="setPeriod('TOTAL')">Total</button>
        </div>
      </header>

      <div class="ranking-list">
        @if (loading()) {
          <div class="loading">Analisando histórico...</div>
        } @else {
          @for (item of errors(); track item.tema; let i = $index) {
            <div class="ranking-item">
              <div class="rank-number">{{ i + 1 }}</div>
              <div class="item-info">
                <span class="tema">{{ item.tema }}</span>
                <span class="area">{{ item.grandeArea }}</span>
              </div>
              <div class="item-stats">
                <span class="error-rate">{{ item.errorRate | number:'1.0-0' }}% erro</span>
                <span class="total">{{ item.totalQuestions }} questões</span>
              </div>
              <div class="progress-bar">
                <div class="fill" [style.width]="item.errorRate + '%'"></div>
              </div>
            </div>
          } @empty {
            <div class="empty">Nenhum erro crítico detectado no período.</div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .ranking-container { padding: 20px; border-radius: 16px; height: 100%; display: flex; flex-direction: column; }
    .ranking-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .ranking-header h2 { margin: 0; font-size: 16px; font-weight: 600; }
    
    .filter-toggle { display: flex; background: rgba(0,0,0,0.2); border-radius: 20px; padding: 2px; }
    .filter-toggle button { 
      background: none; border: none; color: var(--color-text); padding: 4px 12px; 
      border-radius: 18px; font-size: 11px; cursor: pointer; opacity: 0.6; transition: all 0.2s;
    }
    .filter-toggle button.active { background: var(--color-primary); opacity: 1; }

    .ranking-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .ranking-item { display: grid; grid-template-columns: 32px 1fr auto; grid-template-rows: auto auto; gap: 4px 12px; align-items: center; }
    
    .rank-number { grid-row: 1 / 3; font-size: 18px; font-weight: 800; opacity: 0.5; }
    .item-info { display: flex; flex-direction: column; }
    .tema { font-size: 14px; font-weight: 500; }
    .area { font-size: 11px; opacity: 0.7; }
    
    .item-stats { text-align: right; display: flex; flex-direction: column; }
    .error-rate { color: var(--color-error); font-weight: 700; font-size: 13px; }
    .total { font-size: 10px; opacity: 0.7; }
    
    .progress-bar { grid-column: 2 / 4; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
    .progress-bar .fill { height: 100%; background: var(--color-error); opacity: 0.6; border-radius: 2px; }

    .loading, .empty { padding: 40px; text-align: center; opacity: 0.5; font-size: 13px; }
  `]
})
export class TopErrorsRankingComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  
  errors = signal<any[]>([]);
  loading = signal(true);
  period = signal('LAST_60_DAYS');

  ngOnInit() {
    this.loadData();
  }

  setPeriod(p: string) {
    this.period.set(p);
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.analyticsService.getTopErrors(this.period()).subscribe(data => {
      this.errors.set(data);
      this.loading.set(false);
    });
  }
}
