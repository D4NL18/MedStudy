import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { selectDashboardKPIs, selectDashboardLoading } from '../../store/dashboard/dashboard.selectors';
import { loadDashboard } from '../../store/dashboard/dashboard.actions';
import { EvolutionChartComponent } from './components/evolution-chart/evolution-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EvolutionChartComponent],
  template: `
    <div class="dashboard-shell">
      <nav class="glass">
        <div class="logo">
          <span class="brand">MedStudy</span>
          <div class="dot"></div>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <span class="initials">{{ user()?.nome?.charAt(0) || 'E' }}</span>
          </div>
          <span class="user-name">Olá, {{ user()?.nome || 'Estudante' }}</span>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </nav>
      
      <main class="fade-in">
        <header>
          <h1>Resumo de Desempenho</h1>
          <p>Seu sistema de estudos inteligente está pronto para hoje.</p>
        </header>

        @if (loading()) {
          <div class="skeleton-grid">
            <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
          </div>
        } @else if (kpis()) {
          <div class="kpi-grid">
            <div class="kpi-card glass highlight">
              <div class="kpi-label">Taxa Global</div>
              <div class="kpi-value text-accent">{{ kpis()?.sessions?.accuracy }}%</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Questões (Mês)</div>
              <div class="kpi-value">{{ kpis()?.sessions?.completed }}</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Streak Atual</div>
              <div class="kpi-value">🔥 {{ kpis()?.currentStreak }}</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Ponto Forte</div>
              <div class="kpi-value small">{{ kpis()?.strongArea }}</div>
            </div>
          </div>

          <div class="main-stats-grid">
            <section class="chart-section glass">
              <div class="section-header">
                <h3>📈 Evolução Mensal</h3>
                <p>Percentual de acertos ao longo do tempo.</p>
              </div>
              <app-evolution-chart></app-evolution-chart>
            </section>

            <section class="theme-playground glass">
              <div class="section-header">
                <h3>🎨 Personalização</h3>
                <p>Troque o tema instantaneamente.</p>
              </div>
              <div class="theme-grid">
                <button *ngFor="let t of themes" 
                        class="theme-card"
                        [class.active]="themeService.activeTheme() === t"
                        (click)="changeTheme(t)">
                  <div class="color-preview" [attr.data-theme]="t"></div>
                  <span>{{ t | titlecase }}</span>
                </button>
              </div>
            </section>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .dashboard-shell { 
      min-height: 100vh;
      background: var(--color-bg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 32px;
      color: var(--color-text);
    }

    nav { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 16px 32px; 
      border-radius: 20px;
      
      .logo {
        display: flex; align-items: baseline; gap: 2px;
        .brand { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
        .dot { width: 6px; height: 6px; background: var(--color-accent); border-radius: 50%; }
      }

      .user-info {
        display: flex; align-items: center; gap: 16px;
        .user-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--color-accent); display: flex; align-items: center; justify-content: center;
          .initials { font-weight: 700; font-size: 0.8rem; color: white; }
        }
        .user-name { font-size: 0.9rem; font-weight: 500; }
        .btn-logout {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text); padding: 6px 16px; border-radius: 8px; font-size: 0.8rem;
          cursor: pointer;
          &:hover { background: rgba(255, 77, 109, 0.1); color: #FF4D6D; }
        }
      }
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 32px;

      h1 { font-size: 2.25rem; margin: 0; }
      p { font-size: 1rem; opacity: 0.7; margin: 4px 0 0; }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      padding: 24px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: transform 0.3s ease;

      &:hover { transform: translateY(-5px); }
      &.highlight { border-left: 4px solid var(--color-accent); }
    }

    .kpi-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }
    .kpi-value { font-size: 1.75rem; font-weight: 800; }
    .kpi-value.small { font-size: 1.1rem; }
    .text-accent { color: var(--color-accent); }

    .main-stats-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    .chart-section, .theme-playground {
      padding: 24px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-header h3 { font-size: 1.25rem; margin: 0; }
    .section-header p { font-size: 0.85rem; }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 12px;
    }

    .theme-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover { background: rgba(255,255,255,0.06); }
      &.active { border-color: var(--color-accent); background: rgba(var(--color-accent-rgb), 0.1); }

      .color-preview {
        width: 100%;
        height: 30px;
        border-radius: 6px;
        background: var(--color-accent);
      }
      span { font-size: 0.75rem; font-weight: 600; }
    }

    .glass {
      background: var(--color-surface-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--color-border);
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .skeleton-card { height: 110px; background: rgba(255,255,255,0.05); border-radius: 20px; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.2; } }

    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  public themeService = inject(ThemeService);
  
  user = this.store.selectSignal(selectUser);
  kpis = this.store.selectSignal(selectDashboardKPIs);
  loading = this.store.selectSignal(selectDashboardLoading);
  
  themes: AppTheme[] = ['rosa', 'claro', 'escuro', 'verde', 'azul', 'vermelho', 'roxo', 'laranja'];

  ngOnInit() {
    this.store.dispatch(loadDashboard());
  }

  changeTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
