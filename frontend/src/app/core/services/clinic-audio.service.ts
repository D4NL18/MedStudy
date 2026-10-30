import { Injectable, signal } from '@angular/core';

/**
 * Sintetizador de Áudio Cozy ultra-leve baseado em Web Audio API (P-086).
 * Zero arquivos MP3 externos pesados; 100% controlado pelo usuário com persistência de mudo.
 */
@Injectable({
  providedIn: 'root'
})
export class ClinicAudioService {
  private readonly STORAGE_KEY = 'medstudy_clinic_audio_muted';
  private audioCtx: AudioContext | null = null;

  readonly isMuted = signal<boolean>(this.readInitialMuteState());

  private readInitialMuteState(): boolean {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  toggleMute(): boolean {
    const next = !this.isMuted();
    this.setMuted(next);
    return next;
  }

  setMuted(muted: boolean): void {
    this.isMuted.set(muted);
    try {
      localStorage.setItem(this.STORAGE_KEY, String(muted));
    } catch {
      // Ignora caso localStorage esteja bloqueado no navegador
    }
  }

  private canPlay(): boolean {
    if (this.isMuted()) {
      return false;
    }
    if (typeof document !== 'undefined' && document.hidden) {
      return false;
    }
    return typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);
  }

  private getContext(): AudioContext | null {
    if (!this.canPlay()) {
      return null;
    }
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => undefined);
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private playTone(
    freq: number,
    durationSec: number,
    type: OscillatorType = 'sine',
    gainPeak = 0.06,
    delaySec = 0,
    endFreq?: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) {
      return;
    }
    try {
      const startTime = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      if (endFreq && endFreq > 0) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + durationSec);
      }

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainPeak, startTime + Math.min(0.02, durationSec * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + durationSec + 0.01);
    } catch {
      // Silencioso em ambientes sem suporte a áudio
    }
  }

  playClick(): void {
    this.playTone(540, 0.055, 'sine', 0.04, 0, 680);
  }

  playPlaceItem(): void {
    this.playTone(380, 0.08, 'triangle', 0.05, 0, 520);
    this.playTone(620, 0.10, 'sine', 0.045, 0.05, 760);
  }

  playBuySuccess(): void {
    this.playTone(523.25, 0.09, 'sine', 0.06, 0);
    this.playTone(659.25, 0.09, 'sine', 0.06, 0.08);
    this.playTone(783.99, 0.16, 'triangle', 0.065, 0.16);
  }

  playExpandFanfare(): void {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.16, 'triangle', 0.06, idx * 0.09);
    });
  }

  playEcgBeep(): void {
    this.playTone(880, 0.09, 'sine', 0.04, 0);
    this.playTone(880, 0.09, 'sine', 0.035, 0.45);
  }

  playCatPurr(): void {
    this.playTone(110, 0.28, 'sawtooth', 0.02, 0, 95);
    this.playTone(125, 0.28, 'triangle', 0.025, 0.22, 108);
  }

  playDogBark(): void {
    this.playTone(290, 0.09, 'triangle', 0.055, 0, 420);
    this.playTone(320, 0.11, 'triangle', 0.055, 0.13, 210);
  }

  playEspressoSteam(): void {
    this.playTone(740, 0.12, 'sine', 0.025, 0, 920);
    this.playTone(620, 0.15, 'triangle', 0.025, 0.10, 840);
  }

  playTreasureSparkle(): void {
    this.playTone(987.77, 0.08, 'sine', 0.05, 0);
    this.playTone(1318.51, 0.14, 'sine', 0.055, 0.07);
    this.playTone(1567.98, 0.18, 'sine', 0.05, 0.14);
  }

  playDinoBlink(): void {
    this.playTone(660, 0.06, 'sine', 0.045, 0, 880);
    this.playTone(880, 0.07, 'sine', 0.045, 0.08, 720);
  }

  playErrorShake(): void {
    this.playTone(220, 0.12, 'sawtooth', 0.045, 0, 175);
  }

  playLootboxUnbox(): void {
    // Clique mecânico de fivela
    this.playTone(720, 0.04, 'triangle', 0.06, 0, 360);
    this.playTone(540, 0.06, 'sine', 0.05, 0.05, 240);
  }

  playLootboxRarityFanfare(rarity?: string): void {
    switch (rarity) {
      case 'LEGENDARY':
        // Dó5 - Mi5 - Sol5 - Dó6 com brilho estelar
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          this.playTone(freq, 0.22, 'triangle', 0.07, idx * 0.08);
        });
        setTimeout(() => this.playTreasureSparkle(), 320);
        break;
      case 'EPIC':
        // Dó5 - Mi5 - Sol5
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          this.playTone(freq, 0.18, 'sine', 0.06, idx * 0.09);
        });
        break;
      case 'RARE':
        // Dó5 - Sol5
        [523.25, 783.99].forEach((freq, idx) => {
          this.playTone(freq, 0.15, 'sine', 0.055, idx * 0.11);
        });
        break;
      case 'COMMON':
      default:
        // Tom suave senoidal 440 Hz
        this.playTone(440, 0.14, 'sine', 0.05, 0);
        break;
    }
  }

  playItemSound(soundKey?: string | null): void {
    switch (soundKey) {
      case 'dino_blink':
        this.playDinoBlink();
        break;
      case 'ecg_beep':
        this.playEcgBeep();
        break;
      case 'cat_purr':
        this.playCatPurr();
        break;
      case 'dog_bark':
        this.playDogBark();
        break;
      case 'espresso_steam':
        this.playEspressoSteam();
        break;
      case 'treasure_sparkle':
      case 'sparkle':
        this.playTreasureSparkle();
        break;
      default:
        this.playClick();
        break;
    }
  }
}
