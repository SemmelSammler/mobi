// Lokale Persistenz: Einstellungen + Trainingshistorie.
// localStorage kann fehlen (Private Mode, Sandbox) — dann In-Memory-Fallback.
const S_KEY = 'mobi.settings';
const H_KEY = 'mobi.history';
const D_KEY = 'mobi.decks';
const B_KEY = 'mobi.blacklist';
const P_KEY = 'mobi.plan';
const W_KEY = 'mobi.workouts';
const ACT_KEY = 'mobi.active';

const DEFAULTS = {
  name: 'Jason',
  minutes: 10,
  eveMinutes: 15,
  kraftMinutes: 20,
  sound: true,
  pnf: false,
  kraftDays: [2, 5], // Di + Fr
  focus1: { day: 1, target: 'sprunggelenk' }, // Mo
  focus2: { day: 4, target: 'huefte' }, // Do
  // Wochenstruktur: geplante Aktivität je Wochentag (0 = So).
  weekPlan: { 0: 'laufen', 1: 'gym', 2: 'laufen', 3: 'gym', 4: 'gym', 5: 'ruhe', 6: 'gym' },
  theme: 'auto', // auto | hell | dunkel
  restSound: true,
  autoRest: true
};
const mem = {};

function lsGet(key) {
  // mem gewinnt: wenn setItem fehlschlug (Private Mode/Quota), ist mem aktueller.
  try { return mem[key] ?? localStorage.getItem(key); } catch { return mem[key] ?? null; }
}
function lsSet(key, value) {
  mem[key] = value;
  try { localStorage.setItem(key, value); } catch { /* mem trägt den Wert */ }
}

