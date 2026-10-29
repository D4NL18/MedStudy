-- ============================================================================
-- Seeds: minha-clinica-medica_seeds.sql
-- Domínio: Minha Clínica Médica (Superfícies, Fixação de Parede e Avatar)
-- Governança LGPD: 100% dados sintéticos/fictícios, integridade referencial estrita.
-- ============================================================================

-- 1. Estudantes Fictícios
INSERT INTO users (id, name, email, password, role, is_active, created_at, updated_at)
VALUES 
    ('e1111111-1111-4111-8111-111111111111', 'Beatriz Helena Ramos', 'beatriz.ramos.interna@medstudy.local', '$2a$10$w8.B9qF.fH7jH90.L120OO6y9y3aW5j02Dk14U0N5/9A/6M1Z234', 'USER', TRUE, NOW() - INTERVAL '15 days', NOW()),
    ('e2222222-2222-4222-8222-222222222222', 'Lucas Albuquerque Prado', 'lucas.prado.r1@medstudy.local', '$2a$10$w8.B9qF.fH7jH90.L120OO6y9y3aW5j02Dk14U0N5/9A/6M1Z234', 'USER', TRUE, NOW() - INTERVAL '30 days', NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'Camila Vasconcelos Lima', 'camila.lima.ped@medstudy.local', '$2a$10$w8.B9qF.fH7jH90.L120OO6y9y3aW5j02Dk14U0N5/9A/6M1Z234', 'USER', TRUE, NOW() - INTERVAL '60 days', NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'Rodrigo Mendes Siqueira', 'rodrigo.siqueira.preceptor@medstudy.local', '$2a$10$w8.B9qF.fH7jH90.L120OO6y9y3aW5j02Dk14U0N5/9A/6M1Z234', 'USER', TRUE, NOW() - INTERVAL '120 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Contas de XP e Ofensiva Diária (Dualidade de Saldos P-080, P-081)
INSERT INTO user_xp_accounts (user_id, lifetime_xp, current_xp, current_streak_days, last_study_date, updated_at)
VALUES 
    ('e1111111-1111-4111-8111-111111111111', 850, 450, 5, CURRENT_DATE, NOW()),
    ('e2222222-2222-4222-8222-222222222222', 2800, 1100, 14, CURRENT_DATE, NOW()),
    ('e3333333-3333-4333-8333-333333333333', 6500, 2400, 28, CURRENT_DATE, NOW()),
    ('e4444444-4444-4444-8444-444444444444', 45000, 18500, 65, CURRENT_DATE, NOW())
ON CONFLICT (user_id) DO UPDATE SET 
    lifetime_xp = EXCLUDED.lifetime_xp,
    current_xp = EXCLUDED.current_xp,
    current_streak_days = EXCLUDED.current_streak_days;

-- 3. Clínicas Isométricas com Superfícies Personalizadas (P-082, P-087)
INSERT INTO user_clinics (id, user_id, clinic_name, expansion_level, grid_width, grid_height, theme, wall_theme, floor_theme, created_at, updated_at)
VALUES 
    ('c1111111-1111-4111-8111-111111111111', 'e1111111-1111-4111-8111-111111111111', 'Box de Internato da Beatriz', 1, 4, 4, 'clean_modern', 'wall_clean_white', 'floor_porcelanato_cinza', NOW() - INTERVAL '15 days', NOW()),
    ('c2222222-2222-4222-8222-222222222222', 'e2222222-2222-4222-8222-222222222222', 'Consultório Médico Dr. Lucas', 2, 6, 6, 'clean_modern', 'wall_clean_white', 'floor_porcelanato_cinza', NOW() - INTERVAL '30 days', NOW()),
    ('c3333333-3333-4333-8333-333333333333', 'e3333333-3333-4333-8333-333333333333', 'Espaço Pediátrico Dra. Camila', 3, 8, 8, 'pediatria', 'ped_papel_safari', 'floor_porcelanato_cinza', NOW() - INTERVAL '60 days', NOW()),
    ('c4444444-4444-4444-8444-444444444444', 'e4444444-4444-4444-8444-444444444444', 'Instituto Mendes & Associados', 6, 16, 12, 'clean_modern', 'wall_clean_white', 'floor_porcelanato_cinza', NOW() - INTERVAL '120 days', NOW())
ON CONFLICT (user_id) DO UPDATE SET 
    wall_theme = EXCLUDED.wall_theme,
    floor_theme = EXCLUDED.floor_theme,
    expansion_level = EXCLUDED.expansion_level;

-- 4. Itens Posicionados no Chão e Fixados na Parede (P-084, P-088)
INSERT INTO clinic_placed_items (id, clinic_id, catalog_item_id, grid_x, grid_y, rotation, is_placed, wall_side, wall_tile_index, elevation_z, placed_at)
VALUES 
    -- Beatriz: Box 4x4 com Régua Girafa de Parede
    ('i1111111-0001-4111-8111-000000000001', 'c1111111-1111-4111-8111-111111111111', 'mesa_scandi', 0, 0, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i1111111-0002-4111-8111-000000000002', 'c1111111-1111-4111-8111-111111111111', 'cadeira_ergonomica', 0, 1, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i1111111-0003-4111-8111-000000000003', 'c1111111-1111-4111-8111-111111111111', 'ped_maca_baleia', 2, 0, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i1111111-0004-4111-8111-000000000004', 'c1111111-1111-4111-8111-111111111111', 'ped_regua_girafa', 0, 0, 0, TRUE, 'NW', 2, 45, NOW()),

    -- Lucas: Consultório 6x6 com Negatoscópio de Parede
    ('i2222222-0001-4222-8222-000000000001', 'c2222222-2222-4222-8222-222222222222', 'mesa_mogno_cafe', 1, 1, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i2222222-0002-4222-8222-000000000002', 'c2222222-2222-4222-8222-222222222222', 'cadeira_ergonomica', 1, 2, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i2222222-0003-4222-8222-000000000003', 'c2222222-2222-4222-8222-222222222222', 'pc_ultrawide', 3, 1, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i2222222-0004-4222-8222-000000000004', 'c2222222-2222-4222-8222-222222222222', 'negatoscopio_led', 0, 0, 0, TRUE, 'NE', 3, 50, NOW()),

    -- Camila: Ala Pediátrica 8x8 com Safari Aquarela e Itens Pediátricos
    ('i3333333-0001-4333-8333-000000000001', 'c3333333-3333-4333-8333-333333333333', 'ped_maca_dino', 1, 1, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i3333333-0002-4333-8333-000000000002', 'c3333333-3333-4333-8333-333333333333', 'ped_regua_girafa', 0, 0, 0, TRUE, 'NW', 1, 45, NOW()),
    ('i3333333-0003-4333-8333-000000000003', 'c3333333-3333-4333-8333-333333333333', 'ped_piscina_bolinhas', 4, 4, 0, TRUE, NULL, NULL, NULL, NOW()),
    ('i3333333-0004-4333-8333-000000000004', 'c3333333-3333-4333-8333-333333333333', 'ped_bau_coragem', 3, 1, 0, TRUE, NULL, NULL, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Personagens Médicos Virtuais (P-089)
INSERT INTO user_doctor_avatar (user_id, gender, skin_coat, skin_stethoscope, skin_accessory, avatar_x, avatar_y, updated_at)
VALUES 
    ('e1111111-1111-4111-8111-111111111111', 'FEMALE', 'coat_intern_white', 'steth_classic_black', 'acc_none', 1, 1, NOW()),
    ('e2222222-2222-4222-8222-222222222222', 'MALE', 'coat_scrubs_navy', 'steth_cardio_burgundy', 'acc_none', 2, 2, NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'FEMALE', 'coat_pediatric_dino', 'ped_steth_elefante', 'acc_ped_gorro_colorido', 2, 3, NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'MALE', 'coat_executive_doc', 'steth_gold_master', 'acc_prontuario_clipboard', 4, 3, NOW())
ON CONFLICT (user_id) DO UPDATE SET 
    gender = EXCLUDED.gender,
    skin_coat = EXCLUDED.skin_coat,
    skin_stethoscope = EXCLUDED.skin_stethoscope,
    skin_accessory = EXCLUDED.skin_accessory;

-- 6. Guarda-Roupa de Skins Desbloqueadas (P-087, P-089)
INSERT INTO user_unlocked_skins (user_id, skin_slot, skin_id, unlocked_at)
VALUES 
    -- Dra. Beatriz
    ('e1111111-1111-4111-8111-111111111111', 'surface_wall', 'wall_clean_white', NOW()),
    ('e1111111-1111-4111-8111-111111111111', 'surface_floor', 'floor_porcelanato_cinza', NOW()),
    ('e1111111-1111-4111-8111-111111111111', 'coat', 'coat_intern_white', NOW()),
    ('e1111111-1111-4111-8111-111111111111', 'stethoscope', 'steth_classic_black', NOW()),
    ('e1111111-1111-4111-8111-111111111111', 'stethoscope', 'steth_none', NOW()),
    ('e1111111-1111-4111-8111-111111111111', 'accessory', 'acc_none', NOW()),

    -- Dr. Lucas
    ('e2222222-2222-4222-8222-222222222222', 'surface_wall', 'wall_clean_white', NOW()),
    ('e2222222-2222-4222-8222-222222222222', 'surface_floor', 'floor_porcelanato_cinza', NOW()),
    ('e2222222-2222-4222-8222-222222222222', 'coat', 'coat_intern_white', NOW()),
    ('e2222222-2222-4222-8222-222222222222', 'coat', 'coat_scrubs_navy', NOW() - INTERVAL '10 days'),
    ('e2222222-2222-4222-8222-222222222222', 'stethoscope', 'steth_classic_black', NOW()),
    ('e2222222-2222-4222-8222-222222222222', 'stethoscope', 'steth_cardio_burgundy', NOW() - INTERVAL '8 days'),
    ('e2222222-2222-4222-8222-222222222222', 'accessory', 'acc_none', NOW()),

    -- Dra. Camila
    ('e3333333-3333-4333-8333-333333333333', 'surface_wall', 'wall_clean_white', NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'surface_wall', 'ped_papel_safari', NOW() - INTERVAL '20 days'),
    ('e3333333-3333-4333-8333-333333333333', 'surface_floor', 'floor_porcelanato_cinza', NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'coat', 'coat_intern_white', NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'coat', 'coat_pediatric_dino', NOW() - INTERVAL '15 days'),
    ('e3333333-3333-4333-8333-333333333333', 'stethoscope', 'steth_classic_black', NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'stethoscope', 'ped_steth_elefante', NOW() - INTERVAL '12 days'),
    ('e3333333-3333-4333-8333-333333333333', 'accessory', 'acc_none', NOW()),
    ('e3333333-3333-4333-8333-333333333333', 'accessory', 'acc_ped_gorro_colorido', NOW() - INTERVAL '5 days'),

    -- Dr. Rodrigo
    ('e4444444-4444-4444-8444-444444444444', 'surface_wall', 'wall_clean_white', NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'surface_floor', 'floor_porcelanato_cinza', NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'coat', 'coat_intern_white', NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'coat', 'coat_executive_doc', NOW() - INTERVAL '40 days'),
    ('e4444444-4444-4444-8444-444444444444', 'stethoscope', 'steth_classic_black', NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'stethoscope', 'steth_gold_master', NOW() - INTERVAL '30 days'),
    ('e4444444-4444-4444-8444-444444444444', 'accessory', 'acc_none', NOW()),
    ('e4444444-4444-4444-8444-444444444444', 'accessory', 'acc_prontuario_clipboard', NOW() - INTERVAL '25 days')
ON CONFLICT (user_id, skin_id) DO NOTHING;

-- 7. Transações Contábeis de XP (P-080)
INSERT INTO user_xp_transactions (user_id, amount, balance_after, source, description, created_at)
VALUES 
    ('e2222222-2222-4222-8222-222222222222', -500, 1800, 'SKIN_PURCHASE', 'Aquisição de Skin: Scrub Azul Marinho Plantão', NOW() - INTERVAL '10 days'),
    ('e2222222-2222-4222-8222-222222222222', -700, 1100, 'SKIN_PURCHASE', 'Aquisição de Skin: Esteto Cardiológico Vinho', NOW() - INTERVAL '8 days'),
    ('e3333333-3333-4333-8333-333333333333', -850, 4950, 'SURFACE_PURCHASE', 'Aquisição de Revestimento: Papel Safari Aquarela', NOW() - INTERVAL '20 days'),
    ('e3333333-3333-4333-8333-333333333333', -1200, 3750, 'SKIN_PURCHASE', 'Aquisição de Skin: Jaleco Estampado Pediatria', NOW() - INTERVAL '15 days'),
    ('e3333333-3333-4333-8333-333333333333', -950, 2800, 'SKIN_PURCHASE', 'Aquisição de Skin: Esteto Pediátrico Elefante', NOW() - INTERVAL '12 days'),
    ('e3333333-3333-4333-8333-333333333333', -400, 2400, 'SKIN_PURCHASE', 'Aquisição de Skin: Gorro Cirúrgico Safari', NOW() - INTERVAL '5 days');
