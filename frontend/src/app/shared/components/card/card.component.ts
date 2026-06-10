import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() variant: 'default' | 'elevated' | 'glass' | 'outline' = 'default';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;

  get cardClasses(): string {
    return `card card-${this.variant} padding-${this.padding} ${this.hoverable ? 'card-hoverable' : ''}`;
  }
}
