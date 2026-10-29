import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ClinicCatalogItem,
  ItemRarity,
  LootboxOpenResult,
  LootboxTier,
  LootboxTierInfo,
  RARITY_CONFIG
} from '../../../../core/models/clinic.model';
import { ClinicItemSvgComponent } from '../clinic-item-svg/clinic-item-svg.component';

@Component({
  selector: 'app-clinic-lootbox-modal',
  standalone: true,
  imports: [CommonModule, ClinicItemSvgComponent],
  templateUrl: './clinic-lootbox-modal.component.html',
  styleUrl: './clinic-lootbox-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicLootboxModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly currentXp = input<number>(0);
  readonly lootboxTiers = input<LootboxTierInfo[]>([]);
  readonly isDailyFreeAvailable = input<boolean>(false);
  readonly isLoading = input<boolean>(false);

  readonly isUnboxing = input<boolean>(false);
  readonly unboxingPhase = input<'shake' | 'open' | 'reveal'>('shake');
  readonly openingRayColor = input<string>('#94A3B8');
  readonly openingTierAssetSvgKey = input<string>('lootbox_tier1_resident');
  readonly revealResult = input<LootboxOpenResult | null>(null);

  readonly closeModal = output<void>();
  readonly openDailyFree = output<void>();
  readonly openTier = output<LootboxTier>();
  readonly equipItem = output<ClinicCatalogItem>();
  readonly resetRoll = output<void>();

  getRarityColor(item?: ClinicCatalogItem): string {
    const rarity = item?.rarity ?? 'COMMON';
    return RARITY_CONFIG[rarity]?.color ?? '#94A3B8';
  }

  getRarityLabel(item?: ClinicCatalogItem): string {
    const rarity = item?.rarity ?? 'COMMON';
    return RARITY_CONFIG[rarity]?.label ?? 'Comum';
  }

  getRarityGlow(rarity?: ItemRarity): string {
    const r = rarity ?? 'COMMON';
    const color = RARITY_CONFIG[r]?.color ?? '#94A3B8';
    return `0 0 35px ${color}88, inset 0 0 20px ${color}33`;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onOpenDailyFree(): void {
    this.openDailyFree.emit();
  }

  onOpenTier(tier: LootboxTier): void {
    this.openTier.emit(tier);
  }

  onEquip(item: ClinicCatalogItem): void {
    this.equipItem.emit(item);
  }

  onReset(): void {
    this.resetRoll.emit();
  }
}
