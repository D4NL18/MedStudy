import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '@store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '@store/auth/auth.selectors';


import { LucideAngularModule } from 'lucide-angular';

/**
 * Angular component for the Login feature.
 * @description Handles the presentation logic and user interactions for the Login view.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
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

  get friendlyError(): string | null {
    const currentError = this.error();
    if (!currentError) return null;
    
    const lowerError = currentError.toLowerCase();

    if (lowerError.includes('jwt') || lowerError.includes('96 bits') || lowerError.includes('hmac-sha')) {
      return 'Erro interno do servidor: Configuração de segurança inválida. Por favor, contate o suporte.';
    }
    
    if (lowerError.includes('bad credentials') || lowerError.includes('invalid credentials') || lowerError.includes('401') || lowerError.includes('403')) {
      return 'E-mail ou senha incorretos.';
    }

    if (lowerError.includes('connection refused') || lowerError.includes('unknown error') || lowerError.includes('0 unknown')) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }

    if (currentError.length > 100 || currentError.includes('Exception') || currentError.includes('java.')) {
      return 'Ocorreu um erro inesperado ao fazer login. Tente novamente mais tarde.';
    }

    return currentError;
  }
}
