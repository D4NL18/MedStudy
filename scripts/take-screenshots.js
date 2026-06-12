const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('Iniciando navegador...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();
    
    const outDir = 'docs/assets';
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    try {
        console.log('Acessando Login...');
        await page.goto('http://localhost:4200/auth/login', { waitUntil: 'networkidle2' });
        
        // Force theme
        await page.evaluate(() => {
            localStorage.setItem('theme', 'verde');
            document.documentElement.setAttribute('data-theme', 'verde');
        });
        await new Promise(r => setTimeout(r, 500));
        
        await page.screenshot({ path: `${outDir}/login_verde.png` });
        console.log('Login screenshot salvo.');

        console.log('Efetuando login...');
        
        // Clear email
        await page.click('input[type="email"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input[type="email"]', 'teste@medstudy.com');
        
        // Clear password
        await page.click('input[type="password"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input[type="password"]', 'Password123!');
        
        await page.click('button[type="submit"]');
        
        console.log('Aguardando navegação para o dashboard...');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => console.log('Timeout navegação, prosseguindo'));
        await new Promise(r => setTimeout(r, 3000));

        // Re-force theme
        await page.evaluate(() => {
            localStorage.setItem('theme', 'verde');
            document.documentElement.setAttribute('data-theme', 'verde');
        });
        await new Promise(r => setTimeout(r, 500));

        console.log('Tirando screenshot do Dashboard...');
        await page.screenshot({ path: `${outDir}/dashboard_verde.png`, fullPage: true });

        console.log('Navegando para Banco de Questões...');
        await page.goto('http://localhost:4200/questoes', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'verde'));
        await page.screenshot({ path: `${outDir}/questoes_verde.png`, fullPage: true });

        console.log('Navegando para Flashcards...');
        await page.goto('http://localhost:4200/flashcards', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'verde'));
        await page.screenshot({ path: `${outDir}/flashcards_verde.png`, fullPage: true });

        console.log('Navegando para Simulados...');
        await page.goto('http://localhost:4200/simulados', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'verde'));
        await page.screenshot({ path: `${outDir}/simulados_verde.png`, fullPage: true });

        console.log('Navegando para Competições...');
        await page.goto('http://localhost:4200/competicoes', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'verde'));
        await page.screenshot({ path: `${outDir}/competicoes_verde.png`, fullPage: true });

        console.log('Processo concluído!');
    } catch (err) {
        console.error('Erro:', err);
    } finally {
        await browser.close();
    }
})();
