import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { PerformanceThemeService } from '../../core/services/performance-theme.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { selectDashboardKPIs, selectDashboardLoading, selectAreaAnalytics } from '../../store/dashboard/dashboard.selectors';
import * as DashboardActions from '../../store/dashboard/dashboard.actions';
import { AreaAnalytics } from '../../store/dashboard/dashboard.actions';
import { EvolutionChartComponent } from './components/evolution-chart/evolution-chart.component';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import { DistributionChartComponent } from './components/distribution-chart/distribution-chart.component';
import { TopErrorsRankingComponent } from './components/top-errors-ranking/top-errors-ranking.component';
import { SubareaModalComponent } from './components/subarea-modal/subarea-modal.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    EvolutionChartComponent, 
    AreaChartComponent, 
    DistributionChartComponent,
    TopErrorsRankingComponent,
    MatDialogModule,
    RouterLink, 
    RouterLinkActive
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  public themeService = inject(ThemeService);
  public perfTheme = inject(PerformanceThemeService);
  private dialog = inject(MatDialog);
  
  user = this.store.selectSignal(selectUser);
  kpis = toSignal(this.store.select(selectDashboardKPIs));
  loading = toSignal(this.store.select(selectDashboardLoading));
  areaAnalytics = toSignal(this.store.select(selectAreaAnalytics));
  
  themes: AppTheme[] = ['verde', 'azul', 'rosa', 'roxo', 'laranja', 'vermelho', 'claro', 'escuro'];

  topLessons = [
    { tema: 'Puericultura', grandeArea: 'Pediatria', prioridade: 'Alta' },
    { tema: 'Hemorragias', grandeArea: 'GO', prioridade: 'Alta' },
    { tema: 'Antibióticos', grandeArea: 'Clínica Médica', prioridade: 'Média' }
  ];

  ngOnInit() {
    this.store.dispatch(DashboardActions.loadDashboard());
  }

  changeTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
  }

  openSubareaDetails(area: AreaAnalytics) {
    this.dialog.open(SubareaModalComponent, {
      data: { area },
      width: '800px',
      panelClass: 'custom-dialog-container'
    });
  }

  logout() {
    // Moved to Shell
  }
}
