import { Component, Input, Output, EventEmitter, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ClinicalMasteryService } from '@core/services/clinical-mastery.service';
import { ClinicalMasteryResponse, AreaMastery, MasteryTier } from '@core/models/clinical-mastery.model';

@Component({
  selector: 'app-estrela-maestria, app-corpo-humano-maestria',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="maestria-container glass">
      <!-- Cabeçalho do Card -->
      <div class="maestria-header">
        <div class="title-wrap">
          <div class="icon-avatar">
            <lucide-icon name="sparkles" [size]="22"></lucide-icon>
          </div>
          <div>
            <h3>Estrela da Vida — Maestria Clínica</h3>
            <p>Os 5 pilares fundamentais da formação médica integrados na clássica mandala de excelência</p>
          </div>
        </div>

        <div class="overall-badge" [attr.data-tier]="data()?.overallTier">
          <span class="label">Maestria Global</span>
          <div class="tier-val">
            <span class="tier-name">{{ data()?.overallTier }}</span>
            <span class="percentage">{{ data()?.overallMastery }}%</span>
          </div>
        </div>
      </div>

      <!-- Área de Visualização Principal: Estrela da Vida SVG + Detalhes / Legenda -->
      <div class="maestria-body">
        <!-- Estrela da Vida SVG Interativa -->
        <div class="svg-stage">
          <svg viewBox="0 0 560 560" class="estrela-vida-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Filtro de Glow Neon -->
              <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <!-- Filtro de Brilho Estelar Diamante -->
              <filter id="diamondShine" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feSpecularLighting result="specOut" in="blur" specularConstant="1.4" specularExponent="22" lighting-color="#ffffff">
                  <fePointLight x="280" y="280" z="220" />
                </feSpecularLighting>
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <!-- Gradientes dos 7 Tiers -->
              <!-- Bronze -->
              <linearGradient id="grad-BRONZE" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#CD7F32" />
                <stop offset="50%" stop-color="#A75D28" />
                <stop offset="100%" stop-color="#8C531B" />
              </linearGradient>

              <!-- Prata -->
              <linearGradient id="grad-PRATA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F1F5F9" />
                <stop offset="50%" stop-color="#CBD5E1" />
                <stop offset="100%" stop-color="#94A3B8" />
              </linearGradient>

              <!-- Ouro -->
              <linearGradient id="grad-OURO" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FDE047" />
                <stop offset="50%" stop-color="#EAB308" />
                <stop offset="100%" stop-color="#CA8A04" />
              </linearGradient>

              <!-- Platina -->
              <linearGradient id="grad-PLATINA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E0F2FE" />
                <stop offset="50%" stop-color="#7DD3FC" />
                <stop offset="100%" stop-color="#0284C7" />
              </linearGradient>

              <!-- Rubi -->
              <linearGradient id="grad-RUBI" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FB7185" />
                <stop offset="50%" stop-color="#E11D48" />
                <stop offset="100%" stop-color="#881337" />
              </linearGradient>

              <!-- Esmeralda -->
              <linearGradient id="grad-ESMERALDA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34D399" />
                <stop offset="50%" stop-color="#10B981" />
                <stop offset="100%" stop-color="#065F46" />
              </linearGradient>

              <!-- Diamante -->
              <linearGradient id="grad-DIAMANTE" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E0F7FA" />
                <stop offset="35%" stop-color="#80DEEA" />
                <stop offset="70%" stop-color="#A78BFA" />
                <stop offset="100%" stop-color="#38BDF8" />
              </linearGradient>

              <!-- Gradiente Dourado para o Bastão de Asclépio -->
              <linearGradient id="grad-asclepius" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FEF08A" />
                <stop offset="50%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#B45309" />
              </linearGradient>

              <!-- Definição da Ponta Master (Apontando para cima, 0 deg) -->
              <g id="star-arm-master">
                <!-- Faceta Esquerda (Reflexo de Luz Primário) -->
                <path class="arm-facet arm-facet-left"
                      d="M 280,36 L 252,58 L 256,185 L 263,217 L 280,215 Z" />
                <!-- Faceta Direita (Sombra/Profundidade Chanfrada 3D) -->
                <path class="arm-facet arm-facet-right"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 L 280,215 Z" />
                <!-- Ranhuras Geométricas de Nível (Marcadores de 33% e 66%) -->
                <path class="arm-groove" d="M 255,145 L 280,135 L 305,145" />
                <path class="arm-groove" d="M 253,95 L 280,85 L 307,95" />
                <!-- Contorno de Borda Chanfrada com Glow -->
                <path class="arm-outline"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 A 65 65 0 0 1 263,217 L 256,185 L 252,58 Z" />
              </g>
            </defs>

            <!-- Círculos de Fundo Geométricos (Aura Astronômica/Médica) -->
            <circle cx="280" cy="280" r="255" class="bg-orbit-ring ring-outer" />
            <circle cx="280" cy="280" r="235" class="bg-orbit-ring ring-dashed" />
            <circle cx="280" cy="280" r="150" class="bg-orbit-ring ring-mid" />

            <!-- ========================================== -->
            <!-- 1. CLÍNICA MÉDICA (Ponta Superior - 0°) -->
            <!-- ========================================== -->
            <g class="star-arm-group"
               [class.active]="selectedArea()?.grandeArea === 'CLINICA_MEDICA'"
               (mouseenter)="onHoverArea('CLINICA_MEDICA')"
               (click)="onSelectArea('CLINICA_MEDICA')">
              <g transform="rotate(0 280 280)">
                <g [attr.fill]="getAreaFill('CLINICA_MEDICA')"
                   [attr.filter]="getTierFilter('CLINICA_MEDICA')">
                  <use href="#star-arm-master" />
                </g>
                <!-- Contorno da área -->
                <path class="arm-stroke stroke-clinica"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 A 65 65 0 0 1 263,217 L 256,185 L 252,58 Z" />
                <!-- Ícone da Especialidade (ECG / Pulso Cardíaco Clínico) -->
                <g transform="translate(280, 115) rotate(0)">
                  <circle cx="0" cy="0" r="18" class="icon-backing" />
                  <path d="M -13,0 L -7,0 L -3,-9 L 1,11 L 5,-6 L 8,3 L 13,0"
                        fill="none" stroke="#93C5FD" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                </g>
              </g>
              <!-- Tag de Identificação Superior -->
              <g class="arm-tag tag-top" (click)="onSelectArea('CLINICA_MEDICA')">
                <rect x="200" y="6" width="160" height="26" rx="13" class="tag-bg" />
                <circle cx="214" cy="19" r="4.5" fill="#3B82F6" />
                <text x="226" y="23" class="tag-text">Clínica Médica</text>
                <text x="345" y="23" text-anchor="end" class="tag-percent">{{ getAreaPercent('CLINICA_MEDICA') }}%</text>
              </g>
            </g>

            <!-- ========================================== -->
            <!-- 2. CIRURGIA GERAL (Ponta Superior Direita - 72°) -->
            <!-- ========================================== -->
            <g class="star-arm-group"
               [class.active]="selectedArea()?.grandeArea === 'CIRURGIA_GERAL'"
               (mouseenter)="onHoverArea('CIRURGIA_GERAL')"
               (click)="onSelectArea('CIRURGIA_GERAL')">
              <g transform="rotate(72 280 280)">
                <g [attr.fill]="getAreaFill('CIRURGIA_GERAL')"
                   [attr.filter]="getTierFilter('CIRURGIA_GERAL')">
                  <use href="#star-arm-master" />
                </g>
                <path class="arm-stroke stroke-cirurgia"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 A 65 65 0 0 1 263,217 L 256,185 L 252,58 Z" />
                <!-- Ícone da Especialidade (Bisturi de Precisão Cirúrgica) -->
                <g transform="translate(280, 115) rotate(-72)">
                  <circle cx="0" cy="0" r="18" class="icon-backing" />
                  <path d="M -9,9 L 3,-3 C 7,-7 12,-9 12,-9 C 12,-9 9,-4 5,0 L -7,12 Z"
                        fill="none" stroke="#FDBA74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <line x1="-3" y1="3" x2="-6" y2="6" stroke="#FDBA74" stroke-width="1.8" />
                </g>
              </g>
              <!-- Tag de Identificação Superior Direita -->
              <g class="arm-tag tag-tr" (click)="onSelectArea('CIRURGIA_GERAL')">
                <rect x="390" y="110" width="155" height="26" rx="13" class="tag-bg" />
                <circle cx="404" cy="123" r="4.5" fill="#F97316" />
                <text x="416" y="127" class="tag-text">Cirurgia Geral</text>
                <text x="532" y="127" text-anchor="end" class="tag-percent">{{ getAreaPercent('CIRURGIA_GERAL') }}%</text>
              </g>
            </g>

            <!-- ========================================== -->
            <!-- 3. GINECOLOGIA E OBSTETRÍCIA (Ponta Inferior Direita - 144°) -->
            <!-- ========================================== -->
            <g class="star-arm-group"
               [class.active]="selectedArea()?.grandeArea === 'GINECOLOGIA_OBSTETRICIA'"
               (mouseenter)="onHoverArea('GINECOLOGIA_OBSTETRICIA')"
               (click)="onSelectArea('GINECOLOGIA_OBSTETRICIA')">
              <g transform="rotate(144 280 280)">
                <g [attr.fill]="getAreaFill('GINECOLOGIA_OBSTETRICIA')"
                   [attr.filter]="getTierFilter('GINECOLOGIA_OBSTETRICIA')">
                  <use href="#star-arm-master" />
                </g>
                <path class="arm-stroke stroke-go"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 A 65 65 0 0 1 263,217 L 256,185 L 252,58 Z" />
                <!-- Ícone da Especialidade (Símbolo de Vênus & Ciclo da Vida) -->
                <g transform="translate(280, 115) rotate(-144)">
                  <circle cx="0" cy="0" r="18" class="icon-backing" />
                  <circle cx="0" cy="-3" r="7" fill="none" stroke="#F472B6" stroke-width="2.2" />
                  <line x1="0" y1="4" x2="0" y2="12" stroke="#F472B6" stroke-width="2.2" stroke-linecap="round" />
                  <line x1="-4" y1="8" x2="4" y2="8" stroke="#F472B6" stroke-width="2.2" stroke-linecap="round" />
                </g>
              </g>
              <!-- Tag de Identificação Inferior Direita -->
              <g class="arm-tag tag-br" (click)="onSelectArea('GINECOLOGIA_OBSTETRICIA')">
                <rect x="375" y="490" width="168" height="26" rx="13" class="tag-bg" />
                <circle cx="389" cy="503" r="4.5" fill="#EC4899" />
                <text x="401" y="507" class="tag-text">Gineco & Obstetrícia</text>
                <text x="532" y="507" text-anchor="end" class="tag-percent">{{ getAreaPercent('GINECOLOGIA_OBSTETRICIA') }}%</text>
              </g>
            </g>

            <!-- ========================================== -->
            <!-- 4. MEDICINA PREVENTIVA (Ponta Inferior Esquerda - 216°) -->
            <!-- ========================================== -->
            <g class="star-arm-group"
               [class.active]="selectedArea()?.grandeArea === 'MEDICINA_PREVENTIVA'"
               (mouseenter)="onHoverArea('MEDICINA_PREVENTIVA')"
               (click)="onSelectArea('MEDICINA_PREVENTIVA')">
              <g transform="rotate(216 280 280)">
                <g [attr.fill]="getAreaFill('MEDICINA_PREVENTIVA')"
                   [attr.filter]="getTierFilter('MEDICINA_PREVENTIVA')">
                  <use href="#star-arm-master" />
                </g>
                <path class="arm-stroke stroke-preventiva"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 A 65 65 0 0 1 263,217 L 256,185 L 252,58 Z" />
                <!-- Ícone da Especialidade (Escudo Protetor & Saúde Pública) -->
                <g transform="translate(280, 115) rotate(-216)">
                  <circle cx="0" cy="0" r="18" class="icon-backing" />
                  <path d="M 0,-11 L 9,-6 C 9,4 0,11 0,11 C 0,11 -9,4 -9,-6 Z"
                        fill="none" stroke="#FACC15" stroke-width="2" stroke-linejoin="round" />
                  <path d="M 0,-5 L 0,3 M -4,-1 L 4,-1" stroke="#FACC15" stroke-width="1.8" stroke-linecap="round" />
                </g>
              </g>
              <!-- Tag de Identificação Inferior Esquerda -->
              <g class="arm-tag tag-bl" (click)="onSelectArea('MEDICINA_PREVENTIVA')">
                <rect x="18" y="490" width="168" height="26" rx="13" class="tag-bg" />
                <circle cx="32" cy="503" r="4.5" fill="#EAB308" />
                <text x="44" y="507" class="tag-text">Medicina Preventiva</text>
                <text x="175" y="507" text-anchor="end" class="tag-percent">{{ getAreaPercent('MEDICINA_PREVENTIVA') }}%</text>
              </g>
            </g>

            <!-- ========================================== -->
            <!-- 5. PEDIATRIA (Ponta Superior Esquerda - 288°) -->
            <!-- ========================================== -->
            <g class="star-arm-group"
               [class.active]="selectedArea()?.grandeArea === 'PEDIATRIA'"
               (mouseenter)="onHoverArea('PEDIATRIA')"
               (click)="onSelectArea('PEDIATRIA')">
              <g transform="rotate(288 280 280)">
                <g [attr.fill]="getAreaFill('PEDIATRIA')"
                   [attr.filter]="getTierFilter('PEDIATRIA')">
                  <use href="#star-arm-master" />
                </g>
                <path class="arm-stroke stroke-pediatria"
                      d="M 280,36 L 308,58 L 304,185 L 297,217 A 65 65 0 0 1 263,217 L 256,185 L 252,58 Z" />
                <!-- Ícone da Especialidade (Pegada Neonatal / Cuidados da Infância) -->
                <g transform="translate(280, 115) rotate(-288)">
                  <circle cx="0" cy="0" r="18" class="icon-backing" />
                  <ellipse cx="-1" cy="2" rx="5.5" ry="8" transform="rotate(-10 -1 2)" fill="#34D399" opacity="0.9" />
                  <circle cx="-5" cy="-8" r="1.6" fill="#34D399" />
                  <circle cx="-1.5" cy="-9.5" r="1.6" fill="#34D399" />
                  <circle cx="2" cy="-9" r="1.5" fill="#34D399" />
                  <circle cx="5" cy="-7" r="1.3" fill="#34D399" />
                  <circle cx="7" cy="-4" r="1.1" fill="#34D399" />
                </g>
              </g>
              <!-- Tag de Identificação Superior Esquerda -->
              <g class="arm-tag tag-tl" (click)="onSelectArea('PEDIATRIA')">
                <rect x="20" y="110" width="145" height="26" rx="13" class="tag-bg" />
                <circle cx="34" cy="123" r="4.5" fill="#10B981" />
                <text x="46" y="127" class="tag-text">Pediatria</text>
                <text x="154" y="127" text-anchor="end" class="tag-percent">{{ getAreaPercent('PEDIATRIA') }}%</text>
              </g>
            </g>

            <!-- ========================================== -->
            <!-- MEDALHÃO CENTRAL: BASTÃO DE ASCLÉPIO -->
            <!-- ========================================== -->
            <g class="center-medallion">
              <!-- Halo de Luz do Núcleo -->
              <circle cx="280" cy="280" r="62" class="medallion-halo" />
              <!-- Anel com Ticks / Cronômetro Radial -->
              <circle cx="280" cy="280" r="58" class="medallion-ring" />
              <!-- Fundo Escuro Metalizado do Núcleo -->
              <circle cx="280" cy="280" r="50" class="medallion-core" />

              <!-- Bastão de Asclépio Dourado Central -->
              <!-- Bastão Rígido -->
              <line x1="280" y1="244" x2="280" y2="314"
                    stroke="url(#grad-asclepius)" stroke-width="3.5" stroke-linecap="round" />
              <!-- Pomo Superior -->
              <circle cx="280" cy="242" r="3.5" fill="#FEF08A" />

              <!-- Serpente Sagrada Enrolada (3 Voltas Sinusoidais) -->
              <path class="asclepius-snake"
                    d="M 276,246 C 273,248 274,253 283,256 C 291,259 290,266 277,269 C 270,271 270,277 283,281 C 291,284 290,291 278,294 C 274,295 273,300 277,303 C 281,306 283,310 280,314"
                    fill="none" stroke="url(#grad-asclepius)" stroke-width="3" stroke-linecap="round" />
              <!-- Olho Brilhante da Serpente -->
              <circle cx="275" cy="246" r="0.9" fill="#FFFFFF" />

              <!-- Brilho no Centro -->
              <circle cx="280" cy="280" r="4" fill="#FEF08A" opacity="0.6" class="center-pulse" />
            </g>
          </svg>
        </div>

        <!-- Painel Lateral de Detalhes / Popover de Informações -->
        <div class="details-panel" *ngIf="selectedArea() as area">
          <div class="panel-card glass" [style.border-color]="area.corHex + '55'">
            <div class="panel-header">
              <div class="area-title">
                <span class="color-dot" [style.background-color]="area.corHex"></span>
                <h4>{{ area.displayName }}</h4>
              </div>
              <span class="tier-pill" [attr.data-tier]="area.tier">
                {{ area.tier }}
              </span>
            </div>

            <div class="mastery-score-row">
              <div class="score-number">{{ area.masteryPercentage }}%</div>
              <div class="score-desc">
                <span>Maestria na Especialidade</span>
                <div class="bar-bg">
                  <div class="bar-fill" [style.width.%]="area.masteryPercentage" [style.background-color]="area.corHex"></div>
                </div>
              </div>
            </div>

            <div class="metrics-grid">
              <div class="metric-item">
                <lucide-icon name="help-circle" [size]="16" class="m-icon"></lucide-icon>
                <div class="m-data">
                  <span class="m-val">{{ area.questoesFeitas }}</span>
                  <span class="m-lbl">Questões Resolvidas</span>
                </div>
              </div>

              <div class="metric-item">
                <lucide-icon name="check-check" [size]="16" class="m-icon"></lucide-icon>
                <div class="m-data">
                  <span class="m-val">{{ area.taxaAcertoQuestoes }}%</span>
                  <span class="m-lbl">Taxa de Acerto</span>
                </div>
              </div>

              <div class="metric-item">
                <lucide-icon name="layers" [size]="16" class="m-icon"></lucide-icon>
                <div class="m-data">
                  <span class="m-val">{{ area.cardsRevisados }}</span>
                  <span class="m-lbl">Cards Revisados</span>
                </div>
              </div>

              <div class="metric-item">
                <lucide-icon name="brain" [size]="16" class="m-icon"></lucide-icon>
                <div class="m-data">
                  <span class="m-val">{{ area.taxaRetencaoCards }}%</span>
                  <span class="m-lbl">Retenção de Memória</span>
                </div>
              </div>

              <div class="metric-item full-span">
                <lucide-icon name="video" [size]="16" class="m-icon"></lucide-icon>
                <div class="m-data">
                  <span class="m-val">{{ area.aulasAssistidas }} / {{ area.totalAulas }}</span>
                  <span class="m-lbl">Aulas Concluídas na Especialidade</span>
                </div>
              </div>
            </div>

            <div class="tier-hint">
              <lucide-icon name="sparkles" [size]="14"></lucide-icon>
              <span>Próximo Tier em <strong>{{ getNextTierGap(area.masteryPercentage) }}%</strong> de evolução</span>
            </div>
          </div>

          <!-- Mini Lista de Seleção Rápida de Áreas -->
          <div class="quick-nav">
            <button *ngFor="let a of data()?.areas" 
                    class="nav-chip"
                    [class.active]="selectedArea()?.grandeArea === a.grandeArea"
                    (click)="selectedArea.set(a)">
              <span class="chip-dot" [style.background-color]="a.corHex"></span>
              <span class="chip-name">{{ a.displayName }}</span>
              <span class="chip-tier">{{ a.masteryPercentage }}%</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .maestria-container {
      padding: 24px 28px;
      border-radius: 24px;
      margin-bottom: 24px;
      position: relative;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
    }

    .maestria-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;

      .title-wrap {
        display: flex;
        align-items: center;
        gap: 14px;

        .icon-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(234, 179, 8, 0.25));
          border: 1px solid rgba(59, 130, 246, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FACC15;
          box-shadow: 0 0 15px rgba(234, 179, 8, 0.2);
        }

        h3 {
          margin: 0 0 4px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text, #ffffff);
          letter-spacing: -0.01em;
        }

        p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-text-muted, #94A3B8);
        }
      }

      .overall-badge {
        padding: 8px 18px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }

        .tier-val {
          display: flex;
          align-items: center;
          gap: 8px;

          .tier-name {
            font-weight: 800;
            font-size: 1.05rem;
            color: #FBBF24;
          }

          .percentage {
            font-weight: 700;
            font-size: 0.9rem;
            color: #E2E8F0;
          }
        }
      }
    }

    .maestria-body {
      display: grid;
      grid-template-columns: 460px 1fr;
      gap: 32px;
      align-items: center;

      @media (max-width: 1080px) {
        grid-template-columns: 1fr;
      }
    }

    .svg-stage {
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle, rgba(30, 41, 59, 0.45) 0%, transparent 75%);
      border-radius: 20px;
      padding: 10px;

      .estrela-vida-svg {
        width: 100%;
        max-width: 440px;
        height: auto;
        filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6));
      }
    }

    /* Elementos Geométricos de Fundo */
    .bg-orbit-ring {
      fill: none;
      pointer-events: none;

      &.ring-outer {
        stroke: rgba(255, 255, 255, 0.04);
        stroke-width: 1;
      }

      &.ring-dashed {
        stroke: rgba(255, 255, 255, 0.07);
        stroke-width: 1.2;
        stroke-dasharray: 4 8;
        animation: rotateOrbits 60s infinite linear;
        transform-origin: 280px 280px;
      }

      &.ring-mid {
        stroke: rgba(255, 255, 255, 0.05);
        stroke-width: 1;
      }
    }

    @keyframes rotateOrbits {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Grupos das Pontas da Estrela */
    .star-arm-group {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .arm-facet {
        transition: all 0.3s ease;
      }

      .arm-facet-left {
        fill-opacity: 0.95;
      }

      .arm-facet-right {
        fill-opacity: 0.72;
      }

      .arm-groove {
        fill: none;
        stroke: rgba(255, 255, 255, 0.25);
        stroke-width: 1.2;
        stroke-linecap: round;
      }

      .arm-outline {
        fill: none;
        stroke: rgba(255, 255, 255, 0.15);
        stroke-width: 1.2;
      }

      .arm-stroke {
        fill: none;
        stroke-width: 2.8px;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: all 0.3s ease;
      }

      .stroke-clinica { stroke: #3B82F6; }
      .stroke-cirurgia { stroke: #F97316; }
      .stroke-pediatria { stroke: #10B981; }
      .stroke-go { stroke: #EC4899; }
      .stroke-preventiva { stroke: #EAB308; }

      .icon-backing {
        fill: rgba(15, 23, 42, 0.85);
        stroke: rgba(255, 255, 255, 0.2);
        stroke-width: 1;
        transition: all 0.3s ease;
      }

      /* Hover & Ativo */
      &:hover, &.active {
        transform: scale(1.025);
        transform-origin: 280px 280px;

        .arm-stroke {
          stroke-width: 4.5px;
          filter: drop-shadow(0 0 12px currentColor);
        }

        .icon-backing {
          fill: rgba(15, 23, 42, 0.95);
          stroke: #ffffff;
          stroke-width: 1.5;
        }

        .arm-tag .tag-bg {
          fill: rgba(30, 41, 59, 0.95);
          stroke: rgba(255, 255, 255, 0.35);
        }
      }
    }

    /* Tags Interativas em volta da Estrela */
    .arm-tag {
      cursor: pointer;
      transition: all 0.2s ease;

      .tag-bg {
        fill: rgba(15, 23, 42, 0.78);
        stroke: rgba(255, 255, 255, 0.15);
        stroke-width: 1;
        backdrop-filter: blur(8px);
        transition: all 0.2s ease;
      }

      .tag-text {
        font-size: 0.76rem;
        font-weight: 700;
        fill: #E2E8F0;
        letter-spacing: -0.01em;
      }

      .tag-percent {
        font-size: 0.76rem;
        font-weight: 800;
        fill: #38BDF8;
      }

      &:hover {
        .tag-bg {
          fill: rgba(30, 41, 59, 0.95);
          stroke: rgba(255, 255, 255, 0.4);
        }
      }
    }

    /* Medalhão Central & Bastão de Asclépio */
    .center-medallion {
      pointer-events: none;

      .medallion-halo {
        fill: none;
        stroke: rgba(234, 179, 8, 0.25);
        stroke-width: 2;
        filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.4));
      }

      .medallion-ring {
        fill: none;
        stroke: rgba(255, 255, 255, 0.18);
        stroke-width: 1.5;
        stroke-dasharray: 2 4;
      }

      .medallion-core {
        fill: #0B1329;
        stroke: rgba(245, 158, 11, 0.4);
        stroke-width: 2;
      }

      .asclepius-snake {
        filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.5));
      }

      .center-pulse {
        animation: centerPulse 2.5s infinite ease-in-out;
      }
    }

    @keyframes centerPulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.6); }
    }

    /* Painel de Detalhes à Direita */
    .details-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .panel-card {
        padding: 24px;
        border-radius: 20px;
        background: rgba(30, 41, 59, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(14px);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .area-title {
          display: flex;
          align-items: center;
          gap: 10px;

          .color-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            box-shadow: 0 0 8px currentColor;
          }

          h4 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 800;
            color: #ffffff;
          }
        }

        .tier-pill {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);

          &[data-tier="DIAMANTE"] { background: rgba(56, 189, 248, 0.2); color: #38BDF8; border-color: #38BDF8; }
          &[data-tier="ESMERALDA"] { background: rgba(16, 185, 129, 0.2); color: #10B981; border-color: #10B981; }
          &[data-tier="RUBI"] { background: rgba(225, 29, 72, 0.2); color: #FB7185; border-color: #FB7185; }
          &[data-tier="PLATINA"] { background: rgba(125, 211, 252, 0.2); color: #BAE6FD; border-color: #7DD3FC; }
          &[data-tier="OURO"] { background: rgba(234, 179, 8, 0.2); color: #FACC15; border-color: #EAB308; }
          &[data-tier="PRATA"] { background: rgba(203, 213, 225, 0.2); color: #E2E8F0; border-color: #CBD5E1; }
          &[data-tier="BRONZE"] { background: rgba(205, 127, 50, 0.2); color: #F59E0B; border-color: #CD7F32; }
        }
      }

      .mastery-score-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;

        .score-number {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
        }

        .score-desc {
          flex: 1;

          span {
            font-size: 0.78rem;
            color: #94A3B8;
            display: block;
            margin-bottom: 6px;
          }

          .bar-bg {
            height: 8px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 999px;
            overflow: hidden;

            .bar-fill {
              height: 100%;
              border-radius: 999px;
              transition: width 0.4s ease-out;
            }
          }
        }
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;

        .metric-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);

          &.full-span {
            grid-column: span 2;
          }

          .m-icon {
            color: #94A3B8;
          }

          .m-data {
            display: flex;
            flex-direction: column;

            .m-val {
              font-size: 1rem;
              font-weight: 700;
              color: #ffffff;
            }

            .m-lbl {
              font-size: 0.72rem;
              color: #94A3B8;
            }
          }
        }
      }

      .tier-hint {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: #94A3B8;

        strong {
          color: #38BDF8;
        }
      }

      .quick-nav {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .nav-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94A3B8;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s;

          .chip-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .chip-tier {
            color: #ffffff;
            font-weight: 700;
          }

          &:hover, &.active {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
          }
        }
      }
    }
  `]
})
export class EstrelaVidaMaestriaComponent implements OnInit {
  private masteryService = inject(ClinicalMasteryService);

  data = signal<ClinicalMasteryResponse | null>(null);
  selectedArea = signal<AreaMastery | null>(null);

  ngOnInit() {
    this.masteryService.getMastery().subscribe({
      next: (res) => {
        this.data.set(res);
        if (res.areas && res.areas.length > 0) {
          this.selectedArea.set(res.areas[0]);
        }
      }
    });
  }

  onHoverArea(grandeAreaKey: string) {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    if (area) {
      this.selectedArea.set(area);
    }
  }

  onSelectArea(grandeAreaKey: string) {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    if (area) {
      this.selectedArea.set(area);
    }
  }

  getAreaPercent(grandeAreaKey: string): number {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    return area ? Math.round(area.masteryPercentage) : 0;
  }

  getAreaFill(grandeAreaKey: string): string {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    if (!area) return '#1E293B';
    if (area.tier === 'INICIANTE') return 'rgba(30, 41, 59, 0.4)';
    return `url(#grad-${area.tier})`;
  }

  getTierFilter(grandeAreaKey: string): string {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    if (!area) return 'none';
    if (area.tier === 'DIAMANTE') return 'url(#diamondShine)';
    if (area.tier === 'ESMERALDA' || area.tier === 'RUBI' || area.tier === 'OURO') return 'url(#neonGlow)';
    return 'none';
  }

  getNextTierGap(percentage: number): number {
    const nextGap = Math.max(0, 100 - percentage);
    return Math.round(nextGap * 10) / 10;
  }
}

// Alias para manter compatibilidade com importações anteriores
export { EstrelaVidaMaestriaComponent as CorpoHumanoMaestriaComponent };
