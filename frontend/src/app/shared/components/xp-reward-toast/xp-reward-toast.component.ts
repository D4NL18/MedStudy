import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicService } from '@core/services/clinic.service';

/**
 * Toast flutuante animado de recompensa de estudo: "+{xp} XP (Salvo na Clínica)" (P-081, P-086).
 */
@Component({
  selector: 'app-xp-reward-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (clinicService.xpToast(); as reward) {
      <div
        class="xp-reward-toast"
        role="status"
        aria-live="polite"
        data-testid="xp-reward-toast"
        (click)="clinicService.dismissXpToast()"
      >
        <div class="xp-toast-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path
              d="M12 2L14.8 8.2L21.5 9.1L16.6 13.8L17.8 20.5L12 17.3L6.2 20.5L7.4 13.8L2.5 9.1L9.2 8.2L12 2Z"
              fill="#F59E0B"
              stroke="#FEF3C7"
              stroke-width="1.5"
            />
          </svg>
        </div>
        <div class="xp-toast-body">
          <span class="xp-toast-amount" data-testid="xp-toast-amount">
            +{{ reward.xpEarned }} XP (Salvo na Clínica)
          </span>
          @if (reward.streakMultiplierPercent > 0) {
            <span class="xp-toast-streak">
              🔥 Ofensiva {{ reward.currentStreakDays }}d (+{{ reward.streakMultiplierPercent }}% bônus)
            </span>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .xp-reward-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1200;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-radius: 9999px;
        background: #0f172a;
        color: #f8fafc;
        border: 1.5px solid #f59e0b;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.35);
        cursor: pointer;
        animation: xpToastFloatIn 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .xp-toast-icon {
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        background: rgba(245, 158, 11, 0.16);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .xp-toast-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .xp-toast-amount {
        font-family: 'JetBrains Mono', monospace;
        font-variant-numeric: tabular-nums;
        font-size: 0.9rem;
        font-weight: 700;
        color: #fbbf24;
      }

      .xp-toast-streak {
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        color: #cbd5e1;
      }

      @keyframes xpToastFloatIn {
        from {
          opacity: 0;
          transform: translateY(14px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `
  ]
})
export class XpRewardToastComponent {
  readonly clinicService = inject(ClinicService);
}
