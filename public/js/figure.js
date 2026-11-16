// Zeichnet und animiert die mobi-Figuren.
// - Körper als „Mannequin“ aus runden Segmenten, hinteres Bein/Arm heller
// - beanspruchte Muskulatur leuchtet in der Akzentfarbe
// - Geräte (Hantelscheibe, Kurzhantel, Kabel, Polster) folgen den Gelenken
// - Tempo je Übung: [Weg A→B, Halten B, Weg B→A, Halten A] in Sekunden
import { joint } from './rig.js';
import { segmentsFor } from './data/muscles.js';

const NS = 'http://www.w3.org/2000/svg';
const W = { thigh: 12, shin: 9.5, upperArm: 9, forearm: 7.5, torso: 17, head: 12 };
const BASE = [320, 210];

function el(name, attrs, cls) {
  const node = document.createElementNS(NS, name);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (cls) node.setAttribute('class', cls);
  return node;
}

const lerp = (a, b, t) => a + (b - a) * t;

// Zwischenpose: Gelenke wandern auf Bögen, Segmentlängen bleiben erhalten.
function swing(o, oa, pa, ob, pb, t) {
  const va = [pa[0] - oa[0], pa[1] - oa[1]], vb = [pb[0] - ob[0], pb[1] - ob[1]];
  const la = Math.hypot(va[0], va[1]), lb = Math.hypot(vb[0], vb[1]);
  let vx = lerp(va[0], vb[0], t), vy = lerp(va[1], vb[1], t);
  const l = Math.hypot(vx, vy);
  if (l > 0.5) { const k = lerp(la, lb, t) / l; vx *= k; vy *= k; }
  return [o[0] + vx, o[1] + vy];
}

export function lerpPose(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const out = { b: lerp(a.b, b.b, t) };
  out.p = [lerp(a.p[0], b.p[0], t), lerp(a.p[1], b.p[1], t)];
  out.n = swing(out.p, a.p, a.n, b.p, b.n, t);
  out.h = swing(out.n, a.n, a.h, b.n, b.h, t);
  for (const [k, root] of [['aL', 'n'], ['aR', 'n'], ['lL', 'p'], ['lR', 'p']]) {
    const mid = swing(out[root], a[root], a[k][0], b[root], b[k][0], t);
    out[k] = [mid, swing(mid, a[k][0], a[k][1], b[k][0], b[k][1], t)];
  }
  return out;
}

// Torso als quadratische Kurve, in obere und untere Hälfte geteilt (für die Muskel-Hervorhebung).
function torsoHalves(pose) {
  const [nx, ny] = pose.n, [px, py] = pose.p;
  const dx = px - nx, dy = py - ny;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (nx + px) / 2 + (dy / len) * pose.b, cy = (ny + py) / 2 - (dx / len) * pose.b;
  const mx = (nx + 2 * cx + px) / 4, my = (ny + 2 * cy + py) / 4;
  const f = (v) => v.toFixed(1);
  return [
    `M ${f(nx)} ${f(ny)} Q ${f((nx + cx) / 2)} ${f((ny + cy) / 2)} ${f(mx)} ${f(my)}`,
    `M ${f(mx)} ${f(my)} Q ${f((cx + px) / 2)} ${f((cy + py) / 2)} ${f(px)} ${f(py)}`
  ];
}

