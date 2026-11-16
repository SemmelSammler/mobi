// Muskelgruppen: Anzeige-Namen, Körperkarten-Seite und Zuordnung zu den Figur-Segmenten.
// seg = Segmente der animierten Figur, die bei dieser Muskelgruppe aufleuchten.
export const MUSCLES = {
  brust: { name: 'Brust', group: 'brust', seg: ['chest'] },
  schulter_v: { name: 'Vordere Schulter', group: 'schultern', seg: ['shoulder'] },
  schulter_s: { name: 'Seitliche Schulter', group: 'schultern', seg: ['shoulder'] },
  schulter_h: { name: 'Hintere Schulter', group: 'schultern', seg: ['shoulder'] },
  trapez: { name: 'Trapez & Nacken', group: 'ruecken', seg: ['upperBack'] },
  oberer_ruecken: { name: 'Oberer Rücken', group: 'ruecken', seg: ['upperBack'] },
  lat: { name: 'Latissimus', group: 'ruecken', seg: ['torso'] },
  ruecken_strecker: { name: 'Rückenstrecker', group: 'unterer_ruecken', seg: ['lowerBack'] },
  bizeps: { name: 'Bizeps', group: 'bizeps', seg: ['upperArm'] },
  trizeps: { name: 'Trizeps', group: 'trizeps', seg: ['upperArm'] },
  unterarm: { name: 'Unterarme', group: 'unterarme', seg: ['forearm'] },
  bauch: { name: 'Gerade Bauchmuskeln', group: 'core', seg: ['abs'] },
  schraege: { name: 'Schräge Bauchmuskeln', group: 'core', seg: ['abs'] },
  hueftbeuger: { name: 'Hüftbeuger', group: 'huefte', seg: ['hip'] },
  gesaess: { name: 'Gesäß', group: 'gesaess', seg: ['hip'] },
  abduktoren: { name: 'Abduktoren', group: 'gesaess', seg: ['hip'] },
  adduktoren: { name: 'Adduktoren', group: 'adduktoren', seg: ['thigh'] },
  quadrizeps: { name: 'Quadrizeps', group: 'quadrizeps', seg: ['thigh'] },
  hamstrings: { name: 'Beinbeuger', group: 'beinbeuger', seg: ['thigh'] },
  waden: { name: 'Waden', group: 'waden', seg: ['shin'] }
};

// Gruppen für Filter und Wochenvolumen (Reihenfolge = Anzeige).
export const GROUPS = {
  brust: 'Brust',
  ruecken: 'Rücken',
  schultern: 'Schultern',
  bizeps: 'Bizeps',
  trizeps: 'Trizeps',
  quadrizeps: 'Quadrizeps',
  beinbeuger: 'Beinbeuger',
  gesaess: 'Gesäß',
  waden: 'Waden',
  core: 'Bauch & Rumpf',
  unterer_ruecken: 'Unterer Rücken',
  adduktoren: 'Adduktoren',
  unterarme: 'Unterarme',
  huefte: 'Hüfte'
};

// Mobility-Übungen tragen freie „areas“ — hier die Übersetzung auf Muskelgruppen.
export const AREA_MUSCLES = {
  'Hüfte': ['hueftbeuger', 'gesaess'],
  'Schulter': ['schulter_v', 'schulter_h'],
  'Rumpf': ['bauch', 'schraege'],
  'Sprunggelenk': ['waden'],
  'Beinrückseite': ['hamstrings'],
  'BWS': ['oberer_ruecken'],
  'Wirbelsäule': ['ruecken_strecker', 'oberer_ruecken'],
  'Gesäß': ['gesaess'],
  'Nacken': ['trapez'],
  'Adduktoren': ['adduktoren'],
  'Waden': ['waden'],
  'Rücken': ['ruecken_strecker', 'lat'],
  'Oberschenkel': ['quadrizeps'],
  'Brust': ['brust'],
  'Unterarm': ['unterarm'],
  'Lendenwirbelsäule': ['ruecken_strecker'],
  'Lat': ['lat'],
  'Handgelenk': ['unterarm'],
  'Fuß': ['waden'],
  'Erholung': [],
  'Atmung': ['bauch'],
  'Nervensystem': ['hamstrings']
};

export function musclesForAreas(areas = []) {
  const out = [];
  for (const a of areas) for (const m of AREA_MUSCLES[a] || []) if (!out.includes(m)) out.push(m);
  return out;
}

export function segmentsFor(muscles = []) {
  const out = new Set();
  for (const m of muscles) for (const s of MUSCLES[m]?.seg || []) out.add(s);
  return out;
}
