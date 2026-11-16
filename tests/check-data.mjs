// Datenprüfung: Pflichtfelder, eindeutige IDs, gültige Muskeln, Posen, Plan-Verweise.
const root = process.argv[2] || new URL('../public/js', import.meta.url).pathname;
const { EXERCISES, GYM, MOBILITY } = await import(root + '/data/index.js');
const { MUSCLES, GROUPS } = await import(root + '/data/muscles.js');
const { PROGRAMS } = await import(root + '/data/programs.js');
const err = [];
const ids = new Set();
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
for (const e of EXERCISES) {
  if (ids.has(e.id)) err.push(`doppelte ID ${e.id}`);
  ids.add(e.id);
  for (const k of ['name', 'how', 'poseA', 'poseB', 'primary', 'phases', 'tempo', 'mistakes']) if (e[k] == null) err.push(`${e.id}: ${k} fehlt`);
  for (const m of [...(e.primary || []), ...(e.secondary || [])]) if (!MUSCLES[m]) err.push(`${e.id}: Muskel ${m} unbekannt`);
  if (!e.mistakes?.length) err.push(`${e.id}: keine Fehlerliste`);
  for (const pose of [e.poseA, e.poseB]) for (const k of ['h', 'n', 'p']) if (!pose[k] || pose[k].some((v) => !Number.isFinite(v))) err.push(`${e.id}: Pose ${k} ungültig`);
  if (e.kind === 'gym') {
    for (const k of ['group', 'equip', 'setup', 'why', 'sets', 'reps', 'rest', 'level']) if (e[k] == null) err.push(`${e.id}: ${k} fehlt`);
    if (!GROUPS[e.group]) err.push(`${e.id}: Gruppe ${e.group}`);
    if (!e.primary.length) err.push(`${e.id}: keine Zielmuskeln`);
    // Segmentlängen müssen in beiden Posen gleich bleiben (Seitenansicht)
    if (!e.front) for (const [k, o] of [['aL', 'n'], ['lL', 'p']]) {
      const a = dist(e.poseA[o], e.poseA[k][0]), b = dist(e.poseB[o], e.poseB[k][0]);
      if (Math.abs(a - b) > 1.5) err.push(`${e.id}: ${k}-Länge ${a.toFixed(1)} vs ${b.toFixed(1)}`);
    }
  }
}
for (const p of PROGRAMS) for (const d of p.days) for (const s of d.slots) if (!ids.has(s[0])) err.push(`Plan ${p.id}/${d.name}: Übung ${s[0]} fehlt`);
const noPrimary = MOBILITY.filter((e) => !e.primary.length).map((e) => e.id);
console.log(`${EXERCISES.length} Übungen (${MOBILITY.length} Mobility, ${GYM.length} Studio), ${PROGRAMS.length} Pläne`);
console.log('Mobility ohne Muskelzuordnung:', noPrimary.join(', ') || '—');
console.log(err.length ? 'FEHLER:\n' + err.join('\n') : 'Daten OK');
process.exit(err.length ? 1 : 0);
