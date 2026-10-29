import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CLINIC_CATALOG_FALLBACK,
  ClinicCatalogItem,
  ClinicPlacedItem,
  DoctorAvatar,
  PlacementType
} from '@core/models/clinic.model';
import { ClinicService } from '@core/services/clinic.service';
import { ClinicAudioService } from '@core/services/clinic-audio.service';
import { ClinicItemSvgComponent } from '../clinic-item-svg/clinic-item-svg.component';
import { DoctorAvatarSvgComponent } from '../doctor-avatar-svg/doctor-avatar-svg.component';

export interface IsometricTileRender {
  gridX: number;
  gridY: number;
  screenX: number;
  screenY: number;
  points: string;
  zone: 'main' | 'pediatria' | 'hall' | 'lounge';
}

export interface SortedRenderItem {
  placed: ClinicPlacedItem;
  catalogItem: ClinicCatalogItem;
  screenX: number;
  screenY: number;
  depth: number;
  effWidth: number;
  effHeight: number;
  wallSide?: 'NW' | 'NE';
}

export interface GhostPreviewRender {
  gridX: number;
  gridY: number;
  effWidth: number;
  effHeight: number;
  screenX: number;
  screenY: number;
  points: string;
  valid: boolean;
  catalogItem: ClinicCatalogItem;
  rotation: number;
  wallSide?: 'NW' | 'NE';
}

/**
 * Viewport Isométrico 2.5D Ortográfico 2:1 (Tile 64x32px) com Depth Sorting determinístico
 * e suspensão imediata via Page Visibility API (P-082, P-084, P-085, P-086).
 */
