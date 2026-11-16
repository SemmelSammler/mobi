// Trainingsplan: Einheiten ordnen und bearbeiten, Plan wechseln, Wochenstruktur mit Studio und Laufen.
import { $, $$, esc, ICON, emit, openSheet, closeSheet, thumb, toast, WD, WEEK_ORDER, dragHandle, makeSortable, arrayMove } from '../ui.js';
import { byId, muscleNames } from '../data/index.js';
import { PROGRAMS, GOALS, programById } from '../data/programs.js';
import { getSettings, getPlan, savePlan, dayPlan, setDayPlan, RUN_TYPES } from '../store.js';
import { ensurePlan, planFromTemplate, nextDayIndex, dayDuration, slotFor, plannedSets, VOLUME_GROUPS, GROUPS, getActive } from '../training.js';
import { beginWorkout, openWorkout } from './workout.js';
import { openExercise, pickExercise, openReplace } from './uebungen.js';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function volumeBars(sets, { max = 25, target = [10, 20] } = {}) {
  return `<div class="vol">${VOLUME_GROUPS.map((g) => {
    const n = sets[g] || 0;
    const cls = n === 0 ? 'low' : n < target[0] ? '' : n <= target[1] + 4 ? 'ok' : 'high';
    return `<span>${GROUPS[g]}</span><span class="track"><i class="zone" style="left:${(target[0] / max) * 100}%;width:${((target[1] - target[0]) / max) * 100}%"></i><i class="fill ${cls}" style="width:${Math.min(100, (n / max) * 100)}%"></i></span><span class="n">${String(Math.round(n * 2) / 2).replace('.', ',')}</span>`;
  }).join('')}</div>`;
}

