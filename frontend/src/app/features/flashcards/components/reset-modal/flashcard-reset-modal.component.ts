import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LucideAngularModule, AlertTriangle, X } from 'lucide-angular';

@Component({
  selector: 'app-flashcard-reset-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule,
    LucideAngularModule
  ],
  template: `
    <div class="reset-modal">
      <div class="modal-header">
        <div class="warning-icon">
          <lucide-icon [name]="AlertTriangleIcon" class="icon-lg text-amber-500"></lucide-icon>
        </div>
        <h2>Confirmar Reset de Progresso</h2>
        <button class="close-btn" (click)="close()">
          <lucide-icon [name]="XIcon"></lucide-icon>
        </button>
      </div>

      <div class="modal-body">
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

      <div class="modal-footer">
        <button mat-button (click)="close()">Cancelar</button>
        <button mat-flat-button 
                color="warn" 
                [disabled]="confirmationString() !== 'RESETAR'"
                (click)="confirm()">
          Resetar Agora
        </button>
      </div>
    </div>
  `,
  styles: [`
    .reset-modal {
      padding: 24px;
      max-width: 450px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 16px;
    }

    .modal-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
      position: relative;
    }

    .warning-icon {
      background: rgba(245, 158, 11, 0.1);
      padding: 16px;
      border-radius: 50%;
      margin-bottom: 12px;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .close-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: rgba(0,0,0,0.05);
    }

    .modal-body {
      color: #475569;
      line-height: 1.5;
    }

    .description {
      margin-bottom: 16px;
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .w-full { width: 100%; }
    .text-amber-500 { color: #f59e0b; }
    .icon-lg { width: 48px; height: 48px; }
  `]
})
export class FlashcardResetModalComponent {
  confirmationString = signal('');
  readonly AlertTriangleIcon = AlertTriangle;
  readonly XIcon = X;

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
