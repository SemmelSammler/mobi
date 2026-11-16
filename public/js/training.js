// Trainingslogik: Plan aus Vorlage, Rotation, laufende Einheit, Progression, Auswertung.
import { byId, GYM } from './data/index.js';
import { MUSCLES, GROUPS } from './data/muscles.js';
import { PROGRAMS, programById } from './data/programs.js';
import { getPlan, savePlan, getWorkouts, saveWorkouts, getActive, setActive, markGym, shiftDay } from './store.js';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const dateKeyOf = (ts) => {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// ---------- Plan ----------
export function slotFor(exId, sets, min, max) {
  const ex = byId(exId);
  return { ex: exId, sets: sets ?? ex.sets, reps: [min ?? ex.reps[0], max ?? ex.reps[1]], rest: ex.rest };
}

export function planFromTemplate(id) {
  const tpl = programById(id) || PROGRAMS[0];
  return {
    templateId: tpl.id, name: tpl.name, next: 0, createdAt: Date.now(),
    days: tpl.days.map((d) => ({ id: uid(), name: d.name, focus: d.focus, slots: d.slots.map((s) => slotFor(...s)) }))
  };
}

// Aktiver Plan; beim ersten Aufruf wird die Standardvorlage angelegt.
export function ensurePlan() {
  let plan = getPlan();
  if (!plan) { plan = planFromTemplate('ul4'); savePlan(plan); }
  return plan;
}

export function nextDayIndex(plan) {
  return plan.days.length ? ((plan.next || 0) % plan.days.length + plan.days.length) % plan.days.length : 0;
}

export function dayDuration(day) {
  // Arbeitszeit je Satz ~40 s plus Pause, plus Aufbau je Übung.
  const sec = day.slots.reduce((sum, s) => sum + s.sets * (40 + s.rest) + 60, 0);
  return Math.round(sec / 300) * 5;
}

// ---------- Verlauf je Übung ----------
export const e1rm = (w, r) => (w > 0 && r > 0 ? w * (1 + r / 30) : 0); // Epley

function doneSets(item) {
  return item.sets.filter((s) => s.done && Number(s.r) > 0).map((s) => ({ w: Number(s.w) || 0, r: Number(s.r) }));
}

// Chronologisch: [{ date, at, sets:[{w,r}], best, volume }]
export function exerciseHistory(exId, workouts = getWorkouts()) {
  const out = [];
  for (const w of workouts) {
    for (const it of w.items) {
      if (it.ex !== exId) continue;
      const sets = doneSets(it);
      if (!sets.length) continue;
      out.push({
        date: dateKeyOf(w.start), at: w.start, sets,
        best: Math.max(...sets.map((s) => e1rm(s.w, s.r))),
        topReps: Math.max(...sets.map((s) => s.r)),
        volume: sets.reduce((sum, s) => sum + s.w * s.r, 0)
      });
    }
  }
  return out.sort((a, b) => a.at - b.at);
}

export function lastPerformance(exId, workouts) {
  const h = exerciseHistory(exId, workouts);
  return h.length ? h[h.length - 1] : null;
}

const fmtKg = (v) => String(Math.round(v * 100) / 100).replace('.', ',');
export { fmtKg };

// Doppelte Progression: erst Wiederholungen bis zur Obergrenze steigern, dann Gewicht erhöhen.
export function suggestion(exId, target, workouts) {
  const ex = byId(exId);
  const last = lastPerformance(exId, workouts);
  const unit = ex.unit === 'sek' ? 'Sek.' : 'Wdh.';
  if (!last) {
    return { weight: '', reps: target.reps[0], up: false, text: ex.bw ? `Erstes Mal: ${target.reps[0]}–${target.reps[1]} ${unit} anpeilen` : `Erstes Mal: Gewicht wählen, mit dem ${target.reps[1]} saubere ${unit} gerade so gehen` };
  }
  const w = Math.max(...last.sets.map((s) => s.w));
  const top = last.sets.filter((s) => s.w === w);
  const allTop = top.length >= Math.min(target.sets, last.sets.length) && top.every((s) => s.r >= target.reps[1]);
  const minReps = Math.min(...top.map((s) => s.r));
  if (allTop && ex.step > 0 && (w > 0 || !ex.bw)) {
    return { weight: w + ex.step, reps: target.reps[0], up: true, text: `Obergrenze geschafft — heute ${fmtKg(w + ex.step)} kg, wieder ab ${target.reps[0]} ${unit}` };
  }
  if (allTop) {
    return { weight: w || '', reps: target.reps[1] + 1, up: true, text: ex.unit === 'sek' ? 'Obergrenze geschafft — heute länger halten oder schwerere Variante' : 'Obergrenze geschafft — heute eine Wiederholung mehr oder Zusatzgewicht' };
  }
  return { weight: w || '', reps: Math.min(target.reps[1], minReps + 1), up: false, text: `Gleiches Gewicht — Ziel: ${Math.min(target.reps[1], minReps + 1)} ${unit} pro Satz` };
}

// ---------- Laufende Einheit ----------
function newItem(slot, workouts) {
  const sug = suggestion(slot.ex, slot, workouts);
  const last = lastPerformance(slot.ex, workouts);
  return {
    ex: slot.ex, target: { sets: slot.sets, reps: slot.reps, rest: slot.rest }, hint: sug.text, up: sug.up,
    sets: Array.from({ length: slot.sets }, (_, i) => ({
      w: sug.weight === '' ? '' : sug.weight,
      r: '', done: false,
      prev: last?.sets[i] || last?.sets[last.sets.length - 1] || null
    }))
  };
}

export function startWorkout(plan, dayIdx) {
  const workouts = getWorkouts();
  const day = plan ? plan.days[dayIdx] : null;
  const session = {
    id: uid(), start: Date.now(), dayId: day?.id || null, name: day?.name || 'Freies Training',
    items: day ? day.slots.map((s) => newItem(s, workouts)) : [], rest: null
  };
  setActive(session);
  return session;
}

export function addExercise(session, exId) {
  const ex = byId(exId);
  session.items.push(newItem(slotFor(exId), getWorkouts()));
  setActive(session);
  return ex;
}

export function replaceExercise(session, idx, exId) {
  const old = session.items[idx];
  const slot = { ...slotFor(exId), sets: old.target.sets };
  session.items[idx] = newItem(slot, getWorkouts());
  setActive(session);
}

export function sessionStats(session) {
  let sets = 0, volume = 0, reps = 0;
  for (const it of session.items) for (const s of doneSets(it)) { sets++; reps += s.r; volume += s.w * s.r; }
  return { sets, reps, volume: Math.round(volume), exercises: session.items.filter((it) => doneSets(it).length).length };
}

// Schließt die Einheit ab. Gibt { workout, prs } zurück oder null, wenn kein Satz erledigt wurde.
export function finishWorkout(session) {
  const stats = sessionStats(session);
  if (!stats.sets) { setActive(null); return null; }
  const workouts = getWorkouts();
  const prs = [];
  for (const it of session.items) {
    const sets = doneSets(it);
    if (!sets.length) continue;
    const ex = byId(it.ex);
    const before = exerciseHistory(it.ex, workouts);
    const best = Math.max(...sets.map((s) => e1rm(s.w, s.r)));
    const bestReps = Math.max(...sets.map((s) => s.r));
    if (before.length) {
      const prevBest = Math.max(...before.map((h) => h.best));
      const prevReps = Math.max(...before.map((h) => h.topReps));
      if (best > prevBest + 0.01) {
        const top = sets.reduce((a, b) => (e1rm(b.w, b.r) > e1rm(a.w, a.r) ? b : a));
        prs.push({ ex: it.ex, name: ex.name, text: `${fmtKg(top.w)} kg × ${top.r}` });
      } else if (best === 0 && bestReps > prevReps) {
        prs.push({ ex: it.ex, name: ex.name, text: `${bestReps} ${ex.unit === 'sek' ? 'Sek.' : 'Wdh.'}` });
      }
    }
  }
  const workout = {
    id: session.id, start: session.start, end: Date.now(), dayId: session.dayId, name: session.name,
    items: session.items.filter((it) => doneSets(it).length).map((it) => ({ ex: it.ex, sets: it.sets.filter((s) => s.done && Number(s.r) > 0).map((s) => ({ w: Number(s.w) || 0, r: Number(s.r), done: true })) })),
    prs: prs.length
  };
  workouts.push(workout);
  saveWorkouts(workouts);
  markGym(dateKeyOf(workout.start), 1);
  const plan = getPlan();
  if (plan && session.dayId) {
    const idx = plan.days.findIndex((d) => d.id === session.dayId);
    if (idx >= 0) { plan.next = (idx + 1) % plan.days.length; savePlan(plan); }
  }
  setActive(null);
  return { workout, prs, stats };
}

export function deleteWorkout(id) {
  const list = getWorkouts();
  const w = list.find((x) => x.id === id);
  if (!w) return;
  saveWorkouts(list.filter((x) => x.id !== id));
  markGym(dateKeyOf(w.start), -1);
}

// ---------- Auswertung ----------
export function mondayOf(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const wd = (new Date(y, m - 1, d).getDay() + 6) % 7;
  return shiftDay(dateKey, -wd);
}

// Harte Sätze je Muskelgruppe in der Woche ab weekStart. Zielmuskel = 1, Hilfsmuskel = 0,5.
export function weeklySets(weekStart, workouts = getWorkouts()) {
  const end = shiftDay(weekStart, 7);
  const out = {};
  for (const w of workouts) {
    const key = dateKeyOf(w.start);
    if (key < weekStart || key >= end) continue;
    for (const it of w.items) {
      const ex = byId(it.ex);
      if (!ex) continue;
      const n = it.sets.length;
      const seen = new Set();
      for (const m of ex.primary) { const g = MUSCLES[m].group; if (!seen.has(g)) { seen.add(g); out[g] = (out[g] || 0) + n; } }
      for (const m of ex.secondary || []) { const g = MUSCLES[m].group; if (!seen.has(g)) { seen.add(g); out[g] = (out[g] || 0) + n * 0.5; } }
    }
  }
  return out;
}

// Geplante Wochensätze, wenn jeder Plantag einmal trainiert wird.
export function plannedSets(plan) {
  const out = {};
  for (const d of plan.days) for (const s of d.slots) {
    const ex = byId(s.ex);
    if (!ex) continue;
    const seen = new Set();
    for (const m of ex.primary) { const g = MUSCLES[m].group; if (!seen.has(g)) { seen.add(g); out[g] = (out[g] || 0) + s.sets; } }
    for (const m of ex.secondary || []) { const g = MUSCLES[m].group; if (!seen.has(g)) { seen.add(g); out[g] = (out[g] || 0) + s.sets * 0.5; } }
  }
  return out;
}

export const VOLUME_GROUPS = ['brust', 'ruecken', 'schultern', 'bizeps', 'trizeps', 'quadrizeps', 'beinbeuger', 'gesaess', 'waden', 'core'];
export { GROUPS };

export function workoutsInWeek(weekStart, workouts = getWorkouts()) {
  const end = shiftDay(weekStart, 7);
  return workouts.filter((w) => { const k = dateKeyOf(w.start); return k >= weekStart && k < end; });
}

// Alternativen: gleiche Gruppe und gleicher Hauptmuskel, ähnlicher Typ zuerst.
export function alternatives(exId, limit = 6) {
  const ex = byId(exId);
  if (!ex || ex.kind !== 'gym') return [];
  return GYM.filter((e) => e.id !== exId && e.primary[0] === ex.primary[0])
    .sort((a, b) => (Number(b.compound === ex.compound) - Number(a.compound === ex.compound)) || (Number(b.group === ex.group) - Number(a.group === ex.group)))
    .slice(0, limit);
}

export function fmtDuration(ms) {
  const m = Math.max(1, Math.round(ms / 60000));
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min` : `${m} min`;
}

export { getActive };
