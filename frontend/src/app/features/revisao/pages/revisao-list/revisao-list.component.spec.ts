import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockInstance } from 'ng-mocks';
import { RevisaoListComponent } from './revisao-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { RevisionActions } from '@store/revision/revision.actions';
import { createMockRevisionSession } from '@testing/fixtures/revision.fixture';

describe('RevisaoListComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(RevisaoListComponent)
      .mock(LucideAngularModule)
      .mock(RouterLink)
      .provide(provideMockStore({
        initialState: {
          revision: {
            summary: null,
            sessions: [],
            loading: false
          }
        }
      }));
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RevisaoListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should dispatch load actions on init', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    const fixture = TestBed.createComponent(RevisaoListComponent);
    fixture.detectChanges();
    
    expect(dispatchSpy).toHaveBeenCalledWith(RevisionActions.loadSummary());
    expect(dispatchSpy).toHaveBeenCalledWith(RevisionActions.loadSessions({ filter: 'HOJE' }));
  });

  it('should change tab and reload sessions', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch');
    
    const fixture = TestBed.createComponent(RevisaoListComponent);
    fixture.componentInstance.setActiveTab('ATRASADAS');
    
    expect(fixture.componentInstance.activeTab).toBe('ATRASADAS');
    expect(dispatchSpy).toHaveBeenCalledWith(RevisionActions.loadSessions({ filter: 'ATRASADAS' }));
  });

  it('should calculate accuracy correctly', () => {
    const fixture = TestBed.createComponent(RevisaoListComponent);
    const session = createMockRevisionSession({ qtsFeitas: 20, qtsCorretas: 10 });
    expect(fixture.componentInstance.getAccuracy(session)).toBe(50);
  });

  it('should return 0 accuracy if no questions done', () => {
    const fixture = TestBed.createComponent(RevisaoListComponent);
    const session = createMockRevisionSession({ qtsFeitas: 0, qtsCorretas: 0 });
    expect(fixture.componentInstance.getAccuracy(session)).toBe(0);
  });
});
