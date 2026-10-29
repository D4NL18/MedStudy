-- ============================================================================
-- Migration: V27__expand_clinic_catalog_to_104_items.sql
-- Feature: Minha Clínica Médica (Megacatálogo Expandido com 104 Itens Oficiais)
-- Regras de Negócio: P-092 (US-10)
-- Governança DBA: Operação 100% aditiva, idempotente e segura contra perda de dados.
-- Totaliza 104 itens no catálogo (26 por categoria: pediatria, mobiliario, clinica, recepcao).
-- ============================================================================

INSERT INTO clinic_items_catalog (
    id, name, category, cost_xp, min_expansion_level,
    footprint_x, footprint_y, is_interactable, sound_fx_url, asset_svg_key, placement_type
) VALUES
    -- ------------------------------------------------------------------------
    -- 1. Ala Pediátrica & Hebiatria ('pediatria' — 16 Novos Itens + 10 Anteriores = 26 Itens)
    -- ------------------------------------------------------------------------
    ('ped_tapete_amarelinha', 'Tapete Amarelinha Sensorial', 'pediatria', 750, 1, 2, 1, FALSE, NULL, 'ped_tapete_amarelinha', 'FLOOR'),
    ('ped_mesa_desenho_infantil', 'Mesinha de Atividades com Giz', 'pediatria', 1250, 1, 2, 1, TRUE, '/assets/audio/clinic/wood_tap.mp3', 'ped_mesa_desenho_infantil', 'FLOOR'),
    ('ped_cadeirinha_sapinho', 'Cadeira Infantil Sapinho', 'pediatria', 450, 1, 1, 1, FALSE, NULL, 'ped_cadeirinha_sapinho', 'FLOOR'),
    ('ped_oftalmo_figuras_lea', 'Tabela Oftalmológica Infantil LEA', 'pediatria', 800, 1, 0, 0, TRUE, '/assets/audio/clinic/chime.mp3', 'ped_oftalmo_figuras_lea', 'WALL'),
    ('ped_mobile_planetas', 'Móbile Teto Sistema Solar', 'pediatria', 1350, 2, 0, 0, TRUE, '/assets/audio/clinic/mobile_spin.mp3', 'ped_mobile_planetas', 'WALL'),
    ('ped_otoscopio_pinguim', 'Otoscópio Pediátrico Pinguim', 'pediatria', 950, 2, 1, 1, TRUE, '/assets/audio/clinic/click.mp3', 'ped_otoscopio_pinguim', 'FLOOR'),
    ('ped_carrinho_vacina_sorriso', 'Carrinho de Vacinação "Sem Dor"', 'pediatria', 1950, 2, 1, 1, TRUE, '/assets/audio/clinic/cart_roll.mp3', 'ped_carrinho_vacina_sorriso', 'FLOOR'),
    ('ped_pelucia_microbios', 'Cesto de Pelúcias de Micróbios Fofos', 'pediatria', 1100, 2, 1, 1, TRUE, '/assets/audio/clinic/squeak.mp3', 'ped_pelucia_microbios', 'FLOOR'),
    ('ped_painel_engrenagens', 'Painel Sensorial de Parede', 'pediatria', 1650, 3, 0, 0, TRUE, '/assets/audio/clinic/gears.mp3', 'ped_painel_engrenagens', 'WALL'),
    ('ped_escorregador_elefante', 'Mini Escorregador Tromba de Elefante', 'pediatria', 3100, 3, 2, 1, TRUE, '/assets/audio/clinic/slide.mp3', 'ped_escorregador_elefante', 'FLOOR'),
    ('ped_balanca_digital_aquecida', 'Balança Pediátrica Aquecida', 'pediatria', 2100, 3, 1, 1, FALSE, NULL, 'ped_balanca_digital_aquecida', 'FLOOR'),
    ('ped_berco_aquecido', 'Berço Aquecido Neonatal', 'pediatria', 4600, 4, 2, 1, TRUE, '/assets/audio/clinic/hum.mp3', 'ped_berco_aquecido', 'FLOOR'),
    ('ped_fototerapia_led', 'Aparelho de Fototerapia Bili-LED', 'pediatria', 5200, 4, 1, 1, TRUE, '/assets/audio/clinic/light_switch.mp3', 'ped_fototerapia_led', 'FLOOR'),
    ('ped_circuito_espuma', 'Circuito de Psicomotricidade Infantil', 'pediatria', 4900, 5, 2, 2, TRUE, '/assets/audio/clinic/bounce.mp3', 'ped_circuito_espuma', 'FLOOR'),
    ('ped_incubadora_neonatal', 'Incubadora Neonatal Tecnológica', 'pediatria', 7800, 5, 2, 1, TRUE, '/assets/audio/clinic/incubator_beep.mp3', 'ped_incubadora_neonatal', 'FLOOR'),
    ('ped_castelo_faz_de_conta', 'Castelo Lúdico com Miniclínica', 'pediatria', 9500, 6, 2, 2, TRUE, '/assets/audio/clinic/fanfare.mp3', 'ped_castelo_faz_de_conta', 'FLOOR'),

    -- ------------------------------------------------------------------------
    -- 2. Mobiliário Médico & Ergonomia ('mobiliario' — 20 Novos Itens + 6 Anteriores = 26 Itens)
    -- ------------------------------------------------------------------------
    ('maca_clinica_antisseptica', 'Maca de Exame Clínico com Lençol', 'mobiliario', 900, 1, 2, 1, FALSE, NULL, 'maca_clinica_antisseptica', 'FLOOR'),
    ('mocho_giratorio_clinico', 'Mocho Giratório com Encosto', 'mobiliario', 550, 1, 1, 1, FALSE, NULL, 'mocho_giratorio_clinico', 'FLOOR'),
    ('biombo_triplo_privacidade', 'Biombo Hospitalar Triplo', 'mobiliario', 700, 1, 2, 1, TRUE, '/assets/audio/clinic/rustle.mp3', 'biombo_triplo_privacidade', 'FLOOR'),
    ('escada_dois_degraus', 'Escadinha Clínica Antiderrapante', 'mobiliario', 350, 1, 1, 1, FALSE, NULL, 'escada_dois_degraus', 'FLOOR'),
    ('suporte_soro_cromado', 'Suporte de Soro com 4 Ganchos', 'mobiliario', 600, 1, 1, 1, FALSE, NULL, 'suporte_soro_cromado', 'FLOOR'),
    ('mesa_auxiliar_inox', 'Carrinho Auxiliar em Aço Inox', 'mobiliario', 850, 1, 1, 1, FALSE, NULL, 'mesa_auxiliar_inox', 'FLOOR'),
    ('armario_vitrine_remedios', 'Armário Vitrine com Portas de Vidro', 'mobiliario', 1850, 2, 1, 1, TRUE, '/assets/audio/clinic/glass_click.mp3', 'armario_vitrine_remedios', 'FLOOR'),
    ('foco_clinico_led', 'Foco Clínico Flexível de LED', 'mobiliario', 1150, 2, 1, 1, TRUE, '/assets/audio/clinic/led_switch.mp3', 'foco_clinico_led', 'FLOOR'),
    ('gaveteiro_modular_madeira', 'Gaveteiro Volante de Carvalho', 'mobiliario', 1300, 2, 1, 1, FALSE, NULL, 'gaveteiro_modular_madeira', 'FLOOR'),
    ('poltrona_reclinavel_coleta', 'Poltrona Reclinável de Hidratação', 'mobiliario', 2300, 2, 1, 1, TRUE, '/assets/audio/clinic/recline.mp3', 'poltrona_reclinavel_coleta', 'FLOOR'),
    ('mesa_atendimento_em_l', 'Mesa Executiva em L', 'mobiliario', 2900, 3, 2, 2, FALSE, NULL, 'mesa_atendimento_em_l', 'FLOOR'),
    ('estante_modular_nichos', 'Estante de Parede com Nichos LED', 'mobiliario', 1750, 3, 0, 0, FALSE, NULL, 'estante_modular_nichos', 'WALL'),
    ('divisoria_vidro_acustica', 'Painel Divisório Vidro Canelado', 'mobiliario', 2400, 3, 2, 1, FALSE, NULL, 'divisoria_vidro_acustica', 'FLOOR'),
    ('estacao_triagem_enfermagem', 'Bancada Completa de Triagem', 'mobiliario', 3400, 3, 2, 1, TRUE, '/assets/audio/clinic/printer.mp3', 'estacao_triagem_enfermagem', 'FLOOR'),
    ('armario_vestiario_medico', 'Armário Vestiário com Espelho', 'mobiliario', 2800, 4, 1, 1, TRUE, '/assets/audio/clinic/locker.mp3', 'armario_vestiario_medico', 'FLOOR'),
    ('maca_gineco_eletrica', 'Maca Gineco-Obstétrica Motorizada', 'mobiliario', 5400, 4, 2, 1, TRUE, '/assets/audio/clinic/motor.mp3', 'maca_gineco_eletrica', 'FLOOR'),
    ('mesa_reuniao_clinica', 'Mesa Oval de Discussão Clínica', 'mobiliario', 4900, 5, 2, 2, FALSE, NULL, 'mesa_reuniao_clinica', 'FLOOR'),
    ('estacao_telemedicina', 'Estação Completa de Telemedicina', 'mobiliario', 6200, 5, 2, 1, TRUE, '/assets/audio/clinic/video_call.mp3', 'estacao_telemedicina', 'FLOOR'),
    ('bancada_laboratorial_ilha', 'Ilha Laboratorial Central Inox', 'mobiliario', 8200, 5, 3, 1, TRUE, '/assets/audio/clinic/lab_centrifuge.mp3', 'bancada_laboratorial_ilha', 'FLOOR'),
    ('conjunto_diretoria_nogal', 'Conjunto Presidencial Nogal & Bronze', 'mobiliario', 12000, 6, 3, 2, TRUE, '/assets/audio/clinic/leather_creak.mp3', 'conjunto_diretoria_nogal', 'FLOOR'),

    -- ------------------------------------------------------------------------
    -- 3. Clínica, Diagnóstico & Equipamentos ('clinica' — 20 Novos Itens + 6 Anteriores = 26 Itens)
    -- ------------------------------------------------------------------------
    ('esfigmo_pedestal', 'Esfigmomanômetro em Pedestal Móvel', 'clinica', 800, 1, 1, 1, TRUE, '/assets/audio/clinic/cuff_pump.mp3', 'esfigmo_pedestal', 'FLOOR'),
    ('tabela_snellen_iluminada', 'Tabela de Snellen Iluminada', 'clinica', 750, 1, 0, 0, TRUE, '/assets/audio/clinic/light_switch.mp3', 'tabela_snellen_iluminada', 'WALL'),
    ('conjunto_diagnostico_parede', 'Otoscópio & Oftalmoscópio de Parede', 'clinica', 1200, 1, 0, 0, TRUE, '/assets/audio/clinic/click.mp3', 'conjunto_diagnostico_parede', 'WALL'),
    ('estojo_laringoscopio', 'Estojo de Laringoscópio Inox', 'clinica', 1050, 1, 1, 1, TRUE, '/assets/audio/clinic/metal_latch.mp3', 'estojo_laringoscopio', 'FLOOR'),
    ('diploma_crm_moldura_ouro', 'Diploma de Graduação Médica Ouro', 'clinica', 950, 1, 0, 0, TRUE, '/assets/audio/clinic/chime.mp3', 'diploma_crm_moldura_ouro', 'WALL'),
    ('estadiometro_compacto', 'Estadiômetro de Parede em Alumínio', 'clinica', 850, 1, 0, 0, TRUE, '/assets/audio/clinic/slide.mp3', 'estadiometro_compacto', 'WALL'),
    ('desfibrilador_dea_parede', 'Desfibrilador DEA em Caixa Vermelha', 'clinica', 2500, 2, 0, 0, TRUE, '/assets/audio/clinic/dea_prompt.mp3', 'desfibrilador_dea_parede', 'WALL'),
    ('bipap_ventilador', 'Aparelho de Ventilação BiPAP', 'clinica', 2400, 2, 1, 1, TRUE, '/assets/audio/clinic/breathe.mp3', 'bipap_ventilador', 'FLOOR'),
    ('aspirador_cirurgico_movel', 'Aspirador Cirúrgico com Frascos', 'clinica', 1650, 2, 1, 1, TRUE, '/assets/audio/clinic/suction.mp3', 'aspirador_cirurgico_movel', 'FLOOR'),
    ('carrinho_parada_cardiorresp', 'Carrinho de Parada Emergencial', 'clinica', 3100, 2, 1, 1, TRUE, '/assets/audio/clinic/siren_short.mp3', 'carrinho_parada_cardiorresp', 'FLOOR'),
    ('microscopio_optico_binoc', 'Microscópio Óptico Binocular', 'clinica', 2800, 3, 1, 1, TRUE, '/assets/audio/clinic/focus_click.mp3', 'microscopio_optico_binoc', 'FLOOR'),
    ('eletrocardiografo_digital', 'Eletrocardiógrafo de 12 Canais', 'clinica', 3200, 3, 1, 1, TRUE, '/assets/audio/clinic/paper_print.mp3', 'eletrocardiografo_digital', 'FLOOR'),
    ('autoclave_esterilizacao', 'Autoclave Hospitalar em Inox', 'clinica', 2700, 3, 1, 1, TRUE, '/assets/audio/clinic/steam_hiss.mp3', 'autoclave_esterilizacao', 'FLOOR'),
    ('torre_videolaparoscopia', 'Torre Cirúrgica de Vídeo-Laparoscopia', 'clinica', 5800, 4, 2, 1, TRUE, '/assets/audio/clinic/laparo_beep.mp3', 'torre_videolaparoscopia', 'FLOOR'),
    ('bomba_infusao_seringa', 'Estação de Bombas de Infusão', 'clinica', 4200, 4, 1, 1, TRUE, '/assets/audio/clinic/infusion_beep.mp3', 'bomba_infusao_seringa', 'FLOOR'),
    ('tomografo_extremidades', 'Mini Tomógrafo Cone Beam', 'clinica', 8500, 5, 2, 2, TRUE, '/assets/audio/clinic/ct_whirr.mp3', 'tomografo_extremidades', 'FLOOR'),
    ('ressonancia_simulador', 'Simulador Compacto de Ressonância', 'clinica', 10500, 5, 3, 2, TRUE, '/assets/audio/clinic/mri_thump.mp3', 'ressonancia_simulador', 'FLOOR'),
    ('arco_cirurgico_fluorosc', 'Arco Cirúrgico em C Digital', 'clinica', 9200, 5, 2, 2, TRUE, '/assets/audio/clinic/fluoroscopy.mp3', 'arco_cirurgico_fluorosc', 'FLOOR'),
    ('robo_cirurgico_console', 'Console Master de Cirurgia Robótica', 'clinica', 15000, 6, 2, 2, TRUE, '/assets/audio/clinic/robot_servo.mp3', 'robo_cirurgico_console', 'FLOOR'),
    ('tanque_criogenico_celulas', 'Tanque de Nitrogênio Criogênico', 'clinica', 11000, 6, 1, 1, TRUE, '/assets/audio/clinic/cryo_release.mp3', 'tanque_criogenico_celulas', 'FLOOR'),

    -- ------------------------------------------------------------------------
    -- 4. Recepção, Conforto, Convivência & Mascotes ('recepcao' — 21 Novos Itens + 5 Anteriores = 26 Itens)
    -- ------------------------------------------------------------------------
    ('longarina_espera_confort', 'Longarina de Três Assentos Tecido', 'recepcao', 850, 1, 2, 1, FALSE, NULL, 'longarina_espera_confort', 'FLOOR'),
    ('revisteiro_acrilico', 'Revisteiro com Periódicos Médicos', 'recepcao', 450, 1, 1, 1, TRUE, '/assets/audio/clinic/page_flip.mp3', 'revisteiro_acrilico', 'FLOOR'),
    ('planta_costela_adao', 'Vaso com Planta Costela-de-Adão', 'recepcao', 600, 1, 1, 1, FALSE, NULL, 'planta_costela_adao', 'FLOOR'),
    ('dispenser_alcool_totem', 'Totem de Álcool em Gel a Pedal', 'recepcao', 350, 1, 1, 1, TRUE, '/assets/audio/clinic/pump.mp3', 'dispenser_alcool_totem', 'FLOOR'),
    ('relogio_parede_minimal', 'Relógio de Parede Minimalista', 'recepcao', 500, 1, 0, 0, FALSE, NULL, 'relogio_parede_minimal', 'WALL'),
    ('quadro_juramento_hipocr', 'Quadro Juramento de Hipócrates', 'recepcao', 800, 1, 0, 0, TRUE, '/assets/audio/clinic/chime.mp3', 'quadro_juramento_hipocr', 'WALL'),
    ('tv_sala_espera_painel', 'Smart TV de Espera com Senhas', 'recepcao', 1800, 2, 0, 0, TRUE, '/assets/audio/clinic/tv_ding.mp3', 'tv_sala_espera_painel', 'WALL'),
    ('poltrona_boucle_offwhite', 'Poltrona Acolhedora Tecido Bouclé', 'recepcao', 1450, 2, 1, 1, TRUE, '/assets/audio/clinic/cushion.mp3', 'poltrona_boucle_offwhite', 'FLOOR'),
    ('luminaria_arco_latonada', 'Luminária de Chão em Arco Dourado', 'recepcao', 1250, 2, 1, 1, TRUE, '/assets/audio/clinic/lamp_click.mp3', 'luminaria_arco_latonada', 'FLOOR'),
    ('aparador_cha_biscoitos', 'Aparador Buffet Café & Biscoitos', 'recepcao', 1600, 2, 2, 1, TRUE, '/assets/audio/clinic/cup_clink.mp3', 'aparador_cha_biscoitos', 'FLOOR'),
    ('mascote_calopsita_poleiro', 'Calopsita Semiologista no Poleiro', 'recepcao', 2700, 2, 1, 1, TRUE, '/assets/audio/clinic/bird_whistle.mp3', 'mascote_calopsita_poleiro', 'FLOOR'),
    ('aquario_marinho_coral', 'Aquário Panorâmico com Corais Vivos', 'recepcao', 3600, 3, 2, 1, TRUE, '/assets/audio/clinic/bubbles.mp3', 'aquario_marinho_coral', 'FLOOR'),
    ('jardim_inverno_bambu', 'Jardim de Inverno com Bambu Mossô', 'recepcao', 2800, 3, 2, 1, FALSE, NULL, 'jardim_inverno_bambu', 'FLOOR'),
    ('fonte_agua_pedra_zen', 'Fonte Zen em Pedra Natural', 'recepcao', 2200, 3, 1, 1, TRUE, '/assets/audio/clinic/water_stream.mp3', 'fonte_agua_pedra_zen', 'FLOOR'),
    ('cafeteira_moedor_graos', 'Máquina Profissional Grãos Moídos', 'recepcao', 3200, 3, 1, 1, TRUE, '/assets/audio/clinic/grinder.mp3', 'cafeteira_moedor_graos', 'FLOOR'),
    ('frigobar_retro_turquesa', 'Frigobar Retrô Turquesa com Sucos', 'recepcao', 2100, 3, 1, 1, TRUE, '/assets/audio/clinic/fridge_open.mp3', 'frigobar_retro_turquesa', 'FLOOR'),
    ('sofa_chesterfield_couro', 'Sofá Chesterfield em Couro Conhaque', 'recepcao', 4800, 4, 3, 1, FALSE, NULL, 'sofa_chesterfield_couro', 'FLOOR'),
    ('lareira_ecologica_etanol', 'Lareira Ecológica a Bioetanol', 'recepcao', 4200, 4, 2, 1, TRUE, '/assets/audio/clinic/fire_crackle.mp3', 'lareira_ecologica_etanol', 'FLOOR'),
    ('poltrona_massagem_zero_g', 'Poltrona de Massagem Gravidade Zero', 'recepcao', 6500, 4, 1, 1, TRUE, '/assets/audio/clinic/massage_hum.mp3', 'poltrona_massagem_zero_g', 'FLOOR'),
    ('piano_cauda_lounge', 'Piano de Meia-Cauda Laqueado Preto', 'recepcao', 9800, 5, 2, 2, TRUE, '/assets/audio/clinic/piano_chord.mp3', 'piano_cauda_lounge', 'FLOOR'),
    ('mascote_coruja_atena', 'Coruja Buraqueira "Atena"', 'recepcao', 8500, 6, 1, 1, TRUE, '/assets/audio/clinic/owl_hoot.mp3', 'mascote_coruja_atena', 'FLOOR')
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
    placement_type = EXCLUDED.placement_type;