@Component({
  selector: 'app-clinic-viewport',
  standalone: true,
  imports: [
    CommonModule,
    ClinicItemSvgComponent,
    DoctorAvatarSvgComponent
  ],
  template: `
    <div
      class="clinic-viewport-shell"
      [class.is-edit-mode]="editModeSignal()"
      [class.is-placing]="isPlacingItem()"
      [class.is-dragging]="isDragging()"
      (mousedown)="onPointerDown($event)"
      (mousemove)="onPointerMove($event)"
      (mouseup)="onPointerUp()"
      (mouseleave)="onPointerUp()"
      (wheel)="onWheel($event)"
      data-testid="clinic-viewport"
    >
      <!-- Sub-barra de Coordenadas e Status do Modo Edição -->
      @if (editModeSignal()) {
        <div class="viewport-edit-pill" data-testid="viewport-edit-pill">
          <span class="pill-dot" [class.invalid]="ghostPreview() && !ghostPreview()!.valid"></span>
          <span class="pill-label">
            @if (isMovingDoctorSignal()) {
              Posicionando: <strong>{{ (avatarSignal()?.gender === 'MALE' ? 'Dr. ' : 'Dra. ') + 'Residente' }}</strong>
              <span class="mono-coord">
                ({{ hoveredTile()?.gridX ?? 0 }}, {{ hoveredTile()?.gridY ?? 0 }})
              </span>
            } @else if (selectedCatalogItemSignal(); as sel) {
              Posicionando: <strong>{{ sel.name }}</strong>
              <span class="mono-coord">
                ({{ hoveredTile()?.gridX ?? 0 }}, {{ hoveredTile()?.gridY ?? 0 }}) ·
                {{ selectedRotationSignal() === 1 ? 'Mesa Direita (SE)' : selectedRotationSignal() === 2 ? 'Fundo (NE)' : selectedRotationSignal() === 3 ? 'Mesa Esquerda (SW)' : 'Frente' }}
              </span>
            } @else {
              Modo Edição Ativo · Clique em um móvel ou no(a) Doutor(a) para mover
            }
          </span>
          @if (isMovingDoctorSignal()) {
            <button
              type="button"
              class="btn-rotate-inline btn-cancel-inline"
              (click)="cancelMovingDoctor.emit(); $event.stopPropagation()"
              title="Cancelar movimentação do doutor"
              data-testid="viewport-cancel-doc-btn"
            >
              ✕ Cancelar
            </button>
          } @else if (selectedCatalogItemSignal()) {
            <button
              type="button"
              class="btn-rotate-inline"
              (click)="rotateRequested.emit(); $event.stopPropagation()"
              title="Rotacionar item (Tecla R)"
              data-testid="viewport-rotate-btn"
            >
              ↻ Girar ({{ selectedRotationSignal() === 1 ? 'SW' : 'SE' }})
            </button>
          }
        </div>
      }

      <!-- Palco Isométrico com Zoom e Pan -->
      <div
        class="isometric-stage"
        [style.transform]="'translate(' + panX() + 'px, ' + panY() + 'px) scale(' + zoom() + ')'"
      >
        <!-- Piso e Paredes em Corte Transversal (Cross-Section SVG 2.5D) -->
        <svg
          class="diorama-floor-svg"
          [attr.viewBox]="svgViewBox()"
          [attr.width]="stageWidth()"
          [attr.height]="stageHeight()"
        >
          <defs>
            <linearGradient id="wallLeftGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F1F5F9" />
              <stop offset="100%" stop-color="#E2E8F0" />
            </linearGradient>
            <linearGradient id="wallRightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#E2E8F0" />
              <stop offset="100%" stop-color="#CBD5E1" />
            </linearGradient>
            <linearGradient id="sunlightBeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="rgba(254, 243, 199, 0.55)" />
              <stop offset="100%" stop-color="rgba(254, 243, 199, 0)" />
            </linearGradient>

            <clipPath id="leftWallClip">
              <polygon [attr.points]="leftWallPoints()" />
            </clipPath>
            <clipPath id="rightWallClip">
              <polygon [attr.points]="rightWallPoints()" />
            </clipPath>
          </defs>

          <!-- Sombra Projetada da Laje Isométrica -->
          <polygon
            [attr.points]="slabShadowPoints()"
            fill="rgba(15, 23, 42, 0.10)"
          />

          <!-- Parede Traseira Esquerda (NW) Base -->
          <polygon
            [attr.points]="leftWallPoints()"
            fill="url(#wallLeftGrad)"
            stroke="#CBD5E1"
            stroke-width="2"
          />

          <!-- Parede Traseira Direita (NE) Base -->
          <polygon
            [attr.points]="rightWallPoints()"
            fill="url(#wallRightGrad)"
            stroke="#94A3B8"
            stroke-width="2"
          />

          <!-- Papel de Parede Desacoplado na Parede Esquerda (NW) (P-087) -->
          <g clip-path="url(#leftWallClip)">
            @switch (wallThemeSignal()) {
              @case ('ped_papel_safari') {
                <polygon [attr.points]="leftWallPoints()" fill="#ECFDF5" opacity="0.9" />
                <circle [attr.cx]="originX() - 85" [attr.cy]="originY() - 36" r="20" fill="#FDE68A" opacity="0.8" />
                <path
                  [attr.d]="'M ' + (originX() - 120) + ' ' + (originY() + 15) + ' L ' + (originX() - 120) + ' ' + (originY() - 22) + ' Q ' + (originX() - 105) + ' ' + (originY() - 38) + ' ' + (originX() - 90) + ' ' + (originY() - 22) + ' Z'"
                  fill="#A7F3D0"
                  opacity="0.85"
                />
                <circle [attr.cx]="originX() - 105" [attr.cy]="originY() - 28" r="14" fill="#6EE7B7" opacity="0.65" />
                <!-- Girafinha aquarela ilustrada na parede esquerda -->
                <path
                  [attr.d]="'M ' + (originX() - 48) + ' ' + (originY() + 6) + ' L ' + (originX() - 48) + ' ' + (originY() - 36) + ' Q ' + (originX() - 45) + ' ' + (originY() - 46) + ' ' + (originX() - 38) + ' ' + (originY() - 42) + ' L ' + (originX() - 40) + ' ' + (originY() + 10) + ' Z'"
                  fill="#FCD34D"
                  opacity="0.9"
                />
                <circle [attr.cx]="originX() - 42" [attr.cy]="originY() - 44" r="5" fill="#FBBF24" />
                <circle [attr.cx]="originX() - 44" [attr.cy]="originY() - 25" r="2.5" fill="#D97706" opacity="0.8" />
                <circle [attr.cx]="originX() - 43" [attr.cy]="originY() - 15" r="2" fill="#D97706" opacity="0.8" />
              }
              @case ('wallpaper_geometric_teal') {
                <polygon [attr.points]="leftWallPoints()" fill="#F0FDFA" opacity="0.95" />
                <line [attr.x1]="originX() - 120" [attr.y1]="originY() + 20" [attr.x2]="originX() - 40" [attr.y2]="originY() - 40" stroke="#0D9488" stroke-width="1.5" opacity="0.25" />
                <line [attr.x1]="originX() - 80" [attr.y1]="originY() + 40" [attr.x2]="originX()" [attr.y2]="originY() - 20" stroke="#0D9488" stroke-width="1.5" opacity="0.25" />
              }
              @case ('wallpaper_brick_white') {
                <polygon [attr.points]="leftWallPoints()" fill="#FAFAFA" opacity="0.95" />
                <line [attr.x1]="originX() - 120" [attr.y1]="originY() - 15" [attr.x2]="originX()" [attr.y2]="originY() - 45" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="8 4" opacity="0.6" />
                <line [attr.x1]="originX() - 120" [attr.y1]="originY() + 10" [attr.x2]="originX()" [attr.y2]="originY() - 20" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="8 4" opacity="0.6" />
              }
            }
          </g>

          <!-- Papel de Parede Desacoplado na Parede Direita (NE) (P-087) -->
          <g clip-path="url(#rightWallClip)">
            @switch (wallThemeSignal()) {
              @case ('ped_papel_safari') {
                <polygon [attr.points]="rightWallPoints()" fill="#ECFDF5" opacity="0.85" />
                <circle [attr.cx]="originX() + 65" [attr.cy]="originY() - 28" r="14" fill="#BAE6FD" opacity="0.75" />
                <path
                  [attr.d]="'M ' + (originX() + 45) + ' ' + (originY() - 36) + ' Q ' + (originX() + 55) + ' ' + (originY() - 44) + ' ' + (originX() + 65) + ' ' + (originY() - 36) + ' Q ' + (originX() + 75) + ' ' + (originY() - 44) + ' ' + (originX() + 85) + ' ' + (originY() - 36) + ' Z'"
                  fill="#FFFFFF"
                  opacity="0.85"
                />
                <circle [attr.cx]="originX() + 82" [attr.cy]="originY() - 8" r="11" fill="#93C5FD" opacity="0.8" />
                <circle [attr.cx]="originX() + 73" [attr.cy]="originY() - 15" r="5.5" fill="#60A5FA" opacity="0.85" />
                <path [attr.d]="'M ' + (originX() + 71) + ' ' + (originY() - 11) + ' Q ' + (originX() + 65) + ' ' + (originY() - 7) + ' ' + (originX() + 67) + ' ' + (originY() - 3)" stroke="#3B82F6" stroke-width="2.2" fill="none" stroke-linecap="round" />
              }
              @case ('wallpaper_geometric_teal') {
                <polygon [attr.points]="rightWallPoints()" fill="#F0FDFA" opacity="0.95" />
                <line [attr.x1]="originX()" [attr.y1]="originY() - 20" [attr.x2]="originX() + 80" [attr.y2]="originY() + 40" stroke="#0D9488" stroke-width="1.5" opacity="0.25" />
                <line [attr.x1]="originX() + 40" [attr.y1]="originY() - 40" [attr.x2]="originX() + 120" [attr.y2]="originY() + 20" stroke="#0D9488" stroke-width="1.5" opacity="0.25" />
              }
              @case ('wallpaper_brick_white') {
                <polygon [attr.points]="rightWallPoints()" fill="#FAFAFA" opacity="0.95" />
                <line [attr.x1]="originX()" [attr.y1]="originY() - 45" [attr.x2]="originX() + 120" [attr.y2]="originY() - 15" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="8 4" opacity="0.6" />
                <line [attr.x1]="originX()" [attr.y1]="originY() - 20" [attr.x2]="originX() + 120" [attr.y2]="originY() + 10" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="8 4" opacity="0.6" />
              }
            }
          </g>

          <!-- Janela Iluminada na Parede Esquerda (Nível >= 2) -->
          @if (expansionLevelSignal() >= 2) {
            <polygon
              [attr.points]="windowLeftPoints()"
              fill="#BAE6FD"
              stroke="#0D9488"
              stroke-width="2.5"
            />
          }

          <!-- Placa de Nível / Diploma na Parede Direita -->
          <polygon
            [attr.points]="plaqueRightPoints()"
            fill="#FEF3C7"
            stroke="#D97706"
            stroke-width="1.5"
          />

          <!-- Segmentos Interativos da Parede NW (Linha Y, X=0) -->
          @for (wallSlice of nwWallSlices(); track 'nw-' + wallSlice.index) {
            <polygon
              class="iso-wall-slice"
              [class.edit-grid]="editModeSignal()"
              [attr.points]="wallSlice.points"
              (mouseenter)="onWallSliceHover('NW', wallSlice.index)"
              (click)="onWallSliceClick('NW', wallSlice.index, $event)"
            />
          }

          <!-- Segmentos Interativos da Parede NE (Linha X, Y=0) -->
          @for (wallSlice of neWallSlices(); track 'ne-' + wallSlice.index) {
            <polygon
              class="iso-wall-slice"
              [class.edit-grid]="editModeSignal()"
              [attr.points]="wallSlice.points"
              (mouseenter)="onWallSliceHover('NE', wallSlice.index)"
              (click)="onWallSliceClick('NE', wallSlice.index, $event)"
            />
          }

          <!-- Malha de Tiles Isométricos 2:1 (64x32px) com Estilo de Piso Customizável -->
          @for (tile of tiles(); track tile.gridX + '-' + tile.gridY) {
            <polygon
              class="iso-tile"
              [class.zone-pediatria]="tile.zone === 'pediatria'"
              [class.zone-hall]="tile.zone === 'hall'"
              [class.zone-lounge]="tile.zone === 'lounge'"
              [class.floor-wood-light]="floorThemeSignal() === 'wood_light'"
              [class.floor-wood-dark]="floorThemeSignal() === 'wood_dark_herringbone'"
              [class.floor-marble]="floorThemeSignal() === 'marble_carrara'"
              [class.floor-tatame]="floorThemeSignal() === 'tatame_eva'"
              [class.edit-grid]="editModeSignal()"
              [attr.points]="tile.points"
              [attr.data-grid-x]="tile.gridX"
              [attr.data-grid-y]="tile.gridY"
              (mouseenter)="onTileHover(tile.gridX, tile.gridY)"
              (click)="onTileClick(tile.gridX, tile.gridY, $event)"
            />
          }

          <!-- Espessura 2.5D da Laje Inferior -->
          <polygon
            [attr.points]="slabLeftLipPoints()"
            fill="#CBD5E1"
          />
          <polygon
            [attr.points]="slabRightLipPoints()"
            fill="#94A3B8"
          />

          <!-- Ghost Preview Isométrico no Modo Edição (Verde = Válido / Vermelho = Colisão) -->
          @if (ghostPreview(); as ghost) {
            <polygon
              class="iso-ghost-polygon"
              [class.is-valid]="ghost.valid"
              [class.is-invalid]="!ghost.valid"
              [attr.points]="ghost.points"
              [attr.fill]="ghost.valid ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'"
              [attr.stroke]="ghost.valid ? '#10B981' : '#EF4444'"
              stroke-width="2.5"
              data-testid="iso-ghost-preview"
            />
          }
        </svg>

        <!-- Camada de Itens Posicionados Ordenados por Depth = (x + y) * 1000 + z -->
        <div
          class="placed-items-layer"
          [style.width.px]="stageWidth()"
          [style.height.px]="stageHeight()"
        >
          @for (entry of sortedRenderItems(); track entry.placed.id) {
            <div
              class="placed-item-anchor"
              [class.is-wall-item]="entry.placed.placementType === 'WALL'"
              [class.is-wall-nw]="entry.placed.placementType === 'WALL' && entry.wallSide === 'NW'"
              [class.is-wall-ne]="entry.placed.placementType === 'WALL' && entry.wallSide === 'NE'"
              [class.is-wall-ruler]="entry.catalogItem.id === 'ped_regua_girafa' || entry.catalogItem.id === 'estadiometro_compacto'"
              [class.is-interactable]="entry.catalogItem.interactable"
              [class.is-edit-selectable]="editModeSignal()"
              [class.is-selected-moving]="movingPlacedIdSignal() === entry.placed.id"
              [style.left.px]="entry.screenX"
              [style.top.px]="entry.screenY"
              [style.zIndex]="entry.depth"
              [attr.data-placed-id]="entry.placed.id"
              [attr.data-depth]="entry.depth"
              (click)="onPlacedItemClick(entry, $event)"
              [title]="entry.catalogItem.name"
            >
              <app-clinic-item-svg
                [itemKey]="entry.catalogItem.assetSvgKey"
                [rotation]="entry.placed.rotation"
                [isWallItem]="entry.placed.placementType === 'WALL'"
                [width]="entry.effWidth > 1 || entry.effHeight > 1 ? 104 : 84"
                [height]="entry.effWidth > 1 || entry.effHeight > 1 ? 96 : 78"
                [activePulse]="pulsingItemId() === entry.placed.id"
                [paused]="isPaused()"
              />
            </div>
          }

          <!-- Personagem Médico Residente 2.5D (P-087, P-088) -->
          @if (avatarSignal(); as doc) {
            <div
              class="doctor-avatar-anchor"
              [class.is-selected-moving]="isMovingDoctorSignal()"
              [style.left.px]="doctorScreenCoords().x"
              [style.top.px]="doctorScreenCoords().y"
              [style.zIndex]="doctorDepth()"
              (click)="onDoctorAvatarClick($event)"
              [title]="editModeSignal() ? 'Clique para mover o(a) Doutor(a) de lugar' : 'Clique para personalizar o(a) Doutor(a)'"
              data-testid="doctor-avatar-diorama"
            >
              <app-doctor-avatar-svg
                [gender]="doc.gender"
                [skinCoat]="doc.skinCoat"
                [skinStethoscope]="doc.skinStethoscope"
                [skinAccessory]="doc.skinAccessory"
                [width]="66"
                [height]="90"
                [activeAnimation]="doctorGreetingActive()"
                [paused]="isPaused()"
              />
            </div>
          }

          <!-- Ghost Doctor Avatar flutuante no Modo Edição ao mover Doutor(a) -->
          @if (isMovingDoctorSignal() && hoveredTile(); as hover) {
            <div
              class="ghost-avatar-anchor"
              [class.is-valid]="isDoctorHoverValid()"
              [class.is-invalid]="!isDoctorHoverValid()"
              [style.left.px]="doctorHoverScreenCoords().x"
              [style.top.px]="doctorHoverScreenCoords().y"
              [style.zIndex]="99999"
            >
              @if (avatarSignal(); as doc) {
                <app-doctor-avatar-svg
                  [gender]="doc.gender"
                  [skinCoat]="doc.skinCoat"
                  [skinStethoscope]="doc.skinStethoscope"
                  [skinAccessory]="doc.skinAccessory"
                  [width]="66"
                  [height]="90"
                  [paused]="isPaused()"
                />
              }
              <span class="ghost-status-tag" [class.invalid]="!isDoctorHoverValid()">
                {{ isDoctorHoverValid() ? '✓ Mover para cá' : '✕ Ocupado por móvel' }}
              </span>
            </div>
          }

          <!-- Ghost Item Visual Flutuante no Modo Edição -->
          @if (!isMovingDoctorSignal() && ghostPreview(); as ghost) {
            <div
              class="ghost-item-anchor"
              [class.is-wall-item]="ghost.catalogItem.placementType === 'WALL' || (ghost.catalogItem.footprintX === 0 && ghost.catalogItem.footprintY === 0)"
              [class.is-wall-nw]="(ghost.catalogItem.placementType === 'WALL' || (ghost.catalogItem.footprintX === 0 && ghost.catalogItem.footprintY === 0)) && ghost.wallSide === 'NW'"
              [class.is-wall-ne]="(ghost.catalogItem.placementType === 'WALL' || (ghost.catalogItem.footprintX === 0 && ghost.catalogItem.footprintY === 0)) && ghost.wallSide === 'NE'"
              [class.is-wall-ruler]="ghost.catalogItem.id === 'ped_regua_girafa' || ghost.catalogItem.id === 'estadiometro_compacto'"
              [class.is-valid]="ghost.valid"
              [class.is-invalid]="!ghost.valid"
              [style.left.px]="ghost.screenX"
              [style.top.px]="ghost.screenY"
              [style.zIndex]="99999"
            >
              <app-clinic-item-svg
                [itemKey]="ghost.catalogItem.assetSvgKey"
                [rotation]="ghost.rotation"
                [isWallItem]="ghost.catalogItem.placementType === 'WALL' || (ghost.catalogItem.footprintX === 0 && ghost.catalogItem.footprintY === 0)"
                [width]="ghost.effWidth > 1 || ghost.effHeight > 1 ? 104 : 84"
                [height]="ghost.effWidth > 1 || ghost.effHeight > 1 ? 96 : 78"
                [paused]="isPaused()"
              />
              <span class="ghost-status-tag">
                {{ ghost.valid ? '✓ Posicionar' : '✕ Inválido / Limite' }}
              </span>
            </div>
          }
        </div>
      </div>

      <!-- Tooltip Interativo do Item Clicado (Modo Visualização) -->
      @if (activeItemBubble(); as bubble) {
        <div class="item-interaction-bubble" data-testid="item-interaction-bubble">
          <strong>{{ bubble.name }}</strong>
          <span>{{ bubble.description }}</span>
        </div>
      }

      <!-- Controles Flutuantes de Câmera (Zoom +, Zoom -, Reset 100%) -->
      <div class="camera-controls" role="group" aria-label="Controles de câmera do diorama">
        <button
          type="button"
          class="cam-btn"
          (click)="zoomIn(); $event.stopPropagation()"
          aria-label="Aumentar zoom"
          data-testid="zoom-in-btn"
        >
          +
        </button>
        <button
          type="button"
          class="cam-btn cam-reset"
          (click)="resetCamera(); $event.stopPropagation()"
          aria-label="Restaurar câmera 100%"
          data-testid="zoom-reset-btn"
        >
          {{ Math.round(zoom() * 100) }}%
        </button>
        <button
          type="button"
          class="cam-btn"
          (click)="zoomOut(); $event.stopPropagation()"
          aria-label="Diminuir zoom"
          data-testid="zoom-out-btn"
        >
          −
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .clinic-viewport-shell {
        position: relative;
        width: 100%;
        min-height: 470px;
        height: 100%;
        overflow: hidden;
        border-radius: 16px;
        background: radial-gradient(circle at 50% 35%, #ffffff 0%, #f1f5f9 72%, #e2e8f0 100%);
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        cursor: grab;
      }

      .clinic-viewport-shell.is-dragging {
        cursor: grabbing;
      }

      .clinic-viewport-shell.is-edit-mode {
        background: radial-gradient(circle at 50% 35%, #f0fdfa 0%, #f1f5f9 75%, #e2e8f0 100%);
        border-color: #0d9488;
      }

      .viewport-edit-pill {
        position: absolute;
        top: 16px;
        left: 16px;
        z-index: 40;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        border-radius: 9999px;
        background: rgba(15, 23, 42, 0.9);
        color: #f8fafc;
        font-family: 'Inter', sans-serif;
        font-size: 0.82rem;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
      }

      .pill-dot {
        width: 9px;
        height: 9px;
        border-radius: 9999px;
        background: #10b981;
      }

      .pill-dot.invalid {
        background: #ef4444;
      }

      .mono-coord {
        font-family: 'JetBrains Mono', monospace;
        font-variant-numeric: tabular-nums;
        color: #fbbf24;
        margin-left: 4px;
      }

      .btn-rotate-inline {
        background: #0d9488;
        color: #ffffff;
        border: none;
        border-radius: 9999px;
        padding: 4px 10px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
      }

      .isometric-stage {
        position: relative;
        transition: transform 80ms ease-out;
        transform-origin: center center;
      }

      .diorama-floor-svg {
        display: block;
        overflow: visible;
      }

      .iso-tile {
        fill: #f8fafc;
        stroke: #e2e8f0;
        stroke-width: 1;
        transition: fill 120ms ease;
      }

      .iso-tile.floor-wood-light {
        fill: #fdfbf7;
        stroke: #e7e2d8;
      }

      .iso-tile.floor-wood-dark {
        fill: #ede4d8;
        stroke: #d6c6b2;
      }

      .iso-tile.floor-marble {
        fill: #f8fafc;
        stroke: #cbd5e1;
      }

      .iso-tile.floor-tatame {
        fill: #fefce8;
        stroke: #fef08a;
      }

      .iso-tile.floor-tatame:nth-child(even) {
        fill: #f0fdf4;
        stroke: #bbf7d0;
      }

      .iso-tile.zone-pediatria {
        fill: #ecfdf5;
        stroke: #a7f3d0;
      }

      .iso-tile.zone-hall {
        fill: #fffbeb;
        stroke: #fde68a;
      }

      .iso-tile.zone-lounge {
        fill: #f0f9ff;
        stroke: #bae6fd;
      }

      .iso-tile.edit-grid {
        stroke: #94a3b8;
        stroke-dasharray: 2 2;
        cursor: pointer;
      }

      .iso-tile.edit-grid:hover {
        fill: #ccfbf1;
      }

      .iso-ghost-polygon {
        pointer-events: none !important;
      }

      .iso-wall-slice {
        fill: transparent;
        pointer-events: none;
      }

      .clinic-viewport-shell.is-edit-mode .iso-wall-slice {
        pointer-events: visiblePainted !important;
        cursor: pointer;
      }

      .clinic-viewport-shell.is-edit-mode .iso-wall-slice:hover {
        fill: rgba(13, 148, 136, 0.12);
        stroke: #0d9488;
        stroke-width: 1.5;
        stroke-dasharray: 4 2;
      }

      .placed-items-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .placed-item-anchor {
        position: absolute;
        transform: translate(-50%, -75%);
        pointer-events: none !important;
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), filter 150ms ease;
      }

      app-clinic-item-svg,
      .clinic-item-svg {
        pointer-events: none !important;
      }

      .shadow-polygon {
        pointer-events: none !important;
      }

      /* Parede NW (Esquerda): Skew -26.565deg para grudar perfeitamente na parede isométrica */
      .placed-item-anchor.is-wall-item.is-wall-nw {
        transform: translate(-50%, -50%) skewY(-26.565deg) scaleX(0.8944);
        transform-origin: center center;
        filter: drop-shadow(3px 4px 5px rgba(15, 23, 42, 0.22));
      }

      /* Parede NE (Direita): Skew +26.565deg para grudar perfeitamente na parede isométrica */
      .placed-item-anchor.is-wall-item.is-wall-ne {
        transform: translate(-50%, -50%) skewY(26.565deg) scaleX(0.8944);
        transform-origin: center center;
        filter: drop-shadow(-3px 4px 5px rgba(15, 23, 42, 0.22));
      }

      .placed-item-anchor.is-wall-ruler.is-wall-nw {
        transform: translate(-50%, -86%) skewY(-26.565deg) scaleX(0.8944);
        transform-origin: center bottom;
        filter: drop-shadow(3px 4px 5px rgba(15, 23, 42, 0.22));
      }

      .placed-item-anchor.is-wall-ruler.is-wall-ne {
        transform: translate(-50%, -86%) skewY(26.565deg) scaleX(0.8944);
        transform-origin: center bottom;
        filter: drop-shadow(-3px 4px 5px rgba(15, 23, 42, 0.22));
      }

      /* Hitbox estrita: apenas o contorno e traços desenhados do SVG interceptam cliques, nunca a caixa vazia */
      .placed-item-anchor.is-interactable svg :is(path, circle, rect, polyline, polygon:not(.shadow-polygon), ellipse, text),
      .placed-item-anchor.is-edit-selectable svg :is(path, circle, rect, polyline, polygon:not(.shadow-polygon), ellipse, text) {
        pointer-events: visiblePainted !important;
        cursor: pointer;
      }

      .doctor-avatar-anchor {
        position: absolute;
        transform: translate(-50%, -84%);
        pointer-events: none !important;
        cursor: pointer;
        z-index: 2000;
        transition: transform 150ms ease;
      }

      app-doctor-avatar-svg,
      .doctor-avatar-svg {
        pointer-events: none !important;
      }

      .doctor-avatar-anchor svg :is(path, circle, rect, polyline, polygon, ellipse, text) {
        pointer-events: visiblePainted !important;
        cursor: pointer;
      }

      .doctor-avatar-anchor:hover svg :is(path, circle, rect, polyline, polygon, ellipse, text) {
        filter: drop-shadow(0 4px 8px rgba(13, 148, 136, 0.35));
      }

      .doctor-avatar-anchor.is-selected-moving {
        opacity: 0.45;
        filter: saturate(0.5);
      }

      .placed-item-anchor.is-interactable:hover,
      .placed-item-anchor.is-edit-selectable:hover {
        transform: translate(-50%, -80%) scale(1.04);
        filter: drop-shadow(0 6px 10px rgba(13, 148, 136, 0.22));
      }

      .placed-item-anchor.is-wall-item.is-wall-nw:hover {
        transform: translate(-50%, -54%) skewY(-26.565deg) scaleX(0.92) scaleY(1.03);
      }

      .placed-item-anchor.is-wall-item.is-wall-ne:hover {
        transform: translate(-50%, -54%) skewY(26.565deg) scaleX(0.92) scaleY(1.03);
      }

      .placed-item-anchor.is-wall-ruler.is-wall-nw:hover {
        transform: translate(-50%, -90%) skewY(-26.565deg) scaleX(0.92) scaleY(1.03);
      }

      .placed-item-anchor.is-wall-ruler.is-wall-ne:hover {
        transform: translate(-50%, -90%) skewY(26.565deg) scaleX(0.92) scaleY(1.03);
      }

      .placed-item-anchor.is-selected-moving {
        opacity: 0.45;
        filter: saturate(0.5);
      }

      .ghost-item-anchor {
        position: absolute;
        transform: translate(-50%, -75%);
        pointer-events: none !important;
        opacity: 0.88;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .ghost-item-anchor.is-wall-item.is-wall-nw {
        transform: translate(-50%, -50%) skewY(-26.565deg) scaleX(0.8944);
        transform-origin: center center;
      }

      .ghost-item-anchor.is-wall-item.is-wall-ne {
        transform: translate(-50%, -50%) skewY(26.565deg) scaleX(0.8944);
        transform-origin: center center;
      }

      .ghost-item-anchor.is-wall-ruler.is-wall-nw {
        transform: translate(-50%, -86%) skewY(-26.565deg) scaleX(0.8944);
        transform-origin: center bottom;
      }

      .ghost-item-anchor.is-wall-ruler.is-wall-ne {
        transform: translate(-50%, -86%) skewY(26.565deg) scaleX(0.8944);
        transform-origin: center bottom;
      }

      .ghost-avatar-anchor {
        position: absolute;
        transform: translate(-50%, -84%);
        pointer-events: none !important;
        opacity: 0.88;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 99999;
      }

      .ghost-avatar-anchor.is-valid {
        filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.55));
      }

      .ghost-avatar-anchor.is-invalid {
        filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.65));
      }

      .btn-cancel-inline {
        background: #ef4444 !important;
        color: #ffffff;
      }

      .ghost-item-anchor.is-wall-ruler {
        transform: translate(-50%, -88%);
      }

      /* P-090: Durante o posicionamento ativo de um item, NADA na camada de móveis ou avatar intercepta o ponteiro */
      .clinic-viewport-shell.is-placing .placed-item-anchor,
      .clinic-viewport-shell.is-placing .placed-item-anchor *,
      .clinic-viewport-shell.is-placing .doctor-avatar-anchor,
      .clinic-viewport-shell.is-placing .doctor-avatar-anchor *,
      .clinic-viewport-shell.is-placing .ghost-item-anchor,
      .clinic-viewport-shell.is-placing .ghost-item-anchor * {
        pointer-events: none !important;
      }

      .ghost-item-anchor.is-valid {
        filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.55));
      }

      .ghost-item-anchor.is-invalid {
        filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.65));
      }

      .ghost-status-tag {
        margin-top: -8px;
        padding: 2px 8px;
        border-radius: 9999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.68rem;
        font-weight: 700;
        color: #ffffff;
        background: #10b981;
        white-space: nowrap;
      }

      .ghost-item-anchor.is-invalid .ghost-status-tag {
        background: #ef4444;
      }

      .item-interaction-bubble {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 40;
        max-width: 320px;
        padding: 10px 14px;
        border-radius: 12px;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #0d9488;
        box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.25);
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-family: 'Inter', sans-serif;
        font-size: 0.8rem;
      }

      .item-interaction-bubble strong {
        color: #5eead4;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .camera-controls {
        position: absolute;
        bottom: 16px;
        right: 16px;
        z-index: 40;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid #cbd5e1;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07);
      }

      .cam-btn {
        min-width: 32px;
        height: 32px;
        padding: 0 8px;
        border-radius: 6px;
        border: 1px solid transparent;
        background: transparent;
        color: #0f172a;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
      }

      .cam-btn:hover {
        background: #f1f5f9;
      }

      .cam-btn:focus-visible {
        outline: 2px solid #0d9488;
        outline-offset: 2px;
      }
    `
  ]
})
export class ClinicViewportComponent implements OnInit, OnDestroy {
  private readonly clinicService = inject(ClinicService);
  private readonly audioService = inject(ClinicAudioService);

