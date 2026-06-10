import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StudyPlanActions } from '../../../../store/study-plan/study-plan.actions';
import { selectLessons, selectLoading, selectTotalElements } from '../../../../store/study-plan/study-plan.reducer';
import { Lesson } from '../../../../core/models/lesson.model';
import { LessonService } from '../../../../core/services/lesson.service';
import { LessonModalComponent } from '../../components/lesson-modal/lesson-modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-aulas-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatDialogModule, MatPaginatorModule],
  templateUrl: './aulas-list.component.html',
  styleUrl: './aulas-list.component.scss'
})
export class AulasListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private lessonService = inject(LessonService);
  
  lessons$ = this.store.select(selectLessons);
  loading$ = this.store.select(selectLoading);
  totalElements$ = this.store.select(selectTotalElements);
  summary$ = this.lessonService.getSummary();

  pageIndex = 0;
  pageSize = 10;
  currentFilters: any = {};
  currentSort = signal<{column: string, direction: 'asc' | 'desc'} | null>({ column: 'dataAula', direction: 'desc' });
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.currentFilters.sort = `${this.currentSort()?.column},${this.currentSort()?.direction}`;
    this.loadLessons();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.currentFilters.tema = term || undefined;
      this.pageIndex = 0;
      this.loadLessons();
    });
  }

  loadLessons() {
    this.store.dispatch(StudyPlanActions.loadLessons({
      ...this.currentFilters,
      page: this.pageIndex,
      size: this.pageSize
    }));
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLessons();
  }

  openModal(lesson?: Lesson) {
    const dialogRef = this.dialog.open(LessonModalComponent, {
      width: '500px',
      data: { lesson }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (lesson) {
          this.store.dispatch(StudyPlanActions.updateLesson({ 
            id: lesson.id, 
            lesson: { ...lesson, ...result } 
          }));
        } else {
          this.store.dispatch(StudyPlanActions.createLesson({ 
            lesson: result 
          }));
        }
      }
    });
  }

  createLesson() {
    this.openModal();
  }

  editLesson(lesson: Lesson) {
    this.openModal(lesson);
  }

  toggleAssisted(id: string) {
    this.store.dispatch(StudyPlanActions.toggleLessonAssisted({ lessonId: id }));
  }

  deleteLesson(lesson: Lesson) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Aula',
        message: `Tem certeza que deseja excluir a aula "${lesson.tema}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        isDelete: true
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.store.dispatch(StudyPlanActions.deleteLesson({ id: lesson.id }));
      }
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onSort(column: string) {
    const current = this.currentSort();
    let direction: 'asc' | 'desc' = 'asc';
    
    if (current && current.column === column) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }
    
    this.currentSort.set({ column, direction });
    
    this.currentFilters = { 
      ...this.currentFilters, 
      sort: `${column},${direction}` 
    };
    
    this.pageIndex = 0;
    this.loadLessons();
  }

  onFilterChange(type: string, value: any) {
    if (type === 'grandeArea') this.currentFilters.grandeArea = value || undefined;
    if (type === 'prioridade') this.currentFilters.prioridade = value || undefined;
    if (type === 'status') this.currentFilters.aulaAssistida = value === 'concluido' ? true : value === 'pendente' ? false : undefined;
    if (type === 'reforco') this.currentFilters.reforco = value === 'true' ? true : value === 'false' ? false : undefined;
    
    this.pageIndex = 0;
    this.loadLessons();
  }

}
