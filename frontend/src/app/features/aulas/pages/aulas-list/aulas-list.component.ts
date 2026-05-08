import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { StudyPlanActions } from '../../../../store/study-plan/study-plan.actions';
import { selectLessons, selectLoading } from '../../../../store/study-plan/study-plan.reducer';

@Component({
  selector: 'app-aulas-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './aulas-list.component.html',
  styleUrl: './aulas-list.component.scss'
})
export class AulasListComponent implements OnInit {
  private store = inject(Store);
  
  lessons$ = this.store.select(selectLessons);
  loading$ = this.store.select(selectLoading);

  ngOnInit() {
    this.store.dispatch(StudyPlanActions.loadLessons());
  }

  toggleAssisted(lessonId: string) {
    this.store.dispatch(StudyPlanActions.toggleLessonAssisted({ lessonId }));
  }

  getAssistedCount(lessons: any[]): number {
    return lessons.filter(l => l.aulaAssistida).length;
  }

  getProgress(lessons: any[]): number {
    if (lessons.length === 0) return 0;
    return Math.round((this.getAssistedCount(lessons) / lessons.length) * 100);
  }
}