  protected readonly Math = Math;

  readonly gridWidthSignal = signal<number>(4);
  readonly gridHeightSignal = signal<number>(4);
  readonly expansionLevelSignal = signal<number>(1);
  readonly placedItemsSignal = signal<ClinicPlacedItem[]>([]);
  readonly catalogSignal = signal<ClinicCatalogItem[]>(CLINIC_CATALOG_FALLBACK);
  readonly editModeSignal = signal<boolean>(false);
  readonly selectedCatalogItemSignal = signal<ClinicCatalogItem | null>(null);
  readonly selectedRotationSignal = signal<number>(0);
  readonly movingPlacedIdSignal = signal<string | undefined>(undefined);
  readonly isMovingDoctorSignal = signal<boolean>(false);

  readonly isPlacingItem = computed<boolean>(() => {
    return Boolean(
      this.selectedCatalogItemSignal() ||
      this.movingPlacedIdSignal() ||
      this.isMovingDoctorSignal()
    );
  });

  @Input() set isMovingDoctor(val: boolean) {
    this.isMovingDoctorSignal.set(Boolean(val));
  }
  get isMovingDoctor(): boolean {
    return this.isMovingDoctorSignal();
  }

  @Output() readonly cancelMovingDoctor = new EventEmitter<void>();

  @Input() set gridWidth(val: number) {
    this.gridWidthSignal.set(Math.max(4, val || 4));
  }
  get gridWidth(): number {
    return this.gridWidthSignal();
  }

