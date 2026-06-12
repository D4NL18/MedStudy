import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


/**
 * Angular component for the Modal Layout feature.
 * @description Handles the presentation logic and user interactions for the Modal Layout view.
 */
@Component({
  selector: 'app-modal-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-layout.component.html',
  styleUrl: './modal-layout.component.scss'
})
export class ModalLayoutComponent {
  @Input() title = '';
  @Input() loading = false;
  @Input() saveText = 'Salvar Registro';
  @Input() useDefaultFooter = true;
  @Input() fullScreenOverlay = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
