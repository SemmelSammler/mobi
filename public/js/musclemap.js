// Körperkarte (Vorder- und Rückansicht) mit hervorgehobenen Muskelgruppen.
// Jede Form ist für die rechte Körperhälfte definiert und wird gespiegelt.
const E = (cx, cy, rx, ry, rot = 0) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const P = (d) => `<path d="${d}"/>`;

// Neutraler Körperumriss (rechte Hälfte).
const BODY = [
  P('M0 27 L5 27 L6 31 Q20 31 28 36 Q33 40 33 50 L27 54 Q21 60 18 92 Q20 100 20 108 L0 108 Z'), // Rumpf
  P('M27 37 Q35 40 35 52 L37 76 Q37 82 33 82 L27 80 Q24 60 25 44 Z'), // Oberarm
  P('M28 78 Q37 78 38 86 L41 112 Q41 117 37 117 Q33 117 32 112 Z'), // Unterarm
  E(38.5, 122, 4, 6, -8), // Hand
  P('M0 104 L20 104 Q23 124 20 148 Q19 154 14 154 L6 154 Q2 152 2 146 Z'), // Oberschenkel
  P('M4 152 L18 152 Q20 172 16 196 L8 196 Q3 172 4 152 Z'), // Unterschenkel
  P('M7 196 L17 196 Q20 204 16 205 L7 205 Q5 201 7 196 Z') // Fuß
];
const HEAD = `${E(0, 13, 9.5, 11.5)}<rect x="-4.5" y="22" width="9" height="8" rx="2"/>`;

const FRONT = [
  { m: ['trapez'], s: P('M4.5 26 L17 31.5 L5.5 33 Z') },
  { m: ['schulter_v', 'schulter_s'], s: P('M18 32.5 Q30 33 33 44 Q33 50 29 53 Q24 47 19 44 Q17 38 18 32.5 Z') },
  { m: ['brust'], s: P('M1.2 35 Q9 32.5 17 34 Q18.5 41 23 47 Q21 56 12 57.5 Q5 58 1.2 55 Z') },
  { m: ['bizeps'], s: E(30.5, 62, 5, 11.5, -6) },
  { m: ['unterarm'], s: E(35, 96, 4.6, 15, -8) },
  { m: ['bauch'], s: '<rect x="1.2" y="59.5" width="8.6" height="10" rx="2.6"/><rect x="1.2" y="71" width="8.6" height="10" rx="2.6"/><rect x="1.2" y="82.5" width="8.6" height="14" rx="2.6"/>' },
  { m: ['schraege'], s: P('M11.5 60 Q18 59 21 55 Q19.5 74 18.5 92 Q15 98 11.5 96 Z') },
  { m: ['hueftbeuger'], s: P('M11 99 Q16 100 19 97 Q20.5 104 19 110 Q14 108 9 102 Z') },
  { m: ['adduktoren'], s: P('M1.2 104 L7 104 Q9 122 6 142 Q2.5 128 1.2 114 Z') },
  { m: ['quadrizeps'], s: P('M9.5 106 Q17 111 20.5 113 Q22.5 132 18.5 149 Q13 153 8 149 Q10 128 9.5 106 Z') },
  { m: ['waden'], s: P('M12 156 Q19.5 160 18.5 176 Q17 186 15 190 Q12.5 174 12 156 Z') }
];

const BACK = [
  { m: ['trapez'], s: P('M0 24.5 L5 26 L20 32 Q11 39 6.5 48 L0 66 Z') },
  { m: ['schulter_h', 'schulter_s'], s: P('M21 32.5 Q30 33 33 44 Q33 50 29 53 Q25 46 19.5 42 Q19 37 21 32.5 Z') },
  { m: ['oberer_ruecken'], s: P('M8 48 Q13 39.5 18.5 43 Q23 46.5 22.5 52 Q15 53.5 8.5 58 Z') },
  { m: ['lat'], s: P('M7.5 60 Q15 55.5 23 54 Q22 68 18.5 88 L8 92 Q9 76 7.5 60 Z') },
  { m: ['ruecken_strecker'], s: '<rect x="1" y="68" width="5.6" height="32" rx="2.8"/>' },
  { m: ['trizeps'], s: E(30.5, 61, 5.4, 12.5, -6) },
  { m: ['unterarm'], s: E(35, 96, 4.6, 15, -8) },
  { m: ['abduktoren'], s: P('M9 96 Q16 93.5 19.5 97 Q20.5 101 19.5 104 Q14 100 9 100 Z') },
  { m: ['gesaess'], s: P('M1 103 Q10 99 19 105.5 Q21.5 115 17 121 Q8 124 1 119 Z') },
  { m: ['adduktoren'], s: P('M1.2 122 L5.5 124 Q6 136 4.5 146 Q2 136 1.2 122 Z') },
  { m: ['hamstrings'], s: P('M7.5 124.5 Q14 124 19.5 122 Q22 136 18.5 149.5 Q13 153 8 149.5 Q8.5 138 7.5 124.5 Z') },
  { m: ['waden'], s: P('M5.5 155 Q11 151.5 17.5 155 Q20 168 16.5 181 Q11 185 6.5 181 Q3.5 168 5.5 155 Z') }
];

function half(shapes, primary, secondary) {
  return shapes.map(({ m, s }) => {
    const cls = m.some((x) => primary.has(x)) ? 'mm-p' : m.some((x) => secondary.has(x)) ? 'mm-s' : 'mm-0';
    return `<g class="${cls}" data-m="${m[0]}">${s}</g>`;
  }).join('');
}

function figure(shapes, x, primary, secondary, label) {
  const body = BODY.join('');
  const mus = half(shapes, primary, secondary);
  return `<g transform="translate(${x} 4)">
    <g class="mm-body">${HEAD}${body}<g transform="scale(-1 1)">${body}</g></g>
    ${mus}<g transform="scale(-1 1)">${mus}</g>
    <text x="0" y="221" text-anchor="middle" class="mm-label">${label}</text>
  </g>`;
}

export function muscleMap(primary = [], secondary = []) {
  const p = new Set(primary), s = new Set(secondary.filter((m) => !p.has(m)));
  return `<svg class="mmap" viewBox="0 0 190 232" role="img" aria-label="Beanspruchte Muskulatur">${figure(FRONT, 48, p, s, 'Vorn')}${figure(BACK, 142, p, s, 'Hinten')}</svg>`;
}
