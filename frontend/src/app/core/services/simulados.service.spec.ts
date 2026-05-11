import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SimuladosService } from './simulados.service';

describe('SimuladosService', () => {
  let service: SimuladosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SimuladosService]
    });
    service = TestBed.inject(SimuladosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get simulados', () => {
    const mockResponse = { content: [], totalElements: 0 } as any;
    service.getSimulados({ page: 0, size: 20 }).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(req => req.url === '/api/simulados' && req.params.has('page'));
    req.flush(mockResponse);
  });

  it('should get simulados with individual filters', () => {
    const mockResponse = { content: [], totalElements: 0 } as any;
    
    // Test nome branch
    service.getSimulados({ page: 0, size: 20, nome: 'Sim' }).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectOne(req => req.params.get('nome') === 'Sim').flush(mockResponse);
    
    // Test instituicao branch
    service.getSimulados({ page: 0, size: 20, instituicao: 'USP' }).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectOne(req => req.params.get('instituicao') === 'USP').flush(mockResponse);
  });

  it('should create simulado', () => {
    const mockSimulado = { id: '1' } as any;
    service.createSimulado(mockSimulado).subscribe(res => {
      expect(res).toEqual(mockSimulado);
    });
    const req = httpMock.expectOne('/api/simulados');
    expect(req.request.method).toBe('POST');
    req.flush(mockSimulado);
  });

  it('should update simulado', () => {
    const mockSimulado = { id: '1' } as any;
    service.updateSimulado('1', mockSimulado).subscribe(res => {
      expect(res).toEqual(mockSimulado);
    });
    const req = httpMock.expectOne('/api/simulados/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSimulado);
  });

  it('should delete simulado', () => {
    service.deleteSimulado('1').subscribe(res => {
      expect(res).toBeNull();
    });
    const req = httpMock.expectOne('/api/simulados/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get latest by instituicao', () => {
    const mockResponse = { id: '1' } as any;
    service.getLatestByInstituicao('USP').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(req => req.url === '/api/simulados/template' && req.params.get('instituicao') === 'USP');
    req.flush(mockResponse);
  });
});
