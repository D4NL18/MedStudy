const fs = require('fs');
const path = require('node:path');

const prodApiUrl = process.env.PROD_API_URL || 'https://medstudy-backend-142872223826.us-central1.run.app/api';
const srcEmail = process.env.SRC_EMAIL || 'larimeirellescj@gmail.com';
const srcPassword = process.env.SRC_PASSWORD || '';

const destUserId = '550e8400-e29b-41d4-a716-446655440000'; // admin@medstudy.com

function sanitizeLog(val) {
    return String(val ?? '').replace(/[\r\n\t]/g, '');
}

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'boolean') return str ? 'true' : 'false';
    if (typeof str === 'number') return isNaN(str) ? 'NULL' : String(str);
    if (typeof str === 'object') {
        const json = JSON.stringify(str);
        return `'${json.replaceAll("'", "''")}'::jsonb`;
    }
    return `'${String(str).replaceAll("'", "''")}'`;
}

function escapeJsonField(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'object') {
        return `'${JSON.stringify(val).replaceAll("'", "''")}'::jsonb`;
    }
    // If it's a string, convert to JSON string object or raw jsonb
    const str = String(val).trim();
    if (str.startsWith('{') || str.startsWith('[')) {
        try {
            JSON.parse(str);
            return `'${str.replaceAll("'", "''")}'::jsonb`;
        } catch (e) {}
    }
    return `'${JSON.stringify({ text: str }).replaceAll("'", "''")}'::jsonb`;
}

function escapeDate(d) {
    if (!d) return 'NULL';
    return `'${d}'::date`;
}

function escapeTimestamp(d) {
    if (!d) return 'NOW()';
    return `'${d}'::timestamptz`;
}

