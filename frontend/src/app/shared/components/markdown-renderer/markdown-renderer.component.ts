import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './markdown-renderer.component.html',
  styleUrl: './markdown-renderer.component.scss'
})
export class MarkdownRendererComponent {
  @Input() data: string = '';
}
