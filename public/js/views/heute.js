// Startseite: Woche, heutiges Training, Mobility-Routinen, Ausdauer.
import { $, $$, esc, ICON, emit, openSheet, closeSheet, WD, WEEK_ORDER, ACTIVITIES, toast } from '../ui.js';
import { buildRoutine, todayKey } from '../routine.js';
import { getSettings, setSetting, getHistory, isDone, routineDone, setSport, shiftDay } from '../store.js';
import { ensurePlan, nextDayIndex, dayDuration, getActive } from '../training.js';
import { byId } from '../data/index.js';
import { startPlayer } from './player.js';
import { beginWorkout, openWorkout } from './workout.js';
import { openScience } from './profil.js';

const KIND = {
  morgen: { badge: 'Morgenroutine', cls: '', btn: '', title: 'Beweglich in den Tag', options: [5, 10, 15], setting: 'minutes', icon: 'sun' },
  abend: { badge: 'Abendroutine', cls: 'night', btn: 'night', title: 'Lang & locker in den Abend', options: [10, 15, 20], setting: 'eveMinutes', icon: 'moon' },
  kraft: { badge: 'Endgrad-Kraft', cls: 'plain', btn: 'dark', title: 'Beweglichkeit unter Last', options: [15, 20, 25], setting: 'kraftMinutes', icon: 'dumbbell' }
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
    const plan = s.weekPlan?.[d] || '';
    const pl = plan === 'gym' ? 'gym' : plan && plan !== 'ruhe' ? 'run' : '';
    return `<div class="day${done ? ' done' : ''}${key === tKey ? ' today' : ''}" title="${ACTIVITIES[plan] || ''}"><span>${WD[d]}</span><div class="dot">${done ? ICON.check : Number(key.slice(8))}</div><i class="pl ${pl}"></i></div>`;
  }).join('')}</div>`;
}

function gymCard(s, planToday) {
  const active = getActive();
  if (active) {
    const done = active.items.reduce((n, it) => n + it.sets.filter((x) => x.done).length, 0);
    return `<div class="hero dark"><span class="eyebrow">Training läuft</span><div class="hero-title">${esc(active.name)}</div>
      <span class="meta">${done} ${done === 1 ? 'Satz' : 'Sätze'} erledigt · ${active.items.length} Übungen</span>
      <button class="btn light" data-act="resume">${ICON.play} Fortsetzen</button></div>`;
  }
  const plan = ensurePlan();
  if (!plan.days.length) return '';
  const idx = nextDayIndex(plan), day = plan.days[idx];
  const doneToday = Boolean(getHistory()[todayKey()]?.gym);
  const names = day.slots.map((x) => byId(x.ex)?.name).filter(Boolean);
  const label = doneToday ? 'Heute trainiert · als Nächstes' : planToday === 'gym' ? 'Heute · Studio' : 'Nächstes Training';
  return `<div class="hero dark">
    <div class="row-between"><span class="eyebrow">${label}</span><span class="meta" style="display:flex;gap:5px;align-items:center;">${ICON.clock} ca. ${dayDuration(day)} min</span></div>
    <div class="stack gap-4"><div class="hero-title">${esc(day.name)}</div><span class="meta">${esc(day.focus || '')} · ${day.slots.length} Übungen · Tag ${idx + 1} von ${plan.days.length}</span></div>
    <div class="chips">${names.slice(0, 3).map((n) => `<span class="chip">${esc(n)}</span>`).join('')}${names.length > 3 ? `<span class="chip">+${names.length - 3}</span>` : ''}</div>
    <button class="btn light" data-act="gym" data-day="${idx}">${ICON.play} ${doneToday ? 'Noch ein Training starten' : 'Training starten'}</button>
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

function sportRow(plan) {
  if (!plan || plan === 'gym') return '';
  if (plan === 'ruhe') return `<div class="row"><span class="tile">${ICON.moon}</span><span class="grow"><span class="t">Heute: Ruhetag</span><span class="s">Erholung ist Teil des Trainings — Mobility reicht völlig.</span></span></div>`;
  const sport = getHistory()[todayKey()]?.sport;
  const detail = sport ? [sport.km ? `${String(sport.km).replace('.', ',')} km` : '', sport.min ? `${sport.min} min` : ''].filter(Boolean).join(' · ') : '';
  return `<button class="row" data-act="sport" data-type="${plan}"><span class="tile ${sport ? 'good' : ''}">${sport ? ICON.check : ICON.pulse}</span><span class="grow"><span class="t">Heute: ${ACTIVITIES[plan]}</span><span class="s">${sport ? `Erledigt${detail ? ' · ' + detail : ''}` : 'Tippen, um die Einheit einzutragen'}</span></span>${ICON.chev}</button>`;
}

