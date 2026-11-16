// Startseite: Woche, heutiges Training, Lauf, Mobility-Routinen.
import { $, $$, esc, ICON, emit, openSheet, closeSheet, WD, WEEK_ORDER, ACTIVITIES, toast } from '../ui.js';
import { buildRoutine, todayKey } from '../routine.js';
import { getSettings, setSetting, getHistory, isDone, routineDone, setSport, shiftDay, dayPlan, RUN_TYPES } from '../store.js';
import { ensurePlan, nextDayIndex, dayDuration, getActive } from '../training.js';
import { byId } from '../data/index.js';
import { startPlayer } from './player.js';
import { beginWorkout, openWorkout } from './workout.js';
import { openScience } from './profil.js';

const KIND = {
  morgen: { badge: 'Morgenroutine', cls: '', btn: '', title: 'Beweglich in den Tag', options: [5, 10, 15], setting: 'minutes' },
  abend: { badge: 'Abendroutine', cls: 'night', btn: 'night', title: 'Lang & locker in den Abend', options: [10, 15, 20], setting: 'eveMinutes' },
  kraft: { badge: 'Endgrad-Kraft', cls: 'plain', btn: 'dark', title: 'Beweglichkeit unter Last', options: [15, 20, 25], setting: 'kraftMinutes' }
};

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
}

function weekStrip(s) {
  const tKey = todayKey();
  const wd = (new Date().getDay() + 6) % 7;
  const hist = getHistory();
  return `<div class="week">${WEEK_ORDER.map((d, i) => {
    const key = shiftDay(tKey, i - wd);
    const done = routineDone(hist[key]);
    const p = dayPlan(s, d);
    const label = [p.gym ? 'Studio' : '', p.run ? RUN_TYPES[p.run]?.name : '', p.other ? ACTIVITIES[p.other] : ''].filter(Boolean).join(' + ');
    return `<div class="day${done ? ' done' : ''}${key === tKey ? ' today' : ''}" title="${label || 'frei'}"><span>${WD[d]}</span><div class="dot">${done ? ICON.check : Number(key.slice(8))}</div><span class="pls"><i class="pl ${p.gym ? 'gym' : ''}"></i><i class="pl ${p.run || p.other ? 'run' : ''}"></i></span></div>`;
  }).join('')}</div>`;
}

function gymCard(s, p) {
  const active = getActive();
  if (active) {
    const done = active.items.reduce((n, it) => n + it.sets.filter((x) => x.done).length, 0);
    return `<div class="hero dark"><span class="eyebrow">Training läuft</span><div class="hero-title">${esc(active.name)}</div>
      <span class="meta">${done} ${done === 1 ? 'Satz' : 'Sätze'} erledigt · ${active.items.length} Übungen</span>
      <button class="btn light" data-act="resume">${ICON.play} Fortsetzen</button></div>`;
  }
  const plan = ensurePlan();
  if (!plan.days.length) return '';
  const doneToday = Boolean(getHistory()[todayKey()]?.gym);
  // Eine feste Einheit für heute (Wochenstruktur) hat Vorrang vor der Rotation.
  const fixed = !doneToday && p.gym && p.unit ? plan.days.findIndex((d) => d.id === p.unit) : -1;
  const idx = fixed >= 0 ? fixed : nextDayIndex(plan), day = plan.days[idx];
  const names = day.slots.map((x) => byId(x.ex)?.name).filter(Boolean);
  const label = doneToday ? 'Heute trainiert · als Nächstes' : p.gym ? 'Heute · Studio' : 'Nächstes Training';
  return `<div class="hero dark">
    <div class="row-between"><span class="eyebrow">${label}</span><span class="meta" style="display:flex;gap:5px;align-items:center;">${ICON.clock} ca. ${dayDuration(day)} min</span></div>
    <div class="stack gap-4"><div class="hero-title">${esc(day.name)}</div><span class="meta">${day.focus ? esc(day.focus) + ' · ' : ''}${day.slots.length} Übungen · Einheit ${idx + 1} von ${plan.days.length}</span></div>
    <div class="chips">${names.slice(0, 3).map((n) => `<span class="chip">${esc(n)}</span>`).join('')}${names.length > 3 ? `<span class="chip">+${names.length - 3}</span>` : ''}</div>
    <button class="btn light" data-act="gym" data-day="${idx}">${ICON.play} ${doneToday ? 'Noch ein Training starten' : 'Training starten'}</button>
    <button class="link center" data-act="other-unit" style="color:inherit;opacity:.75;">Andere Einheit wählen</button>
  </div>`;
}

