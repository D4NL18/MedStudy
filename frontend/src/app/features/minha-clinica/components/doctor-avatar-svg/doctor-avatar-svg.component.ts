import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorGender } from '@core/models/clinic.model';

/**
 * Componente SVG do Médico Residente da Clínica MedStudy (P-087, P-088, P-089).
 * Reformulação completa com estética chibi/vetorial 2.5D moderna, acolhedora e profissional:
 * - Proporções harmoniosas, olhos expressivos com brilho especular e traços amigáveis.
 * - Dr. Residente com topete quiff moderno e fade (sem calvície).
 * - Dra. Residente com coque elegante, franja suave e brincos dourados.
 * - Estetoscópio drapeado naturalmente nos ombros/peito (sem cruzar a face/boca).
 * - Jaleco bem estruturado com lapelas, botões, crachá de residente e mãos elegantes nos bolsos.
 * - Camadas desacopladas (Body, Coat, Stethoscope, Accessory) com animação suave de respiração e micro-salto ao clicar.
 */
@Component({
  selector: 'app-doctor-avatar-svg',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doctor-avatar-svg.component.html',
  styleUrl: './doctor-avatar-svg.component.scss'
})
export class DoctorAvatarSvgComponent {
  @Input() gender: DoctorGender = 'MALE';
  @Input() skinCoat = 'coat_default';
  @Input() skinStethoscope = 'steth_standard';
  @Input() skinAccessory = 'acc_none';
  @Input() width = 64;
  @Input() height = 88;
  @Input() activeAnimation = false;
  @Input() paused = false;

  get avatarAriaLabel(): string {
    const title = this.gender === 'FEMALE' ? 'Doutora Residente' : 'Doutor Residente';
    return `${title} da Clínica MedStudy`;
  }

  get normalizedCoat(): string {
    const c = this.skinCoat;
    if (c === 'coat_pediatric') return 'coat_pediatric';
    if (c === 'coat_pediatric_dino') return 'coat_pediatric_dino';
    if (c === 'coat_executive_doc') return 'coat_executive_doc';
    if (c === 'coat_gold') return 'coat_gold';
    if (c === 'coat_scrubs_navy') return 'coat_scrubs_navy';
    if (c === 'coat_scrubs_green') return 'coat_scrubs_green';
    if (c === 'coat_intern_white') return 'coat_intern_white';
    return 'coat_default';
  }

  get normalizedSteth(): string {
    const s = this.skinStethoscope;
    if (s === 'steth_none') return 'steth_none';
    if (s === 'steth_elephant' || s === 'ped_steth_elefante') return 'steth_elephant';
    if (s === 'steth_gold' || s === 'steth_gold_master') return 'steth_gold';
    if (s === 'steth_cardio_burgundy') return 'steth_cardio_burgundy';
    if (s === 'steth_classic_black') return 'steth_classic_black';
    return 'steth_standard';
  }

  get normalizedAccessory(): string {
    const a = this.skinAccessory;
    if (a === 'acc_red_bowtie') return 'acc_red_bowtie';
    if (a === 'acc_scrub_cap') return 'acc_scrub_cap';
    if (a === 'acc_ped_gorro_colorido') return 'acc_ped_gorro_colorido';
    if (a === 'acc_glasses_classic') return 'acc_glasses_classic';
    if (a === 'acc_prontuario_clipboard') return 'acc_prontuario_clipboard';
    return 'acc_none';
  }

  get pantsColor(): string {
    if (this.normalizedCoat === 'coat_scrubs_navy') return '#1E3A8A';
    if (this.normalizedCoat === 'coat_scrubs_green') return '#064E3B';
    return '#1E293B';
  }

  get pantsColorDark(): string {
    if (this.normalizedCoat === 'coat_scrubs_navy') return '#172554';
    if (this.normalizedCoat === 'coat_scrubs_green') return '#022C22';
    return '#0F172A';
  }

  get innerScrubColor(): string {
    if (this.gender === 'MALE') return '#0284C7';
    return '#0D9488';
  }

  get innerScrubTrimColor(): string {
    if (this.gender === 'MALE') return '#0369A1';
    return '#115E59';
  }

  get shoeAccentColor(): string {
    if (this.gender === 'MALE') return '#0284C7';
    return '#0D9488';
  }
}
