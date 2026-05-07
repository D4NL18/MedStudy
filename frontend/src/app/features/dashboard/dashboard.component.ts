import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { ThemeService, AppTheme } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-shell">
      <nav class="glass">
        <div class="logo">MedStudy</div>
        <div class="user-info">
          <span>Olá, {{ user()?.nome }}</span>
          <button (click)="logout()">Sair</button>
        </div>
      </nav>
      
      <main>
        <h1>Dashboard</h1>
        <p>Seu sistema de estudos está pronto.</p>
        
        <section class="theme-test">
          <h3>Teste de Temas</h3>
          <div class="theme-buttons">
            <button *ngFor="let t of themes" 
                    [style.background]="t"
                    (click)="changeTheme(t)">
              {{ t | titlecase }}
            </button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-shell { padding: 20px; }
    nav { 
      display: flex; justify-content: space-between; padding: 15px 30px; 
      border-radius: 15px; margin-bottom: 30px;
    }
    .theme-buttons { display: flex; gap: 10px; margin-top: 15px; }
    button { padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); color: white; }
    .theme-test { margin-top: 40px; padding: 20px; border: 1px dashed var(--color-accent); border-radius: 15px; }
  `]
})
export class DashboardComponent {
  private store = inject(Store);
  private themeService = inject(ThemeService);
  
  user = this.store.selectSignal(selectUser);
  themes: AppTheme[] = ['rosa', 'claro', 'escuro', 'verde', 'azul', 'vermelho', 'roxo', 'laranja'];

  changeTheme(theme: any) {
    this.themeService.setTheme(theme);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
