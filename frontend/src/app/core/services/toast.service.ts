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

  badge(badgeName: string) {
    this.snackBar.open(`🏆 Parabéns! Você conquistou: ${badgeName}`, 'UAU!', {
      duration: 6000,
      panelClass: ['toast-badge'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
