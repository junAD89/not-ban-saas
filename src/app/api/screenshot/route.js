import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url") || "https://google.com";

        // Déterminer si nous sommes sur Vercel ou en local
        const isVercel = process.env.VERCEL === '1';

        let browser;

        // Configuration différente selon l'environnement
        if (isVercel) {
            // Sur Vercel, utiliser @sparticuz/chromium
            const executablePath = await chromium.executablePath();
            browser = await puppeteer.launch({
                executablePath,
                args: chromium.args,
                headless: true
            });
        } else {
            // En local, utiliser puppeteer standard
            browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }

        // Ouvrir une nouvelle page
        const page = await browser.newPage();

        // Naviguer vers l'URL spécifiée avec un timeout suffisant
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Prendre la capture d'écran en base64
        const screenshot = await page.screenshot({
            encoding: 'base64',
            fullPage: true
        });

        // Fermer le navigateur
        await browser.close();

        // Renvoyer la capture d'écran en JSON
        return new Response(JSON.stringify({
            success: true,
            screenshot
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=60, stale-while-revalidate"
            },
        });

    } catch (error) {
        console.error("Erreur lors de la prise de la capture d'écran:", error);

        // Renvoyer une réponse d'erreur détaillée
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