// Verlauf: Kennzahlen, Kalender, Wochenvolumen, Trainings, Kraftwerte, Beweglichkeits-Check.
import { $, $$, esc, ICON, emit, openSheet, closeSheet, sparkline, fmtDay, fmtNum, toast, ACTIVITIES } from '../ui.js';
import { todayKey } from '../routine.js';
import { getHistory, streak, getWorkouts, getAssessments, saveAssessment, getSettings } from '../store.js';
import { byId } from '../data/index.js';
import { weeklySets, mondayOf, workoutsInWeek, exerciseHistory, deleteWorkout, dateKeyOf, fmtKg, fmtDuration } from '../training.js';
import { volumeBars } from './training.js';
import { openExercise } from './uebungen.js';
import { openSport } from './heute.js';

let calOffset = 0;

const ASSESS = [
  { key: 'kneeL', label: 'Knie-zur-Wand links', unit: 'cm', better: 'up', hint: 'Fuß vor der Wand, Ferse unten, Knie berührt die Wand — größter Zeh-Wand-Abstand' },
  { key: 'kneeR', label: 'Knie-zur-Wand rechts', unit: 'cm', better: 'up', hint: 'wie links' },
  { key: 'finger', label: 'Finger-Boden-Abstand', unit: 'cm', better: 'down', hint: 'Stehend vorbeugen, Knie gestreckt; negativ = unter Bodenniveau' },
  { key: 'shoulder', label: 'Schulterflexion (Handrücken–Boden)', unit: 'cm', better: 'down', hint: 'Rückenlage, unterer Rücken am Boden, Arme über Kopf strecken' },
  { key: 'squat', label: 'Tiefe Hocke gehalten', unit: 'Sek.', better: 'up', hint: 'Fersen am Boden, so lange es gut geht' }
];

function assessmentRows() {
  const data = getAssessments();
  const dates = Object.keys(data).sort();
  return ASSESS.map((m) => {
    const series = dates.map((d) => data[d][m.key]).filter((v) => typeof v === 'number');
    const latest = series.length ? series[series.length - 1] : null;
    const prev = series.length > 1 ? series[series.length - 2] : null;
    let delta = '';
    if (latest !== null && prev !== null && latest !== prev) {
      const diff = Math.round((latest - prev) * 10) / 10;
      const improved = m.better === 'up' ? diff > 0 : diff < 0;
      delta = ` <span class="${improved ? 'delta-up' : 'delta-down'}">${diff > 0 ? '+' : ''}${String(diff).replace('.', ',')}</span>`;
    }
    return `<div class="assess-row"><span>${m.label}</span>${sparkline(series)}<span class="val">${latest === null ? '—' : `${String(latest).replace('.', ',')} ${m.unit}`}${delta}</span></div>`;
  }).join('');
}

function assessmentDue() {
  const dates = Object.keys(getAssessments()).sort();
  if (!dates.length) return true;
  const [y, m, d] = dates[dates.length - 1].split('-').map(Number);
  return (Date.now() - new Date(y, m - 1, d).getTime()) / 86400000 >= 28;
}

function openAssessment() {
  openSheet(`
    <h2 class="h2">Beweglichkeits-Check</h2>
    <p class="body">Einmal im Monat messen — barfuß, ohne Aufwärmen, immer gleich. Nicht jeder Wert muss ausgefüllt sein.</p>
    ${ASSESS.map((m) => `<div class="field"><label for="as-${m.key}">${m.label} (${m.unit})</label><input class="input" inputmode="decimal" id="as-${m.key}" autocomplete="off"><span class="meta">${m.hint}</span></div>`).join('')}
    <button class="btn" id="as-save">Speichern</button>`, (sh) => {
    $('#as-save', sh).onclick = () => {
      const values = {};
      for (const m of ASSESS) {
        const v = parseFloat($(`#as-${m.key}`, sh).value.replace(',', '.'));
        if (!Number.isNaN(v)) values[m.key] = v;
      }
      if (!Object.keys(values).length) return toast('Bitte mindestens einen Wert eintragen');
      saveAssessment(todayKey(), values);
      closeSheet(); emit('change');
    };
  });
}

