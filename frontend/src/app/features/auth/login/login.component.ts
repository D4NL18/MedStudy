import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '@store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '@store/auth/auth.selectors';


/**
 * Angular component for the Login feature.
 * @description Handles the presentation logic and user interactions for the Login view.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loginForm = this.fb.group({
    email: ['admin@medstudy.com', [Validators.required, Validators.email]],
    senha: ['admin123', [Validators.required, Validators.minLength(6)]]
  });

  loading = this.store.selectSignal(selectAuthLoading);
  error = this.store.selectSignal(selectAuthError);
  
  // Toggle for showing password
  showPassword = signal(false);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ 
        email: email!, 
        senha: senha! 
      }));
    }
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
