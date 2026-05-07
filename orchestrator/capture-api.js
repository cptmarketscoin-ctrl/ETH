const { chromium } = require('playwright');
const fse = require('fs-extra');
const path = require('path');

const TARGET_URL = process.env.TARGET_URL || 'https://www.klakna.sbs';
const OUTPUT_DIR = path.join(__dirname, 'mock-data');

// Login credentials
const LOGIN_URL = `${TARGET_URL}/#/login`;
const USERNAME = process.env.LOGIN_USER || 'demo@example.com';
const PASSWORD = process.env.LOGIN_PASS || 'demo';

(async () => {
  await fse.ensureDir(OUTPUT_DIR);

  console.log('Launching browser (headless)...');
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
  let capturedCount = 0;

  // Capture all API responses
  page.on('response', async (res) => {
    const url = res.url();
    if (!url.includes('/api')) return;

    try {
      const text = await res.text();
      if (!text || text.length < 2) return;

      JSON.parse(text); // validate JSON

      const urlObj = new URL(url);
      let fname = urlObj.pathname.replace(/\//g, '_');
      if (fname.startsWith('_')) fname = fname.substring(1);
      if (!fname) fname = 'root';

      if (urlObj.search) {
        fname += '_' + encodeURIComponent(urlObj.search);
      }
      fname += '.json';

      await fse.outputFile(path.join(OUTPUT_DIR, fname), text);
      capturedCount++;
      console.log(`[${capturedCount}] Saved: ${fname} (${text.length} bytes)`);
    } catch (e) {
      // Skip non-JSON or failed responses
    }
  });

  // === Phase 1: Login ===
  console.log(`\n=== Phase 1: Login ===`);
  console.log(`Navigating to ${LOGIN_URL} ...`);
  await page.goto(LOGIN_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  await page.waitForTimeout(5000);

  try {
    // Try multiple selectors for login form
    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[name="account"], ' +
      'input[placeholder*="email" i], input[placeholder*="Email" i], ' +
      'input[placeholder*="account" i], input[placeholder*="Account" i]'
    ).first();
    const passInput = page.locator(
      'input[type="password"], input[name="password"]'
    ).first();
    const submitBtn = page.locator(
      'button[type="submit"], button:has-text("Log"), button:has-text("Sign"), ' +
      'button:has-text("login" i), button:has-text("Login")'
    ).first();

    if (await emailInput.isVisible({ timeout: 3000 })) {
      console.log('Login form found, filling credentials...');
      await emailInput.fill(USERNAME);
      await passInput.fill(PASSWORD);
      await submitBtn.click();
      await page.waitForTimeout(8000);
      console.log('Login attempt completed');
    } else {
      console.log('Login form not found, skipping login');
    }
  } catch (e) {
    console.log(`Login skipped: ${e.message}`);
  }

  // === Phase 2: Capture main page APIs ===
  console.log(`\n=== Phase 2: Main Page APIs ===`);
  console.log(`Navigating to ${TARGET_URL}/#/ ...`);
  await page.goto(`${TARGET_URL}/#/`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  await page.waitForTimeout(12000);

  // Scroll down to trigger lazy-loaded content
  console.log('Scrolling down...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(5000);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(3000);

  // Reload to catch second-load APIs
  console.log('Reloading...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(12000);

  // === Phase 3: Crawl dynamic route pages ===
  console.log(`\n=== Phase 3: Dynamic Route Pages ===`);
  const allLinks = await page.$$eval('a[href]', (els) => {
    const seen = new Set();
    return els
      .map((a) => a.href)
      .filter((href) => {
        if (!href || href === '#' || href.startsWith('javascript:')) return false;
        const key = href.split('#')[0].split('?')[0];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  });

  const internalLinks = allLinks.filter((link) => link.includes('klakna.sbs'));
  console.log(`Found ${internalLinks.length} unique internal links`);

  // Visit up to 10 pages to avoid excessive runtime
  const pagesToVisit = internalLinks.slice(0, 10);
  for (let i = 0; i < pagesToVisit.length; i++) {
    const link = pagesToVisit[i];
    console.log(`  [${i + 1}/${pagesToVisit.length}] ${link}`);
    try {
      await page.goto(link, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      await page.waitForTimeout(5000);
    } catch (e) {
      console.log(`    Skip (timeout/error)`);
    }
  }

  await browser.close();

  // === Summary ===
  const files = (await fse.readdir(OUTPUT_DIR)).filter((f) => f.endsWith('.json'));
  console.log(`\n=== Capture Complete ===`);
  console.log(`Captured ${files.length} API response(s) to ${OUTPUT_DIR}:`);
  files.forEach((f) => {
    console.log(`  - ${f}`);
  });

  if (files.length === 0) {
    console.log('\nWarning: No API responses captured.');
    console.log('The target site may use WebSocket or non-standard API patterns.');
  }
})();
