import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOOTBOX_TIERS_FALLBACK } from '@core/models/clinic.model';
import { ClinicLootboxModalComponent } from './clinic-lootbox-modal.component';

describe('ClinicLootboxModalComponent (US-11, US-12, US-13)', () => {
  let component: ClinicLootboxModalComponent;
  let fixture: ComponentFixture<ClinicLootboxModalComponent>;

  const theater = (): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector('[data-testid="lootbox-fullscreen-theater"]') as HTMLElement;
  const dialog = (): HTMLElement => theater().querySelector('[role="dialog"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicLootboxModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicLootboxModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('lootboxTiers', LOOTBOX_TIERS_FALLBACK);
    fixture.componentRef.setInput('currentXp', 100);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should stay below the error modal layer (z-index 10000) so failures are never hidden', () => {
    // Assert
    expect(getComputedStyle(theater()).position).toBe('fixed');
    expect(Number(getComputedStyle(theater()).zIndex)).toBeLessThan(10000);
    expect(dialog().contains(document.activeElement)).toBeTrue();
  });

  it('should close on backdrop click and Escape but ignore clicks inside the dialog', () => {
    // Arrange
    const closeSpy = jasmine.createSpy('closeModal');
    component.closeModal.subscribe(closeSpy);

    // Act & Assert
    dialog().click();
    expect(closeSpy).not.toHaveBeenCalled();

    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(closeSpy).toHaveBeenCalledTimes(1);

    theater().click();
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it('should render every tier and lock the ones the balance cannot afford', () => {
    // Arrange
    const host = fixture.nativeElement as HTMLElement;

    // Assert
    expect(host.querySelectorAll('.lootbox-tier-card').length).toBe(LOOTBOX_TIERS_FALLBACK.length);
    LOOTBOX_TIERS_FALLBACK.forEach(tier => {
      const btn = host.querySelector(`[data-testid="open-lootbox-btn-${tier.tier}"]`) as HTMLButtonElement;
      expect(btn.disabled).toBe(100 < tier.costXp);
    });
  });
});