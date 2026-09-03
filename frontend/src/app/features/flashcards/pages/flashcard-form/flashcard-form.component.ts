import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, inject, ElementRef, ViewChild, OnInit, AfterViewInit, Inject, Optional } from '@angular/core';
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
export class FlashcardFormComponent implements OnInit, AfterViewInit {
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
      
      const incomingArea = data.flashcard.grandeArea;
      const matched = this.areas.find(a => this.normalizeString(a) === this.normalizeString(incomingArea));
      this.grandeArea = matched || incomingArea;
    }
  }

  private normalizeString(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.isEdit && this.data?.flashcard) {
      this.frenteEditor.nativeElement.innerHTML = this.toEditorHtml(this.data.flashcard.frente);
      this.versoEditor.nativeElement.innerHTML = this.toEditorHtml(this.data.flashcard.verso);
    }
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

  toEditorHtml(content: any): string {
    if (!content) return '';
    try {
      let parsed = content;
      if (typeof parsed === 'string') {
        const trimmed = parsed.trim();
        if (trimmed.startsWith('{') || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
          try {
            const temp = JSON.parse(trimmed);
            if (typeof temp === 'object' && temp !== null) {
              parsed = temp;
            } else if (typeof temp === 'string' && temp.trim().startsWith('{')) {
              parsed = JSON.parse(temp);
            }
          } catch (e) {
            // Keep as string
          }
        }
      }

      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.type === 'doc' || parsed.content) {
          const html = this.tipTapToHtml(parsed);
          if (html) return html;
        }
      }

      return this.markdownToHtml(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
    } catch (e) {
      console.error('Error converting flashcard content to HTML:', e);
      return typeof content === 'string' ? content : '';
    }
  }

  private tipTapToHtml(node: any): string {
    if (!node) return '';
    if (typeof node === 'string') return node;

    if (node.type === 'text') {
      let text = node.text || '';
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (node.marks && Array.isArray(node.marks)) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`;
          else if (mark.type === 'italic') text = `<em>${text}</em>`;
          else if (mark.type === 'underline') text = `<u>${text}</u>`;
          else if (mark.type === 'strike') text = `<s>${text}</s>`;
        });
      }
      return text;
    }

    if (node.type === 'image') {
      const src = node.attrs?.src || node.src || '';
      if (!src) return '';
      return `<img src="${src}" style="max-width: 100%; border-radius: 8px; margin: 8px 0;">`;
    }

    if (node.type === 'hardBreak') {
      return '<br>';
    }

    if (node.type === 'paragraph') {
      const content = (node.content || []).map((c: any) => this.tipTapToHtml(c)).join('');
      return content ? `<div>${content}</div>` : '<div><br></div>';
    }

    if (node.type === 'bulletList') {
      const items = (node.content || []).map((c: any) => this.tipTapToHtml(c)).join('');
      return `<ul>${items}</ul>`;
    }

    if (node.type === 'orderedList') {
      const items = (node.content || []).map((c: any) => this.tipTapToHtml(c)).join('');
      return `<ol>${items}</ol>`;
    }

    if (node.type === 'listItem') {
      const content = (node.content || []).map((c: any) => this.tipTapToHtml(c)).join('');
      return `<li>${content}</li>`;
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map((c: any) => this.tipTapToHtml(c)).join('');
    }

    return '';
  }

  htmlToMarkdown(html: string): string {
    if (!html) return '';
    let md = html
      .replace(/<img src="([^"]+)"[^>]*>/g, '\n![image]($1)\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<div>/gi, '\n')
      .replace(/<\/div>/gi, '')
      .replace(/<p>/gi, '\n')
      .replace(/<\/p>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>');
    md = md.replace(/<[^>]*>/g, '');
    return md.trim();
  }

  markdownToHtml(md: any): string {
    if (!md || typeof md !== 'string') return '';
    let html = md.replace(/!\[image\]\((.*?)\)/g, '<img src="$1" style="max-width: 100%; border-radius: 8px; margin: 8px 0;">');
    html = html.replace(/\n/g, '<br>');
    return html;
  }
}
