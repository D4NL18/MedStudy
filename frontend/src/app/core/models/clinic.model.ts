/**
 * Modelos, contratos e constantes da feature "Minha Clínica Médica" (P-080 a P-086).
 */

export type ClinicCategory = 'pediatria' | 'mobiliario' | 'clinica' | 'recepcao' | 'revestimentos';
export type PlacementType = 'FLOOR' | 'WALL' | 'SURFACE_WALL' | 'SURFACE_FLOOR';
export type WallSide = 'NW' | 'NE';
export type DoctorGender = 'MALE' | 'FEMALE';
export type DoctorSkinSlot = 'COAT' | 'STETHOSCOPE' | 'ACCESSORY';
export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type LootboxTier = 'TIER_1_RESIDENT' | 'TIER_2_SPECIALIST' | 'TIER_3_CHIEF_OF_STAFF';

export interface LootboxProbabilities {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface LootboxTierInfo {
  tier: LootboxTier;
  name: string;
  description: string;
  costXp: number;
  badgeColor: string;
  assetSvgKey: string;
  minRarityGuaranteed: ItemRarity;
  probabilities: LootboxProbabilities;
}

export interface LootboxOpenResult {
  tier: LootboxTier;
  tierName?: string;
  tierDisplayName?: string;
  costXp: number;
  droppedItem: ClinicCatalogItem;
  isDuplicate: boolean;
  cashbackXpAwarded: number;
  currentXp: number;
  currentXpAfter?: number;
  lifetimeXp: number;
  isDailyFree?: boolean;
  openedAt: string;
}

export type StudyActionType =
  | 'QUESTION_SUBMITTED'
  | 'QUESTION_CORRECT'
  | 'QUESTION_STREAK_3'
  | 'QUESTION_STREAK_5'
  | 'QUESTION_STREAK_10'
  | 'FLASHCARD_EASY'
  | 'FLASHCARD_MEDIUM'
  | 'FLASHCARD_HARD'
  | 'DAILY_DECK_COMPLETED'
  | 'VIDEO_10_MIN'
  | 'VIDEO_COMPLETED'
  | 'VIDEO_NOTE'
  | 'SIMULADO_COMPLETED';

export interface ClinicCatalogItem {
  id: string;
  name: string;
  category: ClinicCategory;
  costXp: number;
  footprintX: number;
  footprintY: number;
  placementType?: PlacementType;
  minExpansionLevel: number;
  interactable: boolean;
  soundFxUrl?: string | null;
  assetSvgKey: string;
  description?: string;
  rarity?: ItemRarity;
  isLootboxExclusive?: boolean;
}

export interface ClinicPlacedItem {
  id: string;
  catalogItemId: string;
  placementType?: PlacementType;
  gridX: number | null;
  gridY: number | null;
  rotation: number; // 0 = SE, 1 = SW
  wallSide?: WallSide | null;
  wallTileIndex?: number | null;
  elevationZ?: number | null;
  placed: boolean;
}

export interface DoctorAvatar {
  id?: string;
  avatarId?: string;
  gender: DoctorGender;
  skinCoat: string;
  skinStethoscope: string;
  skinAccessory: string;
  avatarX: number;
  avatarY: number;
}

export interface DoctorSkinCatalogItem {
  id: string;
  slot: DoctorSkinSlot;
  name: string;
  costXp: number;
  assetSvgKey: string;
  owned: boolean;
}

export interface DoctorAvatarResponse {
  avatarId: string;
  gender: DoctorGender;
  skinCoat: string;
  skinStethoscope: string;
  skinAccessory: string;
  avatarX: number;
  avatarY: number;
  unlockedSkins: string[];
  catalogSkins: DoctorSkinCatalogItem[];
}

export interface OwnedSurface {
  id: string;
  type: 'WALL' | 'FLOOR';
  name: string;
  costXp: number;
}

export interface ExpansionLevelMeta {
  level: number;
  name: string;
  gridWidth: number;
  gridHeight: number;
  costXp: number;
  requiredLifetimeXp: number;
  description: string;
}

export interface ClinicState {
  clinicId: string;
  clinicName: string;
  expansionLevel: number;
  expansionName: string;
  gridWidth: number;
  gridHeight: number;
  theme: string;
  wallTheme: string;
  floorTheme: string;
  avatar?: DoctorAvatar;
  ownedSurfaces?: OwnedSurface[];
  userName?: string;
  userFirstName?: string;
  dailyFreeLootboxAvailable?: boolean;
  lifetimeXp: number;
  currentXp: number;
  currentStreakDays: number;
  streakMultiplierPercent: number;
  nextExpansionLevel: number | null;
  nextExpansionName: string | null;
  nextExpansionGridWidth: number | null;
  nextExpansionGridHeight: number | null;
  nextExpansionCostXp: number | null;
  nextExpansionRequiredLifetimeXp: number | null;
  canExpand: boolean;
  ownedItemIds: string[];
  placedItems: ClinicPlacedItem[];
  inventory: ClinicPlacedItem[];
  catalog: ClinicCatalogItem[];
}

export interface ClinicSurfacesUpdateRequest {
  wallTheme?: string;
  floorTheme?: string;
}

export interface DoctorAvatarUpdateDto {
  gender?: DoctorGender;
  skinCoat?: string;
  skinStethoscope?: string;
  skinAccessory?: string;
  avatarX?: number;
  avatarY?: number;
}

export interface SkinBuyRequest {
  skinId: string;
}

export interface BuyClinicItemRequest {
  catalogItemId: string;
  gridX?: number | null;
  gridY?: number | null;
  rotation?: number;
}

export interface UpdateClinicLayoutItem {
  id?: string;
  catalogItemId: string;
  placementType?: PlacementType;
  gridX: number | null;
  gridY: number | null;
  rotation: number;
  wallSide?: WallSide | null;
  wallTileIndex?: number | null;
  elevationZ?: number | null;
  placed: boolean;
}

export interface UpdateClinicLayoutRequest {
  items: UpdateClinicLayoutItem[];
}

export interface StudyActionRewardRequest {
  actionType: StudyActionType;
  accuracyPercent?: number;
  referenceId?: string;
}

export interface StudyActionRewardResponse {
  xpEarned: number;
  baseXp: number;
  streakMultiplierPercent: number;
  currentStreakDays: number;
  lifetimeXp: number;
  currentXp: number;
  actionType: StudyActionType | string;
  message: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Tabela oficial de Progressão e Expansão Física da Clínica (P-082).
 */
export const CLINIC_EXPANSION_LEVELS: ExpansionLevelMeta[] = [
  {
    level: 1,
    name: 'Box do Internato',
    gridWidth: 4,
    gridHeight: 4,
    costXp: 0,
    requiredLifetimeXp: 0,
    description: 'Espaço compacto de plantão inicial para seus primeiros atendimentos.'
  },
  {
    level: 2,
    name: 'Consultório Júnior',
    gridWidth: 6,
    gridHeight: 6,
    costXp: 1200,
    requiredLifetimeXp: 1500,
    description: 'Consultório individual iluminado com janela ampla e área de exame.'
  },
  {
    level: 3,
    name: 'Consultório Master com Hall',
    gridWidth: 8,
    gridHeight: 8,
    costXp: 3800,
    requiredLifetimeXp: 4500,
    description: 'Espaço amplo com recepção integrada para espera confortável.'
  },
  {
    level: 4,
    name: 'Clínica 2 Ambientes',
    gridWidth: 12,
    gridHeight: 6,
    costXp: 8500,
    requiredLifetimeXp: 10000,
    description: 'Duas salas 6x6 separadas por divisória interna com arco de passagem.'
  },
  {
    level: 5,
    name: 'Clínica Integrada com Ala Pediátrica',
    gridWidth: 12,
    gridHeight: 12,
    costXp: 16000,
    requiredLifetimeXp: 20000,
    description: 'Três salas dedicadas: Recepção, Consultório Geral e Ala Pediátrica lúdica.'
  },
  {
    level: 6,
    name: 'Instituto Médico Completo',
    gridWidth: 16,
    gridHeight: 12,
    costXp: 32000,
    requiredLifetimeXp: 40000,
    description: 'Quatro ambientes premium: Ala Pediátrica, Sala de Exames, Consultório Master e Lounge.'
  }
];

/**
 * Catálogo Oficial de 104 Itens (P-083, P-092) — Fallback Resiliente.
 * 26 Pediatria + 26 Mobiliário + 26 Clínica/Equipamentos + 26 Recepção/Conforto = 104 Itens.
 */
export { CLINIC_CATALOG_FALLBACK } from './clinic-catalog.data';


export const LOOTBOX_TIERS_FALLBACK: LootboxTierInfo[] = [
  {
    tier: 'TIER_1_RESIDENT',
    name: 'Caixa do Residente',
    description: 'Ideal para iniciar a decoração com instrumentais básicos e móveis acolhedores.',
    costXp: 500,
    badgeColor: '#94A3B8',
    assetSvgKey: 'lootbox_tier1_resident',
    minRarityGuaranteed: 'COMMON',
    probabilities: { common: 60.0, rare: 30.0, epic: 9.0, legendary: 1.0 }
  },
  {
    tier: 'TIER_2_SPECIALIST',
    name: 'Caixa do Especialista',
    description: 'Equipamentos especializados e peças de média sofisticação. Zero chance de itens comuns!',
    costXp: 1500,
    badgeColor: '#0284C7',
    assetSvgKey: 'lootbox_tier2_specialist',
    minRarityGuaranteed: 'RARE',
    probabilities: { common: 0.0, rare: 65.0, epic: 28.0, legendary: 7.0 }
  },
  {
    tier: 'TIER_3_CHIEF_OF_STAFF',
    name: 'Caixa do Chefe de Ala',
    description: 'Acesso exclusivo aos equipamentos médicos mais nobres e relíquias lendárias.',
    costXp: 4000,
    badgeColor: '#F59E0B',
    assetSvgKey: 'lootbox_tier3_chief',
    minRarityGuaranteed: 'EPIC',
    probabilities: { common: 0.0, rare: 0.0, epic: 75.0, legendary: 25.0 }
  }
];

export const RARITY_CONFIG: Record<ItemRarity, { label: string; color: string; bgClass: string; textClass: string; borderClass: string; glowClass: string }> = {
  COMMON: { label: 'Comum', color: '#94A3B8', bgClass: 'bg-slate-100 dark:bg-slate-800', textClass: 'text-slate-600 dark:text-slate-300', borderClass: 'border-slate-300 dark:border-slate-700', glowClass: 'shadow-slate-500/20' },
  RARE: { label: 'Raro', color: '#0284C7', bgClass: 'bg-sky-50 dark:bg-sky-950/60', textClass: 'text-sky-600 dark:text-sky-400', borderClass: 'border-sky-300 dark:border-sky-700', glowClass: 'shadow-sky-500/30' },
  EPIC: { label: 'Épico', color: '#A855F7', bgClass: 'bg-purple-50 dark:bg-purple-950/60', textClass: 'text-purple-600 dark:text-purple-400', borderClass: 'border-purple-300 dark:border-purple-700', glowClass: 'shadow-purple-500/40' },
  LEGENDARY: { label: 'Lendário', color: '#F59E0B', bgClass: 'bg-amber-50 dark:bg-amber-950/60', textClass: 'text-amber-600 dark:text-amber-400', borderClass: 'border-amber-300 dark:border-amber-700', glowClass: 'shadow-amber-500/50' }
};

export function getItemRarity(item: ClinicCatalogItem): ItemRarity {
  if (item.rarity) return item.rarity;
  if ([
    'conjunto_diretoria_nogal',
    'ressonancia_simulador',
    'robo_cirurgico_console',
    'tanque_criogenico_celulas',
    'ped_castelo_faz_de_conta',
    'piano_cauda_lounge'
  ].includes(item.id)) {
    return 'LEGENDARY';
  }
  if (item.costXp >= 4100) return 'EPIC';
  if (item.costXp >= 1650) return 'RARE';
  return 'COMMON';
}