async function main() {
    console.log("1. Autenticando na conta de produção larimeirellescj@gmail.com...");
    const loginRes = await fetch(`${prodApiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: srcEmail, password: srcPassword })
    });

    if (!loginRes.ok) {
        throw new Error(`Falha no login em produção: ${loginRes.status} ${await loginRes.text()}`);
    }

    const authData = await loginRes.json();
    const token = authData.accessToken;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    console.log("2. Coletando dados da produção (apenas leitura)...");

    const [profileRes, subRes, sessionsRes, flashcardsRes, lessonsRes, simuladosRes] = await Promise.all([
        fetch(`${prodApiUrl}/profiles/me`, { headers }),
        fetch(`${prodApiUrl}/subscriptions/me`, { headers }),
        fetch(`${prodApiUrl}/study-sessions?size=2000`, { headers }),
        fetch(`${prodApiUrl}/flashcards?size=2000`, { headers }),
        fetch(`${prodApiUrl}/lessons?size=2000`, { headers }),
        fetch(`${prodApiUrl}/simulados?size=2000`, { headers })
    ]);

    const profile = profileRes.ok ? await profileRes.json() : null;
    const subscription = subRes.ok ? await subRes.json() : null;
    const sessionsData = await sessionsRes.json();
    const flashcardsData = await flashcardsRes.json();
    const lessonsData = await lessonsRes.json();
    const simuladosData = await simuladosRes.json();

    const sessions = sessionsData.content || (Array.isArray(sessionsData) ? sessionsData : []);
    const flashcards = flashcardsData.content || (Array.isArray(flashcardsData) ? flashcardsData : []);
    const lessons = lessonsData.content || (Array.isArray(lessonsData) ? lessonsData : []);
    const simulados = simuladosData.content || (Array.isArray(simuladosData) ? simuladosData : []);

    console.log(`Dados obtidos de produção:`);
    console.log(`- Perfil: ${sanitizeLog(profile?.nomeCompleto || 'N/A')}`);
    console.log(`- Badges: ${Number(profile?.badges?.length || 0)}`);
    console.log(`- Assinatura: ${sanitizeLog(subscription?.status || 'N/A')}`);
    console.log(`- Sessões de Estudo: ${Number(sessions.length)}`);
    console.log(`- Flashcards: ${Number(flashcards.length)}`);
    console.log(`- Aulas: ${Number(lessons.length)}`);
    console.log(`- Simulados: ${Number(simulados.length)}`);

    console.log("3. Gerando SQL de sincronização local...");
    const sqlStatements = [];
    sqlStatements.push(
        '-- Script gerado automaticamente para sincronizar conta admin local com os dados de produção',
        'BEGIN;',
        `DELETE FROM study_sessions WHERE user_id = '${destUserId}';`,
        `DELETE FROM flashcards WHERE user_id = '${destUserId}';`,
        `DELETE FROM lessons WHERE user_id = '${destUserId}';`,
        `DELETE FROM simulados WHERE user_id = '${destUserId}';`,
        `DELETE FROM user_badges WHERE user_id = '${destUserId}';`,
        `DELETE FROM subscriptions WHERE user_id = '${destUserId}';`,
        `DELETE FROM streak_repairs WHERE user_id = '${destUserId}';`
    );

    // Atualizar tabela users
    const userName = profile?.nomeCompleto || 'Lari Meirelles';
    sqlStatements.push(`UPDATE users SET name = ${escapeSql(userName)}, updated_at = NOW() WHERE id = '${destUserId}';`);

    // Atualizar profiles
    if (profile) {
        sqlStatements.push(`
UPDATE profiles 
SET handle = ${escapeSql(profile.handle)},
    nome_completo = ${escapeSql(profile.nomeCompleto)},
    is_formado = ${escapeSql(profile.isFormado ?? false)},
    semestre = ${escapeSql(profile.semestre ?? 12)},
    faculdade = ${escapeSql(profile.faculdade ?? 'UNIFACS')},
    avatar_preset_id = ${escapeSql(profile.avatarPresetId ?? 'reproducao_humana')},
    is_public = ${escapeSql(profile.isPublic ?? true)},
    share_streak = ${escapeSql(profile.shareStreak ?? true)},
    share_faculdade = ${escapeSql(profile.shareFaculdade ?? true)},
    share_total_questions = ${escapeSql(profile.shareTotalQuestions ?? true)},
    share_badges = ${escapeSql(profile.shareBadges ?? true)},
    profile_picture_url = ${escapeSql(profile.profilePictureUrl)},
    updated_at = NOW()
WHERE user_id = '${destUserId}';
        `.trim());
    }

    // Assinatura
    const subStatus = subscription?.status || 'LIFETIME';
    const trialStart = 'NOW()';
    const trialEnd = subscription?.trialEndDate ? escapeTimestamp(subscription.trialEndDate) : `'2027-07-15 21:56:00'::timestamptz`;
    sqlStatements.push(`
INSERT INTO subscriptions (id, user_id, status, trial_start_date, trial_end_date, is_admin_override, notes, created_at, updated_at)
VALUES (gen_random_uuid(), '${destUserId}', ${escapeSql(subStatus)}, ${trialStart}, ${trialEnd}, true, 'Espelho sincronizado de produção', NOW(), NOW());
    `.trim());

    // Badges
    if (profile && Array.isArray(profile.badges)) {
        for (const badge of profile.badges) {
            sqlStatements.push(`
INSERT INTO user_badges (id, user_id, badge_type, earned_at, created_at, updated_at)
VALUES (gen_random_uuid(), '${destUserId}', ${escapeSql(badge)}, NOW(), NOW(), NOW());
            `.trim());
        }
    }

    // Study Sessions
    for (const s of sessions) {
        sqlStatements.push(`
INSERT INTO study_sessions (
    id, user_id, grande_area, tema, data_sessao, qts_feitas, qts_corretas, 
    instituicao, data_proxima_revisao, revisao_concluida, observacoes, created_at, updated_at
) VALUES (
    gen_random_uuid(), '${destUserId}',
    ${escapeSql(s.grandeArea)},
    ${escapeSql(s.tema)},
    ${escapeDate(s.dataSessao)},
    ${escapeSql(s.qtsFeitas ?? 0)},
    ${escapeSql(s.qtsCorretas ?? 0)},
    ${escapeSql(s.instituicao)},
    ${escapeDate(s.dataProximaRevisao)},
    ${escapeSql(s.revisaoConcluida ?? false)},
    ${escapeSql(s.observacoes)},
    NOW(), NOW()
);
        `.trim());
    }

    // Flashcards
    for (const f of flashcards) {
        sqlStatements.push(`
INSERT INTO flashcards (
    id, user_id, grande_area, tema, frente, verso, proxima_revisao, 
    dificuldade_ultima, ease_factor, intervalo_atual, consecutive_hard_count, 
    created_at, updated_at
) VALUES (
    gen_random_uuid(), '${destUserId}',
    ${escapeSql(f.grandeArea)},
    ${escapeSql(f.tema || '')},
    ${escapeJsonField(f.frente)},
    ${escapeJsonField(f.verso)},
    ${escapeDate(f.proximaRevisao)},
    ${escapeSql(f.dificuldadeUltima)},
    ${escapeSql(f.easeFactor ?? 2.5)},
    ${escapeSql(f.intervaloAtual ?? 0)},
    ${escapeSql(f.consecutiveHardCount ?? 0)},
    NOW(), NOW()
);
        `.trim());
    }

    // Lessons
    for (const l of lessons) {
        sqlStatements.push(`
INSERT INTO lessons (
    id, user_id, grande_area, sub_area, tema, prioridade, aula_assistida, 
    data_aula, percent_acerto, reforco, revisao, created_at, updated_at
) VALUES (
    gen_random_uuid(), '${destUserId}',
    ${escapeSql(l.grandeArea)},
    ${escapeSql(l.subArea)},
    ${escapeSql(l.tema)},
    ${escapeSql(l.prioridade || 'MEDIA')},
    ${escapeSql(l.aulaAssistida ?? false)},
    ${escapeDate(l.dataAula)},
    ${escapeSql(l.percentAcerto)},
    ${escapeSql(l.reforco ?? false)},
    ${escapeSql(l.revisao ?? false)},
    NOW(), NOW()
);
        `.trim());
    }

    // Simulados
    for (const sim of simulados) {
        sqlStatements.push(`
INSERT INTO simulados (
    id, user_id, nome, data_realizacao, instituicao, ano, 
    cm_total, cm_acertos, cm_erros, 
    cir_total, cir_acertos, cir_erros, 
    ped_total, ped_acertos, ped_erros, 
    go_total, go_acertos, go_erros, 
    prev_total, prev_acertos, prev_erros, 
    created_at, updated_at
) VALUES (
    gen_random_uuid(), '${destUserId}',
    ${escapeSql(sim.nome)},
    ${escapeDate(sim.dataRealizacao)},
    ${escapeSql(sim.instituicao)},
    ${escapeSql(sim.ano)},
    ${escapeSql(sim.cmTotal ?? 0)},
    ${escapeSql(sim.cmAcertos ?? 0)},
    ${escapeSql(sim.cmErros ?? 0)},
    ${escapeSql(sim.cirTotal ?? 0)},
    ${escapeSql(sim.cirAcertos ?? 0)},
    ${escapeSql(sim.cirErros ?? 0)},
    ${escapeSql(sim.pedTotal ?? 0)},
    ${escapeSql(sim.pedAcertos ?? 0)},
    ${escapeSql(sim.pedErros ?? 0)},
    ${escapeSql(sim.goTotal ?? 0)},
    ${escapeSql(sim.goAcertos ?? 0)},
    ${escapeSql(sim.goErros ?? 0)},
    ${escapeSql(sim.prevTotal ?? 0)},
    ${escapeSql(sim.prevAcertos ?? 0)},
    ${escapeSql(sim.prevErros ?? 0)},
    NOW(), NOW()
);
        `.trim());
    }

    sqlStatements.push('COMMIT;');

    const outputPath = path.join(__dirname, 'sync-data.sql');
    fs.writeFileSync(outputPath, sqlStatements.join('\n\n'), 'utf8');
    console.log(`Arquivo SQL gerado com sucesso em: ${outputPath}`);
}

main().catch(err => {
    console.error('Erro no processo de sincronização:', err);
    process.exit(1);
});
