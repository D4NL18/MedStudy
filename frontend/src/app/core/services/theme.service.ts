import { Injectable, effect, Inject, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import * as ThemeActions from '../../store/theme/theme.actions';
import { selectActiveTheme } from '../../store/theme/theme.selectors';

export type AppTheme = 'rosa' | 'claro' | 'escuro' | 'verde' | 'azul' | 'vermelho' | 'roxo' | 'laranja';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'medstudy-theme-v2';
  private store = inject(Store);
  
  private readonly themeColors: Record<AppTheme, string> = {
    rosa: '#F553B0',
    claro: '#10B981',
    escuro: '#F553B0',
    verde: '#52B788',
    azul: '#00B4D8',
    vermelho: '#FF4D6D',
    roxo: '#9D4EDD',
    laranja: '#FF8531'
  };
  
  // Convert Store observable to Signal
  activeTheme = toSignal(this.store.select(selectActiveTheme), { 
    initialValue: this.getInitialTheme() 
  });

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Effect to apply theme whenever it changes in the Store
    effect(() => {
      const theme = this.activeTheme();
      this.applyTheme(theme);
      this.updateFavicon(this.themeColors[theme]);
      localStorage.setItem(this.THEME_KEY, theme);
    });
  }

  setTheme(theme: AppTheme) {
    this.store.dispatch(ThemeActions.setTheme({ theme }));
  }

  private getInitialTheme(): AppTheme {
    const saved = localStorage.getItem(this.THEME_KEY) as AppTheme;
    return saved || 'verde';
  }

  private applyTheme(theme: AppTheme) {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private updateFavicon(color: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
  <circle cx="20" cy="10" r="2"/>
</svg>`;
    const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    
    let link = this.document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      this.document.head.appendChild(link);
    }
    link.href = dataUri;
  }
}
