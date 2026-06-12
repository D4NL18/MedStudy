const fs = require('fs');

const srcApiUrl = 'https://medstudy-backend-142872223826.us-central1.run.app/api';
const srcEmail = 'larimeirellescj@gmail.com';
const srcPassword = 'Lilalink10';

const destApiUrl = 'http://localhost:8080/api';
const destName = 'Usuario Teste';
const destEmail = 'teste@medstudy.com';
const destPassword = 'Password123!';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        console.log("Logging into source account...");
        const srcLoginRes = await fetch(`${srcApiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: srcEmail, password: srcPassword })
        });
        
        if (!srcLoginRes.ok) throw new Error("Source login failed");
        const srcData = await srcLoginRes.json();
        const srcHeaders = { 'Authorization': `Bearer ${srcData.token}` };

        console.log("Fetching data from source...");
        const sessionRes = await fetch(`${srcApiUrl}/study-sessions?size=1000`, { headers: srcHeaders });
        const flashRes = await fetch(`${srcApiUrl}/flashcards?size=1000`, { headers: srcHeaders });
        const lessonRes = await fetch(`${srcApiUrl}/lessons?size=1000`, { headers: srcHeaders });
        const simuladoRes = await fetch(`${srcApiUrl}/simulados?size=1000`, { headers: srcHeaders });
        
        const sessions = await sessionRes.json();
        const flashcards = await flashRes.json();
        const lessons = await lessonRes.json();
        const simulados = await simuladoRes.json();

        console.log("Registering destination account...");
        await fetch(`${destApiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: destName, email: destEmail, password: destPassword })
        }).catch(e => console.log('Already registered?'));

        console.log("Logging into destination account...");
        const destLoginRes = await fetch(`${destApiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: destEmail, password: destPassword })
        });
        const destData = await destLoginRes.json();
        const destHeaders = { 'Authorization': `Bearer ${destData.token}`, 'Content-Type': 'application/json' };

        console.log("Pushing sessions...");
        for (const s of sessions.content || sessions) {
            delete s.id; delete s.userId; delete s.createdAt; delete s.updatedAt;
            await fetch(`${destApiUrl}/study-sessions`, { method: 'POST', headers: destHeaders, body: JSON.stringify(s) });
        }
        console.log("Pushing flashcards...");
        for (const f of flashcards.content || flashcards) {
            delete f.id; delete f.userId; delete f.createdAt; delete f.updatedAt;
            await fetch(`${destApiUrl}/flashcards`, { method: 'POST', headers: destHeaders, body: JSON.stringify(f) });
        }
        console.log("Pushing lessons...");
        for (const l of lessons.content || lessons) {
            delete l.id; delete l.userId; delete l.createdAt; delete l.updatedAt;
            await fetch(`${destApiUrl}/lessons`, { method: 'POST', headers: destHeaders, body: JSON.stringify(l) });
        }
        console.log("Pushing simulados...");
        for (const s of simulados.content || simulados) {
            delete s.id; delete s.userId; delete s.createdAt; delete s.updatedAt;
            await fetch(`${destApiUrl}/simulados`, { method: 'POST', headers: destHeaders, body: JSON.stringify(s) });
        }

        console.log("Completed!");
    } catch (e) {
        console.error(e);
    }
}
main();
