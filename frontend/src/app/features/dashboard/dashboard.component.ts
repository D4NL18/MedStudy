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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
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
    // Moved to Shell
  }
}
