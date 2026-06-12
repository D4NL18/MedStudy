import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import { ButtonComponent } from '@shared/components/button/button.component';


/**
 * Angular component for the Flashcard Reset Modal feature.
 * @description Handles the presentation logic and user interactions for the Flashcard Reset Modal view.
 */
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
  templateUrl: './flashcard-reset-modal.component.html',
  styleUrls: ['./flashcard-reset-modal.component.scss']
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
