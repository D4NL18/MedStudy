import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockInstance } from 'ng-mocks';
import { SimuladoModalComponent } from './simulado-modal.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalLayoutComponent } from '../../../../shared/components/modal-layout/modal-layout.component';
import { SimuladosService } from '../../../../core/services/simulados.service';
import * as SimuladosActions from '../../../../store/simulados/simulados.actions';
import { createMockSimulado } from '../../../../testing/fixtures/simulado.fixture';

describe('SimuladoModalComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(SimuladoModalComponent)
      .mock(ModalLayoutComponent)
      .mock(SimuladosService)
      .mock(MatDialogRef)
      .provide(provideMockStore({
        initialState: {
          simulados: { loading: false }
        }
      }))
      .provide({ provide: MAT_DIALOG_DATA, useValue: {} });
  });

  it('should create with default values', () => {
    const fixture = TestBed.createComponent(SimuladoModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.simuladoForm.get('ano')?.value).toBe(new Date().getFullYear());
  });

  it('should patch form when data contains simulado', () => {
    const mockSimulado = createMockSimulado({ nome: 'Test Simulado' });
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { simulado: mockSimulado } });
    
    const fixture = TestBed.createComponent(SimuladoModalComponent);
    fixture.detectChanges();
    
    expect(fixture.componentInstance.simuladoForm.get('nome')?.value).toBe('Test Simulado');
  });

  it('should validate acertos cannot exceed totais', () => {
    const fixture = TestBed.createComponent(SimuladoModalComponent);
    const perfArray = fixture.componentInstance.performanceArray;
    const group = perfArray.at(0);
    
    group.patchValue({ totais: 10, acertos: 15 });
    expect(group.valid).toBeFalse();
    expect(group.errors?.['acertosInvalidos']).toBeTrue();
  });

  it('should dispatch createSimulado on save', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = spyOn(store, 'dispatch');
    const dialogRef = TestBed.inject(MatDialogRef);
    spyOn(dialogRef, 'close');
    
    const fixture = TestBed.createComponent(SimuladoModalComponent);
    fixture.componentInstance.simuladoForm.patchValue({
      nome: 'Novo Simulado',
      instituicao: 'USP',
      ano: 2024,
      data: '2024-05-09'
    });
    
    fixture.componentInstance.onSave();
    
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      type: SimuladosActions.createSimulado.type
    }));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should calculate summary totals correctly', () => {
    const fixture = TestBed.createComponent(SimuladoModalComponent);
    const perfArray = fixture.componentInstance.performanceArray;
    
    perfArray.at(0).patchValue({ totais: 20, acertos: 10 });
    perfArray.at(1).patchValue({ totais: 20, acertos: 10 });
    
    // Default is 20 for each area (5 areas)
    // We changed 2 areas to 20/10. Others are 20/0.
    // Total totais = 100. Total acertos = 20.
    const totals = fixture.componentInstance.totals();
    expect(totals.totalQuestoes).toBe(100);
    expect(totals.totalAcertos).toBe(20);
    expect(totals.percent).toBe(20);
  });
});
