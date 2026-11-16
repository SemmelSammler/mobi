// Trainings-Logger: Sätze eintragen, Pausentimer, Übungen tauschen, Abschluss mit Rekorden.
import { $, $$, esc, ICON, chime, emit, openSheet, closeSheet, thumb, hydrateThumbs, toast, fmtNum, dragHandle, makeSortable, arrayMove } from '../ui.js';
import { byId, EQUIP, muscleNames } from '../data/index.js';
import { getSettings, setActive } from '../store.js';
import { getActive, startWorkout, finishWorkout, addExercise, replaceExercise, sessionStats, alternatives, fmtKg, fmtDuration } from '../training.js';
import { openExercise, pickExercise, openReplace } from './uebungen.js';

let session = null;
let clockTimer = null;
let restTimer = null;
let wakeLock = null;

const save = () => setActive(session);
const root = () => $('#workout');
const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : ''; };

function lockScreen() {
  if (!navigator.wakeLock || wakeLock) return;
  navigator.wakeLock.request('screen').then((wl) => { wakeLock = wl; wl.addEventListener('release', () => { wakeLock = null; }); }).catch(() => {});
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && session && !root().classList.contains('hidden')) lockScreen(); });

export const hasActive = () => Boolean(getActive());

export function beginWorkout(plan, dayIdx) {
  session = startWorkout(plan, dayIdx);
  openWorkout();
}

export function openWorkout() {
  session = session || getActive();
  if (!session) return;
  root().classList.remove('hidden');
  lockScreen();
  renderWorkout();
  clearInterval(clockTimer);
  clockTimer = setInterval(updateClock, 1000);
  if (session.rest && session.rest.until > Date.now()) runRest();
  emit('change');
}

function minimize() {
  root().classList.add('hidden');
  clearInterval(clockTimer);
  if (wakeLock) wakeLock.release().catch(() => {});
  emit('change');
}

