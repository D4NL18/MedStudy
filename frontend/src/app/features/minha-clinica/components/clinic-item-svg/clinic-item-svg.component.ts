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

        <!-- 14. cadeira_ergonomica: Cadeira Operacional Mesh (4 Rotações Alinhadas às 4 Arestas Isométricas) -->
        @case ('cadeira_ergonomica') {
          @switch (rotation % 4) {
            @case (1) {
              <!-- ARESTA 1: SW (Frente-Esquerda / +Y) - Encosto a Nordeste, Assento virado para Sudoeste -->
              <g class="chair-aresta-sw">
                <ellipse cx="64" cy="86" rx="18" ry="6" fill="#0F172A" opacity="0.22" />
                <!-- Base aranha 5 pontas -->
                <line x1="64" y1="82" x2="48" y2="85" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="82" x2="80" y2="86" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="82" x2="64" y2="90" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <line x1="64" y1="82" x2="54" y2="77" stroke="#475569" stroke-width="2.5" stroke-linecap="round" />
                <line x1="64" y1="82" x2="74" y2="77" stroke="#475569" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="48" cy="85" r="2" fill="#0F172A" />
                <circle cx="80" cy="86" r="2" fill="#0F172A" />
                <circle cx="64" cy="90" r="2" fill="#0F172A" />
                <line x1="64" y1="67" x2="64" y2="82" stroke="#475569" stroke-width="4.5" />
                <polygon points="52,64 74,64 72,70 54,70" fill="#1E293B" />

                <!-- Braço distante (NW) -->
                <line x1="65" y1="48" x2="65" y2="40" stroke="#334155" stroke-width="3" />
                <line x1="71" y1="38" x2="54" y2="46" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />

                <!-- Encosto Mesh no quadrante NE (face voltada para SW / câmera) -->
                <polygon points="66,21 86,31 86,57 66,47" fill="#1E293B" stroke="#0F172A" stroke-width="1.8" />
                <polygon points="68,25 84,33 84,53 68,45" fill="#0D9488" stroke="#0F766E" stroke-width="1.5" />
                <!-- Apoio de cabeça no topo -->
                <ellipse cx="76" cy="18" rx="8" ry="4.5" fill="#1E293B" stroke="#0F172A" stroke-width="1" />
                <ellipse cx="76" cy="18" rx="6" ry="3" fill="#0D9488" />

                <!-- Assento estendido na direção +Y (Aresta SW - Perpendicular à mesa da esquerda) -->
                <polygon points="48,56 66,65 66,70 48,61" fill="#0F766E" />
                <polygon points="84,56 66,65 66,70 84,61" fill="#115E59" />
                <polygon points="66,47 84,56 66,65 48,56" fill="#0D9488" stroke="#0F766E" stroke-width="1.8" />
                <line x1="75" y1="58" x2="55" y2="53" stroke="#14B8A6" stroke-width="1.2" stroke-linecap="round" />

                <!-- Braço dianteiro (SE) -->
                <path d="M72,62 L72,52 L54,61" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="74" y1="50" x2="52" y2="61" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />
              </g>
            }
            @case (2) {
              <!-- ARESTA 2: NW (Fundo-Esquerda / -X) - Encosto a Sudeste visto por trás, Assento virado para Noroeste -->
              <g class="chair-aresta-nw">
                <ellipse cx="60" cy="86" rx="18" ry="6" fill="#0F172A" opacity="0.22" />
                <line x1="60" y1="82" x2="44" y2="85" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="76" y2="85" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="60" y2="90" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <circle cx="44" cy="85" r="2" fill="#0F172A" />
                <circle cx="76" cy="85" r="2" fill="#0F172A" />
                <circle cx="60" cy="90" r="2" fill="#0F172A" />
                <line x1="60" y1="67" x2="60" y2="82" stroke="#475569" stroke-width="4.5" />

                <!-- Assento estendido para o fundo-esquerda (-X / sob a mesa) -->
                <polygon points="36,56 54,47 72,56 54,65" fill="#0D9488" stroke="#0F766E" stroke-width="1.8" />
                <polygon points="36,56 36,61 54,70 54,65" fill="#0F766E" />

                <!-- Braço distante (NW) -->
                <line x1="48" y1="46" x2="34" y2="53" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />

                <!-- Encosto Visto Por Trás (em primeiro plano no quadrante SE) -->
                <line x1="60" y1="67" x2="60" y2="36" stroke="#0F172A" stroke-width="6" stroke-linecap="round" />
                <path d="M50,47 Q60,42 70,47" stroke="#1E293B" stroke-width="4" fill="none" stroke-linecap="round" />
                <polygon points="48,30 70,19 70,52 48,63" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
                <!-- Apoio de cabeça visto por trás -->
                <ellipse cx="59" cy="17" rx="8" ry="4" fill="#0F172A" stroke="#334155" stroke-width="1.5" />

                <!-- Braço dianteiro (SE) -->
                <line x1="66" y1="58" x2="52" y2="65" stroke="#1E293B" stroke-width="5" stroke-linecap="round" />
              </g>
            }
            @case (3) {
              <!-- ARESTA 3: NE (Fundo-Direita / -Y) - Encosto a Sudoeste visto por trás, Assento virado para Nordeste -->
              <g class="chair-aresta-ne">
                <ellipse cx="60" cy="86" rx="18" ry="6" fill="#0F172A" opacity="0.22" />
                <line x1="60" y1="82" x2="44" y2="85" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="76" y2="85" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="60" y2="90" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <circle cx="44" cy="85" r="2" fill="#0F172A" />
                <circle cx="76" cy="85" r="2" fill="#0F172A" />
                <circle cx="60" cy="90" r="2" fill="#0F172A" />
                <line x1="60" y1="67" x2="60" y2="82" stroke="#475569" stroke-width="4.5" />

                <!-- Assento estendido para o fundo-direita (-Y / sob a mesa) -->
                <polygon points="48,56 66,47 84,56 66,65" fill="#0D9488" stroke="#0F766E" stroke-width="1.8" />
                <polygon points="84,56 84,61 66,70 66,65" fill="#115E59" />

                <!-- Braço distante (NE) -->
                <line x1="72" y1="46" x2="86" y2="53" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />

                <!-- Encosto Visto Por Trás (em primeiro plano no quadrante SW) -->
                <line x1="60" y1="67" x2="60" y2="36" stroke="#0F172A" stroke-width="6" stroke-linecap="round" />
                <path d="M50,47 Q60,42 70,47" stroke="#1E293B" stroke-width="4" fill="none" stroke-linecap="round" />
                <polygon points="50,19 72,30 72,63 50,52" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
                <!-- Apoio de cabeça visto por trás -->
                <ellipse cx="61" cy="17" rx="8" ry="4" fill="#0F172A" stroke="#334155" stroke-width="1.5" />

                <!-- Braço dianteiro (SW) -->
                <line x1="54" y1="58" x2="68" y2="65" stroke="#1E293B" stroke-width="5" stroke-linecap="round" />
              </g>
            }
            @default {
              <!-- ARESTA 0: SE (Frente-Direita / +X) - Encosto a Noroeste, Assento virado para Sudeste (DE FRENTE PRA MESA) -->
              <g class="chair-aresta-se">
                <ellipse cx="56" cy="86" rx="18" ry="6" fill="#0F172A" opacity="0.22" />
                <!-- Base aranha de 5 pontas no piso -->
                <line x1="56" y1="82" x2="40" y2="86" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="82" x2="72" y2="85" stroke="#334155" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="82" x2="56" y2="90" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
                <line x1="56" y1="82" x2="46" y2="77" stroke="#475569" stroke-width="2.5" stroke-linecap="round" />
                <line x1="56" y1="82" x2="66" y2="77" stroke="#475569" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="40" cy="86" r="2" fill="#0F172A" />
                <circle cx="72" cy="85" r="2" fill="#0F172A" />
                <circle cx="56" cy="90" r="2" fill="#0F172A" />
                <line x1="56" y1="67" x2="56" y2="82" stroke="#475569" stroke-width="4.5" />
                <polygon points="44,64 66,64 64,70 46,70" fill="#1E293B" />

                <!-- Braço distante/traseiro (NE) -->
                <line x1="55" y1="48" x2="55" y2="40" stroke="#334155" stroke-width="3" />
                <line x1="49" y1="38" x2="66" y2="46" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />

                <!-- Encosto Mesh no quadrante NW (face voltada para SE / câmera) -->
                <polygon points="34,21 54,31 54,57 34,47" fill="#1E293B" stroke="#0F172A" stroke-width="1.8" />
                <polygon points="36,25 52,33 52,53 36,45" fill="#0D9488" stroke="#0F766E" stroke-width="1.5" />
                <!-- Apoio de cabeça no topo -->
                <ellipse cx="44" cy="18" rx="8" ry="4.5" fill="#1E293B" stroke="#0F172A" stroke-width="1" />
                <ellipse cx="44" cy="18" rx="6" ry="3" fill="#0D9488" />

                <!-- Assento estendido na direção +X (Aresta SE - Perpendicular à mesa da direita!) -->
                <polygon points="36,56 54,65 54,70 36,61" fill="#0F766E" />
                <polygon points="72,56 54,65 54,70 72,61" fill="#115E59" />
                <polygon points="36,56 54,47 72,56 54,65" fill="#0D9488" stroke="#0F766E" stroke-width="1.8" />
                <line x1="45" y1="58" x2="65" y2="53" stroke="#14B8A6" stroke-width="1.2" stroke-linecap="round" />

                <!-- Braço dianteiro (SW) -->
                <path d="M48,62 L48,52 L66,61" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="46" y1="50" x2="68" y2="61" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" />
              </g>
            }
          }
        }
        <!-- 15. cadeira_presidente_couro: Cadeira Presidente Couro Caramelo Capitone (4 Rotacoes Alinhadas as 4 Arestas Isometricas) -->
        @case ('cadeira_presidente_couro') {
          @switch (rotation % 4) {
            @case (1) {
              <!-- ARESTA 1: SW (Frente-Esquerda / +Y) - Encosto a Nordeste, Assento virado para Sudoeste -->
              <g class="chair-aresta-sw">
                <ellipse cx="64" cy="86" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="64" y1="82" x2="48" y2="85" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="82" x2="80" y2="86" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="64" y1="82" x2="64" y2="90" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="64" y1="67" x2="64" y2="82" stroke="#78350F" stroke-width="5" />
                <polygon points="52,64 74,64 72,70 54,70" fill="#451A03" />

                <!-- Braco distante/traseiro (NW) -->
                <line x1="65" y1="46" x2="65" y2="39" stroke="#78350F" stroke-width="3.5" />
                <line x1="72" y1="38" x2="54" y2="46" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />

                <!-- Encosto Alto Couro no quadrante NE (face voltada para SW / camera) -->
                <polygon points="66,20 86,30 86,58 66,48" fill="#B45309" stroke="#78350F" stroke-width="2" />
                <polygon points="68,23 84,31 84,55 68,47" fill="#D97706" />
                <ellipse cx="76" cy="18" rx="8" ry="5" fill="#92400E" stroke="#78350F" stroke-width="1.5" />
                <!-- Botoes Capitone -->
                <circle cx="73" cy="30" r="1.8" fill="#FEF3C7" />
                <circle cx="79" cy="37" r="1.8" fill="#FEF3C7" />
                <circle cx="73" cy="42" r="1.8" fill="#FEF3C7" />
                <circle cx="79" cy="49" r="1.8" fill="#FEF3C7" />

                <!-- Assento estendido na direcao +Y (Aresta SW - Perpendicular a mesa da esquerda) -->
                <polygon points="48,56 66,65 66,71 48,62" fill="#B45309" />
                <polygon points="84,56 66,65 66,71 84,62" fill="#92400E" />
                <polygon points="66,47 84,56 66,65 48,56" fill="#D97706" stroke="#92400E" stroke-width="2" />

                <!-- Braco dianteiro estofado (SE) -->
                <path d="M72,62 L72,51 L54,60" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="74" y1="49" x2="52" y2="60" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
              </g>
            }
            @case (2) {
              <!-- ARESTA 2: NW (Fundo-Esquerda / -X) - Encosto a Sudeste visto por tras, Assento virado para Noroeste -->
              <g class="chair-aresta-nw">
                <ellipse cx="60" cy="86" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="60" y1="82" x2="44" y2="85" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="76" y2="85" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="60" y2="90" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="60" y1="67" x2="60" y2="82" stroke="#78350F" stroke-width="5" />

                <!-- Assento sob a mesa ao fundo-esquerda -->
                <polygon points="36,56 54,47 72,56 54,65" fill="#D97706" stroke="#92400E" stroke-width="2" />
                <polygon points="36,56 36,62 54,71 54,65" fill="#B45309" />

                <!-- Braco distante (NW) -->
                <line x1="48" y1="45" x2="34" y2="52" stroke="#D97706" stroke-width="5" stroke-linecap="round" />

                <!-- Encosto Alto Couro Visto Por Tras (em primeiro plano no quadrante SE) -->
                <polygon points="48,28 70,17 70,52 48,63" fill="#78350F" stroke="#451A03" stroke-width="2" />
                <polygon points="50,31 68,22 68,49 50,58" fill="#92400E" />
                <ellipse cx="59" cy="16" rx="8" ry="4.5" fill="#451A03" stroke="#78350F" stroke-width="1.5" />

                <!-- Braco dianteiro (SE) -->
                <line x1="66" y1="57" x2="52" y2="64" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
              </g>
            }
            @case (3) {
              <!-- ARESTA 3: NE (Fundo-Direita / -Y) - Encosto a Sudoeste visto por tras, Assento virado para Nordeste -->
              <g class="chair-aresta-ne">
                <ellipse cx="60" cy="86" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="60" y1="82" x2="44" y2="85" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="76" y2="85" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="60" y1="82" x2="60" y2="90" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="60" y1="67" x2="60" y2="82" stroke="#78350F" stroke-width="5" />

                <!-- Assento sob a mesa ao fundo-direita -->
                <polygon points="48,56 66,47 84,56 66,65" fill="#D97706" stroke="#92400E" stroke-width="2" />
                <polygon points="84,56 84,62 66,71 66,65" fill="#92400E" />

                <!-- Braco distante (NE) -->
                <line x1="72" y1="45" x2="86" y2="52" stroke="#D97706" stroke-width="5" stroke-linecap="round" />

                <!-- Encosto Alto Couro Visto Por Tras (em primeiro plano no quadrante SW) -->
                <polygon points="50,17 72,28 72,63 50,52" fill="#78350F" stroke="#451A03" stroke-width="2" />
                <polygon points="52,22 70,31 70,58 52,49" fill="#92400E" />
                <ellipse cx="61" cy="16" rx="8" ry="4.5" fill="#451A03" stroke="#78350F" stroke-width="1.5" />

                <!-- Braco dianteiro (SW) -->
                <line x1="54" y1="57" x2="68" y2="64" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
              </g>
            }
            @default {
              <!-- ARESTA 0: SE (Frente-Direita / +X) - Encosto a Noroeste, Assento virado para Sudeste (DE FRENTE PRA MESA) -->
              <g class="chair-aresta-se">
                <ellipse cx="56" cy="86" rx="18" ry="6" fill="#78350F" opacity="0.25" />
                <line x1="56" y1="82" x2="40" y2="86" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="82" x2="72" y2="85" stroke="#D97706" stroke-width="3" stroke-linecap="round" />
                <line x1="56" y1="82" x2="56" y2="90" stroke="#92400E" stroke-width="3.5" stroke-linecap="round" />
                <line x1="56" y1="67" x2="56" y2="82" stroke="#78350F" stroke-width="5" />
                <polygon points="44,64 66,64 64,70 46,70" fill="#451A03" />

                <!-- Braco distante/traseiro (NE) -->
                <line x1="55" y1="46" x2="55" y2="39" stroke="#78350F" stroke-width="3.5" />
                <line x1="48" y1="38" x2="66" y2="46" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />

                <!-- Encosto Alto Couro no quadrante NW (face voltada para SE / camera) -->
                <polygon points="34,20 54,30 54,58 34,48" fill="#B45309" stroke="#78350F" stroke-width="2" />
                <polygon points="36,23 52,31 52,55 36,47" fill="#D97706" />
                <ellipse cx="44" cy="18" rx="8" ry="5" fill="#92400E" stroke="#78350F" stroke-width="1.5" />
                <!-- Botoes Capitone -->
                <circle cx="47" cy="30" r="1.8" fill="#FEF3C7" />
                <circle cx="41" cy="37" r="1.8" fill="#FEF3C7" />
                <circle cx="47" cy="42" r="1.8" fill="#FEF3C7" />
                <circle cx="41" cy="49" r="1.8" fill="#FEF3C7" />

                <!-- Assento estendido na direcao +X (Aresta SE - Perpendicular a mesa da direita!) -->
                <polygon points="36,56 54,65 54,71 36,62" fill="#B45309" />
                <polygon points="72,56 54,65 54,71 72,62" fill="#92400E" />
                <polygon points="36,56 54,47 72,56 54,65" fill="#D97706" stroke="#92400E" stroke-width="2" />

                <!-- Braco dianteiro estofado (SW) -->
                <path d="M48,62 L48,51 L66,60" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <line x1="46" y1="49" x2="68" y2="60" stroke="#D97706" stroke-width="5.5" stroke-linecap="round" />
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
        <!-- ========================================== -->
        <!-- ITENS EXPANDIDOS DO CATÁLOGO E LOOTBOXES   -->
        <!-- ========================================== -->

        <!-- Cama Elástica Sensorial Arco-Íris -->
        @case ('ped_cama_elastica_arco_iris') {
          <g>
            <ellipse cx="60" cy="84" rx="42" ry="16" fill="rgba(0,0,0,0.15)" />
            <!-- Pernas metálicas com sapatas de borracha -->
            <line x1="28" y1="74" x2="28" y2="88" stroke="#64748B" stroke-width="4" stroke-linecap="round" />
            <line x1="92" y1="74" x2="92" y2="88" stroke="#64748B" stroke-width="4" stroke-linecap="round" />
            <line x1="42" y1="78" x2="42" y2="92" stroke="#475569" stroke-width="3.5" stroke-linecap="round" />
            <line x1="78" y1="78" x2="78" y2="92" stroke="#475569" stroke-width="3.5" stroke-linecap="round" />
            <!-- Aro externo com protetor arco-íris acolchoado -->
            <ellipse cx="60" cy="68" rx="46" ry="18" fill="#EC4899" stroke="#DB2777" stroke-width="2" />
            <path d="M14 68 C14 56 34 50 60 50 C86 50 106 56 106 68 C106 74 94 80 78 83 C62 86 38 85 24 81 Z" fill="#F59E0B" opacity="0.85" />
            <path d="M18 67 C20 58 38 52 60 52 C82 52 100 58 102 67 C98 73 84 78 70 80 C56 82 34 81 22 77 Z" fill="#10B981" opacity="0.85" />
            <path d="M22 66 C24 60 40 54 60 54 C80 54 96 60 98 66 C92 71 80 75 66 77 C52 79 32 78 24 74 Z" fill="#06B6D4" opacity="0.85" />
            <path d="M26 65 C28 61 42 56 60 56 C78 56 92 61 94 65 C88 69 76 73 64 74 C52 75 34 74 28 71 Z" fill="#8B5CF6" opacity="0.85" />
            <!-- Lona elástica preta de salto -->
            <ellipse cx="60" cy="65" rx="30" ry="11" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5" />
            <!-- Cruz/Estrela sensorial fosforescente central -->
            <polygon points="60,59 62,63 66,65 62,67 60,71 58,67 54,65 58,63" fill="#FACC15" />
            <circle cx="48" cy="64" r="1.5" fill="#38BDF8" />
            <circle cx="72" cy="64" r="1.5" fill="#38BDF8" />
          </g>
        }

        <!-- Aquário de Parede com Águas-Vivas -->
        @case ('rec_aquario_parede_jellyfish') {
          <g>
            <!-- Moldura elegante de parede em alumínio escovado e LED neon -->
            <rect x="22" y="32" width="76" height="52" rx="6" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5" />
            <!-- Interior aquático com profundidade oceânica -->
            <rect x="25" y="35" width="70" height="46" rx="4" fill="#0369A1" />
            <path d="M25 35 L95 35 L95 65 Q60 75 25 65 Z" fill="#0284C7" opacity="0.75" />
            <path d="M25 55 Q60 65 95 55 L95 81 L25 81 Z" fill="#082F49" opacity="0.6" />
            <!-- Água-viva 1: Rosa bioluminescente -->
            <g transform="translate(42, 42)">
              <ellipse cx="8" cy="6" rx="7" ry="5" fill="#F472B6" opacity="0.9" />
              <path d="M3 8 Q2 14 5 18 M6 9 Q7 16 8 20 M10 9 Q11 15 11 19 M13 8 Q15 14 13 18" stroke="#F472B6" stroke-width="1.2" fill="none" opacity="0.85" />
              <ellipse cx="8" cy="6" rx="4" ry="2.5" fill="#FDF2F8" opacity="0.95" />
            </g>
            <!-- Água-viva 2: Ciano translúcida menor -->
            <g transform="translate(66, 50)">
              <ellipse cx="6" cy="5" rx="5" ry="3.5" fill="#67E8F9" opacity="0.85" />
              <path d="M3 7 Q2 11 4 15 M6 7 Q6 12 7 16 M9 7 Q10 11 8 15" stroke="#67E8F9" stroke-width="1" fill="none" opacity="0.8" />
              <ellipse cx="6" cy="5" rx="3" ry="1.8" fill="#FFFFFF" opacity="0.95" />
            </g>
            <!-- Bolhas subindo -->
            <circle cx="34" cy="68" r="1.5" fill="rgba(255,255,255,0.7)" />
            <circle cx="36" cy="54" r="2" fill="rgba(255,255,255,0.8)" />
            <circle cx="35" cy="42" r="1.2" fill="rgba(255,255,255,0.6)" />
            <circle cx="80" cy="72" r="1.8" fill="rgba(255,255,255,0.7)" />
            <circle cx="82" cy="58" r="1.3" fill="rgba(255,255,255,0.6)" />
            <!-- Reflexo curvo no vidro do aquário -->
            <path d="M30 38 L42 38 L32 75 L28 75 Z" fill="rgba(255,255,255,0.22)" />
          </g>
        }

        <!-- Projetor Galáctico de Parede -->
        @case ('ped_projetor_estrelas_teto') {
          <g>
            <!-- Base de fixação na parede -->
            <ellipse cx="60" cy="72" rx="28" ry="10" fill="#334155" stroke="#0284C7" stroke-width="1.5" />
            <!-- Cúpula esférica do projetor cósmico -->
            <circle cx="60" cy="52" r="22" fill="#0F172A" stroke="#38BDF8" stroke-width="2" />
            <!-- Lente holográfica central -->
            <ellipse cx="60" cy="50" rx="14" ry="11" fill="#4338CA" />
            <ellipse cx="60" cy="50" rx="9" ry="7" fill="#818CF8" />
            <circle cx="60" cy="50" r="4.5" fill="#E0E7FF" />
            <!-- Feixes luminosos estelares -->
            <path d="M42 42 L18 20 M78 42 L102 20 M60 30 L60 8" stroke="#38BDF8" stroke-width="1.8" stroke-dasharray="3,3" opacity="0.85" />
            <circle cx="24" cy="18" r="2" fill="#FACC15" />
            <circle cx="96" cy="18" r="2" fill="#F472B6" />
            <circle cx="60" cy="6" r="2.5" fill="#38BDF8" />
            <!-- Constelações gravadas na carcaça -->
            <line x1="46" y1="60" x2="52" y2="64" stroke="#93C5FD" stroke-width="1" />
            <circle cx="46" cy="60" r="1.2" fill="#FFFFFF" />
            <circle cx="52" cy="64" r="1.2" fill="#FFFFFF" />
            <line x1="68" y1="62" x2="74" y2="58" stroke="#93C5FD" stroke-width="1" />
            <circle cx="68" cy="62" r="1.2" fill="#FFFFFF" />
            <circle cx="74" cy="58" r="1.2" fill="#FFFFFF" />
          </g>
        }

        <!-- Painel Magnético Árvore da Floresta -->
        @case ('ped_painel_arvore_amigos') {
          <g>
            <!-- Placa magnética com contorno de árvore lúdica -->
            <rect x="24" y="24" width="72" height="68" rx="8" fill="#FEF3C7" stroke="#15803D" stroke-width="2.5" />
            <!-- Tronco estilizado -->
            <path d="M52 92 L52 64 Q60 62 68 64 L68 92 Z" fill="#92400E" />
            <!-- Copa da árvore com camadas verdes -->
            <circle cx="60" cy="48" r="24" fill="#22C55E" />
            <circle cx="44" cy="50" r="16" fill="#16A34A" />
            <circle cx="76" cy="50" r="16" fill="#16A34A" />
            <circle cx="60" cy="38" r="18" fill="#4ADE80" />
            <!-- Corujinha magnética na copa -->
            <circle cx="52" cy="44" r="4.5" fill="#78350F" />
            <circle cx="50.5" cy="43" r="1.5" fill="#FFFFFF" />
            <circle cx="50.5" cy="43" r="0.7" fill="#000000" />
            <circle cx="53.5" cy="43" r="1.5" fill="#FFFFFF" />
            <circle cx="53.5" cy="43" r="0.7" fill="#000000" />
            <polygon points="52,44.5 51,46 53,46" fill="#F59E0B" />
            <!-- Maçãs e peças magnéticas coloridas -->
            <circle cx="40" cy="46" r="3" fill="#EF4444" />
            <circle cx="78" cy="44" r="3" fill="#EF4444" />
            <circle cx="68" cy="36" r="3" fill="#EF4444" />
            <!-- Peças magnéticas de números/letras na base -->
            <rect x="30" y="76" width="8" height="8" rx="2" fill="#3B82F6" />
            <text x="34" y="83" font-size="6" fill="#FFFFFF" font-weight="bold" text-anchor="middle">A</text>
            <rect x="42" y="76" width="8" height="8" rx="2" fill="#F59E0B" />
            <text x="46" y="83" font-size="6" fill="#FFFFFF" font-weight="bold" text-anchor="middle">1</text>
            <rect x="74" y="76" width="8" height="8" rx="2" fill="#EC4899" />
            <text x="78" y="83" font-size="6" fill="#FFFFFF" font-weight="bold" text-anchor="middle">★</text>
          </g>
        }

        <!-- Maca Foguete Espacial Retrô -->
        @case ('ped_maca_foguete_retro') {
          <g>
            <ellipse cx="60" cy="85" rx="38" ry="12" fill="rgba(0,0,0,0.18)" />
            <!-- Pernas estilo trem de pouso prateadas -->
            <line x1="32" y1="72" x2="26" y2="86" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" />
            <line x1="88" y1="72" x2="94" y2="86" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" />
            <!-- Corpo cilíndrico do foguete -->
            <path d="M24 64 L78 40 L96 50 L42 74 Z" fill="#F8FAFC" stroke="#DC2626" stroke-width="2" />
            <!-- Nariz do foguete (travesseiro vermelho chanfrado) -->
            <polygon points="78,40 96,30 106,36 96,50" fill="#EF4444" stroke="#DC2626" stroke-width="1.5" />
            <!-- Aletas traseiras com faixas azuis -->
            <polygon points="24,64 12,68 18,78 30,72" fill="#2563EB" stroke="#1D4ED8" stroke-width="1.5" />
            <!-- Janelinhas redondas de escotilha -->
            <circle cx="58" cy="54" r="3.5" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2" />
            <circle cx="72" cy="48" r="3.5" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2" />
            <!-- Estofado acolchoado pediátrico macio -->
            <path d="M38 68 L78 48 L86 53 L46 73 Z" fill="#E2E8F0" />
            <line x1="48" y1="63" x2="56" y2="67" stroke="#CBD5E1" stroke-width="1" />
            <line x1="58" y1="58" x2="66" y2="62" stroke="#CBD5E1" stroke-width="1" />
            <line x1="68" y1="53" x2="76" y2="57" stroke="#CBD5E1" stroke-width="1" />
          </g>
        }

        <!-- Cubo Sensorial Montessori -->
        @case ('ped_cubo_sensorial_montessori') {
          <g>
            <ellipse cx="60" cy="80" rx="24" ry="10" fill="rgba(0,0,0,0.15)" />
            <!-- Bloco Isométrico de Madeira Maciça Nobre -->
            <polygon points="36,54 60,40 84,54 60,68" fill="#FDE68A" stroke="#D97706" stroke-width="1.8" />
            <polygon points="36,54 60,68 60,86 36,72" fill="#F59E0B" stroke="#D97706" stroke-width="1.8" />
            <polygon points="84,54 60,68 60,86 84,72" fill="#D97706" stroke="#B45309" stroke-width="1.8" />
            <!-- Engrenagens coloridas no topo -->
            <circle cx="52" cy="52" r="4.5" fill="#EF4444" />
            <circle cx="66" cy="50" r="4" fill="#3B82F6" />
            <circle cx="58" cy="60" r="3.5" fill="#10B981" />
            <!-- Labirinto de arames com contas coloridas -->
            <path d="M42 46 Q50 30 56 46" stroke="#DC2626" stroke-width="1.5" fill="none" />
            <circle cx="48" cy="38" r="1.8" fill="#FBBF24" />
            <path d="M64 44 Q70 28 78 44" stroke="#2563EB" stroke-width="1.5" fill="none" />
            <circle cx="72" cy="36" r="1.8" fill="#34D399" />
          </g>
        }

        <!-- Mini Laboratório Cientista Júnior -->
        @case ('ped_bancada_quimica_junior') {
          <g>
            <ellipse cx="60" cy="84" rx="34" ry="12" fill="rgba(0,0,0,0.15)" />
            <!-- Bancada com gaveteiro de madeira clara -->
            <polygon points="28,54 60,38 92,54 60,70" fill="#E2E8F0" stroke="#0D9488" stroke-width="2" />
            <polygon points="28,54 60,70 60,84 28,68" fill="#CBD5E1" stroke="#0D9488" stroke-width="1.5" />
            <polygon points="92,54 60,70 60,84 92,68" fill="#94A3B8" stroke="#0D9488" stroke-width="1.5" />
            <!-- Erlenmeyer borbulhante verde neon -->
            <polygon points="40,56 44,56 46,62 38,62" fill="#22C55E" stroke="#15803D" stroke-width="1" />
            <circle cx="42" cy="52" r="1" fill="#4ADE80" />
            <!-- Tubos de ensaio coloridos em rack -->
            <rect x="52" y="44" width="3" height="12" rx="1.5" fill="#EF4444" />
            <rect x="57" y="42" width="3" height="14" rx="1.5" fill="#3B82F6" />
            <rect x="62" y="45" width="3" height="11" rx="1.5" fill="#FACC15" />
            <!-- Microscópio infantil azul -->
            <path d="M74 58 L78 52 L82 54 L78 60 Z" fill="#6366F1" />
            <circle cx="76" cy="62" r="3" fill="#4338CA" />
          </g>
        }

        <!-- Robô Cuidador Amigável Dr. Pixel -->
        @case ('ped_robo_pixel_cuidador') {
          <g class="ambient-bob">
            <ellipse cx="60" cy="84" rx="18" ry="7" fill="rgba(0,0,0,0.15)" />
            <!-- Rodinhas orbe central -->
            <circle cx="60" cy="78" r="7" fill="#475569" stroke="#0F172A" stroke-width="1.5" />
            <!-- Corpo arredondado branco puro -->
            <rect x="44" y="48" width="32" height="26" rx="8" fill="#F8FAFC" stroke="#0284C7" stroke-width="2" />
            <!-- Tela de rosto com olhos digitais felizes -->
            <rect x="48" y="52" width="24" height="14" rx="4" fill="#0F172A" />
            <circle cx="54" cy="58" r="2.2" fill="#38BDF8" />
            <circle cx="66" cy="58" r="2.2" fill="#38BDF8" />
            <path d="M57 62 Q60 64 63 62" stroke="#38BDF8" stroke-width="1.2" fill="none" />
            <!-- Antena com esfera pulsante -->
            <line x1="60" y1="48" x2="60" y2="40" stroke="#0284C7" stroke-width="2" />
            <circle cx="60" cy="38" r="3.5" fill="#F43F5E" />
            <!-- Braços articulados amigáveis acenando -->
            <path d="M44 56 Q36 50 34 44" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <circle cx="34" cy="43" r="2.5" fill="#38BDF8" />
            <path d="M76 56 Q82 60 84 66" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <circle cx="85" cy="67" r="2.5" fill="#38BDF8" />
          </g>
        }

        <!-- Maca Disco Voador com LED Neon -->
        @case ('ped_maca_disco_voador') {
          <g class="ambient-bob">
            <ellipse cx="60" cy="86" rx="36" ry="12" fill="rgba(6,182,212,0.3)" />
            <!-- Anel externo cromado do disco voador -->
            <ellipse cx="60" cy="66" rx="46" ry="16" fill="#E2E8F0" stroke="#06B6D4" stroke-width="2" />
            <!-- Faixa LED Neon Ciano ao redor -->
            <ellipse cx="60" cy="67" rx="40" ry="13" fill="none" stroke="#22D3EE" stroke-width="2" />
            <!-- Cúpula de acrílico translúcido violeta -->
            <path d="M30 63 C30 44 44 38 60 38 C76 38 90 44 90 63 Z" fill="rgba(168,85,247,0.35)" stroke="#A855F7" stroke-width="1.5" />
            <!-- Colchãozinho ergonômico no interior -->
            <ellipse cx="60" cy="64" rx="26" ry="8" fill="#F1F5F9" />
            <circle cx="48" cy="63" r="3" fill="#F472B6" />
            <circle cx="72" cy="63" r="3" fill="#38BDF8" />
            <circle cx="60" cy="64" r="3" fill="#FACC15" />
          </g>
        }

        <!-- Aquário Cilindro Submarino Lúdico -->
        @case ('ped_aquario_submarino_kids') {
          <g>
            <ellipse cx="60" cy="85" rx="24" ry="10" fill="rgba(0,0,0,0.18)" />
            <!-- Base de submarino amarelo com rebites -->
            <ellipse cx="60" cy="78" rx="26" ry="10" fill="#FACC15" stroke="#CA8A04" stroke-width="2" />
            <!-- Cilindro de água transparente -->
            <rect x="36" y="38" width="48" height="40" fill="rgba(14,165,233,0.3)" stroke="#0284C7" stroke-width="1.8" />
            <ellipse cx="60" cy="38" rx="24" ry="9" fill="#38BDF8" stroke="#0284C7" stroke-width="1.8" />
            <!-- Periscópio no topo -->
            <rect x="56" y="24" width="8" height="14" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5" />
            <path d="M64 24 L74 24 L74 30 L64 30 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5" />
            <circle cx="74" cy="27" r="2.5" fill="#38BDF8" />
            <!-- Peixinhos nadando dentro -->
            <polygon points="50,56 44,52 44,60" fill="#F97316" />
            <circle cx="52" cy="56" r="3" fill="#F97316" />
            <polygon points="70,48 76,45 76,51" fill="#EC4899" />
            <circle cx="68" cy="48" r="2.5" fill="#EC4899" />
            <!-- Bolhas de ar -->
            <circle cx="58" cy="68" r="1.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="60" cy="54" r="2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="59" cy="44" r="1.2" fill="#FFFFFF" opacity="0.8" />
          </g>
        }

        <!-- Tobogã Curvo Nuvem Mágica -->
        @case ('ped_toboga_nuvem_magica') {
          <g>
            <ellipse cx="60" cy="88" rx="42" ry="14" fill="rgba(0,0,0,0.15)" />
            <!-- Nuvem felpuda como base -->
            <circle cx="34" cy="80" r="14" fill="#F1F5F9" />
            <circle cx="50" cy="76" r="18" fill="#FFFFFF" />
            <circle cx="70" cy="78" r="16" fill="#F8FAFC" />
            <circle cx="86" cy="82" r="12" fill="#F1F5F9" />
            <!-- Escada caracol colorida de acesso -->
            <path d="M30 76 L30 38 L42 38 L42 76" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5" />
            <line x1="30" y1="46" x2="42" y2="46" stroke="#EF4444" stroke-width="2" />
            <line x1="30" y1="54" x2="42" y2="54" stroke="#F59E0B" stroke-width="2" />
            <line x1="30" y1="62" x2="42" y2="62" stroke="#10B981" stroke-width="2" />
            <line x1="30" y1="70" x2="42" y2="70" stroke="#3B82F6" stroke-width="2" />
            <!-- Calha espiral do tobogã arco-íris -->
            <path d="M42 42 C70 40 85 55 78 72 C74 80 60 84 50 84" fill="none" stroke="#EC4899" stroke-width="12" stroke-linecap="round" />
            <path d="M42 42 C70 40 85 55 78 72 C74 80 60 84 50 84" fill="none" stroke="#FACC15" stroke-width="7" stroke-linecap="round" />
            <path d="M42 42 C70 40 85 55 78 72 C74 80 60 84 50 84" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
          </g>
        }

        <!-- Cúpula Planetário Imersivo LED -->
        @case ('ped_planetario_domo') {
          <g>
            <ellipse cx="60" cy="86" rx="38" ry="14" fill="rgba(0,0,0,0.2)" />
            <!-- Domo geodésico escuro com nervuras azuis neon -->
            <path d="M26 78 C26 44 40 30 60 30 C80 30 94 44 94 78 Z" fill="#090D16" stroke="#38BDF8" stroke-width="2" />
            <!-- Malha geodésica brilhante -->
            <line x1="60" y1="30" x2="40" y2="52" stroke="#0284C7" stroke-width="1" />
            <line x1="60" y1="30" x2="80" y2="52" stroke="#0284C7" stroke-width="1" />
            <line x1="40" y1="52" x2="80" y2="52" stroke="#0284C7" stroke-width="1" />
            <line x1="40" y1="52" x2="30" y2="76" stroke="#0284C7" stroke-width="1" />
            <line x1="80" y1="52" x2="90" y2="76" stroke="#0284C7" stroke-width="1" />
            <line x1="60" y1="52" x2="60" y2="78" stroke="#0284C7" stroke-width="1" />
            <!-- Constelações e estrelinhas brilhando no domo -->
            <circle cx="50" cy="44" r="1.5" fill="#FDE047" />
            <circle cx="70" cy="42" r="1.8" fill="#F472B6" />
            <circle cx="60" cy="62" r="1.5" fill="#67E8F9" />
            <circle cx="45" cy="66" r="1" fill="#FFFFFF" />
            <circle cx="75" cy="64" r="1" fill="#FFFFFF" />
            <!-- Porta de entrada em arco iluminada -->
            <path d="M52 78 L52 66 Q60 62 68 66 L68 78 Z" fill="#38BDF8" opacity="0.85" />
          </g>
        }

        <!-- Carrossel Vitoriano Encantado com Música -->
        @case ('ped_carrossel_musical_reino') {
          <g class="ambient-bob">
            <ellipse cx="60" cy="88" rx="40" ry="14" fill="rgba(0,0,0,0.18)" />
            <!-- Plataforma circular com espelho dourado -->
            <ellipse cx="60" cy="80" rx="38" ry="12" fill="#FEF3C7" stroke="#D97706" stroke-width="2" />
            <!-- Eixo central com espelhos -->
            <rect x="56" y="42" width="8" height="38" fill="#F59E0B" stroke="#B45309" stroke-width="1.2" />
            <!-- Cavalinhos dourados com crina colorida -->
            <g transform="translate(34, 52)">
              <line x1="6" y1="-8" x2="6" y2="28" stroke="#D97706" stroke-width="1.5" />
              <path d="M0 12 Q4 8 10 10 L12 16 L2 18 Z" fill="#F59E0B" />
              <circle cx="10" cy="11" r="1" fill="#000000" />
            </g>
            <g transform="translate(74, 52)">
              <line x1="6" y1="-8" x2="6" y2="28" stroke="#D97706" stroke-width="1.5" />
              <path d="M0 12 Q4 8 10 10 L12 16 L2 18 Z" fill="#EC4899" />
              <circle cx="10" cy="11" r="1" fill="#000000" />
            </g>
            <!-- Cobertura de circo / carrossel listrada -->
            <polygon points="60,22 22,46 98,46" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5" />
            <polygon points="60,22 36,46 48,46" fill="#F8FAFC" />
            <polygon points="60,22 72,46 84,46" fill="#F8FAFC" />
            <!-- Estrela no topo do mastro -->
            <polygon points="60,16 62,20 66,20 63,23 64,27 60,24 56,27 57,23 54,20 58,20" fill="#FACC15" />
          </g>
        }

        <!-- Cápsula Espacial Simuladora Apollo Kids -->
        @case ('ped_simulador_foguete_orbital') {
          <g>
            <ellipse cx="60" cy="88" rx="46" ry="16" fill="rgba(0,0,0,0.22)" />
            <!-- Plataforma elevatória com pistões hidráulicos -->
            <polygon points="20,72 60,54 100,72 60,90" fill="#334155" stroke="#0284C7" stroke-width="2" />
            <!-- Cockpit da nave futurista com vidro fumê -->
            <path d="M30 68 L60 42 L90 68 L60 82 Z" fill="#F1F5F9" stroke="#0F172A" stroke-width="2" />
            <!-- Janela do para-brisa em hexágono ciano brilhante -->
            <polygon points="46,62 60,48 74,62 60,72" fill="#06B6D4" stroke="#0891B2" stroke-width="1.5" />
            <line x1="46" y1="62" x2="74" y2="62" stroke="#FFFFFF" stroke-width="1" opacity="0.6" />
            <!-- Turbinas laterais com fogo azul neon -->
            <rect x="22" y="66" width="10" height="14" rx="3" fill="#64748B" />
            <rect x="88" y="66" width="10" height="14" rx="3" fill="#64748B" />
            <polygon points="24,80 27,88 30,80" fill="#38BDF8" />
            <polygon points="90,80 93,88 96,80" fill="#38BDF8" />
          </g>
        }

        <!-- Mesa Flutuante Vidro & Inox -->
        @case ('mob_mesa_vidro_flutuante') {
          <g>
            <ellipse cx="60" cy="86" rx="36" ry="12" fill="rgba(0,0,0,0.12)" />
            <!-- Cavaletes tubulares de aço inox escovado -->
            <polygon points="32,60 36,60 36,84 32,84" fill="#94A3B8" />
            <polygon points="84,60 88,60 88,84 84,84" fill="#94A3B8" />
            <!-- Tampo de vidro temperado translúcido esverdeado com chanfro -->
            <polygon points="22,54 60,36 98,54 60,72" fill="rgba(207,250,254,0.7)" stroke="#0891B2" stroke-width="2" />
            <polygon points="22,54 60,72 60,76 22,58" fill="rgba(8,145,178,0.5)" stroke="#0891B2" stroke-width="1" />
            <polygon points="98,54 60,72 60,76 98,58" fill="rgba(8,145,178,0.3)" stroke="#0891B2" stroke-width="1" />
            <!-- Notebook ultrafino de alumínio na mesa -->
            <polygon points="52,52 60,48 68,52 60,56" fill="#F1F5F9" stroke="#64748B" stroke-width="1" />
            <polygon points="52,52 60,40 68,44 60,56" fill="#38BDF8" opacity="0.85" />
          </g>
        }

        <!-- Poltrona Biomecânica Atlas Pro -->
        @case ('mob_poltrona_ergonomica_atlas') {
          <g>
            <ellipse cx="60" cy="86" rx="20" ry="8" fill="rgba(0,0,0,0.18)" />
            <!-- Base estrela 5 pontas de alumínio e rodízios -->
            <polygon points="60,78 46,84 50,86 60,80" fill="#475569" />
            <polygon points="60,78 74,84 70,86 60,80" fill="#475569" />
            <line x1="60" y1="72" x2="60" y2="78" stroke="#1E293B" stroke-width="4" />
            <!-- Assento em malha mesh grafite ergonômico -->
            <polygon points="44,62 60,54 76,62 60,70" fill="#1E293B" stroke="#0284C7" stroke-width="1.5" />
            <!-- Encosto com suporte lombar 3D -->
            <path d="M48 60 Q60 48 72 60 L70 38 Q60 32 50 38 Z" fill="#0F172A" stroke="#0284C7" stroke-width="1.8" />
            <!-- Apoio de cabeça regulável -->
            <ellipse cx="60" cy="30" rx="9" ry="5" fill="#1E293B" stroke="#0284C7" stroke-width="1.5" />
            <!-- Braços 4D acolchoados -->
            <rect x="40" y="52" width="5" height="12" rx="2" fill="#334155" />
            <rect x="75" y="52" width="5" height="12" rx="2" fill="#334155" />
          </g>
        }

        <!-- Estante Cilíndrica Giratória Farmácia -->
        @case ('mob_estante_livros_giratoria') {
          <g>
            <ellipse cx="60" cy="86" rx="22" ry="9" fill="rgba(0,0,0,0.18)" />
            <ellipse cx="60" cy="82" rx="20" ry="8" fill="#78350F" stroke="#451A03" stroke-width="1.5" />
            <!-- Prateleiras cilíndricas giratórias -->
            <rect x="42" y="36" width="36" height="46" rx="4" fill="#92400E" stroke="#451A03" stroke-width="1.8" />
            <ellipse cx="60" cy="36" rx="18" ry="7" fill="#B45309" stroke="#451A03" stroke-width="1.5" />
            <line x1="42" y1="52" x2="78" y2="52" stroke="#451A03" stroke-width="1.5" />
            <line x1="42" y1="68" x2="78" y2="68" stroke="#451A03" stroke-width="1.5" />
            <!-- Livros com lombadas coloridas e detalhes dourados -->
            <rect x="46" y="38" width="4" height="13" fill="#DC2626" />
            <rect x="51" y="39" width="5" height="12" fill="#2563EB" />
            <rect x="57" y="38" width="4" height="13" fill="#16A34A" />
            <rect x="62" y="40" width="5" height="11" fill="#D97706" />
            <rect x="68" y="38" width="4" height="13" fill="#9333EA" />
            <!-- Livros na prateleira do meio -->
            <rect x="46" y="54" width="5" height="13" fill="#0D9488" />
            <rect x="52" y="55" width="4" height="12" fill="#EA580C" />
            <rect x="57" y="54" width="6" height="13" fill="#1E293B" />
            <rect x="64" y="56" width="4" height="11" fill="#CA8A04" />
          </g>
        }

        <!-- Biombo Art Déco Ouro Escovado -->
        @case ('mob_biombo_art_deco_dourado') {
          <g>
            <ellipse cx="60" cy="86" rx="34" ry="10" fill="rgba(0,0,0,0.15)" />
            <!-- Painel 1 (Esquerdo) com trama dourada Art Déco -->
            <polygon points="26,42 48,30 48,78 26,90" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
            <path d="M28 66 Q37 50 46 66 M30 76 Q37 60 44 76" stroke="#FBBF24" stroke-width="1.2" fill="none" />
            <!-- Painel 2 (Direito) -->
            <polygon points="48,30 72,42 72,90 48,78" fill="#0F172A" stroke="#F59E0B" stroke-width="2" />
            <path d="M50 66 Q60 50 70 66 M52 76 Q60 60 68 76" stroke="#FBBF24" stroke-width="1.2" fill="none" />
            <!-- Painel 3 (Terceiro segmento) -->
            <polygon points="72,42 94,30 94,78 72,90" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
            <path d="M74 66 Q83 50 92 66" stroke="#FBBF24" stroke-width="1.2" fill="none" />
          </g>
        }

        <!-- Poltrona Gravidade Zero Aquecida -->
        @case ('mob_poltrona_anti_gravidade') {
          <g>
            <ellipse cx="60" cy="85" rx="26" ry="10" fill="rgba(0,0,0,0.18)" />
            <!-- Chassi curvo de fibra de carbono -->
            <path d="M38 78 Q50 86 78 74 L82 70 Q54 82 42 74 Z" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
            <!-- Estrutura reclinada em couro legítimo caramelo -->
            <path d="M36 68 Q52 74 64 64 L80 44 Q76 40 68 44 L56 58 Q48 64 36 64 Z" fill="#D97706" stroke="#B45309" stroke-width="2" />
            <!-- Gomos estofados acolchoados com linhas de costura -->
            <line x1="44" y1="66" x2="42" y2="60" stroke="#78350F" stroke-width="1.2" />
            <line x1="52" y1="65" x2="50" y2="59" stroke="#78350F" stroke-width="1.2" />
            <line x1="60" y1="60" x2="58" y2="54" stroke="#78350F" stroke-width="1.2" />
            <line x1="68" y1="52" x2="66" y2="46" stroke="#78350F" stroke-width="1.2" />
            <!-- Almofada de cabeça anatômica -->
            <ellipse cx="76" cy="42" rx="7" ry="4.5" fill="#B45309" />
          </g>
        }

        <!-- Maca Hidráulica em Couro Pérola -->
        @case ('mob_maca_podologia_hidraulica') {
          <g>
            <ellipse cx="60" cy="86" rx="36" ry="12" fill="rgba(0,0,0,0.18)" />
            <!-- Coluna telescópica hidráulica redonda em inox -->
            <ellipse cx="60" cy="78" rx="16" ry="6" fill="#94A3B8" stroke="#475569" stroke-width="1.5" />
            <rect x="56" y="66" width="8" height="12" fill="#CBD5E1" stroke="#475569" stroke-width="1" />
            <!-- Corpo tripartido da maca articulada (pernas, assento, encosto) -->
            <polygon points="26,62 48,50 62,58 40,70" fill="#F8FAFC" stroke="#0D9488" stroke-width="1.8" />
            <polygon points="48,50 68,38 82,46 62,58" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.8" />
            <polygon points="68,38 86,28 98,35 80,45" fill="#F8FAFC" stroke="#0D9488" stroke-width="1.8" />
            <!-- Braços estofados e almofada de cabeça -->
            <ellipse cx="90" cy="30" rx="5" ry="3" fill="#E2E8F0" />
            <rect x="50" y="56" width="4" height="10" rx="1.5" fill="#E2E8F0" stroke="#0D9488" stroke-width="0.8" />
          </g>
        }

        <!-- Estação de Laudos Tripla Curva 4K -->
        @case ('mob_estacao_laudos_tripla') {
          <g>
            <ellipse cx="60" cy="86" rx="36" ry="12" fill="rgba(0,0,0,0.18)" />
            <!-- Mesa escura com pés metálicos -->
            <polygon points="24,58 60,40 96,58 60,76" fill="#1E293B" stroke="#475569" stroke-width="2" />
            <!-- Monitor Central 4K -->
            <polygon points="46,42 74,42 74,24 46,24" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
            <rect x="48" y="26" width="24" height="14" fill="#0369A1" />
            <!-- Monitor Esquerdo Inclinado -->
            <polygon points="22,46 44,40 44,22 22,28" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
            <polygon points="24,44 42,39 42,24 24,29" fill="#075985" />
            <!-- Monitor Direito Inclinado -->
            <polygon points="76,40 98,46 98,28 76,22" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
            <polygon points="78,39 96,44 96,29 78,24" fill="#075985" />
            <!-- Imagem de raio-x/ressonância na tela central -->
            <ellipse cx="60" cy="33" rx="5" ry="3.5" fill="#E0F2FE" opacity="0.8" />
            <!-- Teclado retroiluminado e mousepad de radiologia -->
            <polygon points="50,60 62,54 70,58 58,64" fill="#334155" />
          </g>
        }

        <!-- Vitrine Farmacêutica em Cristal & Latão -->
        @case ('mob_aparador_cristal_farmacia') {
          <g>
            <ellipse cx="60" cy="86" rx="34" ry="11" fill="rgba(0,0,0,0.15)" />
            <!-- Pés de latão dourado cônico -->
            <line x1="28" y1="74" x2="26" y2="86" stroke="#D97706" stroke-width="3" />
            <line x1="92" y1="74" x2="94" y2="86" stroke="#D97706" stroke-width="3" />
            <!-- Corpo de cristal e latão nobre -->
            <polygon points="26,50 60,34 94,50 60,66" fill="#FDE68A" stroke="#B45309" stroke-width="2" />
            <polygon points="26,50 60,66 60,78 26,62" fill="rgba(253,230,138,0.7)" stroke="#B45309" stroke-width="1.5" />
            <polygon points="94,50 60,66 60,78 94,62" fill="rgba(217,119,6,0.5)" stroke="#B45309" stroke-width="1.5" />
            <!-- Frascos de poções e extratos medicinais antigos -->
            <rect x="42" y="42" width="4" height="8" fill="#15803D" />
            <rect x="50" y="40" width="5" height="10" fill="#9333EA" />
            <rect x="60" y="43" width="4" height="7" fill="#DC2626" />
            <rect x="70" y="41" width="5" height="9" fill="#2563EB" />
          </g>
        }

        <!-- Arquivo de Psicotrópicos em Titânio -->
        @case ('mob_gaveteiro_blindado_titanio') {
          <g>
            <ellipse cx="60" cy="85" rx="22" ry="9" fill="rgba(0,0,0,0.2)" />
            <!-- Cofre monolítico de titânio escovado -->
            <polygon points="38,50 60,38 82,50 60,62" fill="#64748B" stroke="#1E293B" stroke-width="2" />
            <polygon points="38,50 60,62 60,82 38,70" fill="#475569" stroke="#1E293B" stroke-width="2" />
            <polygon points="82,50 60,62 60,82 82,70" fill="#334155" stroke="#1E293B" stroke-width="2" />
            <!-- Gavetas reforçadas com trancas eletrônicas -->
            <line x1="42" y1="58" x2="56" y2="66" stroke="#1E293B" stroke-width="1.5" />
            <line x1="42" y1="66" x2="56" y2="74" stroke="#1E293B" stroke-width="1.5" />
            <!-- Painel biométrico com LED vermelho de segurança máxima -->
            <rect x="46" y="53" width="5" height="3" fill="#EF4444" />
            <rect x="46" y="61" width="5" height="3" fill="#10B981" />
          </g>
        }

        <!-- Mesa Presidencial Holográfica 3D -->
        @case ('mob_mesa_holografica_nogueira') {
          <g>
            <ellipse cx="60" cy="88" rx="44" ry="16" fill="rgba(0,0,0,0.25)" />
            <!-- Tampo de nogueira maciça com borda chanfrada -->
            <polygon points="16,56 60,34 104,56 60,78" fill="#451A03" stroke="#D97706" stroke-width="2.5" />
            <polygon points="16,56 60,78 60,84 16,62" fill="#290E02" />
            <polygon points="104,56 60,78 60,84 104,62" fill="#1B0901" />
            <!-- Emissor holográfico central circular -->
            <ellipse cx="60" cy="56" rx="20" ry="9" fill="#0369A1" stroke="#38BDF8" stroke-width="1.8" />
            <!-- Holograma 3D suspenso de um coração humano pulsante -->
            <g class="ambient-pulse">
              <path d="M56 42 C52 38 48 42 52 48 L60 54 L68 48 C72 42 68 38 64 42 Z" fill="rgba(56,189,248,0.75)" stroke="#38BDF8" stroke-width="1.2" />
              <!-- Feixes verticais azuis do projetor -->
              <line x1="48" y1="56" x2="52" y2="44" stroke="#38BDF8" stroke-width="0.8" stroke-dasharray="2,2" />
              <line x1="72" y1="56" x2="68" y2="44" stroke="#38BDF8" stroke-width="0.8" stroke-dasharray="2,2" />
            </g>
          </g>
        }

        <!-- Maca de Levitação Magnética MagLev -->
        @case ('mob_maca_terapeutica_levitacao') {
          <g class="ambient-bob">
            <!-- Trilho magnético de piso com bobinas superconductoras -->
            <polygon points="26,76 60,60 94,76 60,92" fill="#0F172A" stroke="#06B6D4" stroke-width="2" />
            <ellipse cx="60" cy="76" rx="26" ry="10" fill="#0891B2" opacity="0.6" />
            <!-- Maca branca flutuando a 15px de altura -->
            <polygon points="24,54 60,36 96,54 60,72" fill="#F8FAFC" stroke="#06B6D4" stroke-width="2" />
            <polygon points="24,54 60,72 60,78 24,60" fill="#E2E8F0" stroke="#06B6D4" stroke-width="1.5" />
            <polygon points="96,54 60,72 60,78 96,60" fill="#CBD5E1" stroke="#06B6D4" stroke-width="1.5" />
            <!-- Colchão anti-escaras com campo de força ciano neon -->
            <path d="M34 52 L60 40 L86 52 L60 64 Z" fill="rgba(34,211,238,0.3)" />
            <ellipse cx="78" cy="48" rx="6" ry="3.5" fill="#E2E8F0" />
          </g>
        }

        <!-- Cristaleira Imperial Botânica 1880 -->
        @case ('mob_cristaleira_seculo_xix') {
          <g>
            <ellipse cx="60" cy="86" rx="34" ry="11" fill="rgba(0,0,0,0.18)" />
            <!-- Cristaleira vitoriana de mogno com frontão entalhado -->
            <rect x="28" y="24" width="64" height="60" rx="4" fill="#78350F" stroke="#451A03" stroke-width="2.5" />
            <!-- Portas de vidro com divisões inglesas -->
            <rect x="32" y="28" width="26" height="42" fill="rgba(224,242,254,0.35)" stroke="#D97706" stroke-width="1.5" />
            <rect x="62" y="28" width="26" height="42" fill="rgba(224,242,254,0.35)" stroke="#D97706" stroke-width="1.5" />
            <!-- Plantas medicinais e ervas herborizadas em redomas -->
            <circle cx="45" cy="46" r="5" fill="#15803D" />
            <circle cx="75" cy="46" r="5" fill="#16A34A" />
            <rect x="42" y="58" width="6" height="8" fill="#D97706" />
            <rect x="72" y="58" width="6" height="8" fill="#B45309" />
          </g>
        }

        <!-- Ecógrafo Ultrassom Portátil Wireless -->
        @case ('cli_ecografo_portatil_tablet') {
          <g>
            <ellipse cx="60" cy="85" rx="18" ry="7" fill="rgba(0,0,0,0.15)" />
            <!-- Pedestal móvel cromado -->
            <line x1="60" y1="58" x2="60" y2="84" stroke="#94A3B8" stroke-width="4" />
            <!-- Tablet médico profissional com doppler colorido -->
            <rect x="42" y="34" width="36" height="26" rx="4" fill="#0F172A" stroke="#0284C7" stroke-width="2" />
            <rect x="45" y="37" width="30" height="20" rx="2" fill="#0369A1" />
            <!-- Transdutor / Probe setorial de ultrassom acoplado -->
            <path d="M48 46 Q54 42 60 48 Q66 52 72 46" stroke="#FACC15" stroke-width="2" fill="none" />
            <rect x="78" y="44" width="6" height="12" rx="2" fill="#E2E8F0" stroke="#0284C7" stroke-width="1" />
          </g>
        }

        <!-- Dermatoscópio Digital Polarizado -->
        @case ('cli_dermatoscopio_digital') {
          <g>
            <ellipse cx="60" cy="84" rx="20" ry="8" fill="rgba(0,0,0,0.15)" />
            <!-- Base de recarga por indução -->
            <ellipse cx="60" cy="78" rx="18" ry="7" fill="#1E293B" stroke="#0D9488" stroke-width="1.5" />
            <!-- Handpiece dermatoscópio ergonômico com anel LED -->
            <rect x="55" y="42" width="10" height="36" rx="4" fill="#F8FAFC" stroke="#0D9488" stroke-width="1.8" />
            <!-- Lente óptica com 16 LEDs polarizados -->
            <circle cx="60" cy="38" r="10" fill="#0F172A" stroke="#0D9488" stroke-width="2" />
            <circle cx="60" cy="38" r="6" fill="#06B6D4" />
            <circle cx="56" cy="34" r="1" fill="#FFFFFF" />
            <circle cx="64" cy="34" r="1" fill="#FFFFFF" />
            <circle cx="56" cy="42" r="1" fill="#FFFFFF" />
            <circle cx="64" cy="42" r="1" fill="#FFFFFF" />
          </g>
        }

        <!-- Painel de Otoscópio Fibra Óptica 4K -->
        @case ('cli_otoscopio_fibra_optica') {
          <g>
            <!-- Painel de parede com transformador e suportes -->
            <rect x="28" y="28" width="64" height="48" rx="5" fill="#F1F5F9" stroke="#0284C7" stroke-width="2" />
            <!-- Cabeça do Otoscópio com cabo espiralado -->
            <rect x="36" y="36" width="10" height="20" rx="3" fill="#1E293B" stroke="#64748B" stroke-width="1.2" />
            <polygon points="41,32 38,36 44,36" fill="#0284C7" />
            <path d="M41 56 Q38 64 41 72" stroke="#0F172A" stroke-width="2" fill="none" />
            <!-- Cabeça do Oftalmoscópio com anel seletor -->
            <rect x="54" y="36" width="10" height="20" rx="3" fill="#1E293B" stroke="#64748B" stroke-width="1.2" />
            <circle cx="59" cy="38" r="2.5" fill="#38BDF8" />
            <path d="M59 56 Q56 64 59 72" stroke="#0F172A" stroke-width="2" fill="none" />
            <!-- Termômetro auricular digital com display -->
            <rect x="72" y="38" width="8" height="18" rx="2" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.2" />
            <rect x="74" y="42" width="4" height="4" fill="#0D9488" />
          </g>
        }

        <!-- Bioimpedância Clínica Octapolar -->
        @case ('cli_balanca_bioimpedancia_pro') {
          <g>
            <ellipse cx="60" cy="86" rx="26" ry="10" fill="rgba(0,0,0,0.18)" />
            <!-- Plataforma no chão com eletrodos táteis de inox -->
            <polygon points="36,74 60,64 84,74 60,84" fill="#F8FAFC" stroke="#0284C7" stroke-width="2" />
            <ellipse cx="48" cy="74" rx="4" ry="2" fill="#94A3B8" />
            <ellipse cx="72" cy="74" rx="4" ry="2" fill="#94A3B8" />
            <!-- Coluna de alumínio aeronáutico vertical -->
            <line x1="60" y1="36" x2="60" y2="70" stroke="#475569" stroke-width="4" />
            <!-- Barra de manoplas telescópicas para as mãos -->
            <line x1="42" y1="42" x2="78" y2="42" stroke="#0284C7" stroke-width="3" stroke-linecap="round" />
            <!-- Console com tela touch colorida -->
            <rect x="50" y="24" width="20" height="16" rx="3" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
            <rect x="52" y="26" width="16" height="12" fill="#0369A1" />
          </g>
        }

        <!-- Cúpula Dupla Foco Cirúrgico LED -->
        @case ('cli_foco_cirurgico_teto_led') {
          <g class="ambient-pulse">
            <!-- Braço articulado do teto -->
            <line x1="60" y1="10" x2="60" y2="30" stroke="#94A3B8" stroke-width="4" />
            <line x1="60" y1="30" x2="42" y2="42" stroke="#64748B" stroke-width="3" />
            <line x1="60" y1="30" x2="78" y2="42" stroke="#64748B" stroke-width="3" />
            <!-- Cúpula Maior LED 100.000 Lux -->
            <ellipse cx="40" cy="46" rx="18" ry="8" fill="#F8FAFC" stroke="#0D9488" stroke-width="2" />
            <ellipse cx="40" cy="46" rx="14" ry="5.5" fill="#FEF08A" />
            <circle cx="36" cy="46" r="1.5" fill="#FFFFFF" />
            <circle cx="44" cy="46" r="1.5" fill="#FFFFFF" />
            <!-- Cúpula Menor LED Satélite -->
            <ellipse cx="78" cy="48" rx="14" ry="6" fill="#F8FAFC" stroke="#0D9488" stroke-width="2" />
            <ellipse cx="78" cy="48" rx="10" ry="4" fill="#FEF08A" />
            <circle cx="78" cy="48" r="1.5" fill="#FFFFFF" />
            <!-- Feixes cônicos de iluminação pura cirúrgica -->
            <polygon points="40,54 20,85 60,85" fill="rgba(254,240,138,0.25)" />
            <polygon points="78,54 64,85 92,85" fill="rgba(254,240,138,0.25)" />
          </g>
        }

        <!-- Mini Espectrômetro de Massa Clínico -->
        @case ('cli_espectrometro_massa_mini') {
          <g>
            <ellipse cx="60" cy="86" rx="34" ry="11" fill="rgba(0,0,0,0.18)" />
            <polygon points="26,56 60,38 94,56 60,74" fill="#1E293B" stroke="#0284C7" stroke-width="2" />
            <polygon points="26,56 60,74 60,84 26,66" fill="#0F172A" stroke="#0284C7" stroke-width="1.5" />
            <polygon points="94,56 60,74 60,84 94,66" fill="#020617" stroke="#0284C7" stroke-width="1.5" />
            <!-- Câmara de ionização a vácuo com anel cromado -->
            <circle cx="46" cy="54" r="8" fill="#334155" stroke="#38BDF8" stroke-width="1.5" />
            <!-- Display de cromatograma e picos moleculares -->
            <rect x="62" y="44" width="24" height="16" rx="2" fill="#0F172A" stroke="#38BDF8" stroke-width="1" />
            <path d="M64 56 L68 56 L71 47 L74 56 L78 51 L82 56 L84 56" stroke="#22C55E" stroke-width="1.5" fill="none" />
          </g>
        }

        <!-- Ventilador Mecânico Inteligente AI -->
        @case ('cli_ventilador_pulmonar_ia') {
          <g class="ambient-pulse">
            <ellipse cx="60" cy="85" rx="18" ry="7" fill="rgba(0,0,0,0.15)" />
            <rect x="42" y="44" width="36" height="38" rx="6" fill="#F8FAFC" stroke="#0284C7" stroke-width="2" />
            <!-- Monitor touch de curvas de pressão/fluxo -->
            <rect x="45" y="48" width="30" height="18" rx="3" fill="#0F172A" />
            <path d="M47 56 Q52 50 56 62 T66 56 T72 58" stroke="#38BDF8" stroke-width="1.5" fill="none" />
            <!-- Traqueias respiratórias duplas (ramo insp/exp) -->
            <path d="M46 72 Q36 78 40 84" stroke="#0284C7" stroke-width="2.5" fill="none" />
            <path d="M74 72 Q84 78 80 84" stroke="#06B6D4" stroke-width="2.5" fill="none" />
          </g>
        }

        <!-- Centrífuga Bioquímica de Alta Rotação -->
        @case ('cli_centrifuga_plasma_rico') {
          <g>
            <ellipse cx="60" cy="84" rx="22" ry="9" fill="rgba(0,0,0,0.18)" />
            <!-- Corpo cilíndrico aerodinâmico em inox -->
            <ellipse cx="60" cy="62" rx="24" ry="12" fill="#F8FAFC" stroke="#64748B" stroke-width="2" />
            <rect x="36" y="62" width="48" height="18" fill="#E2E8F0" />
            <ellipse cx="60" cy="80" rx="24" ry="10" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5" />
            <!-- Tampa circular com visor de acrílico -->
            <ellipse cx="60" cy="62" rx="16" ry="8" fill="#1E293B" stroke="#0284C7" stroke-width="1.5" />
            <!-- Tubinhos rodando na centrífuga -->
            <circle cx="54" cy="60" r="1.5" fill="#EF4444" />
            <circle cx="66" cy="64" r="1.5" fill="#EF4444" />
            <circle cx="60" cy="62" r="2" fill="#F59E0B" />
          </g>
        }

        <!-- Torre de Vídeo-Endoscopia 4K HDR -->
        @case ('cli_endoscopio_flexivel_4k') {
          <g>
            <ellipse cx="60" cy="86" rx="32" ry="11" fill="rgba(0,0,0,0.18)" />
            <!-- Carrinho rack vertical com rodas -->
            <rect x="34" y="40" width="52" height="44" rx="4" fill="#334155" stroke="#0F172A" stroke-width="2" />
            <!-- Monitor 4K no topo ajustável -->
            <rect x="32" y="18" width="56" height="26" rx="3" fill="#0F172A" stroke="#0284C7" stroke-width="2" />
            <rect x="35" y="21" width="50" height="20" fill="#0369A1" />
            <!-- Tubo endoscópico flexível com fibra óptica pendurado -->
            <path d="M84 46 Q94 60 86 78" stroke="#1E293B" stroke-width="3" fill="none" />
            <circle cx="86" cy="78" r="2" fill="#38BDF8" />
          </g>
        }

        <!-- Console de Crioablação Dermatológica -->
        @case ('cli_crioablativo_nitrogenio') {
          <g>
            <ellipse cx="60" cy="84" rx="20" ry="8" fill="rgba(0,0,0,0.15)" />
            <!-- Tanque criogênico de nitrogênio líquido térmico -->
            <rect x="44" y="44" width="32" height="36" rx="6" fill="#F1F5F9" stroke="#0284C7" stroke-width="2" />
            <!-- Válvula de pressão manométrica -->
            <circle cx="60" cy="52" r="5" fill="#E2E8F0" stroke="#0284C7" stroke-width="1.5" />
            <line x1="60" y1="52" x2="63" y2="50" stroke="#EF4444" stroke-width="1" />
            <!-- Mangueira flexível com pistola de aplicação ultrafina -->
            <path d="M72 60 Q84 66 82 74" stroke="#64748B" stroke-width="2.5" fill="none" />
            <polygon points="82,74 86,76 80,78" fill="#38BDF8" />
          </g>
        }

        <!-- Ressonância Magnética 3T com LED RGB -->
        @case ('cli_ressonancia_3t_compacta') {
          <g class="ambient-pulse">
            <ellipse cx="60" cy="88" rx="48" ry="16" fill="rgba(0,0,0,0.25)" />
            <!-- Túnel magnético gantry com LED circular -->
            <ellipse cx="60" cy="52" rx="42" ry="24" fill="#F8FAFC" stroke="#0284C7" stroke-width="3" />
            <ellipse cx="60" cy="52" rx="26" ry="15" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5" />
            <ellipse cx="60" cy="52" rx="16" ry="9" fill="#0369A1" />
            <!-- Mesa motorizada que desliza no gantry -->
            <polygon points="34,74 60,62 86,74 60,86" fill="#E2E8F0" stroke="#0284C7" stroke-width="1.8" />
          </g>
        }

        <!-- Console Robótico Telecirúrgico 4-Braços -->
        @case ('cli_robo_cirurgico_quatro_bracos') {
          <g>
            <ellipse cx="60" cy="88" rx="38" ry="14" fill="rgba(0,0,0,0.2)" />
            <!-- Coluna mestra de titânio -->
            <rect x="52" y="44" width="16" height="38" rx="4" fill="#334155" stroke="#0284C7" stroke-width="2" />
            <!-- 4 braços mecânicos multi-articulados com micro-pinças -->
            <path d="M52 50 Q34 40 30 52 L36 60" stroke="#0284C7" stroke-width="2.5" fill="none" />
            <path d="M52 64 Q32 60 26 70 L34 76" stroke="#0284C7" stroke-width="2.5" fill="none" />
            <path d="M68 50 Q86 40 90 52 L84 60" stroke="#0284C7" stroke-width="2.5" fill="none" />
            <path d="M68 64 Q88 60 94 70 L86 76" stroke="#0284C7" stroke-width="2.5" fill="none" />
            <!-- Visor 3D estéreo do cirurgião no topo -->
            <rect x="46" y="28" width="28" height="16" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1.8" />
            <circle cx="54" cy="36" r="3" fill="#38BDF8" />
            <circle cx="66" cy="36" r="3" fill="#38BDF8" />
          </g>
        }

        <!-- Câmara Hiperbárica Monoplace Dourada -->
        @case ('cli_camara_hiperbarica_ouro') {
          <g>
            <ellipse cx="60" cy="88" rx="44" ry="14" fill="rgba(0,0,0,0.2)" />
            <!-- Suportes e berço de ouro 24k -->
            <line x1="26" y1="76" x2="26" y2="86" stroke="#D97706" stroke-width="4" />
            <line x1="94" y1="76" x2="94" y2="86" stroke="#D97706" stroke-width="4" />
            <!-- Cilindro de acrílico e anéis de liga aeroespacial dourada -->
            <polygon points="22,64 60,46 98,64 60,82" fill="rgba(56,189,248,0.4)" stroke="#F59E0B" stroke-width="2.5" />
            <!-- Maca interna com paciente confortável -->
            <ellipse cx="60" cy="64" rx="30" ry="9" fill="#FFFFFF" opacity="0.85" />
            <!-- Console de controle com válvulas e monitor de O2 -->
            <rect x="88" y="48" width="14" height="20" rx="3" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5" />
            <circle cx="95" cy="56" r="3" fill="#10B981" />
          </g>
        }

        <!-- Poltrona Egg em Veludo Azul Marinho -->
        @case ('rec_poltrona_egg_veludo_azul') {
          <g>
            <ellipse cx="60" cy="85" rx="22" ry="9" fill="rgba(0,0,0,0.18)" />
            <!-- Base giratória cromada 4 pontas -->
            <line x1="60" y1="74" x2="60" y2="82" stroke="#CBD5E1" stroke-width="3" />
            <!-- Concha icônica da Poltrona Egg em veludo nobre -->
            <path d="M38 52 C34 32 46 22 60 22 C74 22 86 32 82 52 C80 68 74 76 60 76 C46 76 40 68 38 52 Z" fill="#1E3A8A" stroke="#1D4ED8" stroke-width="2" />
            <!-- Almofada interna fofa e acolhedora -->
            <ellipse cx="60" cy="62" rx="14" ry="8" fill="#1E40AF" />
            <path d="M46 50 Q60 40 74 50" stroke="#3B82F6" stroke-width="1.5" fill="none" opacity="0.6" />
          </g>
        }

        <!-- Totem de Recepção com Reconhecimento -->
        @case ('rec_totem_checkin_facial') {
          <g>
            <ellipse cx="60" cy="85" rx="18" ry="7" fill="rgba(0,0,0,0.15)" />
            <!-- Totem fino vertical futurista -->
            <rect x="52" y="28" width="16" height="54" rx="4" fill="#0F172A" stroke="#0284C7" stroke-width="2" />
            <!-- Câmera biométrica no topo -->
            <circle cx="60" cy="34" r="2" fill="#38BDF8" />
            <!-- Tela touch vertical com interface médica -->
            <rect x="54" y="38" width="12" height="24" rx="2" fill="#0369A1" />
            <line x1="56" y1="44" x2="64" y2="44" stroke="#FFFFFF" stroke-width="1" />
            <line x1="56" y1="48" x2="64" y2="48" stroke="#FFFFFF" stroke-width="1" />
            <!-- Slot de emissão de crachá e leitor de QR Code -->
            <line x1="55" y1="68" x2="65" y2="68" stroke="#10B981" stroke-width="1.5" />
          </g>
        }

        <!-- Fonte Shishi-Odoshi Bambu Zen -->
        @case ('rec_fonte_bambu_shishi_odoshi') {
          <g>
            <ellipse cx="60" cy="86" rx="26" ry="10" fill="rgba(0,0,0,0.15)" />
            <!-- Bacia de pedra polida com água límpida -->
            <ellipse cx="60" cy="78" rx="22" ry="9" fill="#475569" stroke="#334155" stroke-width="2" />
            <ellipse cx="60" cy="77" rx="18" ry="7" fill="#0284C7" opacity="0.75" />
            <!-- Tubo de bambu basculante -->
            <line x1="48" y1="62" x2="66" y2="74" stroke="#15803D" stroke-width="4" stroke-linecap="round" />
            <line x1="58" y1="56" x2="58" y2="76" stroke="#166534" stroke-width="3" />
            <!-- Filete de água cristalina caindo -->
            <line x1="66" y1="74" x2="66" y2="78" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" />
          </g>
        }

        <!-- Vitrola Vinil Acústica Lo-Fi -->
        @case ('rec_vitrola_vinil_terapia') {
          <g>
            <ellipse cx="60" cy="86" rx="24" ry="9" fill="rgba(0,0,0,0.15)" />
            <!-- Gabinete de madeira nobre envernizada -->
            <polygon points="36,60 60,48 84,60 60,72" fill="#92400E" stroke="#78350F" stroke-width="2" />
            <polygon points="36,60 60,72 60,80 36,68" fill="#78350F" />
            <polygon points="84,60 60,72 60,80 84,68" fill="#451A03" />
            <!-- Disco de vinil preto girando -->
            <ellipse cx="58" cy="58" rx="12" ry="6" fill="#0F172A" stroke="#334155" stroke-width="1" />
            <circle cx="58" cy="58" r="3" fill="#DC2626" />
            <!-- Corneta acústica de latão brilhante -->
            <path d="M68 56 Q76 46 84 34" stroke="#F59E0B" stroke-width="3" fill="none" />
            <ellipse cx="86" cy="32" rx="8" ry="12" fill="#FBBF24" stroke="#D97706" stroke-width="1.5" />
          </g>
        }

        <!-- Cafeteira de Pistão Ouro & Cobre -->
        @case ('rec_cafeteira_pistao_ouro') {
          <g>
            <ellipse cx="60" cy="85" rx="22" ry="8" fill="rgba(0,0,0,0.15)" />
            <!-- Base da máquina de espresso em cobre reluzente -->
            <rect x="42" y="52" width="36" height="28" rx="4" fill="#B45309" stroke="#78350F" stroke-width="2" />
            <!-- Caldeira cilíndrica de latão com manômetro -->
            <rect x="48" y="32" width="24" height="22" rx="4" fill="#FBBF24" stroke="#D97706" stroke-width="1.8" />
            <circle cx="60" cy="40" r="3" fill="#FFFFFF" stroke="#000000" stroke-width="0.8" />
            <!-- Alavanca de pistão manual vertical -->
            <line x1="60" y1="32" x2="60" y2="18" stroke="#D97706" stroke-width="2.5" />
            <circle cx="60" cy="16" r="3.5" fill="#78350F" />
            <!-- Xícara de espresso fumegante -->
            <rect x="56" y="68" width="8" height="6" rx="1.5" fill="#FFFFFF" />
          </g>
        }

        <!-- Sofá Curvo Ilha Bouclê Areia -->
        @case ('rec_sofa_curvo_organico') {
          <g>
            <ellipse cx="60" cy="88" rx="46" ry="16" fill="rgba(0,0,0,0.15)" />
            <!-- Estrutura sinuosa orgânica do sofá em forma de rim -->
            <path d="M20 72 C16 54 36 44 60 48 C84 44 104 54 100 72 C96 86 76 90 60 86 C44 90 24 86 20 72 Z" fill="#F5F5F4" stroke="#D6D3D1" stroke-width="2.5" />
            <!-- Almofadas de encosto com costura suave -->
            <path d="M30 64 Q60 52 90 64" stroke="#E7E5E4" stroke-width="3" fill="none" />
            <!-- Almofada decorativa de veludo verde sálvia -->
            <ellipse cx="44" cy="68" rx="6" ry="4" fill="#84CC16" />
            <ellipse cx="76" cy="68" rx="6" ry="4" fill="#F97316" />
          </g>
        }

        <!-- Jardim Vertical Hidropônico Iluminado -->
        @case ('rec_jardim_vertical_hidroponico') {
          <g>
            <!-- Painel de parede com moldura de carvalho -->
            <rect x="26" y="24" width="68" height="68" rx="6" fill="#1C1917" stroke="#78350F" stroke-width="2.5" />
            <!-- Bolsões hidropônicos com folhagens exuberantes (samambaias, filodendros) -->
            <circle cx="40" cy="38" r="10" fill="#15803D" />
            <circle cx="60" cy="34" r="12" fill="#22C55E" />
            <circle cx="80" cy="38" r="10" fill="#16A34A" />
            <circle cx="48" cy="54" r="11" fill="#166534" />
            <circle cx="72" cy="54" r="11" fill="#4ADE80" />
            <circle cx="38" cy="70" r="10" fill="#15803D" />
            <circle cx="60" cy="72" r="12" fill="#22C55E" />
            <circle cx="82" cy="70" r="10" fill="#16A34A" />
            <!-- Fita LED de crescimento fotossintético no topo -->
            <line x1="30" y1="28" x2="90" y2="28" stroke="#F472B6" stroke-width="2" opacity="0.9" />
          </g>
        }

        <!-- Husky Terapêutico Dr. Neve -->
        @case ('rec_mascote_husky_dr_neve') {
          <g class="ambient-bob">
            <ellipse cx="60" cy="85" rx="22" ry="9" fill="rgba(0,0,0,0.18)" />
            <!-- Corpo peludo do cãozinho deitado feliz -->
            <ellipse cx="60" cy="74" rx="16" ry="9" fill="#94A3B8" />
            <ellipse cx="60" cy="75" rx="13" ry="7" fill="#F8FAFC" />
            <!-- Patas brancas dianteiras -->
            <ellipse cx="48" cy="80" rx="3" ry="2" fill="#FFFFFF" />
            <ellipse cx="72" cy="80" rx="3" ry="2" fill="#FFFFFF" />
            <!-- Cabeça com máscara clássica de Husky -->
            <circle cx="60" cy="56" r="10" fill="#475569" />
            <circle cx="60" cy="58" r="8" fill="#FFFFFF" />
            <!-- Orelhas pontudas com interior rosa -->
            <polygon points="52,48 48,36 56,44" fill="#475569" />
            <polygon points="52,46 49,38 55,44" fill="#FDA4AF" />
            <polygon points="68,48 72,36 64,44" fill="#475569" />
            <polygon points="68,46 71,38 65,44" fill="#FDA4AF" />
            <!-- Olhos azuis gélidos e focinho fofo -->
            <circle cx="56" cy="56" r="1.5" fill="#38BDF8" />
            <circle cx="64" cy="56" r="1.5" fill="#38BDF8" />
            <ellipse cx="60" cy="62" rx="2" ry="1.2" fill="#0F172A" />
            <!-- Bandana médica azul com cruz de apoio -->
            <polygon points="52,66 60,74 68,66" fill="#0284C7" />
            <circle cx="60" cy="69" r="1" fill="#FFFFFF" />
          </g>
        }

        <!-- Gato Persa Branco Dr. Algodão -->
        @case ('rec_mascote_gato_persa_angoror') {
          <g class="ambient-bob">
            <ellipse cx="60" cy="86" rx="22" ry="9" fill="rgba(0,0,0,0.18)" />
            <!-- Almofada de veludo esmeralda onde o gatinho descansa -->
            <ellipse cx="60" cy="80" rx="24" ry="10" fill="#0D9488" stroke="#0F766E" stroke-width="1.8" />
            <!-- Corpo peludo branquinho macio como nuvem -->
            <circle cx="60" cy="70" r="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
            <!-- Cabeça arredondada com bochechas volumosas -->
            <circle cx="60" cy="58" r="9" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
            <!-- Orelhinhas triangulares rosadas -->
            <polygon points="53,52 50,44 56,48" fill="#FBCFE8" />
            <polygon points="67,52 70,44 64,48" fill="#FBCFE8" />
            <!-- Olhinhos amendoados verdes e narizinho rosa -->
            <ellipse cx="56" cy="58" rx="1.5" ry="1" fill="#22C55E" />
            <ellipse cx="64" cy="58" rx="1.5" ry="1" fill="#22C55E" />
            <circle cx="60" cy="61" r="0.8" fill="#F472B6" />
            <!-- Mini estetoscópio de brinquedo no pescoço -->
            <path d="M54 64 Q60 68 66 64" stroke="#F59E0B" stroke-width="1.2" fill="none" />
            <circle cx="60" cy="67" r="1.2" fill="#F59E0B" />
          </g>
        }

        <!-- Mega Aquário Recife 360° com Corais -->
        @case ('rec_aquario_recife_coral_gigante') {
          <g class="ambient-bob">
            <ellipse cx="60" cy="88" rx="46" ry="16" fill="rgba(0,0,0,0.22)" />
            <!-- Base redonda de mármore e latão -->
            <ellipse cx="60" cy="80" rx="42" ry="14" fill="#0F172A" stroke="#F59E0B" stroke-width="2.5" />
            <!-- Tanque 360 graus de água cristalina azul caribenho -->
            <ellipse cx="60" cy="46" rx="36" ry="12" fill="#38BDF8" stroke="#0284C7" stroke-width="2" />
            <rect x="24" y="46" width="72" height="34" fill="rgba(2,132,199,0.4)" stroke="#0284C7" stroke-width="2" />
            <!-- Recifes de corais coloridos no centro -->
            <path d="M48 76 Q54 62 60 76 Q66 60 72 76" fill="#F43F5E" />
            <circle cx="48" cy="68" r="4" fill="#F97316" />
            <circle cx="70" cy="66" r="4" fill="#8B5CF6" />
            <!-- Peixinho palhaço laranja e azul cirurgião -->
            <polygon points="40,56 36,53 36,59" fill="#F97316" />
            <circle cx="42" cy="56" r="2.5" fill="#F97316" />
            <polygon points="76,52 80,49 80,55" fill="#2563EB" />
            <circle cx="74" cy="52" r="2.5" fill="#2563EB" />
          </g>
        }

        <!-- Harpa Cristalina Autotocável -->
        @case ('rec_harpa_automatica_cristal') {
          <g class="ambient-pulse">
            <ellipse cx="60" cy="86" rx="32" ry="11" fill="rgba(0,0,0,0.18)" />
            <!-- Base de cristal lapidado com iluminação interior -->
            <polygon points="34,70 60,58 86,70 60,82" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2" />
            <!-- Coluna curvada e consolo da harpa clássica -->
            <path d="M38 72 C36 40 46 24 72 24 C78 24 82 28 78 34 C64 40 58 60 56 74 Z" fill="rgba(186,230,253,0.6)" stroke="#0284C7" stroke-width="2" />
            <!-- Cordas musicais que vibram e brilham -->
            <line x1="48" y1="36" x2="44" y2="72" stroke="#FACC15" stroke-width="0.9" />
            <line x1="53" y1="34" x2="48" y2="72" stroke="#38BDF8" stroke-width="0.9" />
            <line x1="58" y1="32" x2="52" y2="72" stroke="#FACC15" stroke-width="0.9" />
            <line x1="63" y1="30" x2="56" y2="72" stroke="#38BDF8" stroke-width="0.9" />
            <line x1="68" y1="28" x2="60" y2="72" stroke="#FACC15" stroke-width="0.9" />
            <circle cx="74" cy="22" r="2.5" fill="#FACC15" />
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
