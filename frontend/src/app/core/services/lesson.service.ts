import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Lesson, LessonSummary } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = '/api/lessons';

  constructor(private http: HttpClient) {}

  getLessons(page = 0, size = 10, filters?: any): Observable<{content: Lesson[], totalElements: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        content: response.content || (Array.isArray(response) ? response : []),
        totalElements: response.totalElements !== undefined ? response.totalElements : 
                       (response.content ? response.content.length : (Array.isArray(response) ? response.length : 0))
      }))
    );
  }

  getSummary(): Observable<LessonSummary> {
    return this.http.get<LessonSummary>(`${this.apiUrl}/summary`);
  }

  createLesson(lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, lesson);
  }

  updateLesson(id: string, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/${id}`, lesson);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleAssisted(id: string): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.apiUrl}/${id}/toggle-assistida`, {});
  }
}