function updateClock() {
  const el = $('#w-clock');
  if (!el || !session) return;
  const s = Math.floor((Date.now() - session.start) / 1000);
  const st = sessionStats(session);
  el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · ${st.sets} ${st.sets === 1 ? 'Satz' : 'Sätze'}`;
}

function setRow(it, i, si) {
  const s = it.sets[si];
  const ex = byId(it.ex);
  const prev = s.prev ? (s.prev.w ? `${fmtKg(s.prev.w)} × ${s.prev.r}` : `${s.prev.r}`) : '–';
  return `<span class="no">${si + 1}</span><span class="prev">${prev}</span>
    <input inputmode="decimal" data-f="w" data-i="${i}" data-s="${si}" value="${s.w === '' ? '' : fmtKg(s.w)}" placeholder="${ex.bw ? '+ kg' : 'kg'}" aria-label="Gewicht Satz ${si + 1}" class="${s.done ? 'dn' : ''}">
    <input inputmode="numeric" data-f="r" data-i="${i}" data-s="${si}" value="${s.r}" placeholder="${it.target.reps[0]}–${it.target.reps[1]}" aria-label="${ex.unit === 'sek' ? 'Sekunden' : 'Wiederholungen'} Satz ${si + 1}" class="${s.done ? 'dn' : ''}">
    <button class="set-check ${s.done ? 'on' : ''}" data-check="${i}:${si}" aria-label="Satz ${si + 1} ${s.done ? 'zurücksetzen' : 'abhaken'}">${ICON.check}</button>`;
}

function card(it, i) {
  const ex = byId(it.ex);
  const allDone = it.sets.length > 0 && it.sets.every((s) => s.done);
  const rest = it.target.rest >= 120 ? `${(it.target.rest / 60).toString().replace('.', ',')} min` : `${it.target.rest} s`;
  return `<div class="w-card ${allDone ? 'done' : ''}" data-card="${i}" data-sort>
    <div class="w-ex">
      <button data-open="${ex.id}" aria-label="Übungsdetails">${thumb(ex.id)}</button>
      <button class="grow stack" data-open="${ex.id}"><span class="h3">${esc(ex.name)}</span><span class="meta">${it.target.sets} × ${it.target.reps[0]}–${it.target.reps[1]} ${ex.unit === 'sek' ? 'Sek.' : 'Wdh.'} · ${rest} Pause</span></button>
      ${dragHandle(ex.name)}
    </div>
    <div class="w-hint ${it.up ? 'up' : ''}">${it.up ? ICON.up : ICON.target}<span>${esc(it.hint)}</span></div>
    <div class="sets">
      <span class="hd">#</span><span class="hd">Letztes Mal</span><span class="hd">${ex.bw ? 'Zusatz' : 'kg'}</span><span class="hd">${ex.unit === 'sek' ? 'Sek.' : 'Wdh.'}</span><span class="hd"></span>
      ${it.sets.map((_, si) => setRow(it, i, si)).join('')}
    </div>
    <div class="w-actions"><button data-addset="${i}">+ Satz</button>${it.sets.length > 1 ? `<button data-delset="${i}">− Satz</button>` : ''}<button data-swap="${i}">${ICON.swap} Ersetzen</button><button data-menu="${i}">Mehr</button></div>
  </div>`;
}

function renderWorkout() {
  const st = sessionStats(session);
  root().innerHTML = `<div class="inner" style="padding-bottom:120px;">
    <div class="w-head">
      <button class="icon-btn" id="w-min" aria-label="Minimieren">${ICON.down}</button>
      <div class="grow stack"><span class="h3">${esc(session.name)}</span><span class="w-clock" id="w-clock"></span></div>
      <button class="btn small ${st.sets ? '' : 'ghost'}" id="w-finish">Beenden</button>
    </div>
    <div class="stack gap-12" id="w-items">${session.items.length ? session.items.map(card).join('') : '<div class="empty">Noch keine Übung.<br>Füge deine erste Übung hinzu.</div>'}</div>
    <button class="btn ghost" id="w-add">${ICON.plus} Übung hinzufügen</button>
    <button class="btn line" id="w-cancel" style="color:var(--muted);">Training verwerfen</button>
  </div>`;
  hydrateThumbs(root());
  updateClock();
  paintDone();
  wire();
}

function paintDone() {
  for (const inp of $$('.sets input', root())) {
    const s = session.items[inp.dataset.i]?.sets[inp.dataset.s];
    inp.style.background = s?.done ? 'var(--good-soft)' : '';
    inp.style.color = s?.done ? 'var(--good)' : '';
  }
}

function wire() {
  const r = root();
  makeSortable($('#w-items'), (from, to) => { arrayMove(session.items, from, to); save(); renderWorkout(); });
  $('#w-min').onclick = minimize;
  $('#w-finish').onclick = confirmFinish;
  $('#w-add').onclick = () => pickExercise({ title: 'Übung hinzufügen', onPick: (id) => { addExercise(session, id); renderWorkout(); } });
  $('#w-cancel').onclick = () => openSheet(`
    <h2 class="h2">Training verwerfen?</h2><p class="body">Alle eingetragenen Sätze dieser Einheit gehen verloren.</p>
    <button class="btn danger" id="c-yes">Verwerfen</button><button class="btn ghost" data-no>Weiter trainieren</button>`, (sh) => {
    $('#c-yes', sh).onclick = () => { closeSheet(); endSession(); };
    $('[data-no]', sh).onclick = closeSheet;
  });
  r.oninput = (e) => {
    const inp = e.target.closest('input[data-f]');
    if (!inp) return;
    const s = session.items[inp.dataset.i].sets[inp.dataset.s];
    s[inp.dataset.f] = num(inp.value);
    // Gewicht in die folgenden, noch offenen Sätze übernehmen
    if (inp.dataset.f === 'w') {
      const sets = session.items[inp.dataset.i].sets;
      for (let k = Number(inp.dataset.s) + 1; k < sets.length; k++) {
        if (sets[k].done) continue;
        sets[k].w = s.w;
        const other = $(`input[data-f="w"][data-i="${inp.dataset.i}"][data-s="${k}"]`, r);
        if (other) other.value = inp.value;
      }
    }
    save();
  };
  r.onclick = (e) => {
    const t = e.target;
    const open = t.closest('[data-open]');
    if (open) return openExercise(open.dataset.open);
    const chk = t.closest('[data-check]');
    if (chk) return toggleSet(...chk.dataset.check.split(':').map(Number));
    const add = t.closest('[data-addset]');
    if (add) {
      const it = session.items[add.dataset.addset];
      const lastSet = it.sets[it.sets.length - 1];
      it.sets.push({ w: lastSet?.w ?? '', r: '', done: false, prev: null });
      save(); return renderWorkout();
    }
    const del = t.closest('[data-delset]');
    if (del) { session.items[del.dataset.delset].sets.pop(); save(); return renderWorkout(); }
    const sw = t.closest('[data-swap]');
    if (sw) {
      const k = Number(sw.dataset.swap);
      return openReplace(session.items[k].ex, { onPick: (id) => { replaceExercise(session, k, id); renderWorkout(); toast('Übung ersetzt'); } });
    }
    const menu = t.closest('[data-menu]');
    if (menu) return itemMenu(Number(menu.dataset.menu));
  };
}

function toggleSet(i, si) {
  const it = session.items[i], s = it.sets[si], ex = byId(it.ex);
  if (!s.done) {
    if (s.r === '' || !(Number(s.r) > 0)) {
      // Leeres Feld: Vorgabe übernehmen, damit ein Tipp reicht
      s.r = s.prev?.r || it.target.reps[0];
    }
    if (s.w === '' && !ex.bw && s.prev?.w) s.w = s.prev.w;
    s.done = true;
    chime([880]);
    if (getSettings().autoRest !== false) startRest(it.target.rest, ex.name);
  } else {
    s.done = false;
  }
  save();
  renderWorkout();
}

function itemMenu(i) {
  const it = session.items[i], ex = byId(it.ex);
  const alts = alternatives(ex.id, 5);
  openSheet(`
    <h2 class="h2" style="padding-right:44px;">${esc(ex.name)}</h2>
    <span class="sec-l">Ersetzen durch</span>
    <div class="list">${alts.map((a) => `<button class="row" data-rep="${a.id}">${thumb(a.id)}<span class="grow"><span class="t">${esc(a.name)}</span><span class="s">${esc(muscleNames(a.primary).join(', '))} · ${esc(EQUIP[a.equip])}</span></span>${ICON.chev}</button>`).join('')}</div>
    <button class="btn ghost" id="m-other">${ICON.search} Andere Übung suchen</button>
    <div class="dual">
      <button class="btn line" id="m-up" ${i === 0 ? 'disabled' : ''}>${ICON.up} Nach oben</button>
      <button class="btn danger" id="m-del">${ICON.trash} Entfernen</button>
    </div>`, (sh) => {
    const rep = (id) => { replaceExercise(session, i, id); closeSheet(); renderWorkout(); toast('Übung ersetzt'); };
    for (const b of $$('[data-rep]', sh)) b.onclick = () => rep(b.dataset.rep);
    $('#m-other', sh).onclick = () => pickExercise({ title: 'Ersetzen durch', preferGroup: ex.group, onPick: rep });
    $('#m-up', sh).onclick = () => { [session.items[i - 1], session.items[i]] = [session.items[i], session.items[i - 1]]; save(); closeSheet(); renderWorkout(); };
    $('#m-del', sh).onclick = () => { session.items.splice(i, 1); save(); closeSheet(); renderWorkout(); };
  });
}

// ---------- Pausentimer ----------
function startRest(secs, label) {
  session.rest = { until: Date.now() + secs * 1000, total: secs, label };
  save();
  runRest();
}

function runRest() {
  clearInterval(restTimer);
  const el = $('#rest');
  el.classList.remove('hidden');
  el.innerHTML = `<div class="bar" id="rest-bar"></div><div class="stack"><span class="time" id="rest-time"></span><span class="lbl">Pause</span></div><span class="grow"></span><button data-r="-15">−15</button><button data-r="15">+15</button><button data-r="skip">Weiter</button>`;
  el.onclick = (e) => {
    const b = e.target.closest('[data-r]');
    if (!b || !session?.rest) return;
    if (b.dataset.r === 'skip') return stopRest();
    const d = Number(b.dataset.r) * 1000;
    session.rest.until = Math.max(Date.now() + 1000, session.rest.until + d);
    session.rest.total = Math.max(5, session.rest.total + d / 1000);
    save(); paint();
  };
  const paint = () => {
    if (!session?.rest) return stopRest();
    const left = Math.ceil((session.rest.until - Date.now()) / 1000);
    if (left <= 0) { chime([660, 880], getSettings().restSound !== false && getSettings().sound); stopRest(); toast('Pause vorbei — nächster Satz'); return; }
    $('#rest-time').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    $('#rest-bar').style.width = `${Math.max(0, Math.min(100, (left / session.rest.total) * 100))}%`;
  };
  paint();
  restTimer = setInterval(paint, 250);
}

function stopRest() {
  clearInterval(restTimer);
  $('#rest').classList.add('hidden');
  if (session) { session.rest = null; save(); }
}

// ---------- Abschluss ----------
function confirmFinish() {
  const st = sessionStats(session);
  if (!st.sets) { toast('Noch kein Satz abgehakt'); return; }
  const open = session.items.reduce((n, it) => n + it.sets.filter((s) => !s.done).length, 0);
  if (!open) return finish();
  openSheet(`
    <h2 class="h2">Training beenden?</h2>
    <p class="body">${open} ${open === 1 ? 'Satz ist' : 'Sätze sind'} noch offen. Nur abgehakte Sätze werden gespeichert.</p>
    <button class="btn" id="f-yes">Beenden und speichern</button><button class="btn ghost" data-no>Weiter trainieren</button>`, (sh) => {
    $('#f-yes', sh).onclick = () => { closeSheet(); finish(); };
    $('[data-no]', sh).onclick = closeSheet;
  });
}

function endSession() {
  clearInterval(clockTimer); clearInterval(restTimer);
  $('#rest').classList.add('hidden');
  setActive(null);
  session = null;
  root().classList.add('hidden');
  if (wakeLock) wakeLock.release().catch(() => {});
  emit('change');
}

function finish() {
  clearInterval(clockTimer); clearInterval(restTimer);
  $('#rest').classList.add('hidden');
  const res = finishWorkout(session);
  session = null;
  if (!res) return endSession();
  chime([660, 880, 1100]);
  const { workout, prs, stats } = res;
  root().innerHTML = `<div class="inner"><div class="done-wrap">
    <div class="done-circle">${ICON.checkBig}</div>
    <div class="stack gap-8"><div class="done-h">Stark gemacht.</div><div class="body">${esc(workout.name)} · ${fmtDuration(workout.end - workout.start)}</div></div>
    <div class="stats" style="width:100%;">
      <div class="stat"><span class="v">${stats.sets}</span><span class="l">Sätze</span></div>
      <div class="stat"><span class="v">${stats.exercises}</span><span class="l">Übungen</span></div>
      <div class="stat"><span class="v">${stats.volume >= 10000 ? (stats.volume / 1000).toFixed(1).replace('.', ',') + ' t' : fmtNum(stats.volume)}</span><span class="l">${stats.volume >= 10000 ? 'bewegt' : 'kg bewegt'}</span></div>
    </div>
    ${prs.length ? `<div class="card flat stack gap-8" style="width:100%;text-align:left;"><span class="badge good" style="align-self:flex-start;">${ICON.trophy} ${prs.length} ${prs.length === 1 ? 'neuer Rekord' : 'neue Rekorde'}</span>${prs.map((p) => `<div class="row-between"><span style="font-weight:600;">${esc(p.name)}</span><span class="num meta">${esc(p.text)}</span></div>`).join('')}</div>` : ''}
    <button class="btn" id="w-done" style="max-width:280px;">Fertig</button>
  </div></div>`;
  $('#w-done').onclick = () => { root().classList.add('hidden'); if (wakeLock) wakeLock.release().catch(() => {}); emit('change'); };
  emit('change');
}
