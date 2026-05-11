import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { AulasListComponent } from './aulas-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { of } from 'rxjs';
import { StudyPlanActions } from '../../../../store/study-plan/study-plan.actions';
import { selectLessons, selectLoading } from '../../../../store/study-plan/study-plan.reducer';
import { createMockLesson } from '../../../../testing/fixtures/lesson.fixture';
import { LessonPriority } from '../../../../core/models/lesson.model';

describe('AulasListComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(AulasListComponent)
      .mock(LucideAngularModule)
      .mock(MatDialog)
      .provide(provideMockStore({
        initialState: {
          studyPlan: {
            lessons: [],
            loading: false
          }
        }
      }));
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AulasListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should dispatch loadLessons on init', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    const fixture = TestBed.createComponent(AulasListComponent);
    fixture.detectChanges();
    
    expect(dispatchSpy).toHaveBeenCalledWith(StudyPlanActions.loadLessons({}));
  });

  it('should calculate counts correctly', () => {
    const fixture = TestBed.createComponent(AulasListComponent);
    const component = fixture.componentInstance;
    
    const lessons = [
      createMockLesson({ id: '1', aulaAssistida: true }),
      createMockLesson({ id: '2', aulaAssistida: false }),
      createMockLesson({ id: '3', aulaAssistida: false, prioridade: LessonPriority.DIAMANTE })
    ];
    
    expect(component.getAssistedCount(lessons)).toBe(1);
    expect(component.getPendingCount(lessons)).toBe(2);
    expect(component.getDiamondPendingCount(lessons)).toBe(2);
    expect(component.getProgress(lessons)).toBe(33);
  });

  it('should dispatch toggleLessonAssisted', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch');
    
    const fixture = TestBed.createComponent(AulasListComponent);
    fixture.componentInstance.toggleAssisted('123');
    
    expect(dispatchSpy).toHaveBeenCalledWith(StudyPlanActions.toggleLessonAssisted({ lessonId: '123' }));
  });

  it('should dispatch deleteLesson when confirmed', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch');
    const openSpy = jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(true)
    });
    MockInstance(MatDialog, 'open', openSpy);
    
    const fixture = TestBed.createComponent(AulasListComponent);
    const mockLesson = createMockLesson({ id: '456' });
    fixture.componentInstance.deleteLesson(mockLesson);
    
    expect(openSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(StudyPlanActions.deleteLesson({ id: '456' }));
  });
});
