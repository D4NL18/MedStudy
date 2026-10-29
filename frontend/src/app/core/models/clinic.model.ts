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
export const CLINIC_CATALOG_FALLBACK: ClinicCatalogItem[] = [
  {
    "id": "ped_maca_dino",
    "name": "Maca Dinossauro Safari",
    "category": "pediatria",
    "costXp": 3500,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "dino_blink",
    "assetSvgKey": "ped_maca_dino",
    "description": "Braquiossauro verde pastel acolchoado que pisca os olhos ao clicar."
  },
  {
    "id": "ped_maca_baleia",
    "name": "Maca Baleia Azul",
    "category": "pediatria",
    "costXp": 1800,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "whale_splash",
    "assetSvgKey": "ped_maca_baleia",
    "description": "Estofado macio oceânico com cauda de apoio ergonômica."
  },
  {
    "id": "ped_maca_f1",
    "name": "Maca Carro de Corrida",
    "category": "pediatria",
    "costXp": 2400,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "race_beep",
    "assetSvgKey": "ped_maca_f1",
    "description": "Modelo vintage de corrida vermelha com volante interativo."
  },
  {
    "id": "ped_regua_girafa",
    "name": "Régua Girafa de Parede",
    "category": "pediatria",
    "costXp": 900,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "wood_measure",
    "assetSvgKey": "ped_regua_girafa",
    "placementType": "WALL",
    "description": "Escala métrica vertical no pescoço da girafa para a parede traseira."
  },
  {
    "id": "ped_balanca_urso",
    "name": "Balança Bebê Ursinho",
    "category": "pediatria",
    "costXp": 1100,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "ped_balanca_urso",
    "description": "Balança tipo concha pediátrica com visor digital na barriga do urso."
  },
  {
    "id": "ped_piscina_bolinhas",
    "name": "Piscina de Bolinhas Candy Color",
    "category": "pediatria",
    "costXp": 2800,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "ball_pit",
    "assetSvgKey": "ped_piscina_bolinhas",
    "description": "Bolinhas coloridas em tons pastéis para recreação na recepção pediátrica."
  },
  {
    "id": "ped_tenda_leitura",
    "name": "Tenda Tipi Indígena",
    "category": "pediatria",
    "costXp": 3200,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "page_turn",
    "assetSvgKey": "ped_tenda_leitura",
    "description": "Cabaninha acolhedora de leitura com almofadas de nuvem."
  },
  {
    "id": "ped_bau_coragem",
    "name": "Baú do Tesouro / Pote de Adesivos",
    "category": "pediatria",
    "costXp": 1500,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "sparkle_chime",
    "assetSvgKey": "ped_bau_coragem",
    "description": "Baú dourado com adesivos de coragem que emite brilhos ao clicar."
  },
  {
    "id": "ped_papel_safari",
    "name": "Papel de Parede Safari Aquarela",
    "category": "pediatria",
    "costXp": 850,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "ped_papel_safari",
    "placementType": "SURFACE_WALL",
    "description": "Revestimento contínuo para paredes traseiras com animais da savana em aquarela."
  },
  {
    "id": "ped_esteto_elefante",
    "name": "Protetor de Esteto Elefantinho",
    "category": "pediatria",
    "costXp": 650,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "ped_esteto_elefante",
    "description": "Protetor emborrachado azul de elefantinho para a campânula."
  },
  {
    "id": "ped_tapete_amarelinha",
    "name": "Tapete Amarelinha Sensorial",
    "category": "pediatria",
    "costXp": 750,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "ped_tapete_amarelinha",
    "description": "Tapete emborrachado colorido com numerais para coordenação psicomotora."
  },
  {
    "id": "ped_mesa_desenho_infantil",
    "name": "Mesinha de Atividades com Giz",
    "category": "pediatria",
    "costXp": 1250,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "wood_tap",
    "assetSvgKey": "ped_mesa_desenho_infantil",
    "description": "Mesinha baixa de madeira com potes de lápis e papel kraft para desenho."
  },
  {
    "id": "ped_cadeirinha_sapinho",
    "name": "Cadeira Infantil Sapinho",
    "category": "pediatria",
    "costXp": 450,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "ped_cadeirinha_sapinho",
    "description": "Banquinho ergonômico verde em formato de sapo sorridente."
  },
  {
    "id": "ped_oftalmo_figuras_lea",
    "name": "Tabela Oftalmológica Infantil LEA",
    "category": "pediatria",
    "costXp": 800,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "chime",
    "assetSvgKey": "ped_oftalmo_figuras_lea",
    "placementType": "WALL",
    "description": "Quadro de acuidade visual com símbolos de maçã, casa e círculo para crianças."
  },
  {
    "id": "ped_mobile_planetas",
    "name": "Móbile Teto Sistema Solar",
    "category": "pediatria",
    "costXp": 1350,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "mobile_spin",
    "assetSvgKey": "ped_mobile_planetas",
    "placementType": "WALL",
    "description": "Planetas iluminados suspensos na parede que giram suavemente."
  },
  {
    "id": "ped_otoscopio_pinguim",
    "name": "Otoscópio Pediátrico Pinguim",
    "category": "pediatria",
    "costXp": 950,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "click",
    "assetSvgKey": "ped_otoscopio_pinguim",
    "description": "Base divertida em formato de pinguim polar para exame otoscópico."
  },
  {
    "id": "ped_carrinho_vacina_sorriso",
    "name": "Carrinho de Vacinação \"Sem Dor\"",
    "category": "pediatria",
    "costXp": 1950,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "cart_roll",
    "assetSvgKey": "ped_carrinho_vacina_sorriso",
    "description": "Carrinho móvel com caixas coloridas e adesivos de coragem para vacinas."
  },
  {
    "id": "ped_pelucia_microbios",
    "name": "Cesto de Pelúcias de Micróbios Fofos",
    "category": "pediatria",
    "costXp": 1100,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "squeak",
    "assetSvgKey": "ped_pelucia_microbios",
    "description": "Pelúcias lúdicas de bactérias benéficas e glóbulos brancos acolhedores."
  },
  {
    "id": "ped_painel_engrenagens",
    "name": "Painel Sensorial de Parede",
    "category": "pediatria",
    "costXp": 1650,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "gears",
    "assetSvgKey": "ped_painel_engrenagens",
    "placementType": "WALL",
    "description": "Engrenagens giratórias em madeira para entretenimento tátil infantil."
  },
  {
    "id": "ped_escorregador_elefante",
    "name": "Mini Escorregador Tromba de Elefante",
    "category": "pediatria",
    "costXp": 3100,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "slide",
    "assetSvgKey": "ped_escorregador_elefante",
    "description": "Escorregador compacto seguro em formato de elefante para a ala pediátrica."
  },
  {
    "id": "ped_balanca_digital_aquecida",
    "name": "Balança Pediátrica Aquecida",
    "category": "pediatria",
    "costXp": 2100,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "ped_balanca_digital_aquecida",
    "description": "Balança digital de precisão com colchão térmico suave."
  },
  {
    "id": "ped_berco_aquecido",
    "name": "Berço Aquecido Neonatal",
    "category": "pediatria",
    "costXp": 4600,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "hum",
    "assetSvgKey": "ped_berco_aquecido",
    "description": "Berço hospitalar de calor radiante para recém-nascidos."
  },
  {
    "id": "ped_fototerapia_led",
    "name": "Aparelho de Fototerapia Bili-LED",
    "category": "pediatria",
    "costXp": 5200,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "light_switch",
    "assetSvgKey": "ped_fototerapia_led",
    "description": "Painel de luz azulada terapêutica contra icterícia neonatal."
  },
  {
    "id": "ped_circuito_espuma",
    "name": "Circuito de Psicomotricidade Infantil",
    "category": "pediatria",
    "costXp": 4900,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "bounce",
    "assetSvgKey": "ped_circuito_espuma",
    "description": "Módulos de espuma colorida com rampa e túnel recreativo."
  },
  {
    "id": "ped_incubadora_neonatal",
    "name": "Incubadora Neonatal Tecnológica",
    "category": "pediatria",
    "costXp": 7800,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "incubator_beep",
    "assetSvgKey": "ped_incubadora_neonatal",
    "description": "Cúpula transparente com microclima e monitor multiparâmetro."
  },
  {
    "id": "ped_castelo_faz_de_conta",
    "name": "Castelo Lúdico com Miniclínica",
    "category": "pediatria",
    "costXp": 9500,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 6,
    "interactable": true,
    "soundFxUrl": "fanfare",
    "assetSvgKey": "ped_castelo_faz_de_conta",
    "description": "Forte medieval infantil com jalecos de brinquedo e livros de anatomia."
  },
  {
    "id": "mesa_scandi",
    "name": "Mesa Escandinava de Carvalho com Suculenta",
    "category": "mobiliario",
    "costXp": 950,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "mesa_scandi",
    "description": "Design escandinavo em madeira clara com vaso de suculenta."
  },
  {
    "id": "mesa_mogno_cafe",
    "name": "Mesa de Mogno com Xícara de Café Quente",
    "category": "mobiliario",
    "costXp": 2200,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "coffee_sip",
    "assetSvgKey": "mesa_mogno_cafe",
    "description": "Mesa robusta de mogno com xícara de café que emite vapor contínuo."
  },
  {
    "id": "mesa_carrara",
    "name": "Mesa Mármore Carrara & Dourado",
    "category": "mobiliario",
    "costXp": 4800,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "marble_chime",
    "assetSvgKey": "mesa_carrara",
    "description": "Tampo nobre de mármore branco italiano com detalhes folheados a ouro."
  },
  {
    "id": "cadeira_ergonomica",
    "name": "Cadeira Operacional Mesh",
    "category": "mobiliario",
    "costXp": 800,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "cadeira_ergonomica",
    "description": "Cadeira giratória com encosto em malha respirável para longos estudos."
  },
  {
    "id": "cadeira_presidente_couro",
    "name": "Cadeira Presidente Couro Caramelo Capitonê",
    "category": "mobiliario",
    "costXp": 2600,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "cadeira_presidente_couro",
    "description": "Poltrona executiva com estofamento capitonê em couro nobre caramelo."
  },
  {
    "id": "pc_ultrawide",
    "name": "Estação de Trabalho com Monitor Ultrawide",
    "category": "mobiliario",
    "costXp": 1600,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "key_click",
    "assetSvgKey": "pc_ultrawide",
    "description": "Monitor curvo panorâmico com teclado mecânico e luz ambiente suave."
  },
  {
    "id": "maca_clinica_antisseptica",
    "name": "Maca de Exame Clínico com Lençol",
    "category": "mobiliario",
    "costXp": 900,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "maca_clinica_antisseptica",
    "description": "Estrutura metálica com rolo de papel descartável para exames clínicos."
  },
  {
    "id": "mocho_giratorio_clinico",
    "name": "Mocho Giratório com Encosto",
    "category": "mobiliario",
    "costXp": 550,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "mocho_giratorio_clinico",
    "description": "Banqueta com rodas suaves para o médico examinar o paciente."
  },
  {
    "id": "biombo_triplo_privacidade",
    "name": "Biombo Hospitalar Triplo",
    "category": "mobiliario",
    "costXp": 700,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "rustle",
    "assetSvgKey": "biombo_triplo_privacidade",
    "description": "Divisória sanfonada lavável para garantir privacidade no consultório."
  },
  {
    "id": "escada_dois_degraus",
    "name": "Escadinha Clínica Antiderrapante",
    "category": "mobiliario",
    "costXp": 350,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "escada_dois_degraus",
    "description": "Escada metálica de dois degraus ao lado da maca de exame."
  },
  {
    "id": "suporte_soro_cromado",
    "name": "Suporte de Soro com 4 Ganchos",
    "category": "mobiliario",
    "costXp": 600,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "suporte_soro_cromado",
    "description": "Pedestal inox com bolsa de soro fisiológico e equipo."
  },
  {
    "id": "mesa_auxiliar_inox",
    "name": "Carrinho Auxiliar em Aço Inox",
    "category": "mobiliario",
    "costXp": 850,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "mesa_auxiliar_inox",
    "description": "Mesa móvel para curativos e procedimentos ambulatoriais rápidos."
  },
  {
    "id": "armario_vitrine_remedios",
    "name": "Armário Vitrine com Portas de Vidro",
    "category": "mobiliario",
    "costXp": 1850,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "glass_click",
    "assetSvgKey": "armario_vitrine_remedios",
    "description": "Armário de aço com fechadura para guarda segura de medicamentos."
  },
  {
    "id": "foco_clinico_led",
    "name": "Foco Clínico Flexível de LED",
    "category": "mobiliario",
    "costXp": 1150,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "led_switch",
    "assetSvgKey": "foco_clinico_led",
    "description": "Lâmpada direcionável potente para pequenos procedimentos ambulatoriais."
  },
  {
    "id": "gaveteiro_modular_madeira",
    "name": "Gaveteiro Volante de Carvalho",
    "category": "mobiliario",
    "costXp": 1300,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "gaveteiro_modular_madeira",
    "description": "Gaveteiro sob a mesa com rodízios de silicone."
  },
  {
    "id": "poltrona_reclinavel_coleta",
    "name": "Poltrona Reclinável de Hidratação",
    "category": "mobiliario",
    "costXp": 2300,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "recline",
    "assetSvgKey": "poltrona_reclinavel_coleta",
    "description": "Estofado reclinável confortável com braçadeiras acolchoadas."
  },
  {
    "id": "mesa_atendimento_em_l",
    "name": "Mesa Executiva em L",
    "category": "mobiliario",
    "costXp": 2900,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "mesa_atendimento_em_l",
    "description": "Mesa ampla para consultório master com espaço para reuniões."
  },
  {
    "id": "estante_modular_nichos",
    "name": "Estante de Parede com Nichos LED",
    "category": "mobiliario",
    "costXp": 1750,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "estante_modular_nichos",
    "placementType": "WALL",
    "description": "Nichos elegantes na parede traseira para livros e objetos decorativos."
  },
  {
    "id": "divisoria_vidro_acustica",
    "name": "Painel Divisório Vidro Canelado",
    "category": "mobiliario",
    "costXp": 2400,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "divisoria_vidro_acustica",
    "description": "Divisória moderna que delimita a ante-sala do consultório."
  },
  {
    "id": "estacao_triagem_enfermagem",
    "name": "Bancada Completa de Triagem",
    "category": "mobiliario",
    "costXp": 3400,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "printer",
    "assetSvgKey": "estacao_triagem_enfermagem",
    "description": "Balcão com pia embutida, medidores e impressora de pulseiras."
  },
  {
    "id": "armario_vestiario_medico",
    "name": "Armário Vestiário com Espelho",
    "category": "mobiliario",
    "costXp": 2800,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "locker",
    "assetSvgKey": "armario_vestiario_medico",
    "description": "Vestiário individual para troca de scrubs e jalecos."
  },
  {
    "id": "maca_gineco_eletrica",
    "name": "Maca Gineco-Obstétrica Motorizada",
    "category": "mobiliario",
    "costXp": 5400,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "motor",
    "assetSvgKey": "maca_gineco_eletrica",
    "description": "Maca de alta tecnologia com controles de elevação suaves."
  },
  {
    "id": "mesa_reuniao_clinica",
    "name": "Mesa Oval de Discussão Clínica",
    "category": "mobiliario",
    "costXp": 4900,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 5,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "mesa_reuniao_clinica",
    "description": "Mesa nobre para discussão de casos clínicos e rounds multiprofissionais."
  },
  {
    "id": "estacao_telemedicina",
    "name": "Estação Completa de Telemedicina",
    "category": "mobiliario",
    "costXp": 6200,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "video_call",
    "assetSvgKey": "estacao_telemedicina",
    "description": "Ring light profissional, microfone direcional e webcam 4K."
  },
  {
    "id": "bancada_laboratorial_ilha",
    "name": "Ilha Laboratorial Central Inox",
    "category": "mobiliario",
    "costXp": 8200,
    "footprintX": 3,
    "footprintY": 1,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "lab_centrifuge",
    "assetSvgKey": "bancada_laboratorial_ilha",
    "description": "Bancada central para análises rápidas, centrífuga e microscopia."
  },
  {
    "id": "conjunto_diretoria_nogal",
    "name": "Conjunto Presidencial Nogal & Bronze",
    "category": "mobiliario",
    "costXp": 12000,
    "footprintX": 3,
    "footprintY": 2,
    "minExpansionLevel": 6,
    "interactable": true,
    "soundFxUrl": "leather_creak",
    "assetSvgKey": "conjunto_diretoria_nogal",
    "description": "Mesa e poltrona nobres para o diretor clínico do instituto."
  },
  {
    "id": "didatico_dr_bones",
    "name": "Esqueleto Didático \"Dr. Bones\"",
    "category": "clinica",
    "costXp": 1900,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "bones_clack",
    "assetSvgKey": "didatico_dr_bones",
    "description": "Esqueleto anatômico articulado com gravata borboleta vermelha."
  },
  {
    "id": "esteto_ouro_master",
    "name": "Estetoscópio Master Ouro em Suporte",
    "category": "clinica",
    "costXp": 3000,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "heartbeat_soft",
    "assetSvgKey": "esteto_ouro_master",
    "description": "Estetoscópio cardiológico premium banhado a ouro 24k em redoma."
  },
  {
    "id": "monitor_ecg",
    "name": "Monitor Cardíaco com Traçado Vivo em Loop",
    "category": "clinica",
    "costXp": 2100,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "ecg_beep",
    "assetSvgKey": "monitor_ecg",
    "description": "Monitor multiparâmetro com traçado eletrocardiográfico sinusal vivo."
  },
  {
    "id": "usg_fetal_4d",
    "name": "Aparelho de Ultrassom 4D com Display Colorido",
    "category": "clinica",
    "costXp": 3900,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "usg_doppler",
    "assetSvgKey": "usg_fetal_4d",
    "description": "Equipamento de ponta com transdutor convexo e Doppler colorido."
  },
  {
    "id": "negatoscopio_led",
    "name": "Negatoscópio Ultra-Slim com Radiografia Iluminada",
    "category": "clinica",
    "costXp": 1400,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "led_switch",
    "assetSvgKey": "negatoscopio_led",
    "placementType": "WALL",
    "description": "Painel LED fino para parede traseira com chapa radiográfica de tórax."
  },
  {
    "id": "estante_harrison",
    "name": "Estante Gigante com Tratados Clássicos de Medicina",
    "category": "clinica",
    "costXp": 1700,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "estante_harrison",
    "description": "Estante de madeira nobre repleta de volumes médicos clássicos."
  },
  {
    "id": "esfigmo_pedestal",
    "name": "Esfigmomanômetro em Pedestal Móvel",
    "category": "clinica",
    "costXp": 800,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "cuff_pump",
    "assetSvgKey": "esfigmo_pedestal",
    "description": "Manômetro aneroide de grande porte com rodas de transporte."
  },
  {
    "id": "tabela_snellen_iluminada",
    "name": "Tabela de Snellen Iluminada",
    "category": "clinica",
    "costXp": 750,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "light_switch",
    "assetSvgKey": "tabela_snellen_iluminada",
    "placementType": "WALL",
    "description": "Cartaz de letras decrescentes iluminado para teste de acuidade visual."
  },
  {
    "id": "conjunto_diagnostico_parede",
    "name": "Otoscópio & Oftalmoscópio de Parede",
    "category": "clinica",
    "costXp": 1200,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "click",
    "assetSvgKey": "conjunto_diagnostico_parede",
    "placementType": "WALL",
    "description": "Painel com cabos espiralados e carregador embutido para diagnóstico."
  },
  {
    "id": "estojo_laringoscopio",
    "name": "Estojo de Laringoscópio Inox",
    "category": "clinica",
    "costXp": 1050,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "metal_latch",
    "assetSvgKey": "estojo_laringoscopio",
    "description": "Lâminas curvas e retas com luz de fibra óptica para via aérea."
  },
  {
    "id": "diploma_crm_moldura_ouro",
    "name": "Diploma de Graduação Médica Ouro",
    "category": "clinica",
    "costXp": 950,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "chime",
    "assetSvgKey": "diploma_crm_moldura_ouro",
    "placementType": "WALL",
    "description": "Diploma oficial emoldurado na parede que brilha com orgulho."
  },
  {
    "id": "estadiometro_compacto",
    "name": "Estadiômetro de Parede em Alumínio",
    "category": "clinica",
    "costXp": 850,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "slide",
    "assetSvgKey": "estadiometro_compacto",
    "placementType": "WALL",
    "description": "Fita antropométrica de precisão para medição de estatura."
  },
  {
    "id": "desfibrilador_dea_parede",
    "name": "Desfibrilador DEA em Caixa Vermelha",
    "category": "clinica",
    "costXp": 2500,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "dea_prompt",
    "assetSvgKey": "desfibrilador_dea_parede",
    "placementType": "WALL",
    "description": "Caixa de emergência de parede com instruções de voz e eletrodos."
  },
  {
    "id": "bipap_ventilador",
    "name": "Aparelho de Ventilação BiPAP",
    "category": "clinica",
    "costXp": 2400,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "breathe",
    "assetSvgKey": "bipap_ventilador",
    "description": "Equipamento de suporte respiratório não invasivo."
  },
  {
    "id": "aspirador_cirurgico_movel",
    "name": "Aspirador Cirúrgico com Frascos",
    "category": "clinica",
    "costXp": 1650,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "suction",
    "assetSvgKey": "aspirador_cirurgico_movel",
    "description": "Motor de aspiração silenciosa com tubulação transparente."
  },
  {
    "id": "carrinho_parada_cardiorresp",
    "name": "Carrinho de Parada Emergencial",
    "category": "clinica",
    "costXp": 3100,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "siren_short",
    "assetSvgKey": "carrinho_parada_cardiorresp",
    "description": "Crash Cart vermelho lacrado com gavetas de medicação categorizadas."
  },
  {
    "id": "microscopio_optico_binoc",
    "name": "Microscópio Óptico Binocular",
    "category": "clinica",
    "costXp": 2800,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "focus_click",
    "assetSvgKey": "microscopio_optico_binoc",
    "description": "Óptica de alta ampliação com lâmina citológica iluminada."
  },
  {
    "id": "eletrocardiografo_digital",
    "name": "Eletrocardiógrafo de 12 Canais",
    "category": "clinica",
    "costXp": 3200,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "paper_print",
    "assetSvgKey": "eletrocardiografo_digital",
    "description": "Aparelho portátil com bobina de papel termo-sensível."
  },
  {
    "id": "autoclave_esterilizacao",
    "name": "Autoclave Hospitalar em Inox",
    "category": "clinica",
    "costXp": 2700,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "steam_hiss",
    "assetSvgKey": "autoclave_esterilizacao",
    "description": "Câmara de esterilização a vapor sob pressão de instrumentos."
  },
  {
    "id": "torre_videolaparoscopia",
    "name": "Torre Cirúrgica de Vídeo-Laparoscopia",
    "category": "clinica",
    "costXp": 5800,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "laparo_beep",
    "assetSvgKey": "torre_videolaparoscopia",
    "description": "Câmera Full HD, insuflador de CO2 e monitor cirúrgico duplo."
  },
  {
    "id": "bomba_infusao_seringa",
    "name": "Estação de Bombas de Infusão",
    "category": "clinica",
    "costXp": 4200,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "infusion_beep",
    "assetSvgKey": "bomba_infusao_seringa",
    "description": "Conjunto de infusão precisa para drogas vasoativas."
  },
  {
    "id": "tomografo_extremidades",
    "name": "Mini Tomógrafo Cone Beam",
    "category": "clinica",
    "costXp": 8500,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "ct_whirr",
    "assetSvgKey": "tomografo_extremidades",
    "description": "Scanner tomográfico compacto para extremidades e articulações."
  },
  {
    "id": "ressonancia_simulador",
    "name": "Simulador Compacto de Ressonância",
    "category": "clinica",
    "costXp": 10500,
    "footprintX": 3,
    "footprintY": 2,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "mri_thump",
    "assetSvgKey": "ressonancia_simulador",
    "description": "Escâner magnético de diorama com luzes circulares em loop."
  },
  {
    "id": "arco_cirurgico_fluorosc",
    "name": "Arco Cirúrgico em C Digital",
    "category": "clinica",
    "costXp": 9200,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "fluoroscopy",
    "assetSvgKey": "arco_cirurgico_fluorosc",
    "description": "Equipamento radiológico móvel para exames dinâmicos em tempo real."
  },
  {
    "id": "robo_cirurgico_console",
    "name": "Console Master de Cirurgia Robótica",
    "category": "clinica",
    "costXp": 15000,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 6,
    "interactable": true,
    "soundFxUrl": "robot_servo",
    "assetSvgKey": "robo_cirurgico_console",
    "description": "Visor 3D imersivo e joysticks de alta precisão micrométrica."
  },
  {
    "id": "tanque_criogenico_celulas",
    "name": "Tanque de Nitrogênio Criogênico",
    "category": "clinica",
    "costXp": 11000,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 6,
    "interactable": true,
    "soundFxUrl": "cryo_release",
    "assetSvgKey": "tanque_criogenico_celulas",
    "description": "Cilindro de biobanco para preservação de células-tronco."
  },
  {
    "id": "cafe_espresso_vermelho",
    "name": "Máquina de Espresso Gourmet",
    "category": "recepcao",
    "costXp": 1300,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "espresso_steam",
    "assetSvgKey": "cafe_espresso_vermelho",
    "description": "Cafeteira italiana vermelha com vapor animado e som de extração."
  },
  {
    "id": "mascote_gato_bisturi",
    "name": "Gato \"Bisturi\"",
    "category": "recepcao",
    "costXp": 2900,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "cat_purr",
    "assetSvgKey": "mascote_gato_bisturi",
    "description": "Gatinho laranja que dorme na poltrona e ronrona suavemente ao clicar."
  },
  {
    "id": "mascote_cao_caramelo",
    "name": "Golden Retriever \"Dr. Caramelo\"",
    "category": "recepcao",
    "costXp": 4500,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "dog_bark",
    "assetSvgKey": "mascote_cao_caramelo",
    "description": "Cão terapeuta com bandana médica que abana o rabo ao ser clicado."
  },
  {
    "id": "balcao_recepcao_madeira",
    "name": "Balcão de Recepção em Madeira Clara",
    "category": "recepcao",
    "costXp": 1500,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "balcao_recepcao_madeira",
    "description": "Balcão curvo acolhedor para recepção e triagem de pacientes."
  },
  {
    "id": "bebedouro_galao",
    "name": "Bebedouro Retrô de Galão Azul",
    "category": "recepcao",
    "costXp": 400,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "water_bubble",
    "assetSvgKey": "bebedouro_galao",
    "description": "Clássico bebedouro de consultório que solta bolhas de água ao clicar."
  },
  {
    "id": "longarina_espera_confort",
    "name": "Longarina de Três Assentos Tecido",
    "category": "recepcao",
    "costXp": 850,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "longarina_espera_confort",
    "description": "Cadeiras unidas acolchoadas em tom cinza azulado para a recepção."
  },
  {
    "id": "revisteiro_acrilico",
    "name": "Revisteiro com Periódicos Médicos",
    "category": "recepcao",
    "costXp": 450,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "page_flip",
    "assetSvgKey": "revisteiro_acrilico",
    "description": "Suporte transparente com revistas científicas e informativos de saúde."
  },
  {
    "id": "planta_costela_adao",
    "name": "Vaso com Planta Costela-de-Adão",
    "category": "recepcao",
    "costXp": 600,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "planta_costela_adao",
    "description": "Vaso cerâmico terracota com folhagem verde exuberante de monstera."
  },
  {
    "id": "dispenser_alcool_totem",
    "name": "Totem de Álcool em Gel a Pedal",
    "category": "recepcao",
    "costXp": 350,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "pump",
    "assetSvgKey": "dispenser_alcool_totem",
    "description": "Totem higienizador automático com pedal antisséptico."
  },
  {
    "id": "relogio_parede_minimal",
    "name": "Relógio de Parede Minimalista",
    "category": "recepcao",
    "costXp": 500,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "relogio_parede_minimal",
    "placementType": "WALL",
    "description": "Mostrador circular escandinavo com ponteiros contínuos para parede."
  },
  {
    "id": "quadro_juramento_hipocr",
    "name": "Quadro Juramento de Hipócrates",
    "category": "recepcao",
    "costXp": 800,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 1,
    "interactable": true,
    "soundFxUrl": "chime",
    "assetSvgKey": "quadro_juramento_hipocr",
    "placementType": "WALL",
    "description": "Caligrafia clássica emoldurada com a tradicional homenagem à medicina."
  },
  {
    "id": "tv_sala_espera_painel",
    "name": "Smart TV de Espera com Senhas",
    "category": "recepcao",
    "costXp": 1800,
    "footprintX": 0,
    "footprintY": 0,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "tv_ding",
    "assetSvgKey": "tv_sala_espera_painel",
    "placementType": "WALL",
    "description": "Tela plana na parede exibindo chamadas de senha e vídeos informativos."
  },
  {
    "id": "poltrona_boucle_offwhite",
    "name": "Poltrona Acolhedora Tecido Bouclé",
    "category": "recepcao",
    "costXp": 1450,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "cushion",
    "assetSvgKey": "poltrona_boucle_offwhite",
    "description": "Assento individual ultra macio para leitura tranquila de pacientes."
  },
  {
    "id": "luminaria_arco_latonada",
    "name": "Luminária de Chão em Arco Dourado",
    "category": "recepcao",
    "costXp": 1250,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "lamp_click",
    "assetSvgKey": "luminaria_arco_latonada",
    "description": "Iluminação indireta acolhedora para o canto de descanso."
  },
  {
    "id": "aparador_cha_biscoitos",
    "name": "Aparador Buffet Café & Biscoitos",
    "category": "recepcao",
    "costXp": 1600,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "cup_clink",
    "assetSvgKey": "aparador_cha_biscoitos",
    "description": "Garrafa térmica com chás de ervas e pote de torradas para recepção."
  },
  {
    "id": "mascote_calopsita_poleiro",
    "name": "Calopsita Semiologista no Poleiro",
    "category": "recepcao",
    "costXp": 2700,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 2,
    "interactable": true,
    "soundFxUrl": "bird_whistle",
    "assetSvgKey": "mascote_calopsita_poleiro",
    "description": "Pássaro dócil de topete amarelo no poleiro que assobia ao interagir."
  },
  {
    "id": "aquario_marinho_coral",
    "name": "Aquário Panorâmico com Corais Vivos",
    "category": "recepcao",
    "costXp": 3600,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "bubbles",
    "assetSvgKey": "aquario_marinho_coral",
    "description": "Peixes palhaço nadando suavemente com luz azulada oceânica."
  },
  {
    "id": "jardim_inverno_bambu",
    "name": "Jardim de Inverno com Bambu Mossô",
    "category": "recepcao",
    "costXp": 2800,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "jardim_inverno_bambu",
    "description": "Pedras brancas de rio com caules naturais de bambu decorativo."
  },
  {
    "id": "fonte_agua_pedra_zen",
    "name": "Fonte Zen em Pedra Natural",
    "category": "recepcao",
    "costXp": 2200,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "water_stream",
    "assetSvgKey": "fonte_agua_pedra_zen",
    "description": "Queda d’água em cascata suave com som de relaxamento mental."
  },
  {
    "id": "cafeteira_moedor_graos",
    "name": "Máquina Profissional Grãos Moídos",
    "category": "recepcao",
    "costXp": 3200,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "grinder",
    "assetSvgKey": "cafeteira_moedor_graos",
    "description": "Prensa automática de espresso com moagem na hora."
  },
  {
    "id": "frigobar_retro_turquesa",
    "name": "Frigobar Retrô Turquesa com Sucos",
    "category": "recepcao",
    "costXp": 2100,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 3,
    "interactable": true,
    "soundFxUrl": "fridge_open",
    "assetSvgKey": "frigobar_retro_turquesa",
    "description": "Geladeirinha vintage com água de coco e sucos naturais."
  },
  {
    "id": "sofa_chesterfield_couro",
    "name": "Sofá Chesterfield em Couro Conhaque",
    "category": "recepcao",
    "costXp": 4800,
    "footprintX": 3,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": false,
    "soundFxUrl": null,
    "assetSvgKey": "sofa_chesterfield_couro",
    "description": "Sofá de três lugares imponente com acabamento nobre inglês capitonê."
  },
  {
    "id": "lareira_ecologica_etanol",
    "name": "Lareira Ecológica a Bioetanol",
    "category": "recepcao",
    "costXp": 4200,
    "footprintX": 2,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "fire_crackle",
    "assetSvgKey": "lareira_ecologica_etanol",
    "description": "Queimador em aço com pedras vulcânicas e chama viva sem fumaça."
  },
  {
    "id": "poltrona_massagem_zero_g",
    "name": "Poltrona de Massagem Gravidade Zero",
    "category": "recepcao",
    "costXp": 6500,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 4,
    "interactable": true,
    "soundFxUrl": "massage_hum",
    "assetSvgKey": "poltrona_massagem_zero_g",
    "description": "Poltrona de relaxamento para os plantões mais exaustivos."
  },
  {
    "id": "piano_cauda_lounge",
    "name": "Piano de Meia-Cauda Laqueado Preto",
    "category": "recepcao",
    "costXp": 9800,
    "footprintX": 2,
    "footprintY": 2,
    "minExpansionLevel": 5,
    "interactable": true,
    "soundFxUrl": "piano_chord",
    "assetSvgKey": "piano_cauda_lounge",
    "description": "Piano acústico de cauda para o lounge da clínica com acordes relaxantes."
  },
  {
    "id": "mascote_coruja_atena",
    "name": "Coruja Buraqueira \"Atena\"",
    "category": "recepcao",
    "costXp": 8500,
    "footprintX": 1,
    "footprintY": 1,
    "minExpansionLevel": 6,
    "interactable": true,
    "soundFxUrl": "owl_hoot",
    "assetSvgKey": "mascote_coruja_atena",
    "description": "Símbolo de sabedoria médica que gira a cabeça com simpatia ao interagir."
  },

  // =========================================================================
  // 50 ITENS ESPECIAIS EXCLUSIVOS DE LOOTBOX (P-093, US-11)
  // =========================================================================

  // --- Pediatria (13 Itens) ---
  {
    id: "ped_maca_foguete_retro",
    name: "Maca Foguete Espacial Retrô",
    category: "pediatria",
    costXp: 3400,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "rocket_whoosh",
    assetSvgKey: "ped_maca_foguete_retro",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Maca lúdica em formato de foguete vintage da era espacial."
  },
  {
    id: "ped_projetor_estrelas_teto",
    name: "Projetor Galáctico de Parede",
    category: "pediatria",
    costXp: 2600,
    footprintX: 1,
    footprintY: 1,
    placementType: "WALL",
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "stars_shimmer",
    assetSvgKey: "ped_projetor_estrelas_teto",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Projeta constelações e nebulosas relaxantes no ambiente."
  },
  {
    id: "ped_cubo_sensorial_montessori",
    name: "Cubo Sensorial Montessori",
    category: "pediatria",
    costXp: 2200,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 1,
    interactable: true,
    soundFxUrl: "wood_click",
    assetSvgKey: "ped_cubo_sensorial_montessori",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Cubo de madeira com engrenagens e labirintos táteis."
  },
  {
    id: "ped_bancada_quimica_junior",
    name: "Mini Laboratório Cientista Júnior",
    category: "pediatria",
    costXp: 3100,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "flask_bubble",
    assetSvgKey: "ped_bancada_quimica_junior",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Bancada com tubos de ensaio coloridos inofensivos."
  },
  {
    id: "ped_painel_arvore_amigos",
    name: "Painel Magnético Árvore da Floresta",
    category: "pediatria",
    costXp: 2800,
    footprintX: 1,
    footprintY: 1,
    placementType: "WALL",
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "forest_birds",
    assetSvgKey: "ped_painel_arvore_amigos",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Painel de parede magnético com bichinhos da floresta."
  },
  {
    id: "ped_robo_pixel_cuidador",
    name: "Robô Cuidador Amigável Dr. Pixel",
    category: "pediatria",
    costXp: 5800,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "robot_blip",
    assetSvgKey: "ped_robo_pixel_cuidador",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Androide carismático que distrai as crianças com piadas médicas."
  },
  {
    id: "ped_maca_disco_voador",
    name: "Maca Disco Voador com LED Neon",
    category: "pediatria",
    costXp: 6500,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "ufo_hum",
    assetSvgKey: "ped_maca_disco_voador",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Maca suspensa com cúpula translúcida e iluminação neon suave."
  },
  {
    id: "ped_toboga_nuvem_magica",
    name: "Tobogã Curvo Nuvem Mágica",
    category: "pediatria",
    costXp: 7200,
    footprintX: 2,
    footprintY: 2,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "slide_whistle",
    assetSvgKey: "ped_toboga_nuvem_magica",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Escorregador curvilíneo acolchoado em formato de nuvem."
  },
  {
    id: "ped_planetario_domo",
    name: "Cúpula Planetário Imersivo LED",
    category: "pediatria",
    costXp: 8400,
    footprintX: 2,
    footprintY: 2,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "space_ambient",
    assetSvgKey: "ped_planetario_domo",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Domo inflável educativo de astronomia para a recepção pediátrica."
  },
  {
    id: "ped_aquario_submarino_kids",
    name: "Aquário Cilindro Submarino Lúdico",
    category: "pediatria",
    costXp: 6900,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "sonar_ping",
    assetSvgKey: "ped_aquario_submarino_kids",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Coluna de água com peixinhos amarelos e periscópio interativo."
  },
  {
    id: "ped_cama_elastica_arco_iris",
    name: "Cama Elástica Sensorial Arco-Íris",
    category: "pediatria",
    costXp: 6100,
    footprintX: 2,
    footprintY: 2,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "bounce_spring",
    assetSvgKey: "ped_cama_elastica_arco_iris",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Cama elástica com bordas macias e piso responsivo multicolorido."
  },
  {
    id: "ped_carrossel_musical_reino",
    name: "Carrossel Vitoriano Encantado com Música",
    category: "pediatria",
    costXp: 16000,
    footprintX: 2,
    footprintY: 2,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "music_box_waltz",
    assetSvgKey: "ped_carrossel_musical_reino",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Obra de arte artesanal com cavalinhos esculpidos e caixinha de música."
  },
  {
    id: "ped_simulador_foguete_orbital",
    name: "Cápsula Espacial Simuladora Apollo Kids",
    category: "pediatria",
    costXp: 22000,
    footprintX: 3,
    footprintY: 2,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "rocket_launch",
    assetSvgKey: "ped_simulador_foguete_orbital",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Simulador com alavancas, painéis luminosos e contagem regressiva."
  },

  // --- Mobiliário (12 Itens) ---
  {
    id: "mob_mesa_vidro_flutuante",
    name: "Mesa Flutuante Vidro & Inox",
    category: "mobiliario",
    costXp: 2900,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: false,
    soundFxUrl: null,
    assetSvgKey: "mob_mesa_vidro_flutuante",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Design minimalista contemporâneo com tampo de vidro temperado."
  },
  {
    id: "mob_poltrona_ergonomica_atlas",
    name: "Poltrona Biomecânica Atlas Pro",
    category: "mobiliario",
    costXp: 2700,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: false,
    soundFxUrl: null,
    assetSvgKey: "mob_poltrona_ergonomica_atlas",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Suporte lombar dinâmico com ajuste micrométrico."
  },
  {
    id: "mob_estante_livros_giratoria",
    name: "Estante Cilíndrica Giratória Farmácia",
    category: "mobiliario",
    costXp: 3200,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "shelf_spin",
    assetSvgKey: "mob_estante_livros_giratoria",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Estante de carvalho com 4 andares de rotação suave."
  },
  {
    id: "mob_biombo_art_deco_dourado",
    name: "Biombo Art Déco Ouro Escovado",
    category: "mobiliario",
    costXp: 3500,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "screen_fold",
    assetSvgKey: "mob_biombo_art_deco_dourado",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Paineis geométricos com detalhes em latão e linho acústico."
  },
  {
    id: "mob_poltrona_anti_gravidade",
    name: "Poltrona Gravidade Zero Aquecida",
    category: "mobiliario",
    costXp: 7400,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "hydraulic_recline",
    assetSvgKey: "mob_poltrona_anti_gravidade",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Alinhamento ortopédico com termoterapia para repouso pós-plantão."
  },
  {
    id: "mob_maca_podologia_hidraulica",
    name: "Maca Hidráulica em Couro Pérola",
    category: "mobiliario",
    costXp: 6800,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "hydraulic_lift",
    assetSvgKey: "mob_maca_podologia_hidraulica",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Maca articulada de três seções com pedal de elevação suave."
  },
  {
    id: "mob_estacao_laudos_tripla",
    name: "Estação de Laudos Tripla Curva 4K",
    category: "mobiliario",
    costXp: 8200,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "keyboard_tap",
    assetSvgKey: "mob_estacao_laudos_tripla",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Cockpit para telerradiologia de alta precisão."
  },
  {
    id: "mob_aparador_cristal_farmacia",
    name: "Vitrine Farmacêutica em Cristal & Latão",
    category: "mobiliario",
    costXp: 6400,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "glass_creak",
    assetSvgKey: "mob_aparador_cristal_farmacia",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Expositor nobre para frascos históricos de boticário."
  },
  {
    id: "mob_gaveteiro_blindado_titanio",
    name: "Arquivo de Psicotrópicos em Titânio",
    category: "mobiliario",
    costXp: 5600,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "safe_lock",
    assetSvgKey: "mob_gaveteiro_blindado_titanio",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Cofre com teclado biométrico digital iluminado."
  },
  {
    id: "mob_mesa_holografica_nogueira",
    name: "Mesa Presidencial Holográfica 3D",
    category: "mobiliario",
    costXp: 18500,
    footprintX: 3,
    footprintY: 2,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "hologram_boot",
    assetSvgKey: "mob_mesa_holografica_nogueira",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Tampo em nogueira maciça com projetor holográfico anatômico 3D."
  },
  {
    id: "mob_maca_terapeutica_levitacao",
    name: "Maca de Levitação Magnética MagLev",
    category: "mobiliario",
    costXp: 21000,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "magnetic_hum",
    assetSvgKey: "mob_maca_terapeutica_levitacao",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Flutuação sobre campos magnéticos com isolamento total de vibrações."
  },
  {
    id: "mob_cristaleira_seculo_xix",
    name: "Cristaleira Imperial Botânica 1880",
    category: "mobiliario",
    costXp: 15000,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "antique_latch",
    assetSvgKey: "mob_cristaleira_seculo_xix",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Móvel de época restaurado com gavetas de veludo para herbários."
  },

  // --- Clínica & Equipamentos (13 Itens) ---
  {
    id: "cli_ecografo_portatil_tablet",
    name: "Ecógrafo Ultrassom Portátil Wireless",
    category: "clinica",
    costXp: 3600,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "ultrasound_sweep",
    assetSvgKey: "cli_ecografo_portatil_tablet",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Sonda doppler sem fio conectada a tablet com tela de alta definição."
  },
  {
    id: "cli_dermatoscopio_digital",
    name: "Dermatoscópio Digital Polarizado",
    category: "clinica",
    costXp: 3300,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "flash_click",
    assetSvgKey: "cli_dermatoscopio_digital",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Lentes de ampliação com luz polarizada cruzada para mapeamento de nevos."
  },
  {
    id: "cli_otoscopio_fibra_optica",
    name: "Painel de Otoscópio Fibra Óptica 4K",
    category: "clinica",
    costXp: 2500,
    footprintX: 1,
    footprintY: 1,
    placementType: "WALL",
    minExpansionLevel: 1,
    interactable: true,
    soundFxUrl: "optic_on",
    assetSvgKey: "cli_otoscopio_fibra_optica",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Fixado na parede com cabo espiralado e iluminação de xenônio."
  },
  {
    id: "cli_balanca_bioimpedancia_pro",
    name: "Bioimpedância Clínica Octapolar",
    category: "clinica",
    costXp: 3800,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "scale_beep",
    assetSvgKey: "cli_balanca_bioimpedancia_pro",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Plataforma com manoplas táteis para medição de massa magra e visceral."
  },
  {
    id: "cli_foco_cirurgico_teto_led",
    name: "Cúpula Dupla Foco Cirúrgico LED",
    category: "clinica",
    costXp: 3500,
    footprintX: 1,
    footprintY: 1,
    placementType: "WALL",
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "light_arc",
    assetSvgKey: "cli_foco_cirurgico_teto_led",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Articulação pantográfica de parede com controle de temperatura de cor."
  },
  {
    id: "cli_espectrometro_massa_mini",
    name: "Mini Espectrômetro de Massa Clínico",
    category: "clinica",
    costXp: 8800,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "spectro_whine",
    assetSvgKey: "cli_espectrometro_massa_mini",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Análise molecular e proteômica rápida em bancada compacta."
  },
  {
    id: "cli_ventilador_pulmonar_ia",
    name: "Ventilador Mecânico Inteligente AI",
    category: "clinica",
    costXp: 7900,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "vent_breathe",
    assetSvgKey: "cli_ventilador_pulmonar_ia",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Display touch com curvas de fluxo sincronizadas e ajuste preditivo."
  },
  {
    id: "cli_centrifuga_plasma_rico",
    name: "Centrífuga Bioquímica de Alta Rotação",
    category: "clinica",
    costXp: 5400,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "centrifuge_spin",
    assetSvgKey: "cli_centrifuga_plasma_rico",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Câmara hermética com rotor para tubos de coleta de sangue."
  },
  {
    id: "cli_endoscopio_flexivel_4k",
    name: "Torre de Vídeo-Endoscopia 4K HDR",
    category: "clinica",
    costXp: 9200,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "endoscope_beep",
    assetSvgKey: "cli_endoscopio_flexivel_4k",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Coluna com monitor médico, fonte de luz LED e processador de imagem."
  },
  {
    id: "cli_crioablativo_nitrogenio",
    name: "Console de Crioablação Dermatológica",
    category: "clinica",
    costXp: 6700,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "cryo_blast",
    assetSvgKey: "cli_crioablativo_nitrogenio",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Unidade com pistola criogênica e regulador de nitrogênio líquido."
  },
  {
    id: "cli_ressonancia_3t_compacta",
    name: "Ressonância Magnética 3T com LED RGB",
    category: "clinica",
    costXp: 24000,
    footprintX: 3,
    footprintY: 2,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "mri_gradient",
    assetSvgKey: "cli_ressonancia_3t_compacta",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Túnel supercondutor de alto campo com iluminação relaxante anti-claustrofobia."
  },
  {
    id: "cli_robo_cirurgico_quatro_bracos",
    name: "Console Robótico Telecirúrgico 4-Braços",
    category: "clinica",
    costXp: 25000,
    footprintX: 2,
    footprintY: 2,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "robot_quad",
    assetSvgKey: "cli_robo_cirurgico_quatro_bracos",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Braços articulados microcirúrgicos com visão estereoscópica 3D imersiva."
  },
  {
    id: "cli_camara_hiperbarica_ouro",
    name: "Câmara Hiperbárica Monoplace Dourada",
    category: "clinica",
    costXp: 19500,
    footprintX: 3,
    footprintY: 1,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "hyperbaric_pressure",
    assetSvgKey: "cli_camara_hiperbarica_ouro",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Cápsula de oxigenoterapia hiperbárica com acabamento dourado e comunicação viva."
  },

  // --- Recepção & Mascotes (12 Itens) ---
  {
    id: "rec_poltrona_egg_veludo_azul",
    name: "Poltrona Egg em Veludo Azul Marinho",
    category: "recepcao",
    costXp: 2900,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: false,
    soundFxUrl: null,
    assetSvgKey: "rec_poltrona_egg_veludo_azul",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Clássico do design nórdico com estofado envolvente e base cromada."
  },
  {
    id: "rec_totem_checkin_facial",
    name: "Totem de Recepção com Reconhecimento",
    category: "recepcao",
    costXp: 3400,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "kiosk_ping",
    assetSvgKey: "rec_totem_checkin_facial",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Totem slim com câmera de autoatendimento para triagem rápida."
  },
  {
    id: "rec_fonte_bambu_shishi_odoshi",
    name: "Fonte Shishi-Odoshi Bambu Zen",
    category: "recepcao",
    costXp: 2700,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "bamboo_clack",
    assetSvgKey: "rec_fonte_bambu_shishi_odoshi",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Bambu japonês com batida rítmica relaxante sobre pedras de rio."
  },
  {
    id: "rec_vitrola_vinil_terapia",
    name: "Vitrola Vinil Acústica Lo-Fi",
    category: "recepcao",
    costXp: 3100,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 2,
    interactable: true,
    soundFxUrl: "vinyl_scratch",
    assetSvgKey: "rec_vitrola_vinil_terapia",
    rarity: "RARE",
    isLootboxExclusive: true,
    description: "Toca-discos analógico em caixa de madeira com chiado nostálgico."
  },
  {
    id: "rec_cafeteira_pistao_ouro",
    name: "Cafeteira de Pistão Ouro & Cobre",
    category: "recepcao",
    costXp: 6500,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "piston_steam",
    assetSvgKey: "rec_cafeteira_pistao_ouro",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Máquina manual de extração de café espresso artesanal italiana."
  },
  {
    id: "rec_aquario_parede_jellyfish",
    name: "Aquário de Parede com Águas-Vivas",
    category: "recepcao",
    costXp: 7800,
    footprintX: 1,
    footprintY: 1,
    placementType: "WALL",
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "jellyfish_glow",
    assetSvgKey: "rec_aquario_parede_jellyfish",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Coluna fina embutida na parede com águas-vivas fluorescentes."
  },
  {
    id: "rec_sofa_curvo_organico",
    name: "Sofá Curvo Ilha Bouclé Areia",
    category: "recepcao",
    costXp: 8500,
    footprintX: 3,
    footprintY: 2,
    minExpansionLevel: 4,
    interactable: false,
    soundFxUrl: null,
    assetSvgKey: "rec_sofa_curvo_organico",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Sofá em formato de rim com tecido texturizado bouclé ultramoderno."
  },
  {
    id: "rec_jardim_vertical_hidroponico",
    name: "Jardim Vertical Hidropônico Iluminado",
    category: "recepcao",
    costXp: 7100,
    footprintX: 1,
    footprintY: 1,
    placementType: "WALL",
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "leaf_rustle",
    assetSvgKey: "rec_jardim_vertical_hidroponico",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Painel verde com samambaias e orquídeas vivas irrigadas automaticamente."
  },
  {
    id: "rec_mascote_husky_dr_neve",
    name: "Husky Terapêutico Dr. Neve",
    category: "recepcao",
    costXp: 8900,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 4,
    interactable: true,
    soundFxUrl: "husky_howl_soft",
    assetSvgKey: "rec_mascote_husky_dr_neve",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Husky de olhos azuis treinado para cinoterapia e acolhimento."
  },
  {
    id: "rec_mascote_gato_persa_angoror",
    name: "Gato Persa Branco Dr. Algodão",
    category: "recepcao",
    costXp: 6800,
    footprintX: 1,
    footprintY: 1,
    minExpansionLevel: 3,
    interactable: true,
    soundFxUrl: "purr_gentle",
    assetSvgKey: "rec_mascote_gato_persa_angoror",
    rarity: "EPIC",
    isLootboxExclusive: true,
    description: "Felino sereno com gravata borboleta verde que ronrona em repouso."
  },
  {
    id: "rec_aquario_recife_coral_gigante",
    name: "Mega Aquário Recife 360° com Corais",
    category: "recepcao",
    costXp: 20000,
    footprintX: 3,
    footprintY: 2,
    minExpansionLevel: 6,
    interactable: true,
    soundFxUrl: "deep_bubbles",
    assetSvgKey: "rec_aquario_recife_coral_gigante",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Tanque cilíndrico central com recife vivo e cardume de palhaços e cirurgiões."
  },
  {
    id: "rec_harpa_automatica_cristal",
    name: "Harpa Cristalina Autotocável",
    category: "recepcao",
    costXp: 17500,
    footprintX: 2,
    footprintY: 1,
    minExpansionLevel: 5,
    interactable: true,
    soundFxUrl: "harp_strum",
    assetSvgKey: "rec_harpa_automatica_cristal",
    rarity: "LEGENDARY",
    isLootboxExclusive: true,
    description: "Instrumento transparente que toca melodias clássicas com dedilhado robótico suave."
  }
];

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
