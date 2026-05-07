import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { selectDashboardKPIs, selectDashboardLoading } from '../../store/dashboard/dashboard.selectors';
import { loadDashboard } from '../../store/dashboard/dashboard.actions';
import { EvolutionChartComponent } from './components/evolution-chart/evolution-chart.component';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import { DistributionChartComponent } from './components/distribution-chart/distribution-chart.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    EvolutionChartComponent, 
    AreaChartComponent, 
    DistributionChartComponent,
    RouterLink, 
    RouterLinkActive
  ],
  template: `
    <div class="dashboard-shell">
      <nav class="glass main-nav">
        <div class="logo">
          <span class="brand">MedStudy</span>
          <div class="dot"></div>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/banco-questoes">Banco de Dados</a>
          <a routerLink="/simulados">Simulados</a>
          <a routerLink="/analytics/area">Análise</a>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <span class="initials">{{ user()?.nome?.charAt(0) || 'E' }}</span>
          </div>
          <span class="user-name">{{ user()?.nome || 'Estudante' }}</span>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </nav>
      
      <main class="fade-in">
        <header class="page-header">
          <div class="title-area">
            <h1>Dashboard de Performance</h1>
            <p>Seu sistema de estudos inteligente está pronto para hoje.</p>
          </div>
          <div class="progress-indicator glass">
            <div class="label">Progresso Teórico</div>
            <div class="value">29.2%</div>
            <div class="mini-bar"><div class="fill" style="width: 29.2%"></div></div>
          </div>
        </header>

        @if (loading()) {
          <div class="skeleton-grid">
            <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5]"></div>
          </div>
        } @else if (kpis()) {
          <div class="kpi-grid">
            <div class="kpi-card glass highlight">
              <div class="kpi-label">Taxa Global</div>
              <div class="kpi-value text-accent">{{ kpis()?.sessions?.accuracy || 0 }}%</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Questões (Mês/Ano)</div>
              <div class="kpi-value">{{ kpis()?.sessions?.completed || 0 }} <span class="divider">/</span> 1581</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Área Mais Forte</div>
              <div class="kpi-value small text-success">{{ kpis()?.strongArea || 'Pediatria' }}</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Área Mais Fraca</div>
              <div class="kpi-value small text-error">{{ kpis()?.weakArea || 'GO' }}</div>
            </div>
            <div class="kpi-card glass">
              <div class="kpi-label">Streak</div>
              <div class="kpi-value">🔥 {{ kpis()?.currentStreak || 0 }}</div>
            </div>
          </div>

          <div class="charts-layout">
            <section class="chart-box glass">
              <div class="box-header">
                <h3>📈 Evolução Mensal (%)</h3>
              </div>
              <app-evolution-chart></app-evolution-chart>
            </section>

            <section class="chart-box glass">
              <div class="box-header">
                <h3>📊 Desempenho por Área (%)</h3>
              </div>
              <app-area-chart></app-area-chart>
            </section>
          </div>

          <div class="bottom-layout">
            <section class="chart-box glass distribution">
              <div class="box-header">
                <h3>⭕ Distribuição de Questões</h3>
              </div>
              <app-distribution-chart></app-distribution-chart>
            </section>

            <section class="lessons-box glass">
              <div class="box-header">
                <h3>🚨 Top 5 Aulas Prioritárias</h3>
              </div>
              <div class="lessons-list">
                <div class="lesson-item" *ngFor="let lesson of topLessons">
                  <div class="lesson-info">
                    <span class="lesson-name">{{ lesson.tema }}</span>
                    <span class="lesson-area">{{ lesson.grandeArea }}</span>
                  </div>
                  <span class="priority-badge" [attr.data-priority]="lesson.prioridade">
                    {{ lesson.prioridade }}
                  </span>
                </div>
              </div>
            </section>

            <section class="theme-box glass">
              <div class="box-header">
                <h3>🎨 Personalização</h3>
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
      gap: 24px;
      color: var(--color-text);
    }

    .main-nav { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 12px 32px; 
      border-radius: 20px;
      
      .logo {
        display: flex; align-items: baseline; gap: 2px;
        .brand { font-size: 1.25rem; font-weight: 700; color: var(--color-text); }
        .dot { width: 5px; height: 5px; background: var(--color-accent); border-radius: 50%; }
      }

      .nav-links {
        display: flex; gap: 24px;
        a { 
          color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9rem; opacity: 0.6;
          &.active, &:hover { opacity: 1; color: var(--color-accent); }
        }
      }

      .user-info {
        display: flex; align-items: center; gap: 12px;
        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--color-accent); display: flex; align-items: center; justify-content: center;
          .initials { font-weight: 700; font-size: 0.75rem; color: white; }
        }
        .user-name { font-size: 0.85rem; font-weight: 500; }
        .btn-logout {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text); padding: 4px 12px; border-radius: 6px; font-size: 0.75rem;
          cursor: pointer;
          &:hover { background: rgba(255, 77, 109, 0.1); color: #FF4D6D; }
        }
      }
    }

    main {
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      h1 { font-size: 1.75rem; margin: 0; }
      p { font-size: 0.9rem; opacity: 0.6; margin: 4px 0 0; }
    }

    .progress-indicator {
      padding: 12px 20px;
      border-radius: 16px;
      width: 220px;
      .label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; opacity: 0.6; }
      .value { font-size: 1.25rem; font-weight: 800; color: var(--color-accent); margin: 2px 0; }
      .mini-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
      .fill { height: 100%; background: var(--color-accent); }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      padding: 20px;
      border-radius: 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      &.highlight { border-top: 3px solid var(--color-accent); }
    }

    .kpi-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.5; }
    .kpi-value { font-size: 1.5rem; font-weight: 800; .divider { opacity: 0.2; font-weight: 300; } }
    .kpi-value.small { font-size: 1rem; }
    .text-accent { color: var(--color-accent); }
    .text-success { color: #52B788; }
    .text-error { color: #FF4D6D; }

    .charts-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      @media (max-width: 1000px) { grid-template-columns: 1fr; }
    }

    .bottom-layout {
      display: grid;
      grid-template-columns: 1fr 1.2fr 1fr;
      gap: 24px;
      @media (max-width: 1200px) { grid-template-columns: 1fr 1fr; }
      @media (max-width: 800px) { grid-template-columns: 1fr; }
    }

    .chart-box, .lessons-box, .theme-box {
      padding: 20px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      h3 { font-size: 0.9rem; font-weight: 700; margin: 0; opacity: 0.9; }
    }

    .lessons-list { display: flex; flex-direction: column; gap: 8px; }
    .lesson-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px; background: rgba(255,255,255,0.02); border-radius: 10px;
      .lesson-info {
        display: flex; flex-direction: column; gap: 1px;
        .lesson-name { font-size: 0.8rem; font-weight: 600; }
        .lesson-area { font-size: 0.7rem; opacity: 0.5; }
      }
    }

    .priority-badge {
      font-size: 0.6rem; font-weight: 800; padding: 3px 6px; border-radius: 4px;
      &[data-priority="Diamante"] { background: rgba(157, 78, 221, 0.2); color: #9D4EDD; }
      &[data-priority="Alta"] { background: rgba(255, 133, 49, 0.2); color: #FF8531; }
    }

    .theme-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px;
    }
    .theme-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
      border-radius: 10px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 6px;
      color: var(--color-text); cursor: pointer;
      .color-preview { width: 100%; height: 24px; border-radius: 4px; background: var(--color-accent); }
      span { font-size: 0.65rem; font-weight: 600; }
      &.active { border-color: var(--color-accent); background: rgba(var(--color-accent-rgb), 0.05); }
    }

    .glass {
      background: var(--color-surface-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--color-border);
    }

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

  topLessons = [
    { tema: 'Determinação Social do Processo Saúde-Doença', grandeArea: 'Preventiva', prioridade: 'Diamante' },
    { tema: 'Trauma Abdominal Contuso', grandeArea: 'Cirurgia', prioridade: 'Alta' },
    { tema: 'Hemorragia Pós-Parto', grandeArea: 'GO', prioridade: 'Diamante' },
    { tema: 'Crise Hipertensiva', grandeArea: 'Clínica Médica', prioridade: 'Alta' }
  ];

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
