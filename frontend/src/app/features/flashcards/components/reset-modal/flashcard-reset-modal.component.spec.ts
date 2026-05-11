import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashcardResetModalComponent } from './flashcard-reset-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LucideAngularModule, AlertTriangle, X } from 'lucide-angular';

describe('FlashcardResetModalComponent', () => {
  let component: FlashcardResetModalComponent;
  let fixture: ComponentFixture<FlashcardResetModalComponent>;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      imports: [
        FlashcardResetModalComponent, 
        BrowserAnimationsModule,
        LucideAngularModule.pick({ AlertTriangle, X })
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { grandeArea: 'Pediatria' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardResetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable reset button until "RESETAR" is typed', () => {
    const compiled = fixture.nativeElement;
    const resetButton = compiled.querySelector('button[color="warn"]');
    
    expect(resetButton.disabled).toBeTrue();

    component.confirmationString.set('RESET');
    fixture.detectChanges();
    expect(resetButton.disabled).toBeTrue();

    component.confirmationString.set('RESETAR');
    fixture.detectChanges();
    expect(resetButton.disabled).toBeFalse();
  });

  it('should close with true when confirm is called with "RESETAR"', () => {
    component.confirmationString.set('RESETAR');
    component.confirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close with false when cancel is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
