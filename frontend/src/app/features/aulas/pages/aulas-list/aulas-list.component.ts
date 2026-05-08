import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LucideAngularModule, Diamond, ChevronRight, CheckCircle } from 'lucide-angular';
import { StudyPlanActions } from '../../../../store/study-plan/study-plan.actions';
import { selectLessons, selectLoading } from '../../../../store/study-plan/study-plan.reducer';
import { LessonPriority } from '../../../../core/models/lesson.model';

@Component({
  selector: 'app-aulas-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="aulas-container">
      <div class="header">
        <h1>Plano de Aulas</h1>
        <p>Acompanhe seu progresso e priorize os temas mais importantes.</p>
      </div>

      <div class="stats-row" *ngIf="lessons$ | async as lessons">
        <div class="stat-card">
          <span class="label">Total de Temas</span>
          <span class="value">{{ lessons.length }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Assistidas</span>
          <span class="value">{{ getAssistedCount(lessons) }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Progresso</span>
          <span class="value">{{ getProgress(lessons) }}%</span>
        </div>
      </div>

      <div class="lessons-grid">
        <div class="lesson-card" *ngFor="let lesson of lessons$ | async" 
             [class.assisted]="lesson.aulaAssistida"
             [class.priority-diamante]="lesson.prioridade === 'DIAMANTE'">
          
          <div class="priority-indicator" [ngClass]="lesson.prioridade.toLowerCase()">
            <lucide-icon [name]="lesson.prioridade === 'DIAMANTE' ? 'diamond' : 'chevron-right'" 
                        [size]="16"></lucide-icon>
            <span>{{ lesson.prioridade }}</span>
          </div>

          <div class="content">
            <span class="area">{{ lesson.grandeArea }}</span>
            <h3 class="tema">{{ lesson.tema }}</h3>
          </div>

          <button class="status-btn" (click)="toggleAssisted(lesson.id)" 
                  [class.active]="lesson.aulaAssistida">
            <lucide-icon name="check-circle" [size]="20"></lucide-icon>
            <span>{{ lesson.aulaAssistida ? 'Assistida' : 'Marcar Assistida' }}</span>
          </button>
        </div>
      </div>

      <div class="loading-overlay" *ngIf="loading$ | async">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .aulas-container {
      padding: var(--spacing-xl);
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: var(--spacing-2xl);
      h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 2.5rem;
        margin-bottom: var(--spacing-xs);
        background: linear-gradient(135deg, var(--color-primary), #60a5fa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p { color: var(--color-text-secondary); }
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: var(--color-surface);
      padding: var(--spacing-lg);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      .label { display: block; font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 4px; }
      .value { font-size: 1.5rem; font-weight: 700; color: var(--color-primary); }
    }

    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .lesson-card {
      background: var(--color-surface);
      border-radius: 20px;
      padding: var(--spacing-lg);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        border-color: var(--color-primary);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }

      &.priority-diamante {
        background: linear-gradient(145deg, rgba(157, 80, 187, 0.1), rgba(110, 72, 170, 0.1));
        border-color: rgba(157, 80, 187, 0.3);
        &::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(157, 80, 187, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .priority-indicator {
          background: linear-gradient(135deg, #9D50BB, #6E48AA);
          box-shadow: 0 0 15px rgba(157, 80, 187, 0.5);
        }
      }
    }

    .priority-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: var(--spacing-md);
      
      &.diamante { background: #9D50BB; color: white; }
      &.alta { background: #EF4444; color: white; }
      &.media { background: #F59E0B; color: white; }
      &.baixa { background: #10B981; color: white; }
    }

    .content {
      margin-bottom: var(--spacing-lg);
      .area { font-size: 0.75rem; color: var(--color-primary); text-transform: uppercase; letter-spacing: 1px; }
      .tema { font-size: 1.25rem; font-family: 'Outfit', sans-serif; margin-top: 4px; }
    }

    .status-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: var(--color-text-secondary);
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover { background: rgba(255, 255, 255, 0.1); }
      &.active {
        background: var(--color-primary-soft);
        color: var(--color-primary);
      }
    }

    .loading-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
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
