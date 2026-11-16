// mobi — App-Logik (Tabs, Heute, Player, Übungen, Kalender, Profil)
import { BLOCKS, ABLOCKS, KBLOCKS, ZBLOCKS, EXERCISES, FOCUS_TARGETS, MISTAKES, byBlock } from './data.js';
import { buildRoutine, todayKey, fmtClock, PREP_SECS } from './routine.js';
import { getSettings, setSetting, getHistory, markDone, isDone, totalSessions, sessionsInMonth, streak, consumeDeckIds, toggleBlacklist, getBlacklist, getAssessments, saveAssessment, toggleSportDone } from './store.js';

const SPORT_TYPES = {
  '': '—',
  laufen: 'Laufen',
  rad: 'Rad',
  schwimmen: 'Schwimmen',
  gym: 'Gym / Kraft',
  ruhe: 'Ruhetag'
};
import { renderStatic, animateFigure } from './figure.js';

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICON = {
  play: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>',
  playBig: '<svg width="26" height="26" viewBox="0 0 24 24" fill="#FAF6EF"><path d="M8 5v14l12-7z"></path></svg>',
  pauseBig: '<svg width="26" height="26" viewBox="0 0 24 24" fill="#FAF6EF"><rect x="7.4" y="6.2" width="3.2" height="11.6" rx="1.6"></rect><rect x="13.4" y="6.2" width="3.2" height="11.6" rx="1.6"></rect></svg>',
  prev: '<svg width="21" height="21" viewBox="0 0 24 24"><path d="M17.5 5.5L10 12l7.5 6.5z" fill="#2B2620"></path><path d="M6.5 5.5v13" stroke="#2B2620" stroke-width="2.2" stroke-linecap="round"></path></svg>',
  next: '<svg width="21" height="21" viewBox="0 0 24 24"><path d="M6.5 5.5L14 12l-7.5 6.5z" fill="#2B2620"></path><path d="M17.5 5.5v13" stroke="#2B2620" stroke-width="2.2" stroke-linecap="round"></path></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2620" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5L8 12l6.5 6.5"></path></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2620" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
  info: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2B2620" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5.5M12 7.6v.3"></path></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path></svg>',
  check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6E6455" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L19.5 7"></path></svg>',
  checkBig: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L19.5 7"></path></svg>',
  moon: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5C5346" stroke-width="1.8" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"></path></svg>',
  loop: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5C5346" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5"></path><path d="M20 4v4.5h-4.5"></path><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5"></path><path d="M4 20v-4.5h4.5"></path></svg>',
  chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A79C8B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 5.5L16 12l-6.5 6.5"></path></svg>',
  dumbbell: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5C5346" stroke-width="1.8" stroke-linecap="round"><path d="M6.5 8.5v7M3.5 10v4M17.5 8.5v7M20.5 10v4M6.5 12h11"></path></svg>',
  pulse: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5C5346" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2.5-6 4 12 2.5-6H21"></path></svg>',
  video: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="14" height="14" rx="3"></rect><path d="M16.5 10.5L21.5 7.5v9l-5-3"></path><path d="M8 9.8v4.4l3.8-2.2z" fill="currentColor" stroke="none"></path></svg>'
};

// ---------- Audio & Haptik ----------
let audioCtx = null;
function chime(freqs = [880]) {
  if (!getSettings().sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state !== 'running') audioCtx.resume();
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const t0 = audioCtx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.25);
    });
  } catch { /* Ton ist optional */ }
  if (navigator.vibrate) navigator.vibrate(40);
}

// ---------- Tabs ----------
const views = ['heute', 'uebungen', 'kalender', 'profil'];
function showView(name) {
  views.forEach((v) => {
    $(`#view-${v}`).classList.toggle('hidden', v !== name);
  });
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.view === name));
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tab').forEach((t) => {
  t.addEventListener('click', () => showView(t.dataset.view));
});

// ---------- Sheet ----------
let sheetCleanup = null;
let sheetLastFocus = null;
function sheetKeydown(e) {
  if (e.key === 'Escape') closeSheet();
}
function openSheet(html, wire) {
  const bd = $('#sheet-backdrop');
  const sheet = $('#sheet');
  sheetLastFocus = document.activeElement;
  sheet.innerHTML = `<div class="grip"></div><button class="icon-btn sheet-close" id="sheet-close" aria-label="Schließen">${ICON.close}</button>${html}`;
  sheet.setAttribute('tabindex', '-1');
  sheet.setAttribute('aria-modal', 'true');
  bd.classList.remove('hidden');
  sheet.focus();
  if (wire) sheetCleanup = wire(sheet) || null;
  $('#sheet-close').onclick = closeSheet;
  bd.onclick = (e) => { if (e.target === bd) closeSheet(); };
  document.addEventListener('keydown', sheetKeydown);
}
function closeSheet() {
  if (sheetCleanup) { sheetCleanup(); sheetCleanup = null; }
  document.removeEventListener('keydown', sheetKeydown);
  $('#sheet-backdrop').classList.add('hidden');
  if (sheetLastFocus && sheetLastFocus.focus) sheetLastFocus.focus();
}

