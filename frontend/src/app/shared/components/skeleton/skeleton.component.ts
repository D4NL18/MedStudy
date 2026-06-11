import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton-base"
      [ngClass]="[variant, customClass]"
      [ngStyle]="{
        'width': width,
        'height': height,
        'border-radius': borderRadius
      }"
    ></div>
  `,
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() variant: 'line' | 'circle' | 'block' = 'line';
  @Input() width?: string;
  @Input() height?: string;
  @Input() borderRadius?: string;
  @Input() customClass: string = '';
}
