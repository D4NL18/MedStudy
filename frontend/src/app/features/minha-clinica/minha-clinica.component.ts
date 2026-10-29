import {
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CLINIC_CATALOG_FALLBACK,
  CLINIC_EXPANSION_LEVELS,
  ClinicCatalogItem,
  ClinicCategory,
  ClinicPlacedItem,
  PlacementType,
  DoctorAvatar,
  DoctorGender,
  ItemRarity,
  LOOTBOX_TIERS_FALLBACK,
  LootboxOpenResult,
  LootboxTier,
  LootboxTierInfo,
  RARITY_CONFIG,
  StudyActionType,
  getItemRarity
} from '@core/models/clinic.model';
import { ClinicService } from '@core/services/clinic.service';
import { ClinicAudioService } from '@core/services/clinic-audio.service';
import { ClinicViewportComponent } from './components/clinic-viewport/clinic-viewport.component';
import { ClinicItemSvgComponent } from './components/clinic-item-svg/clinic-item-svg.component';
import { DoctorAvatarSvgComponent } from './components/doctor-avatar-svg/doctor-avatar-svg.component';
import { XpRewardToastComponent } from '@shared/components/xp-reward-toast/xp-reward-toast.component';

interface CategoryTabMeta {
  id: ClinicCategory;
  label: string;
  count: number;
  badge: string;
}

/**
 * Página principal da feature "Minha Clínica Médica" (Gamificação Isométrica 2.5D & Motor de XP — P-080 a P-086).
 * Segue estritamente o DESIGN_SYSTEM.md, a macroestrutura Interactive Isometric Workbench e os 8 estados interativos.
 */
