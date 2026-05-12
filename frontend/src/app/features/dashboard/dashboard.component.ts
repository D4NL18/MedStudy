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
import { DistributionChartComponent } from './components/distribution-chart/distribution-chart.component';
import { TopErrorsRankingComponent } from './components/top-errors-ranking/top-errors-ranking.component';
import { SubareaModalComponent } from './components/subarea-modal/subarea-modal.component';
import { LucideAngularModule } from 'lucide-angular';
import { ExportService } from '../../core/services/export/export.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    EvolutionChartComponent, 
    DistributionChartComponent,
    TopErrorsRankingComponent,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  public themeService = inject(ThemeService);
  public perfTheme = inject(PerformanceThemeService);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  
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

  async exportPdf() {
    const charts: { [key: string]: string } = {};
    const chartElements = ['evolution-chart', 'distribution-chart'];

    for (const id of chartElements) {
      const element = document.getElementById(id);
      if (element) {
        // Force fixed width before capture so the layout doesn't get squashed
        const originalWidth = element.style.width;
        element.style.width = '800px';
        
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff', // Force white background for PDF readability
          scale: 2
        });
        
        element.style.width = originalWidth;
        charts[id] = canvas.toDataURL('image/png');
      }
    }

    this.exportService.exportPdf('Relatório de Desempenho - MedStudy', charts).subscribe(blob => {
      this.exportService.downloadFile(blob, 'relatorio-medstudy.pdf');
    });
  }

  exportCsv() {
    // No specific filters for dashboard global export
    this.exportService.exportCsv({}).subscribe(blob => {
      this.exportService.downloadFile(blob, 'historico-sessoes.csv');
    });
  }
}
