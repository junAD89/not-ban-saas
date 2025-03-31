import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url") || "https://google.com";

        let executablePath = await chromium.executablePath();
        let isLocal = !executablePath || executablePath.includes("null"); // Vérifie si Chromium ne trouve pas de chemin

        const browser = await puppeteer.launch({
            executablePath: isLocal
                ? undefined // Utilise la version de Puppeteer standard en local
                : executablePath, // Utilise Chromium de Sparticuz sur Vercel
            args: chromium.args,
            headless: chromium.headless ?? "new",
        });

        const page = await browser.newPage();
        await page.goto(url);

        const screenshot = await page.screenshot({ encoding: 'base64' });
        await browser.close();

        return new Response(JSON.stringify({ screenshot }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
