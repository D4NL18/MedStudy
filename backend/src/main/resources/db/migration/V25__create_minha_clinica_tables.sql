-- ============================================================================
-- Migration: V25__create_minha_clinica_tables.sql
-- Feature: Minha Clínica Médica (Gamificação Isométrica 2.5D & Motor de XP)
-- Regras de Negócio: P-080, P-081, P-082, P-083, P-084, P-085, P-086
-- Governança DBA: Operação 100% aditiva (IF NOT EXISTS), sem comandos destrutivos.
-- ============================================================================

-- 1. Conta de XP do Estudante (Dualidade de Saldos P-080 & Ofensiva Diária P-081)
CREATE TABLE IF NOT EXISTS user_xp_accounts (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    lifetime_xp BIGINT NOT NULL DEFAULT 0,
    current_xp BIGINT NOT NULL DEFAULT 0,
    current_streak_days INT NOT NULL DEFAULT 0,
    last_study_date DATE,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_xp_accounts_lifetime_non_negative CHECK (lifetime_xp >= 0),
    CONSTRAINT chk_user_xp_accounts_current_non_negative CHECK (current_xp >= 0),
    CONSTRAINT chk_user_xp_accounts_streak_non_negative CHECK (current_streak_days >= 0)
);

CREATE INDEX IF NOT EXISTS idx_user_xp_accounts_lifetime_xp_desc
    ON user_xp_accounts (lifetime_xp DESC);

-- 2. Clínica Isométrica 2.5D do Estudante (Progressão Espacial em 6 Níveis P-082)
CREATE TABLE IF NOT EXISTS user_clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    clinic_name VARCHAR(100) NOT NULL DEFAULT 'Minha Clínica',
    expansion_level INT NOT NULL DEFAULT 1,
    grid_width INT NOT NULL DEFAULT 4,
    grid_height INT NOT NULL DEFAULT 4,
    theme VARCHAR(50) NOT NULL DEFAULT 'clean_modern',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_clinics_expansion_level CHECK (expansion_level BETWEEN 1 AND 6),
    CONSTRAINT chk_user_clinics_grid_dimensions CHECK (grid_width BETWEEN 4 AND 16 AND grid_height BETWEEN 4 AND 12)
);

-- 3. Catálogo Oficial de 27 Itens, Skins e Preços (Destaque Pediatria P-083)
CREATE TABLE IF NOT EXISTS clinic_items_catalog (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cost_xp INT NOT NULL,
    min_expansion_level INT NOT NULL DEFAULT 1,
    footprint_x INT NOT NULL DEFAULT 1,
    footprint_y INT NOT NULL DEFAULT 1,
    is_interactable BOOLEAN NOT NULL DEFAULT FALSE,
    sound_fx_url VARCHAR(255),
    asset_svg_key VARCHAR(100) NOT NULL,
    CONSTRAINT chk_clinic_items_catalog_category CHECK (category IN ('pediatria', 'mobiliario', 'clinica', 'recepcao')),
    CONSTRAINT chk_clinic_items_catalog_cost_xp CHECK (cost_xp >= 0),
    CONSTRAINT chk_clinic_items_catalog_min_level CHECK (min_expansion_level BETWEEN 1 AND 6),
    CONSTRAINT chk_clinic_items_catalog_footprint CHECK (footprint_x >= 1 AND footprint_y >= 1)
);

CREATE INDEX IF NOT EXISTS idx_clinic_items_catalog_category_level
    ON clinic_items_catalog (category, min_expansion_level, cost_xp);

-- 4. Itens Adquiridos: Posicionados no Chão (is_placed = TRUE) ou no Inventário (is_placed = FALSE) (P-084)
CREATE TABLE IF NOT EXISTS clinic_placed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES user_clinics(id) ON DELETE CASCADE,
    catalog_item_id VARCHAR(50) NOT NULL REFERENCES clinic_items_catalog(id),
    grid_x INT NOT NULL DEFAULT 0,
    grid_y INT NOT NULL DEFAULT 0,
    rotation INT NOT NULL DEFAULT 0,
    is_placed BOOLEAN NOT NULL DEFAULT TRUE,
    placed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_clinic_placed_items_rotation CHECK (rotation IN (0, 1)),
    CONSTRAINT chk_clinic_placed_items_coords CHECK (NOT is_placed OR (grid_x >= 0 AND grid_y >= 0))
);