  @Input() set gridHeight(val: number) {
    this.gridHeightSignal.set(Math.max(4, val || 4));
  }
  get gridHeight(): number {
    return this.gridHeightSignal();
  }

  @Input() set expansionLevel(val: number) {
    this.expansionLevelSignal.set(Math.max(1, val || 1));
  }
  get expansionLevel(): number {
    return this.expansionLevelSignal();
  }

  @Input() set placedItems(val: ClinicPlacedItem[]) {
    this.placedItemsSignal.set(val ?? []);
  }
  get placedItems(): ClinicPlacedItem[] {
    return this.placedItemsSignal();
  }

  @Input() set catalog(val: ClinicCatalogItem[]) {
    this.catalogSignal.set(val && val.length > 0 ? val : CLINIC_CATALOG_FALLBACK);
  }
  get catalog(): ClinicCatalogItem[] {
    return this.catalogSignal();
  }

  @Input() set editMode(val: boolean) {
    this.editModeSignal.set(Boolean(val));
  }
  get editMode(): boolean {
    return this.editModeSignal();
  }

  @Input() set selectedCatalogItem(val: ClinicCatalogItem | null) {
    this.selectedCatalogItemSignal.set(val ?? null);
  }
  get selectedCatalogItem(): ClinicCatalogItem | null {
    return this.selectedCatalogItemSignal();
  }

