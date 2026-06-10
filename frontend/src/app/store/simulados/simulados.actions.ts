import { createAction, props } from '@ngrx/store';
import { Simulado, SimuladoFilters } from '@core/models/simulado.model';

export const loadSimulados = createAction(
  '[Simulados] Load Simulados',
  props<{ filters: SimuladoFilters; append: boolean }>()
);

export const loadSimuladosSuccess = createAction(
  '[Simulados] Load Simulados Success',
  props<{ simulados: Simulado[]; totalCount: number; append: boolean }>()
);

export const loadSimuladosFailure = createAction(
  '[Simulados] Load Simulados Failure',
  props<{ error: string }>()
);

export const createSimulado = createAction(
  '[Simulados] Create Simulado',
  props<{ simulado: Partial<Simulado> }>()
);

export const createSimuladoSuccess = createAction(
  '[Simulados] Create Simulado Success',
  props<{ simulado: Simulado }>()
);

export const createSimuladoFailure = createAction(
  '[Simulados] Create Simulado Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[Simulados] Update Filters',
  props<{ filters: Partial<SimuladoFilters> }>()
);

export const updateSimulado = createAction(
  '[Simulados] Update Simulado',
  props<{ id: string; simulado: Partial<Simulado> }>()
);

export const updateSimuladoSuccess = createAction(
  '[Simulados] Update Simulado Success',
  props<{ simulado: Simulado }>()
);

export const updateSimuladoFailure = createAction(
  '[Simulados] Update Simulado Failure',
  props<{ error: string }>()
);

export const deleteSimulado = createAction(
  '[Simulados] Delete Simulado',
  props<{ id: string }>()
);

export const deleteSimuladoSuccess = createAction(
  '[Simulados] Delete Simulado Success',
  props<{ id: string }>()
);

export const deleteSimuladoFailure = createAction(
  '[Simulados] Delete Simulado Failure',
  props<{ error: string }>()
);
