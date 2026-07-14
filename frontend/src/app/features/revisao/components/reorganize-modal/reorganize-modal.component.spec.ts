import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorganizeModal } from './reorganize-modal';

describe('ReorganizeModal', () => {
  let component: ReorganizeModal;
  let fixture: ComponentFixture<ReorganizeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReorganizeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorganizeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
