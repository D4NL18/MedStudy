-- ============================================================================
-- Migration: V28__add_item_rarities_and_lootbox_system.sql
-- Feature: Minha Clínica Médica (Raridades, 50 Itens Exclusivos & Lootboxes em 3 Tiers)
-- Regras de Negócio: P-093, P-094, P-095 (US-11, US-12, US-13)
-- Governança DBA: Operação 100% aditiva, idempotente e segura contra perda de dados.
-- Totaliza 154 itens no catálogo (104 gerais + 50 exclusivos de sorteio).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Extensão do Catálogo com Raridade e Flag de Exclusividade (P-093)
-- ----------------------------------------------------------------------------
ALTER TABLE clinic_items_catalog
    ADD COLUMN IF NOT EXISTS rarity VARCHAR(20) NOT NULL DEFAULT 'COMMON';

ALTER TABLE clinic_items_catalog
    ADD COLUMN IF NOT EXISTS is_lootbox_exclusive BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_clinic_items_catalog_rarity'
    ) THEN
        ALTER TABLE clinic_items_catalog
            ADD CONSTRAINT chk_clinic_items_catalog_rarity
            CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY'));
    END IF;
END $$;

-- Índices para otimização de consultas e sorteios probabilísticos no catálogo
CREATE INDEX IF NOT EXISTS idx_clinic_items_catalog_rarity_exclusive
    ON clinic_items_catalog (rarity, is_lootbox_exclusive);

CREATE INDEX IF NOT EXISTS idx_clinic_items_catalog_exclusive
    ON clinic_items_catalog (is_lootbox_exclusive);

-- ----------------------------------------------------------------------------
-- 2. Calibração Retroativa de Raridade dos 104 Itens Existentes (P-093)
-- Distribuição: 42 COMMON, 38 RARE, 18 EPIC e 6 LEGENDARY
-- ----------------------------------------------------------------------------
UPDATE clinic_items_catalog
SET rarity = CASE
    WHEN id IN (
        'conjunto_diretoria_nogal',
        'ressonancia_simulador',
        'robo_cirurgico_console',
        'tanque_criogenico_celulas',
        'ped_castelo_faz_de_conta',
        'piano_cauda_lounge'
    ) THEN 'LEGENDARY'
    WHEN cost_xp >= 4100 THEN 'EPIC'
    WHEN cost_xp >= 1650 THEN 'RARE'
    ELSE 'COMMON'
END
WHERE is_lootbox_exclusive = FALSE;

