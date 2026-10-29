import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorAvatar } from '../../../../core/models/clinic.model';
import { DoctorAvatarSvgComponent } from '../doctor-avatar-svg/doctor-avatar-svg.component';

export interface SkinOption {
  id: string;
  name: string;
  costXp: number;
}

@Component({
  selector: 'app-doctor-wardrobe-modal',
  standalone: true,
  imports: [CommonModule, DoctorAvatarSvgComponent],
  templateUrl: './doctor-wardrobe-modal.component.html',
  styleUrl: './doctor-wardrobe-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorWardrobeModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly avatar = input<DoctorAvatar | null | undefined>(null);
  readonly currentXp = input<number>(0);
  readonly doctorName = input<string>('Lari');
  readonly unlockedSkinIds = input<string[]>([]);
  readonly isSaving = input<boolean>(false);

  readonly closeModal = output<void>();
  readonly saveAvatar = output<{
    gender: 'MALE' | 'FEMALE';
    skinCoat: string;
    skinStethoscope: string;
    skinAccessory: string;
  }>();
  readonly unlockSkin = output<string>();

  readonly tempAvatarGender = signal<'MALE' | 'FEMALE'>('MALE');
  readonly tempAvatarCoat = signal<string>('coat_default');
  readonly tempAvatarSteth = signal<string>('steth_standard');
  readonly tempAvatarAccessory = signal<string>('acc_none');

  readonly coatOptions: SkinOption[] = [
    { id: 'coat_default', name: 'Jaleco Branco Clássico', costXp: 0 },
    { id: 'coat_intern_white', name: 'Jaleco Tradicional Internato', costXp: 0 },
    { id: 'coat_scrubs_navy', name: 'Scrub Azul Marinho Plantão', costXp: 500 },
    { id: 'coat_scrubs_green', name: 'Scrub Verde Cirúrgico', costXp: 800 },
    { id: 'coat_pediatric', name: 'Jaleco Pediátrico Bichinhos', costXp: 500 },
    { id: 'coat_pediatric_dino', name: 'Jaleco Estampado Dinossauro', costXp: 1200 },
    { id: 'coat_executive_doc', name: 'Jaleco Executivo Alfaiataria Nobre', costXp: 2500 },
    { id: 'coat_gold', name: 'Jaleco Mestre Ouro & Caduceu', costXp: 2500 }
  ];

  readonly stethOptions: SkinOption[] = [
    { id: 'steth_standard', name: 'Estetoscópio Preto Clássico', costXp: 0 },
    { id: 'steth_classic_black', name: 'Estetoscópio Preto Básico', costXp: 0 },
    { id: 'steth_none', name: 'Sem Estetoscópio', costXp: 0 },
    { id: 'steth_elephant', name: 'Protetor Elefantinho Pediátrico', costXp: 350 },
    { id: 'steth_cardio_burgundy', name: 'Esteto Cardiológico Vinho', costXp: 700 },
    { id: 'ped_steth_elefante', name: 'Esteto Pediátrico Elefante', costXp: 950 },
    { id: 'steth_gold', name: 'Estetoscópio Master Ouro Maciço', costXp: 1800 },
    { id: 'steth_gold_master', name: 'Esteto Master Ouro 24k', costXp: 3000 }
  ];

  readonly accessoryOptions: SkinOption[] = [
    { id: 'acc_none', name: 'Nenhum Acessório', costXp: 0 },
    { id: 'acc_red_bowtie', name: 'Gravata Borboleta Vermelha', costXp: 400 },
    { id: 'acc_glasses_classic', name: 'Óculos de Armação Redonda', costXp: 400 },
    { id: 'acc_scrub_cap', name: 'Touca Cirúrgica Teal Nórdica', costXp: 600 },
    { id: 'acc_ped_gorro_colorido', name: 'Gorro Cirúrgico Safari', costXp: 600 },
    { id: 'acc_prontuario_clipboard', name: 'Prancheta Médica na Mão', costXp: 850 }
  ];

  readonly doctorDisplayName = computed(() => {
    const prefix = this.tempAvatarGender() === 'FEMALE' ? 'Dra.' : 'Dr.';
    return `${prefix} ${this.doctorName()}`;
  });

  constructor() {
    effect(
      () => {
        if (this.isOpen()) {
          const av = this.avatar();
          this.tempAvatarGender.set(av?.gender ?? 'MALE');
          this.tempAvatarCoat.set(av?.skinCoat ?? 'coat_default');
          this.tempAvatarSteth.set(av?.skinStethoscope ?? 'steth_standard');
          this.tempAvatarAccessory.set(av?.skinAccessory ?? 'acc_none');
        }
      },
      { allowSignalWrites: true }
    );
  }

  isSkinUnlocked(skinId: string): boolean {
    const freeSkins = ['coat_default', 'coat_intern_white', 'steth_standard', 'steth_classic_black', 'steth_none', 'acc_none'];
    if (freeSkins.includes(skinId)) {
      return true;
    }
    const current = this.avatar();
    if (
      current?.skinCoat === skinId ||
      current?.skinStethoscope === skinId ||
      current?.skinAccessory === skinId
    ) {
      return true;
    }
    return this.unlockedSkinIds().includes(skinId);
  }

  setAvatarGender(gender: 'MALE' | 'FEMALE'): void {
    this.tempAvatarGender.set(gender);
  }

  selectCoatSkin(coatId: string): void {
    this.tempAvatarCoat.set(coatId);
  }

  selectStethSkin(stethId: string): void {
    this.tempAvatarSteth.set(stethId);
  }

  selectAccessorySkin(accId: string): void {
    this.tempAvatarAccessory.set(accId);
  }

  buySkinPrompt(skinId: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.coatOptions.some(c => c.id === skinId)) {
      this.tempAvatarCoat.set(skinId);
    } else if (this.stethOptions.some(s => s.id === skinId)) {
      this.tempAvatarSteth.set(skinId);
    } else if (this.accessoryOptions.some(a => a.id === skinId)) {
      this.tempAvatarAccessory.set(skinId);
    }
    this.unlockSkin.emit(skinId);
  }

  onSave(): void {
    if (!this.isSkinUnlocked(this.tempAvatarCoat())) {
      const coat = this.coatOptions.find(c => c.id === this.tempAvatarCoat());
      if (coat && coat.costXp > 0) {
        this.unlockSkin.emit(coat.id);
        return;
      }
    }
    if (!this.isSkinUnlocked(this.tempAvatarSteth())) {
      const steth = this.stethOptions.find(s => s.id === this.tempAvatarSteth());
      if (steth && steth.costXp > 0) {
        this.unlockSkin.emit(steth.id);
        return;
      }
    }
    if (!this.isSkinUnlocked(this.tempAvatarAccessory())) {
      const acc = this.accessoryOptions.find(a => a.id === this.tempAvatarAccessory());
      if (acc && acc.costXp > 0) {
        this.unlockSkin.emit(acc.id);
        return;
      }
    }

    this.saveAvatar.emit({
      gender: this.tempAvatarGender(),
      skinCoat: this.tempAvatarCoat(),
      skinStethoscope: this.tempAvatarSteth(),
      skinAccessory: this.tempAvatarAccessory()
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
