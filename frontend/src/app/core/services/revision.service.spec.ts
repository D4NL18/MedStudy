import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RevisionService } from './revision.service';

describe('RevisionService', () => {
  let service: RevisionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RevisionService]
    });
    service = TestBed.inject(RevisionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get summary', () => {
    const mockSummary = { totalCards: 10 } as any;
    service.getSummary().subscribe(res => {
      expect(res).toEqual(mockSummary);
    });
    const req = httpMock.expectOne('/api/revisoes/resumo');
    req.flush(mockSummary);
  });

  it('should get sessions with filter', () => {
    const mockSessions = [{ id: '1' } as any];
    service.getSessions('REFORCO').subscribe(res => {
      expect(res).toEqual(mockSessions);
    });
    const req = httpMock.expectOne(req => req.url === '/api/revisoes' && req.params.get('tipo') === 'REFORCO');
    req.flush(mockSessions);
  });
});
