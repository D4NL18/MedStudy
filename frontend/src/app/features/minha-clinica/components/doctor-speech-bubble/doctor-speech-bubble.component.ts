import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Balão de fala flutuante do Médico Virtual (P-088).
 * Apresenta dicas clínicas, incentivo à repetição espaçada e frases acolhedoras.
 */
@Component({
  selector: 'app-doctor-speech-bubble',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="doctor-speech-bubble"
      role="tooltip"
      [attr.aria-label]="'Dica do Médico: ' + message"
      data-testid="doctor-speech-bubble"
    >
      <div class="bubble-content">
        <span class="bubble-icon" aria-hidden="true">💡</span>
        <span class="bubble-text">{{ message }}</span>
        <button
          type="button"
          class="btn-close-bubble"
          (click)="closed.emit(); $event.stopPropagation()"
          aria-label="Fechar balão"
          title="Fechar"
        >
          ✕
        </button>
      </div>
      <div class="bubble-tail" aria-hidden="true"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-12px);
        z-index: 9999;
        pointer-events: auto;
        animation: bubblePop 240ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .doctor-speech-bubble {
        position: relative;
        max-width: 250px;
        min-width: 180px;
        background: #0f172a;
        color: #f8fafc;
        border: 1.5px solid #0d9488;
        border-radius: 12px;
        padding: 10px 12px;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.35);
        font-family: 'Inter', sans-serif;
      }

      .bubble-content {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .bubble-icon {
        font-size: 1rem;
        flex-shrink: 0;
      }

      .bubble-text {
        font-size: 0.78rem;
        line-height: 1.35;
        color: #f1f5f9;
        flex: 1;
      }

      .btn-close-bubble {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 0.7rem;
        cursor: pointer;
        padding: 0 2px;
        line-height: 1;
        transition: color 120ms ease;
      }

      .btn-close-bubble:hover {
        color: #f8fafc;
      }

      .bubble-tail {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 8px solid #0d9488;
      }

      .bubble-tail::after {
        content: '';
        position: absolute;
        bottom: 1.5px;
        left: -6px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 7px solid #0f172a;
      }

      @keyframes bubblePop {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(0) scale(0.85);
        }
        100% {
          opacity: 1;
          transform: translateX(-50%) translateY(-12px) scale(1);
        }
      }
    `
  ]
})
export class DoctorSpeechBubbleComponent {
  @Input({ required: true }) message = '';
  @Output() readonly closed = new EventEmitter<void>();
}
