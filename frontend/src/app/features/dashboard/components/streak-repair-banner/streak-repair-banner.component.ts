import { Component, Input, Output, EventEmitter, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { StreakRepairService } from '@core/services/streak-repair.service';
import { StreakStatusResponse } from '@core/models/streak-repair.model';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-streak-repair-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="status()?.streakAtRisk" class="streak-repair-card glass animate-fade-in">
      <div class="glow-accent"></div>
      
      <div class="content-left">
        <div class="icon-wrap warning-pulse">
          <lucide-icon name="flame" [size]="28" class="flame-icon"></lucide-icon>
          <span class="warning-badge">!</span>
        </div>
        
        <div class="text-block">
          <div class="badge-title">
            <span class="pill-badge">RESGATE DE OFENSIVA</span>
            <span class="countdown-badge">
              <lucide-icon name="clock" [size]="14"></lucide-icon>
              {{ remainingTime() }} restante
            </span>
          </div>
          <h3>Sua Ofensiva de {{ status()?.currentStreak }} dias está em risco!</h3>
          <p>
            Você não estudou ontem, mas o <strong>Plantão de Resgate</strong> está aberto.
            Complete sua meta diária intensiva de revisões para restaurar seu streak sem quebrar seu recorde.
          </p>

          <div class="progress-container">
            <div class="progress-labels">
              <span>Meta de recuperação</span>
              <span><strong>{{ status()?.currentRepairedCount }}</strong> / {{ status()?.requiredCardsCount }} cards</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" [style.width.%]="progressPercent()"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-right">
        <div class="action-buttons">
          <button 
            *ngIf="canExecuteRepair()" 
            class="btn-repair glow-btn"
            [disabled]="isRepairing()"
            (click)="triggerRepair()">
            <lucide-icon name="check-circle" [size]="18"></lucide-icon>
            {{ isRepairing() ? 'Resgatando...' : 'Resgatar Streak Agora' }}
          </button>

          <button 
            *ngIf="!canExecuteRepair()" 
            class="btn-action pulse-cta"
            (click)="goToStudy()">
            <lucide-icon name="play" [size]="18"></lucide-icon>
            Continuar Missão
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .streak-repair-card {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      padding: 24px 28px;
      margin-bottom: 24px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08));
      border: 1px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 10px 30px rgba(245, 158, 11, 0.15);
      backdrop-filter: blur(16px);
      overflow: hidden;

      @media (max-width: 900px) {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .glow-accent {
      position: absolute;
      top: -40px;
      right: -40px;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }

    .content-left {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      flex: 1;

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    .icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #F59E0B, #DC2626);
      box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
      flex-shrink: 0;

      .flame-icon {
        color: #ffffff;
      }

      .warning-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #ffffff;
        color: #DC2626;
        font-weight: 900;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
    }

    .text-block {
      flex: 1;

      .badge-title {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        flex-wrap: wrap;

        .pill-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .countdown-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 3px 8px;
          border-radius: 6px;
        }
      }

      h3 {
        margin: 0 0 6px;
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--color-text, #ffffff);
      }

      p {
        margin: 0 0 16px;
        font-size: 0.88rem;
        line-height: 1.45;
        color: var(--color-text-muted, #94A3B8);

        strong {
          color: #F59E0B;
        }
      }
    }

    .progress-container {
      max-width: 460px;

      .progress-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.78rem;
        color: var(--color-text-muted, #94A3B8);
        margin-bottom: 6px;

        strong {
          color: var(--color-text, #ffffff);
        }
      }

      .progress-bar-bg {
        height: 8px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 999px;
        overflow: hidden;

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #F59E0B, #10B981);
          border-radius: 999px;
          transition: width 0.4s ease-out;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      }
    }

    .content-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .action-buttons {
        button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;

          @media (max-width: 900px) {
            width: 100%;
            justify-content: center;
          }
        }

        .btn-action {
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(245, 158, 11, 0.45);
          }
        }

        .btn-repair {
          background: linear-gradient(135deg, #10B981, #059669);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);

          &:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5);
          }
        }
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    .warning-pulse {
      animation: pulse 2.5s infinite ease-in-out;
    }
  `]
})
export class StreakRepairBannerComponent implements OnInit {
  private streakRepairService = inject(StreakRepairService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  status = signal<StreakStatusResponse | null>(null);
  isRepairing = signal(false);

  remainingTime = computed(() => {
    const deadline = this.status()?.repairDeadline;
    if (!deadline) return '24h';
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  });

  progressPercent = computed(() => {
    const st = this.status();
    if (!st || st.requiredCardsCount <= 0) return 0;
    return Math.min(100, Math.round((st.currentRepairedCount / st.requiredCardsCount) * 100));
  });

  canExecuteRepair = computed(() => {
    const st = this.status();
    return !!st && st.canRepair && st.currentRepairedCount >= st.requiredCardsCount;
  });

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.streakRepairService.getStreakStatus().subscribe({
      next: (res) => this.status.set(res)
    });
  }

  goToStudy() {
    this.router.navigate(['/flashcards']);
  }

  triggerRepair() {
    this.isRepairing.set(true);
    this.streakRepairService.repairStreak().subscribe({
      next: (res) => {
        this.isRepairing.set(false);
        if (res.success) {
          this.toastService.success(res.message || 'Streak recuperado com sucesso!');
          this.status.update(s => s ? { ...s, streakAtRisk: false, currentStreak: res.newStreak } : null);
        } else {
          this.toastService.error(res.message || 'Não foi possível restaurar o streak.');
        }
      },
      error: () => {
        this.isRepairing.set(false);
        this.toastService.error('Erro de conexão ao processar resgate de streak.');
      }
    });
  }
}
