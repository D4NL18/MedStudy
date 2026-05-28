import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardService } from '../../../../core/services/flashcard.service';
import { ImagePasteDirective } from '../../../../shared/directives/image-paste.directive';
import { ImageCompressorService } from '../../../../core/services/image-compressor.service';

@Component({
  selector: 'app-flashcard-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePasteDirective, LucideAngularModule],
  templateUrl: './flashcard-form.component.html',
  styleUrl: './flashcard-form.component.scss'
})
export class FlashcardFormComponent {
  private flashcardService = inject(FlashcardService);
  private router = inject(Router);
  private imageCompressor = inject(ImageCompressorService);

  @ViewChild('frenteEditor') frenteEditor!: ElementRef<HTMLDivElement>;
  @ViewChild('versoEditor') versoEditor!: ElementRef<HTMLDivElement>;

  grandeArea = 'Clínica Médica';
  areas = ['Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia', 'Preventiva'];

  async onImagePasted(base64: string, field: 'frente' | 'verso') {
    const editor = field === 'frente' ? this.frenteEditor.nativeElement : this.versoEditor.nativeElement;
    
    try {
      const compressedBase64 = await this.imageCompressor.compressImage(base64);
      const img = document.createElement('img');
      img.src = compressedBase64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.margin = '8px 0';
      
      this.insertAtCursor(editor, img);
    } catch (e) {
      console.error('Failed to compress image', e);
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.margin = '8px 0';
      
      this.insertAtCursor(editor, img);
    }
  }

  insertAtCursor(editor: HTMLDivElement, node: Node) {
    editor.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
    } else {
      editor.appendChild(node);
    }
  }

  triggerImageUpload(field: 'frente' | 'verso') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re: any) => this.onImagePasted(re.target.result, field);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  save() {
    const frenteHtml = this.frenteEditor.nativeElement.innerHTML;
    const versoHtml = this.versoEditor.nativeElement.innerHTML;

    this.flashcardService.createFlashcard({
      frente: this.htmlToMarkdown(frenteHtml),
      verso: this.htmlToMarkdown(versoHtml),
      grandeArea: this.grandeArea
    }).subscribe(() => {
      this.router.navigate(['/flashcards']);
    });
  }

  cancel() {
    this.router.navigate(['/flashcards']);
  }

  private htmlToMarkdown(html: string): string {
    // Basic conversion: images to markdown, divs/brs to newlines
    let md = html
      .replace(/<img src="([^"]+)"[^>]*>/g, '\n![image]($1)\n')
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br>/g, '\n')
      .replace(/&nbsp;/g, ' ');
    
    // Strip other tags
    md = md.replace(/<[^>]*>/g, '');
    return md.trim();
  }
}
