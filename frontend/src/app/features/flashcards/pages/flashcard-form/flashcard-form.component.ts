import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, inject, ElementRef, ViewChild, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardService } from '@core/services/flashcard.service';
import { ImagePasteDirective } from '@shared/directives/image-paste.directive';
import { ImageCompressorService } from '@core/services/image-compressor.service';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


/**
 * Angular component for the Flashcard Form feature.
 * @description Handles the presentation logic and user interactions for the Flashcard Form view.
 */
@Component({
  selector: 'app-flashcard-form',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule, ImagePasteDirective, LucideAngularModule, ModalLayoutComponent],
  templateUrl: './flashcard-form.component.html',
  styleUrl: './flashcard-form.component.scss'
})
export class FlashcardFormComponent implements OnInit {
  private flashcardService = inject(FlashcardService);
  private imageCompressor = inject(ImageCompressorService);
  private dialogRef = inject(MatDialogRef<FlashcardFormComponent>);

  @ViewChild('frenteEditor') frenteEditor!: ElementRef<HTMLDivElement>;
  @ViewChild('versoEditor') versoEditor!: ElementRef<HTMLDivElement>;

  grandeArea = 'Clínica Médica';
  areas = ['Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia', 'Preventiva'];
  
  isEdit = false;
  editingId: string | null = null;
  loading = false;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.flashcard) {
      this.isEdit = true;
      this.editingId = data.flashcard.id;
      this.grandeArea = data.flashcard.grandeArea;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isEdit && this.data.flashcard) {
        this.frenteEditor.nativeElement.innerHTML = this.markdownToHtml(this.data.flashcard.frente);
        this.versoEditor.nativeElement.innerHTML = this.markdownToHtml(this.data.flashcard.verso);
      }
    }, 100);
  }

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

    this.loading = true;
    const payload = {
      frente: this.htmlToMarkdown(frenteHtml),
      verso: this.htmlToMarkdown(versoHtml),
      grandeArea: this.grandeArea
    };

    if (this.isEdit && this.editingId) {
      this.flashcardService.updateFlashcard(this.editingId, payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => this.loading = false
      });
    } else {
      this.flashcardService.createFlashcard(payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => this.loading = false
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  private htmlToMarkdown(html: string): string {
    let md = html
      .replace(/<img src="([^"]+)"[^>]*>/g, '\n![image]($1)\n')
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br>/g, '\n')
      .replace(/&nbsp;/g, ' ');
    md = md.replace(/<[^>]*>/g, '');
    return md.trim();
  }

  private markdownToHtml(md: string): string {
    if (!md) return '';
    let html = md.replace(/\n!\[image\]\((.*?)\)\n/g, '<img src="$1" style="max-width: 100%; border-radius: 8px; margin: 8px 0;">');
    html = html.replace(/\n/g, '<br>');
    return html;
  }
}
