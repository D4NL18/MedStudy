import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudyPlanActions } from '../../../../store/study-plan/study-plan.actions';
import { selectLessons, selectLoading } from '../../../../store/study-plan/study-plan.reducer';
import { Lesson, LessonPriority } from '../../../../core/models/lesson.model';
import { LessonModalComponent } from '../../components/lesson-modal/lesson-modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-aulas-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatDialogModule],
  templateUrl: './aulas-list.component.html',
  styleUrl: './aulas-list.component.scss'
})
export class AulasListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  
  lessons$ = this.store.select(selectLessons);
  loading$ = this.store.select(selectLoading);

  ngOnInit() {
    this.store.dispatch(StudyPlanActions.loadLessons({}));
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
            lesson: { ...result, aulaAssistida: false } 
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
    this.store.dispatch(StudyPlanActions.loadLessons({ tema: term }));
  }

  onFilterChange(type: string, value: any) {
    const filters: any = {};
    if (type === 'grandeArea') filters.grandeArea = value || undefined;
    if (type === 'prioridade') filters.prioridade = value || undefined;
    if (type === 'status') filters.aulaAssistida = value === 'concluido' ? true : value === 'pendente' ? false : undefined;
    
    this.store.dispatch(StudyPlanActions.loadLessons(filters));
  }

  getAssistedCount(lessons: Lesson[]): number {
    return lessons.filter(l => l.aulaAssistida).length;
  }

  getPendingCount(lessons: Lesson[]): number {
    return lessons.filter(l => !l.aulaAssistida).length;
  }

  getDiamondPendingCount(lessons: Lesson[]): number {
    return lessons.filter(l => l.prioridade === LessonPriority.DIAMANTE && !l.aulaAssistida).length;
  }

  getProgress(lessons: Lesson[]): number {
    if (lessons.length === 0) return 0;
    return Math.round((this.getAssistedCount(lessons) / lessons.length) * 100);
  }
}
