import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <app-button 
      [variant]="type === 'pdf' ? 'btn-export pdf' : 'btn-export csv'" 
      (onClick)="onClick.emit($event)" 
      [disabled]="loading" 
      [title]="type === 'pdf' ? 'Gerar Relatório (PDF)' : 'Exportar para Excel (CSV)'">
      <lucide-icon [name]="type === 'pdf' ? 'file-text' : 'file-spreadsheet'" *ngIf="!loading"></lucide-icon>
      <div class="spinner" *ngIf="loading" style="width: 14px; height: 14px; border-width: 2px;"></div>
      {{ loading ? 'Baixando...' : (type === 'pdf' ? 'Relatório PDF' : 'CSV') }}
    </app-button>
  `,
  styles: [`
    :host { display: inline-block; }
    ::ng-deep .btn-export {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }
    ::ng-deep .btn-export:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--color-primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    ::ng-deep .btn-export.pdf {
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      color: white;
      border: none;
    }
    ::ng-deep .btn-export.pdf:hover {
      box-shadow: 0 4px 15px rgba(var(--color-primary-rgb), 0.4);
    }
    ::ng-deep .btn-export:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class ExportButtonComponent {
  @Input() type: 'pdf' | 'csv' = 'csv';
  @Input() loading = false;
  @Output() onClick = new EventEmitter<Event>();
}