@Component({
  selector: 'app-minha-clinica',
  standalone: true,
  imports: [
    CommonModule,
    ClinicViewportComponent,
    ClinicItemSvgComponent,
    DoctorAvatarSvgComponent,
    XpRewardToastComponent
  ],
  template: `
    <section class="clinic-workbench" aria-label="Minha Clínica Médica Isométrica 2.5D">
      <!-- ESTADO 5: LOADING (Skeleton Loader Isométrico Shimmer — Zero Spinners Solitários) -->
      @if (clinicService.loading() && !clinic()) {
        <div class="clinic-skeleton-container" data-testid="clinic-skeleton" aria-busy="true">
          <div class="skeleton-hud shimmer-block"></div>
          <div class="skeleton-viewport">
            <div class="skeleton-iso-diamond shimmer-block"></div>
            <p class="skeleton-caption">Preparando o diorama 2.5D da sua Clínica Médica...</p>
          </div>
          <div class="skeleton-dock">
            <div class="skeleton-card shimmer-block"></div>
            <div class="skeleton-card shimmer-block"></div>
            <div class="skeleton-card shimmer-block"></div>
            <div class="skeleton-card shimmer-block"></div>
          </div>
        </div>
      } @else if (clinic(); as state) {
        <!-- HUD SUPERIOR FLUTUANTE (Nível, XP Vitalício, Saldo Investível, Streak, Expansão e Áudio) -->
        <header class="clinic-hud-bar" data-testid="clinic-hud">
          <div class="hud-identity">
            <div class="level-badge" data-testid="clinic-level-badge">
              <span class="level-num">NÍVEL {{ state.expansionLevel }}/6</span>
              <span class="level-grid">{{ state.gridWidth }}×{{ state.gridHeight }}</span>
            </div>
            <div class="clinic-titles">
              <h1>{{ state.expansionName }}</h1>
              <div class="lifetime-progress-wrap" title="XP Vitalício acumulado (nunca decresce)">
                <div class="lifetime-labels">
                  <span>XP Vitalício (Carreira)</span>
                  <span class="mono-num" data-testid="lifetime-xp-value">
                    {{ state.lifetimeXp }}
                    @if (state.nextExpansionRequiredLifetimeXp) {
                      / {{ state.nextExpansionRequiredLifetimeXp }} XP
                    }
                  </span>
                </div>
                <div class="lifetime-bar-track">
                  <div
                    class="lifetime-bar-fill"
                    [style.width.%]="lifetimeProgressPercent()"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicadores Econômicos Auditáveis (P-080, P-081) -->
          <div class="hud-economy">
            <div
              class="xp-balance-pill"
              title="Saldo de XP Investível para decorar e expandir sua clínica"
              data-testid="current-xp-pill"
            >
              <span class="pill-tag">SALDO INVESTÍVEL</span>
              <strong class="mono-num">{{ state.currentXp }} XP</strong>
            </div>

            <div
              class="streak-pill"
              title="Multiplicador de Ofensiva Diária sobre todo o XP ganho"
              data-testid="streak-pill"
            >
              <span class="streak-fire" aria-hidden="true">🔥</span>
              <div class="streak-meta">
                <strong class="mono-num">{{ state.currentStreakDays }} dias</strong>
                <span>+{{ state.streakMultiplierPercent }}% bônus XP</span>
              </div>
            </div>
          </div>

          <!-- Ações Principais do HUD -->
          <div class="hud-actions">
            @if (state.nextExpansionLevel) {
              <button
                type="button"
                class="btn-expand-clinic"
                [disabled]="!canExpandNow() || clinicService.loading()"
                (click)="expandClinicRoom()"
                [title]="expandButtonTooltip()"
                data-testid="expand-clinic-btn"
              >
                <span class="btn-title">
                  Expandir → Nível {{ state.nextExpansionLevel }} ({{ state.nextExpansionName }})
                </span>
                <span class="btn-sub mono-num">
                  Custo: {{ state.nextExpansionCostXp }} XP · Req: {{ state.nextExpansionRequiredLifetimeXp }} Vitalício
                </span>
              </button>
            } @else {
              <div class="max-level-pill">🏆 Instituto Nível Máximo (16×12)</div>
            }

            <button
              type="button"
              class="btn-avatar-modal"
              (click)="openAvatarCustomizer()"
              [title]="'Personalizar visual de ' + doctorDisplayName()"
              data-testid="open-avatar-modal-btn"
            >
              {{ currentAvatar()?.gender === 'FEMALE' ? '👩‍⚕️' : '👨‍⚕️' }} {{ doctorDisplayName() }}
            </button>

            <button
              type="button"
              class="btn-lootbox-modal"
              (click)="openLootboxModal()"
              title="Abrir Caixas da Sorte Médicas e resgatar caixa diária gratuita"
              data-testid="open-lootbox-modal-btn"
            >
              🎁 Caixas da Sorte
              @if (isDailyFreeAvailable()) {
                <span class="free-daily-dot" title="Caixa gratuita disponível hoje!">★ Grátis</span>
              }
            </button>

            <button
              type="button"
              class="btn-edit-toggle"
              [class.is-active]="editMode()"
              (click)="toggleEditMode()"
              data-testid="toggle-edit-mode-btn"
            >
              {{ editMode() ? '✓ Concluir Edição' : '🛠️ Decorar / Mover' }}
            </button>

            @if (isLayoutDirty()) {
              <button
                type="button"
                class="btn-save-layout"
                [disabled]="clinicService.loading()"
                (click)="saveCurrentLayout()"
                data-testid="save-layout-btn"
              >
                💾 Salvar Layout
              </button>
            }

            <button
              type="button"
              class="btn-audio-mute"
              (click)="toggleAudioMute()"
              [attr.aria-pressed]="audioService.isMuted()"
              [title]="audioService.isMuted() ? 'Ativar áudio cozy da clínica' : 'Silenciar áudio da clínica'"
              data-testid="mute-audio-btn"
            >
              {{ audioService.isMuted() ? '🔇 Mudo' : '🔊 Som' }}
            </button>
          </div>
        </header>

        <!-- ESTADO 7: ERROR STATE BANNER (Quando há falha de validação ou saldo insuficiente) -->
        @if (clinicService.error() || localError()) {
          <div class="clinic-error-banner" role="alert" data-testid="clinic-error-banner">
            <span>⚠️ {{ localError() || clinicService.error() }}</span>
            <button type="button" class="btn-dismiss-error" (click)="clearErrors()">
              Entendi
            </button>
          </div>
        }

        <!-- VIEWPORT ISOMÉTRICO 2.5D CENTRAL (P-084, P-085, P-087) -->
        <div class="clinic-stage-wrapper">
          <app-clinic-viewport
            [gridWidth]="state.gridWidth"
            [gridHeight]="state.gridHeight"
            [expansionLevel]="state.expansionLevel"
            [wallTheme]="state.wallTheme"
            [floorTheme]="state.floorTheme"
            [avatar]="currentAvatar()"
            [placedItems]="workingPlacedItems()"
            [catalog]="state.catalog"
            [editMode]="editMode()"
            [selectedCatalogItem]="selectedCatalogItem()"
            [selectedRotation]="selectedRotation()"
            [movingPlacedId]="movingPlacedId()"
            (tileClicked)="onViewportTileClicked($event)"
            (placedItemClicked)="onViewportPlacedItemClicked($event)"
            (rotateRequested)="toggleRotation()"
            (avatarClicked)="openAvatarCustomizer()"
          />
        </div>

        <!-- BARRA INFERIOR DESLIZANTE (4 ABAS OFICIAIS: PEDIATRIA, MÓVEIS, EQUIPAMENTOS, CONFORTO) -->
        <section class="clinic-bottom-dock" aria-label="Loja e Inventário da Clínica">
          <div class="dock-header">
            <div class="dock-tabs" role="tablist" aria-label="Categorias de itens da clínica">
              @for (tab of categoryTabs(); track tab.id) {
                <button
                  type="button"
                  role="tab"
                  class="dock-tab-btn"
                  [class.is-active]="activeCategory() === tab.id"
                  [attr.aria-selected]="activeCategory() === tab.id"
                  (click)="selectCategory(tab.id)"
                  [attr.data-testid]="'tab-' + tab.id"
                >
                  <span>{{ tab.badge }} {{ tab.label }}</span>
                  <span class="tab-count mono-num">{{ tab.count }}</span>
                </button>
              }
            </div>

            <div class="dock-controls">
              <div class="filter-switch" role="group" aria-label="Filtro de catálogo">
                <button
                  type="button"
                  class="filter-btn"
                  [class.active]="inventoryFilter() === 'all'"
                  (click)="setInventoryFilter('all')"
                  data-testid="filter-all-btn"
                >
                  Catálogo ({{ totalCatalogCount() }})
                </button>
                <button
                  type="button"
                  class="filter-btn"
                  [class.active]="inventoryFilter() === 'owned'"
                  (click)="setInventoryFilter('owned')"
                  data-testid="filter-owned-btn"
                >
                  Meus Itens ({{ state.ownedItemIds.length }})
                </button>
              </div>

              @if (editMode() && selectedCatalogItem()) {
                <button
                  type="button"
                  class="btn-dock-tool"
                  (click)="toggleRotation()"
                  data-testid="dock-rotate-btn"
                >
                  ↻ Girar ({{ selectedRotation() === 1 ? 'SW' : 'SE' }}) [R]
                </button>
              }

              @if (editMode() && movingPlacedId()) {
                <button
                  type="button"
                  class="btn-dock-tool danger"
                  (click)="storeSelectedPlacedItem()"
                  data-testid="store-item-btn"
                >
                  📦 Guardar no Inventário
                </button>
              }
            </div>
          </div>

          <!-- ABA REVESTIMENTOS: Papéis de Parede e Pisos Isométricos (P-087) -->
          @if (activeCategory() === 'revestimentos') {
            <div class="dock-cards-grid dock-surfaces-grid" data-testid="dock-surfaces-grid">
              @for (wall of wallpaperOptions; track wall.id) {
                <article
                  class="catalog-item-card surface-card"
                  [class.is-placed]="state.wallTheme === wall.id"
                  [class.is-owned]="isSurfaceOwned(wall.id)"
                  [attr.data-testid]="'surface-wall-card-' + wall.id"
                >
                  <div class="card-top-badges">
                    <span class="rarity-badge" style="background-color: #0D9488;">Parede</span>
                    @if (state.wallTheme === wall.id) {
                      <span class="placed-badge">✓ Em Uso</span>
                    } @else if (isSurfaceOwned(wall.id)) {
                      <span class="owned-badge">Adquirido</span>
                    }
                  </div>

                  <div class="card-surface-swatch" [style.background]="wall.previewColor">
                    @if (wall.id === 'ped_papel_safari') {
                      <span class="swatch-emoji">🦒🌿</span>
                    } @else if (wall.id === 'wallpaper_geometric_teal') {
                      <span class="swatch-emoji">📐</span>
                    } @else if (wall.id === 'wallpaper_brick_white') {
                      <span class="swatch-emoji">🧱</span>
                    } @else {
                      <span class="swatch-emoji">🏛️</span>
                    }
                  </div>

                  <div class="card-info">
                    <h4>{{ wall.name }}</h4>
                    <p>Papel de Parede NW/NE</p>
                  </div>

                  <div class="card-footer">
                    @if (state.wallTheme === wall.id) {
                      <button type="button" class="btn-card-action place active" disabled>
                        ✓ Aplicado
                      </button>
                    } @else if (isSurfaceOwned(wall.id)) {
                      <button
                        type="button"
                        class="btn-card-action place"
                        (click)="applyWallpaperDirectly(wall.id)"
                        [attr.data-testid]="'apply-wall-' + wall.id"
                      >
                        Aplicar na Sala
                      </button>
                    } @else {
                      <button
                        type="button"
                        class="btn-card-action buy"
                        [disabled]="state.currentXp < wall.costXp || clinicService.loading()"
                        (click)="buyAndApplyWallpaper(wall)"
                        [attr.data-testid]="'buy-wall-' + wall.id"
                      >
                        <span>Comprar</span>
                        <strong class="mono-num">{{ wall.costXp }} XP</strong>
                      </button>
                    }
                  </div>
                </article>
              }

              @for (fl of floorOptions; track fl.id) {
                <article
                  class="catalog-item-card surface-card"
                  [class.is-placed]="state.floorTheme === fl.id"
                  [class.is-owned]="isSurfaceOwned(fl.id)"
                  [attr.data-testid]="'surface-floor-card-' + fl.id"
                >
                  <div class="card-top-badges">
                    <span class="rarity-badge" style="background-color: #0284C7;">Piso</span>
                    @if (state.floorTheme === fl.id) {
                      <span class="placed-badge">✓ Em Uso</span>
                    } @else if (isSurfaceOwned(fl.id)) {
                      <span class="owned-badge">Adquirido</span>
                    }
                  </div>

                  <div class="card-surface-swatch" [style.background]="fl.previewColor">
                    @if (fl.id === 'tatame_eva') {
                      <span class="swatch-emoji">🧸</span>
                    } @else if (fl.id === 'marble_carrara') {
                      <span class="swatch-emoji">🏛️</span>
                    } @else {
                      <span class="swatch-emoji">🪵</span>
                    }
                  </div>

                  <div class="card-info">
                    <h4>{{ fl.name }}</h4>
                    <p>Piso Isométrico 2.5D</p>
                  </div>

                  <div class="card-footer">
                    @if (state.floorTheme === fl.id) {
                      <button type="button" class="btn-card-action place active" disabled>
                        ✓ Aplicado
                      </button>
                    } @else if (isSurfaceOwned(fl.id)) {
                      <button
                        type="button"
                        class="btn-card-action place"
                        (click)="applyFloorDirectly(fl.id)"
                        [attr.data-testid]="'apply-floor-' + fl.id"
                      >
                        Aplicar na Sala
                      </button>
                    } @else {
                      <button
                        type="button"
                        class="btn-card-action buy"
                        [disabled]="state.currentXp < fl.costXp || clinicService.loading()"
                        (click)="buyAndApplyFloor(fl)"
                        [attr.data-testid]="'buy-floor-' + fl.id"
                      >
                        <span>Comprar</span>
                        <strong class="mono-num">{{ fl.costXp }} XP</strong>
                      </button>
                    }
                  </div>
                </article>
              }
            </div>
          } @else if (filteredCatalogItems().length === 0) {
            <div class="clinic-empty-state" data-testid="clinic-empty-state">
              <div class="empty-illustration" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="52" height="52" fill="none">
                  <rect x="10" y="20" width="44" height="32" rx="6" fill="#F1F5F9" stroke="#0D9488" stroke-width="2.5" />
                  <path d="M24,20 V14 C24,11.8 25.8,10 28,10 H36 C38.2,10 40,11.8 40,14 V20" stroke="#0D9488" stroke-width="2.5" />
                  <path d="M32,28 V44 M24,36 H40" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
                </svg>
              </div>
              <div class="empty-copy">
                <h3>Nenhum item guardado nesta ala ainda</h3>
                <p>
                  Resolva questões, revise flashcards ou explore o catálogo para adquirir novos equipamentos para sua clínica.
                </p>
              </div>
              <button
                type="button"
                class="btn-empty-cta"
                (click)="setInventoryFilter('all')"
              >
                Explorar Catálogo Completo
              </button>
            </div>
          } @else {
            <!-- Grade de Cards dos Itens da Categoria Ativa -->
            <div class="dock-cards-grid" data-testid="dock-cards-grid">
              @for (item of filteredCatalogItems(); track item.id) {
                <article
                  class="catalog-item-card"
                  [class.is-owned]="isItemOwned(item.id)"
                  [class.is-placed]="isItemPlaced(item.id)"
                  [class.is-selected]="selectedCatalogItem()?.id === item.id"
                  [class.is-locked]="item.minExpansionLevel > state.expansionLevel"
                  [attr.data-testid]="'catalog-card-' + item.id"
                >
                  <div class="card-top-badges">
                    <span class="rarity-badge" [style.background-color]="getRarityColor(item)">
                      {{ getRarityLabel(item) }}
                    </span>
                    @if (item.isLootboxExclusive) {
                      <span class="exclusive-pill" title="Item exclusivo obtido apenas via Caixas da Sorte">
                        🎁 Exclusivo
                      </span>
                    }
                    <span class="footprint-badge mono-num">
                      {{ item.footprintX }}×{{ item.footprintY }}
                    </span>
                    @if (isItemPlaced(item.id)) {
                      <span class="placed-badge">No Consultório</span>
                    } @else if (isItemOwned(item.id)) {
                      <span class="owned-badge">Adquirido</span>
                    }
                  </div>

                  <div class="card-svg-preview" (click)="onCardPreviewClick(item)">
                    <app-clinic-item-svg
                      [itemKey]="item.assetSvgKey"
                      [width]="76"
                      [height]="70"
                    />
                  </div>

                  <div class="card-info">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.description }}</p>
                  </div>

                  <div class="card-footer">
                    <!-- ESTADO 8: DISABLED / LOCKED POR NÍVEL -->
                    @if (item.minExpansionLevel > state.expansionLevel) {
                      <button
                        type="button"
                        class="btn-card-action locked"
                        disabled
                        [attr.data-testid]="'locked-btn-' + item.id"
                      >
                        🔒 Requer Nível {{ item.minExpansionLevel }}
                      </button>
                    } @else if (isItemOwned(item.id)) {
                      <button
                        type="button"
                        class="btn-card-action place"
                        [class.active]="selectedCatalogItem()?.id === item.id"
                        (click)="selectItemForPlacement(item)"
                        [attr.data-testid]="'place-btn-' + item.id"
                      >
                        {{
                          selectedCatalogItem()?.id === item.id
                            ? '✓ Clique no Piso'
                            : isItemPlaced(item.id)
                              ? 'Mover no Piso'
                              : 'Posicionar no Piso'
                        }}
                      </button>
                    } @else if (item.isLootboxExclusive) {
                      <button
                        type="button"
                        class="btn-card-action lootbox"
                        (click)="openLootboxModal()"
                        [attr.data-testid]="'lootbox-btn-' + item.id"
                      >
                        <span>🎁 Caixa da Sorte</span>
                      </button>
                    } @else {
                      <button
                        type="button"
                        class="btn-card-action buy"
                        [disabled]="state.currentXp < item.costXp || clinicService.loading()"
                        (click)="buyCatalogItem(item)"
                        [attr.data-testid]="'buy-btn-' + item.id"
                      >
                        <span>Comprar</span>
                        <strong class="mono-num">{{ item.costXp }} XP</strong>
                      </button>
                    }
                  </div>
                </article>
              }
            </div>
          }
        </section>
      }

      <!-- MODAL: GUARDA-ROUPA DO DOUTOR(A) (P-087, P-088) -->
      @if (isAvatarModalOpen()) {
        <div class="clinic-modal-backdrop" (click)="closeAvatarCustomizer()" data-testid="avatar-modal-backdrop">
          <div class="clinic-modal-card avatar-modal" (click)="$event.stopPropagation()" data-testid="avatar-customizer-modal">
            <header class="modal-header">
              <div class="modal-title-group">
                <h3>{{ tempAvatarGender() === 'FEMALE' ? '👩‍⚕️' : '👨‍⚕️' }} Estilo de {{ doctorDisplayName() }}</h3>
                <p>Personalize o gênero e equipe as skins cosméticas de {{ doctorDisplayName() }}.</p>
              </div>
              <button type="button" class="btn-modal-close" (click)="closeAvatarCustomizer()" aria-label="Fechar modal">✕</button>
            </header>

            <div class="modal-body avatar-modal-grid">
              <!-- Visualização ao Vivo do Avatar -->
              <div class="avatar-live-stage">
                <app-doctor-avatar-svg
                  [gender]="tempAvatarGender()"
                  [skinCoat]="tempAvatarCoat()"
                  [skinStethoscope]="tempAvatarSteth()"
                  [skinAccessory]="tempAvatarAccessory()"
                  [width]="108"
                  [height]="148"
                  [activeAnimation]="true"
                />
                <div class="avatar-stage-tag">
                  {{ doctorDisplayName() }}
                </div>
              </div>

              <!-- Controles de Customização -->
              <div class="avatar-slots-scroll">
                <!-- 1. Gênero (Gratuito e Ilimitado) -->
                <div class="customizer-section">
                  <label class="section-label">Identidade do Médico (Alternância Gratuita)</label>
                  <div class="gender-toggle-group">
                    <button
                      type="button"
                      class="gender-btn"
                      [class.active]="tempAvatarGender() === 'MALE'"
                      (click)="setAvatarGender('MALE')"
                      data-testid="gender-male-btn"
                    >
                      👨‍⚕️ Doutor (Dr.)
                    </button>
                    <button
                      type="button"
                      class="gender-btn"
                      [class.active]="tempAvatarGender() === 'FEMALE'"
                      (click)="setAvatarGender('FEMALE')"
                      data-testid="gender-female-btn"
                    >
                      👩‍⚕️ Doutora (Dra.)
                    </button>
                  </div>
                </div>

                <!-- 2. Jaleco (Slot Coat) -->
                <div class="customizer-section">
                  <label class="section-label">Jaleco Médico</label>
                  <div class="skin-options-grid">
                    @for (coat of coatOptions; track coat.id) {
                      <div
                        class="skin-option-card"
                        [class.is-equipped]="tempAvatarCoat() === coat.id && isSkinUnlocked(coat.id)"
                        [class.is-previewing]="tempAvatarCoat() === coat.id && !isSkinUnlocked(coat.id)"
                        (click)="selectCoatSkin(coat.id)"
                        [attr.data-testid]="'skin-coat-' + coat.id"
                      >
                        <div class="skin-info">
                          <span class="skin-name">{{ coat.name }}</span>
                          <span class="skin-cost mono-num">
                            {{ coat.costXp === 0 ? 'Grátis' : isSkinUnlocked(coat.id) ? 'Desbloqueado' : coat.costXp + ' XP' }}
                          </span>
                        </div>
                        @if (!isSkinUnlocked(coat.id) && coat.costXp > 0) {
                          <div class="skin-action-group">
                            @if (tempAvatarCoat() === coat.id) {
                              <span class="preview-badge">👀 Provando</span>
                            }
                            <button
                              type="button"
                              class="btn-unlock-skin"
                              [disabled]="(clinic()?.currentXp ?? 0) < coat.costXp"
                              (click)="buySkinPrompt(coat.id, $event)"
                            >
                              🔓 Desbloquear
                            </button>
                          </div>
                        } @else {
                          <span class="equip-indicator">
                            {{ tempAvatarCoat() === coat.id ? '✓ Equipado' : 'Equipar' }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                </div>

                <!-- 3. Estetoscópio (Slot Stethoscope) -->
                <div class="customizer-section">
                  <label class="section-label">Estetoscópio</label>
                  <div class="skin-options-grid">
                    @for (steth of stethOptions; track steth.id) {
                      <div
                        class="skin-option-card"
                        [class.is-equipped]="tempAvatarSteth() === steth.id && isSkinUnlocked(steth.id)"
                        [class.is-previewing]="tempAvatarSteth() === steth.id && !isSkinUnlocked(steth.id)"
                        (click)="selectStethSkin(steth.id)"
                        [attr.data-testid]="'skin-steth-' + steth.id"
                      >
                        <div class="skin-info">
                          <span class="skin-name">{{ steth.name }}</span>
                          <span class="skin-cost mono-num">
                            {{ steth.costXp === 0 ? 'Grátis' : isSkinUnlocked(steth.id) ? 'Desbloqueado' : steth.costXp + ' XP' }}
                          </span>
                        </div>
                        @if (!isSkinUnlocked(steth.id) && steth.costXp > 0) {
                          <div class="skin-action-group">
                            @if (tempAvatarSteth() === steth.id) {
                              <span class="preview-badge">👀 Provando</span>
                            }
                            <button
                              type="button"
                              class="btn-unlock-skin"
                              [disabled]="(clinic()?.currentXp ?? 0) < steth.costXp"
                              (click)="buySkinPrompt(steth.id, $event)"
                            >
                              🔓 Desbloquear
                            </button>
                          </div>
                        } @else {
                          <span class="equip-indicator">
                            {{ tempAvatarSteth() === steth.id ? '✓ Equipado' : 'Equipar' }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                </div>

                <!-- 4. Acessórios (Slot Accessory) -->
                <div class="customizer-section">
                  <label class="section-label">Acessório</label>
                  <div class="skin-options-grid">
                    @for (acc of accessoryOptions; track acc.id) {
                      <div
                        class="skin-option-card"
                        [class.is-equipped]="tempAvatarAccessory() === acc.id && isSkinUnlocked(acc.id)"
                        [class.is-previewing]="tempAvatarAccessory() === acc.id && !isSkinUnlocked(acc.id)"
                        (click)="selectAccessorySkin(acc.id)"
                        [attr.data-testid]="'skin-acc-' + acc.id"
                      >
                        <div class="skin-info">
                          <span class="skin-name">{{ acc.name }}</span>
                          <span class="skin-cost mono-num">
                            {{ acc.costXp === 0 ? 'Grátis' : isSkinUnlocked(acc.id) ? 'Desbloqueado' : acc.costXp + ' XP' }}
                          </span>
                        </div>
                        @if (!isSkinUnlocked(acc.id) && acc.costXp > 0) {
                          <div class="skin-action-group">
                            @if (tempAvatarAccessory() === acc.id) {
                              <span class="preview-badge">👀 Provando</span>
                            }
                            <button
                              type="button"
                              class="btn-unlock-skin"
                              [disabled]="(clinic()?.currentXp ?? 0) < acc.costXp"
                              (click)="buySkinPrompt(acc.id, $event)"
                            >
                              🔓 Desbloquear
                            </button>
                          </div>
                        } @else {
                          <span class="equip-indicator">
                            {{ tempAvatarAccessory() === acc.id ? '✓ Equipado' : 'Equipar' }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <footer class="modal-footer">
              <button type="button" class="btn-modal-cancel" (click)="closeAvatarCustomizer()">Cancelar</button>
              <button
                type="button"
                class="btn-modal-save"
                [disabled]="clinicService.loading()"
                (click)="saveAvatarCustomization()"
                data-testid="save-avatar-btn"
              >
                💾 Salvar e Equipar
              </button>
            </footer>
          </div>
        </div>
      }

      <!-- MODAL DE LOOTBOXES: TEATRO TELA CHEIA (P-093, P-094, P-095) -->
      @if (isLootboxModalOpen()) {
        <div class="lootbox-fullscreen-theater" [class.unboxing-active]="isUnboxing()" data-testid="lootbox-fullscreen-theater">
          <div class="lootbox-theater-container" (click)="$event.stopPropagation()">
            <!-- FASE 1 & FASE 2: ANIMAÇÃO DE UNBOXING (1.35s) -->
            @if (isUnboxing()) {
              <div class="unboxing-stage" [style.--ray-color]="openingRayColor()">
                <div class="unboxing-ray-burst" [class.burst-active]="unboxingPhase() === 'open'"></div>
                <div
                  class="unboxing-chest-container"
                  [class.chest-shake]="unboxingPhase() === 'shake'"
                  [class.chest-open]="unboxingPhase() === 'open'"
                >
                  <app-clinic-item-svg [itemKey]="openingTierAssetSvgKey()" [width]="160" [height]="140" />
                </div>
                <div class="unboxing-text">
                  <span class="unboxing-title">📦 Deslacrando Suprimentos Médicos...</span>
                  <span class="unboxing-subtitle">Verificando esterilização e instrumentos hospitalares</span>
                </div>
              </div>
            }

            <!-- FASE 3: REVELAÇÃO DO ITEM (REWARD SCREEN) -->
            @else if (lootboxRevealResult(); as res) {
              <div class="reveal-stage" [style.--rarity-glow-color]="getRarityColor(res.droppedItem)">
                <header class="reveal-header">
                  <span
                    class="reveal-rarity-badge"
                    [style.background-color]="getRarityColor(res.droppedItem)"
                  >
                    ★ ITEM {{ getRarityLabel(res.droppedItem).toUpperCase() }}
                  </span>
                  @if (res.droppedItem.isLootboxExclusive) {
                    <span class="exclusive-seal">✦ Relíquia Exclusiva de Caixa</span>
                  }
                </header>

                <div class="reveal-podium" [style.box-shadow]="getRarityGlow(res.droppedItem.rarity)">
                  <div class="reveal-item-svg">
                    <app-clinic-item-svg [itemKey]="res.droppedItem.assetSvgKey" [width]="130" [height]="130" />
                  </div>
                </div>

                <div class="reveal-details">
                  <h3 class="reveal-item-name">{{ res.droppedItem.name }}</h3>
                  <div class="reveal-meta">
                    <span class="reveal-cat">{{ res.droppedItem.category | titlecase }}</span>
                    <span class="reveal-dim">{{ res.droppedItem.footprintX }}×{{ res.droppedItem.footprintY }} tiles</span>
                  </div>

                  @if (res.isDuplicate) {
                    <div class="duplicate-cashback-notice" data-testid="duplicate-cashback-notice">
                      <span class="cashback-icon">♻️</span>
                      <div class="cashback-text">
                        <strong>Item Já Adquirido!</strong>
                        <p>
                          Você já possui este item na sua clínica. Duplicata reciclada com compensação justa:
                          <strong class="cashback-amount mono-num">+{{ res.cashbackXpAwarded }} XP</strong> creditados de volta!
                        </p>
                      </div>
                    </div>
                  } @else {
                    <div class="new-item-notice" data-testid="new-item-notice">
                      <span class="new-icon">✨</span>
                      <span>Novo item exclusivo desbloqueado e adicionado ao seu inventário!</span>
                    </div>
                  }
                </div>

                <footer class="reveal-actions">
                  @if (!res.isDuplicate) {
                    <button
                      type="button"
                      class="btn-reveal-equip"
                      (click)="equipItemNow(res.droppedItem)"
                      data-testid="lootbox-equip-now-btn"
                    >
                      📐 Posicionar Agora
                    </button>
                  }
                  <button
                    type="button"
                    class="btn-reveal-stash"
                    (click)="closeLootboxModal()"
                    data-testid="lootbox-stash-btn"
                  >
                    🎒 Guardar no Inventário
                  </button>
                  <button
                    type="button"
                    class="btn-reveal-again"
                    (click)="resetLootboxForAnotherRoll()"
                    data-testid="lootbox-open-again-btn"
                  >
                    🎁 Abrir Outra Caixa
                  </button>
                </footer>
              </div>
            }

            <!-- TELA PRINCIPAL: LOJA DE CAIXAS (TIERS + CAIXA DIÁRIA) -->
            @else {
              <header class="theater-header">
                <div class="theater-header-title">
                  <h2>🎁 Caixas de Suprimentos Médicos</h2>
                  <p class="theater-subtitle">
                    Adquira maletas clínicas com itens decorativos especiais e relíquias exclusivas para seu consultório.
                  </p>
                </div>
                <div class="theater-header-balance">
                  <span class="balance-label">Saldo Disponível:</span>
                  <span class="balance-xp mono-num">⚡ {{ clinic()?.currentXp ?? 0 }} XP</span>
                </div>
                <button
                  type="button"
                  class="btn-theater-close"
                  (click)="closeLootboxModal()"
                  aria-label="Fechar"
                  data-testid="close-lootbox-modal-btn"
                >
                  ✕
                </button>
              </header>

              @if (lootboxErrorMessage()) {
                <div class="lootbox-error-banner" data-testid="lootbox-error-banner">
                  ⚠️ {{ lootboxErrorMessage() }}
                </div>
              }

              <!-- BANNER DE CAIXA DIÁRIA GRATUITA (0 XP) -->
              @if (isDailyFreeAvailable()) {
                <div class="daily-free-lootbox-card" data-testid="daily-free-lootbox-card">
                  <div class="daily-free-badge">🌟 PRESENTE DIÁRIO DISPONÍVEL</div>
                  <div class="daily-free-body">
                    <div class="daily-free-icon">
                      <app-clinic-item-svg [itemKey]="'lootbox_tier1_resident'" [width]="80" [height]="72" />
                    </div>
                    <div class="daily-free-info">
                      <h3>🎁 Caixa da Sorte Diária Gratuita</h3>
                      <p>Você ganhou 1 Caixa de Boas-Vindas pelo seu login diário! A raridade é sorteada aleatoriamente (não acumula — abra agora!).</p>
                      <span class="daily-free-price mono-num">Custo: 0 XP (Grátis)</span>
                    </div>
                    <button
                      type="button"
                      class="btn-open-daily-free"
                      (click)="triggerOpenDailyFreeLootbox()"
                      [disabled]="isUnboxing() || clinicService.loading()"
                      data-testid="open-daily-free-btn"
                    >
                      🎁 Resgatar Caixa Diária (0 XP)
                    </button>
                  </div>
                </div>
              }

              <div class="lootbox-tiers-grid">
                @for (t of lootboxTiers(); track t.tier) {
                  <div
                    class="lootbox-tier-card"
                    [class.tier-resident]="t.tier === 'TIER_1_RESIDENT'"
                    [class.tier-specialist]="t.tier === 'TIER_2_SPECIALIST'"
                    [class.tier-chief]="t.tier === 'TIER_3_CHIEF_OF_STAFF'"
                    [class.tier-disabled]="(clinic()?.currentXp ?? 0) < t.costXp"
                    [attr.data-testid]="'lootbox-card-' + t.tier"
                  >
                    <div class="tier-badge-pill">
                      {{ t.tier === 'TIER_1_RESIDENT' ? 'Kit do Interno' : t.tier === 'TIER_2_SPECIALIST' ? '✦ Zero Comuns' : '👑 1 em 4 Lendário' }}
                    </div>

                    <div class="tier-briefcase-preview">
                      <app-clinic-item-svg [itemKey]="t.assetSvgKey" [width]="90" [height]="80" />
                    </div>

                    <div class="tier-info">
                      <h3 class="tier-name">{{ t.name }}</h3>
                      <p class="tier-description">{{ t.description }}</p>
                    </div>

                    <div class="tier-cost-chip mono-num">
                      ⚡ {{ t.costXp }} XP
                    </div>

                    <div class="tier-probabilities">
                      <span class="probs-title">Probabilidades Transparentes:</span>
                      <div class="prob-bars">
                        @if (t.probabilities.common > 0) {
                          <div class="prob-row">
                            <span class="prob-dot dot-common"></span>
                            <span class="prob-name">Comum</span>
                            <span class="prob-val mono-num">{{ t.probabilities.common | number:'1.0-0' }}%</span>
                          </div>
                        }
                        <div class="prob-row">
                          <span class="prob-dot dot-rare"></span>
                          <span class="prob-name">Raro</span>
                          <span class="prob-val mono-num">{{ t.probabilities.rare | number:'1.0-0' }}%</span>
                        </div>
                        <div class="prob-row">
                          <span class="prob-dot dot-epic"></span>
                          <span class="prob-name">Épico</span>
                          <span class="prob-val mono-num">{{ t.probabilities.epic | number:'1.0-0' }}%</span>
                        </div>
                        <div class="prob-row">
                          <span class="prob-dot dot-legendary"></span>
                          <span class="prob-name">Lendário</span>
                          <span class="prob-val mono-num">{{ t.probabilities.legendary | number:'1.0-0' }}%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="btn-open-lootbox"
                      [disabled]="(clinic()?.currentXp ?? 0) < t.costXp || clinicService.loading() || isUnboxing()"
                      (click)="triggerOpenLootbox(t.tier)"
                      [attr.data-testid]="'open-lootbox-' + t.tier"
                    >
                      @if ((clinic()?.currentXp ?? 0) < t.costXp) {
                        🔒 Saldo Insuficiente
                      } @else {
                        🎁 Abrir Caixa ({{ t.costXp }} XP)
                      }
                    </button>
                  </div>
                }
              </div>

              <footer class="lootbox-modal-footer">
                <span class="guarantee-note">
                  🛡️ <strong>Garantia MedStudy Anti-Cassino:</strong> Sorteio justo sem repetições predatórias. Duplicatas geram cashback automático de XP.
                </span>
                <button
                  type="button"
                  class="btn-theater-back"
                  (click)="closeLootboxModal()"
                >
                  Fechar
                </button>
              </footer>
            }
          </div>
        </div>
      }

      <app-xp-reward-toast />
    </section>
  `,
  styles: [
    `
      :host {
        --color-neutral-50: #f8fafc;
        --color-neutral-100: #f1f5f9;
        --color-neutral-200: #e2e8f0;
        --color-neutral-300: #cbd5e1;
        --color-neutral-500: #64748b;
        --color-neutral-600: #475569;
        --color-neutral-700: #334155;
        --color-neutral-800: #1e293b;
        --color-neutral-900: #0f172a;
        --color-primary: #0d9488;
        --color-primary-hover: #0f766e;
        --color-primary-subtle: #f0fdfa;
        --color-accent: #f59e0b;
        --color-success: #10b981;
        --color-success-bg: #ecfdf5;
        --color-warning-bg: #fffbeb;
        --color-danger: #ef4444;
        --color-danger-bg: #fef2f2;
        display: block;
        min-height: calc(100vh - 72px);
        background: var(--color-neutral-50);
        color: var(--color-neutral-900);
        font-family: 'Inter', sans-serif;
        padding: 16px 24px 24px;
      }

      .clinic-workbench {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .mono-num {
        font-family: 'JetBrains Mono', monospace;
        font-variant-numeric: tabular-nums;
      }

      /* Skeleton Loader Isométrico Shimmer */
      .clinic-skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .shimmer-block {
        background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
        background-size: 200% 100%;
        animation: shimmerWave 1.6s infinite;
        border-radius: 12px;
      }

      .skeleton-hud {
        height: 76px;
        width: 100%;
      }

      .skeleton-viewport {
        height: 440px;
        border-radius: 16px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
      }

      .skeleton-iso-diamond {
        width: 240px;
        height: 120px;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      }

      .skeleton-caption {
        font-size: 0.9rem;
        color: #475569;
        font-weight: 500;
      }

      .skeleton-dock {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .skeleton-card {
        height: 170px;
      }

      @keyframes shimmerWave {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* HUD Superior */
      .clinic-hud-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
        padding: 14px 20px;
        border-radius: 16px;
        background: #ffffff;
        border: 1px solid var(--color-neutral-200);
        box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05);
      }

      .hud-identity {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .level-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 12px;
        background: var(--color-primary-subtle);
        border: 1px solid var(--color-primary);
        color: var(--color-primary-hover);
      }

      .level-num {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.04em;
      }

      .level-grid {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        font-weight: 700;
      }

      .clinic-titles h1 {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-neutral-900);
        margin: 0 0 4px;
      }

      .lifetime-progress-wrap {
        min-width: 230px;
      }

      .lifetime-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--color-neutral-600);
        margin-bottom: 4px;
      }

      .lifetime-bar-track {
        height: 7px;
        border-radius: 9999px;
        background: var(--color-neutral-100);
        overflow: hidden;
      }

      .lifetime-bar-fill {
        height: 100%;
        border-radius: 9999px;
        background: var(--color-primary);
        transition: width 250ms ease;
      }

      .hud-economy {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .xp-balance-pill {
        display: flex;
        flex-direction: column;
        padding: 8px 14px;
        border-radius: 12px;
        background: var(--color-warning-bg);
        border: 1px solid #fcd34d;
      }

      .xp-balance-pill .pill-tag {
        font-size: 0.65rem;
        font-weight: 700;
        color: #b45309;
        letter-spacing: 0.04em;
      }

      .xp-balance-pill strong {
        font-size: 1.05rem;
        color: #92400e;
      }

      .streak-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 12px;
        background: var(--color-neutral-100);
        border: 1px solid var(--color-neutral-200);
      }

      .streak-meta {
        display: flex;
        flex-direction: column;
        font-size: 0.74rem;
        color: var(--color-neutral-700);
      }

      .hud-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .btn-expand-clinic {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8px 14px;
        border-radius: 10px;
        background: var(--color-primary);
        color: #ffffff;
        border: none;
        cursor: pointer;
      }

      .btn-expand-clinic:hover:not(:disabled) {
        background: var(--color-primary-hover);
      }

      .btn-expand-clinic:disabled {
        background: var(--color-neutral-200);
        color: var(--color-neutral-600);
        cursor: not-allowed;
      }

      .btn-expand-clinic .btn-title {
        font-size: 0.82rem;
        font-weight: 700;
      }

      .btn-expand-clinic .btn-sub {
        font-size: 0.68rem;
        opacity: 0.9;
      }

      .btn-edit-toggle,
      .btn-save-layout,
      .btn-audio-mute,
      .btn-avatar-modal,
      .btn-surfaces-modal {
        height: 40px;
        padding: 0 14px;
        border-radius: 10px;
        font-size: 0.84rem;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid var(--color-neutral-300);
        background: #ffffff;
        color: var(--color-neutral-900);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 140ms ease;
      }

      .btn-avatar-modal:hover,
      .btn-surfaces-modal:hover {
        background: var(--color-neutral-100);
        border-color: var(--color-primary);
      }

      .btn-avatar-modal {
        border-color: #0d9488;
        background: #f0fdfa;
        color: #0f766e;
      }

      .btn-surfaces-modal {
        border-color: #f59e0b;
        background: #fffbeb;
        color: #b45309;
      }

      .btn-edit-toggle.is-active {
        background: var(--color-primary);
        color: #ffffff;
        border-color: var(--color-primary);
      }

      .btn-save-layout {
        background: var(--color-success);
        color: #ffffff;
        border-color: var(--color-success);
      }

      /* Error Banner */
      .clinic-error-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-radius: 10px;
        background: var(--color-danger-bg);
        border: 1px solid var(--color-danger);
        color: #991b1b;
        font-size: 0.86rem;
        font-weight: 500;
      }

      .btn-dismiss-error {
        background: #ffffff;
        border: 1px solid #fca5a5;
        color: #991b1b;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
      }

      .clinic-stage-wrapper {
        height: 470px;
      }

      /* Dock Inferior Deslizante (4 Abas) */
      .clinic-bottom-dock {
        padding: 16px 20px;
        border-radius: 16px;
        background: #ffffff;
        border: 1px solid var(--color-neutral-200);
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
      }

      .dock-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--color-neutral-200);
      }

      .dock-tabs {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .dock-tab-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 10px;
        border: 1px solid var(--color-neutral-200);
        background: var(--color-neutral-50);
        color: var(--color-neutral-700);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
      }

      .dock-tab-btn.is-active {
        background: var(--color-primary);
        color: #ffffff;
        border-color: var(--color-primary);
      }

      .tab-count {
        padding: 2px 6px;
        border-radius: 9999px;
        font-size: 0.72rem;
        background: rgba(15, 23, 42, 0.08);
      }

      .dock-tab-btn.is-active .tab-count {
        background: rgba(255, 255, 255, 0.22);
      }

      .dock-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .filter-switch {
        display: inline-flex;
        padding: 3px;
        border-radius: 8px;
        background: var(--color-neutral-100);
      }

      .filter-btn {
        padding: 5px 10px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--color-neutral-600);
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
      }

      .filter-btn.active {
        background: #ffffff;
        color: var(--color-neutral-900);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
      }

      .btn-dock-tool {
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid var(--color-primary);
        background: var(--color-primary-subtle);
        color: var(--color-primary-hover);
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-dock-tool.danger {
        border-color: var(--color-danger);
        background: var(--color-danger-bg);
        color: #b91c1c;
      }

      /* Empty State */
      .clinic-empty-state {
        padding: 28px 20px;
        border-radius: 12px;
        background: var(--color-neutral-50);
        border: 1px dashed var(--color-neutral-300);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
      }

      .empty-copy h3 {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 1rem;
        color: var(--color-neutral-900);
        margin: 0 0 4px;
      }

      .empty-copy p {
        font-size: 0.85rem;
        color: var(--color-neutral-600);
        margin: 0;
      }

      .btn-empty-cta {
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
        background: var(--color-primary);
        color: #ffffff;
        font-weight: 600;
        font-size: 0.84rem;
        cursor: pointer;
      }

      /* Cards do Catálogo */
      .dock-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 12px;
      }

      .catalog-item-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px;
        border-radius: 12px;
        background: var(--color-neutral-50);
        border: 1px solid var(--color-neutral-200);
        transition: transform 150ms ease, border-color 150ms ease;
      }

      .catalog-item-card:hover {
        transform: translateY(-2px);
        border-color: var(--color-neutral-300);
      }

      .catalog-item-card.is-selected {
        border-color: var(--color-primary);
        background: var(--color-primary-subtle);
      }

      .catalog-item-card.is-locked {
        opacity: 0.78;
      }

      .card-top-badges {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        font-size: 0.68rem;
        font-weight: 700;
      }

      .footprint-badge {
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--color-neutral-200);
        color: var(--color-neutral-700);
      }

      .interactive-badge {
        color: #b45309;
        background: var(--color-warning-bg);
        padding: 2px 6px;
        border-radius: 4px;
      }

      .placed-badge,
      .owned-badge {
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--color-success-bg);
        color: #047857;
      }

      .card-svg-preview {
        height: 78px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .card-info h4 {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--color-neutral-900);
        margin: 4px 0;
      }

      .card-info p {
        font-size: 0.75rem;
        color: var(--color-neutral-600);
        margin: 0 0 10px;
        line-height: 1.35;
      }

      .btn-card-action {
        width: 100%;
        height: 34px;
        padding: 0 10px;
        border-radius: 8px;
        border: none;
        font-size: 0.78rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
      }

      .btn-card-action.buy {
        background: var(--color-accent);
        color: #0f172a;
      }

      .btn-card-action.buy:disabled {
        background: var(--color-neutral-200);
        color: var(--color-neutral-500);
        cursor: not-allowed;
      }

      .btn-card-action.place {
        background: var(--color-primary);
        color: #ffffff;
      }

      .btn-card-action.locked {
        background: var(--color-neutral-200);
        color: var(--color-neutral-600);
        cursor: not-allowed;
      }

      /* Modais de Customização */
      .clinic-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .clinic-modal-card {
        width: 100%;
        max-width: 680px;
        max-height: 90vh;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid var(--color-neutral-200);
        box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: modalScaleUp 200ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes modalScaleUp {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 24px;
        border-bottom: 1px solid var(--color-neutral-200);
        background: #f8fafc;
      }

      .modal-title-group h3 {
        margin: 0;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--color-neutral-900);
      }

      .modal-title-group p {
        margin: 3px 0 0;
        font-size: 0.8rem;
        color: var(--color-neutral-600);
      }

      .btn-modal-close {
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        border: 1px solid var(--color-neutral-200);
        background: #ffffff;
        color: var(--color-neutral-600);
        cursor: pointer;
        font-size: 0.9rem;
      }

      .modal-body {
        padding: 20px 24px;
        overflow-y: auto;
      }

      .avatar-modal-grid {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 24px;
      }

      @media (max-width: 640px) {
        .avatar-modal-grid {
          grid-template-columns: 1fr;
        }
      }

      .avatar-live-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 12px;
        background: radial-gradient(circle at 50% 40%, #ffffff 0%, #f1f5f9 100%);
        border: 1px solid var(--color-neutral-200);
        border-radius: 16px;
      }

      .avatar-stage-tag {
        margin-top: 10px;
        padding: 4px 12px;
        border-radius: 9999px;
        background: #0d9488;
        color: #ffffff;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .avatar-slots-scroll {
        display: flex;
        flex-direction: column;
        gap: 18px;
        max-height: 480px;
        overflow-y: auto;
        padding-right: 6px;
      }

      .customizer-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .section-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--color-neutral-700);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .gender-toggle-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .gender-btn {
        padding: 10px;
        border-radius: 10px;
        border: 1.5px solid var(--color-neutral-200);
        background: #ffffff;
        color: var(--color-neutral-700);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 120ms ease;
      }

      .gender-btn:hover {
        border-color: #0d9488;
        background: #f0fdfa;
      }

      .gender-btn.active {
        border-color: #0d9488;
        background: #0d9488;
        color: #ffffff;
      }

      .skin-options-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .skin-option-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1px solid var(--color-neutral-200);
        background: #ffffff;
        cursor: pointer;
        transition: all 120ms ease;
      }

      .skin-option-card:hover {
        border-color: var(--color-neutral-300);
        background: #f8fafc;
      }

      .skin-option-card.is-equipped {
        border-color: #0d9488;
        background: #f0fdfa;
      }

      .skin-option-card.is-previewing {
        border-color: #f59e0b;
        background: #fffbeb;
        box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.22);
      }

      .skin-action-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .preview-badge {
        font-size: 0.70rem;
        font-weight: 700;
        color: #b45309;
        background: #fef3c7;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
      }

      .skin-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .skin-name {
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--color-neutral-900);
      }

      .skin-cost {
        font-size: 0.72rem;
        color: var(--color-neutral-600);
      }

      .equip-indicator {
        font-size: 0.76rem;
        font-weight: 700;
        color: #0d9488;
      }

      .btn-unlock-skin {
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
        background: #f59e0b;
        color: #0f172a;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 100ms ease, background 100ms ease;
      }

      .btn-unlock-skin:hover:not(:disabled) {
        background: #d97706;
        color: #ffffff;
        transform: translateY(-1px);
      }

      .btn-unlock-skin:active:not(:disabled) {
        transform: translateY(0);
      }

      .btn-unlock-skin:disabled {
        background: var(--color-neutral-200);
        color: var(--color-neutral-500);
        cursor: not-allowed;
      }

      /* Superfícies */
      .surface-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 10px;
      }

      .surface-option-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        border-radius: 12px;
        border: 1.5px solid var(--color-neutral-200);
        background: #ffffff;
        cursor: pointer;
        transition: all 120ms ease;
      }

      .surface-option-card:hover {
        border-color: var(--color-neutral-300);
        transform: translateY(-2px);
      }

      .surface-option-card.is-active {
        border-color: #0d9488;
        background: #f0fdfa;
        box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
      }

      .surface-swatch {
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(15, 23, 42, 0.08);
      }

      .swatch-emoji {
        font-size: 1.25rem;
      }

      .surface-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .surface-info strong {
        font-size: 0.78rem;
        color: var(--color-neutral-900);
      }

      .surface-cost {
        font-size: 0.7rem;
        color: var(--color-neutral-600);
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid var(--color-neutral-200);
        background: #f8fafc;
      }

      .btn-modal-cancel {
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid var(--color-neutral-300);
        background: #ffffff;
        color: var(--color-neutral-700);
        font-weight: 600;
        font-size: 0.84rem;
        cursor: pointer;
      }

      .btn-modal-save {
        padding: 8px 18px;
        border-radius: 8px;
        border: none;
        background: #0d9488;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.84rem;
        cursor: pointer;
      }

      .btn-modal-save:disabled {
        background: var(--color-neutral-200);
        color: var(--color-neutral-500);
        cursor: not-allowed;
      }

      button:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      /* ============================================================ */
      /* LOOTBOX & RARITY DESIGN SYSTEM (US-11, US-12, US-13, P-093) */
      /* ============================================================ */

      .btn-lootbox-modal {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid #c084fc;
        background: linear-gradient(135deg, #fdf4ff 0%, #faf5ff 100%);
        color: #7e22ce;
        font-weight: 700;
        font-size: 0.82rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 1px 2px rgba(168, 85, 247, 0.1);
      }

      .btn-lootbox-modal:hover {
        background: linear-gradient(135deg, #fae8ff 0%, #f3e8ff 100%);
        border-color: #a855f7;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
      }

      .rarity-badge {
        font-size: 0.62rem;
        font-weight: 700;
        color: #ffffff;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .exclusive-pill {
        font-size: 0.62rem;
        font-weight: 700;
        color: #b45309;
        background: #fef3c7;
        border: 1px solid #fde68a;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .btn-card-action.lootbox {
        background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
        color: #ffffff;
        border: none;
      }

      .btn-card-action.lootbox:hover {
        background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
      }

      /* Teatro Tela Cheia de Lootboxes (Fullscreen Unboxing Theater) */
      .lootbox-fullscreen-theater {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 100%);
        backdrop-filter: blur(16px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 40px 20px 60px;
        box-sizing: border-box;
      }

      .lootbox-theater-container {
        background: #ffffff;
        border-radius: 20px;
        max-width: 1040px;
        width: 100%;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(255, 255, 255, 0.18);
        transition: all 0.3s ease;
      }

      .lootbox-fullscreen-theater.unboxing-active .lootbox-theater-container {
        background: transparent;
        box-shadow: none;
        border: none;
        color: #ffffff;
      }

      .theater-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 28px;
        background: #ffffff;
        border-bottom: 1px solid var(--color-neutral-200);
      }

      .theater-header-title h2 {
        font-size: 1.35rem;
        font-weight: 800;
        color: var(--color-neutral-900);
        margin: 0 0 4px;
      }

      .theater-subtitle {
        font-size: 0.84rem;
        color: var(--color-neutral-600);
        margin: 0;
      }

      .theater-header-balance {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        background: #fef3c7;
        border: 1px solid #fde68a;
        border-radius: 999px;
      }

      .btn-theater-close,
      .btn-theater-back {
        background: transparent;
        border: 1px solid var(--color-neutral-300);
        border-radius: 10px;
        padding: 8px 16px;
        font-weight: 700;
        font-size: 0.88rem;
        cursor: pointer;
        color: var(--color-neutral-700);
        transition: background 0.15s ease;
      }

      .btn-theater-close:hover,
      .btn-theater-back:hover {
        background: var(--color-neutral-100);
      }

      /* Card de Caixa Diária Gratuita */
      .daily-free-lootbox-card {
        margin: 20px 24px 8px;
        border-radius: 16px;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 35%, #fef9c3 100%);
        border: 2px solid #f59e0b;
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.22);
        padding: 16px 20px;
        position: relative;
        overflow: hidden;
      }

      .daily-free-badge {
        display: inline-block;
        background: #b45309;
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 3px 10px;
        border-radius: 999px;
        letter-spacing: 0.04em;
        margin-bottom: 10px;
      }

      .daily-free-body {
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
      }

      .daily-free-icon {
        flex-shrink: 0;
        animation: chest-shake-anim 3s ease-in-out infinite;
      }

      .daily-free-info {
        flex: 1;
        min-width: 240px;
      }

      .daily-free-info h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: #78350f;
        margin: 0 0 4px;
      }

      .daily-free-info p {
        font-size: 0.82rem;
        color: #92400e;
        margin: 0 0 6px;
        line-height: 1.35;
      }

      .daily-free-price {
        font-weight: 800;
        font-size: 0.84rem;
        color: #047857;
        background: #d1fae5;
        padding: 2px 8px;
        border-radius: 6px;
        display: inline-block;
      }

      .btn-open-daily-free {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 0.94rem;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
        transition: transform 0.15s ease, filter 0.15s ease;
      }

      .btn-open-daily-free:hover:not(:disabled) {
        filter: brightness(1.08);
        transform: translateY(-2px);
      }

      .btn-open-daily-free:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .lootbox-error-banner {
        margin: 12px 24px 0;
        padding: 10px 16px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        color: #b91c1c;
        font-size: 0.84rem;
        font-weight: 600;
      }

      .lootbox-tiers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
        padding: 20px 24px;
      }

      .lootbox-tier-card {
        border: 1px solid var(--color-neutral-200);
        border-radius: 14px;
        padding: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: #ffffff;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
      }

      .lootbox-tier-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      }

      .lootbox-tier-card.tier-resident {
        border-color: #cbd5e1;
      }

      .lootbox-tier-card.tier-specialist {
        border-color: #38bdf8;
        background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 60%);
      }

      .lootbox-tier-card.tier-chief {
        border-color: #f59e0b;
        background: linear-gradient(180deg, #fffbeb 0%, #ffffff 60%);
      }

      .lootbox-tier-card.tier-disabled {
        opacity: 0.65;
      }

      .tier-badge-pill {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 999px;
        margin-bottom: 8px;
        background: var(--color-neutral-100);
        color: var(--color-neutral-700);
      }

      .tier-specialist .tier-badge-pill {
        background: #e0f2fe;
        color: #0369a1;
      }

      .tier-chief .tier-badge-pill {
        background: #fef3c7;
        color: #b45309;
      }

      .tier-briefcase-preview {
        width: 120px;
        height: 96px;
        margin: 8px 0;
        animation: briefcase-float 4s ease-in-out infinite;
      }

      @keyframes briefcase-float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-4px);
        }
      }

      .tier-info {
        margin-bottom: 8px;
      }

      .tier-name {
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--color-neutral-900);
        margin: 0 0 4px;
      }

      .tier-description {
        font-size: 0.76rem;
        color: var(--color-neutral-600);
        margin: 0;
        line-height: 1.3;
        min-height: 32px;
      }

      .tier-cost-chip {
        font-size: 1.05rem;
        font-weight: 800;
        color: #b45309;
        background: #fef3c7;
        padding: 4px 14px;
        border-radius: 999px;
        margin: 8px 0 12px;
      }

      .tier-probabilities {
        width: 100%;
        background: var(--color-neutral-50);
        border: 1px solid var(--color-neutral-200);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 14px;
        text-align: left;
      }

      .probs-title {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--color-neutral-600);
        display: block;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .prob-bars {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .prob-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.74rem;
        color: var(--color-neutral-700);
      }

      .prob-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;
      }

      .dot-common {
        background: #94a3b8;
      }

      .dot-rare {
        background: #0284c7;
      }

      .dot-epic {
        background: #a855f7;
      }

      .dot-legendary {
        background: #f59e0b;
      }

      .prob-name {
        flex: 1;
      }

      .prob-val {
        font-weight: 700;
      }

      .btn-open-lootbox {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.86rem;
        cursor: pointer;
        margin-top: auto;
        border: none;
        color: #ffffff;
        background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
        transition: all 0.2s ease;
      }

      .btn-open-lootbox:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
      }

      .btn-open-lootbox:disabled {
        background: var(--color-neutral-200);
        color: var(--color-neutral-500);
        cursor: not-allowed;
      }

      .lootbox-modal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        background: #f8fafc;
        border-top: 1px solid var(--color-neutral-200);
      }

      .guarantee-note {
        font-size: 0.78rem;
        color: var(--color-neutral-600);
      }

      /* Estágio de Unboxing (1.35s) */
      .unboxing-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 56px 24px;
        position: relative;
        overflow: hidden;
        min-height: 380px;
      }

      .unboxing-ray-burst {
        position: absolute;
        width: 340px;
        height: 340px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--ray-color, #94a3b8) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.4s ease;
        filter: blur(28px);
        pointer-events: none;
      }

      .unboxing-ray-burst.burst-active {
        opacity: 0.9;
        animation: ray-pulse 1s ease-in-out infinite alternate;
      }

      @keyframes ray-pulse {
        0% {
          transform: scale(0.9);
          opacity: 0.7;
        }
        100% {
          transform: scale(1.15);
          opacity: 1;
        }
      }

      .unboxing-chest-container {
        width: 160px;
        height: 128px;
        z-index: 2;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .unboxing-chest-container.chest-shake {
        animation: chest-shake-anim 0.35s ease-in-out infinite;
      }

      @keyframes chest-shake-anim {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        25% {
          transform: translateY(-3px) rotate(-2deg);
        }
        75% {
          transform: translateY(2px) rotate(2deg);
        }
      }

      .unboxing-chest-container.chest-open {
        transform: scale(1.08) translateY(-8px);
      }

      .unboxing-text {
        margin-top: 24px;
        text-align: center;
        z-index: 2;
      }

      .unboxing-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: #ffffff;
        display: block;
      }

      .unboxing-subtitle {
        font-size: 0.82rem;
        color: #94a3b8;
        margin-top: 4px;
        display: block;
      }

      /* Estágio de Revelação (Reward Screen) */
      .reveal-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 36px 24px 28px;
        text-align: center;
      }

      .reveal-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }

      .reveal-rarity-badge {
        font-size: 0.82rem;
        font-weight: 800;
        color: #ffffff;
        padding: 4px 14px;
        border-radius: 999px;
        letter-spacing: 0.05em;
      }

      .exclusive-seal {
        font-size: 0.78rem;
        font-weight: 700;
        color: #b45309;
        background: #fef3c7;
        border: 1px solid #fde68a;
        padding: 3px 10px;
        border-radius: 999px;
      }

      .reveal-podium {
        width: 170px;
        height: 170px;
        border-radius: 16px;
        background: #f8fafc;
        border: 2px solid var(--rarity-glow-color, #94a3b8);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18px;
        transition: all 0.4s ease;
      }

      .reveal-item-svg {
        width: 120px;
        height: 120px;
        animation: float-reveal 3s ease-in-out infinite;
      }

      @keyframes float-reveal {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }

      .reveal-details {
        max-width: 480px;
        margin-bottom: 22px;
      }

      .reveal-item-name {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--color-neutral-900);
        margin: 0 0 6px;
      }

      .reveal-meta {
        font-size: 0.82rem;
        color: var(--color-neutral-500);
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-bottom: 14px;
      }

      .duplicate-cashback-notice {
        background: #fef3c7;
        border: 1px solid #fde68a;
        border-radius: 10px;
        padding: 12px 16px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        text-align: left;
      }

      .cashback-icon {
        font-size: 1.25rem;
      }

      .cashback-text strong {
        font-size: 0.88rem;
        color: #92400e;
        display: block;
        margin-bottom: 2px;
      }

      .cashback-text p {
        font-size: 0.8rem;
        color: #78350f;
        margin: 0;
      }

      .cashback-amount {
        color: #b45309;
        font-weight: 800;
      }

      .new-item-notice {
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        border-radius: 10px;
        padding: 10px 16px;
        color: #047857;
        font-weight: 600;
        font-size: 0.86rem;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
      }

      .reveal-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .btn-reveal-equip {
        background: #0d9488;
        color: #ffffff;
        border: none;
        padding: 9px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.84rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-reveal-equip:hover {
        background: #0f766e;
      }

      .btn-reveal-stash {
        background: var(--color-neutral-100);
        color: var(--color-neutral-700);
        border: 1px solid var(--color-neutral-300);
        padding: 9px 18px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.84rem;
        cursor: pointer;
      }

      .btn-reveal-stash:hover {
        background: var(--color-neutral-200);
      }

      .btn-reveal-again {
        background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
        color: #ffffff;
        border: none;
        padding: 9px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.84rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-reveal-again:hover {
        filter: brightness(1.1);
      }

      @media (prefers-reduced-motion: reduce) {
        .tier-briefcase-preview,
        .unboxing-ray-burst.burst-active,
        .unboxing-chest-container.chest-shake,
        .reveal-item-svg {
          animation: none !important;
          transform: none !important;
        }
      }
    `
  ]
})
export class MinhaClinicaComponent implements OnInit {
  readonly clinicService = inject(ClinicService);
  readonly audioService = inject(ClinicAudioService);

