import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


/**
 * Angular component for the Skeleton feature.
 * @description Handles the presentation logic and user interactions for the Skeleton view.
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() variant: 'line' | 'circle' | 'block' = 'line';
  @Input() width?: string;
  @Input() height?: string;
  @Input() borderRadius?: string;
  @Input() customClass: string = '';
}