  @Input() set selectedRotation(val: number) {
    this.selectedRotationSignal.set(val === 1 ? 1 : 0);
  }
  get selectedRotation(): number {
    return this.selectedRotationSignal();
  }

  @Input() set movingPlacedId(val: string | undefined) {
    this.movingPlacedIdSignal.set(val);
  }
  get movingPlacedId(): string | undefined {
    return this.movingPlacedIdSignal();
  }

  readonly wallThemeSignal = signal<string>('clean_white');
  readonly floorThemeSignal = signal<string>('wood_light');
  readonly avatarSignal = signal<DoctorAvatar | null>(null);

  @Input() set wallTheme(val: string | undefined) {
    this.wallThemeSignal.set(val ?? 'clean_white');
  }
  get wallTheme(): string {
    return this.wallThemeSignal();
  }

  @Input() set floorTheme(val: string | undefined) {
    this.floorThemeSignal.set(val ?? 'wood_light');
  }
  get floorTheme(): string {
    return this.floorThemeSignal();
  }

  @Input() set avatar(val: DoctorAvatar | undefined | null) {
    this.avatarSignal.set(val ?? null);
  }
  get avatar(): DoctorAvatar | null {
    return this.avatarSignal();
  }

  @Output() readonly tileClicked = new EventEmitter<{ gridX: number; gridY: number; fromWall?: boolean }>();
  @Output() readonly placedItemClicked = new EventEmitter<ClinicPlacedItem>();
  @Output() readonly rotateRequested = new EventEmitter<void>();
  @Output() readonly avatarClicked = new EventEmitter<void>();

  readonly doctorGreetingActive = signal<boolean>(false);

  readonly zoom = signal<number>(1);
  readonly panX = signal<number>(0);
  readonly panY = signal<number>(0);
  readonly isDragging = signal<boolean>(false);
  readonly hoveredTile = signal<{ gridX: number; gridY: number } | null>({ gridX: 0, gridY: 0 });
  readonly pulsingItemId = signal<string | null>(null);
  readonly activeItemBubble = signal<{ name: string; description: string } | null>(null);

