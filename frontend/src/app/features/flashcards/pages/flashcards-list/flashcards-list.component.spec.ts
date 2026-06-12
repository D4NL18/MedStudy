import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { FlashcardsListComponent } from './flashcards-list.component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';

describe('FlashcardsListComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(FlashcardsListComponent)
      .mock(MatDialog)
      .mock(LucideAngularModule)
      .mock(RouterLink)
      .provide(provideMockStore({
        initialState: {
          flashcards: {
            ids: [],
            entities: {},
            loading: false,
            summary: null
          }
        }
      }));
  });

  it('should create', () => {
    const fixture = MockRender(FlashcardsListComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch load actions on init', () => {
    const fixture = MockRender(FlashcardsListComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch loadStudyQueue on startStudy', () => {
    const fixture = MockRender(FlashcardsListComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.startStudy();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
