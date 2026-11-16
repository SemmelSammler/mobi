// Übungsbibliothek, Detailansicht mit Animation und Körperkarte, Übungsauswahl.
import { $, $$, esc, ICON, openSheet, closeSheet, thumb, hydrateThumbs, emit, sparkline, fmtDay } from '../ui.js';
import { EXERCISES, MOBILITY, GYM, SECTIONS, EQUIP, LEVELS, byId, muscleNames } from '../data/index.js';
import { GROUPS } from '../data/muscles.js';
import { animateFigure } from '../figure.js';
import { muscleMap } from '../musclemap.js';
import { getBlacklist, toggleBlacklist } from '../store.js';
import { exerciseHistory, alternatives, fmtKg } from '../training.js';

const state = { tab: 'alle', group: '', q: '' };
const GYM_GROUPS = ['brust', 'ruecken', 'schultern', 'bizeps', 'trizeps', 'quadrizeps', 'beinbeuger', 'gesaess', 'waden', 'core'];

const subLine = (ex) => (ex.kind === 'gym'
  ? `${muscleNames(ex.primary).join(', ')} · ${EQUIP[ex.equip]}`
  : `${ex.dose}${ex.equip ? ' · ' + ex.equip : ''}`);

export function exRow(ex, extra = '') {
  return `<button class="row" data-ex="${ex.id}">${thumb(ex.id)}<span class="grow"><span class="t">${esc(ex.name)}</span><span class="s">${esc(subLine(ex))}</span></span>${extra}${ICON.chev}</button>`;
}

