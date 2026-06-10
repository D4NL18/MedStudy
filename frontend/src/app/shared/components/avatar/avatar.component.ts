import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AVATAR_PRESETS, AvatarPreset } from '@core/constants/avatar-presets';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="avatar-circle" [ngStyle]="getStyles()" [ngClass]="size">
      <div class="avatar-glow" [ngStyle]="getGlowStyles()"></div>
      <div class="avatar-icon-wrap">
        <lucide-icon [name]="getLucideIconName()"></lucide-icon>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .avatar-circle {
      position: relative;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .avatar-circle:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }
    .avatar-circle:hover .avatar-icon-wrap {
      transform: scale(1.1);
    }
    .avatar-glow {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 50%;
      opacity: 0.15;
      filter: blur(10px);
      z-index: -1;
      transform: scale(1.1);
    }
    .avatar-icon-wrap {
      opacity: 0.95;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
    }

    ::ng-deep .avatar-circle lucide-icon {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    ::ng-deep .avatar-circle lucide-icon svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }

    ::ng-deep .avatar-circle.sm lucide-icon { width: 20px !important; height: 20px !important; }
    ::ng-deep .avatar-circle.md lucide-icon { width: 32px !important; height: 32px !important; }
    ::ng-deep .avatar-circle.lg lucide-icon { width: 48px !important; height: 48px !important; }
    ::ng-deep .avatar-circle.xl lucide-icon { width: 72px !important; height: 72px !important; }

    /* Sizes */
    .sm { width: 40px; height: 40px; }
    .md { width: 64px; height: 64px; }
    .lg { width: 96px; height: 96px; }
    .xl { width: 140px; height: 140px; }
  `]
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
