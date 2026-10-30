import {
  Component,
  HostListener,
  OnInit,
  computed,
  effect,
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
import { DoctorWardrobeModalComponent } from './components/doctor-wardrobe-modal/doctor-wardrobe-modal.component';
import { ClinicLootboxModalComponent } from './components/clinic-lootbox-modal/clinic-lootbox-modal.component';
import { ClinicCatalogDrawerComponent } from './components/clinic-catalog-drawer/clinic-catalog-drawer.component';
import { ClinicErrorModalComponent } from './components/clinic-error-modal/clinic-error-modal.component';

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
    DoctorWardrobeModalComponent,
    ClinicLootboxModalComponent,
    ClinicCatalogDrawerComponent,
    ClinicErrorModalComponent,
    ClinicViewportComponent,
  ],
  templateUrl: './minha-clinica.component.html',
  styleUrl: './minha-clinica.component.scss'
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
  readonly isMovingDoctor = signal<boolean>(false);
  readonly workingPlacedItems = signal<ClinicPlacedItem[]>([]);
  readonly isLayoutDirty = signal<boolean>(false);
  readonly localError = signal<string | null>(null);
  readonly activeErrorModalMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const srvErr = this.clinicService.error();
      if (srvErr && !this.activeErrorModalMessage()) {
        this.showErrorModal(srvErr);
      }
    });
  }

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
  readonly previewWallTheme = signal<string | null>(null);
  readonly previewFloorTheme = signal<string | null>(null);
  readonly tempFloorTheme = signal<string>('wood_light');

  readonly coatOptions = [
    { id: 'coat_default', name: 'Jaleco Branco Clássico', costXp: 0 },
    { id: 'coat_intern_white', name: 'Jaleco Tradicional Internato', costXp: 0 },
    { id: 'coat_scrubs_navy', name: 'Scrub Azul Marinho Plantão', costXp: 500 },
    { id: 'coat_scrubs_green', name: 'Scrub Verde Cirúrgico', costXp: 800 },
    { id: 'coat_pediatric', name: 'Jaleco Pediátrico Bichinhos', costXp: 500 },
    { id: 'coat_pediatric_dino', name: 'Jaleco Estampado Dinossauro', costXp: 1200 },
    { id: 'coat_executive_doc', name: 'Jaleco Executivo Alfaiataria Nobre', costXp: 2500 },
    { id: 'coat_gold', name: 'Jaleco Mestre Ouro & Caduceu', costXp: 2500 }
  ];

  readonly stethOptions = [
    { id: 'steth_standard', name: 'Estetoscópio Preto Clássico', costXp: 0 },
    { id: 'steth_classic_black', name: 'Estetoscópio Preto Básico', costXp: 0 },
    { id: 'steth_none', name: 'Sem Estetoscópio', costXp: 0 },
    { id: 'steth_elephant', name: 'Protetor Elefantinho Pediátrico', costXp: 350 },
    { id: 'steth_cardio_burgundy', name: 'Esteto Cardiológico Vinho', costXp: 700 },
    { id: 'ped_steth_elefante', name: 'Esteto Pediátrico Elefante', costXp: 950 },
    { id: 'steth_gold', name: 'Estetoscópio Master Ouro Maciço', costXp: 1800 },
    { id: 'steth_gold_master', name: 'Esteto Master Ouro 24k', costXp: 3000 }
  ];

  readonly accessoryOptions = [
    { id: 'acc_none', name: 'Nenhum Acessório', costXp: 0 },
    { id: 'acc_red_bowtie', name: 'Gravata Borboleta Vermelha', costXp: 400 },
    { id: 'acc_glasses_classic', name: 'Óculos de Armação Redonda', costXp: 400 },
    { id: 'acc_scrub_cap', name: 'Touca Cirúrgica Teal Nórdica', costXp: 600 },
    { id: 'acc_ped_gorro_colorido', name: 'Gorro Cirúrgico Safari', costXp: 600 },
    { id: 'acc_prontuario_clipboard', name: 'Prancheta Médica na Mão', costXp: 850 }
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

  readonly placedItemCatalogIds = computed<string[]>(() =>
    this.workingPlacedItems()
      .filter(p => p.placed)
      .map(p => p.catalogItemId)
  );

  readonly currentAvatar = computed<DoctorAvatar | undefined>(() => {
    return this.clinic()?.avatar;
  });

  readonly doctorNameOnly = computed<string>(() => {
    const clinic = this.clinic();
    const fullName = clinic?.userName || 'Lari';
    return clinic?.userFirstName || fullName.trim().split(/\s+/)[0];
  });

  readonly unlockedSkinIds = computed<string[]>(() => {
    return this.clinicService.doctorAvatarResponse()?.unlockedSkins ?? [];
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
    if (!state?.nextExpansionLevel) {
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
    if (this.editMode()) {
      if (this.isLayoutDirty()) {
        this.saveCurrentLayout();
        return;
      }
      this.editMode.set(false);
      this.selectedCatalogItem.set(null);
      this.movingPlacedId.set(undefined);
      this.isMovingDoctor.set(false);
      this.audioService.playClick();
      return;
    }
    this.editMode.set(true);
    this.audioService.playClick();
  }

  onAvatarViewportClick(): void {
    if (this.editMode()) {
      this.startMovingDoctor();
    } else {
      this.openAvatarCustomizer();
    }
  }

  startMovingDoctor(): void {
    this.isMovingDoctor.set(true);
    this.selectedCatalogItem.set(null);
    this.movingPlacedId.set(undefined);
    this.localError.set(null);
    this.audioService.playClick();
  }

  toggleMovingDoctor(): void {
    if (this.isMovingDoctor()) {
      this.isMovingDoctor.set(false);
    } else {
      this.startMovingDoctor();
    }
  }

  cancelMovingDoctor(): void {
    this.isMovingDoctor.set(false);
  }

  toggleRotation(): void {
    const nextRot = (this.selectedRotation() + 1) % 4;
    this.selectedRotation.set(nextRot);
    const targetId = this.movingPlacedId();
    if (targetId) {
      this.workingPlacedItems.update(list =>
        list.map(item => (item.id === targetId ? { ...item, rotation: nextRot } : item))
      );
      this.isLayoutDirty.set(true);
    }
    this.audioService.playClick();
  }

  getRotationLabel(rotation: number): string {
    switch (rotation % 4) {
      case 1:
        return 'Aresta SW (Frente-Esquerda)';
      case 2:
        return 'Aresta NW (Fundo-Esquerda)';
      case 3:
        return 'Aresta NE (Fundo-Direita)';
      default:
        return 'Aresta SE (Frente-Direita)';
    }
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

  onViewportTileClicked(coords: { gridX: number; gridY: number; fromWall?: boolean }): void {
    const state = this.clinic();
    if (!this.editMode() || !state) {
      return;
    }

    // Caso A: Doutor(a) selecionado(a) para mover de lugar
    if (this.isMovingDoctor()) {
      const itemOnTile = this.findPlacedItemAtTile(coords.gridX, coords.gridY, coords.fromWall);
      if (itemOnTile) {
        this.showErrorModal(
          `Posição (${coords.gridX}, ${coords.gridY}) já ocupada por um móvel. Escolha um piso livre para o(a) Doutor(a).`
        );
        return;
      }

      this.localError.set(null);
      this.isMovingDoctor.set(false);
      this.audioService.playPlaceItem();

      const current = this.currentAvatar();
      const updatedAvatar: DoctorAvatar = {
        gender: current?.gender ?? 'FEMALE',
        skinCoat: current?.skinCoat ?? 'coat_intern_white',
        skinStethoscope: current?.skinStethoscope ?? 'steth_classic_black',
        skinAccessory: current?.skinAccessory ?? 'acc_none',
        avatarX: coords.gridX,
        avatarY: coords.gridY
      };

      // Atualização otimista imediata no viewport
      this.clinicService.clinicState.set({
        ...state,
        avatar: updatedAvatar
      });

      // Persiste no backend
      this.clinicService.updateDoctorAvatar({
        avatarX: coords.gridX,
        avatarY: coords.gridY
      }).subscribe({
        next: resp => {
          const s = this.clinic();
          if (s) {
            this.clinicService.clinicState.set({
              ...s,
              avatar: {
                ...updatedAvatar,
                avatarId: resp.avatarId ?? updatedAvatar.avatarId,
                avatarX: resp.avatarX,
                avatarY: resp.avatarY
              }
            });
          }
        },
        error: () => {
          // Mantém fallback otimista
        }
      });
      return;
    }

    const sel = this.selectedCatalogItem();
    // Caso B: Item selecionado para posicionar ou mover
    if (sel) {
      const isWall =
        sel.placementType === 'WALL' ||
        (sel.footprintX === 0 && sel.footprintY === 0) ||
        sel.id === 'ped_regua_girafa' ||
        sel.id === 'negatoscopio_led';

      if (isWall && coords.gridX !== 0 && coords.gridY !== 0) {
        this.showErrorModal(
          'Itens de parede devem ser fixados em segmentos de parede (linha superior ou lateral esquerda).'
        );
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
        this.showErrorModal(
          `Posição (${coords.gridX}, ${coords.gridY}) inválida: há colisão com outro móvel ou extrapola o limite ${state.gridWidth}×${state.gridHeight}.`
        );
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
      let elevationZ: number | undefined;
      if (isWall) {
        elevationZ = (sel.id === 'ped_regua_girafa' || sel.id === 'estadiometro_compacto') ? 0 : 76;
      }

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

    // Caso C: Nenhum item em mãos — se clicou no piso onde o(a) Doutor(a) está, seleciona para mover!
    const currentDoc = this.currentAvatar();
    if (currentDoc?.avatarX === coords.gridX && currentDoc?.avatarY === coords.gridY) {
      this.startMovingDoctor();
      return;
    }

    // Caso D: Nenhum item em mãos — se clicou em um tile ou fatia de parede que possui um item, seleciona-o para mover!
    const itemOnTile = this.findPlacedItemAtTile(coords.gridX, coords.gridY, coords.fromWall);
    if (itemOnTile) {
      this.onViewportPlacedItemClicked(itemOnTile);
    }
  }

  findPlacedItemAtTile(
    gridX: number,
    gridY: number,
    preferWall = false
  ): ClinicPlacedItem | undefined {
    const catalog = this.clinic()?.catalog ?? CLINIC_CATALOG_FALLBACK;
    const catMap = new Map(catalog.map(c => [c.id, c]));
    const items = this.workingPlacedItems();

    const isWallTile = gridX === 0 || gridY === 0;
    const shouldCheckWallFirst = preferWall || isWallTile;

    const findWall = (): ClinicPlacedItem | undefined => {
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
    };

    const findFloor = (): ClinicPlacedItem | undefined => {
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
      return undefined;
    };

    if (shouldCheckWallFirst) {
      return findWall() ?? findFloor();
    }
    return findFloor() ?? findWall();
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
      id: item.id && !item.id.startsWith('placed-') ? item.id : undefined,
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
      this.showErrorModal('Saldo de XP insuficiente para realizar esta operação.');
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
    this.closeErrorModal();
  }

  showErrorModal(rawMessage: string | null): void {
    if (!rawMessage) return;
    const cleanMsg = this.sanitizeErrorMessage(rawMessage);
    this.activeErrorModalMessage.set(cleanMsg);
    this.localError.set(cleanMsg);
    this.audioService.playErrorShake();
  }

  closeErrorModal(): void {
    this.activeErrorModalMessage.set(null);
    this.localError.set(null);
    this.lootboxErrorMessage.set(null);
    this.clinicService.error.set(null);
    this.audioService.playClick();
  }

  sanitizeErrorMessage(raw: string): string {
    if (!raw) return 'Não foi possível concluir a ação no momento. Por favor, tente novamente.';
    const lower = raw.toLowerCase();
    if (
      lower.includes('json') ||
      lower.includes('deserialize') ||
      lower.includes('uuid') ||
      lower.includes('could not execute') ||
      lower.includes('check constraint') ||
      lower.includes('failing row') ||
      lower.includes('insert into') ||
      lower.includes('violates') ||
      lower.includes('sql') ||
      lower.includes('nullpointer') ||
      lower.includes('exception') ||
      lower.includes('bad request') ||
      lower.includes('internal server') ||
      lower.includes('status code') ||
      lower.includes('error:') ||
      lower.includes('java.') ||
      lower.includes('stacktrace') ||
      lower.includes('500') ||
      lower.includes('400')
    ) {
      return 'Não foi possível salvar o layout do consultório no momento. Por favor, tente novamente.';
    }
    return raw;
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

  buySkinPrompt(skinId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    const currentXp = this.clinic()?.currentXp ?? 0;
    const allSkins = [...this.coatOptions, ...this.stethOptions, ...this.accessoryOptions];
    const target = allSkins.find(s => s.id === skinId);
    if (!target) return;

    if (currentXp < target.costXp) {
      this.showErrorModal(`Saldo de XP insuficiente (${currentXp}/${target.costXp} XP).`);
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
          this.showErrorModal('Não foi possível desbloquear o item cosmético.');
        }
      }
    });
  }

  saveAvatarCustomization(data?: { gender: 'MALE' | 'FEMALE'; skinCoat: string; skinStethoscope: string; skinAccessory: string }): void {
    if (data) {
      this.tempAvatarGender.set(data.gender);
      this.tempAvatarCoat.set(data.skinCoat);
      this.tempAvatarSteth.set(data.skinStethoscope);
      this.tempAvatarAccessory.set(data.skinAccessory);
    }
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
      this.showErrorModal(`Você está provando "${lockedNames.join(', ')}", que ainda não foi desbloqueado. Clique no botão Desbloquear para adquiri-lo com seu XP antes de salvar.`);
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

  previewSurface(event: { type: 'wall' | 'floor'; id: string }): void {
    if (event.type === 'wall') {
      this.previewWallTheme.set(this.previewWallTheme() === event.id ? null : event.id);
    } else {
      this.previewFloorTheme.set(this.previewFloorTheme() === event.id ? null : event.id);
    }
    this.audioService.playClick();
  }

  cancelSurfacePreview(): void {
    this.previewWallTheme.set(null);
    this.previewFloorTheme.set(null);
  }

  applyWallpaperDirectly(wallId: string): void {
    this.previewWallTheme.set(null);
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
    this.previewFloorTheme.set(null);
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
      this.showErrorModal(`Saldo de XP insuficiente (${state.currentXp}/${wall.costXp} XP).`);
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
      this.showErrorModal(`Saldo de XP insuficiente (${state.currentXp}/${floor.costXp} XP).`);
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
        this.showErrorModal(
          err?.error?.message ||
            'Não foi possível resgatar a caixa diária gratuita. Tente novamente mais tarde.'
        );
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
      this.showErrorModal(`Saldo de XP insuficiente. Você precisa de ${cost} XP.`);
      return;
    }

    this.lootboxErrorMessage.set(null);
    this.isUnboxing.set(true);
    this.unboxingPhase.set('shake');
    const lootboxSvgMap: Record<LootboxTier, string> = {
      TIER_3_CHIEF_OF_STAFF: 'lootbox_tier3_chief',
      TIER_2_SPECIALIST: 'lootbox_tier2_specialist',
      TIER_1_RESIDENT: 'lootbox_tier1_resident'
    };
    this.openingTierAssetSvgKey.set(lootboxSvgMap[tier] ?? 'lootbox_tier1_resident');
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
        this.showErrorModal(
          err?.error?.message ||
            'Não foi possível abrir a caixa agora. Nenhum XP foi debitado. Tente novamente.'
        );
      }
    });
  }
}
