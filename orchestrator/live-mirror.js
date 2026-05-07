const { chromium } = require('playwright');

(async () => {
  const TARGET = 'https://www.klakna.sbs';
  const MOCK_PORT = 3001;
  const CLONE_PORT = 3000;

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('pageerror', (e) => console.log('Page error:', e.message));
  page.on('requestfailed', (r) => console.log('Request failed:', r.url()));

  // Intercept API calls from original site -> redirect to local mock
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    const mockUrl = url.replace(TARGET, `http://127.0.0.1:${MOCK_PORT}`);
    console.log(`API -> Mock: ${url.replace(TARGET, '')}`);
    try {
      await route.continue({ url: mockUrl });
    } catch (err) {
      console.log('Redirect failed:', err.message);
      await route.abort();
    }
  });

  // Open the original site (API calls intercepted to mock)
  console.log(`Opening ${TARGET}/#/ ...`);
  await page.goto(`${TARGET}/#/`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  await page.waitForTimeout(5000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);

  console.log('Title:', await page.title());
  console.log('Browser is open for manual interaction. Press Ctrl+C to exit.');
})();
