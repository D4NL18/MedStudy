import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorGender } from '@core/models/clinic.model';

/**
 * Componente SVG Isométrico 2.5D do Médico Residente da Clínica (P-087, P-088, P-089).
 * Renderização em camadas desacopladas (Body, Coat, Stethoscope, Accessory)
 * com animação de respiração suave e micro-aceno/salto ao interagir.
 */
@Component({
  selector: 'app-doctor-avatar-svg',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="doctor-avatar-container"
      [class.is-animating]="activeAnimation"
      [class.is-paused]="paused"
      [style.width.px]="width"
      [style.height.px]="height"
      role="img"
      [attr.aria-label]="avatarAriaLabel"
    >
      <svg
        [attr.viewBox]="'0 0 72 100'"
        [attr.width]="width"
        [attr.height]="height"
        class="doctor-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Sombra Suave no Solo Isométrico -->
          <radialGradient id="avatarFloorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(15, 23, 42, 0.35)" />
            <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
          </radialGradient>

          <!-- Gradientes dos Jalecos -->
          <linearGradient id="coatDefaultGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#F1F5F9" />
          </linearGradient>

          <linearGradient id="coatPediatricGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#ECFDF5" />
          </linearGradient>

          <linearGradient id="coatGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FEF3C7" />
            <stop offset="50%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#FDE68A" />
          </linearGradient>

          <!-- Gradiente Touca Cirúrgica Teal -->
          <linearGradient id="scrubCapGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0D9488" />
            <stop offset="100%" stop-color="#115E59" />
          </linearGradient>
        </defs>

        <!-- SOMBRA NO CHÃO -->
        <ellipse cx="36" cy="94" rx="20" ry="6" fill="url(#avatarFloorShadow)" />

        <!-- GRUPO DO CORPO COM ANIMAÇÃO DE RESPIRAÇÃO -->
        <g class="doctor-breathing-group">
          <!-- PERNAS & SAPATOS -->
          <!-- Perna Esquerda -->
          <rect x="27" y="68" width="7" height="20" rx="3.5" fill="#334155" />
          <path d="M26 86 C26 84 34 84 34 86 L35 91 C35 93 25 93 25 91 Z" fill="#0F172A" />
          <!-- Perna Direita -->
          <rect x="38" y="68" width="7" height="20" rx="3.5" fill="#1E293B" />
          <path d="M37 86 C37 84 45 84 45 86 L46 91 C46 93 36 93 36 91 Z" fill="#0F172A" />

          <!-- CAMADA 1: CORPO BASE (GÊNERO MASCULINO OU FEMININO) -->
          @if (gender === 'FEMALE') {
            <!-- Tronco Feminino (Roupa Interna Teal Suave) -->
            <path d="M25 40 Q36 43 47 40 L45 70 Q36 72 27 70 Z" fill="#0D9488" opacity="0.85" />

            <!-- Cabeça Feminina -->
            <!-- Cabelo Traseiro -->
            <path d="M22 20 Q36 8 50 20 Q54 32 48 38 Q36 40 24 38 Q18 32 22 20 Z" fill="#451A03" />
            <!-- Coque / Rabo Elegante -->
            <circle cx="36" cy="11" r="7" fill="#3B1502" />

            <!-- Rosto -->
            <ellipse cx="36" cy="24" rx="11" ry="12" fill="#FBD5C5" />
            <!-- Cabelo Frontal / Franja Lateral -->
            <path d="M24 20 Q36 12 47 18 Q45 25 40 21 Q34 21 27 24 Z" fill="#451A03" />
            <!-- Olhos Acolhedores -->
            <circle cx="32" cy="24" r="1.5" fill="#1E293B" />
            <circle cx="40" cy="24" r="1.5" fill="#1E293B" />
            <!-- Brilho nos Olhos -->
            <circle cx="32.5" cy="23.5" r="0.5" fill="#FFFFFF" />
            <circle cx="40.5" cy="23.5" r="0.5" fill="#FFFFFF" />
            <!-- Sorriso Suave -->
            <path d="M33 29 Q36 31 39 29" stroke="#E11D48" stroke-width="1.2" stroke-linecap="round" fill="none" />
            <!-- Bochechas Coradas -->
            <circle cx="29" cy="27" r="1.8" fill="#FDA4AF" opacity="0.6" />
            <circle cx="43" cy="27" r="1.8" fill="#FDA4AF" opacity="0.6" />
          } @else {
            <!-- Tronco Masculino (Roupa Interna Azul Profissional) -->
            <path d="M24 38 Q36 40 48 38 L46 70 Q36 72 26 70 Z" fill="#0284C7" opacity="0.85" />

            <!-- Rosto Masculino -->
            <ellipse cx="36" cy="24" rx="11.5" ry="12.5" fill="#FBD5C5" />
            <!-- Cabelo Masculino Estiloso -->
            <path d="M23 19 Q36 9 49 16 Q50 24 48 24 Q45 16 36 16 Q27 16 24 24 Z" fill="#292524" />
            <!-- Olhos Firmes & Acolhedores -->
            <circle cx="32" cy="24" r="1.5" fill="#1E293B" />
            <circle cx="40" cy="24" r="1.5" fill="#1E293B" />
            <!-- Brilho nos Olhos -->
            <circle cx="32.5" cy="23.5" r="0.5" fill="#FFFFFF" />
            <circle cx="40.5" cy="23.5" r="0.5" fill="#FFFFFF" />
            <!-- Sobrancelhas -->
            <path d="M30 21 Q32.5 20.5 34 21" stroke="#292524" stroke-width="1" stroke-linecap="round" fill="none" />
            <path d="M38 21 Q39.5 20.5 42 21" stroke="#292524" stroke-width="1" stroke-linecap="round" fill="none" />
            <!-- Sorriso -->
            <path d="M33 29 Q36 31 39 29" stroke="#9A3412" stroke-width="1.2" stroke-linecap="round" fill="none" />
          }

          <!-- CAMADA 2: JALECO MÉDICO (SLOT COAT) -->
          @switch (skinCoat) {
            @case ('coat_pediatric') {
              <!-- Jaleco Pediátrico Lúdico com Botões Coloridos e Ursinho no Bolso -->
              <path
                d="M23 38 L21 68 Q36 71 51 68 L49 38 Q36 41 23 38 Z"
                fill="url(#coatPediatricGrad)"
                stroke="#10B981"
                stroke-width="1.2"
              />
              <!-- Lapela -->
              <path d="M28 38 L36 50 L44 38" fill="#FFFFFF" stroke="#0D9488" stroke-width="1" />
              <!-- Abertura Central -->
              <line x1="36" y1="50" x2="36" y2="70" stroke="#0D9488" stroke-width="1.2" />
              <!-- Botões Coloridos Pastéis -->
              <circle cx="36" cy="54" r="1.4" fill="#F59E0B" />
              <circle cx="36" cy="60" r="1.4" fill="#0D9488" />
              <circle cx="36" cy="66" r="1.4" fill="#EC4899" />
              <!-- Bolso com Estampa de Patinha/Bichinho -->
              <rect x="40" y="55" width="7" height="8" rx="2" fill="#FEF3C7" stroke="#F59E0B" stroke-width="0.8" />
              <circle cx="43.5" cy="58" r="1.2" fill="#D97706" />
              <circle cx="42" cy="56.5" r="0.6" fill="#D97706" />
              <circle cx="45" cy="56.5" r="0.6" fill="#D97706" />
              <!-- Mangas -->
              <path d="M23 39 L16 57 Q18 60 21 58 L26 44 Z" fill="#FFFFFF" stroke="#10B981" stroke-width="1" />
              <path d="M49 39 L56 57 Q54 60 51 58 L46 44 Z" fill="#FFFFFF" stroke="#10B981" stroke-width="1" />
              <!-- Mãos -->
              <circle cx="17" cy="59" r="2.5" fill="#FBD5C5" />
              <circle cx="55" cy="59" r="2.5" fill="#FBD5C5" />
            }
            @case ('coat_gold') {
              <!-- Jaleco Dourado Mestre com Detalhes Ouro e Caduceu -->
              <path
                d="M23 38 L21 68 Q36 72 51 68 L49 38 Q36 41 23 38 Z"
                fill="url(#coatGoldGrad)"
                stroke="#D97706"
                stroke-width="1.4"
              />
              <!-- Lapela Dourada Nobre -->
              <path d="M28 38 L36 51 L44 38" fill="#FEF3C7" stroke="#B45309" stroke-width="1.2" />
              <!-- Abertura Central -->
              <line x1="36" y1="51" x2="36" y2="70" stroke="#B45309" stroke-width="1.4" />
              <!-- Botões Dourados Nobres -->
              <circle cx="36" cy="55" r="1.5" fill="#B45309" />
              <circle cx="36" cy="61" r="1.5" fill="#B45309" />
              <circle cx="36" cy="67" r="1.5" fill="#B45309" />
              <!-- Brasão Dourado de Honra Médica no Peito Esquerdo -->
              <path d="M26 46 L29 44 L32 46 L32 50 L29 52 L26 50 Z" fill="#F59E0B" stroke="#B45309" stroke-width="0.8" />
              <circle cx="29" cy="48" r="1" fill="#FEF3C7" />
              <!-- Mangas com Punho Dourado -->
              <path d="M23 39 L16 57 Q18 60 21 58 L26 44 Z" fill="#FFFFFF" stroke="#D97706" stroke-width="1.2" />
              <rect x="15" y="55" width="6" height="3" rx="1" fill="#F59E0B" />
              <path d="M49 39 L56 57 Q54 60 51 58 L46 44 Z" fill="#FFFFFF" stroke="#D97706" stroke-width="1.2" />
              <rect x="51" y="55" width="6" height="3" rx="1" fill="#F59E0B" />
              <!-- Mãos -->
              <circle cx="17" cy="59" r="2.5" fill="#FBD5C5" />
              <circle cx="55" cy="59" r="2.5" fill="#FBD5C5" />
            }
            @default {
              <!-- Jaleco Branco Clássico (coat_default) -->
              <path
                d="M23 38 L21 68 Q36 71 51 68 L49 38 Q36 41 23 38 Z"
                fill="url(#coatDefaultGrad)"
                stroke="#CBD5E1"
                stroke-width="1.2"
              />
              <!-- Lapela Simples e Elegante -->
              <path d="M28 38 L36 50 L44 38" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1" />
              <!-- Abertura Central -->
              <line x1="36" y1="50" x2="36" y2="70" stroke="#94A3B8" stroke-width="1.2" />
              <!-- Botões Discretos -->
              <circle cx="36" cy="54" r="1.3" fill="#64748B" />
              <circle cx="36" cy="60" r="1.3" fill="#64748B" />
              <circle cx="36" cy="66" r="1.3" fill="#64748B" />
              <!-- Bolso Superior -->
              <rect x="26" y="52" width="6" height="7" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />
              <!-- Canetinha no Bolso -->
              <line x1="28" y1="50" x2="28" y2="54" stroke="#0284C7" stroke-width="1" stroke-linecap="round" />
              <!-- Mangas -->
              <path d="M23 39 L16 57 Q18 60 21 58 L26 44 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
              <path d="M49 39 L56 57 Q54 60 51 58 L46 44 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
              <!-- Mãos -->
              <circle cx="17" cy="59" r="2.5" fill="#FBD5C5" />
              <circle cx="55" cy="59" r="2.5" fill="#FBD5C5" />
            }
          }

          <!-- CAMADA 3: ESTETOSCÓPIO (SLOT STETHOSCOPE) -->
          @switch (skinStethoscope) {
            @case ('steth_elephant') {
              <!-- Esteto Pediátrico Elefantinho Lúdico -->
              <!-- Tubo no Pescoço Ciano -->
              <path
                d="M29 35 C27 46 29 55 33 58 C37 61 38 61 40 58 C44 54 45 46 43 35"
                stroke="#06B6D4"
                stroke-width="2.2"
                stroke-linecap="round"
                fill="none"
              />
              <!-- Campânula Elefantinho -->
              <g transform="translate(34, 57)">
                <!-- Cabeça do Elefante -->
                <circle cx="4" cy="4" r="3.5" fill="#0891B2" stroke="#FFFFFF" stroke-width="0.8" />
                <!-- Orelhas -->
                <circle cx="1" cy="2.5" r="2" fill="#06B6D4" />
                <circle cx="7" cy="2.5" r="2" fill="#06B6D4" />
                <!-- Trombinha -->
                <path d="M4 5 Q4 8 6 7" stroke="#0891B2" stroke-width="1.2" stroke-linecap="round" fill="none" />
              </g>
            }
            @case ('steth_gold') {
              <!-- Esteto Master Ouro -->
              <!-- Tubo Nobre Ouro Reluzente -->
              <path
                d="M29 35 C27 46 29 55 33 58 C37 61 38 61 40 58 C44 54 45 46 43 35"
                stroke="#F59E0B"
                stroke-width="2.4"
                stroke-linecap="round"
                fill="none"
              />
              <!-- Auriculares Dourados -->
              <path d="M29 35 L32 30" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" />
              <path d="M43 35 L40 30" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" />
              <!-- Campânula de Ouro Dupla com Brilho -->
              <circle cx="37" cy="60" r="3.8" fill="#F59E0B" stroke="#B45309" stroke-width="1" />
              <circle cx="37" cy="60" r="2" fill="#FEF3C7" />
            }
            @default {
              <!-- Esteto Standard Clássico (steth_standard) -->
              <path
                d="M29 35 C27 46 29 55 33 58 C37 61 38 61 40 58 C44 54 45 46 43 35"
                stroke="#0F172A"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
              />
              <!-- Auriculares Prateados -->
              <path d="M29 35 L32 30" stroke="#94A3B8" stroke-width="1.4" stroke-linecap="round" />
              <path d="M43 35 L40 30" stroke="#94A3B8" stroke-width="1.4" stroke-linecap="round" />
              <!-- Campânula Cromada Clássica -->
              <circle cx="37" cy="60" r="3.2" fill="#E2E8F0" stroke="#475569" stroke-width="0.9" />
              <circle cx="37" cy="60" r="1.5" fill="#94A3B8" />
            }
          }

          <!-- CAMADA 4: ACESSÓRIO (SLOT ACCESSORY) -->
          @switch (skinAccessory) {
            @case ('acc_red_bowtie') {
              <!-- Gravata Borboleta Vermelha -->
              <g transform="translate(36, 42)">
                <!-- Nó Central -->
                <circle cx="0" cy="0" r="1.8" fill="#991B1B" />
                <!-- Asa Esquerda -->
                <path d="M-1 0 L-6 -3.5 L-6 3.5 Z" fill="#DC2626" stroke="#991B1B" stroke-width="0.6" />
                <!-- Asa Direita -->
                <path d="M1 0 L6 -3.5 L6 3.5 Z" fill="#DC2626" stroke="#991B1B" stroke-width="0.6" />
              </g>
            }
            @case ('acc_scrub_cap') {
              <!-- Touca Cirúrgica Teal Moderna -->
              <path
                d="M23 20 C23 10 49 10 49 20 C50 24 22 24 23 20 Z"
                fill="url(#scrubCapGrad)"
                stroke="#042F2E"
                stroke-width="1"
              />
              <!-- Detalhes de Costura / Dobra da Touca -->
              <path d="M24 20 Q36 22 48 20" stroke="#2DD4BF" stroke-width="1" fill="none" opacity="0.8" />
              <!-- Laço Traseiro -->
              <rect x="46" y="21" width="4" height="2" rx="1" fill="#115E59" />
            }
          }
        </g>
      </svg>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        user-select: none;
      }

      .doctor-avatar-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 150ms ease;
        cursor: pointer;
      }

      .doctor-avatar-container:hover {
        transform: scale(1.06);
      }

      .doctor-svg {
        display: block;
        overflow: visible;
      }

      /* Animação suave de respiração (P-087) */
      .doctor-breathing-group {
        animation: doctorBreathing 3.2s ease-in-out infinite alternate;
        transform-origin: 36px 70px;
      }

      @keyframes doctorBreathing {
        0% {
          transform: translateY(0) scaleY(1);
        }
        100% {
          transform: translateY(-2px) scaleY(1.02);
        }
      }

      /* Micro-aceno e pulo alegre ao clicar (P-088) */
      .doctor-avatar-container.is-animating .doctor-breathing-group {
        animation: doctorTapGreeting 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      @keyframes doctorTapGreeting {
        0% {
          transform: translateY(0) scale(1);
        }
        35% {
          transform: translateY(-8px) scale(1.08) rotate(-3deg);
        }
        70% {
          transform: translateY(-2px) scale(1.03) rotate(3deg);
        }
        100% {
          transform: translateY(0) scale(1) rotate(0deg);
        }
      }

      /* Page Visibility API: Suspende keyframes se a aba estiver oculta (P-085, P-087) */
      .doctor-avatar-container.is-paused .doctor-breathing-group {
        animation-play-state: paused !important;
      }
    `
  ]
})
export class DoctorAvatarSvgComponent {
  @Input() gender: DoctorGender = 'MALE';
  @Input() skinCoat = 'coat_default';
  @Input() skinStethoscope = 'steth_standard';
  @Input() skinAccessory = 'acc_none';
  @Input() width = 64;
  @Input() height = 88;
  @Input() activeAnimation = false;
  @Input() paused = false;

  get avatarAriaLabel(): string {
    const title = this.gender === 'FEMALE' ? 'Doutora' : 'Doutor';
    return `${title} da Clínica MedStudy`;
  }
}
