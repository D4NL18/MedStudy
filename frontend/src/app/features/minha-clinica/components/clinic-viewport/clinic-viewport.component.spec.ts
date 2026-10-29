import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ClinicViewportComponent } from './clinic-viewport.component';
import { CLINIC_CATALOG_FALLBACK, ClinicPlacedItem } from '@core/models/clinic.model';

describe('ClinicViewportComponent (P-082, P-084, P-085, P-086)', () => {
  let component: ClinicViewportComponent;
  let fixture: ComponentFixture<ClinicViewportComponent>;

  const samplePlaced: ClinicPlacedItem[] = [
    {
      id: 'item-far',
      catalogItemId: 'ped_maca_baleia',
      gridX: 2,
      gridY: 2,
      rotation: 0,
      placed: true
    },
    {
      id: 'item-near-origin',
      catalogItemId: 'mesa_scandi',
      gridX: 0,
      gridY: 0,
      rotation: 0,
      placed: true
    },
    {
      id: 'item-mid',
      catalogItemId: 'cadeira_ergonomica',
      gridX: 0,
      gridY: 1,
      rotation: 0,
      placed: true
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicViewportComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicViewportComponent);
    component = fixture.componentInstance;
    component.gridWidth = 4;
    component.gridHeight = 4;
    component.expansionLevel = 1;
    component.catalog = CLINIC_CATALOG_FALLBACK;
    component.placedItems = samplePlaced;
    fixture.detectChanges();
  });

  it('should create and sort placed items deterministically by depth = (x + y) * 1000 + z (P-085)', () => {
    // Arrange & Act
    const sorted = component.sortedRenderItems();

    // Assert
    expect(sorted.length).toBe(3);
    expect(sorted[0].placed.id).toBe('item-near-origin'); // depth = 0
    expect(sorted[1].placed.id).toBe('item-mid'); // depth = 1000
    expect(sorted[2].placed.id).toBe('item-far'); // depth = 4000
  });

  it('should suspend requestAnimationFrame loop immediately when document.hidden becomes true (P-085)', () => {
    // Arrange
    expect(component.isLoopRunning()).toBeTrue();

    // Act: simulate tab hidden
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();

    // Assert
    expect(component.isLoopRunning()).toBeFalse();
    expect(component.isPaused()).toBeTrue();

    // Act: restore tab visibility
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();

    // Assert
    expect(component.isLoopRunning()).toBeTrue();
    expect(component.isPaused()).toBeFalse();
  });

  it('should compute valid green ghost preview on free tile and invalid red ghost on occupied tile (P-084, P-086)', () => {
    // Arrange: enter edit mode with a 1x1 item selected
    component.editMode = true;
    component.selectedCatalogItem = CLINIC_CATALOG_FALLBACK.find(
      i => i.id === 'ped_bau_coragem'
    )!;
    component.selectedRotation = 0;

    // Act 1: hover over occupied tile (0,0) where mesa_scandi is placed
    component.onTileHover(0, 0);
    fixture.detectChanges();
    const invalidGhost = component.ghostPreview();

    // Assert 1
    expect(invalidGhost).toBeTruthy();
    expect(invalidGhost?.valid).toBeFalse();

    // Act 2: hover over free tile (0,3)
    component.onTileHover(0, 3);
    fixture.detectChanges();
    const validGhost = component.ghostPreview();

    // Assert 2
    expect(validGhost).toBeTruthy();
    expect(validGhost?.valid).toBeTrue();
  });

  it('should adjust zoom level within safe bounds and reset camera to 100%', () => {
    // Arrange
    expect(component.zoom()).toBe(1);

    // Act
    component.zoomIn();
    expect(component.zoom()).toBeGreaterThan(1);

    component.resetCamera();
    expect(component.zoom()).toBe(1);
    expect(component.panX()).toBe(0);
    expect(component.panY()).toBe(0);
  });
});
