import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaywallModal } from './paywall-modal';

import { provideMockStore } from '@ngrx/store/testing';

describe('PaywallModal', () => {
  let component: PaywallModal;
  let fixture: ComponentFixture<PaywallModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaywallModal],
      providers: [
        provideMockStore({ initialState: { auth: { showPaywall: false } } })
      ]
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
