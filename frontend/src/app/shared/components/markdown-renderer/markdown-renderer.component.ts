import { Component, Input, OnChanges, ChangeDetectorRef, inject } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';


/**
 * Angular component for the Markdown Renderer feature.
 * @description Handles the presentation logic and user interactions for the Markdown Renderer view.
 */
@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './markdown-renderer.component.html',
  styleUrl: './markdown-renderer.component.scss'
})
export class MarkdownRendererComponent implements OnChanges {
  @Input() data: any = '';
  processedData = '';
  private cdr = inject(ChangeDetectorRef);

  ngOnChanges() {
    this.processedData = this.processData(this.data);
    this.cdr.detectChanges();
  }

  private processData(input: any): string {
    if (!input) return '';
    let parsed = input;
    if (typeof input === 'string') {
      if (input.trim().startsWith('{"type":"doc"')) {
        try {
          parsed = JSON.parse(input);
        } catch (e) {
          return input;
        }
      } else {
        return input;
      }
    }
    
    if (typeof parsed === 'object' && parsed.type === 'doc') {
      return this.tipTapToMarkdown(parsed);
    }
    return String(input);
  }

  private tipTapToMarkdown(node: any): string {
    if (!node) return '';
    if (node.type === 'text') {
      let text = node.text || '';
      if (node.marks) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') text = `**${text}**`;
          if (mark.type === 'italic') text = `*${text}*`;
        });
      }
      return text;
    }
    if (node.type === 'image') {
      return `\n![image](${node.attrs?.src || ''})\n`;
    }
    if (node.type === 'paragraph') {
      const content = (node.content || []).map((c: any) => this.tipTapToMarkdown(c)).join('');
      return `${content}\n\n`;
    }
    if (node.content && Array.isArray(node.content)) {
      return node.content.map((c: any) => this.tipTapToMarkdown(c)).join('');
    }
    return '';
  }
}