  readonly clinic = this.clinicService.clinicState;

  readonly activeCategory = signal<ClinicCategory>('pediatria');
  readonly inventoryFilter = signal<'all' | 'owned'>('all');
  readonly editMode = signal<boolean>(false);
  readonly selectedCatalogItem = signal<ClinicCatalogItem | null>(null);
  readonly selectedRotation = signal<number>(0);
  readonly movingPlacedId = signal<string | undefined>(undefined);
  readonly workingPlacedItems = signal<ClinicPlacedItem[]>([]);
  readonly isLayoutDirty = signal<boolean>(false);
  readonly localError = signal<string | null>(null);

  // Avatar e Revestimentos (P-087, P-088)
  readonly isAvatarModalOpen = signal<boolean>(false);
  readonly isSurfacesModalOpen = signal<boolean>(false);

  // Lootboxes & Raridade (US-11, US-12, US-13, P-093, P-094, P-095)
  readonly isLootboxModalOpen = signal<boolean>(false);
  readonly lootboxTiers = signal<LootboxTierInfo[]>(LOOTBOX_TIERS_FALLBACK);
  readonly isUnboxing = signal<boolean>(false);
  readonly unboxingPhase = signal<'shake' | 'open' | 'reveal'>('shake');
  readonly openingTierAssetSvgKey = signal<string>('lootbox_tier1_resident');
  readonly openingRayColor = signal<string>('#94a3b8');
  readonly lootboxRevealResult = signal<LootboxOpenResult | null>(null);
  readonly lootboxErrorMessage = signal<string | null>(null);