  // Page Visibility API & rAF loop state (P-085)
  readonly isPaused = signal<boolean>(false);
  readonly isLoopRunning = signal<boolean>(false);
  readonly frameTick = signal<number>(0);
  private rafId: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private isPointerActive = false;
  private hasDragged = false;
  private bubbleTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly visibilityHandler = (): void => {
    if (typeof document !== 'undefined' && document.hidden) {
      this.stopAnimationLoop();
      this.isPaused.set(true);
    } else {
      this.isPaused.set(false);
      this.startAnimationLoop();
    }
  };

  readonly stageWidth = computed(() => {
    const totalTiles = this.gridWidthSignal() + this.gridHeightSignal();
    return Math.max(580, totalTiles * 36 + 180);
  });

  readonly stageHeight = computed(() => {
    const totalTiles = this.gridWidthSignal() + this.gridHeightSignal();
    return Math.max(400, totalTiles * 18 + 200);
  });

  readonly originX = computed(() => {
    const w = this.gridWidthSignal();
    const h = this.gridHeightSignal();
    const offset = ((h - w) * 32) / 2;
    return this.stageWidth() / 2 + offset;
  });

  readonly originY = computed(() => 105);

  readonly doctorHoverScreenCoords = computed(() => {
    const hover = this.hoveredTile();
    const ox = this.originX();
    const oy = this.originY();
    const gx = hover?.gridX ?? 1;
    const gy = hover?.gridY ?? 1;
    return this.clinicService.gridToScreen(gx + 0.5, gy + 0.5, ox, oy);
  });

  readonly isDoctorHoverValid = computed<boolean>(() => {
    const hover = this.hoveredTile();
    if (!hover) return false;
    const w = this.gridWidthSignal();
    const h = this.gridHeightSignal();
    if (hover.gridX < 0 || hover.gridX >= w || hover.gridY < 0 || hover.gridY >= h) {
      return false;
    }
    // Não pode ficar sobreposto em piso ocupado por móvel
    const placed = this.placedItemsSignal();
    const catMap = new Map(this.catalogSignal().map(c => [c.id, c]));
    for (const item of placed) {
      if (!item.placed) continue;
      const cat = catMap.get(item.catalogItemId);
      const isWall =
        item.placementType === 'WALL' ||
        cat?.placementType === 'WALL' ||
        (cat?.footprintX === 0 && cat?.footprintY === 0);
      if (isWall) continue;
      const { width: effW, height: effH } = this.clinicService.getEffectiveFootprint(
        cat ?? CLINIC_CATALOG_FALLBACK[0],
        item.rotation ?? 0
      );
      const ix = item.gridX ?? 0;
      const iy = item.gridY ?? 0;
      if (
        hover.gridX >= ix &&
        hover.gridX < ix + effW &&
        hover.gridY >= iy &&
        hover.gridY < iy + effH
      ) {
        return false;
      }
    }
    return true;
  });

  readonly nwWallSlices = computed(() => {
    const h = this.gridHeightSignal();
    const ox = this.originX();
    const oy = this.originY();
    const wallH = 68;
    const list: { index: number; points: string }[] = [];
    for (let gy = 0; gy < h; gy++) {
      const b0 = this.clinicService.gridToScreen(0, gy, ox, oy);
      const b1 = this.clinicService.gridToScreen(0, gy + 1, ox, oy);
      list.push({
        index: gy,
        points: `${b1.x},${b1.y} ${b0.x},${b0.y} ${b0.x},${b0.y - wallH} ${b1.x},${b1.y - wallH}`
      });
    }
    return list;
  });

  readonly neWallSlices = computed(() => {
    const w = this.gridWidthSignal();
    const ox = this.originX();
    const oy = this.originY();
    const wallH = 68;
    const list: { index: number; points: string }[] = [];
    for (let gx = 0; gx < w; gx++) {
      const b0 = this.clinicService.gridToScreen(gx, 0, ox, oy);
      const b1 = this.clinicService.gridToScreen(gx + 1, 0, ox, oy);
      list.push({
        index: gx,
        points: `${b0.x},${b0.y} ${b1.x},${b1.y} ${b1.x},${b1.y - wallH} ${b0.x},${b0.y - wallH}`
      });
    }
    return list;
  });

  readonly doctorScreenCoords = computed(() => {
    const doc = this.avatarSignal();
    const ox = this.originX();
    const oy = this.originY();
    const gx = doc?.avatarX ?? 1;
    const gy = doc?.avatarY ?? 1;
    return this.clinicService.gridToScreen(gx + 0.5, gy + 0.5, ox, oy);
  });

  readonly doctorDepth = computed(() => {
    const doc = this.avatarSignal();
    const gx = doc?.avatarX ?? 1;
    const gy = doc?.avatarY ?? 1;
    return this.clinicService.calculateDepth(gx, gy, 15);
  });

  readonly svgViewBox = computed(() => `0 0 ${this.stageWidth()} ${this.stageHeight()}`);

  readonly tiles = computed<IsometricTileRender[]>(() => {
    const w = this.gridWidthSignal();
    const h = this.gridHeightSignal();
    const level = this.expansionLevelSignal();
    const ox = this.originX();
    const oy = this.originY();
    const list: IsometricTileRender[] = [];

    for (let gx = 0; gx < w; gx++) {
      for (let gy = 0; gy < h; gy++) {
        const center = this.clinicService.gridToScreen(gx + 0.5, gy + 0.5, ox, oy);
        const top = this.clinicService.gridToScreen(gx, gy, ox, oy);
        const right = this.clinicService.gridToScreen(gx + 1, gy, ox, oy);
        const bottom = this.clinicService.gridToScreen(gx + 1, gy + 1, ox, oy);
        const left = this.clinicService.gridToScreen(gx, gy + 1, ox, oy);

        let zone: 'main' | 'pediatria' | 'hall' | 'lounge' = 'main';
        if (level >= 5 && gx >= 6 && gy < 6) {
          zone = 'pediatria';
        } else if (level >= 4 && gx < 6 && gy >= 3) {
          zone = 'hall';
        } else if (level === 6 && gx >= 12) {
          zone = 'lounge';
        }

        list.push({
          gridX: gx,
          gridY: gy,
          screenX: center.x,
          screenY: center.y,
          points: `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`,
          zone
        });
      }
    }
    return list;
  });

  readonly leftWallPoints = computed(() => {
    const h = this.gridHeightSignal();
    const ox = this.originX();
    const oy = this.originY();
    const wallH = 68;
    const topOrigin = this.clinicService.gridToScreen(0, 0, ox, oy);
    const leftCorner = this.clinicService.gridToScreen(0, h, ox, oy);
    return `${leftCorner.x},${leftCorner.y} ${topOrigin.x},${topOrigin.y} ${topOrigin.x},${topOrigin.y - wallH} ${leftCorner.x},${leftCorner.y - wallH}`;
  });

  readonly rightWallPoints = computed(() => {
    const w = this.gridWidthSignal();
    const ox = this.originX();
    const oy = this.originY();
    const wallH = 68;
    const topOrigin = this.clinicService.gridToScreen(0, 0, ox, oy);
    const rightCorner = this.clinicService.gridToScreen(w, 0, ox, oy);
    return `${topOrigin.x},${topOrigin.y} ${rightCorner.x},${rightCorner.y} ${rightCorner.x},${rightCorner.y - wallH} ${topOrigin.x},${topOrigin.y - wallH}`;
  });

