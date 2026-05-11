import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { SessionModalComponent } from './session-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalLayoutComponent } from '../../../../shared/components/modal-layout/modal-layout.component';
import * as BancoActions from '../../../../store/banco/banco.actions';

describe('SessionModalComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(SessionModalComponent)
      .mock(ModalLayoutComponent)
      .mock(MatDialogRef)
      .provide(provideMockStore({
        initialState: {
          banco: { loading: false }
        }
      }))
      .provide({ provide: MAT_DIALOG_DATA, useValue: {} });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SessionModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should patch form when data contains session', () => {
    const mockSession = { 
      id: '1', 
      grandeArea: 'Cirurgia', 
      tema: 'Test', 
      qtsFeitas: 10, 
      qtsCorretas: 8, 
      dataSessao: '2023-01-01' 
    };
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { session: mockSession } });
    
    const fixture = TestBed.createComponent(SessionModalComponent);
    fixture.detectChanges();
    
    expect(fixture.componentInstance.sessionForm.get('tema')?.value).toBe('Test');
  });

  it('should dispatch createSession on save if valid and new', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch');
    
    const fixture = TestBed.createComponent(SessionModalComponent);
    fixture.componentInstance.sessionForm.patchValue({
      grandeArea: 'Cirurgia',
      tema: 'Novo Tema',
      totalQuestoes: 10,
      acertos: 8,
      data: '2023-01-01'
    });
    
    fixture.componentInstance.onSave();
    
    expect(dispatchSpy).toHaveBeenCalled();
    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.type).toBe('[Banco] Create Session');
  });
});