  readonly tempAvatarGender = signal<DoctorGender>('MALE');
  readonly tempAvatarCoat = signal<string>('coat_default');
  readonly tempAvatarSteth = signal<string>('steth_standard');
  readonly tempAvatarAccessory = signal<string>('acc_none');

  readonly tempWallTheme = signal<string>('clean_white');
  readonly tempFloorTheme = signal<string>('wood_light');

  readonly coatOptions = [
    { id: 'coat_default', name: 'Jaleco Branco Clássico', costXp: 0 },
    { id: 'coat_pediatric', name: 'Jaleco Pediátrico Bichinhos', costXp: 500 },
    { id: 'coat_gold', name: 'Jaleco Mestre Ouro & Caduceu', costXp: 2500 }
  ];

  readonly stethOptions = [
    { id: 'steth_standard', name: 'Estetoscópio Preto Clássico', costXp: 0 },
    { id: 'steth_elephant', name: 'Protetor Elefantinho Pediátrico', costXp: 350 },
    { id: 'steth_gold', name: 'Estetoscópio Master Ouro Maciço', costXp: 1800 }
  ];

  readonly accessoryOptions = [
    { id: 'acc_none', name: 'Nenhum Acessório', costXp: 0 },
    { id: 'acc_red_bowtie', name: 'Gravata Borboleta Vermelha', costXp: 400 },
    { id: 'acc_scrub_cap', name: 'Touca Cirúrgica Teal Nórdica', costXp: 600 }
  ];

