import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { OfflinePageComponent } from './offline-page';
import { provideRouter } from '@angular/router';

describe('OfflinePageComponent', () => {
  beforeEach(() => {
    return MockBuilder(OfflinePageComponent)
      .provide(provideRouter([]));
  });

  it('should create', () => {
    const fixture = MockRender(OfflinePageComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
