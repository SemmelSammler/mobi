// Erzeugt alle App-Icons aus einer SVG-Vorlage.
// Aufruf: node tests/make-icons.cjs [vorschau-ordner]
// Motiv: ein kleines „m“, dessen Bögen zugleich die Arme einer Figur sind — der Punkt darüber ist der Kopf.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'public', 'icons');
const preview = process.argv[2];

// scale < 1 lässt Rand für maskierbare Icons (Android schneidet Kreise und Tropfen aus).
const art = ({ scale = 1, radius = 0, bg = 'dark' } = {}) => {
  const dark = bg === 'dark';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="${dark ? '#2E2821' : '#E8742F'}"/><stop offset="1" stop-color="${dark ? '#15120E' : '#BF4A17'}"/>
    </linearGradient>
    <linearGradient id="hl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F58A45"/><stop offset="1" stop-color="#DD6327"/></linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="url(#bg)"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <path d="M 132 392 V 262 A 62 62 0 0 1 256 262 V 392 M 256 262 A 62 62 0 0 1 380 262 V 392" fill="none" stroke="${dark ? '#FAF6EF' : '#FFF8F0'}" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="256" cy="124" r="45" fill="${dark ? 'url(#hl)' : '#221E19'}"/>
  </g>
</svg>`;
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  const png = async (svg, size, file) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<body style="margin:0;background:transparent"><img width="${size}" height="${size}" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body>`);
    await p.waitForTimeout(80);
    await p.screenshot({ path: file, omitBackground: true });
  };
  const bg = process.env.ICON_BG || 'dark';
  await png(art({ bg }), 512, path.join(out, 'icon-512.png'));
  await png(art({ bg }), 192, path.join(out, 'icon-192.png'));
  await png(art({ bg, scale: 0.9 }), 180, path.join(out, 'apple-touch-icon.png')); // iOS rundet die Ecken selbst
  await png(art({ bg, scale: 0.72 }), 512, path.join(out, 'maskable-512.png'));
  fs.writeFileSync(path.join(out, 'favicon.svg'), art({ bg, radius: 112 }));
  if (preview) {
    // Vorschau: beide Varianten, groß und in Home-Bildschirm-Größe
    const cell = (v, s) => `<img width="${s}" height="${s}" style="border-radius:${s * 0.225}px" src="data:image/svg+xml;base64,${Buffer.from(art({ bg: v, scale: 0.9 })).toString('base64')}">`;
    await p.setViewportSize({ width: 900, height: 420 });
    await p.setContent(`<body style="margin:0;background:#8E8A84;display:flex;gap:28px;align-items:center;justify-content:center;height:420px">${['dark', 'orange'].map((v) => cell(v, 260) + cell(v, 60) + cell(v, 29)).join('')}</body>`);
    await p.waitForTimeout(100);
    await p.screenshot({ path: path.join(preview, 'icons.png') });
  }
  await b.close();
  console.log('Icons geschrieben nach', out);
})();