// ---------- Heute ----------
function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Hallo';
  return 'Guten Abend';
}

function weekStrip() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const tKey = todayKey();
  let html = '<div class="week">';
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = todayKey(d);
    const done = isDone(key);
    const today = key === tKey;
    const cls = `day${done ? ' done' : ''}${today ? ' today' : ''}`;
    let inner = '';
    if (today && done) inner = ICON.check.replace('#6E6455', '#FAF6EF');
    else if (today) inner = '<i></i>';
    else if (done) inner = ICON.check;
    html += `<div class="${cls}"><span>${labels[i]}</span><div class="dot">${inner}</div></div>`;
  }
  return html + '</div>';
}

const KIND_META = {
  morgen: { badge: 'MORGENROUTINE', badgeCls: '', btnCls: '', title: 'Beweglich in den Tag', options: [5, 10, 15], setting: 'minutes' },
  abend: { badge: 'ABENDROUTINE', badgeCls: ' badge-abend', btnCls: ' btn-abend', title: 'Lang &amp; locker in den Abend', options: [10, 15, 20], setting: 'eveMinutes' },
  kraft: { badge: 'ENDGRAD-KRAFT', badgeCls: ' badge-kraft', btnCls: ' btn-kraft', title: 'Beweglichkeit unter Last', options: [15, 20, 25], setting: 'kraftMinutes' }
};
const KIND_TITLE = { morgen: 'Morgenroutine', abend: 'Abendroutine', kraft: 'Endgrad-Kraft', zwischendurch: 'Zwischendurch' };
const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const minsFor = (cfg, kind) => (kind === 'abend' ? cfg.eveMinutes : kind === 'kraft' ? cfg.kraftMinutes : cfg.minutes);

function routineCard(kind) {
  const s = getSettings();
  const meta = KIND_META[kind];
  const abend = kind === 'abend';
  const mins = minsFor(s, kind);
  const options = meta.options;
  const routine = buildRoutine(todayKey(), mins, kind);
  const names = routine.items.map((it) => it.ex.name);
  const chips = names.slice(0, 3).map((n) => `<span class="chip">${esc(n)}</span>`).join('') +
    (names.length > 3 ? `<span class="chip">+${names.length - 3}</span>` : '');
  const total = Math.max(1, Math.round(routine.totalSec / 60));
  const done = isDone(todayKey(), kind);
  const focusBadge = routine.focusDay
    ? `<span class="badge badge-focus">FOKUSTAG · ${esc(routine.focusDay.label.toUpperCase())}</span>`
    : '';
  return `
    <div class="card today-card">
      <div class="row-between">
        <span style="display:flex;gap:6px;flex-wrap:wrap;">
          <span class="badge${meta.badgeCls}">${meta.badge}</span>${focusBadge}
        </span>
        <span class="meta" style="display:flex;align-items:center;gap:5px;">${ICON.clock} ${total} Min</span>
      </div>
      <div class="today-title">${meta.title}</div>
      <div class="meta">${routine.items.length} Übungen · Fokus: ${esc(routine.focus)}</div>
      <div class="chips">${chips}</div>
      <div class="seg" data-kind="${kind}">
        ${options.map((m) => `<button data-m="${m}" class="${m === mins ? 'active' : ''}">${m} Min</button>`).join('')}
      </div>
      <button class="btn-primary${meta.btnCls}" data-start="${kind}">${ICON.play} ${done ? 'Nochmal starten' : 'Routine starten'}</button>
      ${done ? '<div class="meta" style="text-align:center;">Heute schon erledigt — stark!</div>' : ''}
    </div>`;
}

function zdCountToday() {
  return getHistory()[todayKey()]?.zwischendurch?.count || 0;
}

function sportRow(s, now) {
  const plan = s.weekPlan?.[now.getDay()] || '';
  if (!plan) return '';
  const done = Boolean(getHistory()[todayKey()]?.sport);
  if (plan === 'ruhe') {
    return `
    <div class="mini-row">
      <div class="icon-tile">${ICON.moon}</div>
      <div class="grow"><span class="t">Heute laut Plan: Ruhetag</span><span class="s">Mobility reicht völlig — gut so.</span></div>
    </div>`;
  }
  return `
    <div class="mini-row sport-row${done ? ' sport-done' : ''}">
      <div class="icon-tile">${ICON.pulse}</div>
      <div class="grow"><span class="t">Heute laut Plan: ${esc(SPORT_TYPES[plan] || plan)}</span><span class="s">${done ? 'Erledigt — stark!' : 'Dein Sport-Slot für heute'}</span></div>
      <button class="sport-check${done ? ' on' : ''}" id="btn-sport-done" aria-label="Sport als erledigt markieren">${ICON.check.replace('#6E6455', done ? '#FAF6EF' : '#8A8072')}</button>
    </div>`;
}

function nextKraftDay(s, now) {
  const days = (s.kraftDays || []).filter((d) => d >= 0);
  if (!days.length) return null;
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    if (days.includes(d)) return WD[d];
  }
  return null;
}