function openWorkoutDetail(id) {
  const w = getWorkouts().find((x) => x.id === id);
  if (!w) return;
  const vol = w.items.reduce((sum, it) => sum + it.sets.reduce((s, x) => s + x.w * x.r, 0), 0);
  openSheet(`
    <div class="stack gap-4" style="padding-right:44px;"><span class="eyebrow">${fmtDay(dateKeyOf(w.start), { weekday: 'long', day: 'numeric', month: 'long' })}</span><h2 class="h2">${esc(w.name)}</h2>
      <span class="meta">${fmtDuration(w.end - w.start)} · ${w.items.reduce((n, it) => n + it.sets.length, 0)} Sätze · ${fmtNum(Math.round(vol))} kg bewegt</span></div>
    <div class="list">${w.items.map((it) => { const ex = byId(it.ex); return `<button class="row" data-ex="${it.ex}"><span class="grow"><span class="t">${esc(ex?.name || it.ex)}</span><span class="s num">${it.sets.map((s) => (s.w ? `${fmtKg(s.w)} kg × ${s.r}` : `${s.r}`)).join(' · ')}</span></span>${ICON.chev}</button>`; }).join('')}</div>
    <button class="btn danger" id="w-del">Training löschen</button>`, (sh) => {
    for (const b of $$('[data-ex]', sh)) b.onclick = () => openExercise(b.dataset.ex);
    $('#w-del', sh).onclick = () => { deleteWorkout(id); closeSheet(); emit('change'); toast('Training gelöscht'); };
  });
}

function openDayDetail(key) {
  const day = getHistory()[key] || {};
  const ws = getWorkouts().filter((w) => dateKeyOf(w.start) === key);
  const rows = [];
  for (const [k, label] of [['morgen', 'Morgenroutine'], ['abend', 'Abendroutine'], ['kraft', 'Endgrad-Kraft']]) if (day[k]) rows.push(`<div class="row"><span class="tile">${ICON.sun}</span><span class="grow"><span class="t">${label}</span><span class="s">${day[k].minutes} min</span></span></div>`);
  if (day.zwischendurch?.count) rows.push(`<div class="row"><span class="tile">${ICON.loop}</span><span class="grow"><span class="t">Zwischendurch</span><span class="s">${day.zwischendurch.count}×</span></span></div>`);
  for (const w of ws) rows.push(`<button class="row" data-w="${w.id}"><span class="tile accent">${ICON.dumbbell}</span><span class="grow"><span class="t">${esc(w.name)}</span><span class="s">${fmtDuration(w.end - w.start)} · ${w.items.length} Übungen</span></span>${ICON.chev}</button>`);
  if (day.sport) rows.push(`<button class="row" data-sport="${day.sport.type}"><span class="tile good">${ICON.pulse}</span><span class="grow"><span class="t">${ACTIVITIES[day.sport.type] || 'Ausdauer'}</span><span class="s">${[day.sport.km ? String(day.sport.km).replace('.', ',') + ' km' : '', day.sport.min ? day.sport.min + ' min' : ''].filter(Boolean).join(' · ') || 'erledigt'}</span></span>${ICON.chev}</button>`);
  const planned = getSettings().weekPlan?.[new Date(...key.split('-').map((v, i) => (i === 1 ? v - 1 : Number(v)))).getDay()];
  const canAdd = !day.sport && key <= todayKey();
  openSheet(`
    <h2 class="h2" style="padding-right:44px;">${fmtDay(key, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
    <div class="list">${rows.join('') || '<div class="empty">An diesem Tag ist nichts eingetragen.</div>'}</div>
    ${canAdd ? `<button class="btn ghost" id="d-run">${ICON.plus} Ausdauer-Einheit eintragen</button>` : ''}`, (sh) => {
    for (const b of $$('[data-w]', sh)) b.onclick = () => openWorkoutDetail(b.dataset.w);
    for (const b of $$('[data-sport]', sh)) b.onclick = () => openSport(b.dataset.sport, key);
    const add = $('#d-run', sh);
    if (add) add.onclick = () => openSport(planned && !['gym', 'ruhe'].includes(planned) ? planned : 'laufen', key);
  });
}

