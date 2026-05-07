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
        <div class="logo">
          <span class="brand">MedStudy</span>
          <div class="dot"></div>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <span class="initials">E</span>
          </div>
          <span class="user-name">Olá, {{ user()?.nome || 'Estudante' }}</span>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </nav>
      
      <main class="fade-in">
        <header>
          <h1>Dashboard</h1>
          <p>Seu sistema de estudos inteligente está pronto para hoje.</p>
        </header>
        
        <section class="theme-playground glass">
          <div class="section-header">
            <h3>🎨 Personalização</h3>
            <p>Escolha uma paleta que combine com seu momento de foco.</p>
          </div>
          
          <div class="theme-grid">
            <button *ngFor="let t of themes" 
                    class="theme-card"
                    [class.active]="themeService.activeTheme() === t"
                    (click)="changeTheme(t)">
              <div class="color-preview" [attr.data-theme]="t"></div>
              <span>{{ t | titlecase }}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-shell { 
      min-height: 100vh;
      background: var(--color-bg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    nav { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 16px 32px; 
      border-radius: 20px;
      
      .logo {
        display: flex; align-items: baseline; gap: 2px;
        .brand { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
        .dot { width: 6px; height: 6px; background: var(--color-accent); border-radius: 50%; }
      }

      .user-info {
        display: flex; align-items: center; gap: 16px;
        .user-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--color-accent); display: flex; align-items: center; justify-content: center;
          .initials { font-weight: 700; font-size: 0.8rem; color: white; }
        }
        .user-name { font-size: 0.9rem; font-weight: 500; }
        .btn-logout {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text); padding: 6px 16px; border-radius: 8px; font-size: 0.8rem;
          &:hover { background: rgba(255, 77, 109, 0.1); color: #FF4D6D; }
        }
      }
    }

    main {
      max-width: 1000px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 40px;

      h1 { font-size: 2.5rem; margin-bottom: 8px; }
      p { font-size: 1.1rem; }
    }

    .theme-playground {
      padding: 32px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;

      .section-header h3 { font-size: 1.25rem; margin-bottom: 4px; }
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }

    .theme-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: var(--color-text);
      transition: all 0.3s ease;

      &:hover { transform: translateY(-4px); background: rgba(255,255,255,0.06); }
      &.active { border-color: var(--color-accent); box-shadow: 0 0 15px rgba(var(--color-accent), 0.2); }

      .color-preview {
        width: 100%;
        height: 40px;
        border-radius: 8px;
        background: var(--color-primary); // This will use the theme's primary color
      }
      
      span { font-size: 0.85rem; font-weight: 600; }
    }

    .fade-in { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DashboardComponent {
  private store = inject(Store);
  public themeService = inject(ThemeService);
  
  user = this.store.selectSignal(selectUser);
  themes: AppTheme[] = ['rosa', 'claro', 'escuro', 'verde', 'azul', 'vermelho', 'roxo', 'laranja'];

  changeTheme(theme: any) {
    this.themeService.setTheme(theme);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
