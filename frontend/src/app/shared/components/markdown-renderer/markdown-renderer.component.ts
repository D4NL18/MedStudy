import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [MarkdownModule],
  template: `
    <div class="markdown-container">
      <markdown [data]="data"></markdown>
    </div>
  `,
  styles: [`
    .markdown-container {
      color: var(--color-text);
      line-height: 1.6;
      font-size: 1rem;
    }
    :host ::ng-deep img {
      max-width: 100%;
      border-radius: 8px;
      margin: 1rem 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class MarkdownRendererComponent {
  @Input() data: string = '';
}
