import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <nav class="glass main-nav">
        <div class="logo" routerLink="/dashboard">
          <span class="brand">MedStudy</span>
          <div class="dot"></div>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/banco-questoes" routerLinkActive="active">Banco de Dados</a>
          <a routerLink="/simulados" routerLinkActive="active">Simulados</a>
          <a routerLink="/analytics/area" routerLinkActive="active">Análise Área</a>
          <a routerLink="/analytics/tema" routerLinkActive="active">Análise Tema</a>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <span class="initials">{{ user()?.nome?.charAt(0) || 'E' }}</span>
          </div>
          <span class="user-name">{{ user()?.nome || 'Estudante' }}</span>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </nav>
      
      <main class="content-area">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background: var(--color-bg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .main-nav { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 16px 40px; 
      border-radius: 24px;
      margin-bottom: 8px;
      border: 1px solid var(--color-border);
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
      background: var(--color-surface-glass);
      
      .logo {
        display: flex; align-items: baseline; gap: 4px; cursor: pointer;
        .brand { font-size: 1.5rem; font-weight: 800; color: var(--color-text); letter-spacing: -0.5px; }
        .dot { width: 6px; height: 6px; background: var(--color-accent); border-radius: 50%; box-shadow: 0 0 10px var(--color-accent); }
      }

      .nav-links {
        display: flex; gap: 24px; align-items: center;
        .nav-divider { width: 1px; height: 20px; background: var(--color-border); margin: 0 4px; }
        a { 
          color: var(--color-text); text-decoration: none; font-weight: 700; font-size: 0.9rem; opacity: 0.5;
          transition: all 0.3s ease;
          position: relative;
          &.active, &:hover { 
            opacity: 1; color: var(--color-accent); 
            &::after { width: 100%; }
          }
          &::after {
            content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
            background: var(--color-accent); transition: width 0.3s ease;
          }
        }
      }

      .user-info {
        display: flex; align-items: center; gap: 12px;
        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--color-accent); display: flex; align-items: center; justify-content: center;
          .initials { font-weight: 700; font-size: 0.75rem; color: white; }
        }
        .user-name { font-size: 0.85rem; font-weight: 500; color: var(--color-text); }
        .btn-logout {
          background: rgba(var(--color-accent-rgb), 0.1); border: 1px solid var(--color-border);
          color: var(--color-text); padding: 4px 12px; border-radius: 6px; font-size: 0.75rem;
          cursor: pointer; font-weight: 600;
          &:hover { background: rgba(255, 77, 109, 0.1); color: #FF4D6D; }
        }
      }
    }

    .content-area {
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }

    .glass {
      background: var(--color-surface-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--color-border);
    }
  `]
})
export class ShellComponent {
  private store = inject(Store);
  user = this.store.selectSignal(selectUser);

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
