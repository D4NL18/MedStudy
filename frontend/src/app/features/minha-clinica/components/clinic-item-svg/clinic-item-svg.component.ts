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
  templateUrl: './clinic-item-svg.component.html',
  styleUrl: './clinic-item-svg.component.scss'
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
