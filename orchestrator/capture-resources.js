const { chromium } = require('playwright');
const fse = require('fs-extra');
const path = require('path');

const TARGET_URL = process.env.TARGET_URL || 'https://www.klakna.sbs';

(async () => {
  const resourcesDir = path.join(__dirname, 'resources');
  await fse.ensureDir(resourcesDir);

  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  console.log(`Navigating to ${TARGET_URL}/#/ ...`);
  await page.goto(`${TARGET_URL}/#/`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  await page.waitForTimeout(10000); // Wait for SPA to load resources

  // Collect resource URLs (images, CSS, JS, fonts)
  const urls = await page.$$eval(
    'img[src], link[rel="stylesheet"], script[src], link[rel="icon"], link[rel="shortcut icon"]',
    (els) =>
      els
        .map((e) => e.src || e.href)
        .filter((url) => url && !url.startsWith('data:') && !url.startsWith('blob:'))
  );

  console.log(`Found ${urls.length} resources to download`);

  let savedCount = 0;
  let failCount = 0;

  for (const url of urls) {
    try {
      const urlObj = new URL(url);
      const ext = path.extname(urlObj.pathname).split('?')[0] || '.bin';
      const hash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      const filename = urlObj.pathname.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'file';
      const saveName = `${filename.substring(0, 60)}_${hash}${ext}`;
      const savePath = path.join(resourcesDir, saveName);

      const response = await page.goto(url, { timeout: 15000 });
      if (response && response.ok()) {
        const buffer = await response.body();
        await fse.outputFile(savePath, buffer);
        savedCount++;
        if (savedCount <= 10) console.log(`[${savedCount}] Saved: ${saveName} (${buffer.length} bytes)`);
        if (savedCount === 11) console.log('... (rest omitted)');
      } else {
        failCount++;
      }
    } catch (e) {
      failCount++;
    }
  }

  await browser.close();

  // Summary
  const savedFiles = (await fse.readdir(resourcesDir)).length;
  console.log(`\n=== Resource Capture Complete ===`);
  console.log(`Saved: ${savedCount} | Failed: ${failCount} | Total files: ${savedFiles}`);
  console.log(`Output: ${resourcesDir}`);
})();