CREATE INDEX IF NOT EXISTS idx_clinic_placed_items_clinic_id
    ON clinic_placed_items (clinic_id);

CREATE INDEX IF NOT EXISTS idx_clinic_placed_items_clinic_placed
    ON clinic_placed_items (clinic_id, is_placed);

CREATE INDEX IF NOT EXISTS idx_clinic_placed_items_catalog_id
    ON clinic_placed_items (catalog_item_id);

-- 5. Ledger Contábil Imutável de Transações de XP (P-080 & P-081)
CREATE TABLE IF NOT EXISTS user_xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    balance_after BIGINT NOT NULL,
    source VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_xp_transactions_balance_non_negative CHECK (balance_after >= 0),
    CONSTRAINT chk_user_xp_transactions_amount_non_zero CHECK (amount <> 0)
);

CREATE INDEX IF NOT EXISTS idx_user_xp_transactions_user_created
    ON user_xp_transactions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_xp_transactions_source
    ON user_xp_transactions (source);

-- ============================================================================
-- População Integral dos 27 Itens Oficiais do Catálogo (P-083)
-- ============================================================================
INSERT INTO clinic_items_catalog (
    id, name, category, cost_xp, min_expansion_level,
    footprint_x, footprint_y, is_interactable, sound_fx_url, asset_svg_key
) VALUES
    -- 4.1. Set Especial: Pediatria ('pediatria' — 10 Itens)
    ('ped_maca_dino', 'Maca Dinossauro Safari', 'pediatria', 3500, 2, 2, 1, TRUE, '/assets/audio/clinic/dino_blink.mp3', 'ped_maca_dino'),
    ('ped_maca_baleia', 'Maca Baleia Azul', 'pediatria', 1800, 1, 2, 1, TRUE, '/assets/audio/clinic/whale_soft.mp3', 'ped_maca_baleia'),
    ('ped_maca_f1', 'Maca Carro de Corrida', 'pediatria', 2400, 2, 2, 1, TRUE, '/assets/audio/clinic/f1_horn.mp3', 'ped_maca_f1'),
    ('ped_regua_girafa', 'Régua Girafa de Parede', 'pediatria', 900, 1, 1, 1, TRUE, '/assets/audio/clinic/wood_measure.mp3', 'ped_regua_girafa'),
    ('ped_balanca_urso', 'Balança Bebê Ursinho', 'pediatria', 1100, 1, 1, 1, FALSE, NULL, 'ped_balanca_urso'),
    ('ped_piscina_bolinhas', 'Piscina de Bolinhas Candy Color', 'pediatria', 2800, 3, 2, 2, TRUE, '/assets/audio/clinic/ball_pit.mp3', 'ped_piscina_bolinhas'),
    ('ped_tenda_leitura', 'Tenda Tipi Indígena', 'pediatria', 3200, 4, 2, 2, TRUE, '/assets/audio/clinic/page_turn.mp3', 'ped_tenda_leitura'),
    ('ped_bau_coragem', 'Baú do Tesouro / Pote de Adesivos', 'pediatria', 1500, 2, 1, 1, TRUE, '/assets/audio/clinic/sparkle_chime.mp3', 'ped_bau_coragem'),
    ('ped_papel_safari', 'Papel de Parede Safari Aquarela', 'pediatria', 850, 1, 1, 1, FALSE, NULL, 'ped_papel_safari'),
    ('ped_esteto_elefante', 'Protetor de Esteto Elefantinho', 'pediatria', 650, 1, 1, 1, FALSE, NULL, 'ped_esteto_elefante'),

    -- 4.2. Mobiliário Médico Principal ('mobiliario' — 6 Itens)
    ('mesa_scandi', 'Mesa Escandinava de Carvalho com Suculenta', 'mobiliario', 950, 1, 2, 1, FALSE, NULL, 'mesa_scandi'),
    ('mesa_mogno_cafe', 'Mesa de Mogno com Xícara de Café Quente', 'mobiliario', 2200, 2, 2, 1, TRUE, '/assets/audio/clinic/coffee_sip.mp3', 'mesa_mogno_cafe'),
    ('mesa_carrara', 'Mesa Mármore Carrara & Dourado', 'mobiliario', 4800, 4, 2, 1, TRUE, '/assets/audio/clinic/marble_chime.mp3', 'mesa_carrara'),
    ('cadeira_ergonomica', 'Cadeira Operacional Mesh', 'mobiliario', 800, 1, 1, 1, FALSE, NULL, 'cadeira_ergonomica'),
    ('cadeira_presidente_couro', 'Cadeira Presidente Couro Caramelo Capitonê', 'mobiliario', 2600, 3, 1, 1, FALSE, NULL, 'cadeira_presidente_couro'),
    ('pc_ultrawide', 'Estação de Trabalho com Monitor Ultrawide', 'mobiliario', 1600, 2, 1, 1, TRUE, '/assets/audio/clinic/key_click.mp3', 'pc_ultrawide'),

    -- 4.3. Instrumentais & Outras Especialidades ('clinica' — 6 Itens)
    ('didatico_dr_bones', 'Esqueleto Didático "Dr. Bones"', 'clinica', 1900, 1, 1, 1, TRUE, '/assets/audio/clinic/bones_clack.mp3', 'didatico_dr_bones'),
    ('esteto_ouro_master', 'Estetoscópio Master Ouro em Suporte', 'clinica', 3000, 3, 1, 1, TRUE, '/assets/audio/clinic/heartbeat_soft.mp3', 'esteto_ouro_master'),
    ('monitor_ecg', 'Monitor Cardíaco com Traçado Vivo em Loop', 'clinica', 2100, 2, 1, 1, TRUE, '/assets/audio/clinic/ecg_beep.mp3', 'monitor_ecg'),
    ('usg_fetal_4d', 'Aparelho de Ultrassom 4D com Display Colorido', 'clinica', 3900, 4, 1, 1, TRUE, '/assets/audio/clinic/usg_doppler.mp3', 'usg_fetal_4d'),
    ('negatoscopio_led', 'Negatoscópio Ultra-Slim com Radiografia Iluminada', 'clinica', 1400, 1, 1, 1, TRUE, '/assets/audio/clinic/led_switch.mp3', 'negatoscopio_led'),
    ('estante_harrison', 'Estante Gigante com Tratados Clássicos de Medicina', 'clinica', 1700, 2, 2, 1, FALSE, NULL, 'estante_harrison'),

    -- 4.4. Recepção & Mascotes Relaxantes ('recepcao' — 5 Itens)
    ('cafe_espresso_vermelho', 'Máquina de Espresso Gourmet', 'recepcao', 1300, 1, 1, 1, TRUE, '/assets/audio/clinic/espresso_steam.mp3', 'cafe_espresso_vermelho'),
    ('mascote_gato_bisturi', 'Gato "Bisturi"', 'recepcao', 2900, 2, 1, 1, TRUE, '/assets/audio/clinic/cat_purr.mp3', 'mascote_gato_bisturi'),
    ('mascote_cao_caramelo', 'Golden Retriever "Dr. Caramelo"', 'recepcao', 4500, 3, 1, 1, TRUE, '/assets/audio/clinic/dog_tail_wag.mp3', 'mascote_cao_caramelo'),
    ('balcao_recepcao_madeira', 'Balcão de Recepção em Madeira Clara', 'recepcao', 1500, 3, 2, 1, FALSE, NULL, 'balcao_recepcao_madeira'),
    ('bebedouro_galao', 'Bebedouro Retrô de Galão Azul', 'recepcao', 400, 1, 1, 1, TRUE, '/assets/audio/clinic/water_bubble.mp3', 'bebedouro_galao')
ON CONFLICT (id) DO NOTHING;
