import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalLayoutComponent } from '../../../../shared/components/modal-layout/modal-layout.component';
import { Lesson, LessonPriority } from '../../../../core/models/lesson.model';

@Component({
  selector: 'app-lesson-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalLayoutComponent],
  template: `
    <app-modal-layout 
      [title]="lessonToEdit ? 'Editar Aula' : 'Nova Aula'" 
      (close)="onClose()"
      (save)="onSave()">
      
      <form [formGroup]="lessonForm" class="lesson-form">
        <div class="form-group">
          <label>Grande Área</label>
          <select formControlName="grandeArea">
            <option value="Clínica Médica">Clínica Médica</option>
            <option value="Cirurgia">Cirurgia</option>
            <option value="Pediatria">Pediatria</option>
            <option value="Ginecologia/Obstetrícia">Ginecologia/Obstetrícia</option>
            <option value="Preventiva">Preventiva</option>
          </select>
        </div>

        <div class="form-group">
          <label>Subárea (Opcional)</label>
          <input type="text" formControlName="subArea" placeholder="Ex: Cardiologia">
        </div>

        <div class="form-group">
          <label>Tema da Aula</label>
          <input type="text" formControlName="tema" placeholder="Ex: Insuficiência Cardíaca"
                 [class.invalid]="lessonForm.get('tema')?.invalid && lessonForm.get('tema')?.touched">
          <span class="error-msg" *ngIf="lessonForm.get('tema')?.invalid && lessonForm.get('tema')?.touched">
            O tema da aula é obrigatório
          </span>
        </div>

        <div class="form-group">
          <label>Prioridade</label>
          <select formControlName="prioridade">
            <option [value]="'DIAMANTE'">Diamante</option>
            <option [value]="'ALTA'">Alta</option>
            <option [value]="'MEDIA'">Média</option>
            <option [value]="'BAIXA'">Baixa</option>
          </select>
        </div>
        
        <div class="form-group row-group">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="aulaAssistida">
            <span>Aula Assistida</span>
          </label>
        </div>

        <div class="form-group" *ngIf="lessonForm.get('aulaAssistida')?.value">
          <label>Data de Conclusão</label>
          <input type="date" formControlName="dataAula"
                 [class.invalid]="lessonForm.get('aulaAssistida')?.value && !lessonForm.get('dataAula')?.value && lessonForm.get('dataAula')?.touched">
          <span class="error-msg" *ngIf="lessonForm.get('aulaAssistida')?.value && !lessonForm.get('dataAula')?.value && lessonForm.get('dataAula')?.touched">
            Informe a data em que assistiu a aula
          </span>
        </div>
      </form>
    </app-modal-layout>
  `,
  styles: [`
    .lesson-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 10px 0;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label { 
        font-size: 0.85rem; 
        font-weight: 600; 
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      input, select {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 12px 16px;
        color: #fff;
        font-size: 1rem;
        outline: none;
        transition: all 0.2s ease;
        width: 100%;
        box-sizing: border-box;

        &:focus { 
          border-color: var(--color-primary, #6F0642); 
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(111, 6, 66, 0.2);
        }

        &.invalid {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      }

      .error-msg {
        color: #ef4444;
        font-size: 0.75rem;
        font-weight: 500;
        margin-top: -4px;
      }

      select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 20px;
        padding-right: 40px;
        color-scheme: dark;
        cursor: pointer;

        option {
          background-color: #1a1a1a;
          color: #fff;
          padding: 10px;
        }
      }
    }

    .row-group {
      flex-direction: row !important;
      align-items: center;
      gap: 12px !important;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      color: #fff !important;
      font-weight: 500 !important;
      text-transform: none !important;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  `]
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
