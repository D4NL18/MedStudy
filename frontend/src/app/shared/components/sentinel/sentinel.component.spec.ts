import { SentinelComponent } from './sentinel.component';
import { MockBuilder, MockRender } from 'ng-mocks';

describe('SentinelComponent', () => {
  beforeEach(() => {
    return MockBuilder(SentinelComponent);
  });

  it('should create', () => {
    // Mock IntersectionObserver if needed
    if (!(window as any).IntersectionObserver) {
      (window as any).IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
    
    const fixture = MockRender(SentinelComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
