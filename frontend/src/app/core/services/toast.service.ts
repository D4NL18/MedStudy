import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['toast-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['toast-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  badge(badge: any) {
    let msg = `🏆 Parabéns! Você conquistou: ${badge.displayName || badge.name || badge}`;
    if (badge.description) {
      msg += ` - ${badge.description}`;
    }
    this.snackBar.open(msg, 'UAU!', {
      duration: 8000,
      panelClass: ['toast-badge'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
