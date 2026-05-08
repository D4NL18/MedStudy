import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Flashcard, FlashcardStudyRating } from '../models/flashcard.model';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private apiUrl = `${environment.apiUrl}/flashcards`;

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
}
