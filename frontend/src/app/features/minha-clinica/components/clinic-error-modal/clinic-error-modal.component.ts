import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-clinic-error-modal',
  standalone: true,
  templateUrl: './clinic-error-modal.component.html',
  styleUrl: './clinic-error-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicErrorModalComponent {
  readonly errorMessage = input<string | null>(null);
  readonly dismiss = output<void>();

  onDismiss(): void {
    this.dismiss.emit();
  }
}