function read(key, fallback) {
  try {
    const raw = lsGet(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getSettings() {
  return { ...DEFAULTS, ...read(S_KEY, {}) };
}

export function setSetting(key, value) {
  const s = getSettings();
  s[key] = value;
  lsSet(S_KEY, JSON.stringify(s));
  return s;
}

// Historie: { "2026-08-23": { morgen: {minutes, at}, abend: {minutes, at} } }
// Migration von v1: { "2026-08-23": {minutes, at} } → als "morgen" interpretiert.
export function getHistory() {
  const h = read(H_KEY, {});
  let migrated = false;
  for (const key of Object.keys(h)) {
    if (h[key] && typeof h[key].minutes === 'number') {
      h[key] = { morgen: h[key] };
      migrated = true;
    }
  }
  if (migrated) lsSet(H_KEY, JSON.stringify(h));
  return h;
}

export function markDone(dateKey, minutes, kind = 'morgen', exercises = []) {
  const h = getHistory();
  const day = h[dateKey] || {};
  if (kind === 'zwischendurch') {
    const prev = day.zwischendurch || { count: 0 };
    day.zwischendurch = { count: (prev.count || 0) + 1, at: Date.now() };
  } else {
    day[kind] = { minutes, at: Date.now(), exercises };
  }
  h[dateKey] = day;
  lsSet(H_KEY, JSON.stringify(h));
}

// Ausdauer-Einheit (Laufen/Rad/…) eintragen oder wieder entfernen. details: { km, min }
export function setSport(dateKey, type, details = null) {
  const h = getHistory();
  const day = h[dateKey] || {};
  if (!type) delete day.sport;
  else day.sport = { type, at: Date.now(), ...(details || {}) };
  if (Object.keys(day).length) h[dateKey] = day; else delete h[dateKey];
  lsSet(H_KEY, JSON.stringify(h));
  return Boolean(day.sport);
}

// Studio-Einheit im Kalender vermerken (die Details liegen in mobi.workouts).
export function markGym(dateKey, delta = 1) {
  const h = getHistory();
  const day = h[dateKey] || {};
  const count = Math.max(0, (day.gym?.count || 0) + delta);
  if (count) day.gym = { count, at: Date.now() }; else delete day.gym;
  if (Object.keys(day).length) h[dateKey] = day; else delete h[dateKey];
  lsSet(H_KEY, JSON.stringify(h));
}

// ---------- Deck-Rotation (Ziehen ohne Zurücklegen) ----------
function readList(key) {
  try {
    const raw = lsGet(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Liefert die nächsten n Übungs-IDs eines Blocks, OHNE sie zu verbrauchen.
// Das Deck wird bei Bedarf (neu, verändert, erschöpft) aufgefüllt und persistiert,
// damit die Tagesauswahl bei jedem Rendern stabil bleibt.
export function deckPeek(blockId, poolIds, n) {
  const decks = read(D_KEY, {});
  let deck = Array.isArray(decks[blockId]) ? decks[blockId].filter((id) => poolIds.includes(id)) : [];
  while (deck.length < n && poolIds.length) {
    const refill = shuffleArr(poolIds.filter((id) => !deck.includes(id)));
    if (!refill.length) break;
    deck = deck.concat(refill);
  }
  decks[blockId] = deck;
  lsSet(D_KEY, JSON.stringify(decks));
  return deck.slice(0, n);
}

// Nach abgeschlossener Routine: gezogene Karten aus den Decks entfernen.
export function consumeDeckIds(ids) {
  const decks = read(D_KEY, {});
  for (const blockId of Object.keys(decks)) {
    if (Array.isArray(decks[blockId])) {
      decks[blockId] = decks[blockId].filter((id) => !ids.includes(id));
    }
  }
  lsSet(D_KEY, JSON.stringify(decks));
}

// ---------- Beweglichkeits-Checks (Assessments) ----------
const A_KEY = 'mobi.assessments';

export function getAssessments() {
  return read(A_KEY, {});
}

export function saveAssessment(dateKey, values) {
  const a = getAssessments();
  a[dateKey] = { ...(a[dateKey] || {}), ...values };
  lsSet(A_KEY, JSON.stringify(a));
}

// ---------- Blacklist („Diese Übung ausblenden") ----------
export function getBlacklist() {
  return readList(B_KEY) || [];
}

export function toggleBlacklist(id) {
  const list = getBlacklist();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  lsSet(B_KEY, JSON.stringify(next));
  return next.includes(id);
}

export function isDone(dateKey, kind) {
  const day = getHistory()[dateKey];
  if (!day) return false;
  return kind ? Boolean(day[kind]) : Boolean(day.morgen || day.abend || day.kraft || day.gym);
}

function sessionsOfDay(day) {
  if (!day) return 0;
  return (day.morgen ? 1 : 0) + (day.abend ? 1 : 0) + (day.kraft ? 1 : 0) + (day.gym?.count || 0) + (day.sport ? 1 : 0) + (day.zwischendurch?.count || 0);
}

export function totalSessions() {
  const h = getHistory();
  return Object.values(h).reduce((sum, day) => sum + sessionsOfDay(day), 0);
}

export function sessionsInMonth(prefix) {
  const h = getHistory();
  return Object.keys(h)
    .filter((k) => k.startsWith(prefix))
    .reduce((sum, k) => sum + sessionsOfDay(h[k]), 0);
}

export function shiftDay(dateKey, delta) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d + delta);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

// Serie: zusammenhängende Tage mit mindestens einer Einheit (Routine, Studio oder Ausdauer)
// bis heute (heute zählt, sobald erledigt — sonst ab gestern rückwärts).
export function routineDone(day) {
  return Boolean(day && (day.morgen || day.abend || day.kraft || day.gym || day.sport));
}

export function streak(todayKeyStr) {
  const h = getHistory();
  let count = 0;
  let day = routineDone(h[todayKeyStr]) ? todayKeyStr : shiftDay(todayKeyStr, -1);
  while (routineDone(h[day])) {
    count++;
    day = shiftDay(day, -1);
  }
  return count;
}

// ---------- Trainingsplan, Trainingslog, laufende Einheit ----------
function readAny(key, fallback) {
  try {
    const raw = lsGet(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getPlan() {
  const p = readAny(P_KEY, null);
  return p && Array.isArray(p.days) ? p : null;
}
export function savePlan(plan) {
  if (plan) lsSet(P_KEY, JSON.stringify(plan));
  else lsSet(P_KEY, '');
}

export function getWorkouts() {
  const w = readAny(W_KEY, []);
  return Array.isArray(w) ? w : [];
}
export function saveWorkouts(list) {
  lsSet(W_KEY, JSON.stringify(list));
}

export function getActive() {
  const a = readAny(ACT_KEY, null);
  return a && Array.isArray(a.items) ? a : null;
}
export function setActive(session) {
  lsSet(ACT_KEY, session ? JSON.stringify(session) : '');
}

// ---------- Backup ----------
const ALL_KEYS = [S_KEY, H_KEY, D_KEY, B_KEY, A_KEY, P_KEY, W_KEY];

export function exportData() {
  const data = {};
  for (const k of ALL_KEYS) {
    const raw = lsGet(k);
    if (raw) { try { data[k] = JSON.parse(raw); } catch { /* defekten Eintrag auslassen */ } }
  }
  return { app: 'mobi', version: 6, exportedAt: new Date().toISOString(), data };
}

// Ersetzt alle Daten durch den Inhalt einer Backup-Datei. Gibt die Zahl der übernommenen Bereiche zurück.
export function importData(payload) {
  if (!payload || payload.app !== 'mobi' || typeof payload.data !== 'object') throw new Error('Keine gültige mobi-Sicherung.');
  let n = 0;
  for (const k of ALL_KEYS) {
    if (payload.data[k] !== undefined) { lsSet(k, JSON.stringify(payload.data[k])); n++; }
  }
  return n;
}

export function resetAll() {
  for (const k of [...ALL_KEYS, ACT_KEY]) {
    mem[k] = '';
    try { localStorage.removeItem(k); } catch { /* nichts zu löschen */ }
  }
}

// Gibt es schon gespeicherte Daten? (Erststart-Erkennung)
export function hasData() {
  return Boolean(lsGet(S_KEY) || lsGet(H_KEY));
}
