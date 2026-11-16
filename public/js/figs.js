// Bewegungsvorlagen für Kraftübungen. Jede Vorlage liefert Start-/Endpose,
// feste Geräte (props), mitbewegte Geräte (gear) und das Standard-Tempo.
// Seitenansicht: Figur blickt nach links. Frontansicht: front = true.
import { rig, LEN, GROUND } from './rig.js';

const G = GROUND;
const FOOT = ['footL', 172, G];

// ---------- Hilfen für feste Geräte ----------
const flatBench = (x1, x2, y) => [['pad', x1, y, x2, y, 9], ['line', x1 + 12, y + 6, x1 + 12, G, 3.5], ['line', x2 - 12, y + 6, x2 - 12, G, 3.5]];
const seat = (x1, x2, y) => [['pad', x1, y, x2, y, 8], ['line', (x1 + x2) / 2, y + 5, (x1 + x2) / 2, G, 3.5]];
const backPad = (x1, y1, x2, y2) => [['pad', x1, y1, x2, y2, 8]];
const tower = (x, top = 6) => [['line', x, top, x, G, 5]];

// ---------- Frontansicht ----------
const SO = 10, HO = 6; // halbe Schulter- und Hüftbreite
const rad = (d) => (d * Math.PI) / 180;
function ik(o, t, l1, l2, bend) {
  const dx = t[0] - o[0], dy = t[1] - o[1];
  const d = Math.hypot(dx, dy) || 0.001;
  const dc = Math.min(l1 + l2 - 0.5, Math.max(Math.abs(l1 - l2) + 0.5, d));
  const ux = dx / d, uy = dy / d;
  const a = (l1 * l1 - l2 * l2 + dc * dc) / (2 * dc);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return [[o[0] + ux * a - uy * h * bend, o[1] + uy * a + ux * h * bend], [o[0] + ux * dc, o[1] + uy * dc]];
}
// spec: { n, torso (Länge), arm:[a1,a2] | hands:[dx,dy], bend, leg:[a1,a2] | knees/feet }
function front(spec) {
  const n = spec.n ?? [160, 58];
  const p = spec.p ?? [n[0], n[1] + (spec.torso ?? LEN.torso)];
  const h = [n[0] + (spec.headDx ?? 0), n[1] - LEN.head];
  const side = (s) => {
    const sh = [n[0] + s * SO, n[1] + 1], hp = [p[0] + s * HO, p[1]];
    let arm, leg;
    const armSpec = (s < 0 ? spec.armL : spec.armR) ?? spec.arm;
    const handSpec = (s < 0 ? spec.handL : spec.handR) ?? (spec.hands && [n[0] + s * spec.hands[0], n[1] + spec.hands[1]]);
    if (handSpec) arm = ik(sh, handSpec, LEN.upperArm, LEN.forearm, (spec.bend ?? 1) * s);
    else {
      const a = armSpec ?? [6, 3];
      const e = [sh[0] + s * Math.sin(rad(a[0])) * LEN.upperArm, sh[1] + Math.cos(rad(a[0])) * LEN.upperArm];
      arm = [e, [e[0] + s * Math.sin(rad(a[1])) * LEN.forearm, e[1] + Math.cos(rad(a[1])) * LEN.forearm]];
    }
    if (spec.knees) leg = [[p[0] + s * spec.knees[0], spec.knees[1]], [p[0] + s * spec.feet[0], spec.feet[1]]];
    else {
      const a = spec.leg ?? [5, 2];
      const k = [hp[0] + s * Math.sin(rad(a[0])) * LEN.thigh, hp[1] + Math.cos(rad(a[0])) * LEN.thigh];
      leg = [k, [k[0] + s * Math.sin(rad(a[1])) * LEN.shin, k[1] + Math.cos(rad(a[1])) * LEN.shin]];
    }
    return { arm, leg };
  };
  const L = side(-1), R = side(1);
  return { h, n, p, b: 0, aL: L.arm, aR: R.arm, lL: L.leg, lR: R.leg };
}