  readonly windowLeftPoints = computed(() => {
    const ox = this.originX();
    const oy = this.originY();
    const p1 = this.clinicService.gridToScreen(0, 1, ox, oy);
    const p2 = this.clinicService.gridToScreen(0, 3, ox, oy);
    return `${p2.x},${p2.y - 16} ${p1.x},${p1.y - 16} ${p1.x},${p1.y - 50} ${p2.x},${p2.y - 50}`;
  });

  readonly plaqueRightPoints = computed(() => {
    const ox = this.originX();
    const oy = this.originY();
    const p1 = this.clinicService.gridToScreen(1, 0, ox, oy);
    const p2 = this.clinicService.gridToScreen(2.2, 0, ox, oy);
    return `${p1.x},${p1.y - 22} ${p2.x},${p2.y - 22} ${p2.x},${p2.y - 46} ${p1.x},${p1.y - 46}`;
  });

  readonly slabLeftLipPoints = computed(() => {
    const w = this.gridWidthSignal();
    const h = this.gridHeightSignal();
    const ox = this.originX();
    const oy = this.originY();
    const left = this.clinicService.gridToScreen(0, h, ox, oy);
    const bottom = this.clinicService.gridToScreen(w, h, ox, oy);
    return `${left.x},${left.y} ${bottom.x},${bottom.y} ${bottom.x},${bottom.y + 10} ${left.x},${left.y + 10}`;
  });

  readonly slabRightLipPoints = computed(() => {
    const w = this.gridWidthSignal();
    const h = this.gridHeightSignal();
    const ox = this.originX();
    const oy = this.originY();
    const right = this.clinicService.gridToScreen(w, 0, ox, oy);
    const bottom = this.clinicService.gridToScreen(w, h, ox, oy);
    return `${bottom.x},${bottom.y} ${right.x},${right.y} ${right.x},${right.y + 10} ${bottom.x},${bottom.y + 10}`;
  });

  readonly slabShadowPoints = computed(() => {
    const w = this.gridWidthSignal();
    const h = this.gridHeightSignal();
    const ox = this.originX();
    const oy = this.originY() + 18;
    const top = this.clinicService.gridToScreen(0, 0, ox, oy);
    const right = this.clinicService.gridToScreen(w, 0, ox, oy);
    const bottom = this.clinicService.gridToScreen(w, h, ox, oy);
    const left = this.clinicService.gridToScreen(0, h, ox, oy);
    return `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`;
  });

  /**
   * P-085 & P-087: Ordenação determinística de itens com suporte a itens de parede e superfícies desacopladas.
   */
  readonly sortedRenderItems = computed<SortedRenderItem[]>(() => {
    const items = this.placedItemsSignal();
    const catalog = this.catalogSignal();
    const ox = this.originX();
    const oy = this.originY();
    const catMap = new Map(catalog.map(c => [c.id, c]));

    return items
      .filter(i => {
        if (!i.placed) return false;
        // Superfícies desacopladas pertencem à clínica e não entram como blocos soltos no chão
        if (
          i.placementType === 'SURFACE_WALL' ||
          i.placementType === 'SURFACE_FLOOR' ||
          i.catalogItemId === 'ped_papel_safari'
        ) {
          return false;
        }
        return true;
      })
      .map(placed => {
        const catalogItem =
          catMap.get(placed.catalogItemId) ??
          CLINIC_CATALOG_FALLBACK.find(c => c.id === placed.catalogItemId) ??
          CLINIC_CATALOG_FALLBACK[0];

        const isWall =
          placed.placementType === 'WALL' ||
          catalogItem.placementType === 'WALL' ||
          placed.catalogItemId === 'ped_regua_girafa' ||
          placed.catalogItemId === 'negatoscopio_led';

        if (isWall) {
          const wallSide = placed.wallSide ?? (placed.gridX === 0 ? 'NW' : 'NE');
          const tileIdx =
            placed.wallTileIndex ??
            (wallSide === 'NW' ? placed.gridY ?? 0 : placed.gridX ?? 0);
          const elev = placed.elevationZ ?? 42;

          let wallBaseScreen: { x: number; y: number };
          if (wallSide === 'NW') {
            wallBaseScreen = this.clinicService.gridToScreen(0, tileIdx + 0.5, ox, oy);
          } else {
            wallBaseScreen = this.clinicService.gridToScreen(tileIdx + 0.5, 0, ox, oy);
          }

          return {
            placed: { ...placed, placementType: 'WALL' as PlacementType, wallSide: wallSide as any },
            catalogItem,
            screenX: wallBaseScreen.x,
            screenY: wallBaseScreen.y - elev,
            depth: this.clinicService.calculateDepth(
              wallSide === 'NW' ? 0 : tileIdx,
              wallSide === 'NW' ? tileIdx : 0,
              25
            ),
            effWidth: 1,
            effHeight: 1,
            wallSide
          };
        }

        const { width: effWidth, height: effHeight } =
          this.clinicService.getEffectiveFootprint(catalogItem, placed.rotation ?? 0);

        const gx = placed.gridX ?? 0;
        const gy = placed.gridY ?? 0;
        const anchorCenter = this.clinicService.gridToScreen(
          gx + effWidth / 2,
          gy + effHeight / 2,
          ox,
          oy
        );

        const depth = this.clinicService.calculateDepth(
          gx + effWidth - 1,
          gy + effHeight - 1,
          10
        );

        return {
          placed,
          catalogItem,
          screenX: anchorCenter.x,
          screenY: anchorCenter.y,
          depth,
          effWidth,
          effHeight
        };
      })
      .sort((a, b) => a.depth - b.depth);
  });

