import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDelete?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-wrapper glass" [class.delete-mode]="data.isDelete">
      <div class="header">
        <div class="icon">
          {{ data.isDelete ? '🗑️' : '❓' }}
        </div>
        <h2>{{ data.title }}</h2>
      </div>
      
      <div class="content">
        <p>{{ data.message }}</p>
      </div>
      
      <div class="footer">
        <button class="btn-cancel" (click)="onCancel()">{{ data.cancelText || 'Cancelar' }}</button>
        <button class="btn-confirm" [class.delete]="data.isDelete" (click)="onConfirm()">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-wrapper {
      padding: 32px;
      border-radius: 24px;
      max-width: 400px;
      background: var(--color-surface-glass);
      backdrop-filter: blur(20px);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      display: flex;
      flex-direction: column;
      gap: 24px;
      animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
      
      .icon {
        font-size: 3rem;
        margin-bottom: 8px;
      }
      
      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
    }

    .content {
      text-align: center;
      p {
        margin: 0;
        opacity: 0.8;
        font-size: 1rem;
        line-height: 1.5;
      }
    }

    .footer {
      display: flex;
      gap: 12px;
      
      button {
        flex: 1;
        padding: 12px;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        
        &:hover { transform: translateY(-2px); }
        &:active { transform: translateY(0); }
      }
      
      .btn-cancel {
        background: rgba(var(--color-text-rgb), 0.05);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        &:hover { background: rgba(var(--color-text-rgb), 0.1); }
      }
      
      .btn-confirm {
        background: var(--color-accent);
        color: white;
        box-shadow: 0 4px 15px rgba(var(--color-accent-rgb), 0.3);
        &.delete {
          background: #ff5858;
          box-shadow: 0 4px 15px rgba(255, 88, 88, 0.3);
        }
      }
    }

    @keyframes modalScaleUp {
      from { opacity: 0; transform: scale(0.9) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
