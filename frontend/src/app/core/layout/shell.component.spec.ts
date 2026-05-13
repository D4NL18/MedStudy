import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { ShellComponent } from './shell.component';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FlashcardsStudyComponent } from '../../features/flashcards/pages/flashcards-study/flashcards-study.component';
import { NotificationService } from '../../core/services/notification.service';
import { of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

describe('ShellComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(ShellComponent)
      .mock(RouterOutlet)
      .mock(RouterLink)
      .mock(RouterLinkActive)
      .mock(FlashcardsStudyComponent)
      .mock(LucideAngularModule)
      .mock(OverlayModule)
      .mock(PortalModule)
      .provide(provideMockStore({
        initialState: {
          auth: { user: { nome: 'Test User' } }
        }
      }))
      .provide({
        provide: NotificationService,
        useValue: {
          getSummary: () => of({ totalAlerts: 0, pendingRevisions: 0, reinforcementLessons: 0 })
        }
      });
  });

  it('should create', () => {
    const fixture = MockRender(ShellComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should display user name', () => {
    const fixture = MockRender(ShellComponent);
    const userElement = ngMocks.find(fixture, '.user-name');
    expect(userElement.nativeElement.textContent).toContain('Test User');
  });

  it('should dispatch logout', () => {
    const fixture = MockRender(ShellComponent);
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.logout();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should toggle drawer', () => {
    const fixture = MockRender(ShellComponent);
    const component = fixture.point.componentInstance;
    
    expect(component.isDrawerOpen()).toBeFalse();
    component.toggleDrawer();
    expect(component.isDrawerOpen()).toBeTrue();
  });
});
