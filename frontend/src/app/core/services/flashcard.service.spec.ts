import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlashcardService } from './flashcard.service';

describe('FlashcardService', () => {
  let service: FlashcardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlashcardService]
    });
    service = TestBed.inject(FlashcardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get today queue', () => {
    const mockCards = [{ id: '1' } as any];
    service.getTodayQueue().subscribe(cards => {
      expect(cards).toEqual(mockCards);
    });
    const req = httpMock.expectOne('/api/flashcards/hoje');
    req.flush(mockCards);
  });

  it('should rate flashcard', () => {
    const rating = { flashcardId: '1', dificuldade: 'EASY' } as any;
    const mockResponse = { id: '1' } as any;
    service.rateFlashcard(rating).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/api/flashcards/responder');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get summary', () => {
    const mockSummary = { total: 10 } as any;
    service.getSummary().subscribe(res => {
      expect(res).toEqual(mockSummary);
    });
    const req = httpMock.expectOne('/api/flashcards/summary');
    req.flush(mockSummary);
  });

  it('should get flashcards with pagination', () => {
    const mockResponse = { content: [], totalElements: 0 } as any;
    service.getFlashcards(0, 10).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/api/flashcards?page=0&size=10');
    req.flush(mockResponse);
  });

  it('should create flashcard', () => {
    const flashcard = { frente: 'Q', verso: 'A' };
    service.createFlashcard(flashcard).subscribe(res => {
      expect(res).toEqual(jasmine.objectContaining(flashcard));
    });
    const req = httpMock.expectOne('/api/flashcards');
    expect(req.request.method).toBe('POST');
    req.flush(flashcard);
  });

  it('should update flashcard', () => {
    const flashcard = { frente: 'Q2' };
    service.updateFlashcard('1', flashcard).subscribe(res => {
      expect(res).toEqual(jasmine.objectContaining(flashcard));
    });
    const req = httpMock.expectOne('/api/flashcards/1');
    expect(req.request.method).toBe('PUT');
    req.flush(flashcard);
  });

  it('should delete flashcard', () => {
    service.deleteFlashcard('1').subscribe(res => {
      expect(res).toBeNull();
    });
    const req = httpMock.expectOne('/api/flashcards/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
