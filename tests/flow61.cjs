// Prüft die Neuerungen aus 6.1: kein seitliches Überlaufen, Lauf im Plan, Einheiten verschieben, Übung ersetzen.
// Aufruf: node tests/flow61.cjs <ausgabeordner> [url]
const { chromium } = require('playwright');
const fs = require('fs');
const assert = require('assert');
const [, , outDir = 'shots', base = 'http://127.0.0.1:8788/'] = process.argv;

(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const width of [320, 375, 430]) {
    const ctx = await b.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(`${width}: ${e.message} @ ${(e.stack || '').split('\n')[1] || ''}`));
    p.on('console', (m) => m.type() === 'error' && errs.push(`${width}: console ${m.text()}`));
    const seed = fs.readFileSync(__dirname + '/seed.json', 'utf8');
    await p.addInitScript((s) => { if (!localStorage.getItem('mobi.settings')) for (const [k, v] of Object.entries(JSON.parse(s))) localStorage.setItem(k, JSON.stringify(v)); }, seed);
    await p.goto(base, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    if (await p.$('[data-no]')) await p.click('[data-no]');
    const overflow = async (where) => {
      const r = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll('#app *, #sheet *, .overlay *')].filter((el) => {
          if (el.closest('.chip-scroll') || el.closest('svg')) return false;
          const q = el.getBoundingClientRect();
          return q.width > 0 && (q.right > vw + 1 || q.left < -1);
        }).slice(0, 3).map((el) => `${el.tagName}.${el.className}`.slice(0, 60));
        return { sw: document.documentElement.scrollWidth, vw, wide };
      });
      assert.ok(r.sw <= r.vw && !r.wide.length, `${width}px ${where}: Seite ${r.sw} > ${r.vw}, zu breit: ${r.wide.join(' | ')}`);
    };
    for (const v of ['heute', 'training', 'uebungen', 'verlauf', 'profil']) { await p.click(`.tab[data-view="${v}"]`); await p.waitForTimeout(150); await overflow(v); }

    if (width === 375) {
      const shot = async (n) => { await p.waitForTimeout(300); await p.screenshot({ path: `${outDir}/61-${n}.png` }); };
      // Wochenstruktur: Montag Studio (feste Einheit „Unterkörper A“) + Tempolauf 6 km
      await p.click('.tab[data-view="training"]');
      const unitId = await p.evaluate(() => JSON.parse(localStorage.getItem('mobi.plan')).days[1].id);
      const wd = new Date().getDay();
      await p.selectOption(`select[data-wd="${wd}"][data-f="gym"]`, unitId);
      await p.selectOption(`select[data-wd="${wd}"][data-f="cardio"]`, 'tempo');
      await p.fill(`input[data-wd="${wd}"][data-f="km"]`, '6');
      await p.dispatchEvent(`input[data-wd="${wd}"][data-f="km"]`, 'change');
      await p.evaluate(() => document.querySelector('.wk-head').scrollIntoView({ block: 'center' }));
      await shot('wochenstruktur'); await overflow('wochenstruktur');
      // Einheiten verschieben: Einheit 1 nach unten, „Als Nächstes“ bleibt dieselbe
      const before = await p.evaluate(() => { const pl = JSON.parse(localStorage.getItem('mobi.plan')); return { names: pl.days.map((d) => d.name), next: pl.days[pl.next || 0].name }; });
      await p.click('[data-move="0:1"]');
      const after = await p.evaluate(() => { const pl = JSON.parse(localStorage.getItem('mobi.plan')); return { names: pl.days.map((d) => d.name), next: pl.days[pl.next || 0].name }; });
      assert.deepEqual(after.names.slice(0, 2), [before.names[1], before.names[0]], 'Reihenfolge getauscht');
      assert.equal(after.next, before.next, '„Als Nächstes“ bleibt dieselbe Einheit');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot('plan');
      // Übung im Plan ersetzen: Vorschlag wählen
      await p.click('#view-training [data-day="0"]');
      const firstEx = await p.evaluate(() => JSON.parse(localStorage.getItem('mobi.plan')).days[0].slots[0].ex);
      await p.click('[data-rep="0"]'); await shot('ersetzen'); await overflow('ersetzen');
      await p.click('#sheet .list [data-rep]');
      const newEx = await p.evaluate(() => JSON.parse(localStorage.getItem('mobi.plan')).days[0].slots[0].ex);
      assert.notEqual(newEx, firstEx, 'Übung im Plan ersetzt');
      await overflow('einheit'); await shot('einheit');
      await p.click('[data-close]');
      // Heute: feste Einheit + Laufkarte
      await p.click('.tab[data-view="heute"]');
      const heute = await p.evaluate(() => document.querySelector('#view-heute').innerText);
      assert.ok(heute.includes('Unterkörper A'), 'feste Einheit erscheint heute');
      assert.ok(heute.includes('Tempolauf') && heute.includes('Ziel: 6 km'), 'Lauf erscheint parallel');
      await shot('heute');
      // Lauf eintragen
      await p.click('[data-act="sport"][data-type="laufen"]');
      await p.fill('#sp-min', '31'); await shot('lauf'); await overflow('lauf');
      await p.click('#sp-save');
      const sp = await p.evaluate(() => Object.values(JSON.parse(localStorage.getItem('mobi.history'))).map((d) => d.sports?.laufen).filter((x) => x && x.run === 'tempo')[0]);
      assert.deepEqual([sp.km, sp.min], [6, 31], 'Lauf gespeichert');
      const legacy = await p.evaluate(() => Object.values(JSON.parse(localStorage.getItem('mobi.history'))).some((d) => d.sport));
      assert.equal(legacy, false, 'alte Ausdauer-Einträge migriert');
      // Im Training ersetzen: frei wählen
      await p.click('[data-act="gym"]'); await overflow('training-logger');
      await p.click('[data-swap="0"]'); await p.click('#rp-free'); await p.fill('#pk-q', 'Goblet'); await p.click('[data-pick="goblet-squat"]');
      const act = await p.evaluate(() => JSON.parse(localStorage.getItem('mobi.active')).items[0].ex);
      assert.equal(act, 'goblet-squat', 'Übung im laufenden Training frei ersetzt');
      await shot('logger'); await overflow('logger');
      await p.click('#w-cancel'); await p.click('#c-yes');
      await p.click('.tab[data-view="verlauf"]'); await p.evaluate(() => document.querySelector('.km-bars').scrollIntoView({ block: 'center' })); await shot('verlauf-lauf'); await overflow('verlauf');
    }
    await ctx.close();
  }
  await b.close();
  assert.deepEqual(errs, [], 'keine Laufzeitfehler');
  console.log('6.1-Durchlauf OK (320, 375, 430 px)');
})().catch((e) => { console.error('FEHLER:', e.message); process.exit(1); });
