import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-offline-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="offline-container">
      <div class="offline-content">
        <lucide-icon name="cloud-off" class="offline-icon"></lucide-icon>
        <h1>Sem Conexão</h1>
        <p>Esta seção ainda não foi baixada para uso offline.</p>
        <a routerLink="/dashboard" class="btn-primary">
          Ir para o Dashboard
        </a>
      </div>
    </div>
  `,
  styles: [`
    .offline-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 2rem;
    }

    .offline-content {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      max-width: 400px;
      width: 100%;
    }

    .offline-icon {
      width: 64px;
      height: 64px;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: 1.5rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    p {
      color: #64748b;
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #1a73e8;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      width: 100%;

      &:hover {
        background: #1557b0;
        transform: translateY(-1px);
      }
    }
  `]
})
export class OfflinePageComponent {}
