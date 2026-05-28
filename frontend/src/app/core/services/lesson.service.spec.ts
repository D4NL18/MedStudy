import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LessonService } from './lesson.service';
import { createMockLesson } from '../../testing/fixtures/lesson.fixture';

describe('LessonService', () => {
  let service: LessonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LessonService]
    });
    service = TestBed.inject(LessonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get lessons', () => {
    const mockLessons = [createMockLesson()];
    service.getLessons().subscribe(res => {
      expect(res.content.length).toBe(1);
      expect(res.totalElements).toBe(1);
    });
    const req = httpMock.expectOne(r => r.url === '/api/lessons' && r.params.get('page') === '0');
    expect(req.request.method).toBe('GET');
    req.flush(mockLessons);
  });

  it('should get lessons with complex filters', () => {
    service.getLessons(0, 10, { 
      tema: 'Cardio', 
      nulo: null, 
      indefinido: undefined 
    }).subscribe();
    const req = httpMock.expectOne(req => req.params.has('tema') && !req.params.has('nulo'));
    expect(req.request.params.get('tema')).toBe('Cardio');
    expect(req.request.params.has('nulo')).toBeFalse();
    expect(req.request.params.has('indefinido')).toBeFalse();
    req.flush([]);
  });

  it('should handle lessons response with content property', () => {
    const mockResponse = { content: [createMockLesson()] };
    service.getLessons().subscribe(res => {
      expect(res.content.length).toBe(1);
      expect(res.totalElements).toBe(1);
    });
    const req = httpMock.expectOne(r => r.url === '/api/lessons' && r.params.get('page') === '0');
    req.flush(mockResponse);
  });

  it('should update lesson', () => {
    const mockLesson = createMockLesson();
    service.updateLesson('1', mockLesson).subscribe();
    const req = httpMock.expectOne('/api/lessons/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockLesson);
  });

  it('should toggle assisted status', () => {
    const mockLesson = createMockLesson();
    service.toggleAssisted('1').subscribe();
    const req = httpMock.expectOne('/api/lessons/1/toggle-assistida');
    expect(req.request.method).toBe('PATCH');
    req.flush(mockLesson);
  });

  it('should delete lesson', () => {
    service.deleteLesson('1').subscribe();
    const req = httpMock.expectOne('/api/lessons/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
