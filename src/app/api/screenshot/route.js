import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium";

// Ajouter le plugin stealth
puppeteer.use(StealthPlugin());

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url") || "https://google.com";

        // Déterminer l'environnement (Vercel ou local)
        const isVercel = process.env.VERCEL === '1';

        // Options de configuration du navigateur
        const launchOptions = isVercel ? {
            executablePath: await chromium.executablePath(),
            args: [
                ...chromium.args,
                '--disable-features=IsolateOrigins,site-per-process',
            ],
            headless: true
        } : {
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-features=IsolateOrigins,site-per-process',
            ]
        };

        // Lancer le navigateur avec les options configurées
        const browser = await puppeteer.launch(launchOptions);

        // Créer une nouvelle page avec des paramètres supplémentaires
        const page = await browser.newPage();

        // Définir la taille de la fenêtre pour plus de cohérence
        await page.setViewport({ width: 1280, height: 800 });

        // Randomiser le user agent (au lieu d'en fixer un)
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0'
        ];
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        await page.setUserAgent(randomUserAgent);

        // Définir des en-têtes supplémentaires pour ressembler davantage à un navigateur normal
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Referer': 'https://www.google.com/',
            'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        });

        // Activer JavaScript
        await page.setJavaScriptEnabled(true);

        // Simuler des comportements humains avec des délais aléatoires
        await page.waitForTimeout(Math.floor(Math.random() * 1000) + 500);

        // Naviguer vers l'URL avec une meilleure gestion des erreurs
        try {
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Attendre un peu pour laisser le rendu côté client se terminer
            // Ajouter un délai aléatoire pour simuler un comportement humain
            await page.waitForTimeout(Math.floor(Math.random() * 2000) + 2000);

            // Effectuer quelques actions aléatoires pour simuler un comportement humain
            // Scroll aléatoire
            await page.evaluate(() => {
                window.scrollTo({
                    top: Math.floor(Math.random() * 500),
                    behavior: 'smooth'
                });
            });

            await page.waitForTimeout(Math.floor(Math.random() * 1000) + 500);

            // Prendre une capture d'écran
            const screenshot = await page.screenshot({
                encoding: 'base64',
                fullPage: true
            });

            // Fermer le navigateur
            await browser.close();

            // Renvoyer une réponse de succès
            return new Response(JSON.stringify({
                success: true,
                url: url,
                timestamp: new Date().toISOString(),
                screenshot
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "s-maxage=60, stale-while-revalidate"
                },
            });
        } catch (pageError) {
            console.error("Erreur de navigation de page:", pageError);

            // Essayer d'obtenir du contenu même si la page n'est que partiellement chargée
            const screenshot = await page.screenshot({
                encoding: 'base64',
                fullPage: true
            }).catch(() => null);

            await browser.close();

            return new Response(JSON.stringify({
                success: false,
                partial: !!screenshot,
                error: pageError.message,
                screenshot
            }), {
                status: 200, // Renvoyer quand même 200 si nous avons une capture d'écran partielle
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Erreur du service de capture d'écran:", error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}