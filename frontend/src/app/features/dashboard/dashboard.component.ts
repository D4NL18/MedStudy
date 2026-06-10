import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUser } from '../../store/auth/auth.selectors';
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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    EvolutionChartComponent, 
    DistributionChartComponent,
    TopErrorsRankingComponent,
    MatDialogModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  public perfTheme = inject(PerformanceThemeService);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  
  user = this.store.selectSignal(selectUser);
  kpis = toSignal(this.store.select(selectDashboardKPIs));
  loading = toSignal(this.store.select(selectDashboardLoading));
  areaAnalytics = toSignal(this.store.select(selectAreaAnalytics));
  
  isExportingCsv = signal(false);
  isExportingPdf = signal(false);
  
  topLessons = [
    { tema: 'Puericultura', grandeArea: 'Pediatria', prioridade: 'Alta' },
    { tema: 'Hemorragias', grandeArea: 'GO', prioridade: 'Alta' },
    { tema: 'Antibióticos', grandeArea: 'Clínica Médica', prioridade: 'Média' }
  ];

  ngOnInit() {
    this.store.dispatch(DashboardActions.loadDashboard());
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
    this.isExportingPdf.set(true);
    try {
      const charts: Record<string, string> = {};
      const chartElements = ['evolution-chart', 'distribution-chart'];

      // Adiciona classe global temporária para forçar as fontes e eixos do gráfico a ficarem escuros no PDF
      document.body.classList.add('pdf-export-mode');

      for (const id of chartElements) {
        const element = document.getElementById(id);
        if (element) {
          // Force fixed width before capture so the layout doesn't get squashed
          const originalWidth = element.style.width;
          element.style.width = '800px';
          
          // Aguarda 500ms para o ngx-charts recalcular o SVG e rodar a animação de resize
          await new Promise(resolve => setTimeout(resolve, 500));

          const html2canvasModule = await import('html2canvas');
          const html2canvas = html2canvasModule.default;

          const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff', // Force white background for PDF readability
            scale: 2
          });
          
          element.style.width = originalWidth;
          charts[id] = canvas.toDataURL('image/png');
        }
      }

      document.body.classList.remove('pdf-export-mode');

      this.exportService.exportPdf('Relatório de Desempenho - MedStudy', charts).subscribe({
        next: blob => {
          this.exportService.downloadFile(blob, 'relatorio-medstudy.pdf');
          this.isExportingPdf.set(false);
        },
        error: () => this.isExportingPdf.set(false)
      });
    } catch (e) {
      this.isExportingPdf.set(false);
      document.body.classList.remove('pdf-export-mode');
    }
  }

  exportCsv() {
    this.isExportingCsv.set(true);
    // No specific filters for dashboard global export
    this.exportService.exportCsv({}).subscribe({
      next: blob => {
        this.exportService.downloadFile(blob, 'historico-sessoes.csv');
        this.isExportingCsv.set(false);
      },
      error: () => this.isExportingCsv.set(false)
    });
  }
}