-- ----------------------------------------------------------------------------
-- 3. Inserção dos 50 Novos Itens Especiais Médicos Exclusivos de Lootbox (P-093)
-- Distribuição Oficial: 18 RARE (36%), 22 EPIC (44%) e 10 LEGENDARY (20%)
-- Categorias: Pediatria (13), Mobiliário (12), Clínica (13), Recepção (12)
-- ----------------------------------------------------------------------------
INSERT INTO clinic_items_catalog (
    id, name, category, cost_xp, min_expansion_level,
    footprint_x, footprint_y, is_interactable, sound_fx_url,
    asset_svg_key, placement_type, rarity, is_lootbox_exclusive
) VALUES
    -- ------------------------------------------------------------------------
    -- 3.1. Ala Pediátrica & Hebiatria ('pediatria' — 13 Itens Exclusivos)
    -- ------------------------------------------------------------------------
    ('ped_maca_foguete_retro', 'Maca Foguete Espacial Retrô', 'pediatria', 3400, 2, 2, 1, TRUE, '/assets/audio/clinic/rocket_whoosh.mp3', 'ped_maca_foguete_retro', 'FLOOR', 'RARE', TRUE),
    ('ped_projetor_estrelas_teto', 'Projetor Galáctico de Parede', 'pediatria', 2600, 2, 0, 0, TRUE, '/assets/audio/clinic/stars_shimmer.mp3', 'ped_projetor_estrelas_teto', 'WALL', 'RARE', TRUE),
    ('ped_cubo_sensorial_montessori', 'Cubo Sensorial Montessori', 'pediatria', 2200, 1, 1, 1, TRUE, '/assets/audio/clinic/wood_click.mp3', 'ped_cubo_sensorial_montessori', 'FLOOR', 'RARE', TRUE),
    ('ped_bancada_quimica_junior', 'Mini Laboratório Cientista Júnior', 'pediatria', 3100, 2, 2, 1, TRUE, '/assets/audio/clinic/flask_bubble.mp3', 'ped_bancada_quimica_junior', 'FLOOR', 'RARE', TRUE),
    ('ped_painel_arvore_amigos', 'Painel Magnético Árvore da Floresta', 'pediatria', 2800, 2, 0, 0, TRUE, '/assets/audio/clinic/forest_birds.mp3', 'ped_painel_arvore_amigos', 'WALL', 'RARE', TRUE),
    ('ped_robo_pixel_cuidador', 'Robô Cuidador Amigável Dr. Pixel', 'pediatria', 5800, 3, 1, 1, TRUE, '/assets/audio/clinic/robot_blip.mp3', 'ped_robo_pixel_cuidador', 'FLOOR', 'EPIC', TRUE),
    ('ped_maca_disco_voador', 'Maca Disco Voador com LED Neon', 'pediatria', 6500, 4, 2, 1, TRUE, '/assets/audio/clinic/ufo_hum.mp3', 'ped_maca_disco_voador', 'FLOOR', 'EPIC', TRUE),
    ('ped_toboga_nuvem_magica', 'Tobogã Curvo Nuvem Mágica', 'pediatria', 7200, 4, 2, 2, TRUE, '/assets/audio/clinic/slide_whistle.mp3', 'ped_toboga_nuvem_magica', 'FLOOR', 'EPIC', TRUE),
    ('ped_planetario_domo', 'Cúpula Planetário Imersivo LED', 'pediatria', 8400, 5, 2, 2, TRUE, '/assets/audio/clinic/space_ambient.mp3', 'ped_planetario_domo', 'FLOOR', 'EPIC', TRUE),
    ('ped_aquario_submarino_kids', 'Aquário Cilindro Submarino Lúdico', 'pediatria', 6900, 3, 1, 1, TRUE, '/assets/audio/clinic/sonar_ping.mp3', 'ped_aquario_submarino_kids', 'FLOOR', 'EPIC', TRUE),
    ('ped_cama_elastica_arco_iris', 'Cama Elástica Sensorial Arco-Íris', 'pediatria', 6100, 3, 2, 2, TRUE, '/assets/audio/clinic/bounce_spring.mp3', 'ped_cama_elastica_arco_iris', 'FLOOR', 'EPIC', TRUE),
    ('ped_carrossel_musical_reino', 'Carrossel Vitoriano Encantado com Música', 'pediatria', 16000, 5, 2, 2, TRUE, '/assets/audio/clinic/music_box_waltz.mp3', 'ped_carrossel_musical_reino', 'FLOOR', 'LEGENDARY', TRUE),
    ('ped_simulador_foguete_orbital', 'Cápsula Espacial Simuladora Apollo Kids', 'pediatria', 22000, 6, 3, 2, TRUE, '/assets/audio/clinic/rocket_launch.mp3', 'ped_simulador_foguete_orbital', 'FLOOR', 'LEGENDARY', TRUE),

    -- ------------------------------------------------------------------------
    -- 3.2. Mobiliário Médico & Ergonomia ('mobiliario' — 12 Itens Exclusivos)
    -- ------------------------------------------------------------------------
    ('mob_mesa_vidro_flutuante', 'Mesa Flutuante Vidro & Inox', 'mobiliario', 2900, 2, 2, 1, FALSE, NULL, 'mob_mesa_vidro_flutuante', 'FLOOR', 'RARE', TRUE),
    ('mob_poltrona_ergonomica_atlas', 'Poltrona Biomecânica Atlas Pro', 'mobiliario', 2700, 2, 1, 1, FALSE, NULL, 'mob_poltrona_ergonomica_atlas', 'FLOOR', 'RARE', TRUE),
    ('mob_estante_livros_giratoria', 'Estante Cilíndrica Giratória Farmácia', 'mobiliario', 3200, 3, 1, 1, TRUE, '/assets/audio/clinic/shelf_spin.mp3', 'mob_estante_livros_giratoria', 'FLOOR', 'RARE', TRUE),
    ('mob_biombo_art_deco_dourado', 'Biombo Art Déco Ouro Escovado', 'mobiliario', 3500, 3, 2, 1, TRUE, '/assets/audio/clinic/screen_fold.mp3', 'mob_biombo_art_deco_dourado', 'FLOOR', 'RARE', TRUE),
    ('mob_poltrona_anti_gravidade', 'Poltrona Gravidade Zero Aquecida', 'mobiliario', 7400, 4, 1, 1, TRUE, '/assets/audio/clinic/hydraulic_recline.mp3', 'mob_poltrona_anti_gravidade', 'FLOOR', 'EPIC', TRUE),
    ('mob_maca_podologia_hidraulica', 'Maca Hidráulica em Couro Pérola', 'mobiliario', 6800, 4, 2, 1, TRUE, '/assets/audio/clinic/hydraulic_lift.mp3', 'mob_maca_podologia_hidraulica', 'FLOOR', 'EPIC', TRUE),
    ('mob_estacao_laudos_tripla', 'Estação de Laudos Tripla Curva 4K', 'mobiliario', 8200, 5, 2, 1, TRUE, '/assets/audio/clinic/keyboard_tap.mp3', 'mob_estacao_laudos_tripla', 'FLOOR', 'EPIC', TRUE),
    ('mob_aparador_cristal_farmacia', 'Vitrine Farmacêutica em Cristal & Latão', 'mobiliario', 6400, 3, 2, 1, TRUE, '/assets/audio/clinic/glass_creak.mp3', 'mob_aparador_cristal_farmacia', 'FLOOR', 'EPIC', TRUE),
    ('mob_gaveteiro_blindado_titanio', 'Arquivo de Psicotrópicos em Titânio', 'mobiliario', 5600, 3, 1, 1, TRUE, '/assets/audio/clinic/safe_lock.mp3', 'mob_gaveteiro_blindado_titanio', 'FLOOR', 'EPIC', TRUE),
    ('mob_mesa_holografica_nogueira', 'Mesa Presidencial Holográfica 3D', 'mobiliario', 18500, 6, 3, 2, TRUE, '/assets/audio/clinic/hologram_boot.mp3', 'mob_mesa_holografica_nogueira', 'FLOOR', 'LEGENDARY', TRUE),
    ('mob_maca_terapeutica_levitacao', 'Maca de Levitação Magnética MagLev', 'mobiliario', 21000, 6, 2, 1, TRUE, '/assets/audio/clinic/magnetic_hum.mp3', 'mob_maca_terapeutica_levitacao', 'FLOOR', 'LEGENDARY', TRUE),
    ('mob_cristaleira_seculo_xix', 'Cristaleira Imperial Botânica 1880', 'mobiliario', 15000, 5, 2, 1, TRUE, '/assets/audio/clinic/antique_latch.mp3', 'mob_cristaleira_seculo_xix', 'FLOOR', 'LEGENDARY', TRUE),

    -- ------------------------------------------------------------------------
    -- 3.3. Clínica, Diagnóstico & Equipamentos ('clinica' — 13 Itens Exclusivos)
    -- ------------------------------------------------------------------------
    ('cli_ecografo_portatil_tablet', 'Ecógrafo Ultrassom Portátil Wireless', 'clinica', 3600, 2, 1, 1, TRUE, '/assets/audio/clinic/ultrasound_sweep.mp3', 'cli_ecografo_portatil_tablet', 'FLOOR', 'RARE', TRUE),
    ('cli_dermatoscopio_digital', 'Dermatoscópio Digital Polarizado', 'clinica', 3300, 2, 1, 1, TRUE, '/assets/audio/clinic/flash_click.mp3', 'cli_dermatoscopio_digital', 'FLOOR', 'RARE', TRUE),
    ('cli_otoscopio_fibra_optica', 'Painel de Otoscópio Fibra Óptica 4K', 'clinica', 2500, 1, 0, 0, TRUE, '/assets/audio/clinic/optic_on.mp3', 'cli_otoscopio_fibra_optica', 'WALL', 'RARE', TRUE),
    ('cli_balanca_bioimpedancia_pro', 'Bioimpedância Clínica Octapolar', 'clinica', 3800, 3, 1, 1, TRUE, '/assets/audio/clinic/scale_beep.mp3', 'cli_balanca_bioimpedancia_pro', 'FLOOR', 'RARE', TRUE),
    ('cli_foco_cirurgico_teto_led', 'Cúpula Dupla Foco Cirúrgico LED', 'clinica', 3500, 3, 0, 0, TRUE, '/assets/audio/clinic/light_arc.mp3', 'cli_foco_cirurgico_teto_led', 'WALL', 'RARE', TRUE),
    ('cli_espectrometro_massa_mini', 'Mini Espectrômetro de Massa Clínico', 'clinica', 8800, 5, 2, 1, TRUE, '/assets/audio/clinic/spectro_whine.mp3', 'cli_espectrometro_massa_mini', 'FLOOR', 'EPIC', TRUE),
    ('cli_ventilador_pulmonar_ia', 'Ventilador Mecânico Inteligente AI', 'clinica', 7900, 4, 1, 1, TRUE, '/assets/audio/clinic/vent_breathe.mp3', 'cli_ventilador_pulmonar_ia', 'FLOOR', 'EPIC', TRUE),
    ('cli_centrifuga_plasma_rico', 'Centrífuga Bioquímica de Alta Rotação', 'clinica', 5400, 3, 1, 1, TRUE, '/assets/audio/clinic/centrifuge_spin.mp3', 'cli_centrifuga_plasma_rico', 'FLOOR', 'EPIC', TRUE),
    ('cli_endoscopio_flexivel_4k', 'Torre de Vídeo-Endoscopia 4K HDR', 'clinica', 9200, 5, 2, 1, TRUE, '/assets/audio/clinic/endoscope_beep.mp3', 'cli_endoscopio_flexivel_4k', 'FLOOR', 'EPIC', TRUE),
    ('cli_crioablativo_nitrogenio', 'Console de Crioablação Dermatológica', 'clinica', 6700, 4, 1, 1, TRUE, '/assets/audio/clinic/cryo_blast.mp3', 'cli_crioablativo_nitrogenio', 'FLOOR', 'EPIC', TRUE),
    ('cli_ressonancia_3t_compacta', 'Ressonância Magnética 3T com LED RGB', 'clinica', 24000, 6, 3, 2, TRUE, '/assets/audio/clinic/mri_gradient.mp3', 'cli_ressonancia_3t_compacta', 'FLOOR', 'LEGENDARY', TRUE),
    ('cli_robo_cirurgico_quatro_bracos', 'Console Robótico Telecirúrgico 4-Braços', 'clinica', 25000, 6, 2, 2, TRUE, '/assets/audio/clinic/robot_quad.mp3', 'cli_robo_cirurgico_quatro_bracos', 'FLOOR', 'LEGENDARY', TRUE),
    ('cli_camara_hiperbarica_ouro', 'Câmara Hiperbárica Monoplace Dourada', 'clinica', 19500, 6, 3, 1, TRUE, '/assets/audio/clinic/hyperbaric_pressure.mp3', 'cli_camara_hiperbarica_ouro', 'FLOOR', 'LEGENDARY', TRUE),

    -- ------------------------------------------------------------------------
    -- 3.4. Recepção, Conforto, Convivência & Mascotes ('recepcao' — 12 Itens Exclusivos)
    -- ------------------------------------------------------------------------
    ('rec_poltrona_egg_veludo_azul', 'Poltrona Egg em Veludo Azul Marinho', 'recepcao', 2900, 2, 1, 1, FALSE, NULL, 'rec_poltrona_egg_veludo_azul', 'FLOOR', 'RARE', TRUE),
    ('rec_totem_checkin_facial', 'Totem de Recepção com Reconhecimento', 'recepcao', 3400, 3, 1, 1, TRUE, '/assets/audio/clinic/kiosk_ping.mp3', 'rec_totem_checkin_facial', 'FLOOR', 'RARE', TRUE),
    ('rec_fonte_bambu_shishi_odoshi', 'Fonte Shishi-Odoshi Bambu Zen', 'recepcao', 2700, 2, 1, 1, TRUE, '/assets/audio/clinic/bamboo_clack.mp3', 'rec_fonte_bambu_shishi_odoshi', 'FLOOR', 'RARE', TRUE),
    ('rec_vitrola_vinil_terapia', 'Vitrola Vinil Acústica Lo-Fi', 'recepcao', 3100, 2, 1, 1, TRUE, '/assets/audio/clinic/vinyl_scratch.mp3', 'rec_vitrola_vinil_terapia', 'FLOOR', 'RARE', TRUE),
    ('rec_cafeteira_pistao_ouro', 'Cafeteira de Pistão Ouro & Cobre', 'recepcao', 6500, 3, 1, 1, TRUE, '/assets/audio/clinic/piston_steam.mp3', 'rec_cafeteira_pistao_ouro', 'FLOOR', 'EPIC', TRUE),
    ('rec_aquario_parede_jellyfish', 'Aquário de Parede com Águas-Vivas', 'recepcao', 7800, 4, 0, 0, TRUE, '/assets/audio/clinic/jellyfish_glow.mp3', 'rec_aquario_parede_jellyfish', 'WALL', 'EPIC', TRUE),
    ('rec_sofa_curvo_organico', 'Sofá Curvo Ilha Bouclé Areia', 'recepcao', 8500, 4, 3, 2, FALSE, NULL, 'rec_sofa_curvo_organico', 'FLOOR', 'EPIC', TRUE),
    ('rec_jardim_vertical_hidroponico', 'Jardim Vertical Hidropônico Iluminado', 'recepcao', 7100, 4, 0, 0, TRUE, '/assets/audio/clinic/leaf_rustle.mp3', 'rec_jardim_vertical_hidroponico', 'WALL', 'EPIC', TRUE),
    ('rec_mascote_husky_dr_neve', 'Husky Terapêutico Dr. Neve', 'recepcao', 8900, 4, 1, 1, TRUE, '/assets/audio/clinic/husky_howl_soft.mp3', 'rec_mascote_husky_dr_neve', 'FLOOR', 'EPIC', TRUE),
    ('rec_mascote_gato_persa_angoror', 'Gato Persa Branco Dr. Algodão', 'recepcao', 6800, 3, 1, 1, TRUE, '/assets/audio/clinic/purr_gentle.mp3', 'rec_mascote_gato_persa_angoror', 'FLOOR', 'EPIC', TRUE),
    ('rec_aquario_recife_coral_gigante', 'Mega Aquário Recife 360° com Corais', 'recepcao', 20000, 6, 3, 2, TRUE, '/assets/audio/clinic/deep_bubbles.mp3', 'rec_aquario_recife_coral_gigante', 'FLOOR', 'LEGENDARY', TRUE),
    ('rec_harpa_automatica_cristal', 'Harpa Cristalina Autotocável', 'recepcao', 17500, 5, 2, 1, TRUE, '/assets/audio/clinic/harp_strum.mp3', 'rec_harpa_automatica_cristal', 'FLOOR', 'LEGENDARY', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    cost_xp = EXCLUDED.cost_xp,
    min_expansion_level = EXCLUDED.min_expansion_level,
    footprint_x = EXCLUDED.footprint_x,
    footprint_y = EXCLUDED.footprint_y,
    is_interactable = EXCLUDED.is_interactable,
    sound_fx_url = EXCLUDED.sound_fx_url,
    asset_svg_key = EXCLUDED.asset_svg_key,
    placement_type = EXCLUDED.placement_type,
    rarity = EXCLUDED.rarity,
    is_lootbox_exclusive = EXCLUDED.is_lootbox_exclusive;

-- ----------------------------------------------------------------------------
-- 4. Tabela de Auditoria Imutável de Caixas da Sorte (P-094, P-095)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lootbox_opening_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    box_tier VARCHAR(30) NOT NULL,
    cost_xp INT NOT NULL,
    item_id_dropped VARCHAR(50) NOT NULL REFERENCES clinic_items_catalog(id),
    item_rarity VARCHAR(20) NOT NULL,
    is_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
    cashback_xp_awarded INT NOT NULL DEFAULT 0,
    opened_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_lootbox_opening_logs_tier CHECK (box_tier IN ('TIER_1_RESIDENT', 'TIER_2_SPECIALIST', 'TIER_3_CHIEF_OF_STAFF')),
    CONSTRAINT chk_lootbox_opening_logs_cost CHECK (cost_xp >= 0),
    CONSTRAINT chk_lootbox_opening_logs_rarity CHECK (item_rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    CONSTRAINT chk_lootbox_opening_logs_cashback CHECK (cashback_xp_awarded >= 0)
);

-- Índices de Alta Performance para Histórico e Auditoria
CREATE INDEX IF NOT EXISTS idx_lootbox_opening_logs_user_id
    ON lootbox_opening_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_lootbox_opening_logs_opened_at
    ON lootbox_opening_logs (opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_lootbox_opening_logs_user_opened
    ON lootbox_opening_logs (user_id, opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_lootbox_opening_logs_item
    ON lootbox_opening_logs (item_id_dropped);