const seg = (a, b) => `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;

function gearPoints(pose, at) {
  const list = Array.isArray(at) && typeof at[0] === 'string' && at.length === 3 && typeof at[1] === 'number' ? [at] : [].concat(at);
  return list.map((a) => {
    if (Array.isArray(a)) {
      if (typeof a[0] === 'number') return a;
      const j = joint(pose, a[0]);
      return [j[0] + a[1], j[1] + a[2]];
    }
    return joint(pose, a);
  });
}

// Rahmen so wählen, dass beide Posen samt Gerät hineinpassen (Seitenverhältnis bleibt 320:210).
function fitViewBox(ex, ratio = BASE[0] / BASE[1]) {
  let x0 = 150, y0 = 60, x1 = 170, y1 = 204;
  const grow = (x, y, r = 0) => {
    x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r);
    y0 = Math.min(y0, y - r); y1 = Math.max(y1, y + r);
  };
  // Auch die Mitte der Bewegung zählt: Gelenke laufen auf Bögen und können dort am weitesten ausschlagen.
  for (const pose of [ex.poseA, lerpPose(ex.poseA, ex.poseB, 0.5), ex.poseB]) {
    grow(pose.h[0], pose.h[1], W.head + 4);
    for (const k of ['n', 'p']) grow(pose[k][0], pose[k][1], 12);
    for (const k of ['aL', 'aR', 'lL', 'lR']) for (const pt of pose[k]) grow(pt[0], pt[1], 8);
    for (const g of ex.gear || []) {
      const r = g.t === 'plate' ? (g.r || 14) + 3 : 9;
      for (const pt of gearPoints(pose, g.at || g.to)) grow(pt[0], pt[1], r);
      if (g.from) for (const pt of gearPoints(pose, [g.from])) grow(pt[0], pt[1], 6);
    }
  }
  for (const pr of ex.props || []) {
    if (pr[0] === 'line' || pr[0] === 'pad') { grow(pr[1], pr[2], 5); grow(pr[3], pr[4], 5); }
    else if (pr[0] === 'rect') { grow(pr[1], pr[2]); grow(pr[1] + pr[3], pr[2] + pr[4]); }
    else if (pr[0] === 'circle') grow(pr[1], pr[2], pr[3] + 2);
  }
  x0 -= 16; x1 += 16; y0 -= 12; y1 += 4;
  let w = x1 - x0, h = y1 - y0;
  if (w / h < ratio) { const nw = h * ratio; x0 -= (nw - w) / 2; w = nw; }
  else { const nh = w / ratio; y0 -= (nh - h); h = nh; } // Boden bleibt unten
  return `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}

function drawProps(svg, ex) {
  for (const pr of ex.props || []) {
    if (pr[0] === 'line') svg.appendChild(el('path', { d: `M ${pr[1]} ${pr[2]} L ${pr[3]} ${pr[4]}`, 'stroke-width': pr[5] || 4 }, 'fg-prop'));
    else if (pr[0] === 'pad') svg.appendChild(el('path', { d: `M ${pr[1]} ${pr[2]} L ${pr[3]} ${pr[4]}`, 'stroke-width': pr[5] || 9 }, 'fg-pad'));
    else if (pr[0] === 'rect') svg.appendChild(el('rect', { x: pr[1], y: pr[2], width: pr[3], height: pr[4], rx: 6 }, 'fg-box'));
    else if (pr[0] === 'circle') svg.appendChild(el('circle', { cx: pr[1], cy: pr[2], r: pr[3] }, 'fg-box'));
  }
}

