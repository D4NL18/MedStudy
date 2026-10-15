import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReorganizeModalComponent } from './reorganize-modal.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';

describe('ReorganizeModalComponent', () => {
  let component: ReorganizeModalComponent;
  let fixture: ComponentFixture<ReorganizeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReorganizeModalComponent],
      providers: [
        provideMockStore({
          initialState: {
            revision: {
              redistributionDraft: null,
              isRedistributing: false
            }
          }
        }),
        { provide: Actions, useValue: of() }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorganizeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
