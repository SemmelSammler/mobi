// Logiktests ohne Browser (store.js fällt auf In-Memory zurück).
import assert from 'node:assert/strict';
const root = process.argv[2] || new URL('../public/js', import.meta.url).pathname;
const T = await import(root + '/training.js');
const S = await import(root + '/store.js');
const R = await import(root + '/routine.js');

// Plan + Rotation
const plan = T.ensurePlan();
assert.equal(plan.days.length, 4);
assert.equal(T.nextDayIndex(plan), 0);
assert.ok(T.dayDuration(plan.days[0]) >= 40 && T.dayDuration(plan.days[0]) <= 90, 'Dauer plausibel: ' + T.dayDuration(plan.days[0]));

// Erste Einheit: kein Verlauf → kein Gewichtsvorschlag
let s = T.startWorkout(plan, 0);
assert.equal(s.items[0].ex, 'bankdruecken');
assert.equal(s.items[0].sets.length, 4);
assert.equal(s.items[0].sets[0].w, '');
for (const set of s.items[0].sets) Object.assign(set, { w: 60, r: 10, done: true });
s.items[1].sets[0] = { w: 50, r: 9, done: true };
let res = T.finishWorkout(s);
assert.equal(res.stats.sets, 5);
assert.equal(res.stats.volume, 60 * 10 * 4 + 450);
assert.equal(res.prs.length, 0, 'erste Einheit ist kein Rekord');
assert.equal(S.getPlan().next, 1, 'Rotation rückt weiter');
assert.equal(S.getActive(), null);
assert.ok(S.isDone(T.dateKeyOf(Date.now())), 'Kalender markiert Studio');

// Progression: Obergrenze (10) in allen Sätzen → +2,5 kg
let sug = T.suggestion('bankdruecken', { sets: 4, reps: [6, 10] });
assert.equal(sug.up, true); assert.equal(sug.weight, 62.5);
// Latzug: 9 von 8–12 → gleiches Gewicht, Ziel 10
sug = T.suggestion('latzug', { sets: 3, reps: [8, 12] });
assert.equal(sug.up, false); assert.equal(sug.weight, 50); assert.equal(sug.reps, 10);

// Zweite Einheit desselben Tages: Rekord erkennen
s = T.startWorkout(S.getPlan(), 0);
assert.equal(s.items[0].sets[0].w, 62.5);
assert.deepEqual(s.items[0].sets[0].prev, { w: 60, r: 10 });
s.items[0].sets[0] = { w: 62.5, r: 10, done: true };
res = T.finishWorkout(s);
assert.equal(res.prs.length, 1); assert.equal(res.prs[0].ex, 'bankdruecken');

// Auswertung
const wk = T.weeklySets(T.mondayOf(T.dateKeyOf(Date.now())));
assert.equal(wk.brust, 5, 'Brust: 4 + 1 Sätze');
assert.equal(wk.trizeps, 2.5, 'Trizeps als Hilfsmuskel halb gezählt');
assert.equal(T.exerciseHistory('bankdruecken').length, 2);
assert.ok(Math.abs(T.e1rm(60, 10) - 80) < 1e-9);
const ps = T.plannedSets(S.getPlan());
for (const g of ['brust', 'ruecken', 'quadrizeps', 'beinbeuger', 'schultern']) assert.ok(ps[g] >= 9 && ps[g] <= 24, `${g}: ${ps[g]} Sätze/Woche geplant`);
console.log('Geplante Wochensätze (UL4):', JSON.stringify(ps));
assert.ok(T.alternatives('bankdruecken').length >= 3);

// Leere Einheit wird verworfen
s = T.startWorkout(S.getPlan(), 1);
assert.equal(T.finishWorkout(s), null);
assert.equal(S.getWorkouts().length, 2);

// Löschen räumt Kalender auf
T.deleteWorkout(S.getWorkouts()[0].id); T.deleteWorkout(S.getWorkouts()[0].id);
assert.equal(S.isDone(T.dateKeyOf(Date.now())), false);

// Mobility-Routinen funktionieren weiter
for (const [kind, min] of [['morgen', 10], ['abend', 15], ['kraft', 20], ['zwischendurch', 3]]) {
  const r = R.buildRoutine(R.todayKey(), min, kind);
  assert.ok(r.items.length >= 3, kind);
  assert.ok(Math.abs(r.totalSec / 60 - min) <= Math.max(2.5, min * 0.3), `${kind}: ${Math.round(r.totalSec / 60)} statt ${min} min`);
  assert.ok(r.items.every((it) => it.ex.kind === 'mob' && it.ex.primary));
}

// Backup hin und zurück
S.setSetting('name', 'Test'); S.markDone('2026-01-05', 10, 'morgen', []);
const dump = JSON.parse(JSON.stringify(S.exportData()));
S.resetAll();
assert.equal(S.getSettings().name, 'Jason');
assert.ok(S.importData(dump) >= 2);
assert.equal(S.getSettings().name, 'Test');
assert.ok(S.isDone('2026-01-05', 'morgen'));
assert.throws(() => S.importData({ foo: 1 }));
// Alt-Format der Historie (v1) wird weiter migriert
console.log('Logik OK');