export function render() {
  const root = $('#view-verlauf');
  const now = new Date();
  const tKey = todayKey();
  const view = new Date(now.getFullYear(), now.getMonth() + calOffset, 1);
  const monthName = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(view);
  const firstWd = (view.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const hist = getHistory();
  const prefix = `${view.getFullYear()}-${String(view.getMonth() + 1).padStart(2, '0')}`;
  const workouts = getWorkouts();
  const week = mondayOf(tKey);
  const weekW = workoutsInWeek(week, workouts);
  let cells = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((w) => `<div class="wd">${w}</div>`).join('');
  for (let i = 0; i < firstWd; i++) cells += '<div class="cal-cell other"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${prefix}-${String(d).padStart(2, '0')}`;
    const day = hist[key] || {};
    const dots = `${day.morgen || day.abend || day.kraft ? '<i class="d-mob"></i>' : ''}${day.gym ? '<i class="d-gym"></i>' : ''}${day.sport ? '<i class="d-run"></i>' : ''}`;
    cells += `<button class="cal-cell${key === tKey ? ' today' : ''}" data-date="${key}" aria-label="${d}."><span>${d}</span><span class="dots">${dots}</span></button>`;
  }
  // Kraftwerte: Übungen mit den meisten Einträgen
  const counts = {};
  for (const w of workouts) for (const it of w.items) counts[it.ex] = (counts[it.ex] || 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id]) => {
    const ex = byId(id);
    const h = exerciseHistory(id, workouts);
    if (!ex || !h.length) return '';
    const weighted = h.some((x) => x.best > 0);
    const series = h.map((x) => (weighted ? x.best : x.topReps));
    const best = Math.max(...series);
    return `<button class="row" data-ex="${id}"><span class="grow"><span class="t">${esc(ex.name)}</span><span class="s">${h.length} ${h.length === 1 ? 'Einheit' : 'Einheiten'}</span></span>${sparkline(series, 80, 26)}<span class="num" style="font-weight:650;min-width:62px;text-align:right;">${weighted ? fmtKg(Math.round(best * 2) / 2) + ' kg' : best}</span></button>`;
  }).join('');
  const total = Object.values(hist).filter((d) => d.morgen || d.abend || d.kraft || d.gym || d.sport).length;
  root.innerHTML = `
    <h1 class="h1">Verlauf</h1>
    <div class="stats">
      <div class="stat"><span class="v">${streak(tKey)}</span><span class="l">Tage Serie</span></div>
      <div class="stat"><span class="v">${weekW.length}</span><span class="l">Trainings diese Woche</span></div>
      <div class="stat"><span class="v">${total}</span><span class="l">aktive Tage</span></div>
    </div>
    <div class="card stack gap-12">
      <div class="cal-head"><button class="icon-btn clear" id="cal-prev" aria-label="Voriger Monat">${ICON.back}</button><span class="m">${esc(monthName)}</span><button class="icon-btn clear" id="cal-next" aria-label="Nächster Monat">${ICON.fwd}</button></div>
      <div class="cal-grid">${cells}</div>
      <div class="cal-legend"><span><i class="d-mob"></i>Mobility</span><span><i class="d-gym"></i>Studio</span><span><i class="d-run"></i>Ausdauer</span></div>
    </div>
    <div class="card stack gap-12">
      <div class="stack gap-4"><span class="h3">Wochenvolumen</span><span class="meta">Harte Sätze pro Muskelgruppe seit Montag. Hilfsmuskeln zählen halb. Grüner Bereich: 10–20 Sätze.</span></div>
      ${weekW.length ? volumeBars(weeklySets(week, workouts)) : '<div class="empty" style="padding:8px;">Diese Woche noch kein Training geloggt.</div>'}
    </div>
    <div class="stack gap-8"><span class="eyebrow">Letzte Trainings</span>
      <div class="list">${workouts.slice(-5).reverse().map((w) => `<button class="row" data-w="${w.id}"><span class="tile accent">${ICON.dumbbell}</span><span class="grow"><span class="t">${esc(w.name)}</span><span class="s">${fmtDay(dateKeyOf(w.start))} · ${fmtDuration(w.end - w.start)} · ${w.items.reduce((n, it) => n + it.sets.length, 0)} Sätze</span></span>${w.prs ? `<span class="badge good">${ICON.trophy} ${w.prs}</span>` : ''}${ICON.chev}</button>`).join('') || '<div class="card flat empty">Dein erstes Training erscheint hier.</div>'}</div>
    </div>
    ${top ? `<div class="stack gap-8"><span class="eyebrow">Kraftwerte · geschätztes Maximum</span><div class="list">${top}</div></div>` : ''}
    <div class="card stack gap-12">
      <div class="row-between"><span class="h3">Beweglichkeits-Check</span>${assessmentDue() ? '<span class="badge">Fällig</span>' : '<span class="meta">monatlich</span>'}</div>
      ${assessmentRows()}
      <button class="btn ghost" id="btn-assess">Check starten</button>
    </div>`;
  $('#cal-prev').onclick = () => { calOffset--; render(); };
  $('#cal-next').onclick = () => { calOffset++; render(); };
  $('#btn-assess').onclick = openAssessment;
  root.onclick = (e) => {
    const w = e.target.closest('[data-w]');
    if (w) return openWorkoutDetail(w.dataset.w);
    const ex = e.target.closest('[data-ex]');
    if (ex) return openExercise(ex.dataset.ex);
    const d = e.target.closest('[data-date]');
    if (d) openDayDetail(d.dataset.date);
  };
}
