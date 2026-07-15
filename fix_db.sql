UPDATE study_sessions SET data_proxima_revisao = CURRENT_DATE - INTERVAL '1 day' WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND revisao_concluida = false;
UPDATE flashcards SET proxima_revisao = CURRENT_DATE - INTERVAL '1 day' WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