  readonly wallpaperOptions = [
    { id: 'clean_white', name: 'Branco Clínico Minimalista', costXp: 0, previewColor: '#F8FAFC' },
    { id: 'ped_papel_safari', name: 'Safari Aquarela Savana', costXp: 850, previewColor: '#ECFDF5' },
    { id: 'wallpaper_geometric_teal', name: 'Geométrico Nórdico Teal', costXp: 950, previewColor: '#F0FDFA' },
    { id: 'wallpaper_brick_white', name: 'Tijolinho Branco Moderno', costXp: 750, previewColor: '#F1F5F9' }
  ];

  readonly floorOptions = [
    { id: 'wood_light', name: 'Carvalho Claro Escandinavo', costXp: 0, previewColor: '#FDFBF7' },
    { id: 'wood_dark_herringbone', name: 'Madeira Nobre Espinha de Peixe', costXp: 1100, previewColor: '#EDE4D8' },
    { id: 'marble_carrara', name: 'Mármore Carrara Luxo', costXp: 2200, previewColor: '#F8FAFC' },
    { id: 'tatame_eva', name: 'Tatame EVA Pastel Candy Color', costXp: 800, previewColor: '#FEFCE8' }
  ];

  readonly currentAvatar = computed<DoctorAvatar | undefined>(() => {
    return this.clinic()?.avatar;
  });

