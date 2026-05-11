import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { ShellComponent } from './shell.component';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FlashcardsStudyComponent } from '../../features/flashcards/pages/flashcards-study/flashcards-study.component';
import * as AuthActions from '../../store/auth/auth.actions';

describe('ShellComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(ShellComponent)
      .mock(RouterOutlet)
      .mock(RouterLink)
      .mock(RouterLinkActive)
      .mock(FlashcardsStudyComponent)
      .provide(provideMockStore({
        initialState: {
          auth: { user: { nome: 'Test User' } }
        }
      }));
  });

  it('should create', () => {
    const fixture = MockRender(ShellComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should display user name', () => {
    const fixture = MockRender(ShellComponent, null, { reset: true });
    const userElement = ngMocks.find(fixture, '.user-name');
    expect(userElement.nativeElement.textContent).toContain('Test User');
  });

  it('should dispatch logout', () => {
    const fixture = MockRender(ShellComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.logout();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
