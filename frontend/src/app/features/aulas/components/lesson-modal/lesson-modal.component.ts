import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import { Lesson, LessonPriority } from '@core/models/lesson.model';


/**
 * Angular component for the Lesson Modal feature.
 * @description Handles the presentation logic and user interactions for the Lesson Modal view.
 */
@Component({
  selector: 'app-lesson-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalLayoutComponent],
  templateUrl: './lesson-modal.component.html',
  styleUrls: ['./lesson-modal.component.scss']
})
export class LessonModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LessonModalComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  lessonToEdit: Lesson | null = this.data?.lesson || null;

  lessonForm = this.fb.group({
    grandeArea: ['Clínica Médica', Validators.required],
    subArea: [''],
    tema: ['', Validators.required],
    prioridade: [LessonPriority.MEDIA, Validators.required],
    aulaAssistida: [false],
    dataAula: ['']
  });

  ngOnInit() {
    if (this.lessonToEdit) {
      this.lessonForm.patchValue({
        grandeArea: this.lessonToEdit.grandeArea,
        subArea: this.lessonToEdit.subArea,
        tema: this.lessonToEdit.tema,
        prioridade: this.lessonToEdit.prioridade,
        aulaAssistida: this.lessonToEdit.aulaAssistida,
        dataAula: this.lessonToEdit.dataAula ? this.lessonToEdit.dataAula.split('T')[0] : ''
      });
    }

    // Auto-set date when checkbox is checked
    this.lessonForm.get('aulaAssistida')?.valueChanges.subscribe(checked => {
      if (checked && !this.lessonForm.get('dataAula')?.value) {
        this.lessonForm.get('dataAula')?.setValue(new Date().toISOString().split('T')[0]);
      }
    });
  }

  onSave() {
    if (this.lessonForm.valid) {
      const value = { ...this.lessonForm.value };
      if (value.dataAula === '') {
        (value as any).dataAula = null;
      }
      this.dialogRef.close(value);
    } else {
      this.lessonForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
