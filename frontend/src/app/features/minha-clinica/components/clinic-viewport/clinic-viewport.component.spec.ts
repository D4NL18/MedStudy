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
    expect(sorted).toHaveSize(3);
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

  describe('Picking e confirmação de posicionamento (P-084, P-088, P-090)', () => {
    const bau = () => CLINIC_CATALOG_FALLBACK.find(i => i.id === 'ped_bau_coragem')!;
    let emitted: Array<{ gridX: number; gridY: number; fromWall?: boolean; wallSide?: string }>;

    beforeEach(() => {
      emitted = [];
      component.tileClicked.subscribe(e => emitted.push(e));
      component.editMode = true;
    });

    it('should keep rotation binary like the database CHECK (0 = SE, 1 = SW)', () => {
      component.selectedRotation = 1;
      expect(component.selectedRotationSignal()).toBe(1);
      component.selectedRotation = 3;
      expect(component.selectedRotationSignal()).toBe(1);
      component.selectedRotation = 2;
      expect(component.selectedRotationSignal()).toBe(0);
    });

    it('should never let the ghost or placed sprites intercept the pointer while placing', () => {
      // Arrange
      component.selectedCatalogItem = bau();
      component.onTileHover(0, 3);
      fixture.detectChanges();
      const host: HTMLElement = fixture.nativeElement;

      // Assert: ghost sprite exists but is not interactive and its shapes resolve to pointer-events none
      const ghostSvg = host.querySelector('.ghost-item-anchor svg.clinic-item-svg')!;
      expect(ghostSvg).toBeTruthy();
      expect(ghostSvg.classList).not.toContain('is-interactive');
      const ghostShape = ghostSvg.querySelector('path, rect, circle, polygon:not(.shadow-polygon)')!;
      expect(getComputedStyle(ghostShape).pointerEvents).toBe('none');

      const placedSvgs = host.querySelectorAll('.placed-item-anchor svg.clinic-item-svg');
      expect(placedSvgs.length).toBe(3);
      placedSvgs.forEach(svg => expect(svg.classList).not.toContain('is-interactive'));
    });

    it('should make placed sprites clickable again when nothing is being placed', () => {
      // Act
      fixture.detectChanges();
      const svg = (fixture.nativeElement as HTMLElement).querySelector('.placed-item-anchor svg.clinic-item-svg')!;
      const shape = svg.querySelector('path, rect, circle, polygon:not(.shadow-polygon)')!;

      // Assert
      expect(svg.classList).toContain('is-interactive');
      expect(getComputedStyle(shape).pointerEvents.toLowerCase()).toBe('visiblepainted');
    });

    it('should place immediately on mouse click and confirm the previewed tile via the ✓ button', () => {
      // Arrange
      component.selectedCatalogItem = bau();

      // Act 1: mouse click places right away
      component.onTileClick(1, 2);
      // Act 2: hover another tile and confirm through the pill button
      component.onTileHover(2, 3, new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      component.confirmPlacement();

      // Assert
      expect(emitted).toEqual([
        { gridX: 1, gridY: 2 },
        { gridX: 2, gridY: 3 }
      ]);
    });

    it('should preview on the first touch tap and confirm only on a second tap on the same tile', () => {
      // Arrange: last pointer was a finger
      component.selectedCatalogItem = bau();
      component.onPointerDown(new PointerEvent('pointerdown', { pointerType: 'touch', button: 0 }));
      component.onPointerUp();

      // Act 1: first tap only moves the ghost (touch has no hover)
      component.onTileHover(3, 3, new PointerEvent('pointerenter', { pointerType: 'touch' }));
      component.onTileClick(2, 3);

      // Assert 1
      expect(emitted).toEqual([]);
      expect(component.hoveredTile()).toEqual({ gridX: 2, gridY: 3 });

      // Act 2: second tap on the same tile confirms
      component.onTileClick(2, 3);

      // Assert 2
      expect(emitted).toEqual([{ gridX: 2, gridY: 3 }]);
    });

    it('should not confirm on the very first touch even when it lands on the initial (0, 0) hover', () => {
      // Arrange
      component.selectedCatalogItem = bau();
      component.onPointerDown(new PointerEvent('pointerdown', { pointerType: 'touch', button: 0 }));
      component.onPointerUp();

      // Act
      component.onTileClick(0, 0);

      // Assert
      expect(emitted).toEqual([]);
    });

    it('should compare the resolved wall slot on touch: floor tap then wall-strip tap on the same slot confirms', () => {
      // Arrange
      component.selectedCatalogItem = CLINIC_CATALOG_FALLBACK.find(i => i.placementType === 'WALL')!;
      component.onPointerDown(new PointerEvent('pointerdown', { pointerType: 'touch', button: 0 }));
      component.onPointerUp();

      // Act: floor tile (3, 1) projects onto NE segment 3, then the NE-3 wall strip is tapped
      component.onTileClick(3, 1);
      component.onWallSliceClick('NE', 3);

      // Assert
      expect(emitted).toEqual([{ gridX: 3, gridY: 0, fromWall: true, wallSide: 'NE' }]);
    });

    it('should emit the explicit wall side so NE segment 0 is not confused with NW segment 0', () => {
      // Arrange
      component.selectedCatalogItem = CLINIC_CATALOG_FALLBACK.find(i => i.placementType === 'WALL')!;

      // Act
      component.onWallSliceHover('NE', 0);
      const ghost = component.ghostPreview();
      component.onWallSliceClick('NE', 0);

      // Assert
      expect(ghost?.wallSide).toBe('NE');
      expect(emitted).toEqual([{ gridX: 0, gridY: 0, fromWall: true, wallSide: 'NE' }]);
    });

    it('should spawn the ghost at the current position of the item selected for moving', () => {
      // Act
      component.selectedCatalogItem = CLINIC_CATALOG_FALLBACK.find(i => i.id === 'ped_maca_baleia')!;
      component.movingPlacedId = 'item-far';

      // Assert
      expect(component.hoveredTile()).toEqual({ gridX: 2, gridY: 2 });
      expect(component.ghostPreview()?.valid).toBeTrue();
    });

    it('should route the pill cancel to the doctor or to the item placement', () => {
      // Arrange
      const cancelItem = jasmine.createSpy('cancelPlacement');
      const cancelDoctor = jasmine.createSpy('cancelMovingDoctor');
      component.cancelPlacement.subscribe(cancelItem);
      component.cancelMovingDoctor.subscribe(cancelDoctor);

      // Act & Assert
      component.selectedCatalogItem = bau();
      component.onCancelPlacement();
      expect(cancelItem).toHaveBeenCalledTimes(1);

      component.selectedCatalogItem = null;
      component.isMovingDoctor = true;
      component.onCancelPlacement();
      expect(cancelDoctor).toHaveBeenCalledTimes(1);
    });
  });

  it('should scale the diorama down to fit narrow containers (responsividade)', () => {
    // Act: simulate a phone-sized viewport shell
    component['shellSize'].set({ width: 320, height: 360 });

    // Assert
    expect(component.fitScale()).toBeLessThan(1);
    expect(component.fitScale()).toBeGreaterThanOrEqual(0.35);
    expect(component.stageTransform()).toContain(`scale(${component.fitScale()})`);
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

  it('should clamp wall item elevation to prevent flying items outside diorama', () => {
    // Arrange: items with invalid high elevation (e.g. legacy 76)
    const placedItemWithHighElevation = {
      id: 'flying-lea',
      catalogItemId: 'ped_oftalmo_figuras_lea',
      gridX: 0,
      gridY: 2,
      wallSide: 'NW' as const,
      wallTileIndex: 2,
      elevationZ: 76,
      rotation: 0,
      placed: true,
      placementType: 'WALL' as const
    };
    const groundRulerItem = {
      id: 'ground-girafa',
      catalogItemId: 'ped_regua_girafa',
      gridX: 0,
      gridY: 3,
      wallSide: 'NW' as const,
      wallTileIndex: 3,
      elevationZ: 76,
      rotation: 0,
      placed: true,
      placementType: 'WALL' as const
    };

    component.placedItems = [placedItemWithHighElevation as any, groundRulerItem as any];
    fixture.detectChanges();

    const rendered = component.sortedRenderItems();
    const leaRender = rendered.find(r => r.placed.id === 'flying-lea');
    const rulerRender = rendered.find(r => r.placed.id === 'ground-girafa');

    expect(leaRender).toBeDefined();
    expect(rulerRender).toBeDefined();

    const wallBaseLea = component['clinicService'].gridToScreen(0, 2.5, component.originX(), component.originY());
    const wallBaseRuler = component['clinicService'].gridToScreen(0, 3.5, component.originX(), component.originY());

    // Lea chart must be clamped to safe 28px elevation, NOT 76px
    expect(leaRender!.screenY).toBe(wallBaseLea.y - 28);

    // Ground ruler must remain at floor level (elevation 0), NOT 76px
    expect(rulerRender!.screenY).toBe(wallBaseRuler.y);
  });
});