function renderHeute() {
  const s = getSettings();
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const kraftToday = (s.kraftDays || []).includes(now.getDay());
  const order = now.getHours() >= 16 ? ['abend', 'morgen'] : ['morgen', 'abend'];
  if (kraftToday) order.splice(1, 0, 'kraft');
  const nextKraft = kraftToday ? null : nextKraftDay(s, now);
  $('#view-heute').innerHTML = `
    <div class="row-between">
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span class="eyebrow">${esc(dateStr)}</span>
        <span class="h1">${greeting()}, ${esc(s.name)}.</span>
      </div>
      <button class="icon-btn" id="btn-info" aria-label="Info">${ICON.info}</button>
    </div>
    ${weekStrip()}
    ${order.map(routineCard).join('')}
    ${sportRow(s, now)}
    <button class="mini-row" id="btn-zd">
      <div class="icon-tile">${ICON.loop}</div>
      <div class="grow"><span class="t">Zwischendurch</span><span class="s">3 Übungen · ca. 3 Min gegen das Sitzen</span></div>
      ${zdCountToday() ? `<span class="soon" style="border-color:#8FA98F;color:#5C7A54;">${zdCountToday()}× HEUTE</span>` : ICON.chev}
    </button>
    ${kraftToday ? '' : `
    <div class="mini-row">
      <div class="icon-tile">${ICON.dumbbell}</div>
      <div class="grow"><span class="t">Endgrad-Kraft</span><span class="s">${nextKraft ? `Nächster Termin: ${nextKraft}` : 'In den Einstellungen Tage wählen'}</span></div>
    </div>`}
  `;
  $('#btn-zd').addEventListener('click', () => startPlayer(buildRoutine(todayKey(), 3, 'zwischendurch')));
  const sportBtn = $('#btn-sport-done');
  if (sportBtn) {
    sportBtn.addEventListener('click', () => {
      toggleSportDone(todayKey(), getSettings().weekPlan?.[new Date().getDay()]);
      renderHeute();
      renderKalender();
    });
  }
  document.querySelectorAll('#view-heute .seg[data-kind]').forEach((seg) => {
    seg.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-m]');
      if (!btn) return;
      setSetting(KIND_META[seg.dataset.kind].setting, Number(btn.dataset.m));
      renderHeute();
    });
  });
  document.querySelectorAll('#view-heute [data-start]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.start;
      startPlayer(buildRoutine(todayKey(), minsFor(getSettings(), kind), kind));
    });
  });
  $('#btn-info').addEventListener('click', openInfo);
}

function openInfo() {
  openSheet(`
    <h2>Warum diese Routine?</h2>
    <p class="info-p">Morgens ist dein Körper kalt und die Wirbelsäule druckempfindlich — deshalb wird hier <b>dynamisch mobilisiert statt lang statisch gedehnt</b>. Ziel: Gelenke ölen, Kreislauf anschalten, aufrecht in den Tag.</p>
    <span class="sec-l">DIE 5 BLÖCKE</span>
    <ol>
      <li><b>Wirbelsäule</b> — sanft aufwachen, Rücken durchbewegen</li>
      <li><b>Hüfte & Beinrückseite</b> — deine Hauptbaustelle als Vielsitzer</li>
      <li><b>Füße & Sprunggelenke</b> — dein Limiter beim Laufen</li>
      <li><b>Schultern & BWS</b> — das Gegenprogramm zum Schreibtisch</li>
      <li><b>Aktivierung</b> — Gesäß und Rumpf anschalten</li>
    </ol>
    <p class="info-p">Abends dreht sich das Prinzip um: In der <b>Abendroutine</b> wird lang und statisch gedehnt (45–90 Sekunden pro Position) — der Körper ist warm und genau dann entsteht echter Beweglichkeitsgewinn.</p>
    <span class="sec-l">DEIN TÄGLICHER KERN</span>
    <p class="info-p">Beweglichkeit wächst mit der <b>Wochendosis pro Zielgewebe</b>, nicht durch Abwechslung. Deshalb sind drei Übungen jeden Tag fest gesetzt: <b>Ankle Rocks</b> (morgens, dein Sprunggelenk-Limiter), <b>liegende Beinrückseiten-Dehnung</b> und <b>Couch Stretch</b> (abends, Zehen-Ziel + Hüftstreckung). Alle anderen Übungen rotieren der Reihe nach durch den Pool (${EXERCISES.length} Übungen), bis jede dran war — nichts wird doppelt gezogen, nichts fällt durch.</p>
    <span class="sec-l">KRAFT, FOKUS &amp; MESSUNG</span>
    <p class="info-p">An deinen <b>Kraft-Tagen</b> kommt die Endgrad-Routine dazu: Beweglichkeit unter Last (z. B. ATG Split Squat) baut Range auf, die bleibt. An <b>Fokustagen</b> bekommen deine Schwerpunkte abends fast doppelte Haltezeit. Der monatliche <b>Beweglichkeits-Check</b> im Profil macht den Fortschritt messbar — vom Zehen-Abstand bis zur Hocke.</p>
    <span class="sec-l">SICHERHEIT</span>
    <p class="info-p">Dehnzug maximal 6–7 von 10, nie in scharfen Schmerz. Kribbeln, Taubheit oder ausstrahlender Schmerz: sofort abbrechen. Übungen, die dir nicht gut tun, kannst du in den Details dauerhaft ausblenden.</p>
  `);
}

