import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockInstance } from 'ng-mocks';
import { LessonModalComponent } from './lesson-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalLayoutComponent } from '../../../../shared/components/modal-layout/modal-layout.component';
import { createMockLesson } from '../../../../testing/fixtures/lesson.fixture';
import { LessonPriority } from '../../../../core/models/lesson.model';

describe('LessonModalComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(LessonModalComponent)
      .mock(ModalLayoutComponent)
      .mock(MatDialogRef)
      .provide({ provide: MAT_DIALOG_DATA, useValue: {} });
  });

  it('should create with default values', () => {
    const fixture = TestBed.createComponent(LessonModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.lessonForm.get('prioridade')?.value).toBe(LessonPriority.MEDIA);
  });

  it('should patch form when data contains lesson', () => {
    const mockLesson = createMockLesson({ tema: 'Test Lesson' });
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { lesson: mockLesson } });
    
    const fixture = TestBed.createComponent(LessonModalComponent);
    fixture.detectChanges();
    
    expect(fixture.componentInstance.lessonForm.get('tema')?.value).toBe('Test Lesson');
  });

  it('should close with form value on save if valid', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    spyOn(dialogRef, 'close');
    
    const fixture = TestBed.createComponent(LessonModalComponent);
    fixture.componentInstance.lessonForm.patchValue({
      grandeArea: 'Cirurgia',
      tema: 'Nova Aula',
      prioridade: LessonPriority.ALTA
    });
    
    fixture.componentInstance.onSave();
    
    expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
      tema: 'Nova Aula'
    }));
  });

  it('should mark all as touched if invalid on save', () => {
    const fixture = TestBed.createComponent(LessonModalComponent);
    const markSpy = spyOn(fixture.componentInstance.lessonForm, 'markAllAsTouched');
    
    fixture.componentInstance.lessonForm.patchValue({ tema: '' }); // Invalid
    fixture.componentInstance.onSave();
    
    expect(markSpy).toHaveBeenCalled();
  });
});
