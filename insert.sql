INSERT INTO flashcards (id, user_id, grande_area, tema, proxima_revisao, frente, verso, created_at, updated_at, intervalo_atual, ease_factor, dificuldade_ultima, consecutive_hard_count) 
SELECT 
    gen_random_uuid(), 
    '550e8400-e29b-41d4-a716-446655440000', 
    'CLINICA_MEDICA', 
    'Tema Atrasado ' || i, 
    CURRENT_DATE - ((i % 30) + 1) * INTERVAL '1 day', 
    '{"text": "Frente"}'::jsonb, 
    '{"text": "Verso"}'::jsonb, 
    CURRENT_DATE - INTERVAL '60 days', 
    CURRENT_DATE - INTERVAL '60 days', 
    1, 
    2.5, 
    'BOM', 
    0 
FROM generate_series(1, 100) AS s(i);
