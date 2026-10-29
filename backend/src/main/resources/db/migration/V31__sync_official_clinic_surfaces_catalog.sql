-- ============================================================================
-- Migration: V31__sync_official_clinic_surfaces_catalog.sql
-- Feature: Minha Clínica Médica (Catálogo Oficial de Superfícies & Revestimentos)
-- Regras de Negócio: P-096.1, P-096.2, P-096.3 (US-14)
-- Governança DBA: Idempotente (ON CONFLICT DO UPDATE), 100% aditiva, zero data loss.
-- Sincroniza 8 Revestimentos Oficiais (4 Paredes + 4 Pisos) com footprint 0x0.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Adequação Segura de Constraints em clinic_items_catalog
-- ----------------------------------------------------------------------------

DO $$
BEGIN
    -- 1.1. Assegurar suporte a SURFACE_WALL e SURFACE_FLOOR em placement_type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clinic_items_catalog' AND column_name = 'placement_type'
    ) THEN
        ALTER TABLE clinic_items_catalog DROP CONSTRAINT IF EXISTS chk_clinic_items_catalog_placement_type;
        ALTER TABLE clinic_items_catalog ADD CONSTRAINT chk_clinic_items_catalog_placement_type
            CHECK (placement_type IN ('FLOOR', 'WALL', 'SURFACE_WALL', 'SURFACE_FLOOR'));
    ELSE
        ALTER TABLE clinic_items_catalog 
            ADD COLUMN placement_type VARCHAR(20) NOT NULL DEFAULT 'FLOOR';
        ALTER TABLE clinic_items_catalog ADD CONSTRAINT chk_clinic_items_catalog_placement_type
            CHECK (placement_type IN ('FLOOR', 'WALL', 'SURFACE_WALL', 'SURFACE_FLOOR'));
    END IF;

    -- 1.2. Permitir categorias WALL_SURFACE, FLOOR_SURFACE e revestimentos
    ALTER TABLE clinic_items_catalog DROP CONSTRAINT IF EXISTS chk_clinic_items_catalog_category;
    ALTER TABLE clinic_items_catalog ADD CONSTRAINT chk_clinic_items_catalog_category
        CHECK (category IN ('pediatria', 'mobiliario', 'clinica', 'recepcao', 'revestimentos', 'WALL_SURFACE', 'FLOOR_SURFACE'));

    -- 1.3. Permitir footprint_x = 0 e footprint_y = 0 para superfícies e itens de parede
    ALTER TABLE clinic_items_catalog DROP CONSTRAINT IF EXISTS chk_clinic_items_catalog_footprint;
    ALTER TABLE clinic_items_catalog ADD CONSTRAINT chk_clinic_items_catalog_footprint
        CHECK (footprint_x >= 0 AND footprint_y >= 0);

END $$;

-- ----------------------------------------------------------------------------
-- 2. Garantir Criação de Tabela user_unlocked_skins (se inexistente)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_unlocked_skins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skin_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_unlocked_skins_user_skin UNIQUE (user_id, skin_id)
);

CREATE INDEX IF NOT EXISTS idx_user_unlocked_skins_user_skin
    ON user_unlocked_skins (user_id, skin_id);

-- ----------------------------------------------------------------------------
-- 3. Inserção / Atualização Idempotente dos 8 Revestimentos Oficiais (P-096.1)
-- ----------------------------------------------------------------------------

INSERT INTO clinic_items_catalog (
    id,
    name,
    category,
    cost_xp,
    min_expansion_level,
    footprint_x,
    footprint_y,
    placement_type,
    is_interactable,
    sound_fx_url,
    asset_svg_key,
    rarity,
    is_lootbox_exclusive
) VALUES
    -- ------------------------------------------------------------------------
    -- PAREDES (placement_type = 'SURFACE_WALL', footprint = 0x0)
    -- ------------------------------------------------------------------------
    (
        'clean_white',
        'Branco Clínico Minimalista',
        'WALL_SURFACE',
        0,
        1,
        0,
        0,
        'SURFACE_WALL',
        FALSE,
        NULL,
        'clean_white',
        'COMMON',
        FALSE
    ),
    (
        'ped_papel_safari',
        'Safari Aquarela Savana',
        'WALL_SURFACE',
        850,
        1,
        0,
        0,
        'SURFACE_WALL',
        FALSE,
        NULL,
        'ped_papel_safari',
        'COMMON',
        FALSE
    ),
    (
        'wallpaper_geometric_teal',
        'Geométrico Nórdico Teal',
        'WALL_SURFACE',
        950,
        1,
        0,
        0,
        'SURFACE_WALL',
        FALSE,
        NULL,
        'wallpaper_geometric_teal',
        'COMMON',
        FALSE
    ),
    (
        'wallpaper_brick_white',
        'Tijolinho Branco Moderno',
        'WALL_SURFACE',
        750,
        1,
        0,
        0,
        'SURFACE_WALL',
        FALSE,
        NULL,
        'wallpaper_brick_white',
        'COMMON',
        FALSE
    ),

    -- ------------------------------------------------------------------------
    -- PISOS (placement_type = 'SURFACE_FLOOR', footprint = 0x0)
    -- ------------------------------------------------------------------------
    (
        'wood_light',
        'Carvalho Claro Escandinavo',
        'FLOOR_SURFACE',
        0,
        1,
        0,
        0,
        'SURFACE_FLOOR',
        FALSE,
        NULL,
        'wood_light',
        'COMMON',
        FALSE
    ),
    (
        'wood_dark_herringbone',
        'Madeira Nobre Espinha de Peixe',
        'FLOOR_SURFACE',
        1100,
        1,
        0,
        0,
        'SURFACE_FLOOR',
        FALSE,
        NULL,
        'wood_dark_herringbone',
        'COMMON',
        FALSE
    ),
    (
        'marble_carrara',
        'Mármore Carrara Luxo',
        'FLOOR_SURFACE',
        2200,
        1,
        0,
        0,
        'SURFACE_FLOOR',
        FALSE,
        NULL,
        'marble_carrara',
        'RARE',
        FALSE
    ),
    (
        'tatame_eva',
        'Tatame EVA Pastel Candy Color',
        'FLOOR_SURFACE',
        800,
        1,
        0,
        0,
        'SURFACE_FLOOR',
        FALSE,
        NULL,
        'tatame_eva',
        'COMMON',
        FALSE
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    cost_xp = EXCLUDED.cost_xp,
    min_expansion_level = EXCLUDED.min_expansion_level,
    footprint_x = EXCLUDED.footprint_x,
    footprint_y = EXCLUDED.footprint_y,
    placement_type = EXCLUDED.placement_type,
    is_interactable = EXCLUDED.is_interactable,
    sound_fx_url = EXCLUDED.sound_fx_url,
    asset_svg_key = EXCLUDED.asset_svg_key,
    rarity = EXCLUDED.rarity,
    is_lootbox_exclusive = EXCLUDED.is_lootbox_exclusive;

-- ----------------------------------------------------------------------------
-- 4. Índice para Otimização de Busca por Tipo de Superfície
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clinic_items_catalog_surfaces
    ON clinic_items_catalog (placement_type, category, cost_xp);
