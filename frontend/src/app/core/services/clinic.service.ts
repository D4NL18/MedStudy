import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import {
  ApiEnvelope,
  BuyClinicItemRequest,
  CLINIC_CATALOG_FALLBACK,
  CLINIC_EXPANSION_LEVELS,
  ClinicCatalogItem,
  ClinicPlacedItem,
  ClinicState,
  ClinicSurfacesUpdateRequest,
  DoctorAvatarResponse,
  DoctorAvatarUpdateDto,
  LOOTBOX_TIERS_FALLBACK,
  LootboxOpenResult,
  LootboxTier,
  LootboxTierInfo,
  SkinBuyRequest,
  StudyActionRewardRequest,
  StudyActionRewardResponse,
  StudyActionType,
  UpdateClinicLayoutRequest
} from '../models/clinic.model';

/**
 * Serviço central da feature "Minha Clínica Médica" & Motor de XP (P-080 a P-086).
 * Centraliza comunicação HTTP, cálculos determinísticos de XP/Streak, projeção isométrica 2:1 e colisão AABB 2D.
 */
@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private readonly http = inject(HttpClient);
  private readonly clinicApiUrl = '/api/v1/clinic';
  private readonly studyApiUrl = '/api/v1/study';

  static readonly TILE_WIDTH = 64;
  static readonly TILE_HEIGHT = 32;

  readonly clinicState = signal<ClinicState | null>(null);
  readonly doctorAvatarResponse = signal<DoctorAvatarResponse | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly xpToast = signal<StudyActionRewardResponse | null>(null);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * P-085: Ordenação de profundidade determinística (Painter's Algorithm):
   * depth = (gridX + gridY) * 1000 + z
   */
  calculateDepth(gridX: number, gridY: number, z = 0): number {
    return (gridX + gridY) * 1000 + z;
  }

  /**
   * P-085: Projeção Isométrica Ortográfica 2:1 (Tile 64x32px).
   * screenX = originX + (gridX - gridY) * 32
   * screenY = originY + (gridX + gridY) * 16
   */
  gridToScreen(
    gridX: number,
    gridY: number,
    originX = 0,
    originY = 0
  ): { x: number; y: number } {
    const halfW = ClinicService.TILE_WIDTH / 2; // 32
    const halfH = ClinicService.TILE_HEIGHT / 2; // 16
    return {
      x: originX + (gridX - gridY) * halfW,
      y: originY + (gridX + gridY) * halfH
    };
  }

  /**
   * P-085: Conversão inversa Screen-to-Grid para o Ghost Preview no modo edição.
   */
  screenToGrid(
    screenX: number,
    screenY: number,
    originX = 0,
    originY = 0
  ): { gridX: number; gridY: number } {
    const halfW = ClinicService.TILE_WIDTH / 2; // 32
    const halfH = ClinicService.TILE_HEIGHT / 2; // 16
    const dx = screenX - originX;
    const dy = screenY - originY;
    const rawX = (dx / halfW + dy / halfH) / 2;
    const rawY = (dy / halfH - dx / halfW) / 2;
    return {
      gridX: Math.floor(rawX),
      gridY: Math.floor(rawY)
    };
  }

  /**
   * P-084: Inversão de footprint por rotação.
   * rotation == 0 (SE): width = footprintX, height = footprintY
   * rotation == 1 (SW): width = footprintY, height = footprintX
   */
  getEffectiveFootprint(
    item: { footprintX: number; footprintY: number },
    rotation: number
  ): { width: number; height: number } {
    if (rotation % 2 === 1) {
      return { width: item.footprintY, height: item.footprintX };
    }
    return { width: item.footprintX, height: item.footprintY };
  }

  /**
   * P-084: Validação espacial de fronteiras do grid e detecção de colisão AABB 2D
   * com suporte a slots lineares de parede (WALL, 0x0).
   */
  isPositionValid(
    gridX: number,
    gridY: number,
    footprintX: number,
    footprintY: number,
    rotation: number,
    gridWidth: number,
    gridHeight: number,
    placedItems: ClinicPlacedItem[],
    catalog: ClinicCatalogItem[] = CLINIC_CATALOG_FALLBACK,
    ignorePlacedId?: string
  ): boolean {
    if (
      !Number.isFinite(gridX) ||
      !Number.isFinite(gridY) ||
      gridWidth <= 0 ||
      gridHeight <= 0
    ) {
      return false;
    }

    const isWallItem = footprintX === 0 && footprintY === 0;
    const catalogMap = new Map<string, ClinicCatalogItem>(
      (catalog.length > 0 ? catalog : CLINIC_CATALOG_FALLBACK).map(c => [c.id, c])
    );

    if (isWallItem) {
      // Itens de parede devem ficar estritamente fixados na parede NW (gridX === 0) ou NE (gridY === 0)
      if (gridX !== 0 && gridY !== 0) {
        return false;
      }
      if (gridX === 0 && (gridY < 0 || gridY >= gridHeight)) {
        return false;
      }
      if (gridY === 0 && (gridX < 0 || gridX >= gridWidth)) {
        return false;
      }

      const targetSide: 'NW' | 'NE' = gridX === 0 ? 'NW' : 'NE';
      const targetIdx = gridX === 0 ? gridY : gridX;

      for (const other of placedItems) {
        if (!other.placed || (ignorePlacedId && other.id === ignorePlacedId)) {
          continue;
        }
        const otherCat = catalogMap.get(other.catalogItemId);
        const otherIsWall =
          other.placementType === 'WALL' ||
          otherCat?.placementType === 'WALL' ||
          (otherCat?.footprintX === 0 && otherCat?.footprintY === 0);

        if (otherIsWall) {
          const otherSide = other.wallSide ?? (other.gridX === 0 ? 'NW' : 'NE');
          const otherIdx =
            other.wallTileIndex ??
            (otherSide === 'NW' ? other.gridY ?? 0 : other.gridX ?? 0);
          if (otherSide === targetSide && otherIdx === targetIdx) {
            return false;
          }
        } else {
          // Prevenção de sobreposição visual: itens de parede não podem ser fixados
          // em um quadrado que já possua um móvel de chão posicionado.
          const { width: oW, height: oH } = this.getEffectiveFootprint(
            otherCat ?? { footprintX: 1, footprintY: 1 },
            other.rotation ?? 0
          );
          const ogx = other.gridX ?? 0;
          const ogy = other.gridY ?? 0;
          const checkX = targetSide === 'NW' ? 0 : targetIdx;
          const checkY = targetSide === 'NW' ? targetIdx : 0;
          if (checkX >= ogx && checkX < ogx + oW && checkY >= ogy && checkY < ogy + oH) {
            return false;
          }
        }
      }
      return true;
    }

    const { width: effW, height: effH } = this.getEffectiveFootprint(
      { footprintX, footprintY },
      rotation
    );

    if (gridX < 0 || gridY < 0) {
      return false;
    }
    if (gridX + effW > gridWidth || gridY + effH > gridHeight) {
      return false;
    }

    for (const other of placedItems) {
      if (!other.placed || other.gridX === null || other.gridY === null) {
        continue;
      }
      if (ignorePlacedId && other.id === ignorePlacedId) {
        continue;
      }

      const otherCatalog = catalogMap.get(other.catalogItemId) ?? {
        footprintX: 1,
        footprintY: 1,
        placementType: 'FLOOR' as const
      };
      const otherIsWall =
        other.placementType === 'WALL' ||
        otherCatalog.placementType === 'WALL' ||
        (otherCatalog.footprintX === 0 && otherCatalog.footprintY === 0);

      // Prevenção de sobreposição: se houver um item de parede afixado na linha adjacente
      // coberta por este móvel de chão, bloqueia para evitar sobreposição visual.
      if (otherIsWall) {
        const otherSide = other.wallSide ?? (other.gridX === 0 ? 'NW' : 'NE');
        const otherIdx =
          other.wallTileIndex ??
          (otherSide === 'NW' ? other.gridY ?? 0 : other.gridX ?? 0);
        const wallX = otherSide === 'NW' ? 0 : otherIdx;
        const wallY = otherSide === 'NW' ? otherIdx : 0;
        if (wallX >= gridX && wallX < gridX + effW && wallY >= gridY && wallY < gridY + effH) {
          return false;
        }
        continue;
      }

      const { width: otherW, height: otherH } = this.getEffectiveFootprint(
        otherCatalog,
        other.rotation ?? 0
      );

      const intersects =
        gridX < other.gridX + otherW &&
        gridX + effW > other.gridX &&
        gridY < other.gridY + otherH &&
        gridY + effH > other.gridY;

      if (intersects) {
        return false;
      }
    }

    return true;
  }

  /**
   * P-081: Tabela do Multiplicador de Streak Diário:
   * 0-2d -> 0.00 | 3-6d -> 0.10 | 7-13d -> 0.20 | 14-29d -> 0.35 | 30+d -> 0.50
   */
  getStreakMultiplier(streakDays: number): number {
    const safeDays = Math.max(0, Math.floor(streakDays || 0));
    if (safeDays >= 30) {
      return 0.50;
    }
    if (safeDays >= 14) {
      return 0.35;
    }
    if (safeDays >= 7) {
      return 0.20;
    }
    if (safeDays >= 3) {
      return 0.10;
    }
    return 0;
  }

  /**
   * P-081: Cálculo determinístico de XP de atividades de estudo:
   * XP_Final = round(XP_Ação * (1 + Multiplicador_Streak))
   */
  calculatePreviewXp(
    actionType: StudyActionType,
    streakDays: number,
    accuracyPercent = 0
  ): number {
    let baseXp: number;
    const clampedAcc = Math.max(0, Math.min(100, Number(accuracyPercent) || 0));

    switch (actionType) {
      case 'QUESTION_SUBMITTED':
        baseXp = 15;
        break;
      case 'QUESTION_CORRECT':
        baseXp = 40; // 15 submissão + 25 acerto
        break;
      case 'QUESTION_STREAK_3':
        baseXp = 15;
        break;
      case 'QUESTION_STREAK_5':
        baseXp = 30;
        break;
      case 'QUESTION_STREAK_10':
        baseXp = 75;
        break;
      case 'FLASHCARD_EASY':
        baseXp = 8;
        break;
      case 'FLASHCARD_MEDIUM':
        baseXp = 12;
        break;
      case 'FLASHCARD_HARD':
        baseXp = 5;
        break;
      case 'DAILY_DECK_COMPLETED':
        baseXp = 100;
        break;
      case 'VIDEO_10_MIN':
        baseXp = 50;
        break;
      case 'VIDEO_COMPLETED':
        baseXp = 80;
        break;
      case 'VIDEO_NOTE':
        baseXp = 30;
        break;
      case 'SIMULADO_COMPLETED':
        baseXp = 300 + Math.round(clampedAcc * 5);
        break;
      default:
        baseXp = 15;
        break;
    }

    const multiplier = this.getStreakMultiplier(streakDays);
    return Math.round(baseXp * (1 + multiplier));
  }

  /**
   * Carrega o estado consolidado da clínica (GET /api/v1/clinic).
   */
  loadClinic(): Observable<ClinicState> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<ApiEnvelope<ClinicState> | ClinicState>(this.clinicApiUrl).pipe(
      map(res => this.normalizeClinicState(this.unwrapEnvelope(res))),
      tap(state => {
        this.clinicState.set(state);
        this.loading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const msg = this.extractErrorMessage(
          err,
          'Não foi possível carregar sua clínica médica no momento.'
        );
        this.error.set(msg);
        return throwError(() => err);
      })
    );
  }

  /**
   * Expande fisicamente a clínica para o próximo nível sequencial (POST /api/v1/clinic/expand).
   */
  expandClinic(): Observable<ClinicState> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .post<ApiEnvelope<ClinicState> | ClinicState>(`${this.clinicApiUrl}/expand`, {})
      .pipe(
        map(res => this.normalizeClinicState(this.unwrapEnvelope(res))),
        tap(state => {
          this.clinicState.set(state);
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Saldo de XP ou pré-requisito insuficiente para expandir a clínica.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }

  /**
   * P-094: Obtém os tiers oficiais de Caixas da Sorte Médicas (GET /api/v1/clinic/lootboxes).
   */
  getLootboxTiers(): Observable<LootboxTierInfo[]> {
    return this.http
      .get<ApiEnvelope<LootboxTierInfo[]> | LootboxTierInfo[]>(`${this.clinicApiUrl}/lootboxes`)
      .pipe(
        map(res => {
          const unwrapped = this.unwrapEnvelope(res);
          return Array.isArray(unwrapped) ? unwrapped : LOOTBOX_TIERS_FALLBACK;
        }),
        catchError(() => {
          return [LOOTBOX_TIERS_FALLBACK];
        })
      );
  }

  /**
   * P-094, P-095: Abre uma Caixa da Sorte Médica sob transação atômica (POST /api/v1/clinic/lootboxes/{tier}/open).
   */
  openLootbox(tier: LootboxTier): Observable<LootboxOpenResult> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .post<ApiEnvelope<LootboxOpenResult> | LootboxOpenResult>(
        `${this.clinicApiUrl}/lootboxes/${tier}/open`,
        {}
      )
      .pipe(
        map(res => this.unwrapEnvelope(res) as LootboxOpenResult),
        tap(result => {
          this.loading.set(false);
          const current = this.clinicState();
          if (current) {
            const updatedOwned = current.ownedItemIds.includes(result.droppedItem.id)
              ? current.ownedItemIds
              : [...current.ownedItemIds, result.droppedItem.id];

            const updatedInventory = result.isDuplicate
              ? current.inventory
              : [
                  ...current.inventory,
                  {
                    id: 'loot_' + Date.now(),
                    catalogItemId: result.droppedItem.id,
                    placementType: result.droppedItem.placementType || 'FLOOR',
                    gridX: null,
                    gridY: null,
                    rotation: 0,
                    placed: false
                  }
                ];

            const nextCurrentXp = result.currentXpAfter ?? result.currentXp ?? current.currentXp;
            this.clinicState.set({
              ...current,
              currentXp: nextCurrentXp,
              lifetimeXp: result.lifetimeXp ?? current.lifetimeXp,
              ownedItemIds: updatedOwned,
              inventory: updatedInventory
            });
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Saldo de XP insuficiente para abrir esta Caixa da Sorte.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }

  /**
   * P-094: Abre a Caixa da Sorte Diária Gratuita do estudante (1 por dia no login, 0 XP).
   */
  openDailyFreeLootbox(): Observable<LootboxOpenResult> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .post<ApiEnvelope<LootboxOpenResult> | LootboxOpenResult>(
        `${this.clinicApiUrl}/lootboxes/daily-free/open`,
        {}
      )
      .pipe(
        map(res => this.unwrapEnvelope(res) as LootboxOpenResult),
        tap(result => {
          this.loading.set(false);
          const current = this.clinicState();
          if (current) {
            const updatedOwned = current.ownedItemIds.includes(result.droppedItem.id)
              ? current.ownedItemIds
              : [...current.ownedItemIds, result.droppedItem.id];

            const updatedInventory = result.isDuplicate
              ? current.inventory
              : [
                  ...current.inventory,
                  {
                    id: 'loot_' + Date.now(),
                    catalogItemId: result.droppedItem.id,
                    placementType: result.droppedItem.placementType || 'FLOOR',
                    gridX: null,
                    gridY: null,
                    rotation: 0,
                    placed: false
                  }
                ];

            const nextCurrentXp = result.currentXpAfter ?? result.currentXp ?? current.currentXp;
            this.clinicState.set({
              ...current,
              currentXp: nextCurrentXp,
              lifetimeXp: result.lifetimeXp ?? current.lifetimeXp,
              dailyFreeLootboxAvailable: false,
              ownedItemIds: updatedOwned,
              inventory: updatedInventory
            });
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'A Caixa da Sorte diária gratuita de hoje já foi aberta. Volte amanhã!'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }

  /**
   * Compra atômica de item do catálogo (POST /api/v1/clinic/items/buy).
   */
  buyItem(payload: BuyClinicItemRequest): Observable<ClinicState> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .post<ApiEnvelope<ClinicState> | ClinicState>(`${this.clinicApiUrl}/items/buy`, payload)
      .pipe(
        map(res => this.normalizeClinicState(this.unwrapEnvelope(res))),
        tap(state => {
          this.clinicState.set(state);
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Saldo de XP insuficiente para realizar esta operação.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  /**
   * Salva o layout espacial dos itens posicionados (PUT /api/v1/clinic/layout).
   */
  saveLayout(payload: UpdateClinicLayoutRequest): Observable<ClinicState> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .put<ApiEnvelope<ClinicState> | ClinicState>(`${this.clinicApiUrl}/layout`, payload)
      .pipe(
        map(res => this.normalizeClinicState(this.unwrapEnvelope(res))),
        tap(state => {
          this.clinicState.set(state);
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Conflito espacial detectado ao salvar a disposição dos móveis.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  /**
   * Atualiza as superfícies desacopladas da clínica (paredes e pisos) (PUT /api/v1/clinic/surfaces).
   */
  updateSurfaces(payload: ClinicSurfacesUpdateRequest): Observable<ClinicState> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .put<ApiEnvelope<ClinicState> | ClinicState>(`${this.clinicApiUrl}/surfaces`, payload)
      .pipe(
        map(res => this.normalizeClinicState(this.unwrapEnvelope(res))),
        tap(state => {
          this.clinicState.set(state);
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Não foi possível atualizar o revestimento da clínica no momento.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  /**
   * Obtém o avatar do médico e seu catálogo de skins (GET /api/v1/clinic/avatar).
   */
  getDoctorAvatar(): Observable<DoctorAvatarResponse> {
    return this.http
      .get<ApiEnvelope<DoctorAvatarResponse> | DoctorAvatarResponse>(`${this.clinicApiUrl}/avatar`)
      .pipe(
        map(res => this.unwrapEnvelope(res)),
        tap(avatarResp => {
          this.doctorAvatarResponse.set(avatarResp);
          const current = this.clinicState();
          if (current) {
            this.clinicState.set({
              ...current,
              avatar: {
                id: avatarResp.avatarId,
                avatarId: avatarResp.avatarId,
                gender: avatarResp.gender,
                skinCoat: avatarResp.skinCoat,
                skinStethoscope: avatarResp.skinStethoscope,
                skinAccessory: avatarResp.skinAccessory,
                avatarX: avatarResp.avatarX,
                avatarY: avatarResp.avatarY
              }
            });
          }
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = this.extractErrorMessage(
            err,
            'Não foi possível carregar a personalização do avatar do médico.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  /**
   * Atualiza a personalização do avatar do médico (PUT /api/v1/clinic/avatar).
   */
  updateDoctorAvatar(payload: DoctorAvatarUpdateDto): Observable<DoctorAvatarResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .put<ApiEnvelope<DoctorAvatarResponse> | DoctorAvatarResponse>(
        `${this.clinicApiUrl}/avatar`,
        payload
      )
      .pipe(
        map(res => this.unwrapEnvelope(res)),
        tap(avatarResp => {
          this.doctorAvatarResponse.set(avatarResp);
          const current = this.clinicState();
          if (current) {
            this.clinicState.set({
              ...current,
              avatar: {
                id: avatarResp.avatarId,
                avatarId: avatarResp.avatarId,
                gender: avatarResp.gender,
                skinCoat: avatarResp.skinCoat,
                skinStethoscope: avatarResp.skinStethoscope,
                skinAccessory: avatarResp.skinAccessory,
                avatarX: avatarResp.avatarX,
                avatarY: avatarResp.avatarY
              }
            });
          }
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Falha ao salvar o estilo do seu médico.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  /**
   * Compra atômica de skin cosmética para o avatar (POST /api/v1/clinic/avatar/skins/buy).
   */
  buyDoctorSkin(skinId: string): Observable<any> {
    this.loading.set(true);
    this.error.set(null);

    const payload: SkinBuyRequest = { skinId };

    return this.http
      .post<ApiEnvelope<any> | any>(
        `${this.clinicApiUrl}/avatar/skins/buy`,
        payload
      )
      .pipe(
        map(res => this.unwrapEnvelope(res)),
        tap(buyRes => {
          const curr = this.doctorAvatarResponse();
          if (curr) {
            const rawUnlocked = (buyRes && buyRes.unlockedSkins) as string[] | undefined;
            const updatedUnlocked = rawUnlocked && Array.isArray(rawUnlocked)
              ? rawUnlocked
              : curr.unlockedSkins.includes(skinId)
                ? curr.unlockedSkins
                : [...curr.unlockedSkins, skinId];

            this.doctorAvatarResponse.set({
              ...curr,
              unlockedSkins: updatedUnlocked
            });
          }
          const clinic = this.clinicState();
          if (clinic && buyRes && typeof buyRes.remainingCurrentXp === 'number') {
            this.clinicState.set({
              ...clinic,
              currentXp: buyRes.remainingCurrentXp
            });
          }
          // Atualiza saldo investível recarregando o estado da clínica
          this.loadClinic().subscribe();
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loading.set(false);
          const msg = this.extractErrorMessage(
            err,
            'Saldo de XP insuficiente ou skin já adquirida.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  /**
   * Registra conclusão de ação de estudo e dispara Toast de XP (POST /api/v1/study/action-reward).
   */
  recordStudyAction(
    payload: StudyActionRewardRequest
  ): Observable<StudyActionRewardResponse> {
    return this.http
      .post<ApiEnvelope<StudyActionRewardResponse> | StudyActionRewardResponse>(
        `${this.studyApiUrl}/action-reward`,
        payload
      )
      .pipe(
        map(res => this.unwrapEnvelope(res)),
        tap(reward => {
          this.triggerXpToast(reward);
          const current = this.clinicState();
          if (current) {
            this.clinicState.set(
              this.normalizeClinicState({
                ...current,
                lifetimeXp: reward.lifetimeXp ?? current.lifetimeXp + reward.xpEarned,
                currentXp: reward.currentXp ?? current.currentXp + reward.xpEarned,
                currentStreakDays: reward.currentStreakDays ?? current.currentStreakDays,
                streakMultiplierPercent:
                  reward.streakMultiplierPercent ?? current.streakMultiplierPercent
              })
            );
          }
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = this.extractErrorMessage(
            err,
            'Falha ao registrar recompensa de estudo.'
          );
          this.error.set(msg);
          return throwError(() => err);
        })
      );
  }



  triggerXpToast(reward: StudyActionRewardResponse): void {
    this.xpToast.set(reward);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.xpToast.set(null);
    }, 3800);
  }

  dismissXpToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.xpToast.set(null);
  }

  /**
   * Cria estado inicial padrão Nível 1 (Box do Internato 4x4 com os 3 itens gratuitos P-084).
   */
  createDefaultLevel1State(): ClinicState {
    const initialItems: ClinicPlacedItem[] = [
      {
        id: 'init-mesa-scandi',
        catalogItemId: 'mesa_scandi',
        gridX: 0,
        gridY: 0,
        rotation: 0,
        placed: true
      },
      {
        id: 'init-cadeira-ergonomica',
        catalogItemId: 'cadeira_ergonomica',
        gridX: 0,
        gridY: 1,
        rotation: 0,
        placed: true
      },
      {
        id: 'init-ped-maca-baleia',
        catalogItemId: 'ped_maca_baleia',
        gridX: 2,
        gridY: 0,
        rotation: 0,
        placed: true
      }
    ];

    return this.normalizeClinicState({
      clinicId: 'local-clinic-v1',
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
      lifetimeXp: 1500,
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
      placedItems: initialItems,
      inventory: initialItems,
      catalog: CLINIC_CATALOG_FALLBACK
    });
  }

  private unwrapEnvelope<T>(response: ApiEnvelope<T> | T): T {
    if (
      response &&
      typeof response === 'object' &&
      'data' in response &&
      (response as ApiEnvelope<T>).data !== undefined
    ) {
      return (response as ApiEnvelope<T>).data;
    }
    return response as T;
  }

  private normalizeClinicState(raw: Partial<ClinicState>): ClinicState {
    const level = Math.max(1, Math.min(6, raw.expansionLevel ?? 1));
    const currentMeta =
      CLINIC_EXPANSION_LEVELS.find(l => l.level === level) ?? CLINIC_EXPANSION_LEVELS[0];
    const nextMeta = CLINIC_EXPANSION_LEVELS.find(l => l.level === level + 1) ?? null;

    const lifetimeXp = Math.max(0, raw.lifetimeXp ?? 0);
    const currentXp = Math.max(0, raw.currentXp ?? 0);
    const streakDays = Math.max(0, raw.currentStreakDays ?? 0);
    const streakPercent =
      raw.streakMultiplierPercent ?? Math.round(this.getStreakMultiplier(streakDays) * 100);

    const catalog =
      raw.catalog && raw.catalog.length >= 27 ? raw.catalog : CLINIC_CATALOG_FALLBACK;

    const inventory = raw.inventory ?? raw.placedItems ?? [];
    const placedItems = (raw.placedItems ?? inventory).filter(
      i => i.placed && i.gridX !== null && i.gridY !== null
    );
    const ownedItemIds =
      raw.ownedItemIds && raw.ownedItemIds.length > 0
        ? raw.ownedItemIds
        : Array.from(new Set(inventory.map(i => i.catalogItemId)));

    const nextCost = raw.nextExpansionCostXp ?? nextMeta?.costXp ?? null;
    const nextReqLifetime =
      raw.nextExpansionRequiredLifetimeXp ?? nextMeta?.requiredLifetimeXp ?? null;

    const canExpand =
      raw.canExpand !== undefined
        ? raw.canExpand
        : Boolean(
            nextMeta &&
              nextCost !== null &&
              nextReqLifetime !== null &&
              lifetimeXp >= nextReqLifetime &&
              currentXp >= nextCost
          );

    return {
      clinicId: raw.clinicId ?? 'clinic-default',
      clinicName: raw.clinicName ?? 'Minha Clínica',
      expansionLevel: level,
      expansionName: raw.expansionName ?? currentMeta.name,
      gridWidth: raw.gridWidth ?? currentMeta.gridWidth,
      gridHeight: raw.gridHeight ?? currentMeta.gridHeight,
      theme: raw.theme ?? 'clean_modern',
      wallTheme: raw.wallTheme ?? 'clean_white',
      floorTheme: raw.floorTheme ?? 'wood_light',
      avatar: raw.avatar ?? {
        gender: 'MALE',
        skinCoat: 'coat_default',
        skinStethoscope: 'steth_standard',
        skinAccessory: 'acc_none',
        avatarX: 1,
        avatarY: 1
      },
      ownedSurfaces: raw.ownedSurfaces ?? [],
      userName: raw.userName ?? 'Lari',
      userFirstName: raw.userFirstName ?? (raw.userName ? raw.userName.trim().split(/\s+/)[0] : 'Lari'),
      dailyFreeLootboxAvailable: raw.dailyFreeLootboxAvailable !== undefined ? raw.dailyFreeLootboxAvailable : true,
      lifetimeXp,
      currentXp,
      currentStreakDays: streakDays,
      streakMultiplierPercent: streakPercent,
      nextExpansionLevel: raw.nextExpansionLevel ?? nextMeta?.level ?? null,
      nextExpansionName: raw.nextExpansionName ?? nextMeta?.name ?? null,
      nextExpansionGridWidth: raw.nextExpansionGridWidth ?? nextMeta?.gridWidth ?? null,
      nextExpansionGridHeight: raw.nextExpansionGridHeight ?? nextMeta?.gridHeight ?? null,
      nextExpansionCostXp: nextCost,
      nextExpansionRequiredLifetimeXp: nextReqLifetime,
      canExpand,
      ownedItemIds,
      placedItems,
      inventory,
      catalog
    };
  }

  private extractErrorMessage(err: HttpErrorResponse, fallback: string): string {
    if (err?.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (typeof err.error.message === 'string') {
        return err.error.message;
      }
      if (typeof err.error.error === 'string') {
        return err.error.error;
      }
    }
    return fallback;
  }
}
