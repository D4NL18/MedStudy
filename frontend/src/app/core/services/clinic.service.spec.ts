import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClinicService } from './clinic.service';
import { ClinicAudioService } from './clinic-audio.service';
import {
  CLINIC_CATALOG_FALLBACK,
  ClinicPlacedItem,
  ClinicState
} from '../models/clinic.model';

describe('ClinicService & ClinicAudioService (P-080 a P-086)', () => {
  let service: ClinicService;
  let audioService: ClinicAudioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('medstudy_clinic_audio_muted');
    localStorage.removeItem('medstudy_clinic_local_state');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ClinicService,
        ClinicAudioService
      ]
    });

    service = TestBed.inject(ClinicService);
    audioService = TestBed.inject(ClinicAudioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('medstudy_clinic_audio_muted');
    localStorage.removeItem('medstudy_clinic_local_state');
  });

  describe('P-081: Motor Matemático de Recompensas de Estudo e Multiplicador de Streak', () => {
    it('should return correct streak multiplier fraction for all streak brackets and negative edge cases', () => {
      // Arrange & Act & Assert
      expect(service.getStreakMultiplier(-5)).toBe(0);
      expect(service.getStreakMultiplier(0)).toBe(0);
      expect(service.getStreakMultiplier(2)).toBe(0);
      expect(service.getStreakMultiplier(3)).toBe(0.10);
      expect(service.getStreakMultiplier(6)).toBe(0.10);
      expect(service.getStreakMultiplier(7)).toBe(0.20);
      expect(service.getStreakMultiplier(13)).toBe(0.20);
      expect(service.getStreakMultiplier(14)).toBe(0.35);
      expect(service.getStreakMultiplier(29)).toBe(0.35);
      expect(service.getStreakMultiplier(30)).toBe(0.50);
      expect(service.getStreakMultiplier(120)).toBe(0.50);
    });

    it('should calculate preview XP accurately for questions, flashcards, videos and simulados with streak', () => {
      // Arrange: 0 days streak (1.00x)
      // Act & Assert
      expect(service.calculatePreviewXp('QUESTION_SUBMITTED', 0)).toBe(15);
      expect(service.calculatePreviewXp('QUESTION_CORRECT', 0)).toBe(40);
      expect(service.calculatePreviewXp('QUESTION_STREAK_3', 0)).toBe(15);
      expect(service.calculatePreviewXp('QUESTION_STREAK_5', 0)).toBe(30);
      expect(service.calculatePreviewXp('QUESTION_STREAK_10', 0)).toBe(75);
      expect(service.calculatePreviewXp('FLASHCARD_EASY', 0)).toBe(8);
      expect(service.calculatePreviewXp('FLASHCARD_MEDIUM', 0)).toBe(12);
      expect(service.calculatePreviewXp('FLASHCARD_HARD', 0)).toBe(5);
      expect(service.calculatePreviewXp('DAILY_DECK_COMPLETED', 0)).toBe(100);
      expect(service.calculatePreviewXp('VIDEO_10_MIN', 0)).toBe(50);
      expect(service.calculatePreviewXp('VIDEO_COMPLETED', 0)).toBe(80);
      expect(service.calculatePreviewXp('VIDEO_NOTE', 0)).toBe(30);

      // Arrange: Simulado with 80% accuracy (300 + 80*5 = 700) and 30 days streak (1.50x -> 1050)
      // Act
      const simuladoXp = service.calculatePreviewXp('SIMULADO_COMPLETED', 30, 80);

      // Assert
      expect(simuladoXp).toBe(1050);
    });

    it('should clamp negative or >100% accuracy in SIMULADO_COMPLETED calculation', () => {
      // Arrange & Act
      const negativeAccXp = service.calculatePreviewXp('SIMULADO_COMPLETED', 0, -25);
      const overAccXp = service.calculatePreviewXp('SIMULADO_COMPLETED', 0, 150);

      // Assert
      expect(negativeAccXp).toBe(300);
      expect(overAccXp).toBe(800);
    });
  });

  describe('P-085: Projeção Isométrica Ortográfica 2:1 (64x32px) e Depth Sorting', () => {
    it('should calculate deterministic depth = (gridX + gridY) * 1000 + z', () => {
      // Arrange & Act
      const d1 = service.calculateDepth(0, 0, 0);
      const d2 = service.calculateDepth(2, 3, 15);
      const d3 = service.calculateDepth(3, 2, 5);

      // Assert
      expect(d1).toBe(0);
      expect(d2).toBe(5015);
      expect(d3).toBe(5005);
      expect(d2).toBeGreaterThan(d3);
    });

    it('should project grid coordinates to 2:1 isometric screen coordinates and invert back accurately', () => {
      // Arrange
      const originX = 400;
      const originY = 120;

      // Act
      const screenPos = service.gridToScreen(3, 1, originX, originY);
      const gridBack = service.screenToGrid(screenPos.x, screenPos.y, originX, originY);

      // Assert: screenX = 400 + (3 - 1) * 32 = 464; screenY = 120 + (3 + 1) * 16 = 184
      expect(screenPos.x).toBe(464);
      expect(screenPos.y).toBe(184);
      expect(gridBack.gridX).toBe(3);
      expect(gridBack.gridY).toBe(1);

      // Assert tile center (3.5, 1.5): screenX = 400 + (3.5 - 1.5) * 32 = 464, screenY = 120 + 5 * 16 = 200
      const centerBack = service.screenToGrid(464, 200, originX, originY);
      expect(centerBack.gridX).toBe(3);
      expect(centerBack.gridY).toBe(1);

      // Assert tile (0, 0) center: screenX = 400, screenY = 136 -> must map 1:1 to (0, 0) without diagonal offset
      const tile00Center = service.screenToGrid(originX, originY + 16, originX, originY);
      expect(tile00Center.gridX).toBe(0);
      expect(tile00Center.gridY).toBe(0);
    });
  });

  describe('P-084: Inversão de Footprint por Rotação e Colisão AABB 2D', () => {
    it('should invert footprintX and footprintY when rotation is 1 (SW)', () => {
      // Arrange
      const item = { footprintX: 2, footprintY: 1 };

      // Act
      const fp0 = service.getEffectiveFootprint(item, 0);
      const fp1 = service.getEffectiveFootprint(item, 1);

      // Assert
      expect(fp0).toEqual({ width: 2, height: 1 });
      expect(fp1).toEqual({ width: 1, height: 2 });
    });

    it('should validate grid boundaries and detect AABB 2D collisions including rotated footprints', () => {
      // Arrange: 4x4 grid with ped_maca_baleia (2x1) placed at (0,0) with rotation 0 (occupies (0,0) and (1,0))
      const placedItems: ClinicPlacedItem[] = [
        {
          id: 'placed-1',
          catalogItemId: 'ped_maca_baleia',
          gridX: 0,
          gridY: 0,
          rotation: 0,
          placed: true
        }
      ];

      // Act & Assert
      // 1. Out of bounds (negative or exceeding 4x4)
      expect(
        service.isPositionValid(-1, 0, 1, 1, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeFalse();
      expect(
        service.isPositionValid(3, 0, 2, 1, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeFalse();
      // With rotation=1, 2x1 becomes 1x2, so at (3,0) it occupies (3,0) and (3,1) which fits in 4x4!
      expect(
        service.isPositionValid(3, 0, 2, 1, 1, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeTrue();

      // 2. Collision with ped_maca_baleia at (1,0)
      expect(
        service.isPositionValid(1, 0, 1, 1, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeFalse();

      // 3. Ignoring self when moving placed-1 to (1,0)
      expect(
        service.isPositionValid(1, 0, 2, 1, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK, 'placed-1')
      ).toBeTrue();

      // 4. Free cell at (0,1)
      expect(
        service.isPositionValid(0, 1, 1, 1, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeTrue();

      // 5. Wall item (0x0 footprint) cannot overlap floor item at (0, 0), but is valid at free tile (0, 1)
      expect(
        service.isPositionValid(0, 0, 0, 0, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeFalse();
      expect(
        service.isPositionValid(0, 1, 0, 0, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeTrue();

      // 6. Wall item placed in middle of room (gridX != 0 and gridY != 0) is invalid
      expect(
        service.isPositionValid(2, 2, 0, 0, 0, 4, 4, placedItems, CLINIC_CATALOG_FALLBACK)
      ).toBeFalse();

      // 7. Wall item colliding with existing wall item on same slot
      const itemsWithWall: ClinicPlacedItem[] = [
        ...placedItems,
        {
          id: 'wall-1',
          catalogItemId: 'ped_regua_girafa',
          gridX: 0,
          gridY: 1,
          rotation: 0,
          placed: true,
          wallSide: 'NW',
          wallTileIndex: 1
        }
      ];
      expect(
        service.isPositionValid(0, 1, 0, 0, 0, 4, 4, itemsWithWall, CLINIC_CATALOG_FALLBACK)
      ).toBeFalse();
    });
  });

  describe('P-080, P-082, P-083: Comunicação HTTP e Estado Reativo da Clínica', () => {
    it('should load clinic state unwrapping API envelope { data } and ensuring all catalog items', () => {
      // Arrange
      const mockState: Partial<ClinicState> = {
        clinicId: 'c-1',
        clinicName: 'Clínica Teste',
        expansionLevel: 1,
        expansionName: 'Box do Internato',
        gridWidth: 4,
        gridHeight: 4,
        lifetimeXp: 1600,
        currentXp: 1300,
        currentStreakDays: 7,
        streakMultiplierPercent: 20,
        canExpand: true,
        ownedItemIds: ['mesa_scandi'],
        placedItems: [],
        inventory: [],
        catalog: []
      };

      // Act
      service.loadClinic().subscribe();
      const req = httpMock.expectOne('/api/v1/clinic');
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockState });

      // Assert
      const current = service.clinicState();
      expect(current).toBeTruthy();
      expect(current?.clinicName).toBe('Clínica Teste');
      expect(current?.catalog.length).toBe(154);
      expect(current?.lifetimeXp).toBe(1600);
      expect(current?.currentXp).toBe(1300);
    });

    it('should credit XP and trigger xpToast when recordStudyAction succeeds (P-081, P-086)', () => {
      // Arrange
      const rewardMock = {
        xpEarned: 48,
        baseXp: 40,
        streakMultiplierPercent: 20,
        currentStreakDays: 7,
        lifetimeXp: 1648,
        currentXp: 1348,
        actionType: 'QUESTION_CORRECT',
        message: '+48 XP (Salvo na Clínica)'
      };

      // Act
      service.recordStudyAction({ actionType: 'QUESTION_CORRECT' }).subscribe();
      const req = httpMock.expectOne('/api/v1/study/action-reward');
      expect(req.request.method).toBe('POST');
      req.flush({ data: rewardMock });

      // Assert
      expect(service.xpToast()?.xpEarned).toBe(48);
      expect(service.xpToast()?.message).toContain('Salvo na Clínica');
    });
  });

  describe('P-086: ClinicAudioService & Controle de Mudo Persistido', () => {
    it('should persist mute state in localStorage under medstudy_clinic_audio_muted', () => {
      // Arrange
      expect(audioService.isMuted()).toBeFalse();

      // Act
      audioService.toggleMute();

      // Assert
      expect(audioService.isMuted()).toBeTrue();
      expect(localStorage.getItem('medstudy_clinic_audio_muted')).toBe('true');

      // Act again
      audioService.setMuted(false);
      expect(audioService.isMuted()).toBeFalse();
      expect(localStorage.getItem('medstudy_clinic_audio_muted')).toBe('false');
    });

    it('should not throw or play sound when muted is true', () => {
      // Arrange
      audioService.setMuted(true);

      // Act & Assert
      expect(() => {
        audioService.playClick();
        audioService.playBuySuccess();
        audioService.playExpandFanfare();
        audioService.playItemSound('dino_blink');
      }).not.toThrow();
    });
  });

  describe('P-094 & P-095: Caixas da Sorte Médicas e Lootboxes em 3 Tiers', () => {
    it('should fetch lootbox tiers with probabilities from /api/v1/clinic/lootboxes', () => {
      // Act
      service.getLootboxTiers().subscribe(tiers => {
        expect(tiers).toHaveSize(3);
        expect(tiers[0].tier).toBe('TIER_1_RESIDENT');
        expect(tiers[0].costXp).toBe(500);
      });

      // Assert
      const req = httpMock.expectOne('/api/v1/clinic/lootboxes');
      expect(req.request.method).toBe('GET');
      req.flush({
        data: [
          {
            tier: 'TIER_1_RESIDENT',
            name: 'Caixa do Residente',
            description: 'Desc',
            costXp: 500,
            badgeColor: '#94A3B8',
            assetSvgKey: 'lootbox_tier1_resident',
            minRarityGuaranteed: 'COMMON',
            probabilities: { common: 60, rare: 30, epic: 9, legendary: 1 }
          },
          {
            tier: 'TIER_2_SPECIALIST',
            name: 'Caixa do Especialista',
            description: 'Desc',
            costXp: 1500,
            badgeColor: '#0284C7',
            assetSvgKey: 'lootbox_tier2_specialist',
            minRarityGuaranteed: 'RARE',
            probabilities: { common: 0, rare: 65, epic: 28, legendary: 7 }
          },
          {
            tier: 'TIER_3_CHIEF_OF_STAFF',
            name: 'Caixa do Chefe de Ala',
            description: 'Desc',
            costXp: 4000,
            badgeColor: '#F59E0B',
            assetSvgKey: 'lootbox_tier3_chief',
            minRarityGuaranteed: 'EPIC',
            probabilities: { common: 0, rare: 0, epic: 75, legendary: 25 }
          }
        ]
      });
    });

    it('should open lootbox, update clinic currentXp and add item to inventory', () => {
      // Arrange
      const initialClinicState: ClinicState = {
        clinicId: 'c1',
        clinicName: 'Clínica Inicial',
        expansionLevel: 1,
        expansionName: 'Box do Internato',
        gridWidth: 4,
        gridHeight: 4,
        theme: 'clean_modern',
        wallTheme: 'wall_clean_white',
        floorTheme: 'floor_porcelanato_cinza',
        lifetimeXp: 5000,
        currentXp: 2000,
        currentStreakDays: 3,
        streakMultiplierPercent: 10,
        nextExpansionLevel: 2,
        nextExpansionName: 'Consultório Júnior',
        nextExpansionGridWidth: 6,
        nextExpansionGridHeight: 6,
        nextExpansionCostXp: 1200,
        nextExpansionRequiredLifetimeXp: 1500,
        canExpand: true,
        ownedItemIds: [],
        placedItems: [],
        inventory: [],
        catalog: CLINIC_CATALOG_FALLBACK
      };
      service.clinicState.set(initialClinicState);

      // Act
      service.openLootbox('TIER_1_RESIDENT').subscribe(res => {
        expect(res.tier).toBe('TIER_1_RESIDENT');
        expect(res.droppedItem.id).toBe('ped_maca_foguete_retro');
        expect(res.isDuplicate).toBeFalse();
        expect(res.currentXpAfter).toBe(1500);

        // Check reactive signal update
        const state = service.clinicState();
        expect(state?.currentXp).toBe(1500);
        expect(state?.ownedItemIds).toContain('ped_maca_foguete_retro');
        expect(state?.inventory.length).toBe(1);
      });

      // Assert
      const req = httpMock.expectOne('/api/v1/clinic/lootboxes/TIER_1_RESIDENT/open');
      expect(req.request.method).toBe('POST');
      req.flush({
        data: {
          tier: 'TIER_1_RESIDENT',
          tierName: 'Caixa do Residente',
          costXp: 500,
          droppedItem: {
            id: 'ped_maca_foguete_retro',
            name: 'Maca Foguete Espacial Retrô',
            category: 'pediatria',
            costXp: 3400,
            footprintX: 2,
            footprintY: 1,
            placementType: 'FLOOR',
            minExpansionLevel: 2,
            interactable: true,
            assetSvgKey: 'ped_maca_foguete_retro',
            rarity: 'RARE',
            isLootboxExclusive: true
          },
          isDuplicate: false,
          cashbackXpAwarded: 0,
          currentXpAfter: 1500,
          lifetimeXp: 5000,
          openedAt: '2026-10-28T22:31:00Z'
        }
      });
    });
  });
});
