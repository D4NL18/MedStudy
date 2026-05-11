import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get KPIs', () => {
    const mockKPIs = { sessions: { total: 1 } } as any;
    service.getDashboardKPIs().subscribe(kpis => {
      expect(kpis).toEqual(mockKPIs);
    });
    const req = httpMock.expectOne('/api/dashboard');
    req.flush(mockKPIs);
  });

  it('should get mock KPIs', (done) => {
    service.getDashboardKPIsMock().subscribe(kpis => {
      expect(kpis.currentStreak).toBe(5);
      done();
    });
  });
});
