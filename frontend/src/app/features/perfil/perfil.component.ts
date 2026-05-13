import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { BadgeService, UserBadge } from '../../core/services/badge.service';
import { LucideAngularModule } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="perfil-container fade-in">
      <header class="perfil-header">
        <div class="user-info">
          <div class="avatar-large">{{ user()?.nome?.charAt(0) || 'U' }}</div>
          <div class="info-text">
            <h1>{{ user()?.nome }}</h1>
            <p>{{ user()?.email }}</p>
          </div>
        </div>
      </header>

      <div class="perfil-grid">
        <!-- Personalização -->
        <section class="perfil-section glass">
          <div class="section-header">
            <h3>🎨 Personalização</h3>
            <p>Escolha o tema que melhor combina com seu estudo</p>
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

        <!-- Conquistas -->
        <section class="perfil-section glass">
          <div class="section-header">
            <h3>🏆 Galeria de Conquistas</h3>
            <p>Seu progresso e badges conquistadas</p>
          </div>
          
          <div class="badges-grid">
            <div *ngFor="let badge of allPossibleBadges" 
                 class="badge-item" 
                 [class.locked]="!isEarned(badge.type)">
              <div class="badge-icon">
                <lucide-icon [name]="badge.icon"></lucide-icon>
              </div>
              <div class="badge-info">
                <h4>{{ badge.displayName }}</h4>
                <p>{{ badge.description }}</p>
                <span class="earned-date" *ngIf="getEarnedDate(badge.type)">
                  Conquistada em {{ getEarnedDate(badge.type) | date:'dd/MM/yyyy' }}
                </span>
                <span class="locked-text" *ngIf="!isEarned(badge.type)">
                  Bloqueada
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public themeService = inject(ThemeService);
  private badgeService = inject(BadgeService);
  private store = inject(Store);
  
  user = this.store.selectSignal(selectUser);
  earnedBadges = signal<UserBadge[]>([]);
  
  themes: AppTheme[] = ['verde', 'azul', 'rosa', 'roxo', 'laranja', 'vermelho', 'claro', 'escuro'];

  allPossibleBadges = [
    { type: 'STREAK_7', displayName: 'Mestre da Ofensiva', description: '7 dias seguidos de estudo', icon: 'zap' },
    { type: 'QUESTIONS_1000', displayName: 'Maratonista de Questões', description: 'Resolveu 1000 questões', icon: 'target' },
    { type: 'SIMULADOS_10', displayName: 'Estratega de Simulados', description: 'Realizou 10 simulados completos', icon: 'award' }
  ];

  ngOnInit() {
    this.badgeService.getUserBadges().subscribe(badges => {
      this.earnedBadges.set(badges);
    });
  }

  changeTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
  }

  isEarned(type: string): boolean {
    return this.earnedBadges().some(b => b.type === type);
  }

  getEarnedDate(type: string): string | null {
    const badge = this.earnedBadges().find(b => b.type === type);
    return badge ? badge.earnedAt : null;
  }
}
