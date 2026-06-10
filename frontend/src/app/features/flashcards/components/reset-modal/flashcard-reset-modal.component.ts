import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-flashcard-reset-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatInputModule, 
    MatFormFieldModule,
    LucideAngularModule,
    ModalLayoutComponent,
    ButtonComponent
  ],
  template: `
    <app-modal-layout title="Confirmar Reset de Progresso" [useDefaultFooter]="false" (close)="close()">
      <div class="modal-body">
        <div class="warning-icon-wrapper">
          <div class="warning-icon">
            <lucide-icon [name]="AlertTriangleIcon" class="icon-lg text-amber-500"></lucide-icon>
          </div>
        </div>
        <p class="description">
          Você está prestes a resetar o progresso de estudo de 
          <strong>{{ data.grandeArea || 'Todas as Áreas' }}</strong>.
        </p>
        
        <div class="danger-box">
          <p>Esta ação é <strong>irreversível</strong>. Todos os flashcards desta área voltarão ao estado de "Novo" e o histórico de repetição espaçada será reiniciado.</p>
        </div>

        <div class="confirmation-form">
          <label for="confirm-string">Para confirmar, digite <strong>RESETAR</strong> abaixo:</label>
          <mat-form-field appearance="outline" class="w-full">
            <input matInput 
                   id="confirm-string"
                   [(ngModel)]="confirmationString" 
                   placeholder="Digite RESETAR"
                   autocomplete="off">
          </mat-form-field>
        </div>
      </div>

      <div modal-footer class="custom-footer">
        <app-button variant="secondary" (onClick)="close()">Cancelar</app-button>
        <app-button variant="destructive" 
                [disabled]="confirmationString() !== 'RESETAR'"
                (onClick)="confirm()">
          Resetar Agora
        </app-button>
      </div>
    </app-modal-layout>
  `,
  styles: [`
    .warning-icon-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .warning-icon {
      background: rgba(245, 158, 11, 0.1);
      padding: 16px;
      border-radius: 50%;
    }
    .modal-body {
      color: #475569;
      line-height: 1.5;
    }
    .description {
      margin-bottom: 16px;
      text-align: center;
    }
    .danger-box {
      background: rgba(239, 68, 68, 0.05);
      border-left: 4px solid #ef4444;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 24px;
      font-size: 0.9rem;
    }
    .confirmation-form {
      margin-top: 16px;
    }
    .confirmation-form label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.85rem;
      color: #64748b;
    }
    .w-full { width: 100%; }
    .text-amber-500 { color: #f59e0b; }
    .icon-lg { width: 48px; height: 48px; }
    .custom-footer { display: flex; justify-content: flex-end; gap: 12px; width: 100%; }
  `]
})
export class FlashcardResetModalComponent {
  confirmationString = signal('');
  readonly AlertTriangleIcon = AlertTriangle;

  constructor(
    public dialogRef: MatDialogRef<FlashcardResetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grandeArea?: string }
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    if (this.confirmationString() === 'RESETAR') {
      this.dialogRef.close(true);
    }
  }
}
