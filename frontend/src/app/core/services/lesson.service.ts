import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = `${environment.apiUrl}/aulas`;

  constructor(private http: HttpClient) {}

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl);
  }

  toggleAssisted(id: string): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.apiUrl}/${id}/toggle-assisted`, {});
  }
}
