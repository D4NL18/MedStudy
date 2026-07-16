import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '@store/auth/auth.actions';

/**
 * Register.
 * @description Provides register functionality.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private store = inject(Store);

  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  showPassword = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
        ]
      ]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('showWelcomeTrial', 'true');
        this.store.dispatch(AuthActions.loginSuccess({ response }));
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'Este e-mail já está em uso. Tente fazer login ou recupere sua senha.';
        } else {
          this.errorMessage = 'Ocorreu um erro ao criar a conta. Tente novamente mais tarde.';
        }
      }
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
