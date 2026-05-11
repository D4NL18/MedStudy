import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BancoService } from './banco.service';

describe('BancoService', () => {
  let service: BancoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BancoService]
    });
    service = TestBed.inject(BancoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get sessions with individual filters', () => {
    const mockResponse = { content: [], totalElements: 0 };
    
    // Test grandeArea branch
    service.getSessions({ page: 0, size: 20, grandeArea: 'PED' }).subscribe();
    httpMock.expectOne(req => req.params.get('grandeArea') === 'PED').flush(mockResponse);
    
    // Test tema branch
    service.getSessions({ page: 0, size: 20, tema: 'Cardio' }).subscribe();
    httpMock.expectOne(req => req.params.get('tema') === 'Cardio').flush(mockResponse);

    // Test startDate branch
    service.getSessions({ page: 0, size: 20, startDate: '2023-01-01' }).subscribe();
    httpMock.expectOne(req => req.params.get('startDate') === '2023-01-01').flush(mockResponse);

    // Test endDate branch
    service.getSessions({ page: 0, size: 20, endDate: '2023-01-31' }).subscribe();
    httpMock.expectOne(req => req.params.get('endDate') === '2023-01-31').flush(mockResponse);
  });

  it('should get sessions with all filters', () => {
    const mockResponse = { content: [], totalElements: 0 };
    const filters = { 
      page: 0, 
      size: 20, 
      grandeArea: 'Clinica',
      tema: 'HAS',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    } as any;
    
    service.getSessions(filters).subscribe();
    
    const req = httpMock.expectOne(req => 
      req.url === '/api/study-sessions' && 
      req.params.get('tema') === 'HAS' &&
      req.params.get('startDate') === '2024-01-01' &&
      req.params.get('endDate') === '2024-01-31'
    );
    req.flush(mockResponse);
  });

  it('should create session', () => {
    const mockSession = { id: '1' } as any;
    service.createSession(mockSession).subscribe(res => {
      expect(res).toEqual(mockSession);
    });
    const req = httpMock.expectOne('/api/study-sessions');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession);
  });

  it('should update session', () => {
    const mockSession = { id: '1' } as any;
    service.updateSession('1', mockSession).subscribe(res => {
      expect(res).toEqual(mockSession);
    });
    const req = httpMock.expectOne('/api/study-sessions/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  it('should delete session', () => {
    service.deleteSession('1').subscribe();
    const req = httpMock.expectOne('/api/study-sessions/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
