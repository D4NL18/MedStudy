import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * Angular service responsible for Export-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Export operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = '/api/export';

  constructor(private http: HttpClient) {}

  exportPdf(title: string, charts: Record<string, string>): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pdf`, { title, charts }, {
      responseType: 'blob'
    });
  }

  exportCsv(filters: any): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/csv`, {
      params: filters,
      responseType: 'blob'
    });
  }

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