const TEMPO = { kraft: [2.2, 0.3, 1.2, 0.4], zug: [1.2, 0.5, 2.2, 0.3], halten: [2.4, 0.4, 2.4, 0.4] };
// Kraftübungen starten gestreckt (A) und senken ab (B): erst exzentrisch, dann konzentrisch.
const fig = (a, b, extra = {}) => ({ poseA: a, poseB: b, tempo: TEMPO.kraft, ...extra });

export const FIGS = {
  // ---------- Beine ----------
  squat({ bar = 'back', pad = false } = {}) {
    const arms = bar === 'back' ? { rel: 'n', d: [-7, 3], bend: 1 } : bar === 'front' ? { rel: 'n', d: [9, 0], bend: -1 } : bar === 'goblet' ? { rel: 'n', d: [13, -13], bend: 1 } : [4, 8];
    const gear = bar === 'back' ? [{ t: 'plate', at: ['n', 7, -3], r: 15 }] : bar === 'front' ? [{ t: 'plate', at: ['n', -9, 0], r: 15 }] : bar === 'goblet' ? [{ t: 'db', at: ['handL'], r: 9 }] : [];
    return fig(
      rig({ pin: FOOT, torso: bar === 'back' ? 174 : 177, legL: [3, -3], armL: arms }),
      rig({ pin: FOOT, torso: bar === 'back' ? 138 : 152, legL: [98, -30], armL: arms }),
      { gear, props: pad ? [['pad', 196, 60, 236, 150, 7]] : [] }
    );
  },
  legPress() {
    const p = [214, 168];
    const arms = [-30, 20];
    const mk = (foot) => rig({ p, torso: -132, legL: { at: foot, bend: 1 }, legR: { at: [foot[0] + 3, foot[1] + 5], bend: 1 }, armL: arms });
    return {
      poseA: mk([150, 112]), poseB: mk([176, 128]), tempo: TEMPO.kraft,
      props: [['pad', 222, 178, 262, 128, 8], ['pad', 196, 180, 226, 180, 8], ['line', 120, 84, 236, 190, 3]],
      gear: [{ t: 'line', from: ['footL', -9, -15], to: ['footL', 9, 17], w: 6, cls: 'lever' }]
    };
  },
  splitSquat({ elevated = false } = {}) {
    const rear = elevated ? [226, 150] : [222, G];
    const mk = (py) => rig({ p: [176, py], torso: 172, legL: { at: [132, G], bend: -1 }, legR: { at: rear, bend: -1 }, armL: [2, 4] });
    return fig(mk(118), mk(elevated ? 148 : 152), { props: elevated ? flatBench(214, 280, 152) : [], gear: [{ t: 'db', at: ['handL', 'handR'] }] });
  },
  lunge() {
    return fig(
      rig({ pin: ['footL', 168, G], torso: 178, legL: [3, -3], armL: [2, 4] }),
      rig({ p: [172, 152], torso: 174, legL: { at: [128, G], bend: -1 }, legR: { at: [224, G], bend: -1 }, armL: [2, 4] }),
      { gear: [{ t: 'db', at: ['handL', 'handR'] }] }
    );
  },
  stepUp() {
    return fig(
      rig({ p: [176, 126], torso: 168, legL: { at: [132, 156], bend: -1 }, legR: { at: [196, G], bend: -1 }, armL: [2, 4] }),
      rig({ p: [140, 76], torso: 178, legL: { at: [134, 156], bend: -1 }, legR: [-14, -30], armL: [2, 4] }),
      { props: [['rect', 96, 156, 70, 40]], gear: [{ t: 'db', at: ['handL', 'handR'] }], tempo: [1.2, 0.4, 2.2, 0.3] }
    );
  },
  legExtension() {
    const p = [196, 138];
    const mk = (shin) => rig({ p, torso: -170, legL: [88, shin], armL: [-12, 30] });
    return {
      poseA: mk(-12), poseB: mk(82), tempo: [1.2, 0.6, 2.2, 0.3],
      props: [...seat(160, 204, 150), ...backPad(210, 142, 222, 80)],
      gear: [{ t: 'pad', at: [['footL', -7, -4]] }]
    };
  },
  legCurlLying() {
    const p = [176, 148];
    const mk = (shin) => rig({ p, torso: 92, head: 110, legL: [-88, shin], armL: [40, 100] });
    return {
      poseA: mk(-90), poseB: mk(-208), tempo: [1.2, 0.6, 2.2, 0.3],
      props: flatBench(96, 222, 162),
      gear: [{ t: 'pad', at: [['footL', 0, 8]] }]
    };
  },
  legCurlSeated() {
    const p = [196, 138];
    const mk = (shin) => rig({ p, torso: -170, legL: [88, shin], armL: [-12, 30] });
    return {
      poseA: mk(78), poseB: mk(-40), tempo: [1.2, 0.6, 2.2, 0.3],
      props: [...seat(160, 204, 150), ...backPad(210, 142, 222, 80), ['pad', 150, 124, 172, 124, 6]],
      gear: [{ t: 'pad', at: [['footL', 4, 8]] }]
    };
  },
  hipThrust() {
    const nAt = [124, 140];
    const mk = (p) => rig({ p, nAt, legL: { at: [224, G], bend: -1 }, armL: { rel: 'p', d: [-2, 14], bend: -1 } });
    return {
      poseA: mk([180, 142]), poseB: mk([174, 176]), tempo: [2, 0.2, 1.2, 0.8],
      props: [['rect', 70, 146, 50, 50]],
      gear: [{ t: 'plate', at: ['p', 3, -13], r: 17 }]
    };
  },
  deadlift({ rdl = false } = {}) {
    if (rdl) {
      return fig(
        rig({ pin: FOOT, torso: 177, legL: [3, -3], armL: [2, 2], far: 0 }),
        rig({ pin: FOOT, torso: 104, legL: [24, -14], armL: [0, 0], far: 0 }),
        { gear: [{ t: 'plate', at: 'handL', r: 14 }] }
      );
    }
    // Start oben, kontrolliert zum Boden, wieder heben.
    return fig(
      rig({ pin: FOOT, torso: 177, legL: [3, -3], armL: [2, 2], far: 0 }),
      rig({ pin: FOOT, torso: 116, legL: [54, -12], armL: { at: [160, 175], bend: 1 }, far: 0 }),
      { gear: [{ t: 'plate', at: 'handL', r: 20 }], tempo: [2, 0.4, 1.4, 0.6] }
    );
  },
  goodMorning() {
    const arms = { rel: 'n', d: [-7, 3], bend: 1 };
    return fig(
      rig({ pin: FOOT, torso: 175, legL: [3, -3], armL: arms }),
      rig({ pin: FOOT, torso: 108, legL: [22, -12], armL: arms }),
      { gear: [{ t: 'plate', at: ['n', 7, -3], r: 13 }] }
    );
  },
  kbSwing() {
    return {
      poseA: rig({ pin: FOOT, torso: 112, legL: [34, -14], armL: [-22, -30], far: 0 }),
      poseB: rig({ pin: FOOT, torso: 178, legL: [3, -3], armL: [88, 90], far: 0 }),
      tempo: [0.7, 0.2, 0.8, 0.1], gear: [{ t: 'kb', at: 'handL' }]
    };
  },
  calfRaise({ seated = false } = {}) {
    if (seated) {
      const p = [200, 146];
      const mk = (fy) => rig({ p, torso: 172, legL: { at: [150, fy], bend: -1 }, armL: [70, 100] });
      return {
        poseA: mk(190), poseB: mk(180), tempo: [1, 0.8, 2, 0.6],
        props: [...seat(180, 216, 158), ['rect', 126, 190, 40, 6]],
        gear: [{ t: 'pad', at: [['kneeL', 0, -11]], r: 6 }, { t: 'line', from: [140, 190], to: ['footL', 6, 0], w: 6, cls: 'lever' }]
      };
    }
    const mk = (fy) => rig({ pin: ['footL', 170, fy], torso: 178, legL: [2, -2], armL: [30, 120] });
    return {
      poseA: mk(190), poseB: mk(176), tempo: [1, 0.8, 2, 0.6],
      props: [['rect', 124, 186, 50, 10]],
      gear: [{ t: 'pad', at: [['n', 0, -10]], r: 6 }, { t: 'line', from: [156, 186], to: ['footL', 4, 0], w: 6, cls: 'lever' }]
    };
  },
  gluteKickback() {
    const base = { pin: ['footR', 176, G], torso: 150, legR: [4, -4], armL: [80, 95] };
    return {
      poseA: rig({ ...base, legL: [10, -8] }), poseB: rig({ ...base, legL: [-42, -52] }),
      tempo: [1.2, 0.6, 2, 0.3], props: tower(96), gear: [{ t: 'line', from: [96, 188], to: 'footL' }]
    };
  },
  nordic() {
    const pin = ['kneeL', 196, 190];
    return {
      poseA: rig({ pin, torso: 180, legL: [0, -90], armL: [20, 150] }),
      poseB: rig({ pin, torso: 112, legL: [-66, -90], armL: [60, 120] }),
      tempo: [3.5, 0.2, 1.2, 0.5], props: [['pad', 226, 180, 250, 180, 7], ['rect', 150, 192, 70, 4]]
    };
  },
  backExtension() {
    const pin = ['footL', 236, 188];
    return {
      poseA: rig({ pin, torso: 128, legL: [-52, -52], armL: { rel: 'n', d: [6, -14], bend: 1 } }),
      poseB: rig({ pin, torso: 46, legL: [-52, -52], armL: { rel: 'n', d: [6, -14], bend: 1 }, b: 6 }),
      tempo: TEMPO.kraft, props: [['pad', 164, 128, 186, 146, 9], ['line', 176, 140, 200, G, 3.5], ['line', 240, 192, 200, G, 3.5]]
    };
  },
  abductor({ inward = false } = {}) {
    const mk = (k) => front({ n: [160, 70], torso: 62, arm: [14, -10], knees: [k, 156], feet: [k + 2, G] });
    const open = mk(44), closed = mk(11);
    return {
      front: true, poseA: inward ? open : closed, poseB: inward ? closed : open, tempo: [1.2, 0.6, 2.2, 0.3],
      props: [['pad', 132, 140, 188, 140, 8], ['pad', 160, 132, 160, 64, 30]],
      gear: [{ t: 'pad', at: [['kneeL', inward ? 9 : -9, 0], ['kneeR', inward ? -9 : 9, 0]], r: 6 }]
    };
  },

  // ---------- Drücken ----------
  benchPress({ incline = false, db = false } = {}) {
    const gear = db ? [{ t: 'db', at: ['handL'], r: 8 }] : [{ t: 'plate', at: 'handL', r: 15 }];
    if (incline) {
      const p = [200, 152];
      const mk = (arm) => rig({ p, torso: 122, legL: { at: [150, G], bend: -1 }, armL: arm, far: 0 });
      return fig(mk([178, 180]), mk([-70, 176]), { gear, props: [['pad', 206, 164, 150, 126, 9], ...seat(196, 226, 166), ['line', 150, 132, 150, G, 3.5]] });
    }
    const p = [190, 140];
    const mk = (arm) => rig({ p, torso: 90, legL: { at: [236, G], bend: -1 }, armL: arm, far: 0 });
    return fig(mk([180, 180]), mk([-52, 180]), { gear, props: flatBench(92, 204, 153) });
  },
  machinePress({ overhead = false } = {}) {
    const p = [196, 146];
    const base = { p, torso: -174, legL: { at: [150, G], bend: -1 } };
    const props = [...seat(170, 210, 158), ...backPad(212, 150, 218, 84)];
    if (overhead) {
      return fig(
        rig({ ...base, armL: [174, 178] }), rig({ ...base, armL: { rel: 'n', d: [12, 4], bend: -1 } }),
        { props, gear: [{ t: 'grip', at: ['handL'] }, { t: 'line', from: [240, 40], to: 'handL', cls: 'lever', w: 3.5 }] }
      );
    }
    return fig(
      rig({ ...base, armL: [86, 88] }), rig({ ...base, armL: { rel: 'n', d: [14, -14], bend: -1 } }),
      { props, gear: [{ t: 'grip', at: ['handL'] }, { t: 'line', from: [196, 22], to: 'handL', cls: 'lever', w: 3.5 }] }
    );
  },
  overheadPress({ db = false, seated = false } = {}) {
    const gear = db ? [{ t: 'db', at: ['handL'], r: 8 }] : [{ t: 'plate', at: 'handL', r: 13 }];
    const low = { rel: 'n', d: [11, 3], bend: -1 };
    if (seated) {
      const base = { p: [196, 146], torso: -177, legL: { at: [152, G], bend: -1 } };
      return fig(rig({ ...base, armL: [176, 180] }), rig({ ...base, armL: low }), { gear, props: [...seat(170, 210, 158), ...backPad(212, 150, 214, 84)] });
    }
    return fig(rig({ pin: FOOT, torso: 179, legL: [2, -2], armL: [176, 180] }), rig({ pin: FOOT, torso: 179, legL: [2, -2], armL: low }), { gear });
  },
  pushUp() {
    return fig(
      rig({ p: [176, 163], nAt: [118, 137], armL: { at: [118, G], bend: -1 }, legL: { at: [262, G], bend: 1 }, far: 0 }),
      rig({ p: [180, 184], nAt: [118, 174], armL: { at: [118, G], bend: -1 }, legL: { at: [262, G], bend: 1 }, far: 0 })
    );
  },
  dip() {
    const pin = ['handL', 160, 116];
    return fig(
      rig({ pin, torso: 172, legL: [-8, -70], armL: [0, 0], far: 0 }),
      rig({ pin, torso: 158, legL: [-4, -70], armL: [-62, 12], far: 0 }),
      { props: [['line', 126, 116, 196, 116, 5], ['line', 190, 116, 190, G, 4]] }
    );
  },
  frontRaise() {
    return {
      poseA: rig({ pin: FOOT, torso: 179, legL: [2, -2], armL: [3, 4] }), poseB: rig({ pin: FOOT, torso: 179, legL: [2, -2], armL: [90, 92] }),
      tempo: TEMPO.zug, gear: [{ t: 'db', at: ['handL'] }]
    };
  },
  lateralRaise({ cable = false } = {}) {
    const a = front({ arm: [8, 4] }), b = front({ arm: [84, 90] });
    if (cable) {
      const a2 = front({ armL: [8, 4], armR: [6, -14] }), b2 = front({ armL: [8, 4], armR: [84, 90] });
      return { front: true, poseA: a2, poseB: b2, tempo: TEMPO.zug, props: tower(92, 120), gear: [{ t: 'line', from: [92, 186], to: 'handR' }, { t: 'grip', at: ['handR'] }] };
    }
    return { front: true, poseA: a, poseB: b, tempo: TEMPO.zug, gear: [{ t: 'db', at: ['handL', 'handR'] }] };
  },
  shrug() {
    return {
      front: true, poseA: front({ n: [160, 60], p: [160, 122], arm: [6, 2] }), poseB: front({ n: [160, 52], p: [160, 122], arm: [6, 2] }),
      tempo: [1, 0.8, 1.8, 0.3], gear: [{ t: 'db', at: ['handL', 'handR'], r: 8 }]
    };
  },
  cableFly({ lowToHigh = false } = {}) {
    const wide = lowToHigh ? [44, 60] : [112, 100];
    const a = front({ arm: wide }), b = front({ hands: lowToHigh ? [4, -2] : [4, 48], bend: lowToHigh ? -1 : 1 });
    const y = lowToHigh ? 176 : 22;
    return {
      front: true, poseA: a, poseB: b, tempo: TEMPO.zug, props: [...tower(64), ...tower(256)],
      gear: [{ t: 'line', from: [64, y], to: 'handL' }, { t: 'line', from: [256, y], to: 'handR' }, { t: 'grip', at: ['handL', 'handR'] }]
    };
  },
  pecDeck({ reverse = false } = {}) {
    const seatProps = [['pad', 136, 134, 184, 134, 8], ['pad', 160, 126, 160, 60, 26]];
    const open = front({ n: [160, 66], torso: 60, arm: [86, reverse ? 90 : 176], knees: [14, 152], feet: [16, G] });
    const closed = front({ n: [160, 66], torso: 60, hands: [5, 4], bend: 1, knees: [14, 152], feet: [16, G] });
    return { front: true, poseA: reverse ? closed : open, poseB: reverse ? open : closed, tempo: TEMPO.zug, props: seatProps, gear: [{ t: 'grip', at: ['handL', 'handR'] }] };
  },

  // ---------- Ziehen ----------
  pullUp() {
    const bar = -6;
    const mk = (ny) => front({ n: [160, ny], handL: [126, bar], handR: [194, bar], bend: 1, leg: [3, -8] });
    return {
      front: true, poseA: mk(56), poseB: mk(14), tempo: [1.2, 0.4, 2.4, 0.4],
      props: [['line', 96, bar, 224, bar, 5]]
    };
  },
  pulldown({ close = false } = {}) {
    const w = close ? 12 : 36;
    const mk = (hy) => front({ n: [160, 82], torso: 58, handL: [160 - w, hy], handR: [160 + w, hy], bend: 1, knees: [13, 156], feet: [15, G] });
    return {
      front: true, poseA: mk(24), poseB: mk(close ? 80 : 74), tempo: [1.2, 0.5, 2.4, 0.3],
      props: [['pad', 136, 142, 184, 142, 8]],
      gear: [{ t: 'line', from: ['handL', -12, 0], to: ['handR', 12, 0], w: 4, cls: 'lever' }, { t: 'line', from: [160, -10], to: 'hands' }]
    };
  },
  bentRow({ tbar = false } = {}) {
    const base = { pin: FOOT, torso: 112, legL: [24, -14], far: 0 };
    return {
      poseA: rig({ ...base, armL: [0, 0] }), poseB: rig({ ...base, armL: [-78, 14] }), tempo: TEMPO.zug,
      gear: tbar ? [{ t: 'plate', at: 'handL', r: 13 }, { t: 'line', from: [236, 192], to: 'handL', cls: 'lever', w: 3.5 }] : [{ t: 'plate', at: 'handL', r: 14 }]
    };
  },
  oneArmRow() {
    const base = { pin: ['footL', 196, G], torso: 96, legL: [12, -10], legR: [50, -70], armR: [2, 2] };
    return {
      poseA: rig({ ...base, armL: [0, 0] }), poseB: rig({ ...base, armL: [-82, 8] }), tempo: TEMPO.zug,
      props: flatBench(92, 190, 164), gear: [{ t: 'db', at: ['handL'], r: 8 }]
    };
  },
  seatedRow({ machine = false } = {}) {
    const p = [206, 150];
    const base = { p, legL: machine ? { at: [164, G], bend: -1 } : [78, 74] };
    const a = rig({ ...base, torso: 170, armL: [86, 88], far: 0 }), b = rig({ ...base, torso: 180, armL: [-46, 84], far: 0 });
    if (machine) {
      return { poseA: a, poseB: b, tempo: TEMPO.zug, props: [...seat(184, 222, 162), ['pad', 172, 96, 172, 132, 8], ['line', 172, 132, 172, G, 3.5]], gear: [{ t: 'grip', at: ['handL'] }, { t: 'line', from: [150, 190], to: 'handL', cls: 'lever', w: 3.5 }] };
    }
    return { poseA: a, poseB: b, tempo: TEMPO.zug, props: [['pad', 150, 162, 226, 162, 8], ['line', 110, 132, 122, 176, 6], ...tower(84, 60)], gear: [{ t: 'line', from: [84, 110], to: 'handL' }, { t: 'grip', at: ['handL'] }] };
  },
  straightArmPulldown() {
    const base = { pin: FOOT, torso: 162, legL: [8, -6], far: 0 };
    return {
      poseA: rig({ ...base, armL: [128, 132] }), poseB: rig({ ...base, armL: [16, 10] }), tempo: TEMPO.zug,
      props: tower(84), gear: [{ t: 'line', from: [84, 14], to: 'handL' }, { t: 'grip', at: ['handL'] }]
    };
  },
  facePull() {
    const base = { pin: ['footL', 188, G], torso: 184, legL: [6, -4], far: 0 };
    return {
      poseA: rig({ ...base, armL: [96, 98] }), poseB: rig({ ...base, armL: { rel: 'h', d: [-2, 3], bend: -1 } }), tempo: TEMPO.zug,
      props: tower(70), gear: [{ t: 'line', from: [70, 44], to: 'handL' }, { t: 'grip', at: ['handL'] }]
    };
  },

  // ---------- Arme ----------
  curl({ tool = 'bar' } = {}) {
    const base = { pin: FOOT, torso: 180, legL: [2, -2], far: 0 };
    const gear = tool === 'bar' ? [{ t: 'plate', at: 'handL', r: 11 }] : tool === 'cable' ? [{ t: 'line', from: [96, 190], to: 'handL' }, { t: 'grip', at: ['handL'] }] : [{ t: 'db', at: ['handL'] }];
    return { poseA: rig({ ...base, armL: [3, 8] }), poseB: rig({ ...base, armL: [6, 158] }), tempo: TEMPO.zug, gear, props: tool === 'cable' ? tower(96, 150) : [] };
  },
  inclineCurl() {
    const p = [196, 152];
    const base = { p, torso: -148, legL: { at: [150, G], bend: -1 }, far: 0 };
    return {
      poseA: rig({ ...base, armL: [-6, 2] }), poseB: rig({ ...base, armL: [-6, 150] }), tempo: TEMPO.zug,
      props: [['pad', 204, 164, 246, 100, 9], ...seat(182, 214, 166)], gear: [{ t: 'db', at: ['handL'] }]
    };
  },
  preacherCurl() {
    const p = [206, 150];
    const base = { p, torso: 160, legL: { at: [166, G], bend: -1 }, far: 0 };
    return {
      poseA: rig({ ...base, armL: [58, 62] }), poseB: rig({ ...base, armL: [58, 170] }), tempo: TEMPO.zug,
      props: [...seat(190, 224, 162), ['pad', 176, 96, 146, 142, 9], ['line', 160, 124, 160, G, 3.5]], gear: [{ t: 'plate', at: 'handL', r: 10 }]
    };
  },
  pushdown() {
    const base = { pin: FOOT, torso: 168, legL: [6, -5], far: 0 };
    return {
      poseA: rig({ ...base, armL: [8, 132] }), poseB: rig({ ...base, armL: [8, 6] }), tempo: TEMPO.zug,
      props: tower(96), gear: [{ t: 'line', from: [96, 12], to: 'handL' }, { t: 'grip', at: ['handL'] }]
    };
  },
  overheadExtension({ cable = true } = {}) {
    const base = { pin: FOOT, torso: 168, legL: [10, -8], far: 0 };
    return {
      poseA: rig({ ...base, armL: [164, -116] }), poseB: rig({ ...base, armL: [164, 160] }), tempo: TEMPO.zug,
      props: cable ? tower(252, 100) : [], gear: cable ? [{ t: 'line', from: [252, 150], to: 'handL' }, { t: 'grip', at: ['handL'] }] : [{ t: 'db', at: ['handL'], r: 8 }]
    };
  },
  skullCrusher() {
    const p = [190, 140];
    const mk = (fore) => rig({ p, torso: 90, legL: { at: [236, G], bend: -1 }, armL: [172, fore], far: 0 });
    return fig(mk(176), mk(64), { props: flatBench(92, 204, 153), gear: [{ t: 'plate', at: 'handL', r: 10 }] });
  },

  // ---------- Rumpf ----------
  plank({ side = false } = {}) {
    const mk = (dy) => rig({ p: [178, 172 + dy], nAt: [118, 165 + dy], armL: [0, 92], legL: { at: [258, G], bend: 1 }, far: 0 });
    return { poseA: mk(0), poseB: mk(-2), tempo: TEMPO.halten };
  },
  cableCrunch() {
    const pin = ['kneeL', 186, 190];
    return {
      poseA: rig({ pin, torso: 160, legL: [8, -90], armL: { rel: 'h', d: [8, 2], bend: -1 } }),
      poseB: rig({ pin, torso: 104, b: 16, legL: [8, -90], armL: { rel: 'h', d: [8, 2], bend: -1 } }),
      tempo: [1.2, 0.6, 2.2, 0.3], props: tower(92), gear: [{ t: 'line', from: [92, 10], to: 'handL' }, { t: 'grip', at: ['handL'] }]
    };
  },
  hangingLegRaise({ knees = false } = {}) {
    const pin = ['handL', 160, -6];
    return {
      poseA: rig({ pin, torso: 180, legL: [2, 0], armL: [180, 180], far: 0 }),
      poseB: rig({ pin, torso: 176, b: -6, legL: knees ? [104, -10] : [92, 90], armL: [180, 180], far: 0 }),
      tempo: [1.2, 0.5, 2.2, 0.3], props: [['circle', 160, -6, 4], ['line', 160, -6, 200, -6, 4], ['line', 200, -6, 200, G, 4]]
    };
  },
  abWheel() {
    const pin = ['kneeL', 204, 190];
    return {
      poseA: rig({ pin, torso: 126, b: 8, legL: [-18, -90], armL: { at: [152, 184], bend: 1 }, far: 0 }),
      poseB: rig({ pin, torso: 98, legL: [-60, -90], armL: { at: [62, 184], bend: 1 }, far: 0 }),
      tempo: [2.4, 0.3, 1.6, 0.4], gear: [{ t: 'plate', at: 'handL', r: 10 }]
    };
  },
  reverseCrunch() {
    const nAt = [112, 184];
    return {
      poseA: rig({ p: [174, 184], nAt, head: 90, legL: [178, -92], armL: [-88, -90], far: 0 }),
      poseB: rig({ p: [166, 166], nAt, head: 90, b: -8, legL: [140, -128], armL: [-88, -90], far: 0 }),
      tempo: [1.2, 0.5, 2.2, 0.3]
    };
  },
  machineCrunch() {
    const p = [196, 146];
    const base = { p, legL: { at: [152, G], bend: -1 }, armL: { rel: 'h', d: [8, -2], bend: -1 } };
    return {
      poseA: rig({ ...base, torso: -176 }), poseB: rig({ ...base, torso: 142, b: 14 }), tempo: [1.2, 0.6, 2.2, 0.3],
      props: [...seat(170, 210, 158), ...backPad(214, 150, 216, 96)]
    };
  },
  woodchop() {
    return {
      front: true, tempo: [1, 0.4, 2, 0.3],
      poseA: front({ handL: [118, 40], handR: [124, 44], bend: 1, leg: [12, 2], headDx: -3 }),
      poseB: front({ handL: [190, 130], handR: [196, 134], bend: -1, leg: [12, 2], headDx: 3 }),
      props: tower(70), gear: [{ t: 'line', from: [70, 16], to: 'handL' }, { t: 'grip', at: ['handL'] }]
    };
  },
  farmerWalk() {
    return {
      poseA: rig({ pin: ['p', 160, 116], torso: 180, legL: [22, 4], legR: [-16, -30], armL: [2, 4] }),
      poseB: rig({ pin: ['p', 160, 116], torso: 180, legL: [-16, -30], legR: [22, 4], armL: [2, 4] }),
      tempo: [0.7, 0.05, 0.7, 0.05], gear: [{ t: 'db', at: ['handL', 'handR'], r: 9 }]
    };
  }
};

export function buildFig(spec) {
  const [name, opts] = Array.isArray(spec) ? spec : [spec, undefined];
  if (!FIGS[name]) throw new Error(`Unbekannte Figur-Vorlage: ${name}`);
  return FIGS[name](opts);
}