  /**
   * P-084 & P-086: Ghost Preview Isométrico Verde (válido) ou Vermelho (colisão/fora de limite).
   */
  readonly ghostPreview = computed<GhostPreviewRender | null>(() => {
    if (!this.editModeSignal()) {
      return null;
    }

    if (this.isMovingDoctorSignal()) {
      const hover = this.hoveredTile();
      if (!hover) return null;
      const valid = this.isDoctorHoverValid();
      const ox = this.originX();
      const oy = this.originY();
      const top = this.clinicService.gridToScreen(hover.gridX, hover.gridY, ox, oy);
      const right = this.clinicService.gridToScreen(hover.gridX + 1, hover.gridY, ox, oy);
      const bottom = this.clinicService.gridToScreen(hover.gridX + 1, hover.gridY + 1, ox, oy);
      const left = this.clinicService.gridToScreen(hover.gridX, hover.gridY + 1, ox, oy);
      const center = this.clinicService.gridToScreen(hover.gridX + 0.5, hover.gridY + 0.5, ox, oy);
      return {
        gridX: hover.gridX,
        gridY: hover.gridY,
        effWidth: 1,
        effHeight: 1,
        screenX: center.x,
        screenY: center.y,
        points: `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`,
        valid,
        catalogItem: CLINIC_CATALOG_FALLBACK[0],
        rotation: 0
      };
    }

    const sel = this.selectedCatalogItemSignal();
    const hover = this.hoveredTile();
    if (!sel || !hover) {
      return null;
    }

    const rot = this.selectedRotationSignal();
    const isWall =
      sel.placementType === 'WALL' ||
      (sel.footprintX === 0 && sel.footprintY === 0) ||
      sel.id === 'ped_regua_girafa' ||
      sel.id === 'negatoscopio_led';

    const valid = this.clinicService.isPositionValid(
      hover.gridX,
      hover.gridY,
      sel.footprintX,
      sel.footprintY,
      rot,
      this.gridWidthSignal(),
      this.gridHeightSignal(),
      this.placedItemsSignal(),
      this.catalogSignal(),
      this.movingPlacedIdSignal()
    );

    const ox = this.originX();
    const oy = this.originY();

    if (isWall) {
      const wallSide: 'NW' | 'NE' = hover.gridX === 0 ? 'NW' : 'NE';
      const maxIdx =
        (wallSide === 'NW' ? this.gridHeightSignal() : this.gridWidthSignal()) - 1;
      const tileIdx = Math.max(
        0,
        Math.min(hover.gridX === 0 ? hover.gridY : hover.gridX, maxIdx)
      );
      const wallH = 68;

      let wallBase: { x: number; y: number };
      let pTopLeft: { x: number; y: number };
      let pTopRight: { x: number; y: number };
      let pBottomRight: { x: number; y: number };
      let pBottomLeft: { x: number; y: number };

      if (wallSide === 'NW') {
        wallBase = this.clinicService.gridToScreen(0, tileIdx + 0.5, ox, oy);
        const b0 = this.clinicService.gridToScreen(0, tileIdx, ox, oy);
        const b1 = this.clinicService.gridToScreen(0, tileIdx + 1, ox, oy);
        pBottomLeft = b1;
        pBottomRight = b0;
        pTopRight = { x: b0.x, y: b0.y - wallH };
        pTopLeft = { x: b1.x, y: b1.y - wallH };
      } else {
        wallBase = this.clinicService.gridToScreen(tileIdx + 0.5, 0, ox, oy);
        const b0 = this.clinicService.gridToScreen(tileIdx, 0, ox, oy);
        const b1 = this.clinicService.gridToScreen(tileIdx + 1, 0, ox, oy);
        pBottomLeft = b0;
        pBottomRight = b1;
        pTopRight = { x: b1.x, y: b1.y - wallH };
        pTopLeft = { x: b0.x, y: b0.y - wallH };
      }

      const isWallRuler =
        sel.id === 'ped_regua_girafa' || sel.id === 'estadiometro_compacto';
      const posY = isWallRuler ? wallBase.y : wallBase.y - 34;

      return {
        gridX: hover.gridX,
        gridY: hover.gridY,
        effWidth: 1,
        effHeight: 1,
        screenX: wallBase.x,
        screenY: posY,
        points: `${pBottomLeft.x},${pBottomLeft.y} ${pBottomRight.x},${pBottomRight.y} ${pTopRight.x},${pTopRight.y} ${pTopLeft.x},${pTopLeft.y}`,
        valid,
        catalogItem: sel,
        rotation: rot,
        wallSide
      };
    }

    const { width: effWidth, height: effHeight } =
      this.clinicService.getEffectiveFootprint(sel, rot);

    const top = this.clinicService.gridToScreen(hover.gridX, hover.gridY, ox, oy);
    const right = this.clinicService.gridToScreen(
      hover.gridX + effWidth,
      hover.gridY,
      ox,
      oy
    );
    const bottom = this.clinicService.gridToScreen(
      hover.gridX + effWidth,
      hover.gridY + effHeight,
      ox,
      oy
    );
    const left = this.clinicService.gridToScreen(
      hover.gridX,
      hover.gridY + effHeight,
      ox,
      oy
    );
    const center = this.clinicService.gridToScreen(
      hover.gridX + effWidth / 2,
      hover.gridY + effHeight / 2,
      ox,
      oy
    );

    return {
      gridX: hover.gridX,
      gridY: hover.gridY,
      effWidth,
      effHeight,
      screenX: center.x,
      screenY: center.y,
      points: `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`,
      valid,
      catalogItem: sel,
      rotation: rot
    };
  });

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityHandler);
      if (document.hidden) {
        this.isPaused.set(true);
      } else {
        this.startAnimationLoop();
      }
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
    this.stopAnimationLoop();
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
    }
  }

  startAnimationLoop(): void {
    if (this.isLoopRunning() || (typeof document !== 'undefined' && document.hidden)) {
      return;
    }
    this.isLoopRunning.set(true);
    const step = (timestamp: number): void => {
      if (!this.isLoopRunning() || (typeof document !== 'undefined' && document.hidden)) {
        this.isLoopRunning.set(false);
        return;
      }
      this.frameTick.set(Math.floor(timestamp / 250));
      if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        this.rafId = window.requestAnimationFrame(step);
      }
    };
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      this.rafId = window.requestAnimationFrame(step);
    }
  }

  stopAnimationLoop(): void {
    this.isLoopRunning.set(false);
    if (this.rafId !== null && typeof window !== 'undefined' && 'cancelAnimationFrame' in window) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  onTileHover(gridX: number, gridY: number): void {
    this.hoveredTile.set({ gridX, gridY });
  }

  onTileClick(gridX: number, gridY: number, event?: MouseEvent): void {
    event?.stopPropagation();
    if (this.hasDragged || this.isDragging()) {
      return;
    }
    this.hoveredTile.set({ gridX, gridY });
    if (this.editModeSignal()) {
      this.tileClicked.emit({ gridX, gridY });
    }
  }

  onWallSliceHover(side: 'NW' | 'NE', index: number): void {
    if (side === 'NW') {
      this.hoveredTile.set({ gridX: 0, gridY: index });
    } else {
      this.hoveredTile.set({ gridX: index, gridY: 0 });
    }
  }

  onWallSliceClick(side: 'NW' | 'NE', index: number, event?: MouseEvent): void {
    event?.stopPropagation();
    if (this.hasDragged || this.isDragging()) {
      return;
    }
    if (side === 'NW') {
      this.hoveredTile.set({ gridX: 0, gridY: index });
      if (this.editModeSignal()) {
        this.tileClicked.emit({ gridX: 0, gridY: index, fromWall: true });
      }
    } else {
      this.hoveredTile.set({ gridX: index, gridY: 0 });
      if (this.editModeSignal()) {
        this.tileClicked.emit({ gridX: index, gridY: 0, fromWall: true });
      }
    }
  }

  onPlacedItemClick(entry: SortedRenderItem, event: MouseEvent): void {
    event.stopPropagation();
    if (this.hasDragged || this.isDragging()) {
      return;
    }
    if (this.editModeSignal()) {
      this.placedItemClicked.emit(entry.placed);
      return;
    }

    this.pulsingItemId.set(entry.placed.id);
    this.audioService.playItemSound(entry.catalogItem.soundFxUrl);
    this.activeItemBubble.set({
      name: entry.catalogItem.name,
      description: entry.catalogItem.description ?? 'Item da sua clínica médica.'
    });

    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
    }
    this.bubbleTimer = setTimeout(() => {
      this.pulsingItemId.set(null);
      this.activeItemBubble.set(null);
    }, 2800);

    this.placedItemClicked.emit(entry.placed);
  }

  zoomIn(): void {
    this.zoom.update(z => Math.min(1.75, Number((z + 0.15).toFixed(2))));
  }

  zoomOut(): void {
    this.zoom.update(z => Math.max(0.6, Number((z - 0.15).toFixed(2))));
  }

  resetCamera(): void {
    this.zoom.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  onPointerDown(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    this.isPointerActive = true;
    this.hasDragged = false;
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
    this.dragStartX = event.clientX - this.panX();
    this.dragStartY = event.clientY - this.panY();
  }

  onPointerMove(event: MouseEvent): void {
    if (!this.isPointerActive) {
      return;
    }
    const dist = Math.hypot(
      event.clientX - this.pointerStartX,
      event.clientY - this.pointerStartY
    );
    if (!this.isDragging() && dist > 5) {
      this.hasDragged = true;
      this.isDragging.set(true);
    }
    if (this.isDragging()) {
      this.panX.set(event.clientX - this.dragStartX);
      this.panY.set(event.clientY - this.dragStartY);
    }
  }

  onPointerUp(): void {
    this.isPointerActive = false;
    this.isDragging.set(false);
    setTimeout(() => {
      this.hasDragged = false;
    }, 80);
  }

  onDoctorAvatarClick(event: MouseEvent): void {
    event.stopPropagation();
    this.avatarClicked.emit();
    this.audioService.playClick();
    this.doctorGreetingActive.set(true);

    setTimeout(() => {
      this.doctorGreetingActive.set(false);
    }, 650);
  }
}