function makeGear(svg, ex) {
  const items = [];
  for (const g of ex.gear || []) {
    const count = g.t === 'line' ? 1 : gearPoints(ex.poseA, g.at).length;
    const nodes = [];
    for (let i = 0; i < count; i++) {
      let node;
      if (g.t === 'plate') {
        node = el('g', {});
        node.appendChild(el('circle', { r: g.r || 14 }, 'fg-plate'));
        node.appendChild(el('circle', { r: 3 }, 'fg-hub'));
      } else if (g.t === 'db') {
        node = el('g', {});
        node.appendChild(el('circle', { r: g.r || 6.5 }, 'fg-db'));
      } else if (g.t === 'kb') {
        node = el('g', {});
        node.appendChild(el('circle', { cy: 9, r: 9 }, 'fg-db'));
        node.appendChild(el('path', { d: 'M -5 3 Q 0 -7 5 3' }, 'fg-cable'));
      } else if (g.t === 'pad') {
        node = el('g', {});
        node.appendChild(el('circle', { r: g.r || 6.5 }, 'fg-roller'));
      } else if (g.t === 'grip') {
        node = el('g', {});
        node.appendChild(el('circle', { r: 3.2 }, 'fg-hub'));
      } else if (g.t === 'line') {
        node = el('path', { 'stroke-width': g.w || 2.2 }, g.cls === 'lever' ? 'fg-prop' : 'fg-cable');
      }
      svg.appendChild(node);
      nodes.push(node);
    }
    items.push({ g, nodes });
  }
  return (pose) => {
    for (const { g, nodes } of items) {
      if (g.t === 'line') {
        const a = gearPoints(pose, [g.from])[0], b = gearPoints(pose, [g.to])[0];
        nodes[0].setAttribute('d', seg(a, b));
      } else {
        gearPoints(pose, g.at).forEach((pt, i) => nodes[i].setAttribute('transform', `translate(${pt[0].toFixed(1)} ${pt[1].toFixed(1)})`));
      }
    }
  };
}

// Erzeugt das SVG-Grundgerüst; gibt eine Update-Funktion für Posen zurück.
export function createFigure(svg, ex, opts = {}) {
  svg.setAttribute('viewBox', fitViewBox(ex, opts.ratio));
  svg.setAttribute('class', `fig ${svg.getAttribute('class') || ''}`.trim().replace(/(^| )fig( fig)+/, ' fig'));
  svg.innerHTML = '';
  const hl = segmentsFor(opts.muscles ?? ex.primary ?? []);
  const k = opts.thick ?? 1;
  svg.appendChild(el('path', { d: 'M -200 196 H 520' }, 'fg-ground'));
  drawProps(svg, ex);
  const front = Boolean(ex.front);
  const farCls = front ? 'near' : 'far';
  const mk = (cls, w, on) => el('path', { 'stroke-width': (w * k).toFixed(1) }, `fg ${cls}${on ? ' hl' : ''}`);
  const upperOn = hl.has('chest') || hl.has('upperBack') || hl.has('torso');
  const lowerOn = hl.has('abs') || hl.has('lowerBack') || hl.has('torso');
  const parts = {
    thR: mk(farCls, W.thigh, hl.has('thigh')), shR: mk(farCls, W.shin, hl.has('shin')),
    uaR: mk(farCls, W.upperArm, hl.has('upperArm')), faR: mk(farCls, W.forearm, hl.has('forearm')),
    tU: mk('near', W.torso * (front ? 1.55 : 1), upperOn), tL: mk('near', W.torso * (front ? 1.3 : 1), lowerOn),
    hip: el('circle', { r: (W.torso * (front ? 0.72 : 0.56) * k).toFixed(1) }, `fgf near${hl.has('hip') ? ' hl' : ''}`),
    thL: mk('near', W.thigh, hl.has('thigh')), shL: mk('near', W.shin, hl.has('shin')),
    sh: el('circle', { r: (W.upperArm * 0.72 * k).toFixed(1) }, `fgf near${hl.has('shoulder') ? ' hl' : ''}`),
    sh2: el('circle', { r: (W.upperArm * 0.72 * k).toFixed(1) }, `fgf near${hl.has('shoulder') ? ' hl' : ''}`),
    uaL: mk('near', W.upperArm, hl.has('upperArm')), faL: mk('near', W.forearm, hl.has('forearm')),
    neck: mk('near', 6, false),
    head: el('circle', { r: W.head * (k > 1 ? 1.06 : 1) }, 'fgf near')
  };
  const order = front
    ? ['neck', 'thR', 'shR', 'thL', 'shL', 'tL', 'tU', 'hip', 'sh', 'sh2', 'uaR', 'faR', 'uaL', 'faL', 'head']
    : ['thR', 'shR', 'uaR', 'faR', 'neck', 'tL', 'tU', 'hip', 'thL', 'shL', 'sh', 'uaL', 'faL', 'head'];
  for (const key of order) svg.appendChild(parts[key]);
  const updateGear = makeGear(svg, ex);
  return function update(pose) {
    const [tU, tL] = torsoHalves(pose);
    parts.tU.setAttribute('d', tU);
    parts.tL.setAttribute('d', tL);
    parts.neck.setAttribute('d', seg(pose.n, pose.h));
    // Frontansicht: Arme und Beine setzen an Schulter- bzw. Hüftbreite an.
    const sL = front ? [pose.n[0] - 10, pose.n[1] + 1] : pose.n, sR = front ? [pose.n[0] + 10, pose.n[1] + 1] : pose.n;
    const hL = front ? [pose.p[0] - 6, pose.p[1]] : pose.p, hR = front ? [pose.p[0] + 6, pose.p[1]] : pose.p;
    parts.uaL.setAttribute('d', seg(sL, pose.aL[0])); parts.faL.setAttribute('d', seg(pose.aL[0], pose.aL[1]));
    parts.uaR.setAttribute('d', seg(sR, pose.aR[0])); parts.faR.setAttribute('d', seg(pose.aR[0], pose.aR[1]));
    parts.thL.setAttribute('d', seg(hL, pose.lL[0])); parts.shL.setAttribute('d', seg(pose.lL[0], pose.lL[1]));
    parts.thR.setAttribute('d', seg(hR, pose.lR[0])); parts.shR.setAttribute('d', seg(pose.lR[0], pose.lR[1]));
    parts.hip.setAttribute('cx', pose.p[0]); parts.hip.setAttribute('cy', pose.p[1]);
    parts.sh.setAttribute('cx', sL[0]); parts.sh.setAttribute('cy', sL[1]);
    parts.sh2.setAttribute('cx', sR[0]); parts.sh2.setAttribute('cy', sR[1]);
    parts.head.setAttribute('cx', pose.h[0]); parts.head.setAttribute('cy', pose.h[1]);
    updateGear(pose);
  };
}

