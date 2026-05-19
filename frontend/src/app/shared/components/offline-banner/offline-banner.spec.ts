import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineBanner } from './offline-banner';

describe('OfflineBanner', () => {
  let component: OfflineBanner;
  let fixture: ComponentFixture<OfflineBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
