import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { FlashcardsStudyComponent } from './flashcards-study.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { MarkdownRendererComponent } from '../../../../shared/components/markdown-renderer/markdown-renderer.component';
import { FlashcardsActions } from '../../../../store/flashcards/flashcards.actions';
import { createMockFlashcard } from '../../../../testing/fixtures/flashcard.fixture';
import { selectQueue, selectCurrentIndex, selectStudyModeActive, selectLoading } from '../../../../store/flashcards/flashcards.reducer';

describe('FlashcardsStudyComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(FlashcardsStudyComponent)
      .mock(LucideAngularModule)
      .mock(MarkdownRendererComponent)
      .provide(provideMockStore({
        initialState: {
          flashcards: {
            queue: [createMockFlashcard()],
            currentIndex: 0,
            active: true,
            loading: false
          }
        }
      }))
      .provide({ provide: Actions, useValue: of() });
  });

  it('should create', () => {
    const fixture = MockRender(FlashcardsStudyComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch rate action', () => {
    const fixture = MockRender(FlashcardsStudyComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store) as MockStore;
    
    const mockCard = createMockFlashcard();
    store.overrideSelector(selectQueue, [mockCard]);
    store.overrideSelector(selectCurrentIndex, 0);
    store.refreshState();
    
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.setResult(false);
    fixture.point.componentInstance.rate('EASY');
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch close action', () => {
    const fixture = MockRender(FlashcardsStudyComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.close();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