// Statische Vorschau. t = 0 → Pose A, 1 → Pose B.
export function renderStatic(svg, ex, opts = {}) {
  const t = opts.t ?? 0;
  createFigure(svg, ex, { thick: 1.15, ...opts })(t ? lerpPose(ex.poseA, ex.poseB, t) : ex.poseA);
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const DEFAULT_TEMPO = [1.6, 0.2, 1.6, 0.2];

// Animierte Figur. onPhase(i) meldet: 0 = Weg A→B, 1 = Halten B, 2 = Weg B→A, 3 = Halten A.
export function animateFigure(svg, ex, opts = {}) {
  const update = createFigure(svg, ex, opts);
  const tempo = ex.tempo || DEFAULT_TEMPO;
  const marks = [tempo[0], tempo[0] + tempo[1], tempo[0] + tempo[1] + tempo[2]];
  const cycle = (marks[2] + tempo[3]) * 1000;
  let raf = null, start = null, last = -1;
  function frame(now) {
    if (start === null) start = now;
    const s = ((now - start) % cycle) / 1000;
    let t, phase;
    if (s < marks[0]) { t = ease(s / tempo[0]); phase = 0; }
    else if (s < marks[1]) { t = 1; phase = 1; }
    else if (s < marks[2]) { t = 1 - ease((s - marks[1]) / tempo[2]); phase = 2; }
    else { t = 0; phase = 3; }
    if (phase !== last) {
      last = phase;
      svg.dataset.phase = phase;
      if (opts.onPhase) opts.onPhase(phase);
    }
    update(lerpPose(ex.poseA, ex.poseB, t));
    raf = requestAnimationFrame(frame);
  }
  update(ex.poseA);
  raf = requestAnimationFrame(frame);
  return () => { if (raf) cancelAnimationFrame(raf); };
}
