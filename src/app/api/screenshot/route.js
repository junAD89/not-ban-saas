import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url") || "https://google.com";

        // Determine environment (Vercel or local)
        const isVercel = process.env.VERCEL === '1';

        // Browser configuration options
        const launchOptions = isVercel ? {
            executablePath: await chromium.executablePath(),
            args: [
                ...chromium.args,
                '--disable-features=IsolateOrigins,site-per-process',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
            ],
            headless: true
        } : {
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-features=IsolateOrigins,site-per-process',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
            ]
        };

        // Launch browser with configured options
        const browser = await puppeteer.launch(launchOptions);

        // Create new page with additional settings
        const page = await browser.newPage();

        // Set viewport for consistency
        await page.setViewport({ width: 1280, height: 800 });

        // Set additional headers to appear more like a regular browser
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
        });

        // Enable JavaScript
        await page.setJavaScriptEnabled(true);

        // Navigate to URL with improved error handling
        try {
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait a bit to let any client-side rendering complete
            await page.waitForTimeout(2000);

            // Take screenshot
            const screenshot = await page.screenshot({
                encoding: 'base64',
                fullPage: true
            });

            // Close browser
            await browser.close();

            // Return success response
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
            console.error("Page navigation error:", pageError);

            // Try to get content anyway if page partially loaded
            const screenshot = await page.screenshot({
                encoding: 'base64',
                fullPage: true
            }).catch(e => null);

            await browser.close();

            return new Response(JSON.stringify({
                success: false,
                partial: !!screenshot,
                error: pageError.message,
                screenshot
            }), {
                status: 200, // Still return 200 if we got a partial screenshot
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Screenshot service error:", error);

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