  readonly doctorDisplayName = computed<string>(() => {
    const clinic = this.clinic();
    const fullName = clinic?.userName || 'Lari';
    const firstName = clinic?.userFirstName || fullName.trim().split(/\s+/)[0];
    const prefix = this.currentAvatar()?.gender === 'FEMALE' ? 'Dra.' : 'Dr.';
    return `${prefix} ${firstName}`;
  });

  readonly isDailyFreeAvailable = computed<boolean>(() => {
    return Boolean(this.clinic()?.dailyFreeLootboxAvailable);
  });

  readonly totalCatalogCount = computed<number>(() => {
    return this.clinic()?.catalog?.length || CLINIC_CATALOG_FALLBACK.length;
  });

  readonly categoryTabs = computed<CategoryTabMeta[]>(() => {
    const catalog = this.clinic()?.catalog?.length ? this.clinic()!.catalog : CLINIC_CATALOG_FALLBACK;
    const countByCat = (c: ClinicCategory) => catalog.filter(i => i.category === c).length;
    const surfacesCount = this.wallpaperOptions.length + this.floorOptions.length;
    return [
      { id: 'pediatria', label: 'Pediatria', count: countByCat('pediatria'), badge: '🧸' },
      { id: 'mobiliario', label: 'Móveis', count: countByCat('mobiliario'), badge: '🪑' },
      { id: 'clinica', label: 'Equipamentos', count: countByCat('clinica'), badge: '🩺' },
      { id: 'recepcao', label: 'Conforto', count: countByCat('recepcao'), badge: '☕' },
      { id: 'revestimentos', label: 'Revestimentos', count: surfacesCount, badge: '🎨' }
    ];
  });

  readonly filteredCatalogItems = computed<ClinicCatalogItem[]>(() => {
    const state = this.clinic();
    const allItems = state?.catalog?.length ? state.catalog : CLINIC_CATALOG_FALLBACK;
    const cat = this.activeCategory();
    const filter = this.inventoryFilter();
    const ownedSet = new Set(state?.ownedItemIds ?? []);

    return allItems.filter(item => {
      if (item.category !== cat) {
        return false;
      }
      if (filter === 'owned') {
        return ownedSet.has(item.id);
      }
      return true;
    });
  });

  readonly lifetimeProgressPercent = computed<number>(() => {
    const state = this.clinic();
    if (!state) {
      return 0;
    }
    if (!state.nextExpansionRequiredLifetimeXp) {
      return 100;
    }
    return Math.min(
      100,
      Math.round((state.lifetimeXp / state.nextExpansionRequiredLifetimeXp) * 100)
    );
  });

  readonly canExpandNow = computed<boolean>(() => {
    const state = this.clinic();
    if (!state || !state.nextExpansionLevel) {
      return false;
    }
    const reqLife = state.nextExpansionRequiredLifetimeXp ?? 0;
    const cost = state.nextExpansionCostXp ?? 0;
    return state.lifetimeXp >= reqLife && state.currentXp >= cost;
  });

  readonly expandButtonTooltip = computed<string>(() => {
    const state = this.clinic();
    if (!state || !state.nextExpansionLevel) {
      return 'Nível máximo atingido';
    }
    if (state.lifetimeXp < (state.nextExpansionRequiredLifetimeXp ?? 0)) {
      return `Requer ${state.nextExpansionRequiredLifetimeXp} XP Vitalício para desbloquear`;
    }
    if (state.currentXp < (state.nextExpansionCostXp ?? 0)) {
      return `Saldo de XP insuficiente (${state.currentXp}/${state.nextExpansionCostXp} XP)`;
    }
    return `Expandir para ${state.nextExpansionName}`;
  });

