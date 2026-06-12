import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flashcard, FlashcardStudyRating } from '../models/flashcard.model';


/**
 * Angular service responsible for Flashcard-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Flashcard operations.
 */
@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private apiUrl = '/api/flashcards';

  constructor(private http: HttpClient) {}

  getTodayQueue(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.apiUrl}/hoje`);
  }

  rateFlashcard(rating: FlashcardStudyRating): Observable<Flashcard> {
    return this.http.post<Flashcard>(`${this.apiUrl}/responder`, rating);
  }

  getFlashcards(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  createFlashcard(flashcard: any): Observable<Flashcard> {
    return this.http.post<Flashcard>(this.apiUrl, flashcard);
  }

  updateFlashcard(id: string, flashcard: any): Observable<Flashcard> {
    return this.http.put<Flashcard>(`${this.apiUrl}/${id}`, flashcard);
  }

  deleteFlashcard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  resetProgress(grandeArea?: string): Observable<void> {
    let params: any = {};
    if (grandeArea) {
      params = { grandeArea };
    }
    return this.http.post<void>(`${this.apiUrl}/reset`, null, { params });
  }
}
