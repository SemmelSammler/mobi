// Erzeugt die Tagesroutine:
// - Fester Kern täglich (core-Übungen = die größten Limiter, immer dabei)
// - Rest rotiert ohne Zurücklegen durch die Block-Decks (siehe store.js)
// - Zeit-Skalierung: abends bis 2,0 (Haltezeit ist die Zielgröße),
//   morgens max. 1,25 — mehr Zeit bedeutet dort mehr Übungen, nicht längere.
import { EXERCISES, BLOCKS, PLAN, ABLOCKS, ABEND_PLAN, KBLOCKS, KRAFT_PLAN, ZBLOCKS, ZD_PLAN, FOCUS_TARGETS } from './data.js';
import { deckPeek, getBlacklist, getSettings } from './store.js';

const KIND_CFG = {
  morgen: { blocks: BLOCKS, plans: PLAN, cap: 1.25, fallback: 10, focusBlocks: [2, 3] },
  abend: { blocks: ABLOCKS, plans: ABEND_PLAN, cap: 2, fallback: 15, focusBlocks: [7, 8] },
  kraft: { blocks: KBLOCKS, plans: KRAFT_PLAN, cap: 1.6, fallback: 20, focusBlocks: [11] },
  zwischendurch: { blocks: ZBLOCKS, plans: ZD_PLAN, cap: 1.3, fallback: 3, focusBlocks: [13] }
};

// Fokustag: liefert das Ziel (aus den Einstellungen) für den Wochentag des Datums.
export function focusForDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  const s = getSettings();
  for (const f of [s.focus1, s.focus2]) {
    if (f && f.day === weekday && FOCUS_TARGETS[f.target]) {
      return { target: f.target, ...FOCUS_TARGETS[f.target] };
    }
  }
  return null;
}

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const PREP_SECS = 5;

export function buildRoutine(dateKey, minutes, kind = 'morgen') {
  const cfg = KIND_CFG[kind] || KIND_CFG.morgen;
  minutes = Number(minutes) || cfg.fallback;
  const plan = cfg.plans[minutes] || cfg.plans[cfg.fallback];
  const blacklist = getBlacklist();
  const picked = [];
  cfg.blocks.forEach((block, i) => {
    const pool = EXERCISES.filter((e) => e.block === block.id && !blacklist.includes(e.id));
    const chosen = pool.filter((e) => e.core).slice(0, plan.counts[i]);
    const need = plan.counts[i] - chosen.length;
    if (need > 0) {
      const restIds = pool.filter((e) => !e.core).map((e) => e.id);
      for (const id of deckPeek(block.id, restIds, need)) {
        const ex = pool.find((e) => e.id === id);
        if (ex) chosen.push(ex);
      }
    }
    picked.push(...chosen);
  });
  // Fokustag (nur Abendroutine): passende Übungen bekommen fast doppelte Basiszeit.
  const focusDay = kind === 'abend' ? focusForDate(dateKey) : null;
  if (focusDay && !picked.some((ex) => ex.areas.some((a) => focusDay.areas.includes(a)))) {
    // Kein Treffer im Los? Dann eine passende Übung garantiert dazunehmen.
    const extra = EXERCISES.find((e) =>
      e.block >= 6 && e.block <= 10 && !blacklist.includes(e.id) &&
      !picked.includes(e) && e.areas.some((a) => focusDay.areas.includes(a))
    );
    if (extra) picked.push(extra);
  }
  const baseSecs = picked.map((ex) => {
    const boosted = focusDay && ex.areas.some((a) => focusDay.areas.includes(a));
    return { ex, base: boosted ? ex.secs * 1.8 : ex.secs, boosted };
  });
  const baseSum = baseSecs.reduce((sum, it) => sum + it.base, 0) || 1;
  const target = minutes * 60 - picked.length * PREP_SECS;
  const factor = Math.min(cfg.cap, Math.max(0.8, target / baseSum));
  const items = baseSecs.map(({ ex, base, boosted }) => ({
    ex,
    boosted,
    secs: Math.max(20, Math.round((base * factor) / 5) * 5)
  }));
  const totalSec = items.reduce((sum, it) => sum + it.secs + PREP_SECS, 0);
  const focusAreas = [];
  for (const it of items) {
    if (cfg.focusBlocks.includes(it.ex.block)) {
      for (const a of it.ex.areas) if (!focusAreas.includes(a)) focusAreas.push(a);
    }
  }
  return {
    dateKey,
    minutes,
    kind,
    items,
    totalSec,
    focusDay,
    focus: focusDay ? focusDay.label : (focusAreas.slice(0, 2).join(' + ') || 'Ganzkörper')
  };
}

export function fmtClock(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
