// Zeichnet und animiert die mobi-Strichfiguren (Posen-Interpolation A↔B).
const NS = 'http://www.w3.org/2000/svg';
const INK = '#2B2620';
const INK_FAR = '#7A7061';
const GROUND = '#DCD1BE';
const PROP = '#C9BEA9';
const PROP_FILL = '#EBE3D2';
const ACCENT = '#E1793C';

function el(name, attrs) {
  const node = document.createElementNS(NS, name);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpPose(a, b, t) {
  const out = {};
  for (const k of ['h', 'n', 'p']) out[k] = [lerp(a[k][0], b[k][0], t), lerp(a[k][1], b[k][1], t)];
  out.b = lerp(a.b, b.b, t);
  for (const k of ['aL', 'aR', 'lL', 'lR']) {
    out[k] = a[k].map((pt, i) => [lerp(pt[0], b[k][i][0], t), lerp(pt[1], b[k][i][1], t)]);
  }
  return out;
}

function torsoPath(pose) {
  const [nx, ny] = pose.n;
  const [px, py] = pose.p;
  const mx = (nx + px) / 2, my = (ny + py) / 2;
  const dx = px - nx, dy = py - ny;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (dy / len) * pose.b;
  const cy = my - (dx / len) * pose.b;
  return `M ${nx} ${ny} Q ${cx} ${cy} ${px} ${py}`;
}

function limbPath(origin, pts) {
  return `M ${origin[0]} ${origin[1]} L ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
}

// Erzeugt das SVG-Grundgerüst einer Figur; gibt Update-Funktion für Posen zurück.
export function createFigure(svg, ex, strokeWidth = 5.5) {
  svg.setAttribute('viewBox', '0 0 320 210');
  svg.innerHTML = '';
  svg.appendChild(el('path', { d: 'M 24 196 H 296', stroke: GROUND, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }));
  for (const prop of ex.props || []) {
    if (prop[0] === 'line') {
      svg.appendChild(el('path', { d: `M ${prop[1]} ${prop[2]} L ${prop[3]} ${prop[4]}`, stroke: PROP, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }));
    } else if (prop[0] === 'rect') {
      svg.appendChild(el('rect', { x: prop[1], y: prop[2], width: prop[3], height: prop[4], rx: 6, fill: PROP_FILL, stroke: PROP, 'stroke-width': 2.5 }));
    }
  }
  const stroke = (color, w) => ({ stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' });
  const parts = {
    lR: el('path', stroke(INK_FAR, strokeWidth)),
    aR: el('path', stroke(INK_FAR, strokeWidth)),
    torso: el('path', stroke(INK, strokeWidth + 0.5)),
    lL: el('path', stroke(INK, strokeWidth)),
    aL: el('path', stroke(INK, strokeWidth)),
    head: el('circle', { r: 13, fill: INK })
  };
  for (const k of ['lR', 'aR', 'torso', 'lL', 'aL', 'head']) svg.appendChild(parts[k]);
  if (ex.accent) {
    svg.appendChild(el('circle', { cx: ex.accent[0], cy: ex.accent[1], r: 7, fill: ACCENT }));
  }
  return function update(pose) {
    parts.torso.setAttribute('d', torsoPath(pose));
    parts.aL.setAttribute('d', limbPath(pose.n, pose.aL));
    parts.aR.setAttribute('d', limbPath(pose.n, pose.aR));
    parts.lL.setAttribute('d', limbPath(pose.p, pose.lL));
    parts.lR.setAttribute('d', limbPath(pose.p, pose.lR));
    parts.head.setAttribute('cx', pose.h[0]);
    parts.head.setAttribute('cy', pose.h[1]);
  };
}

// Statische Vorschau (Pose A)
export function renderStatic(svg, ex, strokeWidth = 7) {
  createFigure(svg, ex, strokeWidth)(ex.poseA);
}

// Animierte Figur: weiches Ping-Pong zwischen Pose A und B.
export function animateFigure(svg, ex) {
  const update = createFigure(svg, ex);
  let raf = null;
  let start = null;
  const CYCLE = 3600; // ms für A→B→A
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function frame(now) {
    if (start === null) start = now;
    const ph = ((now - start) % CYCLE) / CYCLE;
    const t = ph < 0.5 ? ease(ph * 2) : ease(2 - ph * 2);
    update(lerpPose(ex.poseA, ex.poseB, t));
    raf = requestAnimationFrame(frame);
  }
  update(ex.poseA);
  raf = requestAnimationFrame(frame);
  return () => { if (raf) cancelAnimationFrame(raf); };
}
