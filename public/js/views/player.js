// Geführter Mobility-Player: Countdown je Übung, Seitenwechsel, Contract-Relax, Abschluss.
import { $, esc, ICON, chime, emit } from '../ui.js';
import { PREP_SECS, fmtClock } from '../routine.js';
import { animateFigure } from '../figure.js';
import { getSettings, markDone, consumeDeckIds, streak, getHistory } from '../store.js';
import { openExercise } from './uebungen.js';

const KIND_TITLE = { morgen: 'Morgenroutine', abend: 'Abendroutine', kraft: 'Endgrad-Kraft', zwischendurch: 'Zwischendurch' };
const R = 56, CIRC = 2 * Math.PI * R;
let session = null;

function requestWakeLock() {
  if (!session || !navigator.wakeLock) return;
  navigator.wakeLock.request('screen').then((wl) => { if (session) session.wakeLock = wl; else wl.release(); }).catch(() => {});
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') requestWakeLock(); });

export function startPlayer(routine) {
  stopSession();
  session = { routine, idx: 0, phase: 'prep', remain: PREP_SECS, deadline: 0, paused: false, sideSwitched: false, stopAnim: null, timer: null, wakeLock: null };
  requestWakeLock();
  $('#player').classList.remove('hidden');
  renderExercise();
  session.timer = setInterval(tick, 200);
  chime([660]);
}

function stopSession() {
  if (!session) return;
  clearInterval(session.timer);
  if (session.stopAnim) session.stopAnim();
  if (session.wakeLock) session.wakeLock.release().catch(() => {});
  session = null;
  $('#player').classList.add('hidden');
}

const currentItem = () => session.routine.items[session.idx];

function renderExercise() {
  const { routine, idx } = session;
  const item = currentItem(), ex = item.ex, next = routine.items[idx + 1];
  const pnf = routine.kind === 'abend' && Boolean(ex.pnf) && getSettings().pnf;
  $('#player').innerHTML = `<div class="inner">
    <div class="p-top">
      <button class="icon-btn" id="p-close" aria-label="Beenden">${ICON.close}</button>
      <div class="mid"><span class="t">${KIND_TITLE[routine.kind] || 'Routine'}</span><span class="s">Übung ${idx + 1} von ${routine.items.length}</span></div>
      <button class="icon-btn" id="p-infobtn" aria-label="Übungsinfo">${ICON.info}</button>
    </div>
    <div class="p-segments">${routine.items.map((_, i) => `<i class="${i <= idx ? 'on' : ''}"></i>`).join('')}</div>
    <div class="stage"><svg id="p-fig"></svg>
      ${ex.perSide ? '<span class="side-pill" id="p-side">Linke Seite</span>' : ''}
      <span class="phase-pill" id="p-phase"><i></i><span>${esc(pnf ? 'Sinken & atmen' : ex.phases[0])}</span></span>
    </div>
    <div class="stack gap-8">
      <div class="p-name">${esc(ex.name)}</div>
      <div class="p-how">${esc(ex.how[0])}. ${esc(ex.how[1])}.</div>
      ${item.boosted ? '<span class="badge" style="align-self:flex-start;">Fokustag · längere Haltezeit</span>' : ''}
    </div>
    <div class="p-ring-wrap"><div class="p-ring">
      <svg width="132" height="132" viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" stroke="var(--line)" stroke-width="8" fill="none"/><circle id="p-arc" cx="66" cy="66" r="${R}" stroke="var(--accent)" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${CIRC.toFixed(1)}" transform="rotate(-90 66 66)"/></svg>
      <div class="val"><span class="n" id="p-time">–</span><span class="l" id="p-sub">Sek.</span></div>
    </div></div>
    <div class="p-controls">
      <button class="p-skip" id="p-prev" aria-label="Zurück">${ICON.prev}</button>
      <button class="p-play" id="p-toggle" aria-label="Pause">${ICON.pauseBig}</button>
      <button class="p-skip" id="p-next" aria-label="Weiter">${ICON.next}</button>
    </div>
    <div class="p-next"><span class="l">ALS NÄCHSTES</span><span class="t">${next ? esc(next.ex.name) : 'Geschafft — letzte Übung'}</span></div>
  </div>`;
  if (session.stopAnim) session.stopAnim();
  const pill = $('#p-phase');
  session.stopAnim = animateFigure($('#p-fig'), ex, {
    onPhase(i) {
      if (session?.pnfOn || !pill || (i !== 0 && i !== 2)) return;
      pill.lastElementChild.textContent = ex.phases[i === 0 ? 0 : 1];
      pill.classList.toggle('back', i === 2);
    }
  });
  Object.assign(session, { phase: 'prep', remain: PREP_SECS, deadline: Date.now() + PREP_SECS * 1000, sideSwitched: false, paused: false, pnfOn: pnf, lastPhase: 'relax' });
  $('#p-close').onclick = () => { stopSession(); emit('change'); };
  $('#p-infobtn').onclick = () => { if (!session.paused) togglePause(); openExercise(ex.id, { inPlayer: true }); };
  $('#p-prev').onclick = () => { session.idx = Math.max(0, session.idx - 1); renderExercise(); };
  $('#p-next').onclick = advance;
  $('#p-toggle').onclick = togglePause;
  updateTimeUI();
}

function togglePause() {
  if (!session) return;
  const btn = $('#p-toggle');
  if (session.paused) {
    session.deadline = Date.now() + session.remain * 1000;
    session.paused = false;
    btn.innerHTML = ICON.pauseBig; btn.setAttribute('aria-label', 'Pause');
  } else {
    session.remain = Math.max(0, (session.deadline - Date.now()) / 1000);
    session.paused = true;
    btn.innerHTML = ICON.playBig; btn.setAttribute('aria-label', 'Fortsetzen');
  }
}

function advance() {
  if (session.idx + 1 < session.routine.items.length) { session.idx++; renderExercise(); chime([660]); }
  else finishRoutine();
}

function tick() {
  if (!session || session.paused) return;
  const remain = (session.deadline - Date.now()) / 1000;
  const item = currentItem();
  if (remain <= 0) {
    if (session.phase === 'prep') {
      session.phase = 'run';
      session.deadline = Date.now() + item.secs * 1000;
      session.remain = item.secs;
      chime([880]);
      updateTimeUI();
      return;
    }
    advance();
    return;
  }
  session.remain = remain;
  if (session.phase === 'run' && item.ex.perSide && !session.sideSwitched && remain <= item.secs / 2) {
    session.sideSwitched = true;
    const chip = $('#p-side');
    if (chip) chip.textContent = 'Rechte Seite';
    chime([880, 880]);
  }
  // Contract-Relax: 20 s lösen/sinken, dann 10 s sanft anspannen — im Wechsel.
  if (session.phase === 'run' && session.pnfOn) {
    const half = item.ex.perSide ? item.secs / 2 : item.secs;
    const phase = ((item.secs - remain) % half) % 30 < 20 ? 'relax' : 'contract';
    if (phase !== session.lastPhase) {
      session.lastPhase = phase;
      const pill = $('#p-phase');
      if (pill) pill.lastElementChild.textContent = phase === 'contract' ? 'Sanft anspannen' : 'Lösen & tiefer sinken';
      chime(phase === 'contract' ? [990] : [550]);
    }
  }
  updateTimeUI();
}

function updateTimeUI() {
  if (!session) return;
  const item = currentItem();
  const total = session.phase === 'prep' ? PREP_SECS : item.secs;
  const remain = Math.max(0, session.remain);
  const arc = $('#p-arc'), timeEl = $('#p-time'), subEl = $('#p-sub');
  if (!arc || !timeEl) return;
  const frac = Math.min(1, Math.max(0, 1 - remain / total));
  arc.setAttribute('stroke-dashoffset', (CIRC * (1 - frac)).toFixed(1));
  timeEl.textContent = session.phase === 'prep' ? Math.ceil(remain) : fmtClock(Math.ceil(remain));
  subEl.textContent = session.phase === 'prep' ? 'gleich geht’s los' : `von ${fmtClock(item.secs)}`;
}

function finishRoutine() {
  const routine = session.routine;
  clearInterval(session.timer);
  if (session.stopAnim) session.stopAnim();
  const doneIds = routine.items.map((it) => it.ex.id);
  markDone(routine.dateKey, routine.minutes, routine.kind, doneIds);
  consumeDeckIds(doneIds);
  const st = streak(routine.dateKey);
  chime([660, 880, 1100]);
  const kind = routine.kind;
  const zdCount = getHistory()[routine.dateKey]?.zwischendurch?.count || 0;
  const headline = { zwischendurch: 'Kurz bewegt.', kraft: 'Stark.', abend: 'Guter Abschluss.' }[kind] || 'Geschafft!';
  const extra = { zwischendurch: `${zdCount}× heute — das summiert sich.`, kraft: 'Endgrad-Arbeit zahlt doppelt ein.', abend: 'Schlaf gut.' }[kind] || '';
  $('#player').innerHTML = `<div class="inner"><div class="done-wrap">
    <div class="done-circle">${ICON.checkBig}</div>
    <div class="stack gap-8"><div class="done-h">${headline}</div>
      <div class="body">${routine.items.length} Übungen · ca. ${Math.max(1, Math.round(routine.totalSec / 60))} Minuten${kind === 'zwischendurch' ? '' : `<br>Serie: <b>${st} ${st === 1 ? 'Tag' : 'Tage'}</b> in Folge`}${extra ? '<br>' + extra : ''}</div></div>
    <button class="btn" id="p-done" style="max-width:280px;">Fertig</button>
  </div></div>`;
  $('#p-done').onclick = () => { stopSession(); emit('change'); };
}
