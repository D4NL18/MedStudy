DO $$
DECLARE
    v_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
    v_bounty_id UUID;
    v_card2_id UUID;
    v_card3_id UUID;
BEGIN
    -- 1. Mover todos os cards do admin para o futuro e zerar ultima_revisao
    UPDATE flashcards
    SET proxima_revisao = '2026-10-25',
        ultima_revisao = '2026-10-10',
        consecutive_hard_count = 0,
        ease_factor = 2.5
    WHERE user_id = v_user_id;

    -- 2. Selecionar 3 cards para hoje (1 de Clínica, 1 de Cirurgia, 1 de Pediatria)
    SELECT id INTO v_bounty_id FROM flashcards WHERE user_id = v_user_id AND grande_area ILIKE '%Clinica%' LIMIT 1;
    SELECT id INTO v_card2_id FROM flashcards WHERE user_id = v_user_id AND grande_area ILIKE '%Cirurgia%' LIMIT 1;
    SELECT id INTO v_card3_id FROM flashcards WHERE user_id = v_user_id AND grande_area ILIKE '%Pediatria%' LIMIT 1;

    -- 3. Configurar Card 1 como BOUNTY para hoje (Ease < 1.7 e consecutive_hard_count >= 2)
    UPDATE flashcards
    SET proxima_revisao = '2026-10-14',
        ultima_revisao = NULL,
        consecutive_hard_count = 3,
        ease_factor = 1.3,
        dificuldade_ultima = 'HARD',
        created_at = '2026-10-10 10:00:00'
    WHERE id = v_bounty_id;

    -- 4. Configurar Card 2 como NORMAL para hoje
    UPDATE flashcards
    SET proxima_revisao = '2026-10-14',
        ultima_revisao = NULL,
        consecutive_hard_count = 0,
        ease_factor = 2.5,
        dificuldade_ultima = 'MEDIUM',
        created_at = '2026-10-10 10:00:00'
    WHERE id = v_card2_id;

    -- 5. Configurar Card 3 como NORMAL para hoje
    UPDATE flashcards
    SET proxima_revisao = '2026-10-14',
        ultima_revisao = NULL,
        consecutive_hard_count = 0,
        ease_factor = 2.5,
        dificuldade_ultima = 'EASY',
        created_at = '2026-10-10 10:00:00'
    WHERE id = v_card3_id;
END $$;