// Eine Zeile der Wochenstruktur: Studio (Rotation oder feste Einheit) und Ausdauer am selben Tag möglich.
function weekRow(s, plan, d) {
  const p = dayPlan(s, d);
  const gymVal = !p.gym ? '' : p.unit && plan.days.some((x) => x.id === p.unit) ? p.unit : 'rot';
  const cardio = p.run || p.other;
  return `<div class="wk-row">
    <span class="pd">${WD[d]}</span>
    <select class="sel" data-wd="${d}" data-f="gym" aria-label="Studio am ${WD[d]}">
      <option value="" ${gymVal === '' ? 'selected' : ''}>–</option>
      <option value="rot" ${gymVal === 'rot' ? 'selected' : ''}>Rotation</option>
      ${plan.days.map((x) => `<option value="${x.id}" ${gymVal === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}
    </select>
    <select class="sel" data-wd="${d}" data-f="cardio" aria-label="Ausdauer am ${WD[d]}">
      <option value="" ${cardio ? '' : 'selected'}>–</option>
      ${Object.entries(RUN_TYPES).map(([k, t]) => `<option value="${k}" ${p.run === k ? 'selected' : ''}>${t.short}</option>`).join('')}
      <option value="rad" ${p.other === 'rad' ? 'selected' : ''}>Rad</option>
      <option value="schwimmen" ${p.other === 'schwimmen' ? 'selected' : ''}>Schwimmen</option>
    </select>
    <input class="input num" data-wd="${d}" data-f="km" inputmode="decimal" placeholder="km" value="${p.run && p.km ? String(p.km).replace('.', ',') : ''}" ${p.run ? '' : 'disabled'} aria-label="Geplante Kilometer am ${WD[d]}">
  </div>`;
}

export function render() {
  const s = getSettings();
  const plan = ensurePlan();
  const idx = nextDayIndex(plan);
  const active = getActive();
  const tpl = programById(plan.templateId);
  const plans = WEEK_ORDER.map((d) => dayPlan(s, d));
  const gymDays = plans.filter((p) => p.gym).length;
  const runDays = plans.filter((p) => p.run).length;
  const km = plans.reduce((sum, p) => sum + (p.run ? Number(p.km) || 0 : 0), 0);
  $('#view-training').innerHTML = `
    <div class="row-between"><div class="stack gap-4"><h1 class="h1">Training</h1><span class="meta">${esc(plan.name)} · ${plan.days.length} Einheiten</span></div>
      <button class="btn small ghost" data-act="switch">Plan wechseln</button></div>
    ${active ? `<div class="hero dark"><span class="eyebrow">Training läuft</span><div class="hero-title">${esc(active.name)}</div><button class="btn light" data-act="resume">${ICON.play} Fortsetzen</button></div>` : ''}
    <div class="stack gap-8">
      <div class="row-between"><span class="eyebrow">Dein Plan</span><span class="meta">Am Griff ziehen zum Sortieren</span></div>
      <div class="list" id="plan-days">${plan.days.map((d, i) => `<div class="row" data-sort style="padding-right:4px;">
        <button class="grow" data-day="${i}" style="display:flex;align-items:center;gap:12px;">
          <span class="tile ${i === idx ? 'accent' : ''}" style="font-weight:700;">${i + 1}</span>
          <span class="grow"><span class="t">${esc(d.name)}</span><span class="s">${i === idx ? 'Als Nächstes · ' : ''}${d.slots.length} Übungen · ca. ${dayDuration(d)} min</span></span>
        </button>
        ${dragHandle(d.name)}
      </div>`).join('')}</div>
      <div class="dual"><button class="btn ghost" data-act="addday">${ICON.plus} Einheit</button><button class="btn ghost" data-act="free">Freies Training</button></div>
    </div>
    <div class="card stack gap-12">
      <div class="stack gap-4"><span class="h3">Wochenstruktur</span><span class="meta">${gymDays}× Studio · ${runDays}× Laufen${km ? ` · ${String(Math.round(km * 10) / 10).replace('.', ',')} km geplant` : ''}. Studio und Lauf gehen auch am selben Tag. „Rotation“ nimmt die nächste Einheit aus der Reihenfolge oben — oder du legst eine Einheit fest auf einen Tag.</span></div>
      <div class="wk-head"><span></span><span>Studio</span><span>Ausdauer</span><span>km</span></div>
      ${WEEK_ORDER.map((d) => weekRow(s, plan, d)).join('')}
      ${tpl?.run ? `<div class="note"><b>Laufen & Kraft:</b> ${esc(tpl.run)}</div>` : ''}
    </div>
    <div class="card stack gap-12">
      <div class="stack gap-4"><span class="h3">Wochenvolumen laut Plan</span><span class="meta">Harte Sätze pro Muskelgruppe, wenn du jede Einheit einmal pro Woche machst. Grüner Bereich: 10–20 Sätze.</span></div>
      ${volumeBars(plannedSets(plan))}
    </div>`;
  const root = $('#view-training');
  makeSortable($('#plan-days'), moveDay);
  root.onclick = (e) => {
    const day = e.target.closest('[data-day]');
    if (day) return openDay(Number(day.dataset.day));
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'resume') openWorkout();
    else if (b.dataset.act === 'switch') openPlanPicker();
    else if (b.dataset.act === 'free') startGuard(() => beginWorkout(null, 0));
    else if (b.dataset.act === 'addday') {
      const p = getPlan();
      p.days.push({ id: uid(), name: `Einheit ${p.days.length + 1}`, focus: '', slots: [] });
      savePlan(p); emit('change'); openDay(p.days.length - 1);
    }
  };
  root.onchange = (e) => {
    const el = e.target.closest('[data-wd]');
    if (!el) return;
    const d = Number(el.dataset.wd), v = el.value;
    if (el.dataset.f === 'gym') setDayPlan(d, { gym: v !== '', unit: v === 'rot' ? '' : v });
    else if (el.dataset.f === 'cardio') setDayPlan(d, RUN_TYPES[v] ? { run: v, other: '' } : { run: '', other: v, km: '' });
    else if (el.dataset.f === 'km') { const n = parseFloat(v.replace(',', '.')); setDayPlan(d, { km: Number.isFinite(n) && n > 0 ? n : '' }); }
    emit('change');
  };
}

// Einheit im Plan verschieben. „Als Nächstes“ bleibt dieselbe Einheit.
function moveDay(from, to) {
  const p = getPlan();
  if (to < 0 || to >= p.days.length) return;
  const nextId = p.days[nextDayIndex(p)]?.id;
  arrayMove(p.days, from, to);
  p.next = Math.max(0, p.days.findIndex((x) => x.id === nextId));
  savePlan(p); emit('change');
}

// Nur eine Einheit gleichzeitig: läuft schon eine, diese fortsetzen.
function startGuard(fn) {
  if (getActive()) { toast('Es läuft bereits ein Training'); openWorkout(); return; }
  fn();
}

function openDay(i) {
  const plan = getPlan();
  const day = plan.days[i];
  if (!day) return;
  const save = () => { savePlan(plan); emit('change'); };
  const isNext = nextDayIndex(plan) === i;
  const slotRow = (sl, k) => {
    const ex = byId(sl.ex);
    return `<div class="card flat stack gap-8" data-sort style="padding:12px;">
      <div class="w-ex"><button data-info="${ex.id}" aria-label="Details">${thumb(ex.id)}</button>
        <button class="grow stack" data-info="${ex.id}"><span class="h3">${esc(ex.name)}</span><span class="meta">${esc(muscleNames(ex.primary).join(', '))}</span></button>${dragHandle(ex.name)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;">
        <label class="field"><span class="label">Sätze</span><input class="input num" inputmode="numeric" data-k="${k}" data-f="sets" value="${sl.sets}"></label>
        <label class="field"><span class="label">${ex.unit === 'sek' ? 'Sek.' : 'Wdh.'} von</span><input class="input num" inputmode="numeric" data-k="${k}" data-f="min" value="${sl.reps[0]}"></label>
        <label class="field"><span class="label">bis</span><input class="input num" inputmode="numeric" data-k="${k}" data-f="max" value="${sl.reps[1]}"></label>
      </div>
      <div class="w-actions">
        <button data-rep="${k}">${ICON.swap} Ersetzen</button>
        <button data-up="${k}" ${k === 0 ? 'disabled style="opacity:.35"' : ''}>${ICON.up} Hoch</button>
        <button data-dn="${k}" ${k === day.slots.length - 1 ? 'disabled style="opacity:.35"' : ''}>Runter</button>
        <button data-del="${k}" style="color:#C0392B;">${ICON.trash}</button>
      </div></div>`;
  };
  openSheet(`
    <div class="stack gap-4" style="padding-right:44px;"><span class="eyebrow">Einheit ${i + 1} von ${plan.days.length}${isNext ? ' · als Nächstes dran' : ''}</span>
      <input class="input" id="d-name" value="${esc(day.name)}" maxlength="30" aria-label="Name der Einheit" style="font-size:19px;font-weight:700;"></div>
    <span class="meta">${day.slots.length} Übungen · ca. ${dayDuration(day)} min</span>
    <button class="btn" id="d-start" ${day.slots.length ? '' : 'disabled'}>${ICON.play} Dieses Training starten</button>
    ${isNext ? '' : '<button class="btn ghost" id="d-next">Als nächste Einheit festlegen</button>'}
    <div class="dual"><button class="btn line" id="d-up" ${i === 0 ? 'disabled' : ''}>${ICON.up} Einheit früher</button><button class="btn line" id="d-down" ${i === plan.days.length - 1 ? 'disabled' : ''}>Einheit später</button></div>
    <div class="list" id="d-slots">${day.slots.map(slotRow).join('') || '<div class="empty">Noch keine Übung in dieser Einheit.</div>'}</div>
    <button class="btn ghost" id="d-add">${ICON.plus} Übung hinzufügen</button>
    ${plan.days.length > 1 ? '<button class="btn danger" id="d-remove">Einheit löschen</button>' : ''}
  `, (sh) => {
    $('#d-name', sh).onchange = (e) => { day.name = e.target.value.trim() || `Einheit ${i + 1}`; save(); };
    $('#d-start', sh).onclick = () => { closeSheet(); startGuard(() => beginWorkout(getPlan(), i)); };
    $('#d-up', sh).onclick = () => { moveDay(i, i - 1); openDay(i - 1); };
    $('#d-down', sh).onclick = () => { moveDay(i, i + 1); openDay(i + 1); };
    const nx = $('#d-next', sh);
    if (nx) nx.onclick = () => { plan.next = i; save(); toast(`„${day.name}“ ist als Nächstes dran`); openDay(i); };
    $('#d-add', sh).onclick = () => pickExercise({ title: 'Übung hinzufügen', onPick: (id) => { day.slots.push(slotFor(id)); save(); openDay(i); } });
    const rm = $('#d-remove', sh);
    if (rm) rm.onclick = () => { plan.days.splice(i, 1); plan.next = 0; save(); closeSheet(); toast('Einheit gelöscht'); };
    $('#d-slots', sh).onchange = (e) => {
      const inp = e.target.closest('input[data-f]');
      if (!inp) return;
      const sl = day.slots[inp.dataset.k];
      const v = Math.max(1, Math.min(inp.dataset.f === 'sets' ? 10 : 600, parseInt(inp.value, 10) || 1));
      if (inp.dataset.f === 'sets') sl.sets = v;
      else if (inp.dataset.f === 'min') sl.reps = [v, Math.max(v, sl.reps[1])];
      else sl.reps = [Math.min(sl.reps[0], v), v];
      save(); openDay(i);
    };
    makeSortable($('#d-slots', sh), (from, to) => { arrayMove(day.slots, from, to); save(); openDay(i); });
    $('#d-slots', sh).onclick = (e) => {
      const t = e.target;
      const info = t.closest('[data-info]');
      if (info) return openExercise(info.dataset.info, { onClose: () => setTimeout(() => { if ($('#sheet-backdrop').classList.contains('hidden')) openDay(i); }, 0) });
      const swap = (a, b) => { [day.slots[a], day.slots[b]] = [day.slots[b], day.slots[a]]; save(); openDay(i); };
      const up = t.closest('[data-up]');
      if (up) { const k = Number(up.dataset.up); if (k > 0) swap(k - 1, k); return; }
      const dn = t.closest('[data-dn]');
      if (dn) { const k = Number(dn.dataset.dn); if (k < day.slots.length - 1) swap(k, k + 1); return; }
      const del = t.closest('[data-del]');
      if (del) { day.slots.splice(Number(del.dataset.del), 1); save(); return openDay(i); }
      const rep = t.closest('[data-rep]');
      if (rep) {
        const k = Number(rep.dataset.rep);
        openReplace(day.slots[k].ex, { onPick: (id) => { day.slots[k] = { ...slotFor(id), sets: day.slots[k].sets }; save(); toast('Übung ersetzt'); openDay(i); }, onCancel: () => openDay(i) });
      }
    };
  });
}

export function openPlanPicker() {
  const cur = getPlan();
  openSheet(`
    <h2 class="h2">Plan wählen</h2>
    <p class="body">Jede Vorlage ist ein Startpunkt — Übungen, Sätze und Wiederholungen kannst du danach frei anpassen.</p>
    <div class="list">${PROGRAMS.map((p) => `<button class="card flat stack gap-8" data-tpl="${p.id}" style="text-align:left;${cur?.templateId === p.id ? 'border-color:var(--accent);' : ''}">
      <div class="row-between"><span class="h3">${esc(p.name)}</span>${cur?.templateId === p.id ? '<span class="badge">Aktiv</span>' : ''}</div>
      <div class="chips"><span class="chip accent">${GOALS[p.goal].name}</span><span class="chip">${p.perWeek}× pro Woche</span><span class="chip">${p.days.length} Einheiten</span></div>
      <span class="meta" style="line-height:1.45;">${esc(p.desc)}</span></button>`).join('')}</div>
  `, (sh) => {
    for (const b of $$('[data-tpl]', sh)) b.onclick = () => {
      const tpl = programById(b.dataset.tpl);
      openSheet(`
        <h2 class="h2" style="padding-right:44px;">${esc(tpl.name)}</h2>
        <div class="note">${esc(GOALS[tpl.goal].hint)}</div>
        ${tpl.days.map((d) => `<div class="stack gap-4"><span class="h3">${esc(d.name)}</span><span class="meta" style="line-height:1.5;">${d.slots.map((x) => `${esc(byId(x[0]).name)} ${x[1]}×${x[2]}–${x[3]}`).join(' · ')}</span></div>`).join('')}
        <p class="meta" style="margin:0;">Dein bisheriger Plan wird ersetzt. Dein Trainingsverlauf bleibt erhalten.</p>
        <button class="btn" id="tpl-use">Diesen Plan verwenden</button>`, (s2) => {
        $('#tpl-use', s2).onclick = () => { savePlan(planFromTemplate(tpl.id)); closeSheet(); emit('change'); toast(`Plan „${tpl.name}“ aktiv`); };
      });
    };
  });
}
