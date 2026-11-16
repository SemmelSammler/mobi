// Gelenk-Rig: baut Posen aus Winkeln und Zielpunkten statt aus Einzelkoordinaten.
// Dadurch bleiben die Körperproportionen in jeder Pose gleich.
//
// Winkel in Grad: 0 = nach unten, 90 = nach vorn (Blickrichtung), 180 = nach oben, -90 = nach hinten.
// Koordinatenraum wie bei den Mobility-Posen: 320 × 210, Boden bei y = 196.
export const LEN = { torso: 62, head: 21, upperArm: 31, forearm: 28, thigh: 40, shin: 40 };
export const GROUND = 196;

const rad = (d) => (d * Math.PI) / 180;
const vec = (deg, len, face) => [face * Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const round = (pt) => [Math.round(pt[0] * 10) / 10, Math.round(pt[1] * 10) / 10];

// Zwei-Segment-IK: liefert [Mittelgelenk, Endpunkt]. bend = Seite, zur der das Mittelgelenk ausweicht.
function reach(origin, target, l1, l2, bend) {
  let dx = target[0] - origin[0], dy = target[1] - origin[1];
  let d = Math.hypot(dx, dy) || 0.001;
  const max = l1 + l2 - 0.5, min = Math.abs(l1 - l2) + 0.5;
  const dc = Math.min(max, Math.max(min, d));
  const ux = dx / d, uy = dy / d;
  const end = [origin[0] + ux * dc, origin[1] + uy * dc];
  const a = (l1 * l1 - l2 * l2 + dc * dc) / (2 * dc);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const mid = [origin[0] + ux * a - uy * h * bend, origin[1] + uy * a + ux * h * bend];
  return [mid, end];
}

function limb(origin, spec, l1, l2, face, joints) {
  if (Array.isArray(spec)) {
    const mid = add(origin, vec(spec[0], l1, face));
    return [mid, add(mid, vec(spec[1], l2, face))];
  }
  let target = spec.at;
  if (spec.rel) {
    const o = joints[spec.rel];
    target = [o[0] + face * spec.d[0], o[1] - spec.d[1]];
  }
  return reach(origin, target, l1, l2, (spec.bend ?? 1) * face);
}

// spec: { face, p | pin, torso | nAt, head, b, armL, armR, legL, legR }
export function rig(spec) {
  const face = spec.face ?? -1;
  const far = spec.far ?? 4; // Winkelversatz der hinteren Gliedmaße, damit beide sichtbar bleiben
  let p = spec.p ? [...spec.p] : [0, 0];
  const build = () => {
    let n;
    if (spec.nAt) {
      const d = sub(spec.nAt, p);
      const l = Math.hypot(d[0], d[1]) || 1;
      n = [p[0] + (d[0] / l) * LEN.torso, p[1] + (d[1] / l) * LEN.torso];
    } else {
      n = add(p, vec(spec.torso ?? 180, LEN.torso, face));
    }
    const tdir = sub(n, p);
    const tl = Math.hypot(tdir[0], tdir[1]) || 1;
    let h;
    if (spec.head !== undefined) h = add(n, vec(spec.head, LEN.head, face));
    else h = [n[0] + (tdir[0] / tl) * LEN.head, n[1] + (tdir[1] / tl) * LEN.head];
    const joints = { p, n, h };
    const legLs = spec.legL ?? [0, 0];
    const legRs = spec.legR ?? (Array.isArray(legLs) ? [legLs[0] + far, legLs[1] + far] : { ...legLs, at: legLs.at && [legLs.at[0] - face * 5, legLs.at[1]] });
    const lL = limb(p, legLs, LEN.thigh, LEN.shin, face, joints);
    const lR = limb(p, legRs, LEN.thigh, LEN.shin, face, joints);
    const armLs = spec.armL ?? [4, 8];
    const armRs = spec.armR ?? (Array.isArray(armLs) ? [armLs[0] + far, armLs[1] + far] : armLs);
    const aL = limb(n, armLs, LEN.upperArm, LEN.forearm, face, joints);
    const aR = limb(n, armRs, LEN.upperArm, LEN.forearm, face, joints);
    return { h, n, p, aL, aR, lL, lR };
  };
  let pose = build();
  if (!spec.p) {
    const pin = spec.pin ?? ['footL', 160, GROUND];
    const cur = { footL: pose.lL[1], footR: pose.lR[1], kneeL: pose.lL[0], handL: pose.aL[1], n: pose.n, p: pose.p, h: pose.h }[pin[0]];
    p = [p[0] + pin[1] - cur[0], p[1] + pin[2] - cur[1]];
    pose = build();
  }
  return {
    h: round(pose.h), n: round(pose.n), p: round(pose.p), b: spec.b ?? 0,
    aL: pose.aL.map(round), aR: pose.aR.map(round), lL: pose.lL.map(round), lR: pose.lR.map(round)
  };
}

// Gelenkpunkt aus einer fertigen Pose lesen (für Geräte, die an Händen/Füßen hängen).
export function joint(pose, name) {
  switch (name) {
    case 'handL': return pose.aL[1];
    case 'handR': return pose.aR[1];
    case 'elbowL': return pose.aL[0];
    case 'elbowR': return pose.aR[0];
    case 'kneeL': return pose.lL[0];
    case 'kneeR': return pose.lR[0];
    case 'footL': return pose.lL[1];
    case 'footR': return pose.lR[1];
    case 'hands': return [(pose.aL[1][0] + pose.aR[1][0]) / 2, (pose.aL[1][1] + pose.aR[1][1]) / 2];
    case 'feet': return [(pose.lL[1][0] + pose.lR[1][0]) / 2, (pose.lL[1][1] + pose.lR[1][1]) / 2];
    default: return pose[name];
  }
}
