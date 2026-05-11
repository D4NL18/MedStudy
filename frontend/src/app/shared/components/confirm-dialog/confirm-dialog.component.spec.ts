import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';

describe('ConfirmDialogComponent', () => {
  beforeEach(() => {
    ngMocks.flushTestBed();
    return MockBuilder(ConfirmDialogComponent)
      .mock(LucideAngularModule)
      .provide({ provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } })
      .provide({ provide: MAT_DIALOG_DATA, useValue: { title: 'Test', message: 'Msg' } as ConfirmDialogData });
  });

  it('should create', () => {
    const fixture = MockRender(ConfirmDialogComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should close with true on confirm', () => {
    const fixture = MockRender(ConfirmDialogComponent);
    const dialogRef = TestBed.inject(MatDialogRef);
    
    fixture.point.componentInstance.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close with false on cancel', () => {
    const fixture = MockRender(ConfirmDialogComponent);
    const dialogRef = TestBed.inject(MatDialogRef);
    
    fixture.point.componentInstance.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