// ---------- Player ----------
let session = null;

function requestWakeLock() {
  if (!session || !navigator.wakeLock) return;
  navigator.wakeLock.request('screen').then((wl) => { if (session) session.wakeLock = wl; }).catch(() => {});
}
// Nach App-Wechsel/Sperre gibt das System den WakeLock frei — neu anfordern.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') requestWakeLock();
});

function startPlayer(routine) {
  stopSession();
  session = {
    routine,
    idx: 0,
    phase: 'prep',
    remain: PREP_SECS,
    deadline: 0,
    paused: false,
    sideSwitched: false,
    stopAnim: null,
    timer: null,
    wakeLock: null
  };
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

function currentItem() {
  return session.routine.items[session.idx];
}

function renderExercise() {
  const { routine, idx } = session;
  const item = currentItem();
  const ex = item.ex;
  const next = routine.items[idx + 1];
  const segs = routine.items.map((_, i) => `<i class="${i <= idx ? 'on' : ''}"></i>`).join('');
  const R = 54, CIRC = (2 * Math.PI * R).toFixed(1);
  $('#player').innerHTML = `
    <div class="p-top">
      <button class="icon-btn" id="p-close" aria-label="Beenden">${ICON.close}</button>
      <div class="mid">
        <span class="t">${KIND_TITLE[routine.kind] || 'Routine'}</span>
        <span class="s">Übung ${idx + 1} von ${routine.items.length}</span>
      </div>
      <button class="icon-btn" id="p-infobtn" aria-label="Übungsinfo">${ICON.info}</button>
    </div>
    <div class="p-segments">${segs}</div>
    <div class="p-stage">
      <svg id="p-fig"></svg>
      ${ex.perSide ? '<span class="p-side" id="p-side">Linke Seite</span>' : ''}
      ${routine.kind === 'abend' && ex.pnf && getSettings().pnf ? '<span class="p-side p-phase" id="p-phase">Sinken &amp; atmen</span>' : ''}
    </div>
    <div>
      <div class="p-name">${esc(ex.name)}</div>
      <div class="p-how" style="margin-top:6px;">${esc(ex.how[0])}. ${esc(ex.how[1])}.</div>
      <div class="p-safety">Dehnzug max. 6–7 von 10 · nie in scharfen Schmerz · Kribbeln oder Taubheit = abbrechen</div>
    </div>
    <div class="p-ring-wrap">
      <div class="p-ring">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="${R}" stroke="#EAE2D4" stroke-width="8" fill="none"></circle>
          <circle id="p-arc" cx="64" cy="64" r="${R}" stroke="#E1793C" stroke-width="8" fill="none"
            stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}" transform="rotate(-90 64 64)"></circle>
        </svg>
        <div class="val"><span class="n" id="p-time">–</span><span class="l" id="p-sub">Sek.</span></div>
      </div>
    </div>
    <div class="p-controls">
      <button class="p-skip" id="p-prev" aria-label="Zurück">${ICON.prev}</button>
      <button class="p-play" id="p-toggle" aria-label="Pause">${ICON.pauseBig}</button>
      <button class="p-skip" id="p-next" aria-label="Weiter">${ICON.next}</button>
    </div>
    <div class="p-next">
      <span class="l">ALS NÄCHSTES</span>
      <span class="t">${next ? esc(next.ex.name) : 'Geschafft — letzte Übung'}</span>
      ${ICON.chev}
    </div>
  `;
  if (session.stopAnim) session.stopAnim();
  session.stopAnim = animateFigure($('#p-fig'), ex);
  session.phase = 'prep';
  session.remain = PREP_SECS;
  session.deadline = Date.now() + PREP_SECS * 1000;
  session.sideSwitched = false;
  session.paused = false;
  session.pnfOn = routine.kind === 'abend' && Boolean(ex.pnf) && getSettings().pnf;
  session.lastPhase = 'relax';
  $('#p-close').onclick = () => { stopSession(); renderHeute(); };
  $('#p-infobtn').onclick = () => openExercise(ex, true);
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
    btn.innerHTML = ICON.pauseBig;
    btn.setAttribute('aria-label', 'Pause');
  } else {
    session.remain = Math.max(0, (session.deadline - Date.now()) / 1000);
    session.paused = true;
    btn.innerHTML = ICON.playBig;
    btn.setAttribute('aria-label', 'Fortsetzen');
  }
}

function advance() {
  if (session.idx + 1 < session.routine.items.length) {
    session.idx++;
    renderExercise();
    chime([660]);
  } else {
    finishRoutine();
  }
}

