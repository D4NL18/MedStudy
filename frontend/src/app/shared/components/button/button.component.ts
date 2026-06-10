import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type ButtonVariant = 'primary' | 'secondary' | 'cta' | 'icon' | 'destructive' | 'outline' | 'ghost' | string;

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;

  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const v = this.variant || 'primary';
    const baseClass = (v.startsWith('btn-') || v.includes(' ')) ? v : `btn-${v}`;
    return `btn ${baseClass} ${this.icon && !this.hasContent() ? 'btn-icon-only' : ''}`;
  }

  // To check if there is projected content, though usually we can just rely on css empty
  // For now, we will handle css empty in the styles
  hasContent(): boolean {
    return true; // We can improve this if needed, but styling :empty pseudo-class is better.
  }

  handleClick(event: Event) {
    if (!this.disabled) {
      this.onClick.emit(event);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
