import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Simulado, SimuladoFilters } from '../models/simulado.model';


/**
 * Angular service responsible for Simulados-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Simulados operations.
 */
@Injectable({
  providedIn: 'root'
})
export class SimuladosService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/simulados';

  getSimulados(filters: SimuladoFilters): Observable<{ content: Simulado[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString());

    if (filters.nome) params = params.set('nome', filters.nome);
    if (filters.instituicao) params = params.set('instituicao', filters.instituicao);

    return this.http.get<{ content: Simulado[], totalElements: number }>(this.API_URL, { params });
  }

  createSimulado(simulado: Partial<Simulado>): Observable<Simulado> {
    return this.http.post<Simulado>(this.API_URL, simulado);
  }

  updateSimulado(id: string, simulado: Partial<Simulado>): Observable<Simulado> {
    return this.http.put<Simulado>(`${this.API_URL}/${id}`, simulado);
  }

  deleteSimulado(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getLatestByInstituicao(instituicao: string): Observable<Simulado> {
    return this.http.get<Simulado>(`${this.API_URL}/template`, {
      params: new HttpParams().set('instituicao', instituicao)
    });
  }
}