function tick() {
  if (!session || session.paused) return;
  const remain = (session.deadline - Date.now()) / 1000;
  if (remain <= 0) {
    if (session.phase === 'prep') {
      const item = currentItem();
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
  const item = currentItem();
  if (session.phase === 'run' && item.ex.perSide && !session.sideSwitched && remain <= item.secs / 2) {
    session.sideSwitched = true;
    const chip = $('#p-side');
    if (chip) chip.textContent = 'Rechte Seite';
    chime([880, 880]);
  }
  // Contract-Relax-Führung: 20 s lösen/sinken, dann 10 s sanft anspannen — im Wechsel.
  if (session.phase === 'run' && session.pnfOn) {
    const half = item.ex.perSide ? item.secs / 2 : item.secs;
    const inSeg = (item.secs - remain) % half;
    const phase = inSeg % 30 < 20 ? 'relax' : 'contract';
    if (phase !== session.lastPhase) {
      session.lastPhase = phase;
      const chipEl = $('#p-phase');
      if (chipEl) chipEl.textContent = phase === 'contract' ? 'Sanft anspannen' : 'Lösen & tiefer sinken';
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
  const arc = $('#p-arc');
  const timeEl = $('#p-time');
  const subEl = $('#p-sub');
  if (!arc || !timeEl) return;
  const CIRC = 2 * Math.PI * 54;
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
  const abend = routine.kind === 'abend';
  const kraft = routine.kind === 'kraft';
  const zd = routine.kind === 'zwischendurch';
  const headline = zd ? 'Kurz bewegt.' : kraft ? 'Stark.' : abend ? 'Guter Abschluss.' : 'Geschafft!';
  const extra = zd ? `<br>${zdCountToday()}× heute — das summiert sich.` : kraft ? '<br>Endgrad-Arbeit zahlt doppelt ein.' : abend ? '<br>Schlaf gut.' : '';
  const streakLine = zd ? '' : `<br>Serie: <b>${st} ${st === 1 ? 'Tag' : 'Tage'}</b> in Folge`;
  $('#player').innerHTML = `
    <div class="done-wrap">
      <div class="done-circle">${ICON.checkBig}</div>
      <div>
        <div class="done-h">${headline}</div>
        <div class="done-s" style="margin-top:8px;">${routine.items.length} Übungen · ca. ${Math.max(1, Math.round(routine.totalSec / 60))} Minuten${streakLine}${extra}</div>
      </div>
      <button class="btn-primary" id="p-done" style="max-width:260px;">Fertig</button>
    </div>
  `;
  $('#p-done').onclick = () => {
    stopSession();
    renderHeute();
    renderKalender();
  };
}

// ---------- Übungen ----------
function renderUebungen() {
  const root = $('#view-uebungen');
  root.innerHTML = `<span class="h1">Übungen</span><span class="meta" style="margin-top:-8px;">${EXERCISES.length} Übungen · tippe für Details</span>`;
  const sections = [
    ['MORGENROUTINE · DYNAMISCH', BLOCKS],
    ['ABENDROUTINE · STATISCH', ABLOCKS],
    ['ENDGRAD-KRAFT · AN KRAFTTAGEN', KBLOCKS],
    ['ZWISCHENDURCH · AM SCHREIBTISCH', ZBLOCKS]
  ];
  for (const [label, blocks] of sections) {
    const head = document.createElement('div');
    head.className = 'eyebrow';
    head.style.marginTop = '10px';
    head.textContent = label;
    root.appendChild(head);
    for (const block of blocks) {
      const wrap = document.createElement('div');
      wrap.innerHTML = `<div class="block-title">${esc(block.name)}</div>`;
      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-top:8px;';
      const blacklist = getBlacklist();
      for (const ex of byBlock(block.id)) {
        const hidden = blacklist.includes(ex.id);
        const row = document.createElement('button');
        row.className = `ex-row${hidden ? ' ex-hidden' : ''}`;
        row.innerHTML = `
          <svg></svg>
          <div class="grow">
            <span class="t">${esc(ex.name)}</span>
            <span class="s">${esc(ex.dose)}</span>
          </div>
          ${hidden ? '<span class="equip-tag">Ausgeblendet</span>' : ex.core ? '<span class="equip-tag tag-core">Täglich</span>' : ex.equip ? `<span class="equip-tag">${esc(ex.equip)}</span>` : ''}
        `;
        renderStatic(row.querySelector('svg'), ex);
        row.addEventListener('click', () => openExercise(ex, false));
        list.appendChild(row);
      }
      wrap.appendChild(list);
      root.appendChild(wrap);
    }
  }
}

function openExercise(ex, inPlayer) {
  if (inPlayer && session && !session.paused) togglePause();
  const hidden = getBlacklist().includes(ex.id);
  openSheet(`
    <div class="stage"><svg id="sheet-fig"></svg></div>
    <h2>${esc(ex.name)}</h2>
    <div class="chips">
      ${ex.core ? '<span class="chip chip-core">Täglicher Kern</span>' : ''}
      <span class="chip">${esc(ex.dose)}</span>
      ${ex.perSide ? '<span class="chip">je Seite</span>' : ''}
      ${ex.equip ? `<span class="chip">${esc(ex.equip)}</span>` : ''}
      ${ex.areas.map((a) => `<span class="chip">${esc(a)}</span>`).join('')}
    </div>
    <span class="sec-l">DAS BRINGT&rsquo;S</span>
    <div class="benefit">${esc(ex.benefit)}</div>
    <span class="sec-l">SO GEHT&rsquo;S</span>
    <ol>${ex.how.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>
    ${MISTAKES[ex.id] ? `
    <span class="sec-l">HÄUFIGE FEHLER</span>
    <ul class="safety-list">${MISTAKES[ex.id].map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
    <a class="video-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' Übung richtige Ausführung')}" target="_blank" rel="noopener">${ICON.video} Video-Anleitung auf YouTube suchen</a>
    <span class="sec-l">SICHERHEIT</span>
    <ul class="safety-list">
      <li>Dehnzug maximal 6–7 von 10 — nie in scharfen Schmerz</li>
      <li>Kribbeln, Taubheit oder ausstrahlender Schmerz: sofort abbrechen</li>
      <li>Gelenkschmerz statt Muskeldehngefühl: abbrechen</li>
      <li>Bei bestehenden Beschwerden vorher ärztlich abklären</li>
    </ul>
    ${inPlayer ? '' : `<button class="btn-hide" id="btn-blacklist">${hidden ? 'Übung wieder einblenden' : 'Diese Übung tut mir nicht gut — ausblenden'}</button>`}
  `, (sheet) => {
    const stop = animateFigure(sheet.querySelector('#sheet-fig'), ex);
    const bl = sheet.querySelector('#btn-blacklist');
    if (bl) {
      bl.onclick = () => {
        toggleBlacklist(ex.id);
        closeSheet();
        renderUebungen();
        renderHeute();
      };
    }
    return stop;
  });
}

// ---------- Kalender ----------
let calOffset = 0;
function renderKalender() {
  const root = $('#view-kalender');
  const now = new Date();
  const view = new Date(now.getFullYear(), now.getMonth() + calOffset, 1);
  const monthName = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(view);
  const firstWd = (view.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const hist = getHistory();
  const tKey = todayKey();
  const monthPrefix = `${view.getFullYear()}-${String(view.getMonth() + 1).padStart(2, '0')}`;
  const monthCount = sessionsInMonth(monthPrefix);
  let cells = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((w) => `<div class="wd">${w}</div>`).join('');
  for (let i = 0; i < firstWd; i++) cells += '<div class="cal-cell other">·</div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${monthPrefix}-${String(d).padStart(2, '0')}`;
    const day = hist[key];
    const routineDone = Boolean(day && (day.morgen || day.abend || day.kraft));
    const cls = `cal-cell${routineDone ? ' done' : ''}${key === tKey ? ' today' : ''}`;
    cells += `<div class="${cls}"><span>${d}</span>${day?.sport ? '<i class="sport-dot"></i>' : ''}</div>`;
  }
  const st = streak(tKey);
  root.innerHTML = `
    <span class="h1">Kalender</span>
    <div class="stats">
      <div class="stat"><span class="v">${st}</span><span class="l">Tage Serie</span></div>
      <div class="stat"><span class="v">${monthCount}</span><span class="l">diesen Monat</span></div>
      <div class="stat"><span class="v">${totalSessions()}</span><span class="l">gesamt</span></div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:12px;">
      <div class="cal-head">
        <button class="icon-btn" id="cal-prev" aria-label="Voriger Monat" style="transform:scale(0.85);">${ICON.back}</button>
        <span class="m">${esc(monthName)}</span>
        <button class="icon-btn" id="cal-next" aria-label="Nächster Monat" style="transform:scale(0.85) scaleX(-1);">${ICON.back}</button>
      </div>
      <div class="cal-grid">${cells}</div>
      <div class="meta">Gefüllt = Routine erledigt · <i class="sport-dot" style="display:inline-block;vertical-align:middle;"></i> = Sport laut Plan gemacht</div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:12px;">
      <span style="font-size:14px;font-weight:600;">Dein Wochenplan</span>
      ${[1, 2, 3, 4, 5, 6, 0].map((d) => {
        const s2 = getSettings();
        const isKraft = (s2.kraftDays || []).includes(d);
        const focus = [s2.focus1, s2.focus2].find((f) => f && f.day === d && FOCUS_TARGETS[f.target]);
        return `
        <div class="plan-row">
          <span class="pd">${WD[d]}</span>
          <select class="sel" data-plan-day="${d}">
            ${Object.entries(SPORT_TYPES).map(([k, l]) => `<option value="${k}" ${(s2.weekPlan?.[d] || '') === k ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
          <span class="plan-tags">
            ${isKraft ? '<span class="equip-tag tag-core">Kraft</span>' : ''}
            ${focus ? `<span class="equip-tag">Fokus</span>` : ''}
          </span>
        </div>`;
      }).join('')}
      <span class="meta">Kraft- und Fokustage stellst du im Profil ein — sie erscheinen hier automatisch.</span>
    </div>
  `;
  $('#cal-prev').onclick = () => { calOffset--; renderKalender(); };
  $('#cal-next').onclick = () => { calOffset++; renderKalender(); };
  document.querySelectorAll('[data-plan-day]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const plan = { ...(getSettings().weekPlan || {}) };
      plan[Number(sel.dataset.planDay)] = sel.value;
      setSetting('weekPlan', plan);
      renderHeute();
    });
  });
}

// ---------- Beweglichkeits-Check ----------
const ASSESS = [
  { key: 'kneeL', label: 'Knie-zur-Wand links', unit: 'cm', better: 'up', hint: 'Fuß vor der Wand, Ferse unten, Knie berührt die Wand — größter Zeh-Wand-Abstand' },
  { key: 'kneeR', label: 'Knie-zur-Wand rechts', unit: 'cm', better: 'up', hint: 'wie links' },
  { key: 'finger', label: 'Finger-Boden-Abstand', unit: 'cm', better: 'down', hint: 'Stehend vorbeugen, Knie gestreckt; negativ = unter Bodenniveau' },
  { key: 'shoulder', label: 'Schulterflexion (Handrücken-Boden)', unit: 'cm', better: 'down', hint: 'Rückenlage, unterer Rücken am Boden, Arme über Kopf strecken' },
  { key: 'squat', label: 'Tiefe Hocke gehalten', unit: 'Sek.', better: 'up', hint: 'Fersen am Boden, so lange es gut geht' }
];

function spark(values) {
  if (values.length < 2) return '<span class="meta" style="width:92px;text-align:center;">—</span>';
  const w = 92, h = 26;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * (w - 8) + 4).toFixed(1)},${(h - 5 - ((v - min) / span) * (h - 10)).toFixed(1)}`);
  const last = pts[pts.length - 1].split(',');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts.join(' ')}" fill="none" stroke="#E1793C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline><circle cx="${last[0]}" cy="${last[1]}" r="2.6" fill="#E1793C"></circle></svg>`;
}

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
      delta = `<span class="${improved ? 'delta-up' : 'delta-down'}">${diff > 0 ? '+' : ''}${diff}</span>`;
    }
    return `
      <div class="assess-row">
        <div class="nm"><span class="t">${m.label}</span></div>
        ${spark(series)}
        <span class="val">${latest === null ? '—' : `${latest} ${m.unit}`} ${delta}</span>
      </div>`;
  }).join('');
}

