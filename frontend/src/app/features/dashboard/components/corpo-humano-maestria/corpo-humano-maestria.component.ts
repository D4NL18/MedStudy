import { Component, Input, Output, EventEmitter, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ClinicalMasteryService } from '@core/services/clinical-mastery.service';
import { ClinicalMasteryResponse, AreaMastery, MasteryTier } from '@core/models/clinical-mastery.model';

@Component({
  selector: 'app-corpo-humano-maestria',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="maestria-container glass">
      <!-- Cabeçalho do Card -->
      <div class="maestria-header">
        <div class="title-wrap">
          <div class="icon-avatar">
            <lucide-icon name="activity" [size]="22"></lucide-icon>
          </div>
          <div>
            <h3>Mapa de Maestria Clínica Anatômica</h3>
            <p>Evolução integrada do conhecimento médico distribuído por sistemas do corpo humano</p>
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

      <!-- Área de Visualização Principal: SVG Anatômico + Detalhes / Legenda -->
      <div class="maestria-body">
        <!-- SVG Anatômico Interativo -->
        <div class="svg-stage">
          <svg viewBox="0 0 400 680" class="human-body-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Filtro de Glow -->
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <!-- Filtro de Brilho Estelar Diamante -->
              <filter id="diamondShine" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feSpecularLighting result="specOut" in="blur" specularConstant="1.2" specularExponent="20" lighting-color="#ffffff">
                  <fePointLight x="200" y="200" z="200" />
                </feSpecularLighting>
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <!-- Gradientes de Tiers -->
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
            </defs>

            <!-- 5. Silhueta de Fundo / Aura Sistêmica (Medicina Preventiva & Social) -->
            <g class="anatomical-region prevent-aura"
               [class.active]="selectedArea()?.grandeArea === 'MEDICINA_PREVENTIVA'"
               (mouseenter)="onHoverArea('MEDICINA_PREVENTIVA')"
               (click)="onSelectArea('MEDICINA_PREVENTIVA')">
              <!-- Aura Exterior & Sistema Circulatório Periférico -->
              <path class="organ-fill aura-path"
                    d="M 200,20 C 235,20 250,45 250,75 C 250,95 240,110 230,120 C 275,135 320,165 330,220 C 342,280 345,360 340,430 C 335,465 320,470 310,440 C 300,380 295,290 280,225 C 270,250 268,340 268,430 C 268,520 270,610 265,650 C 260,665 240,665 235,640 C 225,580 220,490 215,445 C 210,440 205,440 200,440 C 195,440 190,440 185,445 C 180,490 175,580 165,640 C 160,665 140,665 135,650 C 130,610 132,520 132,430 C 132,340 130,250 120,225 C 105,290 100,380 90,440 C 80,470 65,465 60,430 C 55,360 58,280 70,220 C 80,165 125,135 170,120 C 160,110 150,95 150,75 C 150,45 165,20 200,20 Z"
                    [attr.fill]="getAreaFill('MEDICINA_PREVENTIVA')"
                    [attr.filter]="getTierFilter('MEDICINA_PREVENTIVA')">
              </path>
              <!-- Linha de Contorno Dourado -->
              <path class="organ-stroke stroke-preventiva"
                    d="M 200,20 C 235,20 250,45 250,75 C 250,95 240,110 230,120 C 275,135 320,165 330,220 C 342,280 345,360 340,430 C 335,465 320,470 310,440 C 300,380 295,290 280,225 C 270,250 268,340 268,430 C 268,520 270,610 265,650 C 260,665 240,665 235,640 C 225,580 220,490 215,445 C 210,440 205,440 200,440 C 195,440 190,440 185,445 C 180,490 175,580 165,640 C 160,665 140,665 135,650 C 130,610 132,520 132,430 C 132,340 130,250 120,225 C 105,290 100,380 90,440 C 80,470 65,465 60,430 C 55,360 58,280 70,220 C 80,165 125,135 170,120 C 160,110 150,95 150,75 C 150,45 165,20 200,20 Z">
              </path>
            </g>

            <!-- 3. Pediatria: Cabeça & Vias Aéreas Superiores / Tronco Cervical -->
            <g class="anatomical-region pediatria-region"
               [class.active]="selectedArea()?.grandeArea === 'PEDIATRIA'"
               (mouseenter)="onHoverArea('PEDIATRIA')"
               (click)="onSelectArea('PEDIATRIA')">
              <path class="organ-fill"
                    d="M 200,30 C 225,30 240,48 240,75 C 240,105 224,124 212,130 L 212,142 L 188,142 L 188,130 C 176,124 160,105 160,75 C 160,48 175,30 200,30 Z"
                    [attr.fill]="getAreaFill('PEDIATRIA')"
                    [attr.filter]="getTierFilter('PEDIATRIA')">
              </path>
              <path class="organ-stroke stroke-pediatria"
                    d="M 200,30 C 225,30 240,48 240,75 C 240,105 224,124 212,130 L 212,142 L 188,142 L 188,130 C 176,124 160,105 160,75 C 160,48 175,30 200,30 Z">
              </path>
            </g>

            <!-- 1. Clínica Médica: Tórax, Coração e Pulmões -->
            <g class="anatomical-region clinica-region"
               [class.active]="selectedArea()?.grandeArea === 'CLINICA_MEDICA'"
               (mouseenter)="onHoverArea('CLINICA_MEDICA')"
               (click)="onSelectArea('CLINICA_MEDICA')">
              <path class="organ-fill"
                    d="M 188,142 L 212,142 C 245,146 265,160 270,185 C 275,215 260,250 250,265 C 230,270 205,270 200,270 C 195,270 170,270 150,265 C 140,250 125,215 130,185 C 135,160 155,146 188,142 Z"
                    [attr.fill]="getAreaFill('CLINICA_MEDICA')"
                    [attr.filter]="getTierFilter('CLINICA_MEDICA')">
              </path>
              <path class="organ-stroke stroke-clinica"
                    d="M 188,142 L 212,142 C 245,146 265,160 270,185 C 275,215 260,250 250,265 C 230,270 205,270 200,270 C 195,270 170,270 150,265 C 140,250 125,215 130,185 C 135,160 155,146 188,142 Z">
              </path>
              <!-- Ícone Simbólico do Coração Clínico -->
              <circle cx="215" cy="205" r="7" fill="#60A5FA" opacity="0.8" class="pulse-point" />
            </g>

            <!-- 2. Cirurgia Geral: Abdome, Fígado e TGI -->
            <g class="anatomical-region cirurgia-region"
               [class.active]="selectedArea()?.grandeArea === 'CIRURGIA_GERAL'"
               (mouseenter)="onHoverArea('CIRURGIA_GERAL')"
               (click)="onSelectArea('CIRURGIA_GERAL')">
              <path class="organ-fill"
                    d="M 150,265 C 170,270 195,270 200,270 C 205,270 230,270 250,265 C 255,290 255,325 248,350 C 235,360 215,365 200,365 C 185,365 165,360 152,350 C 145,325 145,290 150,265 Z"
                    [attr.fill]="getAreaFill('CIRURGIA_GERAL')"
                    [attr.filter]="getTierFilter('CIRURGIA_GERAL')">
              </path>
              <path class="organ-stroke stroke-cirurgia"
                    d="M 150,265 C 170,270 195,270 200,270 C 205,270 230,270 250,265 C 255,290 255,325 248,350 C 235,360 215,365 200,365 C 185,365 165,360 152,350 C 145,325 145,290 150,265 Z">
              </path>
            </g>

            <!-- 4. Ginecologia e Obstetrícia: Pelve & Urogenital -->
            <g class="anatomical-region go-region"
               [class.active]="selectedArea()?.grandeArea === 'GINECOLOGIA_OBSTETRICIA'"
               (mouseenter)="onHoverArea('GINECOLOGIA_OBSTETRICIA')"
               (click)="onSelectArea('GINECOLOGIA_OBSTETRICIA')">
              <path class="organ-fill"
                    d="M 152,350 C 165,360 185,365 200,365 C 215,365 235,360 248,350 C 255,375 250,405 240,430 C 225,442 210,445 200,445 C 190,445 175,442 160,430 C 150,405 145,375 152,350 Z"
                    [attr.fill]="getAreaFill('GINECOLOGIA_OBSTETRICIA')"
                    [attr.filter]="getTierFilter('GINECOLOGIA_OBSTETRICIA')">
              </path>
              <path class="organ-stroke stroke-go"
                    d="M 152,350 C 165,360 185,365 200,365 C 215,365 235,360 248,350 C 255,375 250,405 240,430 C 225,442 210,445 200,445 C 190,445 175,442 160,430 C 150,405 145,375 152,350 Z">
              </path>
            </g>

            <!-- Pontos de Conexão Estilizados -->
            <circle cx="200" cy="75" r="3" fill="#10B981" />
            <circle cx="200" cy="205" r="3" fill="#3B82F6" />
            <circle cx="200" cy="310" r="3" fill="#F97316" />
            <circle cx="200" cy="395" r="3" fill="#EC4899" />
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
              <span>Próximo Tier em <strong>{{ 100 - area.masteryPercentage }}%</strong> de evolução</span>
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
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38BDF8;
        }

        h3 {
          margin: 0 0 4px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text, #ffffff);
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
      grid-template-columns: 340px 1fr;
      gap: 32px;
      align-items: center;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .svg-stage {
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle, rgba(30, 41, 59, 0.4) 0%, transparent 75%);
      border-radius: 20px;
      padding: 12px;

      .human-body-svg {
        width: 100%;
        max-width: 320px;
        height: auto;
        max-height: 520px;
        filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.6));
      }
    }

    .anatomical-region {
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

      .organ-fill {
        transition: all 0.35s ease;
      }

      .organ-stroke {
        fill: none;
        stroke-width: 3.5px;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: stroke-width 0.3s, filter 0.3s;
      }

      .stroke-clinica { stroke: #3B82F6; }
      .stroke-cirurgia { stroke: #F97316; }
      .stroke-pediatria { stroke: #10B981; }
      .stroke-go { stroke: #EC4899; }
      .stroke-preventiva { stroke: #EAB308; stroke-dasharray: 6 3; stroke-width: 2.5px; opacity: 0.75; }

      &:hover, &.active {
        .organ-fill {
          opacity: 1 !important;
          transform: scale(1.02);
          transform-origin: center;
        }

        .organ-stroke {
          stroke-width: 5px;
          filter: drop-shadow(0 0 10px currentColor);
        }
      }
    }

    .pulse-point {
      animation: heartBeat 1.8s infinite ease-in-out;
    }

    @keyframes heartBeat {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.4); opacity: 1; }
    }

    .details-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .panel-card {
        padding: 24px;
        border-radius: 20px;
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
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
export class CorpoHumanoMaestriaComponent implements OnInit {
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

  getAreaFill(grandeAreaKey: string): string {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    if (!area) return '#1E293B';
    if (area.tier === 'INICIANTE') return 'rgba(30, 41, 59, 0.35)';
    return `url(#grad-${area.tier})`;
  }

  getTierFilter(grandeAreaKey: string): string {
    const area = this.data()?.areas.find(a => a.grandeArea === grandeAreaKey);
    if (!area) return 'none';
    if (area.tier === 'DIAMANTE') return 'url(#diamondShine)';
    if (area.tier === 'ESMERALDA' || area.tier === 'RUBI' || area.tier === 'OURO') return 'url(#neonGlow)';
    return 'none';
  }
}
