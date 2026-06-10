import { TestBed } from '@angular/core/testing';
import { ThemeService, AppTheme } from './theme.service';
import { DOCUMENT } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as ThemeActions from '@store/theme/theme.actions';
import { selectActiveTheme } from '@store/theme/theme.selectors';

describe('ThemeService', () => {
  let service: ThemeService;
  let store: MockStore;
  let document: Document;
  let localStorageValue: string | null = null;

  beforeEach(() => {
    localStorageValue = null;
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'medstudy-theme-v2') return localStorageValue;
      return null;
    });
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideMockStore({
          initialState: { theme: { activeTheme: 'verde' } },
          selectors: [
            { selector: selectActiveTheme, value: 'verde' }
          ]
        })
      ]
    });

    store = TestBed.inject(MockStore);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  function setupService(lsValue: string | null, storeValue: AppTheme) {
    localStorageValue = lsValue;
    store.overrideSelector(selectActiveTheme, storeValue);
    store.refreshState();
    service = TestBed.inject(ThemeService);
  }

  it('should be created', () => {
    setupService('rosa', 'rosa');
    expect(service).toBeTruthy();
    expect(service.activeTheme()).toBe('rosa');
  });

  it('should fallback to default theme if localStorage is empty', () => {
    setupService(null, 'verde');
    expect(service.activeTheme()).toBe('verde');
  });

  it('should dispatch setTheme action when setTheme is called', () => {
    setupService('verde', 'verde');
    const dispatchSpy = spyOn(store, 'dispatch');
    const theme: AppTheme = 'escuro';
    service.setTheme(theme);
    expect(dispatchSpy).toHaveBeenCalledWith(ThemeActions.setTheme({ theme }));
  });

  it('should apply theme to document element', () => {
    setupService('verde', 'verde');
    store.overrideSelector(selectActiveTheme, 'azul');
    store.refreshState();
    TestBed.flushEffects();
    expect(document.documentElement.getAttribute('data-theme')).toBe('azul');
  });

  it('should update localStorage when theme changes', () => {
    setupService('verde', 'verde');
    store.overrideSelector(selectActiveTheme, 'rosa');
    store.refreshState();
    TestBed.flushEffects();
    expect(localStorage.setItem).toHaveBeenCalledWith('medstudy-theme-v2', 'rosa');
  });
});