function assessmentDue() {
  const dates = Object.keys(getAssessments()).sort();
  if (!dates.length) return true;
  const last = dates[dates.length - 1];
  const [y, m, d] = last.split('-').map(Number);
  return (Date.now() - new Date(y, m - 1, d).getTime()) / 86400000 >= 28;
}

function openAssessment() {
  const inputs = ASSESS.map((m) => `
    <div class="field">
      <label for="as-${m.key}">${m.label} (${m.unit})</label>
      <input type="number" step="0.5" inputmode="decimal" id="as-${m.key}" class="as-in" autocomplete="off">
      <span class="meta" style="font-size:12px;">${m.hint}</span>
    </div>`).join('');
  openSheet(`
    <h2>Beweglichkeits-Check</h2>
    <p class="info-p">Einmal im Monat messen — barfuß, ohne Aufwärmen, immer gleich. Nicht jeder Wert muss ausgefüllt sein.</p>
    ${inputs}
    <button class="btn-primary" id="as-save">Speichern</button>
  `, (sheet) => {
    sheet.querySelector('#as-save').onclick = () => {
      const values = {};
      for (const m of ASSESS) {
        const v = parseFloat(sheet.querySelector(`#as-${m.key}`).value.replace(',', '.'));
        if (!Number.isNaN(v)) values[m.key] = v;
      }
      if (!Object.keys(values).length) return;
      saveAssessment(todayKey(), values);
      closeSheet();
      renderProfil();
    };
  });
}

