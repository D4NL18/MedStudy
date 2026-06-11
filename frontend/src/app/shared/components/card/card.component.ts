import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleDirective } from '../../directives/ripple/ripple.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RippleDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() variant: 'default' | 'elevated' | 'glass' | 'outline' = 'default';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;

  get cardClasses(): string {
    return `card card-${this.variant} padding-${this.padding} ${this.hoverable ? 'card-hoverable' : ''}`;
  }
}
