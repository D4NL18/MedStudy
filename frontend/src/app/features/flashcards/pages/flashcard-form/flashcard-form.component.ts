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

  onImagePasted(base64: string, field: 'frente' | 'verso', textarea: HTMLTextAreaElement) {
    const markdown = `\n![image](${base64})\n`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = field === 'frente' ? this.frente : this.verso;
    
    const newText = text.substring(0, start) + markdown + text.substring(end);
    
    if (field === 'frente') {
      this.frente = newText;
    } else {
      this.verso = newText;
    }

    // Optional: reset cursor position after change
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
      textarea.focus();
    });
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
