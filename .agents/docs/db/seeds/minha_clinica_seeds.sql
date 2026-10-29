-- ============================================================================
-- Seed Script: .agents/docs/db/seeds/minha_clinica_seeds.sql
-- Módulo: Minha Clínica Médica (P-080 a P-086)
-- Conformidade LGPD: Dados 100% sintéticos (@medstudy.local), sem PII real.
-- ============================================================================

INSERT INTO clinic_items_catalog (
    id, name, category, cost_xp, min_expansion_level,
    footprint_x, footprint_y, is_interactable, sound_fx_url, asset_svg_key
) VALUES
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
    ('mesa_scandi', 'Mesa Escandinava de Carvalho com Suculenta', 'mobiliario', 950, 1, 2, 1, FALSE, NULL, 'mesa_scandi'),
    ('mesa_mogno_cafe', 'Mesa de Mogno com Xícara de Café Quente', 'mobiliario', 2200, 2, 2, 1, TRUE, '/assets/audio/clinic/coffee_sip.mp3', 'mesa_mogno_cafe'),
    ('mesa_carrara', 'Mesa Mármore Carrara & Dourado', 'mobiliario', 4800, 4, 2, 1, TRUE, '/assets/audio/clinic/marble_chime.mp3', 'mesa_carrara'),
    ('cadeira_ergonomica', 'Cadeira Operacional Mesh', 'mobiliario', 800, 1, 1, 1, FALSE, NULL, 'cadeira_ergonomica'),
    ('cadeira_presidente_couro', 'Cadeira Presidente Couro Caramelo Capitonê', 'mobiliario', 2600, 3, 1, 1, FALSE, NULL, 'cadeira_presidente_couro'),
    ('pc_ultrawide', 'Estação de Trabalho com Monitor Ultrawide', 'mobiliario', 1600, 2, 1, 1, TRUE, '/assets/audio/clinic/key_click.mp3', 'pc_ultrawide'),
    ('didatico_dr_bones', 'Esqueleto Didático "Dr. Bones"', 'clinica', 1900, 1, 1, 1, TRUE, '/assets/audio/clinic/bones_clack.mp3', 'didatico_dr_bones'),
    ('esteto_ouro_master', 'Estetoscópio Master Ouro em Suporte', 'clinica', 3000, 3, 1, 1, TRUE, '/assets/audio/clinic/heartbeat_soft.mp3', 'esteto_ouro_master'),
    ('monitor_ecg', 'Monitor Cardíaco com Traçado Vivo em Loop', 'clinica', 2100, 2, 1, 1, TRUE, '/assets/audio/clinic/ecg_beep.mp3', 'monitor_ecg'),
    ('usg_fetal_4d', 'Aparelho de Ultrassom 4D com Display Colorido', 'clinica', 3900, 4, 1, 1, TRUE, '/assets/audio/clinic/usg_doppler.mp3', 'usg_fetal_4d'),
    ('negatoscopio_led', 'Negatoscópio Ultra-Slim com Radiografia Iluminada', 'clinica', 1400, 1, 1, 1, TRUE, '/assets/audio/clinic/led_switch.mp3', 'negatoscopio_led'),
    ('estante_harrison', 'Estante Gigante com Tratados Clássicos de Medicina', 'clinica', 1700, 2, 2, 1, FALSE, NULL, 'estante_harrison'),
    ('cafe_espresso_vermelho', 'Máquina de Espresso Gourmet', 'recepcao', 1300, 1, 1, 1, TRUE, '/assets/audio/clinic/espresso_steam.mp3', 'cafe_espresso_vermelho'),
    ('mascote_gato_bisturi', 'Gato "Bisturi"', 'recepcao', 2900, 2, 1, 1, TRUE, '/assets/audio/clinic/cat_purr.mp3', 'mascote_gato_bisturi'),
    ('mascote_cao_caramelo', 'Golden Retriever "Dr. Caramelo"', 'recepcao', 4500, 3, 1, 1, TRUE, '/assets/audio/clinic/dog_tail_wag.mp3', 'mascote_cao_caramelo'),
    ('balcao_recepcao_madeira', 'Balcão de Recepção em Madeira Clara', 'recepcao', 1500, 3, 2, 1, FALSE, NULL, 'balcao_recepcao_madeira'),
    ('bebedouro_galao', 'Bebedouro Retrô de Galão Azul', 'recepcao', 400, 1, 1, 1, TRUE, '/assets/audio/clinic/water_bubble.mp3', 'bebedouro_galao')
ON CONFLICT (id) DO NOTHING;
