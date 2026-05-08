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
  template: `
    <div class="form-container">
      <h1>Criar Novo Flashcard</h1>
      
      <div class="editor-section">
        <label>Frente (Markdown)</label>
        <textarea [(ngModel)]="frente" 
                  appImagePaste 
                  (imagePasted)="onImagePasted($event, 'frente')"
                  placeholder="Digite o texto ou cole uma imagem..."></textarea>
      </div>

      <div class="editor-section">
        <label>Verso (Markdown)</label>
        <textarea [(ngModel)]="verso" 
                  appImagePaste 
                  (imagePasted)="onImagePasted($event, 'verso')"
                  placeholder="Digite a resposta ou cole uma imagem..."></textarea>
      </div>

      <div class="actions">
        <button (click)="save()" [disabled]="!frente || !verso">Salvar Flashcard</button>
      </div>
    </div>
  `,
  styles: [`
    .form-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    .editor-section { margin-bottom: 2rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    textarea { 
      width: 100%; 
      height: 200px; 
      padding: 1rem; 
      border-radius: 8px; 
      background: var(--color-surface); 
      color: white; 
      border: 1px solid rgba(255,255,255,0.1); 
      font-family: monospace;
    }
    .actions { text-align: right; }
    button { 
      padding: 1rem 2rem; 
      background: var(--color-primary); 
      color: white; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
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
