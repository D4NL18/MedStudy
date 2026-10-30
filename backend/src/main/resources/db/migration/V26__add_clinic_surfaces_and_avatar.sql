-- ============================================================================
-- Migration: V26__add_clinic_surfaces_and_avatar.sql
-- Feature: Minha Clínica Médica (Superfícies, Fixação de Parede e Avatar Médico)
-- Regras de Negócio: P-087, P-088, P-089 (US-06, US-07)
-- Governança DBA: Operação 100% aditiva, idempotente e segura contra perda de dados.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Customização Global de Superfícies de Ambiente (P-087)
-- Desacopla papel de parede e revestimento de piso do grid de colisão de móveis
-- ----------------------------------------------------------------------------
ALTER TABLE user_clinics 
    ADD COLUMN IF NOT EXISTS wall_theme VARCHAR(50) NOT NULL DEFAULT 'wall_clean_white';

ALTER TABLE user_clinics 
    ADD COLUMN IF NOT EXISTS floor_theme VARCHAR(50) NOT NULL DEFAULT 'floor_porcelanato_cinza';

-- ----------------------------------------------------------------------------
-- 2. Suporte a Tipos de Fixação no Catálogo de Itens (P-087 e P-088)
-- Categoriza itens entre chão (FLOOR), parede (WALL) e revestimentos (SURFACE_*)
-- ----------------------------------------------------------------------------
ALTER TABLE clinic_items_catalog 
    ADD COLUMN IF NOT EXISTS placement_type VARCHAR(20) NOT NULL DEFAULT 'FLOOR';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_clinic_items_catalog_placement_type'
    ) THEN
        ALTER TABLE clinic_items_catalog
            ADD CONSTRAINT chk_clinic_items_catalog_placement_type
            CHECK (placement_type IN ('FLOOR', 'WALL', 'SURFACE_WALL', 'SURFACE_FLOOR'));
    END IF;
END $$;

-- Atualiza a constraint de dimensões para admitir 0x0 em itens de parede e superfícies
ALTER TABLE clinic_items_catalog 
    DROP CONSTRAINT IF EXISTS chk_clinic_items_catalog_footprint;

ALTER TABLE clinic_items_catalog 
    ADD CONSTRAINT chk_clinic_items_catalog_footprint 
    CHECK (
        (placement_type = 'FLOOR' AND footprint_x >= 1 AND footprint_y >= 1) OR
        (placement_type IN ('WALL', 'SURFACE_WALL', 'SURFACE_FLOOR') AND footprint_x >= 0 AND footprint_y >= 0)
    );

-- Atualização de itens do catálogo existente
-- ped_papel_safari: Papel de parede contínuo (SURFACE_WALL, 0x0)
UPDATE clinic_items_catalog
SET placement_type = 'SURFACE_WALL', footprint_x = 0, footprint_y = 0
WHERE id = 'ped_papel_safari';

-- ped_regua_girafa e negatoscopio_led: Itens de fixação vertical (WALL, 0x0)
UPDATE clinic_items_catalog
SET placement_type = 'WALL', footprint_x = 0, footprint_y = 0
WHERE id IN ('ped_regua_girafa', 'negatoscopio_led');

CREATE INDEX IF NOT EXISTS idx_clinic_items_catalog_placement
    ON clinic_items_catalog (placement_type, category);

-- ----------------------------------------------------------------------------
-- 3. Coordenadas de Fixação Vertical em Itens Posicionados (P-088)
-- Ancoragem em paredes traseiras visíveis (NW, NE), segmento linear e elevação Z
-- ----------------------------------------------------------------------------
ALTER TABLE clinic_placed_items 
    ADD COLUMN IF NOT EXISTS wall_side VARCHAR(2);

ALTER TABLE clinic_placed_items 
    ADD COLUMN IF NOT EXISTS wall_tile_index INT;

ALTER TABLE clinic_placed_items 
    ADD COLUMN IF NOT EXISTS elevation_z INT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_clinic_placed_items_wall_side'
    ) THEN
        ALTER TABLE clinic_placed_items
            ADD CONSTRAINT chk_clinic_placed_items_wall_side
            CHECK (wall_side IS NULL OR wall_side IN ('NW', 'NE'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_clinic_placed_items_wall_tile_index'
    ) THEN
        ALTER TABLE clinic_placed_items
            ADD CONSTRAINT chk_clinic_placed_items_wall_tile_index
            CHECK (wall_tile_index IS NULL OR wall_tile_index >= 0);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_clinic_placed_items_elevation_z'
    ) THEN
        ALTER TABLE clinic_placed_items
            ADD CONSTRAINT chk_clinic_placed_items_elevation_z
            CHECK (elevation_z IS NULL OR (elevation_z >= 0 AND elevation_z <= 200));
    END IF;
