import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Renderizador vetorial isométrico 2.5D modular para os 27 itens oficiais da Clínica Médica (P-083, P-085).
 * Zero bibliotecas 3D pesadas; SVGs semânticos de baixíssimo footprint.
 */
@Component({
  selector: 'app-clinic-item-svg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      class="clinic-item-svg"
      [class.is-rotated]="!hasCustomRotation && rotation % 2 === 1"
      [class.has-custom-rotation]="hasCustomRotation"
      [class.is-pulsing]="activePulse"
      [class.is-paused]="paused"
      viewBox="0 0 120 110"
      [attr.width]="width"
      [attr.height]="height"
      [attr.data-item-key]="itemKey"
      aria-hidden="true"
    >
      <!-- Sombra Isométrica Base (Apenas para móveis de chão) -->
      @if (!isWallItem) {
        @if (isTwoTile) {
          <polygon
            class="shadow-polygon"
            points="46,54 94,78 70,90 22,67"
            fill="rgba(15, 23, 42, 0.14)"
          />
        } @else {
          <polygon
            class="shadow-polygon"
            points="60,98 102,77 60,56 18,77"
            fill="rgba(15, 23, 42, 0.14)"
          />
        }
      }

      @switch (itemKey) {
        <!-- 1. ped_maca_dino: Maca Dinossauro Safari (Braquiossauro verde pastel que pisca) -->
        @case ('ped_maca_dino') {
          <g class="dino-stretcher">
            <!-- 4 Pernas isométricas da maca -->
            <line x1="64" y1="48" x2="64" y2="64" stroke="#059669" stroke-width="4" stroke-linecap="round" />
            <line x1="26" y1="67" x2="26" y2="82" stroke="#059669" stroke-width="4" stroke-linecap="round" />
            <line x1="96" y1="64" x2="96" y2="80" stroke="#10B981" stroke-width="4" stroke-linecap="round" />
            <line x1="58" y1="84" x2="58" y2="98" stroke="#10B981" stroke-width="4" stroke-linecap="round" />
            <!-- Corpo acolchoado isométrico verde pastel -->
            <polygon points="24,66 64,46 98,63 58,83" fill="#34D399" stroke="#059669" stroke-width="2" />
            <polygon points="28,64 64,46 92,60 56,78" fill="#A7F3D0" />
            <!-- Cauda fofa -->
            <path d="M24,66 Q12,62 15,52 Q22,56 28,62 Z" fill="#34D399" stroke="#059669" stroke-width="1.5" />
            <!-- Pescoço e cabeça de Braquiossauro -->
            <path d="M84,58 C88,36 86,22 95,18 C105,15 108,25 100,32 C94,36 94,50 92,62 Z" fill="#34D399" stroke="#059669" stroke-width="2" />
            <!-- Manchinhas safari -->
            <circle cx="52" cy="64" r="4" fill="#10B981" />
            <circle cx="68" cy="58" r="3" fill="#10B981" />
            <!-- Olho que pisca -->
            <circle class="dino-eye" cx="98" cy="23" r="2.8" fill="#0F172A" />
            <circle cx="99" cy="22" r="1" fill="#FFFFFF" />
            <!-- Sorriso amigável -->
            <path d="M96,28 Q101,30 104,27" stroke="#065F46" stroke-width="1.5" fill="none" stroke-linecap="round" />
          </g>
        }

        <!-- 2. ped_maca_baleia: Maca Baleia Azul (2.5D Isométrica Verdadeira) -->
        @case ('ped_maca_baleia') {
          <g class="whale-stretcher-iso">
            <!-- 4 Pernas de aço cirúrgico alinhadas aos 4 vértices isométricos 2:1 -->
            <line x1="46" y1="40" x2="46" y2="54" stroke="#64748B" stroke-width="4" stroke-linecap="round" />
            <line x1="22" y1="52" x2="22" y2="67" stroke="#64748B" stroke-width="4" stroke-linecap="round" />
            <line x1="94" y1="64" x2="94" y2="78" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" />
            <line x1="70" y1="76" x2="70" y2="90" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" />

            <!-- Travessas de reforço tubulares inferiores -->
            <line x1="46" y1="48" x2="94" y2="72" stroke="#CBD5E1" stroke-width="2" />
            <line x1="22" y1="60" x2="70" y2="84" stroke="#CBD5E1" stroke-width="2" />
            <line x1="22" y1="60" x2="46" y2="48" stroke="#94A3B8" stroke-width="2" />
            <line x1="70" y1="84" x2="94" y2="72" stroke="#94A3B8" stroke-width="2" />

            <!-- Cauda de baleia na ponta esquerda posterior (curvatura isométrica) -->
            <path d="M22,46 Q10,38 12,28 Q18,34 24,42 Z" fill="#0284C7" stroke="#0369A1" stroke-width="1.5" />
            <path d="M22,48 Q12,58 14,66 Q20,58 24,48 Z" fill="#0369A1" stroke="#075985" stroke-width="1.5" />

            <!-- Espessura / Borda lateral 3D do corpo de baleia (extrusão vertical) -->
            <path
              d="M22,46 Q44,68 70,82 Q96,70 106,58 L106,64 Q96,76 70,88 Q44,74 22,52 Z"
              fill="#0284C7"
              stroke="#0369A1"
              stroke-width="1.5"
            />

            <!-- Tampo estofado isométrico em formato aerodinâmico de baleia azul -->
            <path
              d="M22,46 Q46,32 94,52 Q108,58 102,62 Q94,68 70,82 Q44,68 22,46 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              stroke-width="2"
            />
            <!-- Almofada acolchoada central pastel com reflexo acetinado -->
            <path
              d="M28,47 Q48,37 88,54 Q96,58 92,61 Q84,66 68,76 Q46,65 28,47 Z"
              fill="#BAE6FD"
              opacity="0.92"
            />

            <!-- Costuras ergonômicas transversais do colchão -->
            <line x1="44" y1="45" x2="58" y2="58" stroke="#7DD3FC" stroke-width="1.5" stroke-dasharray="3 2" />
            <line x1="62" y1="53" x2="76" y2="67" stroke="#7DD3FC" stroke-width="1.5" stroke-dasharray="3 2" />

            <!-- Cabeça da baleia (extremidade frontal direita) -->
            <circle cx="94" cy="57" r="3" fill="#0F172A" />
            <circle cx="95" cy="56" r="1.1" fill="#FFFFFF" />
            <path d="M96,62 Q100,64 103,61" stroke="#0C4A6E" stroke-width="1.5" fill="none" stroke-linecap="round" />

            <!-- Esguicho d'água lúdico animado saindo do topo da cabeça -->
            <g class="ambient-bob">
              <path d="M88,48 Q91,32 100,36 M88,48 Q83,30 75,34" stroke="#38BDF8" stroke-width="2" fill="none" stroke-linecap="round" />
              <circle cx="100" cy="35" r="1.8" fill="#7DD3FC" />
              <circle cx="75" cy="33" r="1.8" fill="#7DD3FC" />
            </g>
          </g>
        }

        <!-- 3. ped_maca_f1: Maca Carro de Corrida -->
        @case ('ped_maca_f1') {
          <g>
            <!-- Chassi vermelho corrida -->
            <polygon points="22,66 62,46 98,64 58,84" fill="#EF4444" stroke="#B91C1C" stroke-width="2" />
            <polygon points="34,63 62,49 86,61 58,75" fill="#FEE2E2" />
            <!-- Faixa branca e número 1 -->
            <line x1="30" y1="70" x2="90" y2="54" stroke="#FFFFFF" stroke-width="3" />
            <!-- Rodas isométricas -->
            <circle cx="40" cy="76" r="8" fill="#1E293B" stroke="#F8FAFC" stroke-width="2" />
            <circle cx="80" cy="68" r="8" fill="#1E293B" stroke="#F8FAFC" stroke-width="2" />
            <!-- Volante interativo -->
            <circle cx="72" cy="54" r="5" fill="none" stroke="#0F172A" stroke-width="2.5" />
          </g>
        }

        <!-- 4. ped_regua_girafa: Régua Girafa de Parede -->
        @case ('ped_regua_girafa') {
          <g>
            <rect x="52" y="18" width="16" height="68" rx="6" fill="#FBBF24" stroke="#D97706" stroke-width="2" />
            <!-- Manchas de girafa -->
            <circle cx="57" cy="34" r="3" fill="#B45309" />
            <circle cx="63" cy="48" r="3.5" fill="#B45309" />
            <circle cx="56" cy="64" r="3" fill="#B45309" />
            <!-- Marcações métricas -->
            <line x1="62" y1="28" x2="68" y2="28" stroke="#78350F" stroke-width="1.5" />
            <line x1="62" y1="40" x2="68" y2="40" stroke="#78350F" stroke-width="1.5" />
            <line x1="62" y1="52" x2="68" y2="52" stroke="#78350F" stroke-width="1.5" />
            <line x1="62" y1="64" x2="68" y2="64" stroke="#78350F" stroke-width="1.5" />
            <!-- Cabeça da girafa -->
            <circle cx="60" cy="18" r="10" fill="#FBBF24" stroke="#D97706" stroke-width="2" />
            <circle cx="57" cy="16" r="2" fill="#0F172A" />
            <circle cx="63" cy="16" r="2" fill="#0F172A" />
          </g>
        }

        <!-- 5. ped_balanca_urso: Balança Bebê Ursinho -->
        @case ('ped_balanca_urso') {
          <g>
            <!-- Base da balança -->
            <polygon points="36,74 60,62 84,74 60,86" fill="#FDE68A" stroke="#D97706" stroke-width="2" />
            <!-- Concha anatômica -->
            <ellipse cx="60" cy="56" rx="24" ry="11" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2" />
            <!-- Carinha de urso e visor digital -->
            <circle cx="60" cy="72" r="9" fill="#D97706" />
            <rect x="52" y="69" width="16" height="7" rx="2" fill="#0F172A" />
            <text x="60" y="75" text-anchor="middle" fill="#10B981" font-size="6" font-family="monospace">3.4kg</text>
          </g>
        }

        <!-- 6. ped_piscina_bolinhas: Piscina de Bolinhas Candy Color -->
        @case ('ped_piscina_bolinhas') {
          <g>
            <polygon points="18,66 60,44 102,66 60,88" fill="#FBCFE8" stroke="#EC4899" stroke-width="2.5" />
            <polygon points="26,66 60,48 94,66 60,84" fill="#FDF2F8" />
            <!-- Bolinhas Candy Color -->
            <circle cx="48" cy="64" r="5" fill="#F472B6" />
            <circle cx="58" cy="60" r="5" fill="#60A5FA" />
            <circle cx="68" cy="65" r="5" fill="#34D399" />
            <circle cx="54" cy="70" r="5" fill="#FBBF24" />
            <circle cx="64" cy="72" r="5" fill="#A78BFA" />
            <circle cx="74" cy="62" r="4.5" fill="#FB7185" />
          </g>
        }

        <!-- 7. ped_tenda_leitura: Tenda Tipi Indígena -->
        @case ('ped_tenda_leitura') {
          <g>
            <!-- Tapete redondo base -->
            <ellipse cx="60" cy="76" rx="34" ry="16" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5" />
            <!-- Hastes de madeira -->
            <line x1="60" y1="14" x2="28" y2="78" stroke="#92400E" stroke-width="3" stroke-linecap="round" />
            <line x1="60" y1="14" x2="92" y2="78" stroke="#92400E" stroke-width="3" stroke-linecap="round" />
            <!-- Lona da cabaninha -->
            <polygon points="60,18 28,76 60,84 92,76" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
            <polygon points="60,42 46,78 74,78" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5" />
            <!-- Almofada nuvem -->
            <ellipse cx="60" cy="75" rx="11" ry="6" fill="#BAE6FD" />
          </g>
        }

        <!-- 8. ped_bau_coragem: Baú do Tesouro / Pote de Adesivos -->
        @case ('ped_bau_coragem') {
          <g>
            <polygon points="36,72 60,60 84,72 60,84" fill="#B45309" stroke="#78350F" stroke-width="2" />
            <polygon points="36,56 60,44 84,56 60,68" fill="#D97706" stroke="#78350F" stroke-width="2" />
            <!-- Fecho dourado -->
            <rect x="56" y="60" width="8" height="10" rx="2" fill="#FBBF24" stroke="#92400E" stroke-width="1.5" />
            <!-- Partículas douradas -->
            <g class="ambient-sparkle">
              <circle cx="48" cy="36" r="3" fill="#FBBF24" />
              <circle cx="62" cy="28" r="3.5" fill="#F59E0B" />
              <circle cx="74" cy="38" r="2.5" fill="#FDE047" />
            </g>
          </g>
        }

        <!-- 9. ped_papel_safari: Papel de Parede Safari Aquarela -->
        @case ('ped_papel_safari') {
          <g>
            <polygon points="30,68 30,26 90,26 90,68" fill="#ECFDF5" stroke="#10B981" stroke-width="2" />
            <!-- Sol aquarela e árvore de savana -->
            <circle cx="74" cy="38" r="8" fill="#FDE68A" />
            <path d="M46,66 L46,46 M36,46 Q46,36 56,46" stroke="#047857" stroke-width="3" fill="none" stroke-linecap="round" />
            <ellipse cx="46" cy="44" rx="14" ry="5" fill="#6EE7B7" />
          </g>
        }

        <!-- 10. ped_esteto_elefante: Protetor de Esteto Elefantinho -->
        @case ('ped_esteto_elefante') {
          <g>
            <ellipse cx="60" cy="74" rx="22" ry="11" fill="#E0F2FE" stroke="#0284C7" stroke-width="2" />
            <!-- Tubo do estetoscópio -->
            <path d="M46,68 C40,44 80,44 74,68" stroke="#0D9488" stroke-width="3.5" fill="none" />
            <!-- Elefantinho no centro -->
            <circle cx="60" cy="56" r="10" fill="#60A5FA" stroke="#1D4ED8" stroke-width="1.5" />
            <circle cx="50" cy="56" r="5" fill="#93C5FD" />
            <circle cx="70" cy="56" r="5" fill="#93C5FD" />
            <path d="M60,58 Q60,68 66,66" stroke="#1D4ED8" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
        }

        <!-- 11. mesa_scandi: Mesa Escandinava de Carvalho com Suculenta -->
        @case ('mesa_scandi') {
          <g>
            <!-- Pés de madeira clara -->
            <line x1="30" y1="64" x2="30" y2="84" stroke="#B45309" stroke-width="4" stroke-linecap="round" />
            <line x1="60" y1="78" x2="60" y2="96" stroke="#B45309" stroke-width="4" stroke-linecap="round" />
            <line x1="90" y1="64" x2="90" y2="84" stroke="#B45309" stroke-width="4" stroke-linecap="round" />
            <!-- Tampo isométrico carvalho claro -->
            <polygon points="20,60 60,40 100,60 60,80" fill="#FDE68A" stroke="#D97706" stroke-width="2" />
            <!-- Vaso de suculenta -->
            <rect x="70" y="48" width="10" height="8" rx="2" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
            <circle cx="75" cy="46" r="5" fill="#10B981" />
            <!-- Prontuário sobre a mesa -->
            <polygon points="44,60 56,54 64,58 52,64" fill="#FFFFFF" stroke="#64748B" stroke-width="1" />
          </g>
        }

        <!-- 12. mesa_mogno_cafe: Mesa de Mogno com Xícara de Café Quente -->
        @case ('mesa_mogno_cafe') {
          <g>
            <polygon points="22,64 60,45 98,64 60,83" fill="#7C2D12" stroke="#431407" stroke-width="2" />
            <polygon points="26,64 26,82 60,96 60,83" fill="#9A3412" />
            <polygon points="94,64 94,82 60,96 60,83" fill="#7C2D12" />
            <!-- Xícara de café quente -->
            <ellipse cx="64" cy="60" rx="6" ry="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1.5" />
            <!-- Fumaça animada contínua -->
            <path class="ambient-steam" d="M62,53 Q59,45 64,39 Q68,33 63,27" stroke="#CBD5E1" stroke-width="2" fill="none" stroke-linecap="round" />
            <path class="ambient-steam" d="M67,54 Q70,46 66,40" stroke="#E2E8F0" stroke-width="1.5" fill="none" stroke-linecap="round" />
          </g>
        }

        <!-- 13. mesa_carrara: Mesa Mármore Carrara & Dourado -->
        @case ('mesa_carrara') {
          <g>
            <!-- Estrutura dourada fosca -->
            <line x1="28" y1="62" x2="28" y2="86" stroke="#F59E0B" stroke-width="3.5" />
            <line x1="60" y1="78" x2="60" y2="96" stroke="#F59E0B" stroke-width="3.5" />
            <line x1="92" y1="62" x2="92" y2="86" stroke="#F59E0B" stroke-width="3.5" />
            <!-- Tampo de mármore branco Carrara -->
            <polygon points="20,60 60,40 100,60 60,80" fill="#F8FAFC" stroke="#F59E0B" stroke-width="2.2" />
            <!-- Veios sutis do mármore -->
            <path d="M38,58 L54,52 L62,56" stroke="#CBD5E1" stroke-width="1.5" fill="none" />
            <path d="M64,62 L78,56" stroke="#CBD5E1" stroke-width="1.5" fill="none" />
          </g>
        }

        <!-- 14. cadeira_ergonomica: Cadeira Operacional Mesh (4 rotações ortogonais 2.5D) -->
        @case ('cadeira_ergonomica') {
          @switch (rotation) {
            @case (1) {
              <!-- ROTAÇÃO 1: MESA À DIREITA (SE - Down-Right) -->
              <!-- Cadeira voltada para a mesa à direita (+X). Encosto no canto superior-esquerdo (NW), assento estendido para baixo-direita! -->
              <g class="chair-se-view">
                <!-- Base com rodízios no piso -->
                <ellipse cx="56" cy="88" rx="18" ry="6" fill="#1E293B" opacity="0.25" />
                <line x1="56" y1="84" x2="38" y2="88" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="84" x2="74" y2="86" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="84" x2="56" y2="92" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <line x1="56" y1="68" x2="56" y2="84" stroke="#475569" stroke-width="4.5" />
                <polygon points="44,65 66,65 64,71 46,71" fill="#1E293B" />

                <!-- Encosto Mesh ergonômico no canto superior-esquerdo (NW) -->
                <path d="M36,32 Q32,48 35,64 L44,62 Q41,46 43,30 Z" fill="#1E293B" stroke="#0F172A" stroke-width="1.5" />
                <path d="M38,32 C36,44 36,54 40,62 L46,60 C44,52 44,42 45,30 Z" fill="#0D9488" stroke="#0F766E" stroke-width="1.5" />
                <ellipse cx="41" cy="27" rx="7" ry="4" fill="#1E293B" />

                <!-- Braço traseiro/distante -->
                <line x1="54" y1="42" x2="68" y2="49" stroke="#334155" stroke-width="3" stroke-linecap="round" />

                <!-- Assento estendido para BAIXO-DIREITA (SE - Em direção à mesa!) -->
                <polygon points="40,58 66,46 80,55 54,67" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
                <!-- Bordas da espuma -->
                <polygon points="40,58 54,67 54,72 40,63" fill="#0F766E" />
                <polygon points="54,67 80,55 80,60 54,72" fill="#115E59" />

                <!-- Braço dianteiro em primeiro plano correndo para baixo-direita -->
                <path d="M46,63 L46,55 L64,63" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="46" y1="55" x2="66" y2="64" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />
              </g>
            }
            @case (2) {
              <!-- ROTAÇÃO 2: FUNDO / MESA NE (Up-Right) -->
              <!-- Costas da cadeira voltada para a câmera, assento virado para cima-direita -->
              <g class="chair-ne-view">
                <ellipse cx="58" cy="88" rx="18" ry="6" fill="#1E293B" opacity="0.25" />
                <line x1="58" y1="84" x2="40" y2="88" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="58" y1="84" x2="76" y2="87" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="58" y1="84" x2="58" y2="92" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <line x1="58" y1="68" x2="58" y2="84" stroke="#475569" stroke-width="5" />
                <polygon points="46,67 72,54 84,60 58,73" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
                <polygon points="46,67 58,73 58,78 46,72" fill="#0F766E" />
                <polygon points="58,73 84,60 84,65 58,78" fill="#115E59" />
                <path d="M48,70 Q42,54 45,36 L51,36 Q48,54 54,70 Z" fill="#1E293B" stroke="#0F172A" stroke-width="1.5" />
                <path d="M46,35 C44,46 43,58 48,67 L54,66 C50,58 51,46 53,35 Z" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
                <path d="M47,34 Q50,28 55,30 Q58,32 56,37 L50,37 Z" fill="#1E293B" />
                <path d="M52,66 L52,55 L68,47" stroke="#334155" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="50" y1="54" x2="71" y2="44" stroke="#1E293B" stroke-width="5" stroke-linecap="round" />
              </g>
            }
            @case (3) {
              <!-- ROTAÇÃO 3: MESA À ESQUERDA (SW - Down-Left) -->
              <!-- Cadeira voltada para a mesa à esquerda (+Y). Encosto no canto superior-direito (NE), assento estendido para baixo-esquerda! -->
              <g class="chair-sw-view">
                <ellipse cx="64" cy="88" rx="18" ry="6" fill="#1E293B" opacity="0.25" />
                <line x1="64" y1="84" x2="46" y2="86" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="84" x2="82" y2="88" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="84" x2="64" y2="92" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <line x1="64" y1="68" x2="64" y2="84" stroke="#475569" stroke-width="4.5" />
                <polygon points="56,65 76,65 74,71 54,71" fill="#1E293B" />

                <!-- Encosto Mesh ergonômico no canto superior-direito (NE) -->
                <path d="M84,32 Q88,48 85,64 L76,62 Q79,46 77,30 Z" fill="#1E293B" stroke="#0F172A" stroke-width="1.5" />
                <path d="M82,32 C84,44 84,54 80,62 L74,60 C76,52 76,42 75,30 Z" fill="#0D9488" stroke="#0F766E" stroke-width="1.5" />
                <ellipse cx="79" cy="27" rx="7" ry="4" fill="#1E293B" />

                <!-- Braço traseiro/distante -->
                <line x1="66" y1="42" x2="52" y2="49" stroke="#334155" stroke-width="3" stroke-linecap="round" />

                <!-- Assento estendido para BAIXO-ESQUERDA (SW - Em direção à mesa!) -->
                <polygon points="80,58 54,46 40,55 66,67" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
                <polygon points="80,58 66,67 66,72 80,63" fill="#0F766E" />
                <polygon points="66,67 40,55 40,60 66,72" fill="#115E59" />

                <!-- Braço dianteiro em primeiro plano correndo para baixo-esquerda -->
                <path d="M74,63 L74,55 L56,63" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="74" y1="55" x2="54" y2="64" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />
              </g>
            }
            @default {
              <!-- ROTAÇÃO 0: VISTA FRONTAL / SALA (South) -->
              <g>
                <line x1="60" y1="72" x2="60" y2="88" stroke="#334155" stroke-width="4" />
                <line x1="46" y1="88" x2="74" y2="88" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="53" y1="88" x2="43" y2="92" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
                <line x1="67" y1="88" x2="77" y2="92" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
                <polygon points="42,68 60,59 78,68 60,77" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
                <polygon points="42,68 60,77 60,81 42,72" fill="#0F766E" />
                <polygon points="60,77 78,68 78,72 60,81" fill="#115E59" />
                <rect x="48" y="34" width="24" height="28" rx="6" fill="#1E293B" stroke="#0D9488" stroke-width="2" />
                <path d="M42,62 L38,62 L38,52 L44,52" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round" />
                <path d="M78,62 L82,62 L82,52 L76,52" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round" />
              </g>
            }
          }
        }

        <!-- 15. cadeira_presidente_couro: Cadeira Presidente Couro Caramelo Capitonê -->
        @case ('cadeira_presidente_couro') {
          @switch (rotation) {
            @case (1) {
              <!-- ROTAÇÃO 1: MESA À DIREITA (SE - Down-Right) -->
              <g class="chair-se-view">
                <ellipse cx="56" cy="88" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="56" y1="84" x2="38" y2="88" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="84" x2="74" y2="86" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="84" x2="56" y2="92" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="56" y1="68" x2="56" y2="84" stroke="#78350F" stroke-width="5" />
                <polygon points="44,65 66,65 64,71 46,71" fill="#451A03" />

                <!-- Encosto Alto Couro no canto superior-esquerdo (NW) -->
                <path d="M34,24 Q30,44 34,63 L44,61 Q41,43 43,22 Z" fill="#B45309" stroke="#78350F" stroke-width="2" />
                <ellipse cx="38" cy="21" rx="7" ry="5" fill="#92400E" stroke="#78350F" stroke-width="1.5" />
                <circle cx="38" cy="32" r="1.8" fill="#FEF3C7" />
                <circle cx="38" cy="44" r="1.8" fill="#FEF3C7" />
                <circle cx="39" cy="54" r="1.8" fill="#FEF3C7" />

                <!-- Braço traseiro/distante -->
                <line x1="54" y1="42" x2="68" y2="48" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" />

                <!-- Assento estendido para BAIXO-DIREITA (SE - Em direção à mesa!) -->
                <polygon points="40,58 66,45 80,54 54,67" fill="#D97706" stroke="#92400E" stroke-width="2" />
                <polygon points="40,58 54,67 54,72 40,63" fill="#B45309" />
                <polygon points="54,67 80,54 80,59 54,72" fill="#92400E" />

                <!-- Braço dianteiro estofado em couro correndo para baixo-direita -->
                <path d="M46,62 L46,53 L66,61" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="44" y1="52" x2="68" y2="62" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
              </g>
            }
            @case (2) {
              <!-- ROTAÇÃO 2: FUNDO / MESA NE (Up-Right) -->
              <g class="chair-ne-view">
                <ellipse cx="58" cy="88" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="58" y1="84" x2="40" y2="88" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="58" y1="84" x2="76" y2="87" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="58" y1="84" x2="58" y2="92" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="58" y1="68" x2="58" y2="84" stroke="#78350F" stroke-width="5" />
                <polygon points="46,67 68,67 66,73 48,73" fill="#451A03" />
                <path d="M43,26 C41,40 41,56 46,68 L53,67 C49,56 49,40 51,26 Z" fill="#B45309" stroke="#78350F" stroke-width="2" />
                <path d="M43,26 Q47,20 54,22 Q58,24 56,29 L48,29 Z" fill="#92400E" stroke="#78350F" stroke-width="1.5" />
                <circle cx="48" cy="36" r="1.8" fill="#FEF3C7" />
                <circle cx="49" cy="46" r="1.8" fill="#FEF3C7" />
                <circle cx="50" cy="56" r="1.8" fill="#FEF3C7" />
                <polygon points="45,67 72,53 84,59 58,73" fill="#D97706" stroke="#92400E" stroke-width="2" />
                <polygon points="45,67 58,73 58,78 45,72" fill="#B45309" />
                <polygon points="58,73 84,59 84,64 58,78" fill="#92400E" />
                <path d="M50,65 L50,53 L68,44" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="48" y1="52" x2="71" y2="41" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
              </g>
            }
            @case (3) {
              <!-- ROTAÇÃO 3: MESA À ESQUERDA (SW - Down-Left) -->
              <g class="chair-sw-view">
                <ellipse cx="64" cy="88" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="64" y1="84" x2="46" y2="86" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="84" x2="82" y2="88" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="84" x2="64" y2="92" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="64" y1="68" x2="64" y2="84" stroke="#78350F" stroke-width="5" />
                <polygon points="54,65 76,65 74,71 56,71" fill="#451A03" />

                <!-- Encosto Alto Couro no canto superior-direito (NE) -->
                <path d="M86,24 Q90,44 86,63 L76,61 Q79,43 77,22 Z" fill="#B45309" stroke="#78350F" stroke-width="2" />
                <ellipse cx="82" cy="21" rx="7" ry="5" fill="#92400E" stroke="#78350F" stroke-width="1.5" />
                <circle cx="82" cy="32" r="1.8" fill="#FEF3C7" />
                <circle cx="82" cy="44" r="1.8" fill="#FEF3C7" />
                <circle cx="81" cy="54" r="1.8" fill="#FEF3C7" />

                <!-- Braço traseiro/distante -->
                <line x1="66" y1="42" x2="52" y2="48" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" />

                <!-- Assento estendido para BAIXO-ESQUERDA (SW - Em direção à mesa!) -->
                <polygon points="80,58 54,45 40,54 66,67" fill="#D97706" stroke="#92400E" stroke-width="2" />
                <polygon points="80,58 66,67 66,72 80,63" fill="#B45309" />
                <polygon points="66,67 40,54 40,59 66,72" fill="#92400E" />

                <!-- Braço dianteiro estofado em couro correndo para baixo-esquerda -->
                <path d="M74,62 L74,53 L54,61" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="76" y1="52" x2="52" y2="62" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
              </g>
            }
            @default {
              <!-- ROTAÇÃO 0: VISTA FRONTAL / SALA (South) -->
              <g>
                <line x1="60" y1="72" x2="60" y2="88" stroke="#78350F" stroke-width="4" />
                <line x1="44" y1="88" x2="76" y2="88" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <polygon points="40,68 60,58 80,68 60,78" fill="#D97706" stroke="#92400E" stroke-width="2" />
                <polygon points="40,68 60,78 60,82 40,72" fill="#B45309" />
                <polygon points="60,78 80,68 80,72 60,82" fill="#92400E" />
                <rect x="45" y="28" width="30" height="34" rx="8" fill="#B45309" stroke="#78350F" stroke-width="2" />
                <circle cx="54" cy="40" r="2" fill="#FEF3C7" />
                <circle cx="66" cy="40" r="2" fill="#FEF3C7" />
                <circle cx="54" cy="50" r="2" fill="#FEF3C7" />
                <circle cx="66" cy="50" r="2" fill="#FEF3C7" />
                <path d="M40,62 L36,62 L36,50 L42,50" stroke="#78350F" stroke-width="3" fill="none" stroke-linecap="round" />
                <path d="M80,62 L84,62 L84,50 L78,50" stroke="#78350F" stroke-width="3" fill="none" stroke-linecap="round" />
              </g>
            }
          }
        }

        <!-- 16. pc_ultrawide: Estação de Trabalho com Monitor Ultrawide -->
        @case ('pc_ultrawide') {
          <g>
            <rect x="55" y="64" width="10" height="14" fill="#64748B" />
            <ellipse cx="60" cy="78" rx="16" ry="6" fill="#475569" />
            <!-- Tela curva ultrawide -->
            <path d="M26,34 Q60,40 94,34 L94,62 Q60,68 26,62 Z" fill="#0F172A" stroke="#0D9488" stroke-width="2.5" />
            <!-- Gráficos médicos na tela -->
            <line x1="34" y1="46" x2="56" y2="46" stroke="#38BDF8" stroke-width="2.5" />
            <line x1="34" y1="53" x2="48" y2="53" stroke="#10B981" stroke-width="2.5" />
            <polyline points="62,54 68,54 71,44 75,58 79,50 86,50" fill="none" stroke="#F59E0B" stroke-width="2" />
          </g>
        }

        <!-- 17. didatico_dr_bones: Esqueleto Didático "Dr. Bones" (gravata borboleta vermelha) -->
        @case ('didatico_dr_bones') {
          <g>
            <!-- Pedestal -->
            <ellipse cx="60" cy="84" rx="16" ry="7" fill="#64748B" />
            <line x1="60" y1="30" x2="60" y2="84" stroke="#94A3B8" stroke-width="2.5" />
            <!-- Crânio simpático -->
            <circle cx="60" cy="24" r="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
            <circle cx="56" cy="23" r="2.2" fill="#0F172A" />
            <circle cx="64" cy="23" r="2.2" fill="#0F172A" />
            <!-- Costelas -->
            <line x1="50" y1="42" x2="70" y2="42" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round" />
            <line x1="52" y1="48" x2="68" y2="48" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round" />
            <line x1="54" y1="54" x2="66" y2="54" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round" />
            <!-- Gravata borboleta vermelha icônica -->
            <polygon points="53,34 60,37 53,40" fill="#EF4444" />
            <polygon points="67,34 60,37 67,40" fill="#EF4444" />
            <circle cx="60" cy="37" r="2" fill="#B91C1C" />
            <!-- Braço acenando -->
            <path class="ambient-wave" d="M70,42 L82,30" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round" />
          </g>
        }

        <!-- 18. esteto_ouro_master: Estetoscópio Master Ouro em Suporte -->
        @case ('esteto_ouro_master') {
          <g>
            <polygon points="38,74 60,63 82,74 60,85" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5" />
            <rect x="46" y="32" width="28" height="42" rx="4" fill="rgba(224, 242, 254, 0.55)" stroke="#7DD3FC" stroke-width="1.5" />
            <path d="M52,40 C52,60 68,60 68,40" stroke="#0F172A" stroke-width="3" fill="none" />
            <circle cx="60" cy="62" r="6" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
          </g>
        }

        <!-- 19. monitor_ecg: Monitor Cardíaco com Traçado Vivo em Loop -->
        @case ('monitor_ecg') {
          <g>
            <!-- Pedestal hospitalar com rodízios -->
            <line x1="60" y1="58" x2="60" y2="86" stroke="#64748B" stroke-width="4" />
            <ellipse cx="60" cy="86" rx="16" ry="6" fill="#334155" />
            <!-- Monitor multiparamétrico -->
            <rect x="34" y="26" width="52" height="34" rx="5" fill="#0F172A" stroke="#334155" stroke-width="2.5" />
            <!-- Traçado ECG verde vivo em loop -->
            <polyline
              class="ecg-trace-line"
              points="38,44 48,44 52,38 56,52 60,30 64,48 68,42 82,42"
              fill="none"
              stroke="#10B981"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="80" cy="32" r="2.5" fill="#10B981" />
          </g>
        }

        <!-- 20. usg_fetal_4d: Aparelho de Ultrassom 4D com Display Colorido -->
        @case ('usg_fetal_4d') {
          <g>
            <rect x="44" y="54" width="32" height="28" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
            <rect x="38" y="24" width="44" height="28" rx="4" fill="#0F172A" stroke="#CBD5E1" stroke-width="2.5" />
            <!-- Cone de ultrassom 4D dourado/âmbar -->
            <path d="M60,30 L46,48 Q60,52 74,48 Z" fill="#F59E0B" opacity="0.85" />
            <circle cx="60" cy="40" r="4.5" fill="#FEF3C7" />
          </g>
        }

        <!-- 21. negatoscopio_led: Negatoscópio Ultra-Slim com Radiografia Iluminada -->
        @case ('negatoscopio_led') {
          <g>
            <rect x="34" y="24" width="52" height="44" rx="4" fill="#E0F2FE" stroke="#0284C7" stroke-width="2.5" />
            <rect x="40" y="28" width="40" height="36" rx="2" fill="#0F172A" />
            <!-- Pulmões e costelas iluminados em ciano -->
            <ellipse cx="53" cy="46" rx="7" ry="11" fill="#38BDF8" opacity="0.7" />
            <ellipse cx="67" cy="46" rx="7" ry="11" fill="#38BDF8" opacity="0.7" />
            <line x1="60" y1="32" x2="60" y2="58" stroke="#F8FAFC" stroke-width="2" />
          </g>
        }

        <!-- 22. estante_harrison: Estante Gigante com Tratados Clássicos de Medicina -->
        @case ('estante_harrison') {
          <g>
            <rect x="28" y="20" width="64" height="64" rx="4" fill="#78350F" stroke="#451A03" stroke-width="2.5" />
            <line x1="30" y1="42" x2="90" y2="42" stroke="#451A03" stroke-width="3" />
            <line x1="30" y1="62" x2="90" y2="62" stroke="#451A03" stroke-width="3" />
            <!-- Lombadas coloridas dos tratados médicos -->
            <rect x="34" y="26" width="8" height="15" fill="#EF4444" />
            <rect x="44" y="26" width="9" height="15" fill="#3B82F6" />
            <rect x="55" y="26" width="8" height="15" fill="#10B981" />
            <rect x="65" y="26" width="10" height="15" fill="#F59E0B" />
            <rect x="36" y="46" width="10" height="15" fill="#0D9488" />
            <rect x="48" y="46" width="8" height="15" fill="#F43F5E" />
            <rect x="58" y="46" width="12" height="15" fill="#6366F1" />
          </g>
        }

        <!-- 23. cafe_espresso_vermelho: Máquina de Espresso Gourmet -->
        @case ('cafe_espresso_vermelho') {
          <g>
            <rect x="42" y="34" width="36" height="46" rx="6" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
            <rect x="48" y="54" width="24" height="18" rx="2" fill="#1E293B" />
            <!-- Xícara branca -->
            <rect x="55" y="62" width="10" height="8" rx="2" fill="#F8FAFC" />
            <!-- Vapor animado -->
            <path class="ambient-steam" d="M60,58 Q56,48 62,42" stroke="#F8FAFC" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>
        }

        <!-- 24. mascote_gato_bisturi: Gato "Bisturi" dormindo na poltrona -->
        @case ('mascote_gato_bisturi') {
          <g>
            <!-- Almofada/Poltrona verde água -->
            <ellipse cx="60" cy="72" rx="26" ry="13" fill="#0D9488" stroke="#115E59" stroke-width="2" />
            <!-- Gatinho laranja enrodilhado -->
            <ellipse cx="60" cy="66" rx="14" ry="9" fill="#FB923C" stroke="#C2410C" stroke-width="1.8" />
            <circle cx="50" cy="64" r="7" fill="#FB923C" stroke="#C2410C" stroke-width="1.5" />
            <!-- Orelhinhas -->
            <polygon points="45,59 48,53 52,58" fill="#EA580C" />
            <polygon points="52,58 56,53 57,59" fill="#EA580C" />
            <!-- Zzz de sono / ronronar -->
            <text class="ambient-bob" x="68" y="48" fill="#F59E0B" font-size="11" font-weight="bold">Zzz</text>
          </g>
        }

        <!-- 25. mascote_cao_caramelo: Golden Retriever "Dr. Caramelo" -->
        @case ('mascote_cao_caramelo') {
          <g>
            <!-- Tapetinho -->
            <ellipse cx="60" cy="76" rx="24" ry="11" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
            <!-- Corpo dourado caramelo -->
            <ellipse cx="60" cy="66" rx="15" ry="11" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
            <!-- Cabeça simpática -->
            <circle cx="50" cy="52" r="10" fill="#FBBF24" stroke="#B45309" stroke-width="2" />
            <!-- Bandana médica verde-água -->
            <polygon points="44,59 58,59 51,67" fill="#0D9488" />
            <circle cx="48" cy="50" r="2" fill="#0F172A" />
            <circle cx="43" cy="53" r="2.5" fill="#0F172A" />
            <!-- Rabo abanando -->
            <path class="ambient-wag" d="M74,64 Q86,54 82,46" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round" />
          </g>
        }

        <!-- 26. balcao_recepcao_madeira: Balcão de Recepção em Madeira Clara -->
        @case ('balcao_recepcao_madeira') {
          <g>
            <polygon points="20,62 60,42 100,62 60,82" fill="#FDE68A" stroke="#B45309" stroke-width="2" />
            <polygon points="20,62 20,82 60,98 60,82" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
            <polygon points="100,62 100,82 60,98 60,82" fill="#D97706" stroke="#B45309" stroke-width="1.5" />
            <!-- Sininho de recepção -->
            <circle cx="60" cy="58" r="4" fill="#FBBF24" stroke="#78350F" stroke-width="1.5" />
          </g>
        }


        <!-- ------------------------------------------------------------- -->
        <!-- PEDIATRIA (Novos Itens - P-092) -->
        <!-- ------------------------------------------------------------- -->
        @case ('ped_tapete_amarelinha') {
          <g>
            <polygon points="20,64 60,44 100,64 60,84" fill="#38BDF8" stroke="#0284C7" stroke-width="2" />
            <polygon points="32,62 60,48 88,62 60,76" fill="#FDE047" opacity="0.9" />
            <rect x="52" y="54" width="16" height="12" rx="2" fill="#F43F5E" />
            <circle cx="60" cy="60" r="3" fill="#FFFFFF" />
          </g>
        }

        @case ('ped_mesa_desenho_infantil') {
          <g>
            <polygon points="26,62 60,44 94,62 60,80" fill="#FBBF24" stroke="#D97706" stroke-width="2" />
            <rect x="34" y="64" width="5" height="14" rx="2" fill="#D97706" />
            <rect x="81" y="64" width="5" height="14" rx="2" fill="#D97706" />
            <!-- Copo de lápis coloridos -->
            <rect x="66" y="48" width="7" height="10" rx="2" fill="#EF4444" />
            <circle cx="70" cy="46" r="2.5" fill="#3B82F6" />
            <rect x="42" y="53" width="16" height="10" rx="1" fill="#FEF08A" stroke="#CA8A04" stroke-width="1" />
          </g>
        }

        @case ('ped_cadeirinha_sapinho') {
          <g>
            <ellipse cx="60" cy="66" rx="16" ry="12" fill="#22C55E" stroke="#15803D" stroke-width="2" />
            <circle cx="53" cy="54" r="5" fill="#22C55E" stroke="#15803D" stroke-width="1.5" />
            <circle cx="67" cy="54" r="5" fill="#22C55E" stroke="#15803D" stroke-width="1.5" />
            <circle cx="53" cy="54" r="2" fill="#0F172A" />
            <circle cx="67" cy="54" r="2" fill="#0F172A" />
            <path d="M54,68 Q60,74 66,68" stroke="#15803D" stroke-width="2" fill="none" stroke-linecap="round" />
            <rect x="50" y="74" width="4" height="12" rx="2" fill="#15803D" />
            <rect x="66" y="74" width="4" height="12" rx="2" fill="#15803D" />
          </g>
        }

        @case ('ped_oftalmo_figuras_lea') {
          <g>
            <rect x="42" y="24" width="36" height="54" rx="3" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
            <!-- Ícone Maçã -->
            <circle cx="60" cy="38" r="5" fill="#EF4444" />
            <!-- Ícone Casa -->
            <polygon points="54,54 60,48 66,54" fill="#3B82F6" />
            <rect x="56" y="54" width="8" height="6" fill="#3B82F6" />
            <!-- Ícone Círculo -->
            <circle cx="60" cy="68" r="4" fill="#EAB308" />
          </g>
        }

        @case ('ped_mobile_planetas') {
          <g>
            <line x1="60" y1="18" x2="60" y2="46" stroke="#94A3B8" stroke-width="1.5" />
            <ellipse cx="60" cy="46" rx="24" ry="8" fill="none" stroke="#CBD5E1" stroke-width="1.5" />
            <!-- Sol central -->
            <circle cx="60" cy="46" r="6" fill="#F59E0B" />
            <!-- Planetas coloridos -->
            <circle class="ambient-bob" cx="42" cy="48" r="4" fill="#38BDF8" />
            <circle class="ambient-bob" cx="78" cy="44" r="5" fill="#EC4899" />
          </g>
        }

        @case ('ped_otoscopio_pinguim') {
          <g>
            <rect x="48" y="70" width="24" height="14" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.5" />
            <!-- Corpo pinguim -->
            <ellipse cx="60" cy="56" rx="10" ry="16" fill="#0F172A" />
            <ellipse cx="60" cy="58" rx="6" ry="11" fill="#FFFFFF" />
            <!-- Bico laranja -->
            <polygon points="57,52 63,52 60,57" fill="#F97316" />
            <circle cx="56" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="64" cy="48" r="1.5" fill="#FFFFFF" />
            <!-- Ponta metálica do otoscópio -->
            <rect x="58" y="32" width="4" height="12" rx="1" fill="#CBD5E1" stroke="#64748B" stroke-width="1" />
          </g>
        }

        @case ('ped_carrinho_vacina_sorriso') {
          <g>
            <!-- Carrinho com 2 bandejas -->
            <rect x="42" y="52" width="36" height="26" rx="3" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
            <rect x="45" y="55" width="30" height="20" rx="2" fill="#CCFBF1" />
            <!-- Sorriso sticker -->
            <circle cx="60" cy="65" r="6" fill="#FDE047" stroke="#CA8A04" stroke-width="1" />
            <path d="M57,66 Q60,69 63,66" stroke="#0F172A" stroke-width="1.5" fill="none" stroke-linecap="round" />
            <!-- Rodinhas -->
            <circle cx="46" cy="80" r="3" fill="#334155" />
            <circle cx="74" cy="80" r="3" fill="#334155" />
          </g>
        }

        @case ('ped_pelucia_microbios') {
          <g>
            <!-- Cesto de vime -->
            <ellipse cx="60" cy="74" rx="18" ry="10" fill="#D97706" stroke="#B45309" stroke-width="2" />
            <rect x="43" y="62" width="34" height="12" fill="#F59E0B" />
            <!-- Pelúcia Glóbulo Branco -->
            <circle class="ambient-bob" cx="54" cy="56" r="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
            <circle cx="51" cy="54" r="1" fill="#0F172A" />
            <circle cx="57" cy="54" r="1" fill="#0F172A" />
            <path d="M52,58 Q54,60 56,58" stroke="#EF4444" stroke-width="1" fill="none" />
            <!-- Pelúcia Microbio Verde -->
            <circle class="ambient-bob" cx="68" cy="54" r="7" fill="#4ADE80" stroke="#16A34A" stroke-width="1.5" />
          </g>
        }

        @case ('ped_painel_engrenagens') {
          <g>
            <rect x="38" y="28" width="44" height="50" rx="4" fill="#FDE68A" stroke="#D97706" stroke-width="2" />
            <!-- Engrenagem Rosa -->
            <circle cx="52" cy="44" r="9" fill="#F472B6" stroke="#DB2777" stroke-width="2" />
            <circle cx="52" cy="44" r="3" fill="#FFFFFF" />
            <!-- Engrenagem Azul -->
            <circle cx="68" cy="54" r="11" fill="#38BDF8" stroke="#0284C7" stroke-width="2" />
            <circle cx="68" cy="54" r="4" fill="#FFFFFF" />
          </g>
        }

        @case ('ped_escorregador_elefante') {
          <g>
            <!-- Corpo elefante pastel -->
            <ellipse cx="46" cy="62" rx="14" ry="12" fill="#6EE7B7" stroke="#059669" stroke-width="2" />
            <circle cx="40" cy="54" r="8" fill="#A7F3D0" />
            <circle cx="38" cy="52" r="1.5" fill="#0F172A" />
            <!-- Rampa do escorregador (tromba) -->
            <path d="M48,58 Q70,62 86,78 L80,82 Q65,68 46,64 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="2" />
          </g>
        }

        @case ('ped_balanca_digital_aquecida') {
          <g>
            <polygon points="34,68 60,52 86,68 60,84" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
            <!-- Concha acolchoada azul -->
            <ellipse cx="60" cy="62" rx="20" ry="9" fill="#7DD3FC" stroke="#0284C7" stroke-width="1.5" />
            <!-- Display LED -->
            <rect x="52" y="70" width="16" height="6" rx="1" fill="#0F172A" />
            <text x="60" y="75" font-size="5" fill="#38BDF8" font-family="monospace" text-anchor="middle">3.45 kg</text>
          </g>
        }

        @case ('ped_berco_aquecido') {
          <g>
            <!-- Estrutura do berço -->
            <polygon points="30,64 60,46 90,64 60,82" fill="#FFFFFF" stroke="#0D9488" stroke-width="2" />
            <rect x="36" y="66" width="4" height="18" fill="#94A3B8" />
            <rect x="80" y="66" width="4" height="18" fill="#94A3B8" />
            <!-- Haste do aquecedor radiante -->
            <path d="M40,64 L40,28 L68,28" stroke="#0D9488" stroke-width="3" fill="none" />
            <rect x="62" y="26" width="16" height="6" rx="2" fill="#F59E0B" />
          </g>
        }

        @case ('ped_fototerapia_led') {
          <g>
            <rect x="57" y="32" width="6" height="46" fill="#94A3B8" />
            <circle cx="60" cy="78" r="8" fill="#334155" />
            <!-- Painel LED azul -->
            <rect x="42" y="24" width="36" height="12" rx="3" fill="#0284C7" stroke="#0369A1" stroke-width="2" />
            <rect class="ambient-bob" x="46" y="26" width="28" height="8" rx="1" fill="#38BDF8" opacity="0.9" />
          </g>
        }

        @case ('ped_circuito_espuma') {
          <g>
            <polygon points="20,62 60,38 100,62 60,86" fill="#A7F3D0" stroke="#059669" stroke-width="2" />
            <!-- Degraus coloridos -->
            <polygon points="30,58 50,46 60,52 40,64" fill="#FDE047" />
            <polygon points="50,46 70,34 80,40 60,52" fill="#F472B6" />
            <!-- Túnel lúdico -->
            <path d="M55,70 Q65,58 75,70" stroke="#38BDF8" stroke-width="6" fill="none" />
          </g>
        }

        @case ('ped_incubadora_neonatal') {
          <g>
            <!-- Base rodízio -->
            <polygon points="32,68 60,50 88,68 60,86" fill="#F1F5F9" stroke="#64748B" stroke-width="2" />
            <rect x="40" y="72" width="40" height="10" rx="2" fill="#E2E8F0" />
            <!-- Cúpula acrílica transparente -->
            <path d="M38,62 Q60,34 82,62 Z" fill="rgba(56, 189, 248, 0.35)" stroke="#0284C7" stroke-width="2" />
            <!-- Painel digital -->
            <rect x="66" y="52" width="12" height="8" rx="1" fill="#0F172A" />
            <circle cx="70" cy="56" r="1.5" fill="#10B981" />
          </g>
        }

        @case ('ped_castelo_faz_de_conta') {
          <g>
            <polygon points="22,64 60,40 98,64 60,88" fill="#FDE68A" stroke="#D97706" stroke-width="2" />
            <!-- Torres do castelo -->
            <rect x="28" y="38" width="14" height="26" fill="#FBBF24" stroke="#B45309" stroke-width="1.5" />
            <polygon points="26,38 35,26 44,38" fill="#EF4444" />
            <rect x="78" y="38" width="14" height="26" fill="#FBBF24" stroke="#B45309" stroke-width="1.5" />
            <polygon points="76,38 85,26 94,38" fill="#EF4444" />
            <!-- Portal com arco -->
            <path d="M52,70 Q60,58 68,70 Z" fill="#78350F" />
          </g>
        }

        <!-- ------------------------------------------------------------- -->
        <!-- MOBILIÁRIO MÉDICO (Novos Itens - P-092) -->
        <!-- ------------------------------------------------------------- -->
        @case ('maca_clinica_antisseptica') {
          <g>
            <polygon points="24,64 60,44 96,64 60,84" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2" />
            <rect x="34" y="68" width="5" height="16" rx="2" fill="#64748B" />
            <rect x="81" y="68" width="5" height="16" rx="2" fill="#64748B" />
            <!-- Rolo de lençol de papel -->
            <ellipse cx="88" cy="60" rx="4" ry="7" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
          </g>
        }

        @case ('mocho_giratorio_clinico') {
          <g>
            <ellipse cx="60" cy="60" rx="13" ry="8" fill="#0D9488" stroke="#0F766E" stroke-width="2" />
            <!-- Encosto lombar -->
            <rect x="56" y="44" width="8" height="12" rx="2" fill="#0F766E" />
            <line x1="60" y1="68" x2="60" y2="78" stroke="#64748B" stroke-width="3" />
            <!-- Rodízios -->
            <circle cx="50" cy="80" r="2.5" fill="#334155" />
            <circle cx="70" cy="80" r="2.5" fill="#334155" />
          </g>
        }

        @case ('biombo_triplo_privacidade') {
          <g>
            <polygon points="30,68 45,56 45,30 30,42" fill="#CCFBF1" stroke="#0D9488" stroke-width="1.5" />
            <polygon points="45,56 65,68 65,42 45,30" fill="#E6FFFA" stroke="#0D9488" stroke-width="1.5" />
            <polygon points="65,68 85,56 85,30 65,42" fill="#CCFBF1" stroke="#0D9488" stroke-width="1.5" />
          </g>
        }

        @case ('escada_dois_degraus') {
          <g>
            <polygon points="42,70 56,62 70,70 56,78" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5" />
            <polygon points="46,62 56,56 66,62 56,68" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5" />
            <rect x="42" y="70" width="4" height="10" fill="#334155" />
            <rect x="68" y="70" width="4" height="10" fill="#334155" />
          </g>
        }

        @case ('suporte_soro_cromado') {
          <g>
            <line x1="60" y1="20" x2="60" y2="80" stroke="#94A3B8" stroke-width="3" />
            <line x1="52" y1="22" x2="68" y2="22" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
            <!-- Bolsa de soro -->
            <rect x="53" y="24" width="6" height="11" rx="2" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1" />
            <circle cx="60" cy="80" r="5" fill="#334155" />
          </g>
        }

        @case ('mesa_auxiliar_inox') {
          <g>
            <polygon points="36,58 60,44 84,58 60,72" fill="#F1F5F9" stroke="#64748B" stroke-width="2" />
            <polygon points="38,70 60,58 82,70 60,82" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5" />
            <rect x="38" y="58" width="3" height="24" fill="#64748B" />
            <rect x="79" y="58" width="3" height="24" fill="#64748B" />
          </g>
        }

        @case ('armario_vitrine_remedios') {
          <g>
            <rect x="42" y="26" width="36" height="56" rx="3" fill="#F8FAFC" stroke="#64748B" stroke-width="2" />
            <rect x="46" y="30" width="28" height="48" fill="rgba(224, 242, 254, 0.45)" stroke="#38BDF8" stroke-width="1.5" />
            <line x1="60" y1="30" x2="60" y2="78" stroke="#64748B" stroke-width="1" />
            <!-- Frascos de medicamentos -->
            <rect x="49" y="40" width="4" height="6" fill="#EF4444" />
            <rect x="55" y="40" width="4" height="6" fill="#10B981" />
            <rect x="63" y="40" width="4" height="6" fill="#F59E0B" />
          </g>
        }

        @case ('foco_clinico_led') {
          <g>
            <path d="M60,80 L60,46 Q60,32 72,30" stroke="#64748B" stroke-width="3" fill="none" />
            <!-- Cúpula refletora LED -->
            <ellipse cx="74" cy="32" rx="8" ry="5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" />
            <circle cx="60" cy="80" r="6" fill="#334155" />
          </g>
        }

        @case ('gaveteiro_modular_madeira') {
          <g>
            <rect x="44" y="44" width="32" height="38" rx="2" fill="#E8D8C4" stroke="#B45309" stroke-width="2" />
            <rect x="48" y="48" width="24" height="8" rx="1" fill="#FDFBF7" stroke="#D97706" stroke-width="1" />
            <rect x="48" y="58" width="24" height="8" rx="1" fill="#FDFBF7" stroke="#D97706" stroke-width="1" />
            <rect x="48" y="68" width="24" height="8" rx="1" fill="#FDFBF7" stroke="#D97706" stroke-width="1" />
            <line x1="56" y1="52" x2="64" y2="52" stroke="#78350F" stroke-width="1.5" />
            <line x1="56" y1="62" x2="64" y2="62" stroke="#78350F" stroke-width="1.5" />
            <line x1="56" y1="72" x2="64" y2="72" stroke="#78350F" stroke-width="1.5" />
          </g>
        }

        @case ('poltrona_reclinavel_coleta') {
          <g>
            <rect x="40" y="48" width="40" height="26" rx="4" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2" />
            <rect x="36" y="52" width="6" height="18" rx="2" fill="#1E40AF" />
            <rect x="78" y="52" width="6" height="18" rx="2" fill="#1E40AF" />
            <rect x="44" y="74" width="32" height="8" rx="2" fill="#1E293B" />
          </g>
        }

        @case ('mesa_atendimento_em_l') {
          <g>
            <polygon points="18,62 58,38 98,62 58,86" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
            <polygon points="18,62 38,74 78,50 58,38" fill="#FDE68A" />
            <rect x="24" y="68" width="5" height="16" fill="#78350F" />
            <rect x="88" y="68" width="5" height="16" fill="#78350F" />
          </g>
        }

        @case ('estante_modular_nichos') {
          <g>
            <rect x="34" y="24" width="52" height="42" rx="3" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
            <!-- 4 nichos com livros -->
            <rect x="38" y="28" width="20" height="16" fill="#334155" />
            <rect x="62" y="28" width="20" height="16" fill="#334155" />
            <rect x="38" y="46" width="20" height="16" fill="#334155" />
            <rect x="62" y="46" width="20" height="16" fill="#334155" />
            <rect x="40" y="32" width="4" height="10" fill="#EF4444" />
            <rect x="45" y="32" width="4" height="10" fill="#3B82F6" />
          </g>
        }

        @case ('divisoria_vidro_acustica') {
          <g>
            <rect x="36" y="26" width="48" height="56" rx="2" fill="rgba(224, 242, 254, 0.4)" stroke="#0F172A" stroke-width="2.5" />
            <line x1="52" y1="26" x2="52" y2="82" stroke="#64748B" stroke-width="1.5" />
            <line x1="68" y1="26" x2="68" y2="82" stroke="#64748B" stroke-width="1.5" />
          </g>
        }

        @case ('estacao_triagem_enfermagem') {
          <g>
            <polygon points="26,62 60,42 94,62 60,82" fill="#F8FAFC" stroke="#0D9488" stroke-width="2" />
            <!-- Pia embutida e torneira -->
            <ellipse cx="44" cy="60" rx="6" ry="4" fill="#94A3B8" />
            <path d="M44,56 L44,48 L48,48" stroke="#475569" stroke-width="1.5" fill="none" />
            <!-- Impressora de pulseiras -->
            <rect x="70" y="52" width="10" height="8" rx="1" fill="#1E293B" />
          </g>
        }

        @case ('armario_vestiario_medico') {
          <g>
            <rect x="44" y="24" width="32" height="60" rx="3" fill="#64748B" stroke="#334155" stroke-width="2" />
            <rect x="48" y="28" width="10" height="52" fill="#E2E8F0" />
            <circle cx="56" cy="54" r="1.5" fill="#0F172A" />
          </g>
        }

        @case ('maca_gineco_eletrica') {
          <g>
            <polygon points="28,64 60,46 92,64 60,82" fill="#F43F5E" stroke="#BE123C" stroke-width="2" />
            <rect x="56" y="68" width="8" height="16" fill="#334155" />
            <!-- Perneiras de apoio -->
            <line x1="42" y1="62" x2="38" y2="52" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" />
            <line x1="78" y1="62" x2="82" y2="52" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" />
          </g>
        }

        @case ('mesa_reuniao_clinica') {
          <g>
            <ellipse cx="60" cy="62" rx="34" ry="18" fill="#78350F" stroke="#451A03" stroke-width="2.5" />
            <ellipse cx="60" cy="62" rx="30" ry="15" fill="#92400E" />
            <rect x="56" y="68" width="8" height="16" fill="#1E293B" />
          </g>
        }

        @case ('estacao_telemedicina') {
          <g>
            <polygon points="32,64 60,48 88,64 60,80" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
            <!-- Tela ultrawide com ring light -->
            <rect x="44" y="32" width="32" height="18" rx="2" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5" />
            <circle cx="60" cy="24" r="5" fill="none" stroke="#FDE047" stroke-width="2" />
          </g>
        }

        @case ('bancada_laboratorial_ilha') {
          <g>
            <polygon points="16,64 60,38 104,64 60,90" fill="#F8FAFC" stroke="#64748B" stroke-width="2.5" />
            <!-- Centrífuga de bancada -->
            <circle cx="45" cy="62" r="7" fill="#CBD5E1" stroke="#475569" stroke-width="1.5" />
            <circle cx="45" cy="62" r="2.5" fill="#0F172A" />
            <!-- Suporte de tubos de ensaio coloridos -->
            <rect x="72" y="54" width="16" height="8" rx="1" fill="#E2E8F0" />
            <circle cx="76" cy="58" r="1.5" fill="#EF4444" />
            <circle cx="80" cy="58" r="1.5" fill="#3B82F6" />
            <circle cx="84" cy="58" r="1.5" fill="#10B981" />
          </g>
        }

        @case ('conjunto_diretoria_nogal') {
          <g>
            <polygon points="14,64 60,36 106,64 60,92" fill="#451A03" stroke="#290E00" stroke-width="2.5" />
            <polygon points="28,62 60,44 92,62 60,80" fill="#78350F" />
            <!-- Luminária de banqueiro bronze -->
            <rect x="74" y="48" width="10" height="4" rx="2" fill="#10B981" stroke="#047857" stroke-width="1" />
          </g>
        }

        <!-- ------------------------------------------------------------- -->
        <!-- CLÍNICA & INSTRUMENTAIS (Novos Itens - P-092) -->
        <!-- ------------------------------------------------------------- -->
        @case ('esfigmo_pedestal') {
          <g>
            <line x1="60" y1="36" x2="60" y2="80" stroke="#64748B" stroke-width="3" />
            <!-- Manômetro grande redondo -->
            <circle cx="60" cy="36" r="11" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
            <line x1="60" y1="36" x2="66" y2="32" stroke="#EF4444" stroke-width="1.5" />
            <circle cx="60" cy="80" r="6" fill="#334155" />
          </g>
        }

        @case ('tabela_snellen_iluminada') {
          <g>
            <rect x="44" y="24" width="32" height="52" rx="2" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
            <text x="60" y="38" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#0F172A">E</text>
            <text x="60" y="48" font-size="7" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#0F172A">F P</text>
            <text x="60" y="56" font-size="5" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#0F172A">T O Z</text>
            <text x="60" y="63" font-size="3.5" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#0F172A">L P E D</text>
          </g>
        }

        @case ('conjunto_diagnostico_parede') {
          <g>
            <rect x="42" y="28" width="36" height="40" rx="3" fill="#F8FAFC" stroke="#64748B" stroke-width="2" />
            <rect x="48" y="32" width="8" height="24" rx="2" fill="#334155" />
            <rect x="64" y="32" width="8" height="24" rx="2" fill="#334155" />
            <path d="M52,56 Q52,66 56,66" stroke="#94A3B8" stroke-width="2" fill="none" />
            <path d="M68,56 Q68,66 64,66" stroke="#94A3B8" stroke-width="2" fill="none" />
          </g>
        }

        @case ('estojo_laringoscopio') {
          <g>
            <polygon points="36,66 60,52 84,66 60,80" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
            <!-- Lâminas curvas inox -->
            <path d="M48,64 Q56,58 64,64" stroke="#0F172A" stroke-width="2" fill="none" />
            <line x1="52" y1="70" x2="68" y2="70" stroke="#0D9488" stroke-width="2" />
          </g>
        }

        @case ('diploma_crm_moldura_ouro') {
          <g>
            <rect x="40" y="26" width="40" height="48" rx="2" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3" />
            <rect x="45" y="31" width="30" height="38" fill="#FFFBEB" stroke="#D97706" stroke-width="1" />
            <!-- Selo de cera vermelho -->
            <circle cx="60" cy="58" r="4" fill="#DC2626" />
          </g>
        }

        @case ('estadiometro_compacto') {
          <g>
            <rect x="56" y="20" width="8" height="66" fill="#E2E8F0" stroke="#64748B" stroke-width="1.5" />
            <!-- Cursor de cabeça móvel -->
            <polygon points="52,36 68,36 60,42" fill="#EF4444" />
          </g>
        }

        @case ('desfibrilador_dea_parede') {
          <g>
            <rect x="44" y="28" width="32" height="42" rx="4" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
            <rect x="48" y="32" width="24" height="24" fill="#FFFFFF" rx="2" />
            <!-- Coração e raio verde -->
            <path d="M60,48 L56,40 A3,3 0 0,1 60,37 A3,3 0 0,1 64,40 Z" fill="#16A34A" />
            <text x="60" y="65" font-size="6" font-weight="bold" fill="#FFFFFF" text-anchor="middle">DEA</text>
          </g>
        }

        @case ('bipap_ventilador') {
          <g>
            <rect x="44" y="46" width="32" height="26" rx="3" fill="#F8FAFC" stroke="#0D9488" stroke-width="2" />
            <rect x="48" y="50" width="16" height="10" rx="1" fill="#0F172A" />
            <circle cx="56" cy="55" r="2" fill="#38BDF8" />
            <!-- Tubo de ventilação corrugado -->
            <path d="M70,58 Q82,60 76,74" stroke="#60A5FA" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
        }

        @case ('aspirador_cirurgico_movel') {
          <g>
            <rect x="46" y="56" width="28" height="24" rx="2" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
            <!-- 2 Frascos coletores de vidro -->
            <rect x="48" y="40" width="10" height="16" rx="2" fill="rgba(224, 242, 254, 0.7)" stroke="#0284C7" stroke-width="1" />
            <rect x="62" y="40" width="10" height="16" rx="2" fill="rgba(224, 242, 254, 0.7)" stroke="#0284C7" stroke-width="1" />
            <circle cx="48" cy="80" r="2.5" fill="#334155" />
            <circle cx="72" cy="80" r="2.5" fill="#334155" />
          </g>
        }

        @case ('carrinho_parada_cardiorresp') {
          <g>
            <rect x="40" y="44" width="40" height="36" rx="3" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
            <!-- 4 gavetas vermelhas -->
            <line x1="40" y1="53" x2="80" y2="53" stroke="#991B1B" stroke-width="1.5" />
            <line x1="40" y1="62" x2="80" y2="62" stroke="#991B1B" stroke-width="1.5" />
            <line x1="40" y1="71" x2="80" y2="71" stroke="#991B1B" stroke-width="1.5" />
            <!-- Cilindro de O2 verde lateral -->
            <rect x="34" y="48" width="6" height="24" rx="3" fill="#16A34A" />
          </g>
        }

        @case ('microscopio_optico_binoc') {
          <g>
            <rect x="48" y="70" width="24" height="10" rx="2" fill="#1E293B" />
            <path d="M60,70 L60,46 L52,40" stroke="#475569" stroke-width="4" fill="none" />
            <!-- Oculares binoculares -->
            <line x1="48" y1="36" x2="44" y2="30" stroke="#0F172A" stroke-width="3" />
            <line x1="54" y1="36" x2="50" y2="30" stroke="#0F172A" stroke-width="3" />
            <ellipse cx="60" cy="56" rx="8" ry="3" fill="#0F172A" />
          </g>
        }

        @case ('eletrocardiografo_digital') {
          <g>
            <rect x="42" y="52" width="36" height="24" rx="3" fill="#F8FAFC" stroke="#64748B" stroke-width="2" />
            <rect x="46" y="56" width="16" height="12" rx="1" fill="#0F172A" />
            <!-- Papel térmico saindo -->
            <path d="M66,58 L78,58 L74,68 L66,68 Z" fill="#FEF08A" stroke="#CA8A04" stroke-width="1" />
          </g>
        }

        @case ('autoclave_esterilizacao') {
          <g>
            <rect x="42" y="42" width="36" height="38" rx="4" fill="#CBD5E1" stroke="#475569" stroke-width="2" />
            <circle cx="60" cy="60" r="12" fill="#E2E8F0" stroke="#334155" stroke-width="2" />
            <circle cx="60" cy="60" r="4" fill="#0F172A" />
            <circle cx="70" cy="48" r="3" fill="#EF4444" />
          </g>
        }

        @case ('torre_videolaparoscopia') {
          <g>
            <rect x="44" y="24" width="32" height="58" rx="3" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
            <!-- Monitor cirúrgico superior -->
            <rect x="40" y="16" width="40" height="20" rx="2" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5" />
            <!-- Prateleira de equipamentos -->
            <line x1="44" y1="46" x2="76" y2="46" stroke="#475569" stroke-width="1.5" />
            <circle cx="50" cy="54" r="2" fill="#10B981" />
            <circle cx="56" cy="54" r="2" fill="#F59E0B" />
          </g>
        }

        @case ('bomba_infusao_seringa') {
          <g>
            <line x1="60" y1="26" x2="60" y2="80" stroke="#94A3B8" stroke-width="3" />
            <!-- 3 bombas empilhadas -->
            <rect x="48" y="32" width="24" height="10" rx="2" fill="#0D9488" stroke="#0F766E" stroke-width="1" />
            <rect x="48" y="44" width="24" height="10" rx="2" fill="#0D9488" stroke="#0F766E" stroke-width="1" />
            <rect x="48" y="56" width="24" height="10" rx="2" fill="#0D9488" stroke="#0F766E" stroke-width="1" />
            <circle cx="60" cy="80" r="5" fill="#334155" />
          </g>
        }

        @case ('tomografo_extremidades') {
          <g>
            <polygon points="26,64 60,44 94,64 60,84" fill="#FFFFFF" stroke="#0284C7" stroke-width="2" />
            <!-- Gantry circular vertical -->
            <circle cx="60" cy="50" r="18" fill="#F1F5F9" stroke="#0284C7" stroke-width="4" />
            <circle cx="60" cy="50" r="9" fill="#0F172A" />
          </g>
        }

        @case ('ressonancia_simulador') {
          <g>
            <!-- Diâmetro circular com iluminação -->
            <ellipse cx="60" cy="52" rx="28" ry="24" fill="#F8FAFC" stroke="#64748B" stroke-width="3" />
            <ellipse cx="60" cy="52" rx="16" ry="14" fill="#0F172A" />
            <!-- Maca deslizante entrando -->
            <polygon points="40,68 60,56 80,68 60,80" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5" />
          </g>
        }

        @case ('arco_cirurgico_fluorosc') {
          <g>
            <rect x="46" y="66" width="28" height="14" rx="2" fill="#334155" />
            <!-- Braço em C curvo -->
            <path d="M42,70 Q28,42 60,32 Q92,42 78,70" stroke="#94A3B8" stroke-width="5" fill="none" stroke-linecap="round" />
            <!-- Emissor e intensificador de imagem -->
            <circle cx="42" cy="70" r="5" fill="#0F172A" />
            <circle cx="78" cy="70" r="6" fill="#38BDF8" />
          </g>
        }

        @case ('robo_cirurgico_console') {
          <g>
            <polygon points="24,64 60,42 96,64 60,86" fill="#0F172A" stroke="#38BDF8" stroke-width="2" />
            <!-- Visor 3D estéreo -->
            <rect x="46" y="32" width="28" height="16" rx="4" fill="#1E293B" stroke="#0284C7" stroke-width="2" />
            <circle cx="53" cy="40" r="3" fill="#38BDF8" />
            <circle cx="67" cy="40" r="3" fill="#38BDF8" />
            <!-- Braços de manipulação -->
            <path d="M48,54 L44,64 M72,54 L76,64" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" />
          </g>
        }

        @case ('tanque_criogenico_celulas') {
          <g>
            <!-- Cilindro criogênico de nitrogênio -->
            <rect x="46" y="36" width="28" height="42" rx="12" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
            <ellipse cx="60" cy="36" rx="14" ry="6" fill="#CBD5E1" stroke="#475569" stroke-width="1.5" />
            <circle cx="60" cy="30" r="3" fill="#0284C7" />
          </g>
        }

        <!-- ------------------------------------------------------------- -->
        <!-- RECEPÇÃO & CONFORTO (Novos Itens - P-092) -->
        <!-- ------------------------------------------------------------- -->
        @case ('longarina_espera_confort') {
          <g>
            <!-- 3 assentos em viga -->
            <line x1="30" y1="72" x2="90" y2="72" stroke="#64748B" stroke-width="3" />
            <rect x="32" y="56" width="16" height="16" rx="2" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5" />
            <rect x="52" y="56" width="16" height="16" rx="2" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5" />
            <rect x="72" y="56" width="16" height="16" rx="2" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5" />
          </g>
        }

        @case ('revisteiro_acrilico') {
          <g>
            <polygon points="46,54 74,54 68,76 40,76" fill="rgba(224, 242, 254, 0.7)" stroke="#38BDF8" stroke-width="2" />
            <rect x="46" y="44" width="12" height="16" fill="#F43F5E" />
            <rect x="56" y="40" width="12" height="16" fill="#10B981" />
          </g>
        }

        @case ('planta_costela_adao') {
          <g>
            <!-- Vaso terracota -->
            <polygon points="50,78 70,78 74,62 46,62" fill="#EA580C" stroke="#C2410C" stroke-width="2" />
            <!-- Folhas de Monstera -->
            <path d="M60,62 Q45,45 42,32 Q58,35 60,62" fill="#16A34A" stroke="#15803D" stroke-width="1.5" />
            <path d="M60,62 Q75,45 78,32 Q62,35 60,62" fill="#15803D" stroke="#166534" stroke-width="1.5" />
            <path d="M60,62 Q60,35 60,24" stroke="#166534" stroke-width="2" />
          </g>
        }

        @case ('dispenser_alcool_totem') {
          <g>
            <rect x="56" y="34" width="8" height="46" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5" />
            <circle cx="60" cy="80" r="6" fill="#334155" />
            <!-- Bico dispenser -->
            <rect x="54" y="32" width="12" height="6" rx="2" fill="#0D9488" />
            <line x1="60" y1="38" x2="60" y2="44" stroke="#38BDF8" stroke-width="1.5" />
          </g>
        }

        @case ('relogio_parede_minimal') {
          <g>
            <circle cx="60" cy="46" r="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
            <!-- Ponteiros -->
            <line x1="60" y1="46" x2="60" y2="36" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />
            <line x1="60" y1="46" x2="68" y2="46" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="60" cy="46" r="2" fill="#EF4444" />
          </g>
        }

        @case ('quadro_juramento_hipocr') {
          <g>
            <rect x="44" y="26" width="32" height="46" rx="2" fill="#FEF3C7" stroke="#92400E" stroke-width="2" />
            <line x1="48" y1="34" x2="72" y2="34" stroke="#B45309" stroke-width="1" />
            <line x1="48" y1="40" x2="72" y2="40" stroke="#B45309" stroke-width="1" />
            <line x1="48" y1="46" x2="72" y2="46" stroke="#B45309" stroke-width="1" />
            <line x1="48" y1="52" x2="68" y2="52" stroke="#B45309" stroke-width="1" />
          </g>
        }

        @case ('tv_sala_espera_painel') {
          <g>
            <rect x="36" y="24" width="48" height="30" rx="3" fill="#0F172A" stroke="#334155" stroke-width="2" />
            <rect x="39" y="27" width="42" height="24" rx="1" fill="#1E293B" />
            <text x="60" y="42" font-size="6" font-family="monospace" font-weight="bold" fill="#38BDF8" text-anchor="middle">SENHA A-104</text>
          </g>
        }

        @case ('poltrona_boucle_offwhite') {
          <g>
            <!-- Poltrona arredondada boucle -->
            <ellipse cx="60" cy="62" rx="18" ry="14" fill="#FAF5FF" stroke="#D8B4FE" stroke-width="2" />
            <path d="M44,60 Q60,40 76,60" fill="none" stroke="#C084FC" stroke-width="3" />
            <rect x="48" y="72" width="4" height="10" rx="1" fill="#78350F" />
            <rect x="68" y="72" width="4" height="10" rx="1" fill="#78350F" />
          </g>
        }

        @case ('luminaria_arco_latonada') {
          <g>
            <path d="M72,80 Q72,24 50,30" stroke="#D97706" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <!-- Cúpula dourada -->
            <ellipse cx="48" cy="34" rx="7" ry="4" fill="#FBBF24" stroke="#B45309" stroke-width="1.5" />
            <circle cx="72" cy="80" r="5" fill="#78350F" />
          </g>
        }

        @case ('aparador_cha_biscoitos') {
          <g>
            <polygon points="28,64 60,46 92,64 60,82" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
            <!-- Garrafa térmica de chá -->
            <rect x="46" y="48" width="6" height="14" rx="2" fill="#EF4444" />
            <!-- Pote de vidro com biscoitos -->
            <ellipse cx="72" cy="56" rx="5" ry="7" fill="rgba(254, 243, 199, 0.8)" stroke="#F59E0B" stroke-width="1" />
          </g>
        }

        @case ('mascote_calopsita_poleiro') {
          <g>
            <line x1="60" y1="44" x2="60" y2="80" stroke="#78350F" stroke-width="3" />
            <line x1="50" y1="48" x2="70" y2="48" stroke="#78350F" stroke-width="3" stroke-linecap="round" />
            <!-- Calopsita com crista amarela -->
            <ellipse cx="60" cy="42" rx="7" ry="10" fill="#E2E8F0" />
            <circle cx="60" cy="34" r="5" fill="#FDE047" />
            <circle cx="62" cy="34" r="2" fill="#F97316" />
            <!-- Crista amarela -->
            <path class="ambient-wag" d="M60,29 Q58,20 62,24" stroke="#EAB308" stroke-width="2" fill="none" />
          </g>
        }

        @case ('aquario_marinho_coral') {
          <g>
            <polygon points="28,66 60,48 92,66 60,84" fill="#0F172A" stroke="#334155" stroke-width="2" />
            <!-- Vidro e água iluminada -->
            <rect x="34" y="36" width="52" height="30" rx="3" fill="rgba(14, 165, 233, 0.5)" stroke="#0284C7" stroke-width="2" />
            <!-- Peixinho laranja nadando -->
            <circle class="ambient-bob" cx="54" cy="50" r="3" fill="#F97316" />
            <circle class="ambient-bob" cx="68" cy="54" r="2.5" fill="#FDE047" />
          </g>
        }

        @case ('jardim_inverno_bambu') {
          <g>
            <polygon points="30,66 60,48 90,66 60,84" fill="#334155" stroke="#1E293B" stroke-width="2" />
            <!-- Pedras brancas -->
            <circle cx="50" cy="64" r="4" fill="#F8FAFC" />
            <circle cx="60" cy="62" r="5" fill="#F8FAFC" />
            <circle cx="70" cy="65" r="4" fill="#F8FAFC" />
            <!-- Bambus verdes -->
            <line x1="48" y1="64" x2="48" y2="28" stroke="#16A34A" stroke-width="3" />
            <line x1="60" y1="62" x2="60" y2="24" stroke="#22C55E" stroke-width="3" />
            <line x1="72" y1="65" x2="72" y2="30" stroke="#15803D" stroke-width="3" />
          </g>
        }

        @case ('fonte_agua_pedra_zen') {
          <g>
            <ellipse cx="60" cy="74" rx="20" ry="10" fill="#475569" stroke="#334155" stroke-width="2" />
            <!-- Pedras sobrepostas -->
            <ellipse cx="60" cy="62" rx="14" ry="7" fill="#64748B" />
            <ellipse cx="60" cy="52" rx="8" ry="4" fill="#94A3B8" />
            <circle class="ambient-bob" cx="60" cy="46" r="3" fill="#38BDF8" />
          </g>
        }

        @case ('cafeteira_moedor_graos') {
          <g>
            <rect x="44" y="44" width="32" height="34" rx="3" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
            <rect x="52" y="30" width="16" height="14" rx="2" fill="#78350F" stroke="#B45309" stroke-width="1.5" />
            <!-- Manípulo portafiltro -->
            <line x1="60" y1="58" x2="72" y2="58" stroke="#CBD5E1" stroke-width="2.5" />
          </g>
        }

        @case ('frigobar_retro_turquesa') {
          <g>
            <rect x="42" y="40" width="36" height="42" rx="6" fill="#06B6D4" stroke="#0891B2" stroke-width="2" />
            <rect x="45" y="44" width="30" height="34" rx="4" fill="#22D3EE" />
            <!-- Puxador cromado curvo -->
            <path d="M48,56 Q44,62 48,68" stroke="#F8FAFC" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
        }

        @case ('sofa_chesterfield_couro') {
          <g>
            <polygon points="18,66 60,40 102,66 60,92" fill="#78350F" stroke="#451A03" stroke-width="2.5" />
            <!-- Encosto capitonê marrom conhaque -->
            <polygon points="24,62 60,42 96,62 60,82" fill="#92400E" />
            <circle cx="50" cy="56" r="2" fill="#451A03" />
            <circle cx="60" cy="52" r="2" fill="#451A03" />
            <circle cx="70" cy="56" r="2" fill="#451A03" />
          </g>
        }

        @case ('lareira_ecologica_etanol') {
          <g>
            <rect x="36" y="52" width="48" height="24" rx="3" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
            <rect x="40" y="56" width="40" height="12" fill="#0F172A" />
            <!-- Chamas dançantes -->
            <path class="ambient-bob" d="M52,64 Q54,54 58,62 Q62,50 66,62" stroke="#F97316" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
        }

        @case ('poltrona_massagem_zero_g') {
          <g>
            <ellipse cx="60" cy="62" rx="20" ry="16" fill="#334155" stroke="#1E293B" stroke-width="2" />
            <rect x="46" y="40" width="28" height="26" rx="5" fill="#475569" />
            <circle cx="60" cy="34" r="5" fill="#64748B" />
          </g>
        }

        @case ('piano_cauda_lounge') {
          <g>
            <polygon points="20,62 60,36 100,62 60,88" fill="#0F172A" stroke="#020617" stroke-width="2.5" />
            <!-- Tampa aberta do piano -->
            <polygon points="24,56 60,34 94,56 60,78" fill="#1E293B" />
            <!-- Teclado com teclas pretas e brancas -->
            <rect x="46" y="68" width="28" height="8" rx="1" fill="#FFFFFF" stroke="#0F172A" stroke-width="1" />
            <line x1="52" y1="68" x2="52" y2="73" stroke="#0F172A" stroke-width="1.5" />
            <line x1="58" y1="68" x2="58" y2="73" stroke="#0F172A" stroke-width="1.5" />
            <line x1="64" y1="68" x2="64" y2="73" stroke="#0F172A" stroke-width="1.5" />
          </g>
        }

        @case ('mascote_coruja_atena') {
          <g>
            <line x1="60" y1="52" x2="60" y2="80" stroke="#78350F" stroke-width="3" />
            <ellipse cx="60" cy="50" rx="11" ry="14" fill="#78350F" stroke="#451A03" stroke-width="2" />
            <ellipse cx="60" cy="52" rx="7" ry="10" fill="#FEF3C7" />
            <!-- Olhos grandes da coruja -->
            <circle cx="55" cy="44" r="4.5" fill="#F59E0B" stroke="#0F172A" stroke-width="1.5" />
            <circle cx="65" cy="44" r="4.5" fill="#F59E0B" stroke="#0F172A" stroke-width="1.5" />
            <circle cx="55" cy="44" r="2" fill="#0F172A" />
            <circle cx="65" cy="44" r="2" fill="#0F172A" />
            <!-- Biquinho -->
            <polygon points="58,48 62,48 60,52" fill="#F97316" />
          </g>
        }

        @case ('bebedouro_galao') {
          <g>
            <!-- Coluna branca -->
            <rect x="46" y="50" width="28" height="34" rx="4" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2" />
            <!-- Galão azul translúcido -->
            <rect x="48" y="22" width="24" height="28" rx="8" fill="#38BDF8" stroke="#0284C7" stroke-width="2" />
            <!-- Bolhas subindo -->
            <circle class="ambient-bob" cx="56" cy="38" r="2.5" fill="#E0F2FE" />
            <circle class="ambient-bob" cx="64" cy="30" r="2" fill="#E0F2FE" />
            <!-- Torneirinhas azul e vermelha -->
            <circle cx="55" cy="60" r="2.5" fill="#3B82F6" />
            <circle cx="65" cy="60" r="2.5" fill="#EF4444" />
          </g>
        }

        <!-- ================================================================= -->
        <!-- CAIXAS DA SORTE MÉDICAS (LOOTBOXES 3 TIERS - P-094)               -->
        <!-- ================================================================= -->
        <!-- Tier 1: Caixa do Residente (Kit de Primeiros Socorros em lona náutica) -->
        @case ('lootbox_tier1_resident') {
          <g class="ambient-bob">
            <!-- Sombra da maleta -->
            <ellipse cx="60" cy="85" rx="30" ry="10" fill="rgba(148, 163, 184, 0.25)" />
            <!-- Corpo da maleta isométrico -->
            <polygon points="30,62 60,45 90,62 60,79" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2" />
            <polygon points="30,62 60,79 60,86 30,69" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" />
            <polygon points="90,62 60,79 60,86 90,69" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5" />
            <!-- Cantoneiras emborrachadas -->
            <polygon points="29,62 38,57 38,65 29,70" fill="#334155" />
            <polygon points="91,62 82,57 82,65 91,70" fill="#334155" />
            <!-- Fecho central e fivelas -->
            <rect x="56" y="66" width="8" height="6" rx="1.5" fill="#64748B" />
            <rect x="58" y="67" width="4" height="4" rx="1" fill="#F1F5F9" />
            <!-- Alça superior -->
            <path d="M48,51 C48,40 72,40 72,51" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round" />
            <!-- Cruz médica suave -->
            <polygon points="58,58 62,58 62,54 64,54 64,58 68,58 68,60 64,60 64,64 62,64 62,60 58,60" fill="#10B981" />
          </g>
        }

        <!-- Tier 2: Caixa do Especialista (Maleta Gladstone Clássica em Couro Marinho & Latão) -->
        @case ('lootbox_tier2_specialist') {
          <g class="ambient-bob">
            <!-- Sombra da maleta -->
            <ellipse cx="60" cy="85" rx="32" ry="11" fill="rgba(2, 132, 199, 0.25)" />
            <!-- Corpo de couro azul cirúrgico nobre -->
            <polygon points="28,60 60,43 92,60 60,77" fill="#0284C7" stroke="#0369A1" stroke-width="2" />
            <polygon points="28,60 60,77 60,86 28,69" fill="#0369A1" stroke="#0284C7" stroke-width="1.5" />
            <polygon points="92,60 60,77 60,86 92,69" fill="#075985" stroke="#0284C7" stroke-width="1.5" />
            <!-- Frisos de latão dourado fosco -->
            <line x1="38" y1="55" x2="38" y2="73" stroke="#F59E0B" stroke-width="2" />
            <line x1="82" y1="55" x2="82" y2="73" stroke="#F59E0B" stroke-width="2" />
            <!-- Fechadura dupla articulada dourada -->
            <rect x="55" y="64" width="10" height="7" rx="2" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
            <circle cx="60" cy="67.5" r="1.5" fill="#78350F" />
            <!-- Alça tubular costurada à mão -->
            <path d="M46,48 C46,36 74,36 74,48" stroke="#D97706" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <path d="M48,48 C48,38 72,38 72,48" stroke="#FBBF24" stroke-width="1.5" fill="none" stroke-linecap="round" />
            <!-- Brilho Safira sutil -->
            <polygon points="56,50 60,46 64,50 60,54" fill="#38BDF8" opacity="0.9" />
          </g>
        }

        <!-- Tier 3: Caixa do Chefe de Ala (Case Executivo Titânio, Ouro 24k & Fibra Óptica) -->
        @case ('lootbox_tier3_chief') {
          <g class="ambient-bob">
            <!-- Halo luminoso de alta tecnologia -->
            <ellipse cx="60" cy="85" rx="34" ry="12" fill="rgba(245, 158, 11, 0.35)" />
            <!-- Corpo de titânio escuro escovado -->
            <polygon points="26,58 60,40 94,58 60,76" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
            <polygon points="26,58 60,76 60,86 26,68" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5" />
            <polygon points="94,58 60,76 60,86 94,68" fill="#020617" stroke="#F59E0B" stroke-width="1.5" />
            <!-- Cantoneiras de titânio chanfradas -->
            <polygon points="25,58 36,52 36,63 25,69" fill="#F59E0B" />
            <polygon points="95,58 84,52 84,63 95,69" fill="#F59E0B" />
            <!-- Fenda de fibra óptica ciano neon -->
            <line x1="36" y1="67" x2="84" y2="67" stroke="#06B6D4" stroke-width="2" opacity="0.95" />
            <!-- Brasão Caduceu / Estrela Imperial Ouro 24k -->
            <polygon points="60,48 64,54 70,54 65,58 67,64 60,60 53,64 55,58 50,54 56,54" fill="#FBBF24" stroke="#F59E0B" stroke-width="1" />
            <!-- Trava biométrica com display OLED -->
            <rect x="55" y="70" width="10" height="7" rx="1.5" fill="#06B6D4" stroke="#F59E0B" stroke-width="1" />
            <!-- Alça de liga aeroespacial -->
            <path d="M44,46 C44,32 76,32 76,46" stroke="#F59E0B" stroke-width="3.5" fill="none" stroke-linecap="round" />
          </g>
        }

        <!-- Arquétipo Universal Clínico de Fallback -->
        @default {
          <g>
            <polygon points="30,64 60,46 90,64 60,82" fill="#F8FAFC" stroke="#0D9488" stroke-width="2" />
            <rect x="36" y="66" width="4" height="14" fill="#94A3B8" />
            <rect x="80" y="66" width="4" height="14" fill="#94A3B8" />
            <!-- Cruz médica suave -->
            <polygon points="58,56 62,56 62,52 64,52 64,56 68,56 68,58 64,58 64,62 62,62 62,58 58,58" fill="#0D9488" />
          </g>
        }
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      .clinic-item-svg {
        overflow: visible;
        transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: visiblePainted;
      }

      .clinic-item-svg.is-rotated:not(.has-custom-rotation) {
        transform: scaleX(-1);
      }

      .clinic-item-svg.is-pulsing {
        animation: itemBounce 360ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .dino-eye {
        transform-origin: 98px 23px;
        animation: dinoBlinkLoop 4.2s infinite;
      }

      .ambient-steam {
        animation: steamRise 2.6s ease-in-out infinite;
      }

      .ambient-bob {
        animation: gentleBob 2.4s ease-in-out infinite;
      }

      .ambient-wag {
        transform-origin: 74px 64px;
        animation: tailWag 0.9s ease-in-out infinite alternate;
      }

      .ambient-wave {
        transform-origin: 70px 42px;
        animation: armWave 1.6s ease-in-out infinite alternate;
      }

      .ambient-sparkle {
        animation: sparklePulse 1.8s ease-in-out infinite alternate;
      }

      .ecg-trace-line {
        stroke-dasharray: 90;
        stroke-dashoffset: 0;
        animation: ecgSweep 2.2s linear infinite;
      }

      .clinic-item-svg.is-paused * {
        animation-play-state: paused !important;
      }

      @keyframes dinoBlinkLoop {
        0%,
        92%,
        100% {
          transform: scaleY(1);
        }
        95% {
          transform: scaleY(0.1);
        }
      }

      @keyframes steamRise {
        0%,
        100% {
          opacity: 0.35;
          transform: translateY(0);
        }
        50% {
          opacity: 0.9;
          transform: translateY(-4px);
        }
      }

      @keyframes gentleBob {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-3px);
        }
      }

      @keyframes tailWag {
        from {
          transform: rotate(-10deg);
        }
        to {
          transform: rotate(14deg);
        }
      }

      @keyframes armWave {
        from {
          transform: rotate(-8deg);
        }
        to {
          transform: rotate(12deg);
        }
      }

      @keyframes sparklePulse {
        from {
          opacity: 0.45;
          transform: translateY(1px);
        }
        to {
          opacity: 1;
          transform: translateY(-3px);
        }
      }

      @keyframes ecgSweep {
        0% {
          stroke-dashoffset: 90;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      :host {
        display: block;
        pointer-events: none;
      }
      .clinic-item-svg {
        display: block;
        pointer-events: none;
      }
      .shadow-polygon {
        pointer-events: none !important;
      }

      @keyframes itemBounce {
        0% {
          transform: scale(1);
        }
        45% {
          transform: translateY(-6px) scale(1.08);
        }
        100% {
          transform: scale(1);
        }
      }
    `
  ]
})
export class ClinicItemSvgComponent {
  @Input() itemKey = 'ped_maca_dino';
  @Input() rotation = 0;
  @Input() width = 84;
  @Input() height = 78;
  @Input() isWallItem = false;
  @Input() activePulse = false;
  @Input() paused = false;

  get hasCustomRotation(): boolean {
    return (
      this.itemKey === 'cadeira_ergonomica' ||
      this.itemKey === 'cadeira_presidente_couro' ||
      this.isTwoTile
    );
  }

  get isTwoTile(): boolean {
    return (
      this.itemKey === 'ped_maca_baleia' ||
      this.itemKey === 'ped_maca_dino' ||
      this.itemKey === 'ped_maca_f1' ||
      this.itemKey === 'mesa_scandi' ||
      this.itemKey === 'mesa_mogno_cafe' ||
      this.itemKey === 'mesa_carrara' ||
      this.itemKey === 'balcao_recepcao_madeira' ||
      this.itemKey === 'sofa_chesterfield_couro' ||
      this.itemKey === 'longarina_espera_confort' ||
      this.width > 90
    );
  }
}