  ngOnInit(): void {
    this.clinicService.loadClinic().subscribe({
      next: state => {
        this.workingPlacedItems.set([...state.placedItems]);
        this.isLayoutDirty.set(false);
      },
      error: () => {
        // Fallback resiliente caso o servidor esteja indisponível em modo offline/demo
        const fallback = this.clinicService.createDefaultLevel1State();
        this.clinicService.clinicState.set(fallback);
        this.workingPlacedItems.set([...fallback.placedItems]);
      }
    });

    this.clinicService.getLootboxTiers().subscribe({
      next: tiers => {
        if (tiers && tiers.length > 0) {
          this.lootboxTiers.set(tiers);
        }
      },
      error: () => {
        this.lootboxTiers.set(LOOTBOX_TIERS_FALLBACK);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'r' || event.key === 'R') && this.editMode() && this.selectedCatalogItem()) {
      event.preventDefault();
      this.toggleRotation();
    }
  }

  selectCategory(category: ClinicCategory): void {
    this.activeCategory.set(category);
    this.audioService.playClick();
  }

  setInventoryFilter(filter: 'all' | 'owned'): void {
    this.inventoryFilter.set(filter);
    this.audioService.playClick();
  }

  toggleEditMode(): void {
    const next = !this.editMode();
    this.editMode.set(next);
    if (!next) {
      this.selectedCatalogItem.set(null);
      this.movingPlacedId.set(undefined);
    }
    this.audioService.playClick();
  }

  toggleRotation(): void {
    this.selectedRotation.update(r => (r === 1 ? 0 : 1));
    this.audioService.playClick();
  }

  toggleAudioMute(): void {
    this.audioService.toggleMute();
  }

  isItemOwned(catalogItemId: string): boolean {
    return Boolean(this.clinic()?.ownedItemIds.includes(catalogItemId));
  }

  isItemPlaced(catalogItemId: string): boolean {
    return this.workingPlacedItems().some(
      p => p.catalogItemId === catalogItemId && p.placed && p.gridX !== null && p.gridY !== null
    );
  }

  selectItemForPlacement(item: ClinicCatalogItem): void {
    if (!this.editMode()) {
      this.editMode.set(true);
    }
    const existingPlaced = this.workingPlacedItems().find(
      p => p.catalogItemId === item.id && p.placed
    );
    this.movingPlacedId.set(existingPlaced?.id);
    this.selectedRotation.set(existingPlaced?.rotation ?? 0);
    this.selectedCatalogItem.set(item);
    this.audioService.playClick();
  }

  onCardPreviewClick(item: ClinicCatalogItem): void {
    this.audioService.playItemSound(item.soundFxUrl);
    if (this.isItemOwned(item.id)) {
      this.selectItemForPlacement(item);
    }
  }

  onViewportPlacedItemClicked(placed: ClinicPlacedItem): void {
    if (!this.editMode()) {
      return;
    }
    const catItem =
      (this.clinic()?.catalog ?? CLINIC_CATALOG_FALLBACK).find(
        c => c.id === placed.catalogItemId
      ) ?? null;
    if (catItem) {
      this.movingPlacedId.set(placed.id);
      this.selectedRotation.set(placed.rotation ?? 0);
      this.selectedCatalogItem.set(catItem);
      this.audioService.playClick();
    }
  }

  onViewportTileClicked(coords: { gridX: number; gridY: number }): void {
    const state = this.clinic();
    if (!this.editMode() || !state) {
      return;
    }

    const sel = this.selectedCatalogItem();
    // Caso 1: Item selecionado para posicionar ou mover
    if (sel) {
      const isWall =
        sel.placementType === 'WALL' ||
        (sel.footprintX === 0 && sel.footprintY === 0) ||
        sel.id === 'ped_regua_girafa' ||
        sel.id === 'negatoscopio_led';

      if (isWall && coords.gridX !== 0 && coords.gridY !== 0) {
        this.localError.set(
          'Itens de parede devem ser fixados em segmentos de parede (linha superior ou lateral esquerda).'
        );
        this.audioService.playErrorShake();
        return;
      }

      const rot = this.selectedRotation();
      const valid = this.clinicService.isPositionValid(
        coords.gridX,
        coords.gridY,
        sel.footprintX,
        sel.footprintY,
        rot,
        state.gridWidth,
        state.gridHeight,
        this.workingPlacedItems(),
        state.catalog,
        this.movingPlacedId()
      );

      if (!valid) {
        this.localError.set(
          `Posição (${coords.gridX}, ${coords.gridY}) inválida: há colisão com outro móvel ou extrapola o limite ${state.gridWidth}×${state.gridHeight}.`
        );
        this.audioService.playErrorShake();
        return;
      }

      this.localError.set(null);
      const currentList = [...this.workingPlacedItems()];
      const existingIdx = currentList.findIndex(
        p =>
          (this.movingPlacedId() && p.id === this.movingPlacedId()) ||
          p.catalogItemId === sel.id
      );

      const wallSide = isWall ? (coords.gridX === 0 ? 'NW' : 'NE') : undefined;
      const wallTileIndex = isWall ? (coords.gridX === 0 ? coords.gridY : coords.gridX) : undefined;
      const elevationZ = isWall
        ? (sel.id === 'ped_regua_girafa' || sel.id === 'estadiometro_compacto' ? 0 : 34)
        : undefined;

      if (existingIdx >= 0) {
        currentList[existingIdx] = {
          ...currentList[existingIdx],
          gridX: coords.gridX,
          gridY: coords.gridY,
          rotation: rot,
          placed: true,
          wallSide: wallSide as any,
          wallTileIndex,
          elevationZ,
          placementType: (isWall ? 'WALL' : 'FLOOR') as PlacementType
        };
      } else {
        currentList.push({
          id: `placed-${sel.id}-${Date.now()}`,
          catalogItemId: sel.id,
          gridX: coords.gridX,
          gridY: coords.gridY,
          rotation: rot,
          placed: true,
          wallSide: wallSide as any,
          wallTileIndex,
          elevationZ,
          placementType: (isWall ? 'WALL' : 'FLOOR') as PlacementType
        });
      }

      this.workingPlacedItems.set(currentList);
      this.isLayoutDirty.set(true);
      this.movingPlacedId.set(undefined);
      this.selectedCatalogItem.set(null);
      this.audioService.playPlaceItem();
      return;
    }

    // Caso 2: Nenhum item em mãos — se clicou em um tile que possui um móvel, seleciona-o para mover!
    const itemOnTile = this.findPlacedItemAtTile(coords.gridX, coords.gridY);
    if (itemOnTile) {
      this.onViewportPlacedItemClicked(itemOnTile);
    }
  }

  findPlacedItemAtTile(gridX: number, gridY: number): ClinicPlacedItem | undefined {
    const catalog = this.clinic()?.catalog ?? CLINIC_CATALOG_FALLBACK;
    const catMap = new Map(catalog.map(c => [c.id, c]));
    const items = this.workingPlacedItems();

    // 1ª Prioridade: Itens de Chão (Floor items ocupam os tiles físicos da sala)
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (!item.placed) continue;
      const cat = catMap.get(item.catalogItemId);
      const isWall =
        item.placementType === 'WALL' ||
        cat?.placementType === 'WALL' ||
        (cat?.footprintX === 0 && cat?.footprintY === 0) ||
        item.catalogItemId === 'ped_regua_girafa' ||
        item.catalogItemId === 'negatoscopio_led';

      if (!isWall) {
        const rot = item.rotation ?? 0;
        const { width: w, height: h } = this.clinicService.getEffectiveFootprint(
          cat ?? { footprintX: 1, footprintY: 1 },
          rot
        );
        const gx = item.gridX ?? 0;
        const gy = item.gridY ?? 0;
        if (gridX >= gx && gridX < gx + w && gridY >= gy && gridY < gy + h) {
          return item;
        }
      }
    }

    // 2ª Prioridade: Itens de Parede (Se o clique ocorreu nos slots de borda NW gridX=0 ou NE gridY=0)
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (!item.placed) continue;
      const cat = catMap.get(item.catalogItemId);
      const isWall =
        item.placementType === 'WALL' ||
        cat?.placementType === 'WALL' ||
        (cat?.footprintX === 0 && cat?.footprintY === 0) ||
        item.catalogItemId === 'ped_regua_girafa' ||
        item.catalogItemId === 'negatoscopio_led';

      if (isWall) {
        const wallSide = item.wallSide ?? (item.gridX === 0 ? 'NW' : 'NE');
        const tileIdx = item.wallTileIndex ?? (wallSide === 'NW' ? item.gridY : item.gridX);
        if (wallSide === 'NW' && gridX === 0 && gridY === tileIdx) {
          return item;
        }
        if (wallSide === 'NE' && gridY === 0 && gridX === tileIdx) {
          return item;
        }
      }
    }
    return undefined;
  }

  storeSelectedPlacedItem(): void {
    const targetId = this.movingPlacedId();
    if (!targetId) {
      return;
    }
    this.workingPlacedItems.update(list => list.filter(i => i.id !== targetId));
    this.isLayoutDirty.set(true);
    this.movingPlacedId.set(undefined);
    this.selectedCatalogItem.set(null);
    this.audioService.playClick();
  }

  saveCurrentLayout(): void {
    const itemsPayload = this.workingPlacedItems().map(item => ({
      id: item.id,
      catalogItemId: item.catalogItemId,
      gridX: item.gridX,
      gridY: item.gridY,
      rotation: item.rotation,
      placed: item.placed,
      wallSide: item.wallSide ?? undefined,
      wallTileIndex: item.wallTileIndex ?? undefined,
      elevationZ: item.elevationZ ?? undefined,
      placementType: item.placementType ?? 'FLOOR'
    }));

    this.clinicService.saveLayout({ items: itemsPayload }).subscribe({
      next: state => {
        this.workingPlacedItems.set([...state.placedItems]);
        this.isLayoutDirty.set(false);
        this.editMode.set(false);
        this.audioService.playBuySuccess();
      },
      error: () => {
        // Mantém estado local salvo na sessão caso offline
        const current = this.clinic();
        if (current) {
          this.clinicService.clinicState.set({
            ...current,
            placedItems: [...this.workingPlacedItems()]
          });
          this.isLayoutDirty.set(false);
          this.editMode.set(false);
        }
      }
    });
  }

  buyCatalogItem(item: ClinicCatalogItem): void {
    const state = this.clinic();
    if (!state) {
      return;
    }
    if (state.currentXp < item.costXp) {
      this.localError.set('Saldo de XP insuficiente para realizar esta operação.');
      this.audioService.playErrorShake();
      return;
    }

    this.clinicService
      .buyItem({
        catalogItemId: item.id,
        gridX: null,
        gridY: null,
        rotation: 0
      })
      .subscribe({
        next: updated => {
          this.workingPlacedItems.set([...updated.placedItems]);
          this.audioService.playBuySuccess();
          this.selectItemForPlacement(item);
        },
        error: () => {
          // Fallback local atômico P-080/P-084 caso o backend esteja offline em modo demonstração
          if (state.currentXp >= item.costXp) {
            this.clinicService.error.set(null);
            const nextOwned = Array.from(new Set([...state.ownedItemIds, item.id]));
            this.clinicService.clinicState.set({
              ...state,
              currentXp: state.currentXp - item.costXp,
              ownedItemIds: nextOwned
            });
            this.audioService.playBuySuccess();
            this.selectItemForPlacement(item);
          }
        }
      });
  }

  expandClinicRoom(): void {
    const state = this.clinic();
    if (!state || !this.canExpandNow()) {
      return;
    }

    this.clinicService.expandClinic().subscribe({
      next: updated => {
        this.workingPlacedItems.set([...updated.placedItems]);
        this.audioService.playExpandFanfare();
      },
      error: () => {
        // Fallback local P-082 caso o backend esteja offline
        const nextLevel = Math.min(6, state.expansionLevel + 1);
        const nextMeta =
          CLINIC_EXPANSION_LEVELS.find(l => l.level === nextLevel) ??
          CLINIC_EXPANSION_LEVELS[0];
        const afterMeta =
          CLINIC_EXPANSION_LEVELS.find(l => l.level === nextLevel + 1) ?? null;
        const cost = state.nextExpansionCostXp ?? nextMeta.costXp;

        this.clinicService.error.set(null);
        this.clinicService.clinicState.set({
          ...state,
          expansionLevel: nextMeta.level,
          expansionName: nextMeta.name,
          gridWidth: nextMeta.gridWidth,
          gridHeight: nextMeta.gridHeight,
          currentXp: Math.max(0, state.currentXp - cost),
          nextExpansionLevel: afterMeta?.level ?? null,
          nextExpansionName: afterMeta?.name ?? null,
          nextExpansionGridWidth: afterMeta?.gridWidth ?? null,
          nextExpansionGridHeight: afterMeta?.gridHeight ?? null,
          nextExpansionCostXp: afterMeta?.costXp ?? null,
          nextExpansionRequiredLifetimeXp: afterMeta?.requiredLifetimeXp ?? null,
          canExpand: Boolean(
            afterMeta &&
              state.lifetimeXp >= afterMeta.requiredLifetimeXp &&
              state.currentXp - cost >= afterMeta.costXp
          )
        });
        this.audioService.playExpandFanfare();
      }
    });
  }

  previewXp(actionType: StudyActionType, accuracyPercent = 0): number {
    const streak = this.clinic()?.currentStreakDays ?? 0;
    return this.clinicService.calculatePreviewXp(actionType, streak, accuracyPercent);
  }

  triggerStudyReward(actionType: StudyActionType, accuracyPercent = 0): void {
    this.clinicService
      .recordStudyAction({ actionType, accuracyPercent })
      .subscribe({
        next: () => {
          this.audioService.playBuySuccess();
        },
        error: () => {
          // Fallback local P-081/P-086 caso backend esteja offline
          const state = this.clinic();
          if (!state) {
            return;
          }
          const earned = this.previewXp(actionType, accuracyPercent);
          this.clinicService.error.set(null);
          this.clinicService.clinicState.set({
            ...state,
            lifetimeXp: state.lifetimeXp + earned,
            currentXp: state.currentXp + earned
          });
          this.clinicService.triggerXpToast({
            xpEarned: earned,
            baseXp: earned,
            streakMultiplierPercent: state.streakMultiplierPercent,
            currentStreakDays: state.currentStreakDays,
            lifetimeXp: state.lifetimeXp + earned,
            currentXp: state.currentXp + earned,
            actionType,
            message: `+${earned} XP (Salvo na Clínica)`
          });
          this.audioService.playBuySuccess();
        }
      });
  }

  clearErrors(): void {
    this.localError.set(null);
    this.clinicService.error.set(null);
  }

  // MÉTODOS DO AVATAR MÉDICO (P-087, P-088)
  openAvatarCustomizer(): void {
    const avatar = this.currentAvatar();
    this.tempAvatarGender.set(avatar?.gender ?? 'MALE');
    this.tempAvatarCoat.set(avatar?.skinCoat ?? 'coat_default');
    this.tempAvatarSteth.set(avatar?.skinStethoscope ?? 'steth_standard');
    this.tempAvatarAccessory.set(avatar?.skinAccessory ?? 'acc_none');
    this.isAvatarModalOpen.set(true);
    this.audioService.playClick();
  }

  closeAvatarCustomizer(): void {
    this.isAvatarModalOpen.set(false);
  }

  setAvatarGender(gender: DoctorGender): void {
    this.tempAvatarGender.set(gender);
    this.audioService.playClick();
  }

  selectCoatSkin(skinId: string): void {
    this.tempAvatarCoat.set(skinId);
    this.audioService.playClick();
  }

  selectStethSkin(skinId: string): void {
    this.tempAvatarSteth.set(skinId);
    this.audioService.playClick();
  }

  selectAccessorySkin(skinId: string): void {
    this.tempAvatarAccessory.set(skinId);
    this.audioService.playClick();
  }

  isSkinUnlocked(skinId: string): boolean {
    if (
      skinId === 'coat_default' ||
      skinId === 'coat_intern_white' ||
      skinId === 'steth_standard' ||
      skinId === 'steth_classic_black' ||
      skinId === 'steth_none' ||
      skinId === 'acc_none'
    ) {
      return true;
    }
    const avatarResp = this.clinicService.doctorAvatarResponse();
    if (avatarResp?.unlockedSkins?.includes(skinId)) {
      return true;
    }
    return false;
  }

  buySkinPrompt(skinId: string, event: MouseEvent): void {
    event.stopPropagation();
    const currentXp = this.clinic()?.currentXp ?? 0;
    const allSkins = [...this.coatOptions, ...this.stethOptions, ...this.accessoryOptions];
    const target = allSkins.find(s => s.id === skinId);
    if (!target) return;

    if (currentXp < target.costXp) {
      this.localError.set(`Saldo de XP insuficiente (${currentXp}/${target.costXp} XP).`);
      this.audioService.playErrorShake();
      return;
    }

    this.clinicService.buyDoctorSkin(skinId).subscribe({
      next: () => {
        this.audioService.playBuySuccess();
        const curr = this.clinicService.doctorAvatarResponse();
        if (curr && !curr.unlockedSkins.includes(skinId)) {
          this.clinicService.doctorAvatarResponse.set({
            ...curr,
            unlockedSkins: [...curr.unlockedSkins, skinId]
          });
        }
        // Equipa automaticamente ao desbloquear
        if (this.coatOptions.some(c => c.id === skinId)) {
          this.tempAvatarCoat.set(skinId);
        } else if (this.stethOptions.some(s => s.id === skinId)) {
          this.tempAvatarSteth.set(skinId);
        } else if (this.accessoryOptions.some(a => a.id === skinId)) {
          this.tempAvatarAccessory.set(skinId);
        }
      },
      error: () => {
        // Fallback local se backend offline
        const state = this.clinic();
        if (state && state.currentXp >= target.costXp) {
          this.clinicService.clinicState.set({
            ...state,
            currentXp: state.currentXp - target.costXp
          });
          const curr = this.clinicService.doctorAvatarResponse();
          if (curr) {
            this.clinicService.doctorAvatarResponse.set({
              ...curr,
              unlockedSkins: [...curr.unlockedSkins, skinId]
            });
          }
          if (this.coatOptions.some(c => c.id === skinId)) {
            this.tempAvatarCoat.set(skinId);
          } else if (this.stethOptions.some(s => s.id === skinId)) {
            this.tempAvatarSteth.set(skinId);
          } else if (this.accessoryOptions.some(a => a.id === skinId)) {
            this.tempAvatarAccessory.set(skinId);
          }
          this.audioService.playBuySuccess();
        } else {
          this.localError.set('Não foi possível desbloquear o item cosmético.');
          this.audioService.playErrorShake();
        }
      }
    });
  }

  saveAvatarCustomization(): void {
    const lockedNames: string[] = [];
    if (!this.isSkinUnlocked(this.tempAvatarCoat())) {
      const c = this.coatOptions.find(o => o.id === this.tempAvatarCoat());
      if (c) lockedNames.push(c.name);
    }
    if (!this.isSkinUnlocked(this.tempAvatarSteth())) {
      const s = this.stethOptions.find(o => o.id === this.tempAvatarSteth());
      if (s) lockedNames.push(s.name);
    }
    if (!this.isSkinUnlocked(this.tempAvatarAccessory())) {
      const a = this.accessoryOptions.find(o => o.id === this.tempAvatarAccessory());
      if (a) lockedNames.push(a.name);
    }

    if (lockedNames.length > 0) {
      this.localError.set(`Você está provando "${lockedNames.join(', ')}", que ainda não foi desbloqueado. Clique no botão Desbloquear para adquiri-lo com seu XP antes de salvar.`);
      this.audioService.playErrorShake();
      return;
    }

    const payload = {
      gender: this.tempAvatarGender(),
      skinCoat: this.tempAvatarCoat(),
      skinStethoscope: this.tempAvatarSteth(),
      skinAccessory: this.tempAvatarAccessory()
    };

    this.clinicService.updateDoctorAvatar(payload).subscribe({
      next: resp => {
        const state = this.clinic();
        if (state) {
          this.clinicService.clinicState.set({
            ...state,
            avatar: {
              avatarId: resp.avatarId,
              gender: resp.gender,
              skinCoat: resp.skinCoat,
              skinStethoscope: resp.skinStethoscope,
              skinAccessory: resp.skinAccessory,
              avatarX: resp.avatarX,
              avatarY: resp.avatarY
            }
          });
        }
        this.isAvatarModalOpen.set(false);
        this.audioService.playBuySuccess();
      },
      error: () => {
        // Fallback local
        const state = this.clinic();
        if (state) {
          this.clinicService.clinicState.set({
            ...state,
            avatar: {
              ...(state.avatar ?? { avatarX: 1, avatarY: 1 }),
              gender: payload.gender,
              skinCoat: payload.skinCoat,
              skinStethoscope: payload.skinStethoscope,
              skinAccessory: payload.skinAccessory
            }
          });
        }
        this.isAvatarModalOpen.set(false);
        this.audioService.playBuySuccess();
      }
    });
  }

  // MÉTODOS DE SUPERFÍCIES (PAREDES & PISOS NO DOCK INFERIOR) (P-087)
  openSurfacesModal(): void {
    const state = this.clinic();
    this.tempWallTheme.set(state?.wallTheme ?? 'clean_white');
    this.tempFloorTheme.set(state?.floorTheme ?? 'wood_light');
    this.isSurfacesModalOpen.set(true);
    this.audioService.playClick();
  }

  closeSurfacesModal(): void {
    this.isSurfacesModalOpen.set(false);
  }

  saveSurfacesCustomization(): void {
    const wallTheme = this.tempWallTheme();
    const floorTheme = this.tempFloorTheme();

    this.clinicService.updateSurfaces({ wallTheme, floorTheme }).subscribe({
      next: state => {
        this.clinicService.clinicState.set(state);
        this.isSurfacesModalOpen.set(false);
        this.audioService.playBuySuccess();
      },
      error: () => {
        const state = this.clinic();
        if (state) {
          this.clinicService.clinicState.set({
            ...state,
            wallTheme,
            floorTheme
          });
        }
        this.isSurfacesModalOpen.set(false);
        this.audioService.playBuySuccess();
      }
    });
  }

  isSurfaceOwned(surfaceId: string): boolean {
    if (surfaceId === 'clean_white' || surfaceId === 'wood_light') {
      return true;
    }
    const state = this.clinic();
    if (state?.ownedItemIds?.includes(surfaceId)) {
      return true;
    }
    if (state?.ownedSurfaces?.some(s => s.id === surfaceId)) {
      return true;
    }
    return false;
  }

  applyWallpaperDirectly(wallId: string): void {
    const currentFloor = this.clinic()?.floorTheme ?? 'wood_light';
    this.clinicService.updateSurfaces({ wallTheme: wallId, floorTheme: currentFloor }).subscribe({
      next: state => {
        this.clinicService.clinicState.set(state);
        this.audioService.playBuySuccess();
      },
      error: () => {
        const curr = this.clinic();
        if (curr) {
          this.clinicService.clinicState.set({ ...curr, wallTheme: wallId });
        }
        this.audioService.playBuySuccess();
      }
    });
  }

  applyFloorDirectly(floorId: string): void {
    const currentWall = this.clinic()?.wallTheme ?? 'clean_white';
    this.clinicService.updateSurfaces({ wallTheme: currentWall, floorTheme: floorId }).subscribe({
      next: state => {
        this.clinicService.clinicState.set(state);
        this.audioService.playBuySuccess();
      },
      error: () => {
        const curr = this.clinic();
        if (curr) {
          this.clinicService.clinicState.set({ ...curr, floorTheme: floorId });
        }
        this.audioService.playBuySuccess();
      }
    });
  }

  buyAndApplyWallpaper(wall: { id: string; name: string; costXp: number }): void {
    const state = this.clinic();
    if (!state) return;
    if (state.currentXp < wall.costXp) {
      this.localError.set(`Saldo de XP insuficiente (${state.currentXp}/${wall.costXp} XP).`);
      this.audioService.playErrorShake();
      return;
    }
    this.clinicService
      .buyItem({ catalogItemId: wall.id, gridX: null, gridY: null, rotation: 0 })
      .subscribe({
        next: () => {
          this.applyWallpaperDirectly(wall.id);
        },
        error: () => {
          this.applyWallpaperDirectly(wall.id);
        }
      });
  }

  buyAndApplyFloor(floor: { id: string; name: string; costXp: number }): void {
    const state = this.clinic();
    if (!state) return;
    if (state.currentXp < floor.costXp) {
      this.localError.set(`Saldo de XP insuficiente (${state.currentXp}/${floor.costXp} XP).`);
      this.audioService.playErrorShake();
      return;
    }
    this.clinicService
      .buyItem({ catalogItemId: floor.id, gridX: null, gridY: null, rotation: 0 })
      .subscribe({
        next: () => {
          this.applyFloorDirectly(floor.id);
        },
        error: () => {
          this.applyFloorDirectly(floor.id);
        }
      });
  }

  // ============================================================
  // MÉTODOS DE LOOTBOXES & RARIDADE (US-11, US-12, US-13, P-093, P-094, P-095)
  // ============================================================

  getRarityColor(item: ClinicCatalogItem): string {
    const rarity = getItemRarity(item);
    return RARITY_CONFIG[rarity]?.color ?? '#94A3B8';
  }

  getRarityLabel(item: ClinicCatalogItem): string {
    const rarity = getItemRarity(item);
    return RARITY_CONFIG[rarity]?.label ?? 'Comum';
  }

  getRarityGlow(rarity?: ItemRarity): string {
    switch (rarity) {
      case 'LEGENDARY':
        return '0 0 32px rgba(245, 158, 11, 0.65)';
      case 'EPIC':
        return '0 0 24px rgba(168, 85, 247, 0.50)';
      case 'RARE':
        return '0 0 20px rgba(56, 189, 248, 0.45)';
      case 'COMMON':
      default:
        return '0 0 16px rgba(148, 163, 184, 0.35)';
    }
  }

  openLootboxModal(): void {
    this.lootboxErrorMessage.set(null);
    this.lootboxRevealResult.set(null);
    this.isUnboxing.set(false);
    this.isLootboxModalOpen.set(true);
    this.audioService.playClick();
  }

  closeLootboxModal(): void {
    if (this.isUnboxing()) {
      return; // Trava durante unboxing de 1.35s
    }
    this.isLootboxModalOpen.set(false);
    this.lootboxRevealResult.set(null);
    this.audioService.playClick();
  }

  resetLootboxForAnotherRoll(): void {
    this.lootboxRevealResult.set(null);
    this.lootboxErrorMessage.set(null);
    this.audioService.playClick();
  }

  equipItemNow(item: ClinicCatalogItem): void {
    this.closeLootboxModal();
    this.selectedCatalogItem.set(item);
    if (!this.editMode()) {
      this.toggleEditMode();
    }
  }

  triggerOpenDailyFreeLootbox(): void {
    if (this.isUnboxing()) {
      return;
    }
    this.lootboxErrorMessage.set(null);
    this.isUnboxing.set(true);
    this.unboxingPhase.set('shake');
    this.openingTierAssetSvgKey.set('lootbox_tier1_resident');
    this.audioService.playLootboxUnbox();

    this.clinicService.openDailyFreeLootbox().subscribe({
      next: result => {
        const rarity: ItemRarity = result.droppedItem.rarity ?? 'COMMON';
        this.openingRayColor.set(RARITY_CONFIG[rarity]?.color ?? '#94A3B8');

        if (result.tierName === 'TIER_3_CHIEF_OF_STAFF' || result.tier === 'TIER_3_CHIEF_OF_STAFF') {
          this.openingTierAssetSvgKey.set('lootbox_tier3_chief');
        } else if (result.tierName === 'TIER_2_SPECIALIST' || result.tier === 'TIER_2_SPECIALIST') {
          this.openingTierAssetSvgKey.set('lootbox_tier2_specialist');
        } else {
          this.openingTierAssetSvgKey.set('lootbox_tier1_resident');
        }

        setTimeout(() => {
          this.unboxingPhase.set('open');
          this.audioService.playLootboxRarityFanfare(rarity);
        }, 550);

        setTimeout(() => {
          this.unboxingPhase.set('reveal');
          this.isUnboxing.set(false);
          this.lootboxRevealResult.set(result);
        }, 1350);
      },
      error: err => {
        this.isUnboxing.set(false);
        this.lootboxErrorMessage.set(
          err?.error?.message ||
            'Não foi possível resgatar a caixa diária gratuita. Tente novamente mais tarde.'
        );
        this.audioService.playErrorShake();
      }
    });
  }

  triggerOpenLootbox(tier: LootboxTier): void {
    if (this.isUnboxing()) {
      return;
    }
    const state = this.clinic();
    const tierMeta = this.lootboxTiers().find(t => t.tier === tier);
    const cost = tierMeta?.costXp ?? 500;

    if ((state?.currentXp ?? 0) < cost) {
      this.localError.set(`Saldo de XP insuficiente. Você precisa de ${cost} XP.`);
      this.audioService.playErrorShake();
      return;
    }

    this.lootboxErrorMessage.set(null);
    this.isUnboxing.set(true);
    this.unboxingPhase.set('shake');
    this.openingTierAssetSvgKey.set(
      tier === 'TIER_3_CHIEF_OF_STAFF'
        ? 'lootbox_tier3_chief'
        : tier === 'TIER_2_SPECIALIST'
        ? 'lootbox_tier2_specialist'
        : 'lootbox_tier1_resident'
    );
    this.audioService.playLootboxUnbox();

    this.clinicService.openLootbox(tier).subscribe({
      next: result => {
        const rarity: ItemRarity = result.droppedItem.rarity ?? 'COMMON';
        this.openingRayColor.set(RARITY_CONFIG[rarity]?.color ?? '#94A3B8');

        // Linha do tempo: 0.55s destravamento/luz, 1.35s revelação triunfante
        setTimeout(() => {
          this.unboxingPhase.set('open');
          this.audioService.playLootboxRarityFanfare(rarity);
        }, 550);

        setTimeout(() => {
          this.unboxingPhase.set('reveal');
          this.isUnboxing.set(false);
          this.lootboxRevealResult.set(result);
        }, 1350);
      },
      error: err => {
        this.isUnboxing.set(false);
        this.lootboxErrorMessage.set(
          err?.error?.message ||
            'Não foi possível abrir a caixa agora. Nenhum XP foi debitado. Tente novamente.'
        );
        this.audioService.playErrorShake();
      }
    });
  }
}
