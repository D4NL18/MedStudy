import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import * as BancoActions from '@store/banco/banco.actions';
import { selectBancoLoading } from '@store/banco/banco.selectors';
import { QuestionSession } from '@core/models/question-session.model';

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
    erros: [null as number | null, [Validators.required, Validators.min(0)]],
    data: [this.getLocalDate(), [Validators.required, this.futureDateValidator]],
    observacoes: ['']
  }, {
    validators: (group) => {
      const total = group.get('totalQuestoes')?.value;
      const acertos = group.get('acertos')?.value;
      return total !== null && acertos !== null && acertos > total ? { acertosInvalidos: true } : null;
    }
  });

  lockedField: 'total' | 'acertos' | 'erros' | null = null;

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
      // Inicializar cálculo reverso para erros em modo de edição
      this.lockedField = 'erros';
      this.sessionForm.get('erros')?.setValue(this.sessionToEdit.qtsFeitas - this.sessionToEdit.qtsCorretas);
      this.sessionForm.get('erros')?.disable();
    }
  }

  onInput(changedField: 'total' | 'acertos' | 'erros') {
    const t = this.sessionForm.get('totalQuestoes');
    const a = this.sessionForm.get('acertos');
    const e = this.sessionForm.get('erros');
    
    const valT = t?.value;
    const valA = a?.value;
    const valE = e?.value;

    const hasT = valT !== null && valT !== undefined;
    const hasA = valA !== null && valA !== undefined;
    const hasE = valE !== null && valE !== undefined;

    // 1. Destravar se o usuário apagou um dos campos que originou o bloqueio
    if (this.lockedField === 'erros' && changedField !== 'erros' && (!hasT || !hasA)) {
      this.lockedField = null;
      e?.enable({ emitEvent: false });
      e?.setValue(null, { emitEvent: false });
    } else if (this.lockedField === 'acertos' && changedField !== 'acertos' && (!hasT || !hasE)) {
      this.lockedField = null;
      a?.enable({ emitEvent: false });
      a?.setValue(null, { emitEvent: false });
    } else if (this.lockedField === 'total' && changedField !== 'total' && (!hasA || !hasE)) {
      this.lockedField = null;
      t?.enable({ emitEvent: false });
      t?.setValue(null, { emitEvent: false });
    }

    // 2. Reavaliar o que está preenchido agora
    const newHasT = t?.value !== null && t?.value !== undefined;
    const newHasA = a?.value !== null && a?.value !== undefined;
    const newHasE = e?.value !== null && e?.value !== undefined;

    // 3. Aplicar novo bloqueio se tivermos 2 campos preenchidos e nenhum bloqueio ativo
    if (this.lockedField === null) {
      if (newHasT && newHasA && !newHasE) {
        this.lockedField = 'erros';
        e?.disable({ emitEvent: false });
      } else if (newHasT && newHasE && !newHasA) {
        this.lockedField = 'acertos';
        a?.disable({ emitEvent: false });
      } else if (newHasA && newHasE && !newHasT) {
        this.lockedField = 'total';
        t?.disable({ emitEvent: false });
      }
    }

    // 4. Calcular o valor do campo bloqueado e impedir números negativos
    if (this.lockedField === 'erros' && newHasT && newHasA) {
      const calc = (t?.value || 0) - (a?.value || 0);
      e?.setValue(Math.max(0, calc), { emitEvent: false });
    } else if (this.lockedField === 'acertos' && newHasT && newHasE) {
      const calc = (t?.value || 0) - (e?.value || 0);
      a?.setValue(Math.max(0, calc), { emitEvent: false });
    } else if (this.lockedField === 'total' && newHasA && newHasE) {
      const calc = (a?.value || 0) + (e?.value || 0);
      t?.setValue(Math.max(0, calc), { emitEvent: false });
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
