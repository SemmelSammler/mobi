// Gemeinsame Bausteine der Oberfläche: DOM-Helfer, Icons, Sheet, Toast, Ton, Ereignisse.
import { getSettings } from './store.js';
import { byId } from './data/index.js';
import { renderStatic } from './figure.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ic = (body, size = 22, sw = 1.9) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
export const ICON = {
  sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>'),
  dumbbell: ic('<path d="M6.5 7.5v9M3.5 9.5v5M17.5 7.5v9M20.5 9.5v5M6.5 12h11"/>'),
  grid: ic('<rect x="3.5" y="3.5" width="7.2" height="7.2" rx="2"/><rect x="13.3" y="3.5" width="7.2" height="7.2" rx="2"/><rect x="3.5" y="13.3" width="7.2" height="7.2" rx="2"/><rect x="13.3" y="13.3" width="7.2" height="7.2" rx="2"/>'),
  chart: ic('<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>'),
  user: ic('<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.6-3.3 3.4-5.2 7-5.2s6.4 1.9 7 5.2"/>'),
  play: ic('<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>', 16),
  playBig: ic('<path d="M8 5v14l12-7z" fill="currentColor" stroke="none"/>', 28),
  pauseBig: ic('<rect x="7.2" y="6" width="3.4" height="12" rx="1.7" fill="currentColor" stroke="none"/><rect x="13.4" y="6" width="3.4" height="12" rx="1.7" fill="currentColor" stroke="none"/>', 28),
  prev: ic('<path d="M17.5 5.5L10 12l7.5 6.5z" fill="currentColor" stroke="none"/><path d="M6.5 5.5v13"/>', 22, 2.2),
  next: ic('<path d="M6.5 5.5L14 12l-7.5 6.5z" fill="currentColor" stroke="none"/><path d="M17.5 5.5v13"/>', 22, 2.2),
  back: ic('<path d="M14.5 5.5L8 12l6.5 6.5"/>', 20, 2.1),
  fwd: ic('<path d="M9.5 5.5L16 12l-6.5 6.5"/>', 20, 2.1),
  chev: `<span class="chev">${ic('<path d="M9.5 5.5L16 12l-6.5 6.5"/>', 17, 2.2)}</span>`,
  down: ic('<path d="M5.5 9.5L12 16l6.5-6.5"/>', 20, 2.1),
  close: ic('<path d="M6 6l12 12M18 6L6 18"/>', 19, 2.2),
  info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.3"/>', 20),
  clock: ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', 15, 2),
  check: ic('<path d="M4.5 12.5l5 5L19.5 7"/>', 16, 3),
  checkBig: ic('<path d="M4.5 12.5l5 5L19.5 7"/>', 46, 2.8),
  moon: ic('<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>'),
  loop: ic('<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5"/><path d="M4 20v-4.5h4.5"/>'),
  pulse: ic('<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>', 18, 2.3),
  search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>', 18, 2.1),
  swap: ic('<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>', 16, 2),
  trash: ic('<path d="M5 7h14M10 7V4.5h4V7M7 7l1 12.5h8L17 7"/>', 17, 1.9),
  up: ic('<path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/>', 16, 2.2),
  trophy: ic('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5c0 3 1.5 4.5 3.7 4.8M16 6h3.5c0 3-1.5 4.5-3.7 4.8M12 13v4M8.5 20h7"/>', 18, 1.9),
  video: ic('<rect x="2.5" y="5" width="14" height="14" rx="3"/><path d="M16.5 10.5L21.5 7.5v9l-5-3"/>', 16),
  flask: ic('<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9"/>'),
  target: ic('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>')
};

// ---------- Ereignisse ----------
const listeners = {};
export function on(name, fn) { (listeners[name] ||= []).push(fn); }
export function emit(name, payload) { for (const fn of listeners[name] || []) fn(payload); }

// ---------- Ton & Haptik ----------
let audioCtx = null;
export function chime(freqs = [880], force = false) {
  if (!force && !getSettings().sound) return;
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

// ---------- Sheet ----------
let sheetCleanup = null;
let sheetLastFocus = null;
function sheetKeydown(e) { if (e.key === 'Escape') closeSheet(); }
export function openSheet(html, wire) {
  const bd = $('#sheet-backdrop'), sheet = $('#sheet');
  if (sheetCleanup) { sheetCleanup(); sheetCleanup = null; }
  if (bd.classList.contains('hidden')) sheetLastFocus = document.activeElement;
  sheet.innerHTML = `<div class="grip"></div><button class="icon-btn sheet-close" data-close aria-label="Schließen">${ICON.close}</button>${html}`;
  sheet.setAttribute('tabindex', '-1');
  sheet.setAttribute('aria-modal', 'true');
  bd.classList.remove('hidden');
  sheet.scrollTop = 0;
  sheet.focus({ preventScroll: true });
  hydrateThumbs(sheet);
  if (wire) sheetCleanup = wire(sheet) || null;
  $('[data-close]', sheet).onclick = closeSheet;
  bd.onclick = (e) => { if (e.target === bd) closeSheet(); };
  document.addEventListener('keydown', sheetKeydown);
}
export function closeSheet() {
  if (sheetCleanup) { sheetCleanup(); sheetCleanup = null; }
  document.removeEventListener('keydown', sheetKeydown);
  $('#sheet-backdrop').classList.add('hidden');
  if (sheetLastFocus && sheetLastFocus.focus) sheetLastFocus.focus({ preventScroll: true });
}

let toastTimer = null;
export function toast(text) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = text;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

// ---------- Übungs-Vorschaubilder ----------
export const thumb = (id) => `<span class="thumb"><svg data-fig="${esc(id)}"></svg></span>`;
export function hydrateThumbs(root) {
  for (const svg of $$('svg[data-fig]', root)) {
    const ex = byId(svg.dataset.fig);
    svg.removeAttribute('data-fig');
    if (ex) renderStatic(svg, ex, { ratio: 1, t: ex.kind === 'gym' ? 0.7 : 0 });
  }
}

// ---------- Formatierung ----------
export const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
export const ACTIVITIES = { gym: 'Studio', laufen: 'Laufen', rad: 'Rad', schwimmen: 'Schwimmen', ruhe: 'Ruhetag', '': '—' };
export const fmtDay = (key, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('de-DE', opts).format(new Date(y, m - 1, d));
};
export const fmtNum = (v) => new Intl.NumberFormat('de-DE').format(v);

export function sparkline(values, w = 92, h = 28) {
  if (values.length < 2) return `<span class="meta" style="width:${w}px;text-align:center;display:inline-block;">—</span>`;
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * (w - 8) + 4).toFixed(1)},${(h - 5 - ((v - min) / span) * (h - 10)).toFixed(1)}`);
  const last = pts[pts.length - 1].split(',');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="2.8" fill="var(--accent)"/></svg>`;
}
