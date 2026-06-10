import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { BancoListComponent } from './banco-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { SentinelComponent } from '@shared/components/sentinel/sentinel.component';

describe('BancoListComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(BancoListComponent)
      .mock(MatDialog)
      .mock(SentinelComponent)
      .provide(provideMockStore({
        initialState: {
          banco: {
            ids: [],
            entities: {},
            loading: false,
            totalCount: 0,
            filters: { page: 0, size: 10 }
          }
        }
      }));
  });

  it('should create', () => {
    const fixture = MockRender(BancoListComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch loadSessions on init', () => {
    const fixture = MockRender(BancoListComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should open create modal', () => {
    const fixture = MockRender(BancoListComponent, null, { reset: true });
    const dialog = fixture.point.injector.get(MatDialog);
    const openSpy = spyOn(dialog, 'open').and.stub();
    
    fixture.point.componentInstance.openCreateModal();
    
    expect(openSpy).toHaveBeenCalled();
  });
});
