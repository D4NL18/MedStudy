import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-create-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <app-button variant="btn-primary" (onClick)="onClick.emit($event)">
      <lucide-icon name="plus" [size]="18"></lucide-icon>
      <ng-content></ng-content>
    </app-button>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class CreateButtonComponent {
  @Output() onClick = new EventEmitter<Event>();
}
