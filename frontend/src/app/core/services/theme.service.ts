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
  
  // Convert Store observable to Signal
  activeTheme = toSignal(this.store.select(selectActiveTheme), { 
    initialValue: this.getInitialTheme() 
  });

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Effect to apply theme whenever it changes in the Store
    effect(() => {
      const theme = this.activeTheme();
      this.applyTheme(theme);
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
}
