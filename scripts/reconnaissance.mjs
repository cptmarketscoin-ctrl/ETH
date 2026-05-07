/**
 * Phase 1: Reconnaissance Script
 * - Take full-page screenshots at desktop (1440px) and mobile (390px)
 * - Extract global design tokens (fonts, colors, animations)
 * - Map page topology (sections top to bottom)
 * - Capture interaction behaviors
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = process.env.TARGET_URL || 'https://www.klakna.sbs/#/';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'design-references');
const RESEARCH_DIR = path.join(__dirname, '..', 'docs', 'research');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(RESEARCH_DIR)) fs.mkdirSync(RESEARCH_DIR, { recursive: true });

(async () => {
  console.log('Phase 1: Reconnaissance');
  console.log(`Target: ${TARGET_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
  });

  // ==================== Desktop (1440px) ====================
  console.log('\n[1/4] Desktop screenshot (1440x900)...');
  const desktopPage = await context.newPage();
  await desktopPage.setViewportSize({ width: 1440, height: 900 });
  await desktopPage.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktopPage.waitForTimeout(3000);

  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, 'desktop-1440-top.png'),
    fullPage: false
  });
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, 'desktop-1440-full.png'),
    fullPage: true
  });
  console.log('  Desktop screenshots saved.');

  // ==================== Mobile (390px) ====================
  console.log('\n[2/4] Mobile screenshot (390x844)...');
  const mobileContext = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const mobileViewport = await mobileContext.newPage();
  await mobileViewport.setViewportSize({ width: 390, height: 844 });
  await mobileViewport.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobileViewport.waitForTimeout(3000);

  await mobileViewport.screenshot({
    path: path.join(OUTPUT_DIR, 'mobile-390-top.png'),
    fullPage: false
  });
  await mobileViewport.screenshot({
    path: path.join(OUTPUT_DIR, 'mobile-390-full.png'),
    fullPage: true
  });
  console.log('  Mobile screenshots saved.');

  // ==================== Extract Design Tokens ====================
  console.log('\n[3/4] Extracting design tokens...');

  const designTokens = await desktopPage.evaluate(() => {
    const tokens = {
      fonts: new Set(),
      colors: {},
      animations: new Set(),
      meta: {}
    };

    // Meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(tag => {
      const name = tag.getAttribute('name') || tag.getAttribute('property') || '';
      const content = tag.getAttribute('content') || '';
      if (name && content) tokens.meta[name] = content;
    });

    // Font links
    const linkTags = document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="font"]');
    linkTags.forEach(link => {
      tokens.fonts.add(link.href);
    });

    // Computed styles on key elements
    const elements = {
      body: document.body,
      h1: document.querySelector('h1'),
      h2: document.querySelector('h2'),
      h3: document.querySelector('h3'),
      p: document.querySelector('p'),
      a: document.querySelector('a'),
      button: document.querySelector('button'),
      nav: document.querySelector('nav'),
      header: document.querySelector('header'),
      footer: document.querySelector('footer'),
    };

    const propsToExtract = [
      'font-family', 'font-size', 'font-weight', 'line-height', 'color',
      'background-color', 'background', 'margin', 'padding', 'border-radius',
      'box-shadow', 'text-align', 'text-transform', 'letter-spacing',
      'display', 'position', 'overflow', 'max-width', 'min-height'
    ];

    tokens.computedStyles = {};
    for (const [name, el] of Object.entries(elements)) {
      if (!el) continue;
      const computed = window.getComputedStyle(el);
      tokens.computedStyles[name] = {};
      propsToExtract.forEach(prop => {
        tokens.computedStyles[name][prop] = computed.getPropertyValue(prop);
      });
      // Collect unique font families
      const ff = computed.getPropertyValue('font-family');
      ff.split(',').forEach(f => tokens.fonts.add(f.trim()));
    }

    // CSS variables from :root
    const rootStyles = getComputedStyle(document.documentElement);
    tokens.cssVariables = {};
    const rootVars = ['--background', '--foreground', '--primary', '--secondary',
      '--accent', '--muted', '--destructive', '--border', '--ring', '--card',
      '--popover', '--muted-foreground', '--card-foreground'];
    rootVars.forEach(v => {
      const val = rootStyles.getPropertyValue(v).trim();
      if (val) tokens.cssVariables[v] = val;
    });

    // Extract all CSS custom properties
    const allStyles = document.querySelectorAll('style');
    tokens.rawCSS = [];
    allStyles.forEach(style => {
      if (style.textContent && style.textContent.length < 50000) {
        tokens.rawCSS.push(style.textContent.substring(0, 5000));
      }
    });

    // Page sections (top-level children of body/app)
    const app = document.querySelector('#app') || document.querySelector('#root') || document.body;
    tokens.sections = [];
    const children = app.children;
    for (let i = 0; i < Math.min(children.length, 50); i++) {
      const child = children[i];
      const rect = child.getBoundingClientRect();
      if (rect.height > 10) {
        tokens.sections.push({
          tag: child.tagName.toLowerCase(),
          id: child.id || null,
          className: (child.className && typeof child.className === 'string') ? child.className.substring(0, 200) : null,
          rect: { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) },
          textPreview: child.innerText ? child.innerText.substring(0, 100).trim() : null,
          childCount: child.children.length
        });
      }
    }

    // Animations
    const allAnimated = document.querySelectorAll('*');
    allAnimated.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.animationName && style.animationName !== 'none') {
        tokens.animations.add(style.animationName);
      }
      if (style.transitionProperty && style.transitionProperty !== 'none') {
        tokens.animations.add(`transition:${style.transitionProperty}`);
      }
    });

    // Favicon and icons
    tokens.favicons = [];
    document.querySelectorAll('link[rel*="icon"]').forEach(link => {
      tokens.favicons.push({ rel: link.rel, href: link.href, sizes: link.getAttribute('sizes') });
    });

    return {
      fonts: [...tokens.fonts],
      cssVariables: tokens.cssVariables,
      computedStyles: tokens.computedStyles,
      sections: tokens.sections,
      animations: [...tokens.animations],
      meta: tokens.meta,
      favicons: tokens.favicons,
      rawCSS: tokens.rawCSS,
      title: document.title,
      bodyTextLength: document.body.innerText.length,
      url: window.location.href
    };
  });

  // Save design tokens
  fs.writeFileSync(
    path.join(RESEARCH_DIR, 'DESIGN_TOKENS.json'),
    JSON.stringify(designTokens, null, 2)
  );
  console.log('  Design tokens saved.');

  // ==================== Page Topology ====================
  console.log('\n[4/4] Mapping page topology...');

  const pageStructure = await desktopPage.evaluate(() => {
    function describeElement(el, depth = 0) {
      if (depth > 6 || !el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.height < 5 && rect.width < 5) return null;

      const tag = el.tagName.toLowerCase();
      if (['script', 'style', 'link', 'meta', 'noscript', 'svg', 'path'].includes(tag)) return null;

      const result = {
        tag,
        id: el.id || undefined,
        classes: el.className && typeof el.className === 'string' ? el.className.substring(0, 150) : undefined,
        rect: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        text: el.innerText ? el.innerText.substring(0, 80).trim() : undefined,
      };

      // Only recurse into significant containers
      if (['div', 'section', 'header', 'nav', 'main', 'footer', 'article', 'aside', 'ul', 'ol'].includes(tag)) {
        const children = [];
        for (let i = 0; i < Math.min(el.children.length, 20); i++) {
          const child = describeElement(el.children[i], depth + 1);
          if (child) children.push(child);
        }
        if (children.length > 0) result.children = children;
      }

      return result;
    }

    const app = document.querySelector('#app') || document.querySelector('#root') || document.body;
    return describeElement(app);
  });

  fs.writeFileSync(
    path.join(RESEARCH_DIR, 'PAGE_STRUCTURE.json'),
    JSON.stringify(pageStructure, null, 2)
  );

  // Generate PAGE_TOPOLOGY.md
  let topology = '# Page Topology\n\n';
  topology += `**Target:** ${TARGET_URL}\n`;
  topology += `**Title:** ${designTokens.title}\n`;
  topology += `**Body text length:** ${designTokens.bodyTextLength} chars\n\n`;
  topology += `## Sections (top to bottom)\n\n`;

  designTokens.sections.forEach((s, i) => {
    topology += `### ${i + 1}. <${s.tag}>${s.id ? ` #${s.id}` : ''}${s.className ? ` .${s.className.split(' ')[0]}` : ''}\n\n`;
    topology += `- **Position:** top=${s.rect.top}px, height=${s.rect.height}px\n`;
    topology += `- **Children:** ${s.childCount}\n`;
    if (s.textPreview) topology += `- **Text preview:** "${s.textPreview.substring(0, 60)}"\n`;
    topology += '\n';
  });

  topology += `## Fonts\n\n`;
  designTokens.fonts.forEach(f => { topology += `- ${f}\n`; });

  topology += `\n## CSS Variables\n\n`;
  if (Object.keys(designTokens.cssVariables).length > 0) {
    for (const [k, v] of Object.entries(designTokens.cssVariables)) {
      topology += `- \`${k}\`: ${v}\n`;
    }
  } else {
    topology += '(No CSS variables found on :root)\n';
  }

  topology += `\n## Animations\n\n`;
  if (designTokens.animations.length > 0) {
    designTokens.animations.forEach(a => { topology += `- ${a}\n`; });
  } else {
    topology += '(No animations detected)\n';
  }

  topology += `\n## Meta Tags\n\n`;
  for (const [k, v] of Object.entries(designTokens.meta)) {
    topology += `- \`${k}\`: ${v}\n`;
  }

  topology += `\n## Favicons\n\n`;
  designTokens.favicons.forEach(f => {
    topology += `- rel="${f.rel}" href="${f.href}"${f.sizes ? ` sizes="${f.sizes}"` : ''}\n`;
  });

  fs.writeFileSync(
    path.join(RESEARCH_DIR, 'PAGE_TOPOLOGY.md'),
    topology
  );
  console.log('  Page topology saved.');

  // ==================== Scroll behavior analysis ====================
  console.log('\n[Bonus] Analyzing scroll behaviors...');

  await desktopPage.evaluate(async () => {
    const behaviors = [];
    const initialScrollY = window.scrollY;

    // Scroll slowly and record what changes
    const steps = 20;
    const totalHeight = document.body.scrollHeight;
    const stepSize = totalHeight / steps;

    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, stepSize * i);
      await new Promise(r => setTimeout(r, 300));

      // Check for sticky/fixed elements
      const sticky = document.querySelectorAll('[style*="fixed"], [style*="sticky"], [class*="fixed"], [class*="sticky"]');
      const visible = [];
      sticky.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight) {
          visible.push({
            tag: el.tagName,
            className: (el.className && typeof el.className === 'string') ? el.className.substring(0, 100) : '',
            top: Math.round(rect.top),
            height: Math.round(rect.height)
          });
        }
      });

      if (visible.length > 0) {
        behaviors.push({
          scrollY: Math.round(window.scrollY),
          stickyElements: visible
        });
      }
    }

    window.scrollTo(0, 0);
    return behaviors;
  });

  await browser.close();
  console.log('\nPhase 1: Reconnaissance complete!');
  console.log(`Output: ${RESEARCH_DIR}/`);
  console.log(`Screenshots: ${OUTPUT_DIR}/`);
})().catch(err => {
  console.error('Reconnaissance failed:', err.message);
  process.exit(1);
});
