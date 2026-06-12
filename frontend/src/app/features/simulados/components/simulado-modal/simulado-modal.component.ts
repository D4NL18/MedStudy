import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import * as SimuladosActions from '@store/simulados/simulados.actions';
import { selectSimuladosLoading } from '@store/simulados/simulados.selectors';
import { Simulado } from '@core/models/simulado.model';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { SimuladosService } from '@core/services/simulados.service';


/**
 * Angular component for the Simulado Modal feature.
 * @description Handles the presentation logic and user interactions for the Simulado Modal view.
 */
@Component({
  selector: 'app-simulado-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalLayoutComponent],
  templateUrl: './simulado-modal.component.html',
  styleUrl: './simulado-modal.component.scss'
})
export class SimuladoModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SimuladoModalComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });
  private store = inject(Store);
  private simuladosService = inject(SimuladosService);

  loading = this.store.selectSignal(selectSimuladosLoading);
  simuladoToEdit: Simulado | null = this.data?.simulado || null;

  areas = [
    { id: 'CIR', name: 'Cirurgia' },
    { id: 'CM', name: 'Clínica Médica' },
    { id: 'PED', name: 'Pediatria' },
    { id: 'GO', name: 'Ginecologia e Obstetrícia' },
    { id: 'PREV', name: 'Medicina Preventiva' }
  ];

  private getLocalDate(): string {
    const now = new Date();
    return now.toLocaleDateString('en-CA');
  }

  simuladoForm = this.fb.group({
    nome: ['', Validators.required],
    instituicao: ['', Validators.required],
    ano: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
    data: [this.getLocalDate(), [Validators.required, this.futureDateValidator]],
    performance: this.fb.array(this.areas.map(area => this.createAreaGroup(area.name)))
  });

  ngOnInit() {
    if (this.simuladoToEdit) {
      this.patchForm(this.simuladoToEdit);
    }

    // Auto-fill template based on institution
    this.simuladoForm.get('instituicao')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(value => !!value && value.length >= 3 && !this.simuladoToEdit),
      switchMap(value => this.simuladosService.getLatestByInstituicao(value!))
    ).subscribe(template => {
      if (template) {
        this.patchPerformanceOnly(template);
      }
    });
  }

  private patchForm(s: Simulado) {
    this.simuladoForm.patchValue({
      nome: s.nome,
      instituicao: s.instituicao,
      ano: s.ano,
      data: s.dataRealizacao
    });
    this.patchPerformanceOnly(s);
  }

  private patchPerformanceOnly(s: Simulado) {
    const perfArray = this.performanceArray;
    const patchArea = (index: number, totais: number | undefined) => {
      if (totais !== undefined) {
        perfArray.at(index).get('totais')?.setValue(totais);
      }
    };

    patchArea(0, s.cirTotal);
    patchArea(1, s.cmTotal);
    patchArea(2, s.pedTotal);
    patchArea(3, s.goTotal);
    patchArea(4, s.prevTotal);
  }

  private futureDateValidator(control: any) {
    if (!control.value) return null;
    const selected = new Date(control.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today ? { futureDate: true } : null;
  }

  get performanceArray() {
    return this.simuladoForm.get('performance') as FormArray;
  }

  createAreaGroup(areaName: string) {
    return this.fb.group({
      area: [areaName],
      totais: [20, [Validators.required, Validators.min(0)]],
      acertos: [0, [Validators.required, Validators.min(0)]]
    }, {
      validators: (group: any) => {
        const total = group.get('totais')?.value;
        const acertos = group.get('acertos')?.value;
        return acertos !== null && total !== null && acertos > total ? { acertosInvalidos: true } : null;
      }
    });
  }

  // Computed values for the header summary
  totals = computed(() => {
    const perf = this.performanceArray.value;
    const totalQuestoes = perf.reduce((acc: number, curr: any) => acc + (curr.totais || 0), 0);
    const totalAcertos = perf.reduce((acc: number, curr: any) => acc + (curr.acertos || 0), 0);
    const percent = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
    return { totalQuestoes, totalAcertos, percent };
  });

  onSave() {
    if (this.simuladoForm.valid) {
      const formValue = this.simuladoForm.getRawValue();
      const perf = formValue.performance as any[];
      
      // Map array to individual fields expected by backend
      const findArea = (id: string) => perf.find(p => p.area === this.areas.find(a => a.id === id)?.name);
      
      const cir = findArea('CIR');
      const cm = findArea('CM');
      const ped = findArea('PED');
      const go = findArea('GO');
      const prev = findArea('PREV');

      const simuladoData = {
        nome: formValue.nome,
        instituicao: formValue.instituicao,
        ano: formValue.ano,
        dataRealizacao: formValue.data,
        
        cirTotal: cir?.totais, cirAcertos: cir?.acertos, cirErros: (cir?.totais || 0) - (cir?.acertos || 0),
        cmTotal: cm?.totais, cmAcertos: cm?.acertos, cmErros: (cm?.totais || 0) - (cm?.acertos || 0),
        pedTotal: ped?.totais, pedAcertos: ped?.acertos, pedErros: (ped?.totais || 0) - (ped?.acertos || 0),
        goTotal: go?.totais, goAcertos: go?.acertos, goErros: (go?.totais || 0) - (go?.acertos || 0),
        prevTotal: prev?.totais, prevAcertos: prev?.acertos, prevErros: (prev?.totais || 0) - (prev?.acertos || 0)
      };
      
      if (this.simuladoToEdit) {
        this.store.dispatch(SimuladosActions.updateSimulado({ 
          id: this.simuladoToEdit.id, 
          simulado: simuladoData as any 
        }));
      } else {
        this.store.dispatch(SimuladosActions.createSimulado({ simulado: simuladoData as any }));
      }
      
      this.dialogRef.close(true);
    } else {
      this.simuladoForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
