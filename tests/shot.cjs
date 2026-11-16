// Aufruf: node tests/shot.cjs <szenario> <hell|dunkel> <ausgabeordner> [url]
// Öffnet die App mit optional vorbereiteten Daten und macht Screenshots einzelner Zustände.
const { chromium } = require('playwright');
const fs = require('fs');
const [, , scenario = 'tabs', theme = 'hell', outDir = 'shots', base = 'http://127.0.0.1:8787/'] = process.argv;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: theme === 'dunkel' ? 'dark' : 'light' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).join(' | ')));
  p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()));
  const seed = fs.readFileSync(__dirname + '/seed.json', 'utf8');
  await p.addInitScript((s) => { if (!localStorage.getItem('mobi.settings')) for (const [k, v] of Object.entries(JSON.parse(s))) localStorage.setItem(k, JSON.stringify(v)); }, scenario === 'fresh' ? '{}' : seed);
  await p.goto(base, { waitUntil: 'load' });
  await p.waitForTimeout(500);
  const shot = async (name, full = false) => { await p.waitForTimeout(350); await p.screenshot({ path: `${outDir}/${theme}-${name}.png`, fullPage: full }); };
  const run = require('./scenarios.cjs');
  await run[scenario](p, shot);
  console.log(scenario, 'ERRORS:', errs.length ? errs : 'keine');
  await b.close();
})();
