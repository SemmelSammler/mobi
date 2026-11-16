// Barrierefreiheits-Messung: Kontraste (beide Themen), Tippflächen, Schriftgrößen von Eingabefeldern.
// Aufruf: node tests/audit.cjs [url]
const { chromium } = require('playwright');
const fs = require('fs');
const base = process.argv[2] || 'http://127.0.0.1:8788/';

(async () => {
  const b = await chromium.launch();
  for (const theme of ['hell', 'dunkel']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme === 'dunkel' ? 'dark' : 'light', hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const seed = fs.readFileSync(__dirname + '/seed.json', 'utf8');
    await p.addInitScript((s) => { if (!localStorage.getItem('mobi.settings')) for (const [k, v] of Object.entries(JSON.parse(s))) localStorage.setItem(k, JSON.stringify(v)); }, seed);
    await p.goto(base, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    if (await p.$('[data-no]')) await p.click('[data-no]');
    const measure = (where) => p.evaluate((where) => {
      const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
      const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
      const rgba = (str) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
      const bgOf = (el) => { let acc = null; for (let n = el; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0) { if (!acc) acc = c; else acc = [0, 1, 2].map((i) => acc[i] * acc[3] + c[i] * (1 - acc[3])).concat([Math.min(1, acc[3] + c[3] * (1 - acc[3]))]); if (acc[3] >= 0.99) break; } } return acc || [255, 255, 255, 1]; };
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      const scope = document.querySelector('#sheet-backdrop:not(.hidden) #sheet') || document.querySelector('.overlay:not(.hidden)') || document.querySelector('.view:not(.hidden)');
      const out = { contrast: {}, targets: {}, inputs: {} };
      for (const el of scope.querySelectorAll('*')) {
        if (!vis(el)) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
        const cs = getComputedStyle(el);
        if (own) {
          const fg = rgba(cs.color), bg = bgOf(el);
          const f = [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
          const l1 = lum(f), l2 = lum(bg);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
          const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
          if (ratio < need) { const k = `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} ${size}px`; if (!out.contrast[k] || out.contrast[k] > ratio) out.contrast[k] = Math.round(ratio * 100) / 100; }
        }
        if (el.matches('button, a, input, select, [role=switch]')) {
          const r = el.getBoundingClientRect();
          if (r.width < 44 || r.height < 44) { const k = `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')}${el.dataset.act ? '[' + el.dataset.act + ']' : ''}`; out.targets[k] = `${Math.round(r.width)}×${Math.round(r.height)}`; }
          if (el.matches('input, select, textarea') && parseFloat(cs.fontSize) < 16) out.inputs[`${el.tagName.toLowerCase()}.${String(el.className)}`] = cs.fontSize;
          if (el.matches('button, a') && !el.innerText.trim() && !el.getAttribute('aria-label')) out.targets[`OHNE NAME ${el.outerHTML.slice(0, 70)}`] = 'kein zugänglicher Name';
        }
      }
      return [where, out];
    }, where);
    const res = [];
    for (const v of ['heute', 'training', 'uebungen', 'verlauf', 'profil']) { await p.click(`.tab[data-view="${v}"]`); await p.waitForTimeout(200); res.push(await measure(v)); }
    await p.click('.tab[data-view="uebungen"]'); await p.click('[data-ex="bankdruecken"]'); await p.waitForTimeout(300); res.push(await measure('detail')); await p.click('[data-close]');
    await p.click('.tab[data-view="heute"]'); await p.click('[data-act="gym"]'); await p.waitForTimeout(300); res.push(await measure('logger'));
    await p.click('[data-check="0:0"]'); await p.waitForTimeout(300);
    const rest = await p.evaluate(() => [...document.querySelectorAll('#rest button')].map((b) => { const r = b.getBoundingClientRect(); return `${Math.round(r.width)}×${Math.round(r.height)}`; }));
    console.log(`\n===== ${theme} =====`);
    const merged = { contrast: {}, targets: {}, inputs: {} };
    for (const [where, o] of res) for (const k of Object.keys(merged)) for (const [n, v] of Object.entries(o[k])) merged[k][n] = `${v}  (${where})`;
    console.log('Kontrast unter Soll:', merged.contrast);
    if (theme === 'hell') { console.log('Tippflächen < 44 px:', merged.targets); console.log('Eingabefelder < 16 px:', merged.inputs); console.log('Pausentimer-Knöpfe:', rest); }
    await ctx.close();
  }
  await b.close();
})();