const minsFor = (s, kind) => (kind === 'abend' ? s.eveMinutes : kind === 'kraft' ? s.kraftMinutes : s.minutes);

function routineCard(kind, s) {
  const meta = KIND[kind];
  const mins = minsFor(s, kind);
  const routine = buildRoutine(todayKey(), mins, kind);
  const names = routine.items.map((it) => it.ex.name);
  const done = isDone(todayKey(), kind);
  return `<div class="card stack gap-12">
    <div class="row-between"><span class="chips"><span class="badge ${meta.cls}">${meta.badge}</span>${routine.focusDay ? `<span class="badge plain">Fokus · ${esc(routine.focusDay.label)}</span>` : ''}${done ? `<span class="badge good">${ICON.check} Erledigt</span>` : ''}</span>
      <span class="meta" style="display:flex;gap:5px;align-items:center;white-space:nowrap;">${ICON.clock} ${Math.max(1, Math.round(routine.totalSec / 60))} min</span></div>
    <div class="stack gap-4"><div class="h2">${meta.title}</div><span class="meta">${routine.items.length} Übungen · ${esc(routine.focus)}</span></div>
    <div class="chips">${names.slice(0, 3).map((n) => `<span class="chip">${esc(n)}</span>`).join('')}${names.length > 3 ? `<span class="chip">+${names.length - 3}</span>` : ''}</div>
    <div class="seg" data-seg="${kind}">${meta.options.map((m) => `<button data-m="${m}" class="${m === mins ? 'active' : ''}">${m} min</button>`).join('')}</div>
    <button class="btn ${meta.btn}" data-act="routine" data-kind="${kind}">${ICON.play} ${done ? 'Nochmal starten' : 'Routine starten'}</button>
  </div>`;
}

const fmtKm = (v) => String(v).replace('.', ',');
export function pace(km, min) {
  const p = min / km;
  let m = Math.floor(p), sec = Math.round((p - m) * 60);
  if (sec === 60) { m++; sec = 0; }
  return `${m}:${String(sec).padStart(2, '0')} min/km`;
}
export const sportDetail = (e) => [e.km ? `${fmtKm(e.km)} km` : '', e.min ? `${e.min} min` : '', e.km && e.min ? pace(e.km, e.min) : ''].filter(Boolean).join(' · ');

// Geplanter Lauf des Tages als eigene Karte — neben Studio und Mobility.
function runCard(p) {
  if (!p.run) return '';
  const done = getHistory()[todayKey()]?.sports?.laufen;
  const t = RUN_TYPES[p.run] || RUN_TYPES.locker;
  return `<div class="card stack gap-12">
    <div class="row-between"><span class="chips"><span class="badge good">Laufen</span>${done ? `<span class="badge good">${ICON.check} Erledigt</span>` : ''}</span>${p.km ? `<span class="meta">Ziel: ${fmtKm(p.km)} km</span>` : ''}</div>
    <div class="stack gap-4"><div class="h2">${t.name}</div><span class="meta">${done ? esc(sportDetail(done) || 'Eingetragen') : t.hint}</span></div>
    <button class="btn ${done ? 'ghost' : 'dark'}" data-act="sport" data-type="laufen">${done ? 'Eintrag bearbeiten' : `${ICON.pulse} Lauf eintragen`}</button>
  </div>`;
}

