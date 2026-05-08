import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashcardService } from '../../../../core/services/flashcard.service';
import { ImagePasteDirective } from '../../../../shared/directives/image-paste.directive';

@Component({
  selector: 'app-flashcard-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePasteDirective],
  templateUrl: './flashcard-form.component.html',
  styleUrl: './flashcard-form.component.scss'
})
export class FlashcardFormComponent {
  private flashcardService = inject(FlashcardService);
  private router = inject(Router);

  frente = '';
  verso = '';

  onImagePasted(base64: string, field: 'frente' | 'verso') {
    const markdown = `![image](${base64})\n`;
    if (field === 'frente') {
      this.frente += markdown;
    } else {
      this.verso += markdown;
    }
  }

  save() {
    this.flashcardService.createFlashcard({
      frente: this.frente,
      verso: this.verso,
      grandeArea: 'Geral' // Simplified for now
    }).subscribe(() => {
      this.router.navigate(['/revisoes']);
    });
  }
}
