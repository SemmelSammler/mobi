// Drei Icon-Entwürfe als Vorschau (wird nicht eingebaut). Aufruf: node tests/icon-ideas.cjs <ordner>
const { chromium } = require('playwright');
const path = require('path');
const outDir = process.argv[2] || '.';

const wrap = (bg, inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="dark" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#2E2821"/><stop offset="1" stop-color="#15120E"/></linearGradient>
    <linearGradient id="cream" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#FFFBF4"/><stop offset="1" stop-color="#F1E7D6"/></linearGradient>
    <linearGradient id="orange" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#F08A45"/><stop offset="1" stop-color="#C24A16"/></linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7934E"/><stop offset="1" stop-color="#DD6327"/></linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#${bg})"/>${inner}</svg>`;

const S = (d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

export_ = {
  // 1 · „Athlet“: die Figur aus der App im tiefen Ausfallschritt mit gestreckten Armen — Kraft und Beweglichkeit in einer Pose.
  athlet: wrap('cream', `
    ${S('M 300 250 L 372 300 L 416 392', '#A2978A', 34)}
    ${S('M 250 150 L 318 96', '#A2978A', 28)}
    ${S('M 246 156 L 290 262', '#221E19', 54)}
    ${S('M 292 258 L 190 300 L 176 398', 'url(#acc)', 38)}
    ${S('M 244 152 L 178 104 L 122 60', '#221E19', 28)}
    <circle cx="214" cy="92" r="38" fill="#221E19"/>
    ${S('M 96 410 H 430', '#D9CDB9', 12)}`),
  // 2 · „Hantel im Schwung“: Kurzhantel, um die ein Bewegungsbogen läuft.
  hantel: wrap('dark', `
    <path d="M 118 300 A 150 150 0 1 1 300 400" fill="none" stroke="url(#acc)" stroke-width="30" stroke-linecap="round"/>
    <circle cx="300" cy="400" r="24" fill="#F7934E"/>
    <g transform="rotate(-38 256 256)">
      <rect x="150" y="238" width="212" height="36" rx="18" fill="#FAF6EF"/>
      <rect x="118" y="182" width="52" height="148" rx="24" fill="#FAF6EF"/>
      <rect x="342" y="182" width="52" height="148" rx="24" fill="#FAF6EF"/>
      <rect x="84" y="210" width="36" height="92" rx="16" fill="#FAF6EF"/>
      <rect x="392" y="210" width="36" height="92" rx="16" fill="#FAF6EF"/>
    </g>`),
  // 3 · „Ring“: Fortschrittsring wie bei einem Trainingsziel, darin das m.
  ring: wrap('orange', `
    <circle cx="256" cy="256" r="168" fill="none" stroke="rgba(34,30,25,.22)" stroke-width="34"/>
    <path d="M 256 88 A 168 168 0 1 1 110 172" fill="none" stroke="#FFF8F0" stroke-width="34" stroke-linecap="round"/>
    ${S('M 188 322 V 244 A 34 34 0 0 1 256 244 V 322 M 256 244 A 34 34 0 0 1 324 244 V 322', '#221E19', 36)}`)
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1180, height: 470 }, deviceScaleFactor: 2 });
  const img = (svg, s) => `<img width="${s}" height="${s}" style="border-radius:${s * 0.225}px;box-shadow:0 6px 18px rgba(0,0,0,.25)" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`;
  const col = (name, i, svg) => `<div style="display:flex;flex-direction:column;align-items:center;gap:16px"><div style="font:600 17px system-ui;color:#fff">${i} · ${name}</div>${img(svg, 270)}<div style="display:flex;gap:18px;align-items:center">${img(svg, 60)}${img(svg, 40)}${img(svg, 29)}</div></div>`;
  await p.setContent(`<body style="margin:0;background:#7E7A74;display:flex;gap:70px;align-items:center;justify-content:center;height:470px">${col('Athlet', 1, export_.athlet)}${col('Hantel im Schwung', 2, export_.hantel)}${col('Ring', 3, export_.ring)}</body>`);
  await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(outDir, 'icon-ideas.png') });
  await b.close();
})();
var export_;
