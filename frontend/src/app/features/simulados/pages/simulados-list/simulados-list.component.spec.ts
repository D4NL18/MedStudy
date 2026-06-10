import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { SimuladosListComponent } from './simulados-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { SentinelComponent } from '../../../../shared/components/sentinel/sentinel.component';

describe('SimuladosListComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(SimuladosListComponent)
      .mock(MatDialog)
      .mock(SentinelComponent)
      .provide(provideMockStore({
        initialState: {
          simulados: {
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
    const fixture = MockRender(SimuladosListComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch loadSimulados on init', () => {
    const fixture = MockRender(SimuladosListComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch loadSimulados on page change', () => {
    const fixture = MockRender(SimuladosListComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store) as MockStore;
    
    store.setState({
      simulados: {
        ids: ['1'],
        entities: { '1': { id: '1' } as any },
        loading: false,
        totalCount: 10,
        filters: { page: 0, size: 10 }
      }
    });
    
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    fixture.point.componentInstance.onPageChange({ pageIndex: 1, pageSize: 10 });
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should open create modal', () => {
    const fixture = MockRender(SimuladosListComponent, null, { reset: true });
    const dialog = fixture.point.injector.get(MatDialog);
    const openSpy = spyOn(dialog, 'open').and.stub();
    
    fixture.point.componentInstance.openCreateModal();
    
    expect(openSpy).toHaveBeenCalled();
  });
});
