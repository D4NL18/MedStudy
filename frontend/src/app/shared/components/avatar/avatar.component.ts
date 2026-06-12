import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AVATAR_PRESETS, AvatarPreset } from '@core/constants/avatar-presets';


/**
 * Angular component for the Avatar feature.
 * @description Handles the presentation logic and user interactions for the Avatar view.
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input() presetId: string | null | undefined = 'clinica_geral';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  preset: AvatarPreset | null = null;

  ngOnInit() {
    this.updatePreset();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['presetId']) {
      this.updatePreset();
    }
  }

  private updatePreset() {
    this.preset = AVATAR_PRESETS.find(p => p.id === this.presetId) || AVATAR_PRESETS[0];
  }

  getStyles() {
    if (!this.preset) return {};
    return {
      background: `linear-gradient(135deg, ${this.preset.colorStart}, ${this.preset.colorEnd})`
    };
  }

  getGlowStyles() {
    if (!this.preset) return {};
    return {
      background: this.preset.colorEnd
    };
  }

  getLucideIconName(): string {
    if (!this.preset) return 'stethoscope';
    const iconMap: Record<string, string> = {
      'steth': 'stethoscope',
      'heart': 'heart',
      'brain': 'brain',
      'shield': 'shield',
      'pill': 'pill',
      'dna': 'dna',
      'lung': 'activity',
      'flask': 'flask-conical',
      'microscope': 'microscope',
      'bone': 'bone',
      'scalpel': 'syringe',
      'baby': 'baby',
      'eye': 'eye',
      'ear': 'activity',
      'tooth': 'activity'
    };
    return iconMap[this.preset.icon] || 'stethoscope';
  }
}
