import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirationBanner } from './expiration-banner';

describe('ExpirationBanner', () => {
  let component: ExpirationBanner;
  let fixture: ComponentFixture<ExpirationBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpirationBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirationBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