// ---------- Profil ----------
const DAY_OPTIONS = [[-1, 'Aus'], [1, 'Mo'], [2, 'Di'], [3, 'Mi'], [4, 'Do'], [5, 'Fr'], [6, 'Sa'], [0, 'So']];
function daySelect(id, value) {
  return `<select class="sel" id="${id}">${DAY_OPTIONS.map(([v, l]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
}
function targetSelect(id, value) {
  return `<select class="sel" id="${id}">${Object.entries(FOCUS_TARGETS).map(([k, t]) => `<option value="${k}" ${k === value ? 'selected' : ''}>${t.label}</option>`).join('')}</select>`;
}

function renderProfil() {
  const s = getSettings();
  const root = $('#view-profil');
  root.innerHTML = `
    <span class="h1">Profil</span>
    <div class="card" style="display:flex;flex-direction:column;gap:16px;">
      <div class="field">
        <label for="f-name">Dein Name</label>
        <input type="text" id="f-name" value="${esc(s.name)}" maxlength="20" autocomplete="off">
      </div>
      <div class="field">
        <label>Standarddauer morgens</label>
        <div class="seg" id="f-mins">
          ${[5, 10, 15].map((m) => `<button data-m="${m}" class="${m === s.minutes ? 'active' : ''}">${m} Min</button>`).join('')}
        </div>
      </div>
      <div class="field">
        <label>Standarddauer abends</label>
        <div class="seg" id="f-eve">
          ${[10, 15, 20].map((m) => `<button data-m="${m}" class="${m === s.eveMinutes ? 'active' : ''}">${m} Min</button>`).join('')}
        </div>
      </div>
      <div class="toggle-row">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:14px;font-weight:600;">Ton & Vibration</span>
          <span class="meta">Signal bei Übungs- und Seitenwechsel</span>
        </div>
        <button class="switch ${s.sound ? 'on' : ''}" id="f-sound" role="switch" aria-checked="${s.sound}" aria-label="Ton und Vibration"></button>
      </div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:14px;">
      <div class="row-between">
        <span style="font-size:14px;font-weight:600;">Beweglichkeits-Check</span>
        ${assessmentDue() ? '<span class="badge">FÄLLIG</span>' : '<span class="meta">monatlich</span>'}
      </div>
      ${assessmentRows()}
      <button class="btn-primary" id="btn-assess" style="height:48px;">Check starten</button>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:16px;">
      <span style="font-size:14px;font-weight:600;">Trainingssteuerung</span>
      <div class="field">
        <label>Fokustag 1 — doppelte Haltezeit abends</label>
        <div class="dual">${daySelect('f1-day', s.focus1?.day ?? -1)}${targetSelect('f1-target', s.focus1?.target || 'sprunggelenk')}</div>
      </div>
      <div class="field">
        <label>Fokustag 2</label>
        <div class="dual">${daySelect('f2-day', s.focus2?.day ?? -1)}${targetSelect('f2-target', s.focus2?.target || 'huefte')}</div>
      </div>
      <div class="field">
        <label>Kraft-Tage (Endgrad-Routine, 2×/Woche)</label>
        <div class="dual">${daySelect('k-day1', s.kraftDays?.[0] ?? -1)}${daySelect('k-day2', s.kraftDays?.[1] ?? -1)}</div>
      </div>
      <div class="toggle-row">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:14px;font-weight:600;">Contract-Relax (abends)</span>
          <span class="meta">Geführt: 20 s sinken, 10 s sanft anspannen — bei geeigneten Dehnungen</span>
        </div>
        <button class="switch ${s.pnf ? 'on' : ''}" id="f-pnf" role="switch" aria-checked="${s.pnf}" aria-label="Contract-Relax abends"></button>
      </div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:8px;">
      <span style="font-size:14px;font-weight:600;">Als App installieren</span>
      <span class="meta" style="line-height:1.5;">iPhone: In Safari <b>Teilen → Zum Home-Bildschirm</b>. Android: Menü → <b>App installieren</b>. Danach läuft mobi wie eine normale App — auch offline.</span>
    </div>
    <div class="meta" style="text-align:center;">mobi v5 · ${EXERCISES.length} Übungen · Morgen + Abend + Kraft + Zwischendurch</div>
  `;
  $('#f-name').addEventListener('change', (e) => {
    const v = e.target.value.trim() || 'Athlet:in';
    setSetting('name', v);
    renderHeute();
  });
  $('#f-mins').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-m]');
    if (!btn) return;
    setSetting('minutes', Number(btn.dataset.m));
    renderProfil();
    renderHeute();
  });
  $('#f-eve').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-m]');
    if (!btn) return;
    setSetting('eveMinutes', Number(btn.dataset.m));
    renderProfil();
    renderHeute();
  });
  $('#f-sound').addEventListener('click', (e) => {
    const on = !getSettings().sound;
    setSetting('sound', on);
    e.currentTarget.classList.toggle('on', on);
    e.currentTarget.setAttribute('aria-checked', String(on));
    if (on) chime([880]);
  });
  $('#btn-assess').addEventListener('click', openAssessment);
  $('#f-pnf').addEventListener('click', (e) => {
    const on = !getSettings().pnf;
    setSetting('pnf', on);
    e.currentTarget.classList.toggle('on', on);
    e.currentTarget.setAttribute('aria-checked', String(on));
  });
  const saveFocus = () => {
    setSetting('focus1', { day: Number($('#f1-day').value), target: $('#f1-target').value });
    setSetting('focus2', { day: Number($('#f2-day').value), target: $('#f2-target').value });
    renderHeute();
  };
  ['f1-day', 'f1-target', 'f2-day', 'f2-target'].forEach((id) => $(`#${id}`).addEventListener('change', saveFocus));
  const saveKraft = () => {
    const days = [Number($('#k-day1').value), Number($('#k-day2').value)].filter((d) => d >= 0);
    setSetting('kraftDays', [...new Set(days)]);
    renderHeute();
  };
  ['k-day1', 'k-day2'].forEach((id) => $(`#${id}`).addEventListener('change', saveKraft));
}

// ---------- Start ----------
renderHeute();
renderUebungen();
renderKalender();
renderProfil();

try {
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
} catch { /* Sandbox ohne Service-Worker-Zugriff */ }
