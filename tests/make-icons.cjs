// Erzeugt alle App-Icons aus einer SVG-Vorlage.
// Aufruf: node tests/make-icons.cjs [vorschau-ordner]
// Motiv „Hantel im Schwung“: Kurzhantel, um die ein Bewegungsbogen läuft — Kraft und Beweglichkeit.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'public', 'icons');
const preview = process.argv[2];

// scale < 1 lässt Rand für maskierbare Icons (Android schneidet Kreise und Tropfen aus).
const art = ({ scale = 1, radius = 0 } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#2E2821"/><stop offset="1" stop-color="#15120E"/></linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7934E"/><stop offset="1" stop-color="#DD6327"/></linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="url(#bg)"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <path d="M 118 300 A 150 150 0 1 1 300 400" fill="none" stroke="url(#acc)" stroke-width="30" stroke-linecap="round"/>
    <circle cx="300" cy="400" r="24" fill="#F7934E"/>
    <g transform="rotate(-38 256 256)" fill="#FAF6EF">
      <rect x="150" y="238" width="212" height="36" rx="18"/>
      <rect x="118" y="182" width="52" height="148" rx="24"/>
      <rect x="342" y="182" width="52" height="148" rx="24"/>
      <rect x="84" y="210" width="36" height="92" rx="16"/>
      <rect x="392" y="210" width="36" height="92" rx="16"/>
    </g>
  </g>
</svg>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  const png = async (svg, size, file) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<body style="margin:0;background:transparent"><img width="${size}" height="${size}" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body>`);
    await p.waitForTimeout(80);
    await p.screenshot({ path: file, omitBackground: true });
  };
  await png(art({ scale: 1.08 }), 512, path.join(out, 'icon-512.png'));
  await png(art({ scale: 1.08 }), 192, path.join(out, 'icon-192.png'));
  await png(art({ scale: 1.04 }), 180, path.join(out, 'apple-touch-icon.png')); // iOS rundet die Ecken selbst
  await png(art({ scale: 0.8 }), 512, path.join(out, 'maskable-512.png'));
  fs.writeFileSync(path.join(out, 'favicon.svg'), art({ scale: 1.08, radius: 112 }));
  if (preview) {
    const cell = (file, s, r) => `<img width="${s}" height="${s}" style="border-radius:${r}" src="data:image/png;base64,${fs.readFileSync(path.join(out, file)).toString('base64')}">`;
    await p.setViewportSize({ width: 760, height: 340 });
    await p.setContent(`<body style="margin:0;background:#7E7A74;display:flex;gap:30px;align-items:center;justify-content:center;height:340px">${cell('apple-touch-icon.png', 220, '22.5%')}${cell('apple-touch-icon.png', 60, '22.5%')}${cell('apple-touch-icon.png', 29, '22.5%')}${cell('maskable-512.png', 150, '50%')}</body>`);
    await p.waitForTimeout(100);
    await p.screenshot({ path: path.join(preview, 'icons.png') });
  }
  await b.close();
  console.log('Icons geschrieben nach', out);
})();