END $$;

-- Índice para consultas ultra-rápidas de itens por parede da clínica
CREATE INDEX IF NOT EXISTS idx_clinic_placed_items_wall_lookup
    ON clinic_placed_items (clinic_id, wall_side, wall_tile_index)
    WHERE wall_side IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 4. Personagem Médico Virtual (Doctor Avatar) (P-089 / US-07)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_doctor_avatar (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    gender VARCHAR(10) NOT NULL DEFAULT 'FEMALE',
    skin_coat VARCHAR(50) NOT NULL DEFAULT 'coat_intern_white',
    skin_stethoscope VARCHAR(50) NOT NULL DEFAULT 'steth_classic_black',
    skin_accessory VARCHAR(50) NOT NULL DEFAULT 'acc_none',
    avatar_x INT NOT NULL DEFAULT 1,
    avatar_y INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_doctor_avatar_gender CHECK (gender IN ('MALE', 'FEMALE')),
    CONSTRAINT chk_user_doctor_avatar_coords CHECK (avatar_x >= 0 AND avatar_y >= 0)
);

-- ----------------------------------------------------------------------------
-- 5. Guarda-Roupa de Skins Desbloqueadas pelo Estudante (P-087, P-089)
-- Persiste itens de vestimenta e acabamentos de superfície adquiridos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_unlocked_skins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skin_slot VARCHAR(20) NOT NULL,
    skin_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_unlocked_skins_user_skin UNIQUE(user_id, skin_id),
    CONSTRAINT chk_user_unlocked_skins_slot CHECK (skin_slot IN ('coat', 'stethoscope', 'accessory', 'surface_wall', 'surface_floor'))
);

CREATE INDEX IF NOT EXISTS idx_user_unlocked_skins_user_id
    ON user_unlocked_skins (user_id);

CREATE INDEX IF NOT EXISTS idx_user_unlocked_skins_user_slot
    ON user_unlocked_skins (user_id, skin_slot);

-- ----------------------------------------------------------------------------
-- 6. Migração de Dados e Provisionamento Padrão para Clínicas Existentes
-- ----------------------------------------------------------------------------
-- 6.1. Provisionar avatar padrão para todas as clínicas existentes
INSERT INTO user_doctor_avatar (user_id, gender, skin_coat, skin_stethoscope, skin_accessory, avatar_x, avatar_y, updated_at)
SELECT uc.user_id, 'FEMALE', 'coat_intern_white', 'steth_classic_black', 'acc_none', 1, 1, NOW()
FROM user_clinics uc
LEFT JOIN user_doctor_avatar uda ON uda.user_id = uc.user_id
WHERE uda.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 6.2. Conceder slots gratuitos de onboarding para todos os usuários com clínica
INSERT INTO user_unlocked_skins (user_id, skin_slot, skin_id, unlocked_at)
SELECT uc.user_id, s.slot, s.skin_id, NOW()
FROM user_clinics uc
CROSS JOIN (
    VALUES
        ('surface_wall', 'wall_clean_white'),
        ('surface_floor', 'floor_porcelanato_cinza'),
        ('coat', 'coat_intern_white'),
        ('stethoscope', 'steth_classic_black'),
        ('stethoscope', 'steth_none'),
        ('accessory', 'acc_none')
) AS s(slot, skin_id)
ON CONFLICT (user_id, skin_id) DO NOTHING;

-- 6.3. Migrar aquisições passadas do papel de parede safari para user_unlocked_skins
INSERT INTO user_unlocked_skins (user_id, skin_slot, skin_id, unlocked_at)
SELECT DISTINCT uc.user_id, 'surface_wall', 'ped_papel_safari', NOW()
FROM clinic_placed_items cpi
JOIN user_clinics uc ON uc.id = cpi.clinic_id
WHERE cpi.catalog_item_id = 'ped_papel_safari'
ON CONFLICT (user_id, skin_id) DO NOTHING;

-- 6.4. Ativar wall_theme = 'ped_papel_safari' para clínicas onde ele estava posicionado
UPDATE user_clinics uc
SET wall_theme = 'ped_papel_safari'
FROM clinic_placed_items cpi
WHERE cpi.clinic_id = uc.id
  AND cpi.catalog_item_id = 'ped_papel_safari'
  AND cpi.is_placed;

-- 6.5. Desacoplar ped_papel_safari da malha de piso sem deletar o registro contábil de aquisição
UPDATE clinic_placed_items
SET is_placed = FALSE
WHERE catalog_item_id = 'ped_papel_safari'
  AND is_placed;
