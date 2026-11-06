import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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
  PlacementType,
  WallSide,
  getClinicRotationLabel
} from '@core/models/clinic.model';
import { ClinicService } from '@core/services/clinic.service';
import { ClinicAudioService } from '@core/services/clinic-audio.service';
import { ClinicItemSvgComponent } from '../clinic-item-svg/clinic-item-svg.component';
import { DoctorAvatarSvgComponent } from '../doctor-avatar-svg/doctor-avatar-svg.component';
import { ClinicIsometricUtil } from './clinic-isometric.util';

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
  templateUrl: './clinic-viewport.component.html',
  styleUrl: './clinic-viewport.component.scss'
})
export class ClinicViewportComponent implements OnInit, AfterViewInit, OnDestroy {
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
    if (Boolean(val) !== this.isMovingDoctorSignal()) {
      this.touchPreviewKey = null;
    }
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
    if ((val ?? null) !== this.selectedCatalogItemSignal()) {
      this.touchPreviewKey = null;
    }
    this.selectedCatalogItemSignal.set(val ?? null);
  }
  get selectedCatalogItem(): ClinicCatalogItem | null {
    return this.selectedCatalogItemSignal();
  }

  @Input() set selectedRotation(val: number) {
    // P-084: a rotação persistida é binária (0 = SE, 1 = SW)
    this.selectedRotationSignal.set(val % 2 === 1 ? 1 : 0);
  }
  get selectedRotation(): number {
    return this.selectedRotationSignal();
  }

  @Input() set movingPlacedId(val: string | undefined) {
    const changed = val !== this.movingPlacedIdSignal();
    this.movingPlacedIdSignal.set(val);
    if (changed && val) {
      this.focusHoverOnPlacedItem(val);
    }
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

  @Output() readonly tileClicked = new EventEmitter<{
    gridX: number;
    gridY: number;
    fromWall?: boolean;
    wallSide?: WallSide;
  }>();
  @Output() readonly placedItemClicked = new EventEmitter<ClinicPlacedItem>();
  @Output() readonly cancelPlacement = new EventEmitter<void>();

  @ViewChild('viewportShell', { static: true }) private readonly shellRef?: ElementRef<HTMLElement>;
  @Output() readonly rotateRequested = new EventEmitter<void>();
  @Output() readonly avatarClicked = new EventEmitter<void>();

  readonly doctorGreetingActive = signal<boolean>(false);

  readonly zoom = signal<number>(1);
  readonly panX = signal<number>(0);
  readonly panY = signal<number>(0);
  readonly isDragging = signal<boolean>(false);
  readonly hoveredTile = signal<{ gridX: number; gridY: number } | null>({ gridX: 0, gridY: 0 });
  /** Parede de origem do hover: o segmento 0 da NW e o da NE compartilham a coordenada (0, 0). */
  readonly hoveredWallSide = signal<WallSide | null>(null);
  /** Tipo do último ponteiro. No toque não existe hover: o 1º toque posiciona o ghost e o 2º confirma. */
  readonly lastPointerType = signal<string>('mouse');
  readonly isTouchPointer = computed(() => this.lastPointerType() === 'touch');
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
  private resizeObserver: ResizeObserver | null = null;
  /** Alvo (tile ou slot de parede) mostrado pelo último toque; só um 2º toque nele confirma. */
  private touchPreviewKey: string | null = null;
  private readonly shellSize = signal<{ width: number; height: number } | null>(null);

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

  /** Responsividade: encaixa o diorama inteiro no espaço disponível; o zoom do usuário é relativo a este ajuste. */
  readonly fitScale = computed(() => {
    const size = this.shellSize();
    if (!size || size.width <= 0 || size.height <= 0) {
      return 1;
    }
    const gutter = 24;
    const fit = Math.min(
      (size.width - gutter) / this.stageWidth(),
      (size.height - gutter) / this.stageHeight()
    );
    return Math.max(0.35, Math.min(1.5, fit));
  });

  readonly stageTransform = computed(
    () => `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom() * this.fitScale()})`
  );

  readonly rotationLabel = computed(() => getClinicRotationLabel(this.selectedRotationSignal()));

  readonly isPlacingWallItem = computed(() => {
    const sel = this.selectedCatalogItemSignal();
    return Boolean(sel && !this.isMovingDoctorSignal() && this.clinicService.isWallMountedItem(sel));
  });

  readonly placementHint = computed(() => {
    if (this.isTouchPointer()) {
      return this.isPlacingWallItem()
        ? 'Toque na parede para prever e toque de novo (ou ✓) para fixar.'
        : 'Toque no piso para prever e toque de novo (ou ✓) para confirmar.';
    }
    return this.isPlacingWallItem()
      ? 'Clique na parede (ou no piso rente a ela) para fixar · Esc cancela.'
      : 'Clique no piso para posicionar · R gira · Esc cancela.';
  });

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
      if (this.clinicService.isPlacedWallItem(item, cat)) continue;
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

  readonly nwWallSlices = computed(() =>
    ClinicIsometricUtil.computeWallSlices(
      'NW',
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly neWallSlices = computed(() =>
    ClinicIsometricUtil.computeWallSlices(
      'NE',
      this.gridWidthSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

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

  readonly tiles = computed<IsometricTileRender[]>(() =>
    ClinicIsometricUtil.computeTiles(
      this.gridWidthSignal(),
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly leftWallPoints = computed(() =>
    ClinicIsometricUtil.computeLeftWallPoints(
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly rightWallPoints = computed(() =>
    ClinicIsometricUtil.computeRightWallPoints(
      this.gridWidthSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly windowLeftPoints = computed(() =>
    ClinicIsometricUtil.computeWindowLeftPoints(
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly plaqueRightPoints = computed(() =>
    ClinicIsometricUtil.computePlaqueRightPoints(
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly slabLeftLipPoints = computed(() =>
    ClinicIsometricUtil.computeSlabLeftLipPoints(
      this.gridWidthSignal(),
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly slabRightLipPoints = computed(() =>
    ClinicIsometricUtil.computeSlabRightLipPoints(
      this.gridWidthSignal(),
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly slabLeftColor = computed(() => {
    switch (this.floorThemeSignal()) {
      case 'wood_dark_herringbone': return '#592507';
      case 'wood_light': return '#D6C6B2';
      case 'marble_carrara': return '#E2E8F0';
      case 'tatame_eva': return '#FDE68A';
      default: return '#CBD5E1';
    }
  });

  readonly slabRightColor = computed(() => {
    switch (this.floorThemeSignal()) {
      case 'wood_dark_herringbone': return '#451A03';
      case 'wood_light': return '#B8A793';
      case 'marble_carrara': return '#CBD5E1';
      case 'tatame_eva': return '#FCD34D';
      default: return '#94A3B8';
    }
  });

  readonly leftWallBricks = computed(() =>
    ClinicIsometricUtil.computeWallBricks(
      'NW',
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly rightWallBricks = computed(() =>
    ClinicIsometricUtil.computeWallBricks(
      'NE',
      this.gridWidthSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly leftWallFacets = computed(() =>
    ClinicIsometricUtil.computeWallGeometricFacets(
      'NW',
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly rightWallFacets = computed(() =>
    ClinicIsometricUtil.computeWallGeometricFacets(
      'NE',
      this.gridWidthSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

  readonly slabShadowPoints = computed(() =>
    ClinicIsometricUtil.computeSlabShadowPoints(
      this.gridWidthSignal(),
      this.gridHeightSignal(),
      this.originX(),
      this.originY(),
      (gx, gy, ox, oy) => this.clinicService.gridToScreen(gx, gy, ox, oy)
    )
  );

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
          placed.placementType === 'WALL' || this.clinicService.isWallMountedItem(catalogItem);

        if (isWall) {
          const wallSide = placed.wallSide ?? (placed.gridX === 0 ? 'NW' : 'NE');
          const tileIdx =
            placed.wallTileIndex ??
            (wallSide === 'NW' ? placed.gridY ?? 0 : placed.gridX ?? 0);
          const isFloorRuler =
            placed.catalogItemId === 'ped_regua_girafa' ||
            placed.catalogItemId === 'estadiometro_compacto';
          // P-087/P-090: Clamp matematico definitivo para itens de parede (garante que nenhum item voe fora do diorama)
          const rawElev =
            placed.elevationZ != null && placed.elevationZ >= 15 && placed.elevationZ <= 32
              ? placed.elevationZ
              : 28;
          const elev = isFloorRuler ? 0 : rawElev;

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
              -50
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
    if (!this.editModeSignal()) return null;

    if (this.isMovingDoctorSignal()) {
      const hover = this.hoveredTile();
      return hover ? this.computeDoctorGhostPreview(hover) : null;
    }

    const sel = this.selectedCatalogItemSignal();
    const hover = this.hoveredTile();
    if (!sel || !hover) return null;

    const rot = this.selectedRotationSignal();
    if (this.clinicService.isWallMountedItem(sel)) {
      // P-088: o ghost de parede encaixa no segmento mais próximo; a validação é por slot (lado + índice)
      const slot = this.clinicService.resolveWallSlot(hover.gridX, hover.gridY, this.hoveredWallSide());
      const wallValid = this.clinicService.isWallSlotFree(
        slot.wallSide,
        slot.wallTileIndex,
        this.gridWidthSignal(),
        this.gridHeightSignal(),
        this.placedItemsSignal(),
        this.catalogSignal(),
        this.movingPlacedIdSignal()
      );
      return this.computeWallGhostPreview(sel, hover, slot, rot, wallValid);
    }

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

    return this.computeFloorGhostPreview(sel, hover, rot, valid);
  });

  private computeDoctorGhostPreview(hover: { gridX: number; gridY: number }): GhostPreviewRender {
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

  private computeWallGhostPreview(
    sel: ClinicCatalogItem,
    hover: { gridX: number; gridY: number },
    slot: { wallSide: WallSide; wallTileIndex: number },
    rot: number,
    valid: boolean
  ): GhostPreviewRender {
    const ox = this.originX();
    const oy = this.originY();
    const wallSide = slot.wallSide;
    const maxIdx = (wallSide === 'NW' ? this.gridHeightSignal() : this.gridWidthSignal()) - 1;
    const tileIdx = Math.max(0, Math.min(slot.wallTileIndex, maxIdx));
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

    const isWallRuler = sel.id === 'ped_regua_girafa' || sel.id === 'estadiometro_compacto';
    const posY = isWallRuler ? wallBase.y : wallBase.y - 28;

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

  private computeFloorGhostPreview(
    sel: ClinicCatalogItem,
    hover: { gridX: number; gridY: number },
    rot: number,
    valid: boolean
  ): GhostPreviewRender {
    const ox = this.originX();
    const oy = this.originY();
    const { width: effWidth, height: effHeight } = this.clinicService.getEffectiveFootprint(sel, rot);
    const top = this.clinicService.gridToScreen(hover.gridX, hover.gridY, ox, oy);
    const right = this.clinicService.gridToScreen(hover.gridX + effWidth, hover.gridY, ox, oy);
    const bottom = this.clinicService.gridToScreen(hover.gridX + effWidth, hover.gridY + effHeight, ox, oy);
    const left = this.clinicService.gridToScreen(hover.gridX, hover.gridY + effHeight, ox, oy);
    const center = this.clinicService.gridToScreen(hover.gridX + effWidth / 2, hover.gridY + effHeight / 2, ox, oy);

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
  }

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

  ngAfterViewInit(): void {
    const shell = this.shellRef?.nativeElement;
    if (!shell) {
      return;
    }
    // Medição síncrona: o 1º callback do ResizeObserver só chega no próximo frame renderizado
    if (shell.clientWidth > 0 && shell.clientHeight > 0) {
      this.shellSize.set({ width: shell.clientWidth, height: shell.clientHeight });
    }
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        this.shellSize.set({ width: rect.width, height: rect.height });
      }
    });
    this.resizeObserver.observe(shell);
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
    this.resizeObserver?.disconnect();
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

  onTileHover(gridX: number, gridY: number, event?: PointerEvent): void {
    if (event?.pointerType === 'touch') {
      return; // Toque não tem hover: o preview acontece no 1º toque (handleGridTap)
    }
    this.setHover(gridX, gridY, null);
  }

  onTileClick(gridX: number, gridY: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.handleGridTap(gridX, gridY, null);
  }

  onWallSliceHover(side: WallSide, index: number, event?: PointerEvent): void {
    if (event?.pointerType === 'touch') {
      return;
    }
    this.setHover(side === 'NW' ? 0 : index, side === 'NW' ? index : 0, side);
  }

  onWallSliceClick(side: WallSide, index: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.handleGridTap(side === 'NW' ? 0 : index, side === 'NW' ? index : 0, side);
  }

  /** Confirma o posicionamento na posição em preview (botão ✓ da pílula de edição). */
  confirmPlacement(): void {
    const hover = this.hoveredTile();
    if (!hover || !this.editModeSignal() || !this.isPlacingItem()) {
      return;
    }
    this.emitTile(hover.gridX, hover.gridY, this.hoveredWallSide());
  }

  onCancelPlacement(): void {
    if (this.isMovingDoctorSignal()) {
      this.cancelMovingDoctor.emit();
    } else {
      this.cancelPlacement.emit();
    }
  }

  private handleGridTap(gridX: number, gridY: number, wallSide: WallSide | null): void {
    if (this.hasDragged || this.isDragging()) {
      return;
    }
    this.setHover(gridX, gridY, wallSide);
    if (!this.editModeSignal()) {
      return;
    }
    // No toque, o 1º toque só posiciona o ghost; confirmar exige tocar de novo no mesmo alvo (ou no ✓)
    const key = this.placementKey(gridX, gridY, wallSide);
    if (this.isTouchPointer() && this.isPlacingItem() && key !== this.touchPreviewKey) {
      this.touchPreviewKey = key;
      return;
    }
    this.touchPreviewKey = null;
    this.emitTile(gridX, gridY, wallSide);
  }

  /** Item de parede é comparado pelo slot resolvido (tocar no piso ou na faixa da parede dá no mesmo). */
  private placementKey(gridX: number, gridY: number, wallSide: WallSide | null): string {
    if (this.isPlacingWallItem()) {
      const slot = this.clinicService.resolveWallSlot(gridX, gridY, wallSide);
      return `wall:${slot.wallSide}:${slot.wallTileIndex}`;
    }
    return `tile:${gridX}:${gridY}`;
  }

  private emitTile(gridX: number, gridY: number, wallSide: WallSide | null): void {
    this.tileClicked.emit(wallSide ? { gridX, gridY, fromWall: true, wallSide } : { gridX, gridY });
  }

  private setHover(gridX: number, gridY: number, wallSide: WallSide | null): void {
    const current = this.hoveredTile();
    if (current?.gridX !== gridX || current?.gridY !== gridY) {
      this.hoveredTile.set({ gridX, gridY });
    }
    this.hoveredWallSide.set(wallSide);
  }

  /** Ao escolher um móvel para mover, o ghost nasce na posição atual dele (indispensável no toque). */
  private focusHoverOnPlacedItem(placedId: string): void {
    const item = this.placedItemsSignal().find(p => p.id === placedId);
    if (!item || item.gridX === null || item.gridY === null) {
      return;
    }
    const cat = this.catalogSignal().find(c => c.id === item.catalogItemId);
    if (this.clinicService.isPlacedWallItem(item, cat)) {
      const side: WallSide = item.wallSide ?? (item.gridX === 0 ? 'NW' : 'NE');
      const idx = item.wallTileIndex ?? (side === 'NW' ? item.gridY ?? 0 : item.gridX ?? 0);
      this.setHover(side === 'NW' ? 0 : idx, side === 'NW' ? idx : 0, side);
      this.touchPreviewKey = `wall:${side}:${idx}`;
      return;
    }
    this.setHover(item.gridX ?? 0, item.gridY ?? 0, null);
    this.touchPreviewKey = `tile:${item.gridX ?? 0}:${item.gridY ?? 0}`;
  }

  onPlacedItemClick(entry: SortedRenderItem, event: Event): void {
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

  onPointerDown(event: PointerEvent): void {
    this.lastPointerType.set(event.pointerType || 'mouse');
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

  onPointerMove(event: PointerEvent): void {
    if (!this.isPointerActive) {
      return;
    }
    const dist = Math.hypot(
      event.clientX - this.pointerStartX,
      event.clientY - this.pointerStartY
    );
    // Dedos tremem mais que o mouse: limiar maior evita que um toque vire arraste (e perca o clique)
    const dragThreshold = event.pointerType === 'mouse' ? 5 : 12;
    if (!this.isDragging() && dist > dragThreshold) {
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

  onDoctorAvatarClick(event: Event): void {
    event.stopPropagation();
    this.avatarClicked.emit();
    this.audioService.playClick();
    this.doctorGreetingActive.set(true);

    setTimeout(() => {
      this.doctorGreetingActive.set(false);
    }, 650);
  }
}