function matches(ex, q) {
  if (!q) return true;
  const hay = `${ex.name} ${ex.aka || ''} ${muscleNames(ex.primary).join(' ')} ${(ex.areas || []).join(' ')} ${ex.tools || ''} ${ex.equip || ''}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

function listHtml() {
  const bl = getBlacklist();
  const tag = (ex) => (bl.includes(ex.id) ? '<span class="badge plain">Ausgeblendet</span>' : ex.core ? '<span class="badge">Täglich</span>' : '');
  let html = '';
  const q = state.q.trim();
  if (state.tab !== 'kraft') {
    for (const [key, sec] of Object.entries(SECTIONS)) {
      const items = MOBILITY.filter((e) => e.section === key && matches(e, q));
      if (!items.length) continue;
      html += `<div class="eyebrow" style="margin-top:8px;">${sec.label} · ${sec.tag}</div>`;
      for (const block of sec.blocks) {
        const rows = items.filter((e) => e.block === block.id);
        if (!rows.length) continue;
        html += `<div class="group-title">${esc(block.name)}</div><div class="list">${rows.map((e) => exRow(e, tag(e)).replace('class="row"', `class="row${bl.includes(e.id) ? ' dim' : ''}"`)).join('')}</div>`;
      }
    }
  }
  if (state.tab !== 'mobility') {
    const groups = state.group ? [state.group] : Object.keys(GROUPS);
    let any = false, part = '';
    for (const g of groups) {
      const rows = GYM.filter((e) => e.group === g && matches(e, q));
      if (!rows.length) continue;
      any = true;
      part += `<div class="group-title">${GROUPS[g]}</div><div class="list">${rows.map((e) => exRow(e)).join('')}</div>`;
    }
    if (any) html += `<div class="eyebrow" style="margin-top:8px;">Krafttraining · Studio</div>${part}`;
  }
  return html || '<div class="empty">Keine Übung gefunden.<br>Versuch es mit einem Muskel oder Gerät.</div>';
}

export function render() {
  const root = $('#view-uebungen');
  root.innerHTML = `
    <div class="stack gap-4"><h1 class="h1">Übungen</h1><span class="meta">${EXERCISES.length} Übungen · ${GYM.length} Kraft · ${MOBILITY.length} Mobility</span></div>
    <div class="search">${ICON.search}<input class="input" id="ex-q" type="search" placeholder="Übung, Muskel oder Gerät suchen" value="${esc(state.q)}" autocomplete="off" enterkeyhint="search"></div>
    <div class="seg" id="ex-tab">${[['alle', 'Alle'], ['kraft', 'Kraft'], ['mobility', 'Mobility']].map(([k, l]) => `<button data-tab="${k}" class="${state.tab === k ? 'active' : ''}">${l}</button>`).join('')}</div>
    <div class="chip-scroll ${state.tab === 'mobility' ? 'hidden' : ''}" id="ex-groups">
      <button class="chip ${state.group ? '' : 'on'}" data-group="">Alle Muskeln</button>
      ${GYM_GROUPS.map((g) => `<button class="chip ${state.group === g ? 'on' : ''}" data-group="${g}">${GROUPS[g]}</button>`).join('')}
    </div>
    <div id="ex-list" class="stack gap-8">${listHtml()}</div>`;
  hydrateThumbs(root);
  const refreshList = () => { $('#ex-list').innerHTML = listHtml(); hydrateThumbs($('#ex-list')); };
  $('#ex-q').addEventListener('input', (e) => { state.q = e.target.value; refreshList(); });
  $('#ex-tab').onclick = (e) => { const b = e.target.closest('[data-tab]'); if (b) { state.tab = b.dataset.tab; render(); } };
  $('#ex-groups').onclick = (e) => {
    const b = e.target.closest('[data-group]');
    if (!b) return;
    state.group = b.dataset.group;
    if (state.group && state.tab === 'alle') state.tab = 'kraft';
    render();
  };
  $('#ex-list').onclick = (e) => { const r = e.target.closest('[data-ex]'); if (r) openExercise(r.dataset.ex); };
}

// ---------- Detailansicht ----------
const SAFETY_MOB = ['Dehnzug maximal 6–7 von 10 — nie in scharfen Schmerz', 'Kribbeln, Taubheit oder ausstrahlender Schmerz: sofort abbrechen', 'Gelenkschmerz statt Muskeldehngefühl: abbrechen', 'Bei bestehenden Beschwerden vorher ärztlich abklären'];
const SAFETY_GYM = ['Zwei leichtere Aufwärmsätze vor dem ersten schweren Satz', 'Technik geht vor Gewicht — sauber bis zur letzten Wiederholung', 'Stechender oder gelenknaher Schmerz: Satz abbrechen', 'Bei schweren Sätzen an freien Gewichten Ablagen oder Trainingspartner nutzen'];

function historyBlock(ex) {
  if (ex.kind !== 'gym') return '';
  const h = exerciseHistory(ex.id);
  if (!h.length) return `<span class="sec-l">Dein Verlauf</span><div class="note">Noch kein Eintrag. Sobald du die Übung im Training loggst, siehst du hier Gewichte und Fortschritt.</div>`;
  const unit = ex.unit === 'sek' ? 'Sek.' : 'Wdh.';
  const weighted = h.some((x) => x.best > 0);
  const best = weighted ? Math.max(...h.map((x) => x.best)) : Math.max(...h.map((x) => x.topReps));
  const rows = h.slice(-4).reverse().map((x) => `<div class="row-between"><span class="meta">${fmtDay(x.date)}</span><span class="num" style="font-size:13.5px;font-weight:600;">${x.sets.map((s) => (s.w ? `${fmtKg(s.w)}×${s.r}` : `${s.r}`)).join(' · ')}</span></div>`).join('');
  return `<span class="sec-l">Dein Verlauf</span>
    <div class="card flat stack gap-12">
      <div class="row-between"><div class="stack"><span class="meta">${weighted ? 'Geschätztes Maximum (1RM)' : `Bestwert (${unit})`}</span><span class="num" style="font-size:22px;font-weight:700;">${weighted ? fmtKg(Math.round(best * 2) / 2) + ' kg' : best}</span></div>${sparkline(h.map((x) => (weighted ? x.best : x.topReps)), 120, 36)}</div>
      <div class="stack gap-8">${rows}</div>
    </div>`;
}

export function openExercise(id, opts = {}) {
  const ex = byId(id);
  if (!ex) return;
  const gym = ex.kind === 'gym';
  const hidden = getBlacklist().includes(ex.id);
  const alts = gym ? alternatives(ex.id, 4) : [];
  const sec = gym ? null : SECTIONS[ex.section];
  const unit = ex.unit === 'sek' ? 'Sek.' : 'Wdh.';
  const chips = gym
    ? [ex.tools, LEVELS[ex.level], ex.compound ? 'Grundübung' : 'Isolationsübung', ex.uni ? 'einseitig' : ''].filter(Boolean)
    : [sec.label, ex.dose, ex.perSide ? 'je Seite' : '', ex.equip || 'ohne Gerät'].filter(Boolean);
  openSheet(`
    <div class="stage" style="margin-top:4px;"><svg id="sheet-fig"></svg>
      ${!gym && ex.core ? '<span class="badge solid stage-tag">Täglicher Kern</span>' : ''}
      <span class="phase-pill" id="sheet-phase"><i></i><span>${esc(ex.phases[0])}</span></span>
    </div>
    <div class="stack gap-4"><h2 class="h2" style="padding-right:44px;">${esc(ex.name)}</h2>${ex.aka ? `<span class="meta">${esc(ex.aka)}</span>` : ''}</div>
    <div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>

    <span class="sec-l">Beanspruchte Muskulatur</span>
    <div class="card flat mm-wrap">${muscleMap(ex.primary, ex.secondary)}
      <div class="legend">
        <div><b><i></i>Zielmuskeln</b>${muscleNames(ex.primary).map(esc).join('<br>') || '—'}</div>
        ${ex.secondary?.length ? `<div><b><i class="s"></i>Helfen mit</b>${muscleNames(ex.secondary).map(esc).join('<br>')}</div>` : ''}
      </div>
    </div>

    ${gym ? `<span class="sec-l">Startposition</span><p class="body">${esc(ex.setup)}</p>` : `<span class="sec-l">Das bringt’s</span><p class="body">${esc(ex.benefit)}</p>`}

    <span class="sec-l">So geht’s</span>
    <ol class="steps">${ex.how.map((h) => `<li><span>${esc(h)}</span></li>`).join('')}</ol>

    <span class="sec-l">Bewegungsablauf</span>
    <div class="phases" id="sheet-phases">
      <div data-ph="0"><b>Phase 1 · ${ex.tempo[0].toFixed(1).replace('.', ',')} s</b>${esc(ex.phases[0])}</div>
      <div data-ph="2"><b>Phase 2 · ${ex.tempo[2].toFixed(1).replace('.', ',')} s</b>${esc(ex.phases[1])}</div>
    </div>

    <span class="sec-l">Häufige Fehler</span>
    <ul class="bullets warn">${ex.mistakes.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>

    <span class="sec-l">${gym ? 'Warum es wirkt' : 'Physiologie'}</span>
    <div class="note">${esc(gym ? ex.why : sec.science)}</div>

    ${gym ? `<span class="sec-l">Dosierung · Muskelaufbau</span>
    <div class="dose"><div><b>${ex.sets}</b><span>Sätze</span></div><div><b>${ex.reps[0]}–${ex.reps[1]}</b><span>${unit}</span></div><div><b>${ex.rest >= 120 ? (ex.rest / 60).toString().replace('.', ',') + ' min' : ex.rest + ' s'}</b><span>Pause</span></div></div>
    <p class="meta" style="margin:0;line-height:1.5;">Wähle ein Gewicht, bei dem am Satzende noch 1–3 saubere Wiederholungen möglich wären. Schaffst du in allen Sätzen die obere Grenze, erhöhe das Gewicht${ex.step ? ` um ${fmtKg(ex.step)} kg` : ''}.</p>` : ''}

    ${historyBlock(ex)}

    ${alts.length ? `<span class="sec-l">Alternativen</span><div class="list">${alts.map((a) => `<button class="row" data-alt="${a.id}">${thumb(a.id)}<span class="grow"><span class="t">${esc(a.name)}</span><span class="s">${esc(EQUIP[a.equip])}</span></span>${ICON.chev}</button>`).join('')}</div>` : ''}

    <span class="sec-l">Sicherheit</span>
    <ul class="bullets">${(gym ? SAFETY_GYM : SAFETY_MOB).map((s) => `<li>${s}</li>`).join('')}</ul>

    <a class="btn line" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' Übung richtige Ausführung')}" target="_blank" rel="noopener">${ICON.video} Video-Anleitung suchen</a>
    ${opts.onPick ? `<button class="btn" id="btn-pick">${esc(opts.pickLabel || 'Übung übernehmen')}</button>` : ''}
    ${!gym && !opts.inPlayer ? `<button class="btn ghost" id="btn-blacklist">${hidden ? 'Übung wieder einblenden' : 'Tut mir nicht gut — ausblenden'}</button>` : ''}
  `, (sheet) => {
    const pill = $('#sheet-phase', sheet);
    const stop = animateFigure($('#sheet-fig', sheet), ex, {
      onPhase(i) {
        if (i === 0 || i === 2) {
          pill.lastElementChild.textContent = ex.phases[i === 0 ? 0 : 1];
          pill.classList.toggle('back', i === 2);
          for (const d of $$('[data-ph]', sheet)) d.classList.toggle('on', Number(d.dataset.ph) === i);
        }
      }
    });
    for (const b of $$('[data-alt]', sheet)) b.onclick = () => openExercise(b.dataset.alt, opts);
    const bl = $('#btn-blacklist', sheet);
    if (bl) bl.onclick = () => { toggleBlacklist(ex.id); closeSheet(); emit('change'); };
    const pick = $('#btn-pick', sheet);
    if (pick) pick.onclick = () => { closeSheet(); opts.onPick(ex.id); };
    return () => { stop(); if (opts.onClose) opts.onClose(); };
  });
}

// ---------- Übung ersetzen: ähnliche Vorschläge oder freie Suche ----------
export function openReplace(exId, { onPick, onCancel } = {}) {
  const ex = byId(exId);
  const alts = alternatives(exId, 6);
  let picked = false;
  const choose = (id) => { picked = true; closeSheet(); onPick(id); };
  openSheet(`
    <div class="stack gap-4" style="padding-right:44px;"><span class="eyebrow">Ersetzen</span><h2 class="h2">${esc(ex.name)}</h2></div>
    <span class="sec-l">Ähnliche Übungen · gleicher Zielmuskel</span>
    <div class="list">${alts.map((a) => `<div class="row" style="padding-right:8px;"><button class="grow" data-rep="${a.id}" style="display:flex;align-items:center;gap:12px;">${thumb(a.id)}<span class="grow"><span class="t">${esc(a.name)}</span><span class="s">${esc(muscleNames(a.primary).join(', '))} · ${esc(EQUIP[a.equip])}</span></span></button><button class="icon-btn clear" data-info="${a.id}" aria-label="Details">${ICON.info}</button></div>`).join('') || '<div class="empty">Keine direkten Alternativen.</div>'}</div>
    <button class="btn ghost" id="rp-free">${ICON.search} Frei aus allen Übungen wählen</button>`, (sh) => {
    for (const b of $$('[data-rep]', sh)) b.onclick = () => choose(b.dataset.rep);
    for (const b of $$('[data-info]', sh)) b.onclick = () => { picked = true; openExercise(b.dataset.info, { onPick, pickLabel: 'Diese Übung wählen' }); };
    $('#rp-free', sh).onclick = () => { picked = true; pickExercise({ title: 'Ersetzen durch', preferGroup: ex.group, onPick }); };
    return () => { if (!picked && onCancel) setTimeout(() => { if ($('#sheet-backdrop').classList.contains('hidden')) onCancel(); }, 0); };
  });
}

// ---------- Übungsauswahl (für Plan und Training) ----------
export function pickExercise({ title = 'Übung wählen', preferGroup = '', onPick }) {
  const st = { q: '', group: preferGroup };
  const list = () => {
    const rows = GYM.filter((e) => (!st.group || e.group === st.group) && matches(e, st.q.trim()));
    return rows.length ? rows.map((e) => `<div class="row" style="padding-right:8px;"><button class="grow" data-pick="${e.id}" style="display:flex;align-items:center;gap:12px;">${thumb(e.id)}<span class="grow"><span class="t">${esc(e.name)}</span><span class="s">${esc(subLine(e))}</span></span></button><button class="icon-btn clear" data-info="${e.id}" aria-label="Details">${ICON.info}</button></div>`).join('') : '<div class="empty">Keine Übung gefunden.</div>';
  };
  const open = () => openSheet(`
    <h2 class="h2">${esc(title)}</h2>
    <div class="search">${ICON.search}<input class="input" id="pk-q" type="search" placeholder="Suchen" autocomplete="off" value="${esc(st.q)}"></div>
    <div class="chip-scroll" id="pk-groups"><button class="chip ${st.group ? '' : 'on'}" data-group="">Alle</button>${GYM_GROUPS.map((g) => `<button class="chip ${st.group === g ? 'on' : ''}" data-group="${g}">${GROUPS[g]}</button>`).join('')}</div>
    <div class="list" id="pk-list">${list()}</div>
  `, (sheet) => {
    const refresh = () => { $('#pk-list', sheet).innerHTML = list(); hydrateThumbs(sheet); };
    $('#pk-q', sheet).addEventListener('input', (e) => { st.q = e.target.value; refresh(); });
    $('#pk-groups', sheet).onclick = (e) => {
      const b = e.target.closest('[data-group]');
      if (!b) return;
      st.group = b.dataset.group;
      for (const c of $$('[data-group]', sheet)) c.classList.toggle('on', c.dataset.group === st.group);
      refresh();
    };
    $('#pk-list', sheet).onclick = (e) => {
      const info = e.target.closest('[data-info]');
      if (info) return openExercise(info.dataset.info, { onPick: (id) => onPick(id), pickLabel: 'Diese Übung wählen' });
      const p = e.target.closest('[data-pick]');
      if (p) { closeSheet(); onPick(p.dataset.pick); }
    };
  });
  open();
}