function otherRow(p) {
  if (!p.other) return '';
  const done = getHistory()[todayKey()]?.sports?.[p.other];
  return `<button class="row" data-act="sport" data-type="${p.other}"><span class="tile ${done ? 'good' : ''}">${done ? ICON.check : ICON.pulse}</span><span class="grow"><span class="t">Heute: ${ACTIVITIES[p.other]}</span><span class="s">${done ? `Erledigt${sportDetail(done) ? ' · ' + sportDetail(done) : ''}` : 'Tippen, um die Einheit einzutragen'}</span></span>${ICON.chev}</button>`;
}

export function openSport(type, dateKey = todayKey()) {
  const cur = getHistory()[dateKey]?.sports?.[type];
  const [y, m, d] = dateKey.split('-').map(Number);
  const planned = dayPlan(getSettings(), new Date(y, m - 1, d).getDay());
  const run = type === 'laufen';
  let runType = cur?.run || planned.run || 'locker';
  openSheet(`
    <h2 class="h2" style="padding-right:44px;">${ACTIVITIES[type] || 'Ausdauer'} eintragen</h2>
    ${run ? `<div class="field"><span class="label">Art des Laufs</span><div class="chips" id="sp-types">${Object.entries(RUN_TYPES).map(([k, t]) => `<button class="chip ${k === runType ? 'on' : ''}" data-rt="${k}">${t.name}</button>`).join('')}</div></div>` : ''}
    <div class="dual">
      <div class="field"><label for="sp-km">Strecke (km)</label><input class="input" id="sp-km" inputmode="decimal" value="${cur?.km ?? (run && planned.km ? planned.km : '')}" autocomplete="off"></div>
      <div class="field"><label for="sp-min">Dauer (min)</label><input class="input" id="sp-min" inputmode="numeric" value="${cur?.min ?? ''}" autocomplete="off"></div>
    </div>
    <div id="sp-pace" class="meta center"></div>
    <p class="meta" style="margin:0;">Strecke und Dauer sind freiwillig — abhaken reicht.</p>
    <button class="btn" id="sp-save">${cur ? 'Aktualisieren' : 'Als erledigt eintragen'}</button>
    ${cur ? '<button class="btn ghost" id="sp-del">Eintrag entfernen</button>' : ''}`, (sh) => {
    const val = (id) => { const n = parseFloat($(id, sh).value.replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : null; };
    const show = () => {
      const km = val('#sp-km'), min = val('#sp-min');
      $('#sp-pace', sh).textContent = !km || !min ? '' : type === 'rad' ? `Ø ${(km / (min / 60)).toFixed(1).replace('.', ',')} km/h` : `Tempo ${pace(km, min)}`;
    };
    $('#sp-km', sh).oninput = show; $('#sp-min', sh).oninput = show; show();
    const types = $('#sp-types', sh);
    if (types) types.onclick = (e) => { const b = e.target.closest('[data-rt]'); if (!b) return; runType = b.dataset.rt; for (const c of $$('[data-rt]', sh)) c.classList.toggle('on', c === b); };
    $('#sp-save', sh).onclick = () => {
      const det = {}; const km = val('#sp-km'), min = val('#sp-min');
      if (km) det.km = km;
      if (min) det.min = min;
      if (run) det.run = runType;
      setSport(dateKey, type, det); closeSheet(); emit('change'); toast(`${ACTIVITIES[type]} eingetragen`);
    };
    const del = $('#sp-del', sh);
    if (del) del.onclick = () => { setSport(dateKey, type, null); closeSheet(); emit('change'); };
  });
}

// Schnellwahl: heute eine andere Einheit des Plans trainieren.
function openUnitChoice() {
  const plan = ensurePlan();
  const next = nextDayIndex(plan);
  openSheet(`
    <h2 class="h2" style="padding-right:44px;">Welche Einheit heute?</h2>
    <div class="list">${plan.days.map((d, i) => `<button class="row" data-u="${i}"><span class="tile ${i === next ? 'accent' : ''}" style="font-weight:700;">${i + 1}</span><span class="grow"><span class="t">${esc(d.name)}</span><span class="s">${d.slots.length} Übungen · ca. ${dayDuration(d)} min</span></span>${i === next ? '<span class="badge">Rotation</span>' : ''}${ICON.chev}</button>`).join('')}</div>
    <button class="btn ghost" id="u-free">Freies Training ohne Plan</button>`, (sh) => {
    for (const b of $$('[data-u]', sh)) b.onclick = () => { closeSheet(); beginWorkout(ensurePlan(), Number(b.dataset.u)); };
    $('#u-free', sh).onclick = () => { closeSheet(); beginWorkout(null, 0); };
  });
}

export function render() {
  const s = getSettings();
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const p = dayPlan(s, now.getDay());
  const kraftToday = (s.kraftDays || []).includes(now.getDay());
  const evening = now.getHours() >= 16;
  const routines = evening ? ['abend', 'morgen'] : ['morgen', 'abend'];
  if (kraftToday) routines.splice(1, 0, 'kraft');
  const zd = getHistory()[todayKey()]?.zwischendurch?.count || 0;
  const gym = gymCard(s, p);
  const gymFirst = p.gym || Boolean(getActive());
  const free = !p.gym && !p.run && !p.other;
  const first = routineCard(routines[0], s);
  const rest = routines.slice(1).map((k) => routineCard(k, s)).join('');
  $('#view-heute').innerHTML = `
    <div class="row-between"><div class="stack gap-4"><span class="eyebrow">${esc(dateStr)}</span><h1 class="h1">${greeting()}, ${esc(s.name)}.</h1></div>
      <button class="icon-btn" data-act="info" aria-label="Hintergrund und Wissenschaft">${ICON.flask}</button></div>
    ${weekStrip(s)}
    ${gymFirst ? gym + runCard(p) + first : runCard(p) + first + gym}
    ${otherRow(p)}
    ${free ? `<div class="row"><span class="tile">${ICON.moon}</span><span class="grow"><span class="t">Heute: frei</span><span class="s">Erholung ist Teil des Trainings — Mobility reicht völlig.</span></span></div>` : ''}
    ${rest}
    <button class="row" data-act="zd"><span class="tile accent">${ICON.loop}</span><span class="grow"><span class="t">Zwischendurch</span><span class="s">3 Übungen · ca. 3 min gegen das Sitzen</span></span>${zd ? `<span class="badge good">${zd}× heute</span>` : ICON.chev}</button>
    ${p.run ? '' : `<button class="row" data-act="sport" data-type="laufen"><span class="tile good">${ICON.pulse}</span><span class="grow"><span class="t">Lauf eintragen</span><span class="s">Auch ohne Plan — Strecke, Dauer, Art</span></span>${ICON.chev}</button>`}
  `;
  const root = $('#view-heute');
  root.onclick = (e) => {
    const seg = e.target.closest('[data-seg] [data-m]');
    if (seg) { setSetting(KIND[seg.parentElement.dataset.seg].setting, Number(seg.dataset.m)); return emit('change'); }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'gym') beginWorkout(ensurePlan(), Number(b.dataset.day));
    else if (act === 'other-unit') openUnitChoice();
    else if (act === 'resume') openWorkout();
    else if (act === 'routine') startPlayer(buildRoutine(todayKey(), minsFor(getSettings(), b.dataset.kind), b.dataset.kind));
    else if (act === 'zd') startPlayer(buildRoutine(todayKey(), 3, 'zwischendurch'));
    else if (act === 'sport') openSport(b.dataset.type);
    else if (act === 'info') openScience();
  };
}