export function openSport(type, dateKey = todayKey()) {
  const cur = getHistory()[dateKey]?.sport;
  openSheet(`
    <h2 class="h2">${ACTIVITIES[type] || 'Ausdauer'} eintragen</h2>
    <p class="body">Strecke und Dauer sind freiwillig — abhaken reicht.</p>
    <div class="dual">
      <div class="field"><label for="sp-km">Strecke (km)</label><input class="input" id="sp-km" inputmode="decimal" value="${cur?.km ?? ''}" autocomplete="off"></div>
      <div class="field"><label for="sp-min">Dauer (min)</label><input class="input" id="sp-min" inputmode="numeric" value="${cur?.min ?? ''}" autocomplete="off"></div>
    </div>
    <div id="sp-pace" class="meta center"></div>
    <button class="btn" id="sp-save">${cur ? 'Aktualisieren' : 'Als erledigt eintragen'}</button>
    ${cur ? '<button class="btn ghost" id="sp-del">Eintrag entfernen</button>' : ''}`, (sh) => {
    const val = (id) => { const n = parseFloat($(id, sh).value.replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : null; };
    const pace = () => {
      const km = val('#sp-km'), min = val('#sp-min');
      if (!km || !min) { $('#sp-pace', sh).textContent = ''; return; }
      const p = min / km;
      $('#sp-pace', sh).textContent = type === 'rad' ? `Ø ${(km / (min / 60)).toFixed(1).replace('.', ',')} km/h` : `Tempo ${Math.floor(p)}:${String(Math.round((p % 1) * 60)).padStart(2, '0')} min/km`;
    };
    $('#sp-km', sh).oninput = pace; $('#sp-min', sh).oninput = pace; pace();
    $('#sp-save', sh).onclick = () => {
      const d = {}; const km = val('#sp-km'), min = val('#sp-min');
      if (km) d.km = km; if (min) d.min = min;
      setSport(dateKey, type, d); closeSheet(); emit('change'); toast(`${ACTIVITIES[type]} eingetragen`);
    };
    const del = $('#sp-del', sh);
    if (del) del.onclick = () => { setSport(dateKey, null); closeSheet(); emit('change'); };
  });
}

export function render() {
  const s = getSettings();
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const planToday = s.weekPlan?.[now.getDay()] || '';
  const kraftToday = (s.kraftDays || []).includes(now.getDay());
  const evening = now.getHours() >= 16;
  const routines = evening ? ['abend', 'morgen'] : ['morgen', 'abend'];
  if (kraftToday) routines.splice(1, 0, 'kraft');
  const zd = getHistory()[todayKey()]?.zwischendurch?.count || 0;
  const gym = gymCard(s, planToday);
  const gymFirst = planToday === 'gym' || Boolean(getActive());
  const first = routineCard(routines[0], s);
  const rest = routines.slice(1).map((k) => routineCard(k, s)).join('');
  $('#view-heute').innerHTML = `
    <div class="row-between"><div class="stack gap-4"><span class="eyebrow">${esc(dateStr)}</span><h1 class="h1">${greeting()}, ${esc(s.name)}.</h1></div>
      <button class="icon-btn" data-act="info" aria-label="Hintergrund und Wissenschaft">${ICON.flask}</button></div>
    ${weekStrip(s)}
    ${gymFirst ? gym + first : first + gym}
    ${sportRow(planToday)}
    ${rest}
    <button class="row" data-act="zd"><span class="tile accent">${ICON.loop}</span><span class="grow"><span class="t">Zwischendurch</span><span class="s">3 Übungen · ca. 3 min gegen das Sitzen</span></span>${zd ? `<span class="badge good">${zd}× heute</span>` : ICON.chev}</button>
  `;
  const root = $('#view-heute');
  root.onclick = (e) => {
    const seg = e.target.closest('[data-seg] [data-m]');
    if (seg) { setSetting(KIND[seg.parentElement.dataset.seg].setting, Number(seg.dataset.m)); return emit('change'); }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'gym') beginWorkout(ensurePlan(), Number(b.dataset.day));
    else if (act === 'resume') openWorkout();
    else if (act === 'routine') startPlayer(buildRoutine(todayKey(), minsFor(getSettings(), b.dataset.kind), b.dataset.kind));
    else if (act === 'zd') startPlayer(buildRoutine(todayKey(), 3, 'zwischendurch'));
    else if (act === 'sport') openSport(b.dataset.type);
    else if (act === 'info') openScience();
  };
}
