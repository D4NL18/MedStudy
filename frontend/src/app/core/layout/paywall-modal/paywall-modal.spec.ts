import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaywallModal } from './paywall-modal';

describe('PaywallModal', () => {
  let component: PaywallModal;
  let fixture: ComponentFixture<PaywallModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaywallModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaywallModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
