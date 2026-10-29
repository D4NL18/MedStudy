import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ClinicCatalogItem,
  ClinicCategory,
  ClinicState,
  ItemRarity,
  RARITY_CONFIG
} from '@core/models/clinic.model';
import { ClinicItemSvgComponent } from '../clinic-item-svg/clinic-item-svg.component';

export interface CategoryTabItem {
  id: ClinicCategory;
  label: string;
  count: number;
  badge: string;
}

export interface SurfaceOption {
  id: string;
  name: string;
  costXp: number;
  previewColor: string;
}

/**
 * Gaveta/Dock inferior deslizante de Catálogo e Inventário da Clínica (P-080, P-081, P-087).
 * Componente atômico para navegação de abas, filtros, cards de móveis, revestimentos e compras.
 */
@Component({
  selector: 'app-clinic-catalog-drawer',
  standalone: true,
  imports: [CommonModule, ClinicItemSvgComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clinic-catalog-drawer.component.html',
  styleUrl: './clinic-catalog-drawer.component.scss'
})
export class ClinicCatalogDrawerComponent {
  @Input({ required: true }) state!: ClinicState;
  @Input() activeCategory: ClinicCategory = 'mobiliario';
  @Input() inventoryFilter: 'all' | 'owned' = 'all';
  @Input() selectedCatalogItem: ClinicCatalogItem | null = null;
  @Input() selectedRotation: number = 0;
  @Input() movingPlacedId: string | undefined = undefined;
  @Input() editMode: boolean = false;
  @Input() isLayoutDirty: boolean = false;
  @Input() filteredCatalogItems: ClinicCatalogItem[] = [];
  @Input() categoryTabs: CategoryTabItem[] = [];
  @Input() totalCatalogCount: number = 0;
  @Input() wallpaperOptions: SurfaceOption[] = [];
  @Input() floorOptions: SurfaceOption[] = [];
  @Input() ownedItemIds: string[] = [];
  @Input() placedItemCatalogIds: string[] = [];
  @Input() unlockedSkinIds: string[] = [];
  @Input() previewWallTheme: string | null = null;
  @Input() previewFloorTheme: string | null = null;
  @Input() isLoading: boolean = false;

  @Output() readonly categorySelected = new EventEmitter<ClinicCategory>();
  @Output() readonly inventoryFilterChanged = new EventEmitter<'all' | 'owned'>();
  @Output() readonly rotateRequested = new EventEmitter<void>();
  @Output() readonly storeSelectedRequested = new EventEmitter<void>();
  @Output() readonly applyWallpaper = new EventEmitter<string>();
  @Output() readonly buyWallpaper = new EventEmitter<SurfaceOption>();
  @Output() readonly applyFloor = new EventEmitter<string>();
  @Output() readonly buyFloor = new EventEmitter<SurfaceOption>();
  @Output() readonly previewSurfaceRequested = new EventEmitter<{ type: 'wall' | 'floor'; id: string }>();
  @Output() readonly cancelPreviewRequested = new EventEmitter<void>();
  @Output() readonly selectForPlacement = new EventEmitter<ClinicCatalogItem>();
  @Output() readonly buyItem = new EventEmitter<ClinicCatalogItem>();
  @Output() readonly cardPreviewClicked = new EventEmitter<ClinicCatalogItem>();
  @Output() readonly openLootboxModalRequested = new EventEmitter<void>();

  isItemOwned(catalogItemId: string): boolean {
    return this.ownedItemIds.includes(catalogItemId);
  }

  isItemPlaced(catalogItemId: string): boolean {
    return this.placedItemCatalogIds.includes(catalogItemId);
  }

  isSurfaceOwned(surfaceId: string): boolean {
    if (surfaceId === 'clean_white' || surfaceId === 'wood_light') {
      return true;
    }
    return this.unlockedSkinIds.includes(surfaceId) || this.isItemOwned(surfaceId);
  }

  getRarityColor(item: ClinicCatalogItem): string {
    const rarity: ItemRarity = item.rarity ?? 'COMMON';
    return RARITY_CONFIG[rarity]?.color ?? '#64748B';
  }

  getRarityLabel(item: ClinicCatalogItem): string {
    const rarity: ItemRarity = item.rarity ?? 'COMMON';
    return RARITY_CONFIG[rarity]?.label ?? 'Comum';
  }

  getRotationLabel(rotation: number): string {
    switch (rotation) {
      case 90:
        return 'Direita (90°)';
      case 180:
        return 'Atrás (180°)';
      case 270:
        return 'Esquerda (270°)';
      default:
        return 'Frente (0°)';
    }
  }
}
