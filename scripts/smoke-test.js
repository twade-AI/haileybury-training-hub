#!/usr/bin/env node
// End-to-end smoke test: serves the site and drives it with headless
// Chromium. Catches "the site doesn't render" class regressions in CI.
// Run locally with: npm i playwright && npx playwright install chromium
//                   node scripts/smoke-test.js
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const PORT = 8123;
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  const server = await serve();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

  const failures = [];
  const check = (name, ok) => {
    console.log(`${ok ? '  ok ' : 'FAIL '} ${name}`);
    if (!ok) failures.push(name);
  };

  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  check('no uncaught JS errors on load', pageErrors.length === 0);
  check('sso gate dormant on localhost', await page.evaluate(
    () => Boolean(window.HubAuth) && !window.HubAuth.enabled()
        && !document.documentElement.classList.contains('sso-locked')
  ));
  check('category grid renders', (await page.locator('#categoryGrid .category-card').count()) >= 8);
  check('task shortcuts render', (await page.locator('#taskShortcuts .task-chip').count()) >= 4);
  check('gamification hidden by default', !(await page.locator('#headerXP').isVisible()));
  check('no toast on load', (await page.locator('.toast').count()) === 0);

  // Category navigation
  await page.locator('#categoryGrid .category-card').first().click();
  await page.waitForTimeout(800);
  check('category detail shows cards', (await page.locator('#categoryContentGrid .content-card, #categoryContentGrid .series-card-detail, #categoryContentGrid > *').count()) > 0);

  // Search
  await page.locator('#searchInput').fill('goodnotes');
  await page.waitForTimeout(800);
  check('search returns results', (await page.locator('#searchResultsGrid .content-card').count()) > 0);

  // Modal opens
  await page.locator('#searchResultsGrid .content-card').first().click();
  await page.waitForTimeout(800);
  check('modal opens with a title', ((await page.locator('#modalTitle').textContent()) || '').trim().length > 0);
  await page.keyboard.press('Escape');

  // Gamification opt-in toggle
  await page.locator('#focusModeToggle').click();
  await page.waitForTimeout(500);
  check('toggle reveals XP bar', await page.locator('#headerXP').isVisible());

  check('no uncaught JS errors at end', pageErrors.length === 0);
  if (pageErrors.length) console.error('JS errors:\n' + pageErrors.join('\n'));

  await browser.close();
  server.close();

  if (failures.length) {
    console.error(`\nSmoke test failed: ${failures.length} check(s)`);
    process.exit(1);
  }
  console.log('\nSmoke test passed');
}

main().catch((e) => { console.error(e); process.exit(1); });
