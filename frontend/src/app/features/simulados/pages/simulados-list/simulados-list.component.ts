import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { selectAllSimulados, selectSimuladosLoading, selectSimuladosFilters, selectSimuladosTotalCount } from '@store/simulados/simulados.selectors';
import * as SimuladosActions from '@store/simulados/simulados.actions';
import { Simulado, SimuladoFilters } from '@core/models/simulado.model';
import { SimuladoModalComponent } from '@features/simulados/components/simulado-modal/simulado-modal.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CreateButtonComponent } from '@shared/components/create-button/create-button.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-simulados-list',
  standalone: true,
  imports: [ButtonComponent, CommonModule, MatDialogModule, MatPaginatorModule, CreateButtonComponent, LucideAngularModule],
  templateUrl: './simulados-list.component.html',
  styleUrl: './simulados-list.component.scss'
})
export class SimuladosListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private searchSubject = new Subject<string>();

  simulados = this.store.selectSignal<Simulado[]>(selectAllSimulados);
  loading = this.store.selectSignal<boolean>(selectSimuladosLoading);
  filters = this.store.selectSignal<SimuladoFilters>(selectSimuladosFilters);
  totalCount = this.store.selectSignal<number>(selectSimuladosTotalCount);
  currentSort = signal<{column: string, direction: 'asc' | 'desc'} | null>({ column: 'dataRealizacao', direction: 'desc' });

  ngOnInit() {
    this.loadInitial();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.store.dispatch(SimuladosActions.updateFilters({ 
        filters: { nome: term, page: 0 } 
      }));
      this.loadInitial();
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  loadInitial() {
    this.store.dispatch(SimuladosActions.loadSimulados({ 
      filters: this.filters(), 
      append: false 
    }));
  }

  onPageChange(event: any) {
    const filters = { ...this.filters(), page: event.pageIndex, size: event.pageSize };
    this.store.dispatch(SimuladosActions.updateFilters({ filters }));
    this.store.dispatch(SimuladosActions.loadSimulados({ 
      filters, 
      append: false 
    }));
  }

  onSort(column: string) {
    const current = this.currentSort();
    let direction: 'asc' | 'desc' = 'asc';
    
    if (current && current.column === column) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }
    
    this.currentSort.set({ column, direction });
    
    const filters = { 
      ...this.filters(), 
      sort: `${column},${direction}` 
    };
    
    this.store.dispatch(SimuladosActions.updateFilters({ filters }));
    this.loadInitial();
  }

  openCreateModal() {
    this.dialog.open(SimuladoModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      panelClass: 'glass-modal-panel',
      backdropClass: 'blur-backdrop'
    });
  }

  openEditModal(simulado: Simulado) {
    this.dialog.open(SimuladoModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      panelClass: 'glass-modal-panel',
      backdropClass: 'blur-backdrop',
      data: { simulado }
    });
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'glass-modal-panel',
      backdropClass: 'blur-backdrop',
      data: {
        title: 'Excluir Simulado',
        message: 'Tem certeza que deseja excluir este simulado? Todos os dados de performance serão perdidos.',
        confirmText: 'Excluir',
        isDelete: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(SimuladosActions.deleteSimulado({ id }));
      }
    });
  }

  getPerformanceClass(accuracy: number) {
    if (accuracy >= 80) return 'high';
    if (accuracy >= 70) return 'mid';
    return 'low';
  }
}
