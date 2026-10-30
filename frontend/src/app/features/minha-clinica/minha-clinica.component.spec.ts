import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MinhaClinicaComponent } from './minha-clinica.component';
import { CLINIC_CATALOG_FALLBACK, ClinicState } from '@core/models/clinic.model';

describe('MinhaClinicaComponent (P-080 a P-086)', () => {
  let component: MinhaClinicaComponent;
  let fixture: ComponentFixture<MinhaClinicaComponent>;
  let httpMock: HttpTestingController;

  const mockLevel1Clinic: ClinicState = {
    clinicId: 'clinic-1',
    clinicName: 'Minha Clínica',
    expansionLevel: 1,
    expansionName: 'Box do Internato',
    gridWidth: 4,
    gridHeight: 4,
    theme: 'clean_modern',
    wallTheme: 'clean_white',
    floorTheme: 'wood_light',
    avatar: {
      gender: 'MALE',
      skinCoat: 'coat_default',
      skinStethoscope: 'steth_standard',
      skinAccessory: 'acc_none',
      avatarX: 1,
      avatarY: 1
    },
    ownedSurfaces: [],
    lifetimeXp: 1800,
    currentXp: 1500,
    currentStreakDays: 7,
    streakMultiplierPercent: 20,
    nextExpansionLevel: 2,
    nextExpansionName: 'Consultório Júnior',
    nextExpansionGridWidth: 6,
    nextExpansionGridHeight: 6,
    nextExpansionCostXp: 1200,
    nextExpansionRequiredLifetimeXp: 1500,
    canExpand: true,
    ownedItemIds: ['mesa_scandi', 'cadeira_ergonomica', 'ped_maca_baleia'],
    placedItems: [
      {
        id: 'p-1',
        catalogItemId: 'mesa_scandi',
        gridX: 0,
        gridY: 0,
        rotation: 0,
        placed: true
      }
    ],
    inventory: [
      {
        id: 'p-1',
        catalogItemId: 'mesa_scandi',
        gridX: 0,
        gridY: 0,
        rotation: 0,
        placed: true
      }
    ],
    catalog: CLINIC_CATALOG_FALLBACK
  };

  beforeEach(async () => {
    localStorage.removeItem('medstudy_clinic_audio_muted');

    await TestBed.configureTestingModule({
      imports: [MinhaClinicaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaClinicaComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match('/api/v1/clinic/lootboxes').forEach(r => r.flush({ data: [] }));
    httpMock.verify();
  });

  it('should render Isometric Shimmer Skeleton Loader before GET /api/v1/clinic resolves and then render HUD & catalog items', () => {
    // Arrange & Act: trigger ngOnInit
    fixture.detectChanges();
    const skeletonEl = fixture.nativeElement.querySelector('[data-testid="clinic-skeleton"]');
    expect(skeletonEl).toBeTruthy();

    // Flush GET /api/v1/clinic
    const req = httpMock.expectOne('/api/v1/clinic');
    req.flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    // Assert HUD values
    expect(component.clinic()?.expansionName).toBe('Box do Internato');
    expect(component.clinic()?.lifetimeXp).toBe(1800);
    expect(component.clinic()?.currentXp).toBe(1500);
    expect(component.filteredCatalogItems().length).toBe(39); // Default tab: pediatria (39 items)
  });

  it('should filter catalog across the 4 official tabs (Pediatria=39, Móveis=38, Equipamentos=39, Conforto=38) (P-083)', () => {
    // Arrange
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    // Act & Assert
    component.selectCategory('pediatria');
    expect(component.filteredCatalogItems().length).toBe(39);

    component.selectCategory('mobiliario');
    expect(component.filteredCatalogItems().length).toBe(38);

    component.selectCategory('clinica');
    expect(component.filteredCatalogItems().length).toBe(39);

    component.selectCategory('recepcao');
    expect(component.filteredCatalogItems().length).toBe(38);
  });

  it('should show illustrated Empty State when filtering by Meus Itens in a category without owned items', () => {
    // Arrange
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    // Act: switch to 'clinica' (0 owned items in mockLevel1Clinic) and filter 'owned'
    component.selectCategory('clinica');
    component.setInventoryFilter('owned');
    fixture.detectChanges();

    // Assert
    expect(component.filteredCatalogItems().length).toBe(0);
    const emptyEl = fixture.nativeElement.querySelector('[data-testid="clinic-empty-state"]');
    expect(emptyEl).toBeTruthy();
  });

  it('should rotate selected item between 0 (SE) and 1 (SW) via button or R key and place on valid tile (P-084)', () => {
    // Arrange
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    const whaleItem = CLINIC_CATALOG_FALLBACK.find(i => i.id === 'ped_maca_baleia')!;

    // Act: select owned item for placement and rotate
    component.toggleEditMode();
    component.selectItemForPlacement(whaleItem);
    expect(component.selectedRotation()).toBe(0);

    component.toggleRotation();
    expect(component.selectedRotation()).toBe(1);

    // Place on valid free tile (2, 1) with rotation 1 (footprint 1x2 fits in 4x4)
    component.onViewportTileClicked({ gridX: 2, gridY: 1 });
    fixture.detectChanges();

    // Assert: item added to workingPlacedItems and layout marked dirty
    expect(component.isLayoutDirty()).toBeTrue();
    const placedWhale = component
      .workingPlacedItems()
      .find(p => p.catalogItemId === 'ped_maca_baleia');
    expect(placedWhale).toBeTruthy();
    expect(placedWhale?.gridX).toBe(2);
    expect(placedWhale?.gridY).toBe(1);
    expect(placedWhale?.rotation).toBe(1);
  });

  it('should buy an item and expand clinic calling backend endpoints (P-082, P-083)', () => {
    // Arrange
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    const giraffeItem = CLINIC_CATALOG_FALLBACK.find(i => i.id === 'ped_regua_girafa')!;

    // Act 1: buy item
    component.buyCatalogItem(giraffeItem);
    const buyReq = httpMock.expectOne('/api/v1/clinic/items/buy');
    expect(buyReq.request.method).toBe('POST');
    expect(buyReq.request.body.catalogItemId).toBe('ped_regua_girafa');
    buyReq.flush({
      data: {
        ...mockLevel1Clinic,
        currentXp: 1500,
        ownedItemIds: [...mockLevel1Clinic.ownedItemIds, 'ped_regua_girafa']
      }
    });

    expect(component.isItemOwned('ped_regua_girafa')).toBeTrue();
    expect(component.canExpandNow()).toBeTrue();

    // Act 2: expand clinic
    component.expandClinicRoom();
    const expandReq = httpMock.expectOne('/api/v1/clinic/expand');
    expect(expandReq.request.method).toBe('POST');
    expandReq.flush({
      data: {
        ...mockLevel1Clinic,
        expansionLevel: 2,
        expansionName: 'Consultório Júnior',
        gridWidth: 6,
        gridHeight: 6,
        currentXp: 300
      }
    });

    expect(component.clinic()?.expansionLevel).toBe(2);
    expect(component.clinic()?.gridWidth).toBe(6);
  });

  it('should open doctor avatar customizer, toggle gender freely between MALE and FEMALE without XP cost, and save style (P-087, P-088)', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    // Act 1: open customizer
    component.openAvatarCustomizer();
    expect(component.isAvatarModalOpen()).toBeTrue();
    expect(component.tempAvatarGender()).toBe('MALE');

    // Act 2: switch to FEMALE (Dra.) - 0 XP
    component.setAvatarGender('FEMALE');
    expect(component.tempAvatarGender()).toBe('FEMALE');
    expect(component.clinic()?.currentXp).toBe(1500); // Saldo intocado

    // Act 3: save avatar customization
    component.saveAvatarCustomization();
    const avatarReq = httpMock.expectOne('/api/v1/clinic/avatar');
    expect(avatarReq.request.method).toBe('PUT');
    expect(avatarReq.request.body.gender).toBe('FEMALE');
    avatarReq.flush({
      data: {
        avatarId: 'av-1',
        gender: 'FEMALE',
        skinCoat: 'coat_default',
        skinStethoscope: 'steth_standard',
        skinAccessory: 'acc_none',
        avatarX: 1,
        avatarY: 1,
        unlockedSkins: ['coat_default', 'steth_standard', 'acc_none']
      }
    });

    expect(component.isAvatarModalOpen()).toBeFalse();
    expect(component.currentAvatar()?.gender).toBe('FEMALE');
  });

  it('should open surfaces modal, update wallpaper and floor, calling PUT /api/v1/clinic/surfaces (P-087)', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    // Act 1: open surfaces modal
    component.openSurfacesModal();
    expect(component.isSurfacesModalOpen()).toBeTrue();
    expect(component.tempWallTheme()).toBe('clean_white');
    expect(component.tempFloorTheme()).toBe('wood_light');

    // Act 2: select safari wallpaper and tatame floor
    component.tempWallTheme.set('ped_papel_safari');
    component.tempFloorTheme.set('tatame_eva');

    // Act 3: save surfaces
    component.saveSurfacesCustomization();
    const surfReq = httpMock.expectOne('/api/v1/clinic/surfaces');
    expect(surfReq.request.method).toBe('PUT');
    expect(surfReq.request.body.wallTheme).toBe('ped_papel_safari');
    expect(surfReq.request.body.floorTheme).toBe('tatame_eva');
    surfReq.flush({
      data: {
        ...mockLevel1Clinic,
        wallTheme: 'ped_papel_safari',
        floorTheme: 'tatame_eva'
      }
    });

    expect(component.isSurfacesModalOpen()).toBeFalse();
    expect(component.clinic()?.wallTheme).toBe('ped_papel_safari');
    expect(component.clinic()?.floorTheme).toBe('tatame_eva');
  });

  it('should open lootboxes modal, display tiers, and trigger unboxing with cashback on duplicate (US-11, US-12, US-13, P-093, P-094, P-095)', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({ data: mockLevel1Clinic });
    fixture.detectChanges();

    // Act 1: open modal
    component.openLootboxModal();
    expect(component.isLootboxModalOpen()).toBeTrue();
    expect(component.lootboxTiers().length).toBe(3);

    // Act 2: open resident box
    component.triggerOpenLootbox('TIER_1_RESIDENT');
    expect(component.isUnboxing()).toBeTrue();

    const openReq = httpMock.expectOne('/api/v1/clinic/lootboxes/TIER_1_RESIDENT/open');
    expect(openReq.request.method).toBe('POST');
    openReq.flush({
      data: {
        tier: 'TIER_1_RESIDENT',
        tierName: 'Caixa do Residente',
        costXp: 500,
        droppedItem: {
          id: 'ped_maca_dino',
          name: 'Maca Dinossauro Safari',
          category: 'pediatria',
          costXp: 3500,
          minExpansionLevel: 1,
          footprintX: 2,
          footprintY: 1,
          interactable: true,
          soundFxUrl: 'dino_blink',
          assetSvgKey: 'ped_maca_dino',
          rarity: 'LEGENDARY',
          isLootboxExclusive: true
        },
        isDuplicate: true,
        cashbackXpAwarded: 1500,
        currentXpAfter: 2500,
        lifetimeXp: 1800,
        openedAt: '2026-10-28T20:00:00Z'
      }
    });

    tick(1400); // Avança os 1.35s da micro-animação
    expect(component.isUnboxing()).toBeFalse();
    expect(component.lootboxRevealResult()?.isDuplicate).toBeTrue();
    expect(component.lootboxRevealResult()?.cashbackXpAwarded).toBe(1500);

    // Act 3: close modal
    component.closeLootboxModal();
    expect(component.isLootboxModalOpen()).toBeFalse();
  }));

  it('should compute doctorDisplayName, display daily free lootbox, and open daily free box at 0 XP', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({
      data: {
        ...mockLevel1Clinic,
        userName: 'Lari Meirelles',
        userFirstName: 'Lari',
        dailyFreeLootboxAvailable: true,
        avatar: {
          avatarId: 'av-1',
          gender: 'FEMALE',
          skinCoat: 'coat_default',
          skinStethoscope: 'steth_standard',
          skinAccessory: 'acc_none',
          avatarX: 1,
          avatarY: 1
        }
      }
    });
    fixture.detectChanges();

    // 1. Verify doctorDisplayName formatting: "Dra. Lari"
    expect(component.doctorDisplayName()).toBe('Dra. Lari');
    expect(component.isDailyFreeAvailable()).toBeTrue();

    // 2. Open Daily Free Lootbox
    component.openLootboxModal();
    expect(component.isLootboxModalOpen()).toBeTrue();

    component.triggerOpenDailyFreeLootbox();
    expect(component.isUnboxing()).toBeTrue();

    const freeReq = httpMock.expectOne('/api/v1/clinic/lootboxes/daily-free/open');
    expect(freeReq.request.method).toBe('POST');
    freeReq.flush({
      data: {
        tier: 'TIER_1_RESIDENT',
        tierName: 'Caixa do Residente',
        costXp: 0,
        droppedItem: {
          id: 'ped_maca_dino',
          name: 'Maca Dinossauro Safari',
          category: 'pediatria',
          costXp: 3500,
          minExpansionLevel: 1,
          footprintX: 2,
          footprintY: 1,
          interactable: true,
          soundFxUrl: 'dino_blink',
          assetSvgKey: 'ped_maca_dino',
          rarity: 'LEGENDARY',
          isLootboxExclusive: true
        },
        isDuplicate: false,
        cashbackXpAwarded: 0,
        currentXpAfter: 2000,
        lifetimeXp: 1800,
        openedAt: '2026-10-28T20:00:00Z',
        isDailyFree: true
      }
    });

    tick(1400);
    expect(component.isUnboxing()).toBeFalse();
    expect(component.lootboxRevealResult()?.isDailyFree).toBeTrue();
    expect(component.lootboxRevealResult()?.droppedItem.id).toBe('ped_maca_dino');
  }));

  it('should store item into inventory, auto-save layout on toggleEditMode(), and prioritize wall item over floor item on shared tile coordinate', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/clinic').flush({
      data: {
        ...mockLevel1Clinic,
        placedItems: [
          {
            id: 'floor-item-1',
            catalogItemId: 'mesa_scandi',
            gridX: 0,
            gridY: 1,
            rotation: 0,
            placed: true,
            placementType: 'FLOOR'
          },
          {
            id: 'wall-item-1',
            catalogItemId: 'ped_regua_girafa',
            gridX: 0,
            gridY: 1,
            rotation: 0,
            placed: true,
            placementType: 'WALL',
            wallSide: 'NW',
            wallTileIndex: 1
          }
        ]
      }
    });
    fixture.detectChanges();

    // 1. Prioritize wall item when tile (0, 1) has both a wall item and a floor item
    const foundItem = component.findPlacedItemAtTile(0, 1);
    expect(foundItem).toBeTruthy();
    expect(foundItem?.id).toBe('wall-item-1');

    // 2. Rotate placed item in-place across all 4 isometric orientations
    component.toggleEditMode();
    component.movingPlacedId.set('floor-item-1');
    component.selectedRotation.set(0);
    component.toggleRotation();
    expect(component.selectedRotation()).toBe(1);
    expect(component.workingPlacedItems().find(i => i.id === 'floor-item-1')?.rotation).toBe(1);
    expect(component.isLayoutDirty()).toBeTrue();

    // Verify 4-state cycling (0 -> 1 -> 2 -> 3 -> 0)
    component.toggleRotation();
    expect(component.selectedRotation()).toBe(2);
    component.toggleRotation();
    expect(component.selectedRotation()).toBe(3);
    component.toggleRotation();
    expect(component.selectedRotation()).toBe(0);

    // 3. Storing an item removes it from workingPlacedItems and marks layout dirty
    component.movingPlacedId.set('floor-item-1');
    component.storeSelectedPlacedItem();
    expect(component.workingPlacedItems().some(i => i.id === 'floor-item-1')).toBeFalse();
    expect(component.isLayoutDirty()).toBeTrue();

    // 4. Concluir Edição auto-saves layout when dirty and exits edit mode
    component.toggleEditMode();
    const saveReq = httpMock.expectOne('/api/v1/clinic/layout');
    expect(saveReq.request.method).toBe('PUT');
    // Payload should only contain wall-item-1 (floor-item-1 unplaced/omitted)
    expect(saveReq.request.body.items.length).toBe(1);
    expect(saveReq.request.body.items[0].id).toBe('wall-item-1');
    saveReq.flush({
      data: {
        ...mockLevel1Clinic,
        placedItems: [
          {
            id: 'wall-item-1',
            catalogItemId: 'ped_regua_girafa',
            gridX: 0,
            gridY: 1,
            rotation: 0,
            placed: true,
            placementType: 'WALL'
          }
        ]
      }
    });

    expect(component.editMode()).toBeFalse();
    expect(component.isLayoutDirty()).toBeFalse();
    expect(component.workingPlacedItems()).toHaveSize(1);
  });
});
