import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ModalLayoutComponent } from '../../../../shared/components/modal-layout/modal-layout.component';
import * as BancoActions from '../../../../store/banco/banco.actions';
import { selectBancoLoading } from '../../../../store/banco/banco.selectors';
import { QuestionSession } from '../../../../core/models/question-session.model';

@Component({
  selector: 'app-session-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalLayoutComponent],
  templateUrl: './session-modal.component.html',
  styleUrl: './session-modal.component.scss'
})
export class SessionModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SessionModalComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });
  private store = inject(Store);

  loading = this.store.selectSignal(selectBancoLoading);
  sessionToEdit: QuestionSession | null = this.data?.session || null;

  areas = ['Cirurgia', 'Clínica Médica', 'Ginecologia e Obstetrícia', 'Pediatria', 'Medicina Preventiva'];

  private getLocalDate(): string {
    const now = new Date();
    // Ajuste manual para GMT-3 se necessário, ou usar toLocaleDateString
    return now.toLocaleDateString('en-CA'); // Retorna YYYY-MM-DD na data local
  }

  sessionForm = this.fb.group({
    grandeArea: ['', Validators.required],
    tema: ['', Validators.required],
    totalQuestoes: [null as number | null, [Validators.required, Validators.min(1)]],
    acertos: [null as number | null, [Validators.required, Validators.min(0)]],
    data: [this.getLocalDate(), [Validators.required, this.futureDateValidator]],
    observacoes: ['']
  }, {
    validators: (group) => {
      const total = group.get('totalQuestoes')?.value;
      const acertos = group.get('acertos')?.value;
      return total !== null && acertos !== null && acertos > total ? { acertosInvalidos: true } : null;
    }
  });

  ngOnInit() {
    if (this.sessionToEdit) {
      this.sessionForm.patchValue({
        grandeArea: this.sessionToEdit.grandeArea,
        tema: this.sessionToEdit.tema,
        totalQuestoes: this.sessionToEdit.qtsFeitas,
        acertos: this.sessionToEdit.qtsCorretas,
        data: this.sessionToEdit.dataSessao,
        observacoes: this.sessionToEdit.observacoes || ''
      });
    }
  }

  private futureDateValidator(control: any) {
    if (!control.value) return null;
    const selected = new Date(control.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today ? { futureDate: true } : null;
  }

  onSave() {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.getRawValue();
      const sessionData = {
        grandeArea: formValue.grandeArea,
        tema: formValue.tema,
        dataSessao: formValue.data,
        qtsFeitas: formValue.totalQuestoes,
        qtsCorretas: formValue.acertos,
        observacoes: formValue.observacoes,
        revisaoConcluida: this.sessionToEdit?.revisaoConcluida || false
      };
      
      if (this.sessionToEdit) {
        this.store.dispatch(BancoActions.updateSession({ 
          id: this.sessionToEdit.id, 
          session: sessionData as any 
        }));
      } else {
        this.store.dispatch(BancoActions.createSession({ session: sessionData as any }));
      }
      
      this.dialogRef.close(true);
    } else {
      this.sessionForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
