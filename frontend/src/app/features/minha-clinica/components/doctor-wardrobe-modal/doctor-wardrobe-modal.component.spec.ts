import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorWardrobeModalComponent } from './doctor-wardrobe-modal.component';

describe('DoctorWardrobeModalComponent (P-089)', () => {
  let component: DoctorWardrobeModalComponent;
  let fixture: ComponentFixture<DoctorWardrobeModalComponent>;

  const query = (testId: string): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector(`[data-testid="${testId}"]`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorWardrobeModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorWardrobeModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('avatar', {
      gender: 'FEMALE',
      skinCoat: 'coat_default',
      skinStethoscope: 'steth_standard',
      skinAccessory: 'acc_none',
      avatarX: 1,
      avatarY: 1
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render as a fixed full-screen overlay dialog instead of inline page content', () => {
    // Arrange
    const backdrop = query('avatar-modal-backdrop');
    const dialog = query('avatar-customizer-modal');

    // Assert: overlay styles live in the component itself (not in the parent page)
    expect(getComputedStyle(backdrop).position).toBe('fixed');
    expect(Number(getComputedStyle(backdrop).zIndex)).toBeGreaterThanOrEqual(1000);
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.contains(document.activeElement)).toBeTrue();
  });

  it('should close on Escape and on backdrop click, but not when clicking inside the dialog', () => {
    // Arrange
    const closeSpy = jasmine.createSpy('closeModal');
    component.closeModal.subscribe(closeSpy);
    const backdrop = query('avatar-modal-backdrop');
    const dialog = query('avatar-customizer-modal');

    // Act & Assert
    dialog.click();
    expect(closeSpy).not.toHaveBeenCalled();

    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(closeSpy).toHaveBeenCalledTimes(1);

    backdrop.click();
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it('should load the current avatar into the live preview when opened', () => {
    expect(component.tempAvatarGender()).toBe('FEMALE');
    expect(component.doctorDisplayName()).toBe('Dra. Lari');
  });
});