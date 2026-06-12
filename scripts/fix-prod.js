const apiUrl = 'https://medstudy-backend-142872223826.us-central1.run.app/api';
const email = 'larimeirellescj@gmail.com';
const password = 'Lilalink10';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        console.log("Logging in...");
        const loginRes = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            console.error("Login failed:", loginRes.status, await loginRes.text());
            return;
        }

        const rawCookies = loginRes.headers.getSetCookie();
        const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ');
        console.log("Login successful. Got cookies.");

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader
        };

        const targetArea = 'Clínica Médica';
        const buggedRegex = /^Cl.*nica Medica$/i;

        // 1. Study Sessions
        console.log("Fetching study sessions...");
        const sessionRes = await fetch(`${apiUrl}/study-sessions?size=1000`, { headers });
        const sessionText = await sessionRes.text();
        if (!sessionRes.ok) {
            console.error("Failed to fetch sessions:", sessionRes.status, sessionText);
            return;
        }
        let sessionData = {};
        try {
            sessionData = JSON.parse(sessionText);
        } catch (e) {
            console.error("Failed to parse sessions JSON:", sessionText);
        }
        const sessions = sessionData.content || [];
        
        let sessionCount = 0;
        for (const session of sessions) {
            if (session.grandeArea && buggedRegex.test(session.grandeArea)) {
                console.log(`Fixing session ${session.id}...`);
                await fetch(`${apiUrl}/study-sessions/${session.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ ...session, grandeArea: targetArea })
                });
                sessionCount++;
                await delay(1500); // Respect rate limit
            }
        }
        console.log(`Fixed ${sessionCount} study sessions.`);

        // 2. Flashcards
        console.log("Fetching flashcards...");
        const flashRes = await fetch(`${apiUrl}/flashcards?size=1000`, { headers });
        const flashText = await flashRes.text();
        if (!flashRes.ok) {
            console.error("Failed to fetch flashcards:", flashRes.status, flashText);
        } else {
            let flashData = {};
            try { flashData = JSON.parse(flashText); } catch(e) {}
            const flashcards = flashData.content || (Array.isArray(flashData) ? flashData : []);

            let flashCount = 0;
            for (const flash of flashcards) {
                if (flash.grandeArea && buggedRegex.test(flash.grandeArea)) {
                    console.log(`Fixing flashcard ${flash.id}...`);
                    await fetch(`${apiUrl}/flashcards/${flash.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ ...flash, grandeArea: targetArea })
                    });
                    flashCount++;
                    await delay(1500); // Respect rate limit
                }
            }
            console.log(`Fixed ${flashCount} flashcards.`);
        }

        // 3. Lessons
        console.log("Fetching lessons...");
        const lessonRes = await fetch(`${apiUrl}/lessons?size=1000`, { headers });
        const lessonText = await lessonRes.text();
        if (!lessonRes.ok) {
            console.error("Failed to fetch lessons:", lessonRes.status, lessonText);
        } else {
            let lessonData = {};
            try { lessonData = JSON.parse(lessonText); } catch(e) {}
            const lessons = lessonData.content || (Array.isArray(lessonData) ? lessonData : []);

            let lessonCount = 0;
            for (const lesson of lessons) {
                if (lesson.grandeArea && buggedRegex.test(lesson.grandeArea)) {
                    console.log(`Fixing lesson ${lesson.id}...`);
                    await fetch(`${apiUrl}/lessons/${lesson.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ ...lesson, grandeArea: targetArea })
                    });
                    lessonCount++;
                    await delay(1500); // Respect rate limit
                }
            }
            console.log(`Fixed ${lessonCount} lessons.`);
        }

        console.log("All done!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
