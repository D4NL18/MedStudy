import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalyticsService]
    });
    service = TestBed.inject(AnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get area analytics', () => {
    const mockData = [{ grandeArea: 'A', acertos: 1 } as any];
    service.getAreaAnalytics().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/api/analytics/areas');
    req.flush(mockData);
  });

  it('should get topic analytics', () => {
    const mockData = [{ tema: 'T', acertos: 1 } as any];
    service.getTopicAnalytics().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('/api/analytics/topics');
    req.flush(mockData);
  });
});
