const apiUrl = 'https://medstudy-backend-142872223826.us-central1.run.app/api';
const srcEmail = 'larimeirellescj@gmail.com';
const srcPassword = 'Lilalink10';
const destName = 'Usuario Teste';
const destEmail = 'teste@medstudy.com';
const destPassword = 'Password123!';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        console.log("Logging into source account...");
        let srcLoginRes;
        for (let i = 0; i < 5; i++) {
            srcLoginRes = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: srcEmail, password: srcPassword })
            });
            if (srcLoginRes.status === 429) {
                console.log("429 Too many requests. Waiting 10 seconds...");
                await delay(10000);
            } else {
                break;
            }
        }

        if (!srcLoginRes.ok) {
            console.error("Source login failed:", srcLoginRes.status, await srcLoginRes.text());
            return;
        }

        const srcCookies = srcLoginRes.headers.getSetCookie();
        const srcCookieHeader = srcCookies.map(c => c.split(';')[0]).join('; ');
        console.log("Source login successful.");

        const srcHeaders = {
            'Content-Type': 'application/json',
            'Cookie': srcCookieHeader
        };

        // Fetch Data
        console.log("Fetching data from source...");
        
        // 1. Study Sessions
        let sessions = [];
        const sessionRes = await fetch(`${apiUrl}/study-sessions?size=1000`, { headers: srcHeaders });
        if (sessionRes.ok) {
            const data = await sessionRes.json();
            sessions = data.content || (Array.isArray(data) ? data : []);
        } else {
            console.error("Failed to fetch sessions");
        }

        // 2. Flashcards
        let flashcards = [];
        const flashRes = await fetch(`${apiUrl}/flashcards?size=1000`, { headers: srcHeaders });
        if (flashRes.ok) {
            const data = await flashRes.json();
            flashcards = data.content || (Array.isArray(data) ? data : []);
        } else {
            console.error("Failed to fetch flashcards");
        }

        // 3. Lessons
        let lessons = [];
        const lessonRes = await fetch(`${apiUrl}/lessons?size=1000`, { headers: srcHeaders });
        if (lessonRes.ok) {
            const data = await lessonRes.json();
            lessons = data.content || (Array.isArray(data) ? data : []);
        } else {
            console.error("Failed to fetch lessons");
        }

        // 4. Simulados
        let simulados = [];
        const simuladoRes = await fetch(`${apiUrl}/simulados?size=1000`, { headers: srcHeaders });
        if (simuladoRes.ok) {
            const data = await simuladoRes.json();
            simulados = data.content || (Array.isArray(data) ? data : []);
        } else {
            console.error("Failed to fetch simulados");
        }

        console.log(`Fetched ${sessions.length} sessions, ${flashcards.length} flashcards, ${lessons.length} lessons, ${simulados.length} simulados.`);

        // Create Destination Account
        console.log("Registering destination account...");
        const registerRes = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: destName, email: destEmail, password: destPassword })
        });

        if (!registerRes.ok && registerRes.status !== 400) { // 400 might be 'already exists'
            console.error("Registration failed:", registerRes.status, await registerRes.text());
            // If it already exists, let's login
        }
        
        console.log("Logging into destination account...");
        let destLoginRes;
        for (let i = 0; i < 5; i++) {
            destLoginRes = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: destEmail, password: destPassword })
            });
            if (destLoginRes.status === 429) {
                console.log("Destination login: 429 Too many requests. Waiting 10 seconds...");
                await delay(10000);
            } else {
                break;
            }
        }

        if (!destLoginRes.ok) {
            console.error("Destination login failed:", destLoginRes.status, await destLoginRes.text());
            return;
        }

        const destCookies = destLoginRes.headers.getSetCookie();
        const destCookieHeader = destCookies.map(c => c.split(';')[0]).join('; ');
        console.log("Destination login successful.");

        const destHeaders = {
            'Content-Type': 'application/json',
            'Cookie': destCookieHeader
        };

        // Post Data
        console.log("Duplicating Study Sessions...");
        for (const s of sessions) {
            const body = {
                grandeArea: s.grandeArea,
                tema: s.tema,
                dataSessao: s.dataSessao,
                qtsFeitas: s.qtsFeitas,
                qtsCorretas: s.qtsCorretas,
                instituicao: s.instituicao,
                observacoes: s.observacoes,
                dataProximaRevisao: s.dataProximaRevisao,
                revisaoConcluida: s.revisaoConcluida
            };
            await fetch(`${apiUrl}/study-sessions`, { method: 'POST', headers: destHeaders, body: JSON.stringify(body) });
            await delay(300);
        }

        console.log("Duplicating Flashcards...");
        for (const f of flashcards) {
            const body = {
                grandeArea: f.grandeArea,
                frente: f.frente,
                verso: f.verso,
                proximaRevisao: f.proximaRevisao,
                dificuldadeUltima: f.dificuldadeUltima,
                easeFactor: f.easeFactor,
                intervaloAtual: f.intervaloAtual,
                consecutiveHardCount: f.consecutiveHardCount,
                ultimaRevisao: f.ultimaRevisao,
                lastStudiedAt: f.lastStudiedAt
            };
            await fetch(`${apiUrl}/flashcards`, { method: 'POST', headers: destHeaders, body: JSON.stringify(body) });
            await delay(300);
        }

        console.log("Duplicating Lessons...");
        for (const l of lessons) {
            const body = {
                grandeArea: l.grandeArea,
                subArea: l.subArea,
                tema: l.tema,
                prioridade: l.prioridade,
                aulaAssistida: l.aulaAssistida,
                dataAula: l.dataAula,
                percentAcerto: l.percentAcerto,
                reforco: l.reforco,
                revisao: l.revisao
            };
            await fetch(`${apiUrl}/lessons`, { method: 'POST', headers: destHeaders, body: JSON.stringify(body) });
            await delay(300);
        }

        console.log("Duplicating Simulados...");
        for (const sim of simulados) {
            const body = {
                nome: sim.nome,
                dataRealizacao: sim.dataRealizacao,
                instituicao: sim.instituicao,
                ano: sim.ano,
                cmTotal: sim.cmTotal,
                cmAcertos: sim.cmAcertos,
                cmErros: sim.cmErros,
                cirTotal: sim.cirTotal,
                cirAcertos: sim.cirAcertos,
                cirErros: sim.cirErros,
                pedTotal: sim.pedTotal,
                pedAcertos: sim.pedAcertos,
                pedErros: sim.pedErros,
                goTotal: sim.goTotal,
                goAcertos: sim.goAcertos,
                goErros: sim.goErros,
                prevTotal: sim.prevTotal,
                prevAcertos: sim.prevAcertos,
                prevErros: sim.prevErros
            };
            await fetch(`${apiUrl}/simulados`, { method: 'POST', headers: destHeaders, body: JSON.stringify(body) });
            await delay(300);
        }

        console.log("Duplication complete!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
