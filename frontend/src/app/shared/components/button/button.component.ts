import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RippleDirective } from '../../directives/ripple/ripple.directive';


/**
 * Angular component for the Button feature.
 * @description Handles the presentation logic and user interactions for the Button view.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'cta' | 'icon' | 'destructive' | 'outline' | 'ghost' | string;

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RippleDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() customClass = '';

  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const v = this.variant || 'primary';
    const baseClass = (v.startsWith('btn-') || v.includes(' ')) ? v : `btn-${v}`;
    const classes = `btn ${baseClass} ${this.icon && !this.hasContent() ? 'btn-icon-only' : ''}`;
    return this.customClass ? `${classes} ${this.customClass}`.trim() : classes.trim();
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
