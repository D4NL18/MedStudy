import { TestBed } from '@angular/core/testing';
import { ThemeService, AppTheme } from './theme.service';
import { DOCUMENT } from '@angular/common';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as ThemeActions from '../../store/theme/theme.actions';
import { selectActiveTheme } from '../../store/theme/theme.selectors';

describe('ThemeService', () => {
  let service: ThemeService;
  let store: MockStore;
  let document: Document;
  const initialState = { theme: { activeTheme: 'verde' } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideMockStore({ 
          initialState,
          selectors: [
            { selector: selectActiveTheme, value: 'verde' }
          ]
        })
      ]
    });

    service = TestBed.inject(ThemeService);
    store = TestBed.inject(MockStore);
    document = TestBed.inject(DOCUMENT);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'medstudy-theme-v2') return 'rosa';
      return null;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch setTheme action when setTheme is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const theme: AppTheme = 'escuro';
    service.setTheme(theme);
    expect(dispatchSpy).toHaveBeenCalledWith(ThemeActions.setTheme({ theme }));
  });

  it('should apply theme to document element', () => {
    // The initial theme is 'rosa' because of the localStorage stub
    expect(document.documentElement.getAttribute('data-theme')).toBe('rosa');
  });

  it('should update localStorage when theme changes', () => {
    // This is tested via the effect
    // We can simulate a store change
    store.overrideSelector(selectActiveTheme, 'rosa');
    store.refreshState();
    
    // effect might need a tick
    TestBed.flushEffects();
    expect(localStorage.setItem).toHaveBeenCalledWith('medstudy-theme-v2', 'rosa');
  });
});
