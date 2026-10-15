-- Script de Limpeza e Repopulação Realista para admin@medstudy.com
DO $$
DECLARE
    v_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- 1. LIMPAR DADOS ANTERIORES DO ADMIN
    DELETE FROM streak_repairs WHERE user_id = v_user_id;
    DELETE FROM user_badges WHERE user_id = v_user_id;
    DELETE FROM flashcards WHERE user_id = v_user_id;
    DELETE FROM study_sessions WHERE user_id = v_user_id;
    DELETE FROM lessons WHERE user_id = v_user_id;
    DELETE FROM simulados WHERE user_id = v_user_id;

    -- 2. POPULAR AULAS (LESSONS) DISTRIBUÍDAS PELAS 5 GRANDES ÁREAS
    -- Clínica Médica (9/10 assistidas -> 90%)
    INSERT INTO lessons (id, user_id, grande_area, tema, prioridade, aula_assistida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Insuficiência Cardíaca Congestiva (ICC)', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Hipertensão Arterial Sistêmica e Crise Hipertensiva', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Diabetes Mellitus: Cetoacidose e Estado Hiperosmolar', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Pneumonia Adquirida na Comunidade (PAC)', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Insuficiência Renal Aguda e Glomerulonefrites', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Acidente Vascular Cerebral Isquêmico e Hemorrágico', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Síndrome Coronariana Aguda com e sem Supra de ST', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Distúrbios Eletrolíticos: Sódio e Potássio', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Hemorragia Digestiva Alta e Baixa', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Artrite Reumatoide e Lúpus Eritematoso Sistêmico', 'BAIXA', false, now(), now());

    -- Cirurgia Geral (8/10 assistidas -> 80%)
    INSERT INTO lessons (id, user_id, grande_area, tema, prioridade, aula_assistida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Abdome Agudo Inflamatório: Apendicite Aguda', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Abdome Agudo Obstrutivo e Isquêmico', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Trauma Abdominal e Pélvico (ATLS 10ª Ed)', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Doenças das Vias Biliares: Litíase e Colecistite', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Hérnias Inguinais e da Parede Abdominal', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Queimaduras e Reposição Volêmica (Parkland)', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Nódulo Tireoidiano e Câncer de Tireoide', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Pancreatite Aguda: Critérios de Ranson e Balthazar', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Câncer Gástrico e Colorretal', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Cicatrização e Fios de Sutura', 'BAIXA', false, now(), now());

    -- Pediatria (5/10 assistidas -> 50%)
    INSERT INTO lessons (id, user_id, grande_area, tema, prioridade, aula_assistida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Reanimação Neonatal em Sala de Parto (SBP)', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Puericultura e Marcos do Desenvolvimento Neuropsicomotor', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Bronquiolite Viral Aguda e Asma na Infância', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Doenças Exantemáticas: Sarampo, Varicela e Escarlatina', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Aleitamento Materno e Desnutrição', 'MEDIA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Vacinação e Calendário do PNI', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Infecção do Trato Urinário na Infância', 'MEDIA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Convulsão Febril e Epilepsias Infantis', 'BAIXA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Maus-Tratos e Abuso na Criança', 'BAIXA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Cardiopatias Congênitas Cianogênicas e Acianogênicas', 'MEDIA', false, now(), now());

    -- Ginecologia e Obstetrícia (3/10 assistidas -> 30%)
    INSERT INTO lessons (id, user_id, grande_area, tema, prioridade, aula_assistida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Assistência Pré-Natal e Modificações Fisiológicas da Gravidez', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Síndromes Hipertensivas da Gestação e Pré-Eclâmpsia', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Hemorragias da Primeira Metade: Abortamento, Ectópica e Mola', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Hemorragias da Segunda Metade: DPP e Placenta Prévia', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Mecanismo de Parto e Partograma', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Infecções Sexualmente Transmissíveis e Úlceras Genitais', 'MEDIA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Câncer de Colo Uterino e Lesões Precursoras', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Síndrome dos Ovários Policísticos (SOP) e Amenorreia', 'MEDIA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Climatério e Terapia de Reposição Hormonal', 'MEDIA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Endometriose e Dor Pélvica Crônica', 'BAIXA', false, now(), now());

    -- Medicina Preventiva (2/10 assistidas -> 20%)
    INSERT INTO lessons (id, user_id, grande_area, tema, prioridade, aula_assistida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Princípios e Diretrizes do Sistema Único de Saúde (SUS)', 'DIAMANTE', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Atenção Primária à Saúde e Estratégia de Saúde da Família', 'ALTA', true, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Estudos Epidemiológicos: Coorte, Caso-Controle e Ensaio Clínico', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Medidas de Associação: Risco Relativo, Odds Ratio e NNT', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Vigilância Epidemiológica e Doenças de Notificação Compulsória', 'ALTA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Indicadores de Saúde: Mortalidade Infantil e Materna', 'MEDIA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Financiamento do SUS e Legislação (Leis 8.080 e 8.142)', 'MEDIA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Bioética Médica e Código de Ética do CFM', 'BAIXA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Saúde do Trabalhador e Acidentes de Trabalho (CAT)', 'BAIXA', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Transição Demográfica e Epidemiológica no Brasil', 'BAIXA', false, now(), now());

    -- 3. POPULAR SESSÕES DE QUESTÕES (STUDY_SESSIONS)
    -- As datas são configuradas para criar um Streak de 4 dias terminando 2 dias atrás
    -- (provocando a quebra recente ontem e acionando o Streak Repair no Dashboard!)
    
    -- Clínica Médica (100 questões, 98 corretas -> 98% acerto)
    INSERT INTO study_sessions (id, user_id, grande_area, tema, data_sessao, qts_feitas, qts_corretas, data_proxima_revisao, revisao_concluida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Cardiologia e Emergências', CURRENT_DATE - INTERVAL '2 days', 50, 49, CURRENT_DATE + INTERVAL '7 days', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Clínica Médica', 'Pneumologia e Terapia Intensiva', CURRENT_DATE - INTERVAL '3 days', 50, 49, CURRENT_DATE + INTERVAL '7 days', false, now(), now());

    -- Cirurgia Geral (80 questões, 64 corretas -> 80% acerto)
    INSERT INTO study_sessions (id, user_id, grande_area, tema, data_sessao, qts_feitas, qts_corretas, data_proxima_revisao, revisao_concluida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Trauma e Vias Biliares', CURRENT_DATE - INTERVAL '4 days', 40, 32, CURRENT_DATE + INTERVAL '5 days', false, now(), now()),
    (gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Abdome Agudo e Hérnias', CURRENT_DATE - INTERVAL '5 days', 40, 32, CURRENT_DATE + INTERVAL '5 days', false, now(), now());

    -- Pediatria (50 questões, 26 corretas -> 52% acerto)
    INSERT INTO study_sessions (id, user_id, grande_area, tema, data_sessao, qts_feitas, qts_corretas, data_proxima_revisao, revisao_concluida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Pediatria', 'Puericultura e Neonatologia', CURRENT_DATE - INTERVAL '6 days', 50, 26, CURRENT_DATE + INTERVAL '3 days', false, now(), now());

    -- Ginecologia e Obstetrícia (40 questões, 15 corretas -> 37.5% acerto)
    INSERT INTO study_sessions (id, user_id, grande_area, tema, data_sessao, qts_feitas, qts_corretas, data_proxima_revisao, revisao_concluida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Pré-Natal e Partograma', CURRENT_DATE - INTERVAL '7 days', 40, 15, CURRENT_DATE + INTERVAL '2 days', false, now(), now());

    -- Medicina Preventiva (30 questões, 6 corretas -> 20% acerto)
    INSERT INTO study_sessions (id, user_id, grande_area, tema, data_sessao, qts_feitas, qts_corretas, data_proxima_revisao, revisao_concluida, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Epidemiologia e SUS', CURRENT_DATE - INTERVAL '8 days', 30, 6, CURRENT_DATE + INTERVAL '1 day', false, now(), now());

    -- 4. POPULAR FLASHCARDS HISTÓRICOS (Para computar retenção por especialidade no cálculo da Maestria)
    -- Clínica Médica (20 cards revisados, 20 EASY/MEDIUM -> 100% retenção)
    FOR i IN 1..20 LOOP
        INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at)
        VALUES (
            gen_random_uuid(), v_user_id, 'Clínica Médica', 'Semiologia e Farmaco ' || i,
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Card Histórico Clínica ' || i))))),
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Resposta Consolidada'))))),
            CURRENT_DATE + (i * INTERVAL '2 days'), 'EASY', 2.8, 14, 0, now() - INTERVAL '30 days', now()
        );
    END LOOP;

    -- Cirurgia Geral (15 cards revisados, 12 EASY/MEDIUM, 3 HARD -> 80% retenção)
    FOR i IN 1..15 LOOP
        INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at)
        VALUES (
            gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Condutas Cirúrgicas ' || i,
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Card Histórico Cirurgia ' || i))))),
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Resposta Cirúrgica'))))),
            CURRENT_DATE + (i * INTERVAL '2 days'), CASE WHEN i <= 12 THEN 'MEDIUM' ELSE 'HARD' END, 2.3, 7, CASE WHEN i <= 12 THEN 0 ELSE 1 END, now() - INTERVAL '20 days', now()
        );
    END LOOP;

    -- Pediatria (10 cards revisados, 5 EASY/MEDIUM, 5 HARD -> 50% retenção)
    FOR i IN 1..10 LOOP
        INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at)
        VALUES (
            gen_random_uuid(), v_user_id, 'Pediatria', 'Puericultura ' || i,
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Card Histórico Pediatria ' || i))))),
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Resposta Pediátrica'))))),
            CURRENT_DATE + (i * INTERVAL '2 days'), CASE WHEN i <= 5 THEN 'MEDIUM' ELSE 'HARD' END, 2.0, 4, CASE WHEN i <= 5 THEN 0 ELSE 1 END, now() - INTERVAL '15 days', now()
        );
    END LOOP;

    -- Ginecologia e Obstetrícia (10 cards revisados, 4 EASY/MEDIUM, 6 HARD -> 40% retenção)
    FOR i IN 1..10 LOOP
        INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at)
        VALUES (
            gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Obstetrícia ' || i,
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Card Histórico GO ' || i))))),
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Resposta GO'))))),
            CURRENT_DATE + (i * INTERVAL '2 days'), CASE WHEN i <= 4 THEN 'MEDIUM' ELSE 'HARD' END, 1.8, 3, CASE WHEN i <= 4 THEN 0 ELSE 1 END, now() - INTERVAL '10 days', now()
        );
    END LOOP;

    -- Medicina Preventiva (8 cards revisados, 2 EASY/MEDIUM, 6 HARD -> 25% retenção)
    FOR i IN 1..8 LOOP
        INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at)
        VALUES (
            gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'SUS e Bioestatística ' || i,
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Card Histórico Preventiva ' || i))))),
            json_build_object('type', 'doc', 'content', json_build_array(json_build_object('type', 'paragraph', 'content', json_build_array(json_build_object('type', 'text', 'text', 'Resposta Preventiva'))))),
            CURRENT_DATE + (i * INTERVAL '2 days'), CASE WHEN i <= 2 THEN 'MEDIUM' ELSE 'HARD' END, 1.6, 2, CASE WHEN i <= 2 THEN 0 ELSE 1 END, now() - INTERVAL '5 days', now()
        );
    END LOOP;

    -- 5. POPULAR 12 FLASHCARDS MÉDICOS REAIS PARA REVISÃO HOJE (TESTE DE ANIMAÇÕES, COMBOS, BOUNTY E INBOX ZERO!)
    
    -- Card 1 (BOUNTY): Farmacologia / Emergência
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Clínica Médica', 'Toxicologia Médica',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Qual o antídoto de escolha para intoxicação por Paracetamol e sua janela terapêutica de eficácia máxima?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', 'N-Acetilcisteína (NAC).'),
                json_build_object('type', 'text', 'text', ' A janela ideal de administração é nas primeiras '),
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '8 a 10 horas'),
                json_build_object('type', 'text', 'text', ' pós-ingestão aguda para restaurar estoques hepáticos de glutationa e prevenir necrose centrolobular fulminante.')
            ))
        )),
        CURRENT_DATE, 'HARD', 1.4, 1, 2, now(), now()
    );

    -- Card 2 (BOUNTY): Cardiologia
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Clínica Médica', 'Infectologia Cardiovascular',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Quais são os dois Critérios Maiores de Duke Modificados para Endocardite Infecciosa?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '1. Hemoculturas positivas: '),
                json_build_object('type', 'text', 'text', 'Microrganismo típico em 2 amostras separadas ou hemoculturas persistentemente positivas.')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '2. Evidência ecocardiográfica: '),
                json_build_object('type', 'text', 'text', 'Vegetação valvar móvel, abscesso perivalvar, deiscência nova de prótese ou regurgitação valvar nova.')
            ))
        )),
        CURRENT_DATE, 'HARD', 1.5, 1, 2, now(), now()
    );

    -- Card 3 (BOUNTY): Pediatria
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Pediatria', 'Emergências Pediátricas',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Qual a dose de Adrenalina na Anafilaxia Pediátrica, concentração e via de administração preferencial?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '0,01 mg/kg '),
                json_build_object('type', 'text', 'text', '(solução 1:1.000 / 1 mg/mL), dose máxima de '),
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '0,3 mg'),
                json_build_object('type', 'text', 'text', ', por via '),
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', 'Intramuscular (IM) '),
                json_build_object('type', 'text', 'text', 'no vasto lateral da coxa.')
            ))
        )),
        CURRENT_DATE, 'HARD', 1.3, 1, 3, now(), now()
    );

    -- Card 4: Cirurgia Geral
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Vias Biliares',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Diferencie a Tríade de Charcot da Pêntade de Reynolds na Colangite Aguda.')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Tríade de Charcot: '),
                json_build_object('type', 'text', 'text', 'Dor em Hipocôndrio Direito + Icterícia + Febre com Calafrios.')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Pêntade de Reynolds: '),
                json_build_object('type', 'text', 'text', 'Tríade de Charcot + '),
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', 'Hipotensão (Choque) + Rebaixamento do Nível de Consciência '),
                json_build_object('type', 'text', 'text', '(Colangite Tóxica Supurativa / Indicação de descompressão biliar urgente).')
            ))
        )),
        CURRENT_DATE, 'MEDIUM', 2.5, 3, 0, now(), now()
    );

    -- Card 5: Pneumologia
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Clínica Médica', 'Pneumologia',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Quais são os Critérios de Light para caracterizar um Exsudato no Líquido Pleural?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Basta 1 critério positivo para Exsudato:')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '1. Proteína pleural / Proteína sérica > 0,5;')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '2. DHL pleural / DHL sérico > 0,6;')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '3. DHL pleural > 2/3 do limite superior '),
                json_build_object('type', 'text', 'text', 'do normal do DHL sérico.')
            ))
        )),
        CURRENT_DATE, 'EASY', 2.6, 5, 0, now(), now()
    );

    -- Card 6: Neurologia / Trauma
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Trauma Cranioencefálico',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Como é calculada a pontuação da Escala de Coma de Glasgow com Pupilas (ECG-P)?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'ECG-P = Pontuação ECG (3 a 15) menos a Reatividade Pupilar:')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Duas pupilas fotorreagentes: '),
                json_build_object('type', 'text', 'text', 'subtrai 0 (pontuação mantém).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Uma pupila arreativa: '),
                json_build_object('type', 'text', 'text', 'subtrai 1 ponto.')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Nenhuma pupila fotorreagente: '),
                json_build_object('type', 'text', 'text', 'subtrai 2 pontos. Escala final varia de 1 a 15.')
            ))
        )),
        CURRENT_DATE, 'MEDIUM', 2.4, 4, 0, now(), now()
    );

    -- Card 7: Ginecologia
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'Climatério',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Qual a principal indicação e a contraindicação mais cobrada da Terapia Hormonal (TH) no climatério?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Indicação primária: '),
                json_build_object('type', 'text', 'text', 'Sintomas vasomotores (fogachos) moderados a graves em mulheres na janela de oportunidade (< 60 anos ou < 10 anos de menopausa).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Contraindicações absolutas: '),
                json_build_object('type', 'text', 'text', 'Câncer de mama prévio/atual, lesão precursora de mama, sangramento vaginal não investigado, TEV agudo, IAM/AVC prévio e hepatopatia grave ativa.')
            ))
        )),
        CURRENT_DATE, 'EASY', 2.5, 4, 0, now(), now()
    );

    -- Card 8: Obstetrícia
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Ginecologia e Obstetrícia', 'DHEG',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Quais são os sinais clínicos clássicos de Iminência de Eclâmpsia?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '1. Sintomas visuais: '),
                json_build_object('type', 'text', 'text', 'Escotomas cintilantes, turvação visual, amaurose fugaz.')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '2. Sintomas cerebrais: '),
                json_build_object('type', 'text', 'text', 'Cefaleia fronto-occipital refratária e hiperreflexia.')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '3. Dor epigástrica ou em HD: '),
                json_build_object('type', 'text', 'text', 'Distensão da cápsula hepática de Glisson (risco de hematoma/rotura).')
            ))
        )),
        CURRENT_DATE, 'MEDIUM', 2.5, 3, 0, now(), now()
    );

    -- Card 9: Medicina Preventiva
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Medicina Preventiva', 'Níveis de Prevenção de Leavell & Clark',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Diferencie Prevenção Primária, Secundária, Terciária e Quaternária com exemplos.')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Primária: '),
                json_build_object('type', 'text', 'text', 'Ação no período pré-patogênico (Vacinação, cessação do tabagismo).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Secundária: '),
                json_build_object('type', 'text', 'text', 'Diagnóstico e tratamento precoce / rastreamento (Mamografia, Papanicolau).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Terciária: '),
                json_build_object('type', 'text', 'text', 'Reabilitação e redução de sequelas (Fisioterapia pós-AVC).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Quaternária: '),
                json_build_object('type', 'text', 'text', 'Evitar excesso de intervencionismo e iatrogenias médicas (Overdiagnosis / Overtreatment).')
            ))
        )),
        CURRENT_DATE, 'EASY', 2.7, 6, 0, now(), now()
    );

    -- Card 10: Pediatria / Neonatologia
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Pediatria', 'Sala de Parto',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Quais são os 5 componentes avaliados no Boletim de Apgar do recém-nascido?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Mnemônico '),
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', 'FC-R-T-I-C '),
                json_build_object('type', 'text', 'text', '(pontuados de 0 a 2 cada):')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '1. Freq. Cardíaca: '),
                json_build_object('type', 'text', 'text', 'Ausente (0), <100 bpm (1), >100 bpm (2).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '2. Respiração: '),
                json_build_object('type', 'text', 'text', 'Ausente (0), Irregular/fraco (1), Choro forte (2).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '3. Tônus Muscular: '),
                json_build_object('type', 'text', 'text', 'Flácido (0), Alguma flexão (1), Movimento ativo (2).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '4. Irritabilidade Reflexa: '),
                json_build_object('type', 'text', 'text', 'Sem resposta (0), Careta (1), Espirro/choro (2).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '5. Cor: '),
                json_build_object('type', 'text', 'text', 'Cianose total/pálido (0), Acrocianose (1), Completamente rosado (2).')
            ))
        )),
        CURRENT_DATE, 'MEDIUM', 2.5, 3, 0, now(), now()
    );

    -- Card 11: Nefrologia
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Clínica Médica', 'Nefrologia',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Como interpretar a Fração de Excreção de Sódio (FeNa) na Injúria Renal Aguda?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• FeNa < 1%: '),
                json_build_object('type', 'text', 'text', 'Causa Pré-Renal (túbulos íntegros reabsorvem sódio e água para compensar a hipoperfusão).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• FeNa > 2%: '),
                json_build_object('type', 'text', 'text', 'Causa Renal Intrínseca / Necrose Tubular Aguda (NTA - perda da capacidade de reabsorção tubular).')
            ))
        )),
        CURRENT_DATE, 'EASY', 2.5, 4, 0, now(), now()
    );

    -- Card 12: Cirurgia / Abdome Agudo
    INSERT INTO flashcards (id, user_id, grande_area, tema, frente, verso, proxima_revisao, dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, created_at, updated_at) VALUES
    (
        gen_random_uuid(), v_user_id, 'Cirurgia Geral', 'Semiologia Cirúrgica',
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'text', 'Quais são as manobras semióticas dos sinais de Blumberg, Murphy e Rovsing e suas patologias associadas?')
            ))
        )),
        json_build_object('type', 'doc', 'content', json_build_array(
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Sinal de Blumberg: '),
                json_build_object('type', 'text', 'text', 'Dor à descompressão brusca no ponto de McBurney (Peritonite / Apendicite aguda).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Sinal de Murphy: '),
                json_build_object('type', 'text', 'text', 'Parada súbita da inspiração profunda à palpação dolorosa do ponto cístico (Colecistite aguda).')
            )),
            json_build_object('type', 'paragraph', 'content', json_build_array(
                json_build_object('type', 'text', 'marks', json_build_array(json_build_object('type', 'bold')), 'text', '• Sinal de Rovsing: '),
                json_build_object('type', 'text', 'text', 'Dor na Fossa Ilíaca Direita (FID) provocada pela compressão retrógrada de gases na FIE (Apendicite aguda).')
            ))
        )),
        CURRENT_DATE, 'MEDIUM', 2.5, 3, 0, now(), now()
    );

    -- 6. BADGES INICIAIS
    INSERT INTO user_badges (id, user_id, badge_type, earned_at, created_at, updated_at) VALUES
    (gen_random_uuid(), v_user_id, 'FLASH_FIRST_STEP', now() - INTERVAL '10 days', now(), now()),
    (gen_random_uuid(), v_user_id, 'FLASH_10_CARDS', now() - INTERVAL '8 days', now(), now()),
    (gen_random_uuid(), v_user_id, 'FLASH_50_CARDS', now() - INTERVAL '5 days', now(), now()),
    (gen_random_uuid(), v_user_id, 'QUESTIONS_100', now() - INTERVAL '4 days', now(), now()),
    (gen_random_uuid(), v_user_id, 'PRECISION_80', now() - INTERVAL '3 days', now(), now())
    ON CONFLICT (user_id, badge_type) DO NOTHING;

END $$;